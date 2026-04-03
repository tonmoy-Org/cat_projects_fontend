import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../auth/AuthProvider';
import { useGlobalSnackbar } from '../context/GlobalSnackbarContext';

const ITEMS_PER_PAGE = 8;

// ==================== API FUNCTIONS ====================

const fetchCatByTitleId = async (titleId) => {
    const res = await axiosInstance.get(`/search/${titleId}`);
    console.log('fetchCatByTitleId response:', res.data);
    return res.data?.data || res.data;
};

const searchPets = async (query) => {
    const res = await axiosInstance.get(`/search?q=${encodeURIComponent(query)}`);
    return res.data?.data || res.data || [];
};

// FIXED: Combine cats and products
const fetchAllCats = async () => {
    const res = await axiosInstance.get('/search/all');
    
    const { cats = [], products = [] } = res.data?.data || {};
    
    // Combine cats and products with type indicator
    const allItems = [
        ...cats.map(cat => ({ ...cat, itemType: 'cat' })),
        ...products.map(prod => ({ ...prod, itemType: 'product' }))
    ];
    
    console.log('Combined items:', allItems.length, '(cats:', cats.length, '+ products:', products.length, ')');
    return allItems;
};

const fetchCatReviews = async (titleId) => {
    const res = await axiosInstance.get(`/search/${titleId}/reviews`);
    console.log('fetchCatReviews response:', res.data);
    return res.data?.data || res.data || [];
};

const submitCatReview = async ({ titleId, reviewData }) => {
    const res = await axiosInstance.post(`/search/${titleId}/reviews`, reviewData);
    return res.data;
};

// ==================== HELPERS ====================

const getSmartRelatedItems = (current, all, limit = 4) => {
    
    if (!current || !all?.length) {
        console.log('No current item or no all items available');
        return [];
    }
    
    // Filter out current item and only include inStock items
    const availableItems = all.filter(item => {
        const isNotCurrent = item._id !== current._id;
        const isInStock = item.inStock === true;
        const hasStock = item.stock > 0;
        return isNotCurrent && isInStock && hasStock;
    });
    
    if (availableItems.length === 0) {
        console.log('No available items found');
        return [];
    }
    
    // Try to get items with same breed/category
    const sameCategory = availableItems
        .filter(item => {
            const itemCategory = item.itemType === 'cat' ? item.breed : item.category;
            const currentCategory = current.itemType === 'cat' ? current.breed : current.category;
            return itemCategory && itemCategory === currentCategory;
        })
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, limit);
    
    if (sameCategory.length >= limit) {
        console.log('Returning same category items');
        return sameCategory;
    }
    
    // Get fallback items
    const remainingNeeded = limit - sameCategory.length;
    const sameCategoryIds = sameCategory.map(c => c._id);
    
    const fallback = availableItems
        .filter(c => !sameCategoryIds.includes(c._id))
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, remainingNeeded);
    
    const result = [...sameCategory, ...fallback];
    
    return result;
};

// ==================== MAIN HOOK ====================

export const useSearchApi = () => {
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const { showSnackbar } = useGlobalSnackbar();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const useSearch = (searchQuery, options = {}) => {
        const query = useQuery({
            queryKey: ['search', searchQuery],
            queryFn: () => searchPets(searchQuery),
            enabled: !!searchQuery && searchQuery.trim().length > 0,
            staleTime: 1000 * 60 * 2,
            ...options,
        });

        return {
            ...query,
            results: query.data || [],
        };
    };

    const usePetDetail = (titleId, options = {}) => {
        const [activeImage, setActiveImage] = useState(null);
        const [activeTab, setActiveTab] = useState('details');
        const [quantity, setQuantity] = useState(1);
        const [addedToCart, setAddedToCart] = useState(false);
        const [selectedOptions, setSelectedOptions] = useState({});
        const [reviewForm, setReviewForm] = useState({ name: '', email: '', comment: '', rating: 0 });
        const [formError, setFormError] = useState('');
        const [authDialogOpen, setAuthDialogOpen] = useState(false);
        const [debugInfo, setDebugInfo] = useState({});

        const petQuery = useQuery({
            queryKey: ['pet', titleId],
            queryFn: () => fetchCatByTitleId(titleId),
            enabled: !!titleId,
            staleTime: 1000 * 60 * 5,
            ...options,
        });

        // FIXED: Now includes both cats and products
        const allCatsQuery = useQuery({
            queryKey: ['cats-all'],
            queryFn: fetchAllCats,
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
        const allItems = allCatsQuery.data || [];
        
        // FIXED: Calculate related items (cats or products)
        const relatedCats = useMemo(() => {
            console.log('🔄 Calculating related items...');
            console.log('Pet exists:', !!pet);
            console.log('All items count:', allItems.length);
            
            if (!pet) {
                console.log('❌ No pet data yet');
                return [];
            }
            
            if (allItems.length === 0) {
                console.log('❌ No items data yet');
                return [];
            }
            
            const related = getSmartRelatedItems(pet, allItems, 4);
            console.log('✅ Related items result:', related.length);
            return related;
        }, [pet, allItems]);

        // Debug effect to log when relatedCats changes
        useEffect(() => {
            console.log('📊 relatedCats state updated:', {
                count: relatedCats.length,
                items: relatedCats.map(c => ({ name: c.name, id: c._id, type: c.itemType }))
            });
            
            setDebugInfo({
                petLoaded: !!pet,
                allItemsLoaded: allItems.length > 0,
                relatedCount: relatedCats.length,
                petName: pet?.name,
                allItemsCount: allItems.length
            });
        }, [relatedCats, pet, allItems]);

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
                showSnackbar(`${pet?.name} is not available!`, 'warning');
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
            debugInfo,
        };
    };

    const invalidateCats = () => queryClient.invalidateQueries({ queryKey: ['cats-all'] });
    const invalidateCat = (titleId) => queryClient.invalidateQueries({ queryKey: ['pet', titleId] });
    const invalidateReviews = (titleId) => queryClient.invalidateQueries({ queryKey: ['pet-reviews', titleId] });
    const invalidateSearch = (query) => queryClient.invalidateQueries({ queryKey: ['search', query] });

    return {
        useSearch,
        usePetDetail,
        invalidateCats,
        invalidateCat,
        invalidateReviews,
        invalidateSearch,
    };
};