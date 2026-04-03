import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAlert } from '../components/ui/AlertProvider';
import { useAuth } from '../auth/AuthProvider';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 4;

const defaultFormValues = {
    name: '', age: '', breed: '', about: '', gender: '', price: '',
    neutered: false, vaccinated: false, size: 'medium', inStock: true,
    isFeatured: false, stock: 1,
};

const defaultDiscount = {
    type: 'percentage',
    value: 0,
    startDate: '',
    endDate: '',
    isActive: false,
};

// ─── API ──────────────────────────────────────────────────────────────────────

const fetchAllCats = async () => {
    const response = await axiosInstance.get('/cats');
    const catsData = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

    return catsData.map(cat => {
        const hasDiscount = cat.discount?.isActive && cat.discount.value > 0;
        const discountedPrice = hasDiscount
            ? cat.discount.type === 'percentage'
                ? cat.price * (1 - cat.discount.value / 100)
                : Math.max(0, cat.price - cat.discount.value)
            : cat.price;
        const discountPercentage = hasDiscount
            ? cat.discount.type === 'percentage'
                ? cat.discount.value
                : (cat.discount.value / cat.price) * 100
            : 0;
        return {
            ...cat,
            discountedPrice,
            discountPercentage,
            isDiscountActive: hasDiscount,
            currentPrice: hasDiscount ? discountedPrice : cat.price,
        };
    });
};

const fetchPetDetail = async (title_id) => {
    const response = await axiosInstance.get(`/cats/${title_id}`);
    return response.data.data || response.data;
};

const fetchRelatedCats = async (currentCatId, breed, category) => {
    const response = await axiosInstance.get('/cats', {
        params: { 
            breed: breed || '',
            category: category || '',
            limit: 4, 
            excludeId: currentCatId 
        }
    });
    const catsData = response.data.data || response.data || [];
    return Array.isArray(catsData) ? catsData : [];
};

const fetchReviews = async (catId) => {
    const response = await axiosInstance.get(`/cats/${catId}/reviews`);
    return response.data.data || response.data || [];
};

const submitReview = async ({ catId, reviewData }) => {
    const response = await axiosInstance.post(`/cats/${catId}/reviews`, reviewData);
    return response.data;
};

// ─── Main Hook ────────────────────────────────────────────────────────────────

export const useCatsManagement = () => {
    const queryClient = useQueryClient();
    const { addAlert } = useAlert();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // ── UI State ───────────────────────────────────────────────────────────────
    const [openModal, setOpenModal] = useState(false);
    const [selectedCat, setSelectedCat] = useState(null);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
    const [modalTab, setModalTab] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [catToDelete, setCatToDelete] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // ── Image State ────────────────────────────────────────────────────────────
    const [featuredImageFile, setFeaturedImageFile] = useState(null);
    const [featuredPreview, setFeaturedPreview] = useState(null);
    const [galleryItems, setGalleryItems] = useState([]);

    // ── Content State ──────────────────────────────────────────────────────────
    const [features, setFeatures] = useState('');
    const [editFormDirty, setEditFormDirty] = useState(false);
    const [discount, setDiscount] = useState(defaultDiscount);
    const [productOptions, setProductOptions] = useState([]);

    // ── Inline Stock Edit ──────────────────────────────────────────────────────
    const [editingStockId, setEditingStockId] = useState(null);
    const [stockInputValue, setStockInputValue] = useState('');

    const markDirty = useCallback(() => {
        if (modalMode === 'edit') setEditFormDirty(true);
    }, [modalMode]);

    // ── Form ───────────────────────────────────────────────────────────────────
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isValid, isDirty },
    } = useForm({ mode: 'onChange', defaultValues: defaultFormValues });

    const priceValue = watch('price');

    const calculateDiscountedPrice = useMemo(() => {
        if (!discount.isActive || discount.value <= 0 || !priceValue) return priceValue;
        const price = parseFloat(priceValue);
        return discount.type === 'percentage'
            ? price * (1 - discount.value / 100)
            : Math.max(0, price - discount.value);
    }, [priceValue, discount]);

    const discountPercentage = useMemo(() => {
        if (!discount.isActive || discount.value <= 0 || !priceValue) return 0;
        const price = parseFloat(priceValue);
        return discount.type === 'percentage'
            ? discount.value
            : (discount.value / price) * 100;
    }, [priceValue, discount]);

    // ── Query ──────────────────────────────────────────────────────────────────
    const { data: cats = [], isLoading: catsLoading } = useQuery({
        queryKey: ['cats'],
        queryFn: fetchAllCats,
    });

    // ── Statistics ─────────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const totalCats = cats.length;
        const inStockCount = cats.filter(c => c.inStock).length;
        const outOfStockCount = cats.filter(c => !c.inStock).length;
        const featuredCount = cats.filter(c => c.isFeatured).length;
        const femaleCount = cats.filter(c => c.gender === 'female').length;
        const maleCount = cats.filter(c => c.gender === 'male').length;
        const neuteredCount = cats.filter(c => c.neutered).length;
        const vaccinatedCount = cats.filter(c => c.vaccinated).length;
        const avgPrice = totalCats > 0
            ? cats.reduce((sum, c) => sum + (parseFloat(c.price) || 0), 0) / totalCats
            : 0;
        const maxPrice = totalCats > 0 ? Math.max(...cats.map(c => parseFloat(c.price) || 0)) : 0;
        const minPrice = totalCats > 0
            ? Math.min(...cats.filter(c => c.price).map(c => parseFloat(c.price)))
            : 0;
        const totalReviews = cats.reduce((sum, c) => sum + (c.reviews?.length || 0), 0);
        const catsWithReviews = cats.filter(c => (c.reviews?.length || 0) > 0).length;
        const avgRating = catsWithReviews > 0
            ? (cats.reduce(
                (sum, c) => sum + (c.reviews?.reduce((rsum, r) => rsum + r.rating, 0) || 0),
                0
            ) / totalReviews)
            : 0;
        const totalGalleryImages = cats.reduce((sum, c) => sum + (c.gallery?.length || 0), 0);
        const uniqueBreeds = new Set(cats.filter(c => c.breed).map(c => c.breed)).size;
        const approvedReviews = cats.reduce(
            (sum, c) => sum + ((c.reviews || []).filter(r => r.approved).length),
            0
        );
        const pendingReviews = totalReviews - approvedReviews;
        const totalStock = cats.reduce((sum, c) => sum + (parseInt(c.stock) || 0), 0);
        const catsWithDiscount = cats.filter(
            c => c.discount?.isActive && c.discount.value > 0
        ).length;

        return {
            totalCats, inStockCount, outOfStockCount, featuredCount,
            femaleCount, maleCount, neuteredCount, vaccinatedCount,
            avgPrice, maxPrice, minPrice, totalReviews, catsWithReviews,
            approvedReviews, pendingReviews,
            avgRating: avgRating.toFixed(1),
            totalGalleryImages, uniqueBreeds, totalStock,
            stockPercentage: totalCats > 0
                ? ((inStockCount / totalCats) * 100).toFixed(1)
                : 0,
            catsWithDiscount,
        };
    }, [cats]);

    // ── Sync selectedCat with fresh query data ─────────────────────────────────
    const syncSelectedCat = useCallback(() => {
        if (selectedCat && openModal && modalMode !== 'create') {
            const updatedCat = cats.find(cat => cat._id === selectedCat._id);
            if (updatedCat) setSelectedCat(updatedCat);
        }
    }, [cats, selectedCat, openModal, modalMode]);

    // Call this in a useEffect in the component
    const paginatedCats = cats.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = useCallback((_, newPage) => setPage(newPage), []);
    const handleChangeRowsPerPage = useCallback((e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    }, []);

    // ── Dropzones ──────────────────────────────────────────────────────────────
    const featuredDropzone = useDropzone({
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
        maxFiles: 1,
        maxSize: MAX_FILE_SIZE,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                if (featuredPreview?.startsWith('blob:')) URL.revokeObjectURL(featuredPreview);
                setFeaturedImageFile(acceptedFiles[0]);
                setFeaturedPreview(URL.createObjectURL(acceptedFiles[0]));
                markDirty();
            }
        },
        onDropRejected: (rejectedFiles) => {
            const err = rejectedFiles[0].errors[0];
            addAlert('error', err.code === 'file-too-large'
                ? 'File is too large (max 5MB)'
                : 'Invalid file type.');
        },
    });

    const galleryDropzone = useDropzone({
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
        maxSize: MAX_FILE_SIZE,
        onDrop: (acceptedFiles) => {
            const remainingSlots = MAX_GALLERY_IMAGES - galleryItems.length;
            if (remainingSlots <= 0) {
                addAlert('error', 'Maximum 4 gallery images allowed');
                return;
            }
            const toAdd = acceptedFiles.slice(0, remainingSlots);
            setGalleryItems(prev => [
                ...prev,
                ...toAdd.map(file => ({
                    file,
                    preview: URL.createObjectURL(file),
                    isExisting: false,
                })),
            ]);
            markDirty();
        },
        onDropRejected: (rejectedFiles) => {
            const err = rejectedFiles[0].errors[0];
            addAlert('error', err.code === 'file-too-large'
                ? 'File is too large (max 5MB)'
                : 'Invalid file type.');
        },
    });

    const handleRemoveFeatured = useCallback(() => {
        if (featuredPreview?.startsWith('blob:')) URL.revokeObjectURL(featuredPreview);
        setFeaturedImageFile(null);
        setFeaturedPreview(null);
        markDirty();
    }, [featuredPreview, markDirty]);

    const handleRemoveGallery = useCallback((index) => {
        setGalleryItems(prev => {
            const item = prev[index];
            if (!item.isExisting) URL.revokeObjectURL(item.preview);
            return prev.filter((_, i) => i !== index);
        });
        markDirty();
    }, [markDirty]);

    // ── Form Helpers ───────────────────────────────────────────────────────────
    const resetForm = useCallback(() => {
        reset(defaultFormValues);
        setFeatures('');
        if (featuredPreview?.startsWith('blob:')) URL.revokeObjectURL(featuredPreview);
        setFeaturedImageFile(null);
        setFeaturedPreview(null);
        galleryItems.forEach(item => { if (!item.isExisting) URL.revokeObjectURL(item.preview); });
        setGalleryItems([]);
        setEditFormDirty(false);
        setModalTab(0);
        setProductOptions([]);
        setDiscount(defaultDiscount);
    }, [reset, featuredPreview, galleryItems]);

    const handleOpenModal = useCallback((mode, cat = null) => {
        setModalMode(mode);
        setEditFormDirty(false);
        setModalTab(0);

        if (cat) {
            setSelectedCat(cat);
            reset({
                name: cat.name || '',
                age: cat.age || '',
                breed: cat.breed || '',
                about: cat.about || '',
                gender: cat.gender || '',
                price: cat.price || '',
                neutered: cat.neutered || false,
                vaccinated: cat.vaccinated || false,
                size: cat.size || 'medium',
                inStock: cat.inStock !== undefined ? cat.inStock : true,
                isFeatured: cat.isFeatured || false,
                stock: cat.stock || 1,
            });
            setFeatures(cat.features || '');
            setFeaturedPreview(cat.featuredImage || null);
            setFeaturedImageFile(null);
            setGalleryItems(
                (cat.gallery || []).map(url => ({ file: null, preview: url, isExisting: true }))
            );
            setProductOptions(cat.options || []);
            setDiscount(cat.discount || defaultDiscount);
        } else {
            setSelectedCat(null);
            reset(defaultFormValues);
            setFeatures('');
            setFeaturedPreview(null);
            setFeaturedImageFile(null);
            setGalleryItems([]);
            setProductOptions([]);
            setDiscount(defaultDiscount);
        }
        setOpenModal(true);
    }, [reset]);

    const handleCloseModal = useCallback(() => {
        setOpenModal(false);
        setSelectedCat(null);
        resetForm();
    }, [resetForm]);

    const handleDeleteClick = useCallback((cat) => {
        setCatToDelete(cat);
        setDeleteDialogOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        if (catToDelete) deleteCatMutation.mutate(catToDelete._id);
    }, [catToDelete]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDeleteCancel = useCallback(() => {
        setDeleteDialogOpen(false);
        setCatToDelete(null);
    }, []);

    // ── FormData Builder ───────────────────────────────────────────────────────
    const buildFormData = useCallback((data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('age', data.age);
        formData.append('breed', data.breed);
        formData.append('about', data.about || '');
        formData.append('gender', data.gender);
        formData.append('price', data.price);
        formData.append('features', features);
        formData.append('neutered', data.neutered);
        formData.append('vaccinated', data.vaccinated);
        formData.append('size', data.size);
        formData.append('inStock', data.inStock);
        formData.append('isFeatured', data.isFeatured);
        formData.append('stock', data.stock);
        formData.append('options', JSON.stringify(productOptions));
        formData.append('discount', JSON.stringify(discount));
        if (featuredImageFile) formData.append('featuredImage', featuredImageFile);
        const existingGalleryUrls = galleryItems.filter(i => i.isExisting).map(i => i.preview);
        formData.append('gallery', JSON.stringify(existingGalleryUrls));
        galleryItems.filter(i => !i.isExisting).forEach(item => formData.append('gallery', item.file));
        return formData;
    }, [features, productOptions, discount, featuredImageFile, galleryItems]);

    // ── Product Options Helpers ────────────────────────────────────────────────
    const addOption = useCallback(() => {
        setProductOptions(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                name: '',
                values: [{ id: Date.now().toString() + 'v', value: '', priceModifier: 0 }],
            },
        ]);
        markDirty();
    }, [markDirty]);

    const removeOption = useCallback((optionId) => {
        setProductOptions(prev => prev.filter(o => o.id !== optionId));
        markDirty();
    }, [markDirty]);

    const updateOptionName = useCallback((optionId, name) => {
        setProductOptions(prev => prev.map(o => o.id === optionId ? { ...o, name } : o));
        markDirty();
    }, [markDirty]);

    const addOptionValue = useCallback((optionId) => {
        setProductOptions(prev => prev.map(o =>
            o.id === optionId
                ? { ...o, values: [...o.values, { id: Date.now().toString(), value: '', priceModifier: 0 }] }
                : o
        ));
        markDirty();
    }, [markDirty]);

    const removeOptionValue = useCallback((optionId, valueId) => {
        setProductOptions(prev => prev.map(o =>
            o.id === optionId
                ? { ...o, values: o.values.filter(v => v.id !== valueId) }
                : o
        ));
        markDirty();
    }, [markDirty]);

    const updateOptionValue = useCallback((optionId, valueId, field, val) => {
        setProductOptions(prev => prev.map(o =>
            o.id === optionId
                ? { ...o, values: o.values.map(v => v.id === valueId ? { ...v, [field]: val } : v) }
                : o
        ));
        markDirty();
    }, [markDirty]);

    // ── Mutations ──────────────────────────────────────────────────────────────
    const createCatMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await axiosInstance.post('/cats', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cats'] });
            addAlert('success', 'Cat profile created successfully!');
            handleCloseModal();
        },
        onError: (error) => {
            addAlert('error', error.response?.data?.message || 'Failed to create cat profile.');
        },
    });

    const updateCatMutation = useMutation({
        mutationFn: async ({ id, formData }) => {
            const response = await axiosInstance.put(`/cats/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cats'] });
            addAlert('success', 'Cat profile updated successfully!');
            handleCloseModal();
        },
        onError: (error) => {
            addAlert('error', error.response?.data?.message || 'Failed to update cat profile.');
        },
    });

    const deleteCatMutation = useMutation({
        mutationFn: async (id) => {
            const response = await axiosInstance.delete(`/cats/${id}`);
            return response.data;
        },
        onSuccess: () => {
            addAlert('success', 'Cat profile deleted successfully!');
            setDeleteDialogOpen(false);
            setCatToDelete(null);
            queryClient.invalidateQueries({ queryKey: ['cats'] });
        },
        onError: (error) => {
            addAlert('error', error.response?.data?.message || 'Failed to delete cat profile.');
            setDeleteDialogOpen(false);
            setCatToDelete(null);
        },
    });

    const updateStockMutation = useMutation({
        mutationFn: async ({ id, stock, inStock }) => {
            const formData = new FormData();
            formData.append('stock', stock);
            formData.append('inStock', inStock);
            const response = await axiosInstance.put(`/cats/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cats'] });
            addAlert('success', 'Stock updated!');
            setEditingStockId(null);
        },
        onError: () => {
            addAlert('error', 'Failed to update stock.');
            setEditingStockId(null);
        },
    });

    const toggleInStockMutation = useMutation({
        mutationFn: async ({ id, inStock }) => {
            const formData = new FormData();
            formData.append('inStock', inStock);
            const response = await axiosInstance.put(`/cats/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cats'] });
            addAlert('success', variables.inStock ? 'Marked as In Stock!' : 'Marked as Out of Stock!');
        },
        onError: () => {
            addAlert('error', 'Failed to update stock status.');
        },
    });

    const deleteReviewMutation = useMutation({
        mutationFn: async ({ catId, reviewId }) => {
            const response = await axiosInstance.delete(`/cats/${catId}/reviews/${reviewId}`);
            return response.data;
        },
        onSuccess: () => {
            addAlert('success', 'Review deleted successfully!');
            queryClient.invalidateQueries({ queryKey: ['cats'] });
            setTimeout(() => {
                const updatedCats = queryClient.getQueryData(['cats']);
                if (updatedCats && selectedCat) {
                    const freshCat = updatedCats.find(c => c._id === selectedCat._id);
                    if (freshCat) setSelectedCat(freshCat);
                }
            }, 100);
        },
        onError: () => {
            addAlert('error', 'Failed to delete review.');
        },
    });

    const toggleReviewApprovalMutation = useMutation({
        mutationFn: async ({ catId, reviewId }) => {
            const response = await axiosInstance.patch(`/cats/${catId}/reviews/${reviewId}`);
            return response.data;
        },
        onSuccess: () => {
            addAlert('success', 'Review approval status updated.');
            queryClient.invalidateQueries({ queryKey: ['cats'] });
            setTimeout(() => {
                const updatedCats = queryClient.getQueryData(['cats']);
                if (updatedCats && selectedCat) {
                    const freshCat = updatedCats.find(c => c._id === selectedCat._id);
                    if (freshCat) setSelectedCat(freshCat);
                }
            }, 100);
        },
        onError: () => {
            addAlert('error', 'Failed to update review approval.');
        },
    });

    // ── Handlers ───────────────────────────────────────────────────────────────
    const onSubmit = useCallback((data) => {
        if (!features || features === '<p><br></p>') {
            addAlert('error', 'Features description is required.');
            return;
        }
        if (modalMode === 'create' && !featuredImageFile) {
            addAlert('error', 'Please select a featured image.');
            return;
        }
        const formData = buildFormData(data);
        if (modalMode === 'edit' && selectedCat) {
            updateCatMutation.mutate({ id: selectedCat._id, formData });
        } else {
            createCatMutation.mutate(formData);
        }
    }, [features, modalMode, featuredImageFile, buildFormData, selectedCat,
        updateCatMutation, createCatMutation, addAlert]);

    const handleStockEditStart = useCallback((cat) => {
        setEditingStockId(cat._id);
        setStockInputValue(String(cat.stock || 0));
    }, []);

    const handleStockSave = useCallback((cat) => {
        const newStock = parseInt(stockInputValue, 10);
        if (isNaN(newStock) || newStock < 0) {
            addAlert('error', 'Please enter a valid stock number.');
            return;
        }
        updateStockMutation.mutate({ id: cat._id, stock: newStock, inStock: newStock > 0 });
    }, [stockInputValue, addAlert, updateStockMutation]);

    const handleStockKeyDown = useCallback((e, cat) => {
        if (e.key === 'Enter') handleStockSave(cat);
        if (e.key === 'Escape') setEditingStockId(null);
    }, [handleStockSave]);

    const isSubmitDisabled = useCallback(() => {
        if (createCatMutation.isPending || updateCatMutation.isPending) return true;
        if (modalMode === 'create') {
            return !isValid || !features || features === '<p><br></p>' || !featuredImageFile;
        }
        return !editFormDirty && !isDirty;
    }, [
        createCatMutation.isPending, updateCatMutation.isPending,
        modalMode, isValid, features, featuredImageFile, editFormDirty, isDirty,
    ]);

    // ── Derived Review Data (for selected cat) ─────────────────────────────────
    const reviews = selectedCat?.reviews || [];
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
        : 0;

    // ── Discount Helpers ───────────────────────────────────────────────────────
    const handleDiscountChange = useCallback((field, value) => {
        setDiscount(prev => ({ ...prev, [field]: value }));
        markDirty();
    }, [markDirty]);

    // ── Pet Detail Hook (for public facing pet detail page) ────────────────────
    const usePetDetail = (title_id) => {
        // State
        const [mainImage, setMainImage] = useState('');
        const [activeTab, setActiveTab] = useState('details');
        const [quantity, setQuantity] = useState(1);
        const [addedToCart, setAddedToCart] = useState(false);
        const [selectedOptions, setSelectedOptions] = useState({});
        const [reviewForm, setReviewForm] = useState({
            name: '',
            email: '',
            rating: 0,
            comment: ''
        });
        const [formError, setFormError] = useState('');
        const [authDialogOpen, setAuthDialogOpen] = useState(false);

        // Queries
        const {
            data: petData,
            isLoading: petLoading,
            error: petError,
            refetch: refetchPet
        } = useQuery({
            queryKey: ['pet', title_id],
            queryFn: () => fetchPetDetail(title_id),
            enabled: !!title_id,
        });

        const pet = petData;

        const { data: relatedCats = [] } = useQuery({
            queryKey: ['relatedCats', pet?._id, pet?.breed, pet?.category],
            queryFn: () => fetchRelatedCats(pet?._id, pet?.breed, pet?.category),
            enabled: !!pet?._id,
        });

        const {
            data: reviewsData = [],
            isLoading: reviewsLoading,
            refetch: refetchReviews
        } = useQuery({
            queryKey: ['reviews', pet?._id],
            queryFn: () => fetchReviews(pet?._id),
            enabled: !!pet?._id,
        });

        const submitReviewMutation = useMutation({
            mutationFn: ({ catId, reviewData }) => submitReview({ catId, reviewData }),
            onSuccess: () => {
                addAlert('success', 'Review submitted successfully!');
                setReviewForm({ name: '', email: '', rating: 0, comment: '' });
                setFormError('');
                refetchReviews();
                queryClient.invalidateQueries({ queryKey: ['pet', title_id] });
            },
            onError: (error) => {
                addAlert('error', error.response?.data?.message || 'Failed to submit review.');
            },
        });

        // Computed values
        const allImages = useMemo(() => {
            if (!pet) return [];
            const images = [];
            if (pet.featuredImage) images.push(pet.featuredImage);
            if (pet.gallery && Array.isArray(pet.gallery)) {
                images.push(...pet.gallery);
            }
            return images;
        }, [pet]);

        const currentPrice = useMemo(() => {
            if (!pet) return 0;
            if (pet.discount?.isActive && pet.discount.value > 0) {
                if (pet.discount.type === 'percentage') {
                    return pet.price * (1 - pet.discount.value / 100);
                }
                return Math.max(0, pet.price - pet.discount.value);
            }
            return pet.price;
        }, [pet]);

        const maxQuantity = useMemo(() => {
            return pet?.inStock && pet?.stock > 0 ? pet.stock : 0;
        }, [pet]);

        // Set initial main image
        useEffect(() => {
            if (pet?.featuredImage) {
                setMainImage(pet.featuredImage);
            }
        }, [pet]);

        const setActiveImage = useCallback((image) => {
            setMainImage(image);
        }, []);

        const handleTabChange = useCallback((tab) => {
            setActiveTab(tab);
        }, []);

        const handleQuantityChange = useCallback((e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= 1 && val <= maxQuantity) {
                setQuantity(val);
            } else if (e.target.value === '') {
                setQuantity('');
            }
        }, [maxQuantity]);

        const handleOptionChange = useCallback((optionId, valueId) => {
            setSelectedOptions(prev => ({ ...prev, [optionId]: valueId }));
        }, []);

        const handleAddToCart = useCallback(() => {
            if (!isAuthenticated) {
                setAuthDialogOpen(true);
                return;
            }

            // Add to cart logic here
            const cartItem = {
                id: pet._id,
                title_id: pet.title_id,
                name: pet.name,
                price: currentPrice,
                quantity: quantity,
                image: pet.featuredImage,
                options: selectedOptions
            };

            // Get existing cart
            const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
            
            // Check if item already exists
            const existingIndex = existingCart.findIndex(item => item.id === pet._id);
            
            if (existingIndex >= 0) {
                existingCart[existingIndex].quantity += quantity;
            } else {
                existingCart.push(cartItem);
            }
            
            localStorage.setItem('cart', JSON.stringify(existingCart));
            setAddedToCart(true);
            addAlert('success', `${pet.name} added to cart!`);
            
            // Reset addedToCart status after 3 seconds
            setTimeout(() => setAddedToCart(false), 3000);
        }, [isAuthenticated, pet, currentPrice, quantity, selectedOptions, addAlert]);

        const handleReviewSubmit = useCallback(() => {
            // Validate form
            if (!reviewForm.rating || reviewForm.rating === 0) {
                setFormError('Please provide a rating');
                return;
            }
            if (!reviewForm.name.trim()) {
                setFormError('Please enter your name');
                return;
            }
            if (!reviewForm.email.trim()) {
                setFormError('Please enter your email');
                return;
            }
            if (!reviewForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                setFormError('Please enter a valid email address');
                return;
            }
            if (!reviewForm.comment.trim()) {
                setFormError('Please enter your review');
                return;
            }

            setFormError('');
            submitReviewMutation.mutate({
                catId: pet._id,
                reviewData: {
                    name: reviewForm.name,
                    email: reviewForm.email,
                    rating: reviewForm.rating,
                    comment: reviewForm.comment
                }
            });
        }, [reviewForm, pet?._id, submitReviewMutation]);

        const handleNavigateToLogin = useCallback(() => {
            setAuthDialogOpen(false);
            navigate('/login', { state: { from: `/adoption/${title_id}` } });
        }, [navigate, title_id]);

        return {
            pet,
            allImages,
            mainImage,
            relatedCats,
            currentPrice,
            maxQuantity,
            setActiveImage,
            activeTab,
            handleTabChange,
            quantity,
            handleQuantityChange,
            addedToCart,
            selectedOptions,
            handleOptionChange,
            reviewForm,
            setReviewForm,
            formError,
            authDialogOpen,
            setAuthDialogOpen,
            reviewsData,
            reviewsLoading,
            submitReviewMutation,
            isLoading: petLoading,
            error: petError,
            handleAddToCart,
            handleReviewSubmit,
            handleNavigateToLogin,
            navigate,
        };
    };

    return {
        // Data
        cats,
        paginatedCats,
        stats,
        catsLoading,

        // Pagination
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,

        // Modal
        openModal,
        modalMode,
        modalTab,
        setModalTab,
        selectedCat,
        setSelectedCat,
        handleOpenModal,
        handleCloseModal,
        syncSelectedCat,

        // Delete Dialog
        deleteDialogOpen,
        catToDelete,
        handleDeleteClick,
        handleDeleteConfirm,
        handleDeleteCancel,

        // Form
        control,
        handleSubmit,
        watch,
        errors,
        isValid,
        isDirty,
        onSubmit,
        isSubmitDisabled,

        // Images
        featuredPreview,
        galleryItems,
        featuredDropzone,
        galleryDropzone,
        handleRemoveFeatured,
        handleRemoveGallery,

        // Features (rich text)
        features,
        setFeatures: (val) => { setFeatures(val); markDirty(); },

        // Discount
        discount,
        handleDiscountChange,
        calculateDiscountedPrice,
        discountPercentage,
        priceValue,

        // Product Options
        productOptions,
        addOption,
        removeOption,
        updateOptionName,
        addOptionValue,
        removeOptionValue,
        updateOptionValue,

        // Inline stock edit
        editingStockId,
        stockInputValue,
        setStockInputValue,
        handleStockEditStart,
        handleStockSave,
        handleStockKeyDown,

        // Reviews
        reviews,
        reviewCount,
        averageRating,

        // Mutations (for pending states)
        createCatMutation,
        updateCatMutation,
        deleteCatMutation,
        updateStockMutation,
        toggleInStockMutation,
        deleteReviewMutation,
        toggleReviewApprovalMutation,

        // Pet Detail Hook
        usePetDetail,

        // Constants
        MAX_GALLERY_IMAGES,
    };
};