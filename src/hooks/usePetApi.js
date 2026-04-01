import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../auth/AuthProvider';
import { useGlobalSnackbar } from '../context/GlobalSnackbarContext';

const ITEMS_PER_PAGE = 8;

// ==================== API FUNCTIONS ====================

const fetchAllCats = async () => {
    const res = await axiosInstance.get('/cats?limit=1000');
    return res.data?.data || res.data || [];
};

const fetchCatByTitleId = async (titleId) => {
    const res = await axiosInstance.get(`/cats/${titleId}`);
    return res.data?.data || res.data;
};

const fetchAllCatsSimple = async () => {
    const res = await axiosInstance.get('/cats');
    return res.data?.data || res.data || [];
};

const fetchCatReviews = async (titleId) => {
    const res = await axiosInstance.get(`/cats/${titleId}/reviews`);
    return res.data?.data || res.data || [];
};

const submitCatReview = async ({ titleId, reviewData }) => {
    const res = await axiosInstance.post(`/cats/${titleId}/reviews`, reviewData);
    return res.data;
};

// ==================== HELPERS ====================

const getSmartRelatedCats = (current, all, limit = 4) => {
    if (!current || !all?.length) return [];
    const sameBreed = all
        .filter(c => c._id !== current._id && c.inStock && c.breed === current.breed && (c.averageRating || 0) >= 3)
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, limit);
    if (sameBreed.length >= limit) return sameBreed;
    const fallback = all
        .filter(c => !sameBreed.find(sb => sb._id === c._id) && c._id !== current._id && c.inStock)
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, limit - sameBreed.length);
    return [...sameBreed, ...fallback];
};

// ==================== MAIN HOOK ====================

export const usePetApi = () => {
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const { showSnackbar } = useGlobalSnackbar();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // ========== CAT LISTING ==========

    const useCats = (options = {}) => {
        const [page, setPage] = useState(1);
        const [search, setSearch] = useState('');
        const [breed, setBreed] = useState('All');
        const [gender, setGender] = useState('all');
        const [stock, setStock] = useState('all');
        const [priceRange, setPriceRange] = useState([0, 10000]);
        const [minInput, setMinInput] = useState('');
        const [maxInput, setMaxInput] = useState('');
        const [priceInitialized, setPriceInitialized] = useState(false);
        const [isRefreshing, setIsRefreshing] = useState(false);

        const query = useQuery({
            queryKey: ['cats-listing'],
            queryFn: fetchAllCats,
            staleTime: 1000 * 60 * 5,
            ...options,
        });

        const allCats = query.data || [];

        const { priceMin, priceMax } = useMemo(() => {
            if (!priceInitialized || !allCats.length) return { priceMin: 0, priceMax: 10000 };
            const prices = allCats.map(c => Number(c.price) || 0);
            return {
                priceMin: Math.floor(Math.min(...prices)),
                priceMax: Math.ceil(Math.max(...prices)),
            };
        }, [allCats, priceInitialized]);

        const breedOptions = useMemo(() => {
            if (!allCats.length) return ['All'];
            const unique = [...new Set(allCats.map(c => c.breed).filter(Boolean))].sort();
            return ['All', ...unique];
        }, [allCats]);

        const applyPriceBounds = useCallback((cats) => {
            const prices = cats.map(c => Number(c.price) || 0);
            const min = Math.floor(Math.min(...prices));
            const max = Math.ceil(Math.max(...prices));
            setPriceRange([min, max]);
            setMinInput(String(min));
            setMaxInput(String(max));
        }, []);

        if (allCats.length > 0 && !priceInitialized) {
            applyPriceBounds(allCats);
            setPriceInitialized(true);
        }

        const handleRefresh = async () => {
            setIsRefreshing(true);
            try {
                await query.refetch();
                setSearch('');
                setBreed('All');
                setGender('all');
                setStock('all');
                if (allCats.length > 0) applyPriceBounds(allCats);
                showSnackbar('Filters reset successfully!', 'success');
            } catch {
                showSnackbar('Failed to refresh data', 'error');
            } finally {
                setIsRefreshing(false);
            }
        };

        const handleSliderChange = (_, val) => {
            setPriceRange(val);
            setMinInput(String(val[0]));
            setMaxInput(String(val[1]));
        };

        const handleMinInput = (e) => {
            const raw = e.target.value;
            setMinInput(raw);
            const num = Number(raw);
            if (!isNaN(num) && num >= priceMin && num <= priceRange[1]) setPriceRange([num, priceRange[1]]);
        };

        const handleMaxInput = (e) => {
            const raw = e.target.value;
            setMaxInput(raw);
            const num = Number(raw);
            if (!isNaN(num) && num <= priceMax && num >= priceRange[0]) setPriceRange([priceRange[0], num]);
        };

        const filteredCats = useMemo(() => {
            return allCats.filter(cat => {
                if (search.trim() && !cat.name?.toLowerCase().includes(search.trim().toLowerCase())) return false;
                if (breed !== 'All' && cat.breed?.toLowerCase() !== breed.toLowerCase()) return false;
                if (gender !== 'all' && cat.gender?.toLowerCase() !== gender) return false;
                if (stock === 'instock' && !cat.inStock) return false;
                if (stock === 'outofstock' && cat.inStock) return false;
                const price = Number(cat.price) || 0;
                if (price < priceRange[0] || price > priceRange[1]) return false;
                return true;
            });
        }, [allCats, search, breed, gender, stock, priceRange]);

        const totalPages = Math.ceil(filteredCats.length / ITEMS_PER_PAGE) || 1;
        const paginatedCats = filteredCats.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

        const clearFilter = (key) => {
            if (key === 'search') setSearch('');
            if (key === 'breed') setBreed('All');
            if (key === 'gender') setGender('all');
            if (key === 'stock') setStock('all');
            if (key === 'price') { setPriceRange([priceMin, priceMax]); setMinInput(String(priceMin)); setMaxInput(String(priceMax)); }
        };

        const clearAll = () => {
            setSearch('');
            setBreed('All');
            setGender('all');
            setStock('all');
            setPriceRange([priceMin, priceMax]);
            setMinInput(String(priceMin));
            setMaxInput(String(priceMax));
        };

        const activeFilters = [];
        if (search.trim()) activeFilters.push({ label: `"${search}"`, key: 'search' });
        if (breed !== 'All') activeFilters.push({ label: `Breed: ${breed}`, key: 'breed' });
        if (gender !== 'all') activeFilters.push({ label: gender === 'male' ? 'Male' : 'Female', key: 'gender' });
        if (stock !== 'all') activeFilters.push({ label: stock === 'instock' ? 'Available' : 'Adopted', key: 'stock' });
        if (priceInitialized && (priceRange[0] !== priceMin || priceRange[1] !== priceMax)) {
            activeFilters.push({ label: `৳${priceRange[0]} – ৳${priceRange[1]}`, key: 'price' });
        }

        const handleAddToCart = (cat) => {
            if (!isAuthenticated) return { requiresAuth: true };
            if (!cat.inStock) {
                showSnackbar(`${cat.name} is not available!`, 'warning');
                return { success: false };
            }
            addToCart(cat, 1);
            showSnackbar(`${cat.name} added to cart!`, 'success');
            return { success: true };
        };

        const handleCatClick = (cat) => {
            navigate(`/adoption/${cat.title_id}`);
        };

        return {
            ...query,
            allCats,
            filteredCats,
            paginatedCats,
            totalPages,
            page,
            setPage,
            search,
            setSearch,
            breed,
            setBreed,
            gender,
            setGender,
            stock,
            setStock,
            priceRange,
            minInput,
            maxInput,
            priceMin,
            priceMax,
            priceInitialized,
            breedOptions,
            activeFilters,
            isRefreshing,
            handleRefresh,
            handleSliderChange,
            handleMinInput,
            handleMaxInput,
            clearFilter,
            clearAll,
            handleAddToCart,
            handleCatClick,
        };
    };

    // ========== PET DETAIL ==========

    const usePetDetail = (titleId, options = {}) => {
        const [activeImage, setActiveImage] = useState(null);
        const [activeTab, setActiveTab] = useState('details');
        const [quantity, setQuantity] = useState(1);
        const [addedToCart, setAddedToCart] = useState(false);
        const [selectedOptions, setSelectedOptions] = useState({});
        const [reviewForm, setReviewForm] = useState({ name: '', email: '', comment: '', rating: 0 });
        const [formError, setFormError] = useState('');
        const [authDialogOpen, setAuthDialogOpen] = useState(false);

        const petQuery = useQuery({
            queryKey: ['pet', titleId],
            queryFn: () => fetchCatByTitleId(titleId),
            enabled: !!titleId,
            staleTime: 1000 * 60 * 5,
            ...options,
        });

        const allCatsQuery = useQuery({
            queryKey: ['cats-all'],
            queryFn: fetchAllCatsSimple,
            staleTime: 1000 * 60 * 10,
        });

        const reviewsQuery = useQuery({
            queryKey: ['pet-reviews', titleId],
            queryFn: () => fetchCatReviews(titleId),
            enabled: !!titleId && activeTab === 'reviews',
            staleTime: 1000 * 60 * 2,
        });

        const submitReviewMutation = useMutation({
            mutationFn: ({ reviewData }) => submitCatReview({ titleId, reviewData }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['pet-reviews', titleId] });
                queryClient.invalidateQueries({ queryKey: ['pet', titleId] });
                setReviewForm({ name: '', email: '', comment: '', rating: 0 });
                setFormError('');
                showSnackbar('Review submitted successfully!', 'success');
            },
            onError: (err) => {
                showSnackbar(err.response?.data?.message || 'Failed to submit review.', 'error');
            },
        });

        const pet = petQuery.data;
        const allCats = allCatsQuery.data || [];
        const relatedCats = pet ? getSmartRelatedCats(pet, allCats, 4) : [];

        const currentPrice = useMemo(() => {
            let price = parseFloat(pet?.price) || 0;
            Object.values(selectedOptions).forEach(opt => {
                if (opt?.priceModifier) price += parseFloat(opt.priceModifier) || 0;
            });
            return price;
        }, [pet?.price, selectedOptions]);

        const maxQuantity = pet?.inStock && pet?.stock > 0 ? pet.stock : 0;
        const mainImage = activeImage || pet?.featuredImage;
        const allImages = pet
            ? [pet.featuredImage, ...(pet.gallery || [])].filter(Boolean)
            : [];

        const handleQuantityChange = (e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val > 0 && val <= maxQuantity) setQuantity(val);
            else if (val > maxQuantity) setQuantity(maxQuantity);
        };

        const handleAddToCart = () => {
            if (!isAuthenticated) { setAuthDialogOpen(true); return; }
            if (!pet?.inStock || pet?.stock <= 0) {
                showSnackbar(`${pet?.name} is not available for adoption!`, 'warning');
                return;
            }
            addToCart({ ...pet, selectedOptions, selectedPrice: currentPrice }, quantity);
            setAddedToCart(true);
            showSnackbar(`${pet.name} added to cart!`, 'success');
        };

        const handleTabChange = (tab) => {
            setActiveTab(tab);
            if (tab === 'reviews') queryClient.invalidateQueries({ queryKey: ['pet-reviews', titleId] });
        };

        const handleOptionChange = (optionId, valueId, valueObj) => {
            setSelectedOptions(prev => ({
                ...prev,
                [optionId]: { id: valueId, value: valueObj.value, priceModifier: valueObj.priceModifier },
            }));
            setQuantity(1);
            setAddedToCart(false);
        };

        const handleReviewSubmit = () => {
            if (!reviewForm.name.trim()) return setFormError('Name is required.');
            if (!reviewForm.email.trim()) return setFormError('Email is required.');
            if (!reviewForm.rating) return setFormError('Please select a rating.');
            if (!reviewForm.comment.trim()) return setFormError('Review comment is required.');
            setFormError('');
            submitReviewMutation.mutate({ reviewData: reviewForm });
        };

        const handleNavigateToLogin = () => {
            setAuthDialogOpen(false);
            navigate('/login', { state: { from: `/adoption/${titleId}` } });
        };

        return {
            pet,
            allImages,
            mainImage,
            relatedCats,
            currentPrice,
            maxQuantity,
            activeImage,
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
            reviewsData: reviewsQuery.data,
            reviewsLoading: reviewsQuery.isLoading,
            submitReviewMutation,
            isLoading: petQuery.isLoading,
            error: petQuery.error,
            handleAddToCart,
            handleReviewSubmit,
            handleNavigateToLogin,
            navigate,
        };
    };

    // ========== UTILITIES ==========

    const invalidateCats = () => queryClient.invalidateQueries({ queryKey: ['cats-listing'] });
    const invalidateCat = (titleId) => queryClient.invalidateQueries({ queryKey: ['pet', titleId] });
    const invalidateReviews = (titleId) => queryClient.invalidateQueries({ queryKey: ['pet-reviews', titleId] });

    return {
        useCats,
        usePetDetail,
        invalidateCats,
        invalidateCat,
        invalidateReviews,
    };
};