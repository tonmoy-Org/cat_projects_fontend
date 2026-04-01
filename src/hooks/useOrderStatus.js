// hooks/useOrderStatus.js
import { useTheme, alpha } from '@mui/material';

export const useOrderStatus = () => {
    const theme = useTheme();
    
    const GREEN = theme.palette.success.main;
    const WARNING = theme.palette.warning.main;
    const INFO = theme.palette.info.main;
    const ERROR = theme.palette.error.main;
    const dark = theme.palette.mode === 'dark';

    const getOrderStatusStyle = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'delivered':
            case 'completed':
                return { 
                    bg: alpha(GREEN, dark ? 0.2 : 0.1), 
                    color: GREEN,
                    borderColor: GREEN,
                };
            case 'shipped':
            case 'confirmed':
                return { 
                    bg: alpha(WARNING, dark ? 0.2 : 0.1), 
                    color: WARNING,
                    borderColor: WARNING,
                };
            case 'pending':
                return { 
                    bg: alpha(INFO, dark ? 0.2 : 0.1), 
                    color: INFO,
                    borderColor: INFO,
                };
            case 'cancelled':
                return { 
                    bg: alpha(ERROR, dark ? 0.2 : 0.1), 
                    color: ERROR,
                    borderColor: ERROR,
                };
            default:
                return { 
                    bg: alpha('#888', 0.1), 
                    color: '#888',
                    borderColor: '#888',
                };
        }
    };

    const getPaymentStatusStyle = (status) => {
        const isPaid = status === 'paid' || status === 'completed';
        return {
            bg: alpha(isPaid ? GREEN : ERROR, dark ? 0.2 : 0.1),
            color: isPaid ? GREEN : ERROR,
            borderColor: isPaid ? GREEN : ERROR,
        };
    };

    const getOrderStatusLabel = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'delivered':
            case 'completed':
                return 'Delivered';
            case 'shipped':
            case 'confirmed':
                return 'Shipped';
            case 'pending':
                return 'Pending';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status || 'Unknown';
        }
    };

    const getPaymentStatusLabel = (status) => {
        const isPaid = status === 'paid' || status === 'completed';
        return isPaid ? 'Paid' : 'Unpaid';
    };

    const getOrderStatusIcon = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'delivered':
            case 'completed':
                return '✅';
            case 'shipped':
            case 'confirmed':
                return '🚚';
            case 'pending':
                return '⏳';
            case 'cancelled':
                return '❌';
            default:
                return '📦';
        }
    };

    const getPaymentStatusIcon = (status) => {
        const isPaid = status === 'paid' || status === 'completed';
        return isPaid ? '💰' : '⏰';
    };

    const isOrderDelivered = (status) => {
        return ['delivered', 'completed'].includes((status || '').toLowerCase());
    };

    const isOrderShipped = (status) => {
        return ['shipped', 'confirmed'].includes((status || '').toLowerCase());
    };

    const isOrderPending = (status) => {
        return ['pending'].includes((status || '').toLowerCase());
    };

    const isOrderCancelled = (status) => {
        return ['cancelled'].includes((status || '').toLowerCase());
    };

    const isPaymentPaid = (status) => {
        return ['paid', 'completed'].includes((status || '').toLowerCase());
    };

    const getOrderProgressStep = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'pending':
                return 1;
            case 'confirmed':
                return 2;
            case 'shipped':
                return 3;
            case 'delivered':
            case 'completed':
                return 4;
            default:
                return 0;
        }
    };

    return {
        getOrderStatusStyle,
        getPaymentStatusStyle,
        getOrderStatusLabel,
        getPaymentStatusLabel,
        getOrderStatusIcon,
        getPaymentStatusIcon,
        isOrderDelivered,
        isOrderShipped,
        isOrderPending,
        isOrderCancelled,
        isPaymentPaid,
        getOrderProgressStep,
    };
};