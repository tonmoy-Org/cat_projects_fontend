import React from 'react';
import {
    Dashboard as DashboardIcon,
    Assignment as AssignmentIcon,
    AccountCircle as AccountIcon,
    ReceiptLong as OrdersIcon,
    Home as HomeIcon,
    RateReview as ReviewIcon,
    LocationOn as AddressIcon,
    Person as ProfileIcon,
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
                {
                    text: 'My Reviews',
                    icon: <ReviewIcon />,
                    path: '/client-dashboard/my-review'
                },
            ]
        },
        {
            sectionName: 'Profile',
            items: [
                {
                    text: 'Account Information',
                    icon: <ProfileIcon />,
                    path: '/client-dashboard/profile'
                },
                {
                    text: 'Manage Addresses',
                    icon: <AddressIcon />,
                    path: '/client-dashboard/addresses'
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