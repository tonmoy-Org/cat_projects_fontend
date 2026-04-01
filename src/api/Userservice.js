import axiosInstance from './axios';

// User Management Services
export const userService = {
    // Get all users (admin only)
    getAllUsers: async (params = {}) => {
        try {
            const response = await axiosInstance.get('/user', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get user by ID (admin only)
    getUserById: async (userId) => {
        try {
            const response = await axiosInstance.get(`/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create new user (admin only)
    createUser: async (userData) => {
        try {
            const response = await axiosInstance.post('/user/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update user (admin only)
    updateUser: async (userId, userData) => {
        try {
            const response = await axiosInstance.put(`/user/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete user (admin only)
    deleteUser: async (userId) => {
        try {
            const response = await axiosInstance.delete(`/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Toggle user status (admin only)
    toggleUserStatus: async (userId) => {
        try {
            const response = await axiosInstance.patch(`/user/${userId}/toggle-status`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Remove device from user
    removeDevice: async (userId, deviceId) => {
        try {
            const response = await axiosInstance.delete(`/user/${userId}/devices/${deviceId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

// Address Management Services
export const addressService = {
    // Get all addresses for current user
    getAllAddresses: async () => {
        try {
            const response = await axiosInstance.get('/user/addresses/list/all');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Add new address
    addAddress: async (addressData) => {
        try {
            const response = await axiosInstance.post('/user/addresses/create', addressData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update existing address
    updateAddress: async (addressId, addressData) => {
        try {
            const response = await axiosInstance.put(`/user/address/${addressId}`, addressData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete address
    deleteAddress: async (addressId) => {
        try {
            const response = await axiosInstance.delete(`/user/address/${addressId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Set default address
    setDefaultAddress: async (addressId) => {
        try {
            const response = await axiosInstance.patch(`/user/address/${addressId}/default`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

// Utility function to format address for display
export const formatAddress = (address) => {
    if (!address) return '';
    return `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
};

// Utility function to validate address data
export const validateAddressData = (addressData) => {
    const errors = {};

    if (!addressData.label?.trim()) {
        errors.label = 'Address label is required';
    }

    if (!addressData.fullName?.trim()) {
        errors.fullName = 'Full name is required';
    }

    if (!addressData.phoneNumber?.trim()) {
        errors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9\-\+\s\(\)]+$/.test(addressData.phoneNumber)) {
        errors.phoneNumber = 'Invalid phone number format';
    }

    if (!addressData.street?.trim()) {
        errors.street = 'Street address is required';
    }

    if (!addressData.city?.trim()) {
        errors.city = 'City is required';
    }

    if (!addressData.state?.trim()) {
        errors.state = 'State/Province is required';
    }

    if (!addressData.postalCode?.trim()) {
        errors.postalCode = 'Postal code is required';
    }

    if (!addressData.country?.trim()) {
        errors.country = 'Country is required';
    }

    return Object.keys(errors).length > 0 ? errors : null;
};