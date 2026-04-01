// hooks/useClientApi.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axios';
import { useAuth } from '../auth/AuthProvider';
import { useGlobalSnackbar } from '../context/GlobalSnackbarContext';

// ==================== API FUNCTIONS ====================

// Orders API
const fetchOrders = async (email) => {
    if (!email) return [];
    const res = await axiosInstance.get(`/orders/${email}`);
    const orders = res.data.orders || res.data.data || res.data || [];
    return Array.isArray(orders) ? orders : [];
};

// Addresses API
const fetchAddresses = async () => {
    const res = await axiosInstance.get('/users/me/addresses');
    return res.data.data;
};

const createAddress = async (payload) => {
    const res = await axiosInstance.post('/users/me/addresses', payload);
    return res.data.data;
};

const updateAddress = async ({ addressId, payload }) => {
    const res = await axiosInstance.put(`/users/me/addresses/${addressId}`, payload);
    return res.data.data;
};

const removeAddress = async (addressId) => {
    const res = await axiosInstance.delete(`/users/me/addresses/${addressId}`);
    return res.data.data;
};

const setDefaultAddress = async (addressId) => {
    const res = await axiosInstance.patch(`/users/me/addresses/${addressId}`);
    return res.data.data;
};

// Profile API
const fetchProfile = async () => {
    const res = await axiosInstance.get('/auth/me');
    return res?.data?.user || res?.data?.data || res?.data;
};

const updateProfile = async (profileData) => {
    const res = await axiosInstance.put('/auth/profile', profileData);
    return res.data.data || res.data;
};

const changePassword = async (passwordData) => {
    const res = await axiosInstance.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
    });
    return res.data;
};

// Reviews API
const fetchReviews = async (userId) => {
    if (!userId) return [];
    const res = await axiosInstance.get(`reviews/customer?customerId=${userId}`);
    const reviews = res.data?.data || res.data?.reviews || res.data || [];
    return Array.isArray(reviews) ? reviews : [];
};

// ==================== CUSTOM HOOK ====================

export const useClientApi = () => {
    const { user, updateUser } = useAuth();
    const { showSnackbar } = useGlobalSnackbar();
    const queryClient = useQueryClient();

    // ========== ORDERS QUERIES ==========
    const useOrders = (options = {}) => {
        return useQuery({
            queryKey: ['client-orders', user?.email],
            queryFn: () => fetchOrders(user?.email),
            enabled: !!user?.email,
            staleTime: 1000 * 60 * 5,
            ...options,
        });
    };

    // ========== ADDRESS QUERIES & MUTATIONS ==========
    const useAddresses = (options = {}) => {
        return useQuery({
            queryKey: ['myAddresses'],
            queryFn: fetchAddresses,
            enabled: !!user?.id,
            ...options,
        });
    };

    const useCreateAddress = () => {
        return useMutation({
            mutationFn: createAddress,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['myAddresses'] });
                showSnackbar('Address added successfully!', 'success');
            },
            onError: (e) => {
                showSnackbar(e?.response?.data?.message || 'Failed to add address', 'error');
            },
        });
    };

    const useUpdateAddress = () => {
        return useMutation({
            mutationFn: updateAddress,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['myAddresses'] });
                showSnackbar('Address updated successfully!', 'success');
            },
            onError: (e) => {
                showSnackbar(e?.response?.data?.message || 'Failed to update address', 'error');
            },
        });
    };

    const useDeleteAddress = () => {
        return useMutation({
            mutationFn: removeAddress,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['myAddresses'] });
                showSnackbar('Address deleted successfully!', 'success');
            },
            onError: (e) => {
                showSnackbar(e?.response?.data?.message || 'Failed to delete address', 'error');
            },
        });
    };

    const useSetDefaultAddress = () => {
        return useMutation({
            mutationFn: setDefaultAddress,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['myAddresses'] });
                showSnackbar('Default address updated!', 'success');
            },
            onError: (e) => {
                showSnackbar(e?.response?.data?.message || 'Failed to set default address', 'error');
            },
        });
    };

    // ========== PROFILE QUERIES & MUTATIONS ==========
    const useProfile = (options = {}) => {
        return useQuery({
            queryKey: ['userProfile', user?.id],
            queryFn: fetchProfile,
            enabled: !!user?.id,
            retry: 1,
            staleTime: 5 * 60 * 1000,
            ...options,
        });
    };

    const useUpdateProfile = () => {
        return useMutation({
            mutationFn: updateProfile,
            onMutate: async (newData) => {
                await queryClient.cancelQueries({ queryKey: ['userProfile', user?.id] });
                const previousProfile = queryClient.getQueryData(['userProfile', user?.id]);

                const optimisticProfile = {
                    ...previousProfile,
                    ...newData,
                    updatedAt: new Date().toISOString(),
                };

                queryClient.setQueryData(['userProfile', user?.id], optimisticProfile);

                if (updateUser) {
                    updateUser(newData);
                }

                return { previousProfile };
            },
            onSuccess: (updatedData) => {
                if (updateUser) {
                    updateUser(updatedData);
                }
                showSnackbar('Profile updated successfully!', 'success');
            },
            onError: (err, newData, context) => {
                if (context?.previousProfile) {
                    queryClient.setQueryData(['userProfile', user?.id], context.previousProfile);
                    if (updateUser) {
                        updateUser(context.previousProfile);
                    }
                }
                showSnackbar(err.response?.data?.message || 'Failed to update profile', 'error');
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
            },
        });
    };

    const useChangePassword = () => {
        return useMutation({
            mutationFn: changePassword,
            onSuccess: () => {
                showSnackbar('Password changed successfully!', 'success');
            },
            onError: (err) => {
                showSnackbar(err.response?.data?.message || 'Failed to change password', 'error');
            },
        });
    };

    // ========== REVIEWS QUERIES ==========
    const useReviews = (options = {}) => {
        return useQuery({
            queryKey: ['my-reviews', user?.email],
            queryFn: () => fetchReviews(user?.id),
            enabled: !!user?.id,
            staleTime: 1000 * 60 * 5,
            ...options,
        });
    };

    // ========== UTILITY FUNCTIONS ==========
    const invalidateOrders = () => {
        queryClient.invalidateQueries({ queryKey: ['client-orders', user?.email] });
    };

    const invalidateAddresses = () => {
        queryClient.invalidateQueries({ queryKey: ['myAddresses'] });
    };

    const invalidateProfile = () => {
        queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
    };

    const invalidateReviews = () => {
        queryClient.invalidateQueries({ queryKey: ['my-reviews', user?.email] });
    };

    return {
        // Queries
        useOrders,
        useAddresses,
        useProfile,
        useReviews,
        
        // Mutations
        useCreateAddress,
        useUpdateAddress,
        useDeleteAddress,
        useSetDefaultAddress,
        useUpdateProfile,
        useChangePassword,
        
        // Utilities
        invalidateOrders,
        invalidateAddresses,
        invalidateProfile,
        invalidateReviews,
    };
};