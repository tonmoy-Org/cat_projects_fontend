import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../auth/AuthProvider';
import { useGlobalSnackbar } from '../context/GlobalSnackbarContext';

const ITEMS_PER_PAGE = 8;

// ==================== API FUNCTIONS ====================

const fetchAllProducts = async () => {
    const res = await axiosInstance.get('/products?limit=1000');
    return res.data?.data || res.data || [];
};

const fetchProductByTitleId = async (titleId) => {
    const res = await axiosInstance.get(`/products/${titleId}`);
    return res.data?.data || res.data;
};

const fetchAllProductsSimple = async () => {
    const res = await axiosInstance.get('/products');
    return res.data?.data || res.data || [];
};

const fetchProductReviews = async (titleId) => {
    const res = await axiosInstance.get(`/products/${titleId}/reviews`);
    const productData = res.data?.data || res.data;
    return productData?.reviews || [];
};

const createProduct = async (formData) => {
    const res = await axiosInstance.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data || res.data;
};

const updateProduct = async ({ id, formData }) => {
    const res = await axiosInstance.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data || res.data;
};

const deleteProduct = async (id) => {
    const res = await axiosInstance.delete(`/products/${id}`);
    return res.data;
};

const updateProductStock = async ({ id, stock, inStock }) => {
    const formData = new FormData();
    formData.append('stock', stock);
    formData.append('inStock', inStock);
    const res = await axiosInstance.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data || res.data;
};

const toggleProductInStock = async ({ id, inStock }) => {
    const formData = new FormData();
    formData.append('inStock', inStock);
    const res = await axiosInstance.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data || res.data;
};

const submitProductReview = async ({ titleId, reviewData }) => {
    const res = await axiosInstance.post(`/products/${titleId}/reviews`, reviewData);
    return res.data;
};

const deleteProductReview = async ({ productId, reviewId }) => {
    const res = await axiosInstance.delete(`/products/${productId}/reviews/${reviewId}`);
    return res.data;
};

const approveProductReview = async ({ productId, reviewId }) => {
    const res = await axiosInstance.put(`/products/${productId}/reviews/${reviewId}`, { approved: true });
    return res.data;
};

const bulkUpdateProducts = async (updates) => {
    const res = await axiosInstance.post('/products/bulk-update', { updates });
    return res.data;
};

const bulkDeleteProducts = async (ids) => {
    const res = await axiosInstance.post('/products/bulk-delete', { ids });
    return res.data;
};

// ==================== HELPERS ====================

const getRandomFour = (arr, excludeId) =>
    [...arr.filter(p => p._id !== excludeId)].sort(() => Math.random() - 0.5).slice(0, 4);

const enrichProductWithDiscount = (product) => {
    if (!product) return product;

    const hasDiscount = product.discount?.isActive && product.discount.value > 0;
    let discountedPrice = product.price;
    let discountPercentage = 0;

    if (hasDiscount) {
        if (product.discount.type === 'percentage') {
            discountedPrice = product.price * (1 - product.discount.value / 100);
            discountPercentage = product.discount.value;
        } else {
            discountedPrice = Math.max(0, product.price - product.discount.value);
            discountPercentage = (product.discount.value / product.price) * 100;
        }
    }

    const embeddedReviews = product.reviews || [];

    // ✅ Change to `r.approved === true` to show only approved reviews on cards
    const visibleReviews = embeddedReviews;

    const computedReviewCount =
        visibleReviews.length > 0 ? visibleReviews.length : (product.reviewCount || 0);

    const computedAverageRating =
        visibleReviews.length > 0
            ? visibleReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / visibleReviews.length
            : (product.averageRating || 0);

    return {
        ...product,
        discountedPrice,
        discountPercentage,
        isDiscountActive: hasDiscount,
        currentPrice: discountedPrice,
        averageRating: computedAverageRating,
        reviewCount: computedReviewCount,
    };
};

// ==================== MAIN HOOK ====================

export const useShopApi = () => {
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const { showSnackbar } = useGlobalSnackbar();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // ========== PRODUCT LISTING (Frontend) ==========

    const useProducts = (options = {}) => {
        const [page, setPage] = useState(1);
        const [search, setSearch] = useState('');
        const [category, setCategory] = useState('All');
        const [stock, setStock] = useState('all');
        const [priceRange, setPriceRange] = useState([0, 10000]);
        const [minInput, setMinInput] = useState('');
        const [maxInput, setMaxInput] = useState('');
        const [priceInitialized, setPriceInitialized] = useState(false);
        const [isRefreshing, setIsRefreshing] = useState(false);

        const query = useQuery({
            queryKey: ['products-listing'],
            queryFn: fetchAllProducts,
            staleTime: 1000 * 60 * 5,
            ...options,
        });

        const allProducts = (query.data || []).map(enrichProductWithDiscount);

        const { priceMin, priceMax } = useMemo(() => {
            if (!priceInitialized || !allProducts.length) return { priceMin: 0, priceMax: 10000 };
            const prices = allProducts.map(p => Number(p.price) || 0);
            return {
                priceMin: Math.floor(Math.min(...prices)),
                priceMax: Math.ceil(Math.max(...prices)),
            };
        }, [allProducts, priceInitialized]);

        const categoryOptions = useMemo(() => {
            if (!allProducts.length) return ['All'];
            const unique = [...new Set(allProducts.map(p => p.category).filter(Boolean))].sort();
            return ['All', ...unique];
        }, [allProducts]);

        const applyPriceBounds = useCallback((products) => {
            const prices = products.map(p => Number(p.price) || 0);
            const min = Math.floor(Math.min(...prices));
            const max = Math.ceil(Math.max(...prices));
            setPriceRange([min, max]);
            setMinInput(String(min));
            setMaxInput(String(max));
        }, []);

        if (allProducts.length > 0 && !priceInitialized) {
            applyPriceBounds(allProducts);
            setPriceInitialized(true);
        }

        const handleRefresh = async () => {
            setIsRefreshing(true);
            try {
                await query.refetch();
                setSearch('');
                setCategory('All');
                setStock('all');
                if (allProducts.length > 0) applyPriceBounds(allProducts);
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

        const filteredProducts = useMemo(() => {
            return allProducts.filter(product => {
                if (search.trim() && !product.title?.toLowerCase().includes(search.trim().toLowerCase())) return false;
                if (category !== 'All' && product.category?.toLowerCase() !== category.toLowerCase()) return false;
                if (stock === 'instock' && !product.inStock) return false;
                if (stock === 'outofstock' && product.inStock) return false;
                const price = Number(product.price) || 0;
                if (price < priceRange[0] || price > priceRange[1]) return false;
                return true;
            });
        }, [allProducts, search, category, stock, priceRange]);

        const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
        const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

        const clearFilter = (key) => {
            if (key === 'search') setSearch('');
            if (key === 'category') setCategory('All');
            if (key === 'stock') setStock('all');
            if (key === 'price') { setPriceRange([priceMin, priceMax]); setMinInput(String(priceMin)); setMaxInput(String(priceMax)); }
        };

        const clearAll = () => {
            setSearch('');
            setCategory('All');
            setStock('all');
            setPriceRange([priceMin, priceMax]);
            setMinInput(String(priceMin));
            setMaxInput(String(priceMax));
        };

        const activeFilters = [];
        if (search.trim()) activeFilters.push({ label: `"${search}"`, key: 'search' });
        if (category !== 'All') activeFilters.push({ label: `Category: ${category}`, key: 'category' });
        if (stock !== 'all') activeFilters.push({ label: stock === 'instock' ? 'In Stock' : 'Out of Stock', key: 'stock' });
        if (priceInitialized && (priceRange[0] !== priceMin || priceRange[1] !== priceMax)) {
            activeFilters.push({ label: `৳${priceRange[0]} – ৳${priceRange[1]}`, key: 'price' });
        }

        const handleAddToCart = (product) => {
            if (!isAuthenticated) return { requiresAuth: true };
            if (!product.inStock) {
                showSnackbar(`${product.title} is out of stock!`, 'warning');
                return { success: false };
            }
            addToCart(product, 1);
            showSnackbar(`${product.title} added to cart!`, 'success');
            return { success: true };
        };

        const handleProductClick = (product) => {
            navigate(`/shop/${product.title_id}`);
        };

        return {
            ...query,
            allProducts,
            filteredProducts,
            paginatedProducts,
            totalPages,
            page,
            setPage,
            search,
            setSearch,
            category,
            setCategory,
            stock,
            setStock,
            priceRange,
            minInput,
            maxInput,
            priceMin,
            priceMax,
            priceInitialized,
            categoryOptions,
            activeFilters,
            isRefreshing,
            handleRefresh,
            handleSliderChange,
            handleMinInput,
            handleMaxInput,
            clearFilter,
            clearAll,
            handleAddToCart,
            handleProductClick,
        };
    };

    // ========== PRODUCT DETAIL (Frontend) ==========

    const useProductDetail = (titleId, options = {}) => {
        const [activeImage, setActiveImage] = useState(null);
        const [activeTab, setActiveTab] = useState('features');
        const [quantity, setQuantity] = useState(1);
        const [addedToCart, setAddedToCart] = useState(false);
        const [selectedOptions, setSelectedOptions] = useState({});
        const [reviewForm, setReviewForm] = useState({ name: '', email: '', comment: '', rating: 0 });
        const [formError, setFormError] = useState('');
        const [authDialogOpen, setAuthDialogOpen] = useState(false);

        const productQuery = useQuery({
            queryKey: ['product', titleId],
            queryFn: () => fetchProductByTitleId(titleId),
            enabled: !!titleId,
            staleTime: 1000 * 60 * 5,
            ...options,
        });

        const allProductsQuery = useQuery({
            queryKey: ['products-all'],
            queryFn: fetchAllProductsSimple,
            staleTime: 1000 * 60 * 10,
        });

        const reviewsQuery = useQuery({
            queryKey: ['product-reviews', titleId],
            queryFn: () => fetchProductReviews(titleId),
            enabled: !!titleId,
            staleTime: 1000 * 60 * 2,
        });

        const submitReviewMutation = useMutation({
            mutationFn: ({ reviewData }) => submitProductReview({ titleId, reviewData }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['product-reviews', titleId] });
                queryClient.invalidateQueries({ queryKey: ['product', titleId] });
                queryClient.invalidateQueries({ queryKey: ['products-listing'] });
                setReviewForm({ name: '', email: '', comment: '', rating: 0 });
                setFormError('');
                showSnackbar('Review submitted successfully!', 'success');
                setActiveTab('reviews');
            },
            onError: (err) => {
                showSnackbar(err.response?.data?.message || 'Failed to submit review.', 'error');
            },
        });

        const product = productQuery.data ? enrichProductWithDiscount(productQuery.data) : null;
        const allProducts = (allProductsQuery.data || []).map(enrichProductWithDiscount);
        const relatedProducts = product ? getRandomFour(allProducts, product._id) : [];

        const reviews = reviewsQuery.data || [];
        const averageRating = product?.averageRating || 0;
        const reviewCount = product?.reviewCount || reviews.length || 0;
        const approvedReviews = reviews.filter(review => review.approved === true);

        const currentPrice = useMemo(() => {
            let price = parseFloat(product?.price) || 0;
            Object.values(selectedOptions).forEach(opt => {
                if (opt?.priceModifier) price += parseFloat(opt.priceModifier) || 0;
            });
            return price;
        }, [product?.price, selectedOptions]);

        const maxQuantity = product?.inStock && product?.stock > 0 ? product.stock : 0;
        const mainImage = activeImage || product?.featuredImage;
        const allImages = product
            ? [product.featuredImage, ...(product.gallery || [])].filter(Boolean)
            : [];

        const handleQuantityChange = (e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val > 0 && val <= maxQuantity) setQuantity(val);
            else if (val > maxQuantity) setQuantity(maxQuantity);
        };

        const handleAddToCart = () => {
            if (!isAuthenticated) { setAuthDialogOpen(true); return; }
            if (!product?.inStock || product?.stock <= 0) {
                showSnackbar('Product is out of stock!', 'warning');
                return;
            }
            addToCart({ ...product, selectedOptions, selectedPrice: currentPrice }, quantity);
            setAddedToCart(true);
            showSnackbar(`${product.title} added to cart!`, 'success');
        };

        const handleTabChange = (tab) => {
            setActiveTab(tab);
            if (tab === 'reviews') {
                queryClient.invalidateQueries({ queryKey: ['product-reviews', titleId] });
            }
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
            navigate('/login', { state: { from: `/shop/${titleId}` } });
        };

        return {
            product,
            allImages,
            mainImage,
            relatedProducts,
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
            reviews: approvedReviews,
            allReviews: reviews,
            averageRating,
            reviewCount,
            reviewsLoading: reviewsQuery.isLoading,
            reviewsError: reviewsQuery.error,
            submitReviewMutation,
            isLoading: productQuery.isLoading,
            error: productQuery.error,
            handleAddToCart,
            handleReviewSubmit,
            handleNavigateToLogin,
            navigate,
        };
    };

    // ========== ADMIN: PRODUCT MANAGEMENT ==========

    const useProductsManagement = (options = {}) => {
        const [page, setPage] = useState(0);
        const [rowsPerPage, setRowsPerPage] = useState(10);

        const productsQuery = useQuery({
            queryKey: ['products-admin'],
            queryFn: fetchAllProducts,
            staleTime: 1000 * 60 * 2,
            ...options,
        });

        const allProducts = (productsQuery.data || []).map(enrichProductWithDiscount);
        const paginatedProducts = allProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        // ── Create ─────────────────────────────────────────────────────────
        const createMutation = useMutation({
            mutationFn: createProduct,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products-admin'] });
                queryClient.invalidateQueries({ queryKey: ['products-listing'] });
                showSnackbar('Product created successfully!', 'success');
            },
            onError: (error) => {
                showSnackbar(error.response?.data?.message || 'Failed to create product.', 'error');
            },
        });

        // ── Update ─────────────────────────────────────────────────────────
        const updateMutation = useMutation({
            mutationFn: updateProduct,
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ['products-admin'] });
                queryClient.invalidateQueries({ queryKey: ['products-listing'] });
                queryClient.invalidateQueries({ queryKey: ['product', data?.title_id] });
                showSnackbar('Product updated successfully!', 'success');
            },
            onError: (error) => {
                showSnackbar(error.response?.data?.message || 'Failed to update product.', 'error');
            },
        });

        // ── Delete ─────────────────────────────────────────────────────────
        const deleteMutation = useMutation({
            mutationFn: deleteProduct,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products-admin'] });
                queryClient.invalidateQueries({ queryKey: ['products-listing'] });
                showSnackbar('Product deleted successfully!', 'success');
            },
            onError: (error) => {
                showSnackbar(error.response?.data?.message || 'Failed to delete product.', 'error');
            },
        });

        // ── Stock Update ───────────────────────────────────────────────────
        const updateStockMutation = useMutation({
            mutationFn: updateProductStock,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products-admin'] });
                queryClient.invalidateQueries({ queryKey: ['products-listing'] });
                showSnackbar('Stock updated successfully!', 'success');
            },
            onError: (error) => {
                showSnackbar(error.response?.data?.message || 'Failed to update stock.', 'error');
            },
        });

        // ── Toggle InStock ─────────────────────────────────────────────────
        const toggleInStockMutation = useMutation({
            mutationFn: toggleProductInStock,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products-admin'] });
                queryClient.invalidateQueries({ queryKey: ['products-listing'] });
                showSnackbar('Stock status updated!', 'success');
            },
            onError: (error) => {
                showSnackbar(error.response?.data?.message || 'Failed to update stock status.', 'error');
            },
        });

        // ── Delete Review — with optimistic update ─────────────────────────
        const deleteReviewMutation = useMutation({
            mutationFn: deleteProductReview,

            // 1. Instantly remove from cache before the request completes
            onMutate: async ({ productId, reviewId }) => {
                await queryClient.cancelQueries({ queryKey: ['admin-reviews', productId] });
                const previousReviews = queryClient.getQueryData(['admin-reviews', productId]);

                queryClient.setQueryData(['admin-reviews', productId], (old) => {
                    if (!old) return old;
                    const updated = old.reviews.filter(r => r._id !== reviewId);
                    return {
                        ...old,
                        reviews: updated,
                        reviewCount: Math.max(0, updated.length),
                    };
                });

                return { previousReviews, productId };
            },

            // 2. Roll back if the request fails
            onError: (error, _vars, context) => {
                if (context?.previousReviews !== undefined) {
                    queryClient.setQueryData(['admin-reviews', context.productId], context.previousReviews);
                }
                showSnackbar(error.response?.data?.message || 'Failed to delete review.', 'error');
            },

            onSuccess: () => {
                showSnackbar('Review deleted successfully!', 'success');
            },

            // 3. Always resync from server when done
            onSettled: (_data, _error, { productId }) => {
                queryClient.invalidateQueries({ queryKey: ['admin-reviews', productId] });
                queryClient.invalidateQueries({ queryKey: ['products-admin'] });
                queryClient.invalidateQueries({ queryKey: ['products-listing'] });
            },
        });

        // ── Approve Review — with optimistic update ────────────────────────
        const approveReviewMutation = useMutation({
            mutationFn: approveProductReview,

            // 1. Instantly flip approved=true in cache before the request completes
            onMutate: async ({ productId, reviewId }) => {
                await queryClient.cancelQueries({ queryKey: ['admin-reviews', productId] });
                const previousReviews = queryClient.getQueryData(['admin-reviews', productId]);

                queryClient.setQueryData(['admin-reviews', productId], (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        reviews: old.reviews.map(r =>
                            r._id === reviewId ? { ...r, approved: true } : r
                        ),
                    };
                });

                return { previousReviews, productId };
            },

            // 2. Roll back if the request fails
            onError: (error, _vars, context) => {
                if (context?.previousReviews !== undefined) {
                    queryClient.setQueryData(['admin-reviews', context.productId], context.previousReviews);
                }
                showSnackbar(error.response?.data?.message || 'Failed to approve review.', 'error');
            },

            onSuccess: () => {
                showSnackbar('Review approved successfully!', 'success');
            },

            // 3. Always resync from server when done
            onSettled: (_data, _error, { productId }) => {
                queryClient.invalidateQueries({ queryKey: ['admin-reviews', productId] });
                queryClient.invalidateQueries({ queryKey: ['products-admin'] });
                queryClient.invalidateQueries({ queryKey: ['products-listing'] });
            },
        });

        // ── Bulk Operations ────────────────────────────────────────────────
        const bulkUpdateMutation = useMutation({
            mutationFn: bulkUpdateProducts,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products-admin'] });
                queryClient.invalidateQueries({ queryKey: ['products-listing'] });
                showSnackbar('Products updated successfully!', 'success');
            },
            onError: (error) => {
                showSnackbar(error.response?.data?.message || 'Failed to update products.', 'error');
            },
        });

        const bulkDeleteMutation = useMutation({
            mutationFn: bulkDeleteProducts,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['products-admin'] });
                queryClient.invalidateQueries({ queryKey: ['products-listing'] });
                showSnackbar('Products deleted successfully!', 'success');
            },
            onError: (error) => {
                showSnackbar(error.response?.data?.message || 'Failed to delete products.', 'error');
            },
        });

        // ── Computed Statistics ────────────────────────────────────────────
        const stats = useMemo(() => {
            const totalProducts = allProducts.length;
            const inStockCount = allProducts.filter(p => p.inStock).length;
            const outOfStockCount = allProducts.filter(p => !p.inStock).length;
            const featuredCount = allProducts.filter(p => p.isFeatured).length;
            const totalStock = allProducts.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);
            const productsWithDiscount = allProducts.filter(p => p.discount?.isActive && p.discount.value > 0).length;

            const avgPrice = totalProducts > 0
                ? allProducts.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / totalProducts
                : 0;

            const maxPrice = totalProducts > 0
                ? Math.max(...allProducts.map(p => parseFloat(p.price) || 0))
                : 0;

            const minPrice = totalProducts > 0
                ? Math.min(...allProducts.filter(p => p.price).map(p => parseFloat(p.price)))
                : 0;

            const totalReviews = allProducts.reduce((sum, p) => sum + (p.reviewCount || 0), 0);
            const productsWithReviews = allProducts.filter(p => (p.reviewCount || 0) > 0).length;

            const avgRating = productsWithReviews > 0
                ? (allProducts.reduce((sum, p) => sum + (p.averageRating || 0), 0) / productsWithReviews)
                : 0;

            const totalGalleryImages = allProducts.reduce((sum, p) => sum + (p.gallery?.length || 0), 0);
            const categoriesSet = new Set(allProducts.filter(p => p.category).map(p => p.category));
            const uniqueCategories = categoriesSet.size;

            return {
                totalProducts,
                inStockCount,
                outOfStockCount,
                featuredCount,
                avgPrice,
                maxPrice,
                minPrice,
                totalReviews,
                productsWithReviews,
                avgRating: avgRating.toFixed(1),
                totalGalleryImages,
                uniqueCategories,
                stockPercentage: totalProducts > 0 ? ((inStockCount / totalProducts) * 100).toFixed(1) : 0,
                totalStock,
                productsWithDiscount,
            };
        }, [allProducts]);

        return {
            allProducts,
            paginatedProducts,
            isLoading: productsQuery.isLoading,
            error: productsQuery.error,
            page,
            setPage,
            rowsPerPage,
            setRowsPerPage,
            stats,
            createMutation,
            updateMutation,
            deleteMutation,
            updateStockMutation,
            toggleInStockMutation,
            deleteReviewMutation,
            approveReviewMutation,
            bulkUpdateMutation,
            bulkDeleteMutation,
            refetch: productsQuery.refetch,
        };
    };

    // ========== UTILITIES ==========

    const invalidateProducts = () => queryClient.invalidateQueries({ queryKey: ['products-listing'] });
    const invalidateProductsAdmin = () => queryClient.invalidateQueries({ queryKey: ['products-admin'] });
    const invalidateProduct = (titleId) => queryClient.invalidateQueries({ queryKey: ['product', titleId] });
    const invalidateReviews = (titleId) => queryClient.invalidateQueries({ queryKey: ['product-reviews', titleId] });

    return {
        useProducts,
        useProductDetail,
        useProductsManagement,
        invalidateProducts,
        invalidateProductsAdmin,
        invalidateProduct,
        invalidateReviews,
        createProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        toggleProductInStock,
        submitProductReview,
        deleteProductReview,
        approveProductReview,
        bulkUpdateProducts,
        bulkDeleteProducts,
    };
};