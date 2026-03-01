import React from 'react';
import {
    Dashboard as DashboardIcon,
    Assignment as AssignmentIcon,
    Schedule as ScheduleIcon,
    Description as FormIcon,
    HealthAndSafety as HealthIcon,
    AccountCircle as AccountIcon,
    CheckCircle as SubmitIcon
} from '@mui/icons-material';

export const ClientMenuComponent = ({ onMenuItemClick }) => {
    const menuItems = [
        // Dashboard & Daily Work Section
        {
            sectionName: 'Dashboard & Daily Work',
            items: [
                {
                    text: 'Dashboard',
                    icon: <DashboardIcon />,
                    path: '/client-dashboard'
                },
                {
                    text: 'My Tasks',
                    icon: <AssignmentIcon />,
                    path: '/client-dashboard/my-tasks'
                },
                {
                    text: 'My Schedule',
                    icon: <ScheduleIcon />,
                    path: '/client-dashboard/my-schedule'
                },
            ]
        },
        // Forms & Reports Section
        {
            sectionName: 'Forms & Reports',
            items: [
                {
                    text: 'Forms',
                    icon: <FormIcon />,
                    path: '/client-dashboard/forms'
                },
                {
                    text: 'Submit Form',
                    icon: <SubmitIcon />,
                    path: '/client-dashboard/forms/submit'
                },
                {
                    text: 'Health Department Reports',
                    icon: <HealthIcon />,
                    path: '/client-dashboard/health-department-reports'
                },
                {
                    text: 'Submit Health Report',
                    icon: <HealthIcon />,
                    path: '/client-dashboard/health-department-reports/submit'
                },
            ]
        },

        // Profile Section
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

    // Return structured menu items with onClick handlers
    return menuItems.map(section => ({
        ...section,
        items: section.items.map(item => ({
            ...item,
            onClick: () => onMenuItemClick(item.path)
        }))
    }));
};