import React from 'react';
import {
    Dashboard as DashboardIcon,
    Assignment as AssignmentIcon,
    AccountCircle as AccountIcon,
    ReceiptLong as OrdersIcon,
    Home as HomeIcon,
} from '@mui/icons-material';

export const ClientMenuComponent = ({ onMenuItemClick }) => {
    const menuItems = [
        {
            items: [
                {
                    text: "Home",
                    icon: <HomeIcon />,
                    path: "/",
                },
                {
                    text: 'Dashboard',
                    icon: <DashboardIcon />,
                    path: '/client-dashboard'
                },
                {
                    text: 'My Orders',
                    icon: <OrdersIcon />,
                    path: '/client-dashboard/my-orders'
                },
            ]
        },
        {
            sectionName: 'Profile',
            items: [
                {
                    text: 'My Profile',
                    icon: <AccountIcon />,
                    path: '/client-dashboard/profile'
                },
            ]
        },
    ];

    return menuItems.map(section => ({
        ...section,
        items: section.items.map(item => ({
            ...item,
            onClick: () => onMenuItemClick(item.path)
        }))
    }));
};