import React, { useState } from 'react';
import {
    Dashboard as DashboardIcon,
    AccountCircle as AccountIcon,
    Notifications as NotificationsIcon,
    HealthAndSafety as HealthIcon,
    Assessment as AssessmentIcon,
    Star as ScorecardIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    // Sub-item icons
    Description as ReportIcon,
    Assessment as AssessmentReportIcon,
    Timeline as TimelineIcon,
} from '@mui/icons-material';

export const MemberMenuComponent = ({ onMenuItemClick }) => {
    const [expandedSections, setExpandedSections] = useState({
        'health-reports': false
    });

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const menuItems = [
        // Dashboard & Overview
        {
            sectionName: 'Dashboard & Overview',
            items: [
                { text: 'Dashboard', icon: <DashboardIcon />, path: '/member-dashboard' },
                { text: 'Overview', icon: <AssessmentIcon />, path: '/member-dashboard/overview' },
                { text: 'Notifications', icon: <NotificationsIcon />, path: '/member-dashboard/notifications' },
            ]
        },


        // Reports & Compliance - Updated with collapsible health reports
        {
            sectionName: 'Reports & Compliance',
            items: [
                {
                    text: 'Health Department Reports',
                    icon: <HealthIcon />,
                    path: '#',
                    isExpandable: true,
                    sectionId: 'health-reports',
                    expandIcon: <ExpandMoreIcon />,
                    subItems: [
                        {
                            text: 'RME Reports',
                            icon: <ReportIcon />,
                            path: '/member-dashboard/health-department-reports/rme'
                        },
                        {
                            text: 'RSS Reports',
                            icon: <AssessmentReportIcon />,
                            path: '/member-dashboard/health-department-reports/rss'
                        },
                        {
                            text: 'TOS Reports',
                            icon: <TimelineIcon />,
                            path: '/member-dashboard/health-department-reports/tos'
                        }
                    ]
                },
                { text: 'My Scorecard', icon: <ScorecardIcon />, path: '/member-dashboard/my-scorecard' },
            ]
        },

        // Profile
        {
            sectionName: 'Profile',
            items: [
                { text: 'My Profile', icon: <AccountIcon />, path: '/member-dashboard/profile' },
            ]
        },
    ];

    // Process menu items to add click handlers
    const processedMenuItems = menuItems.map(section => {
        const processedItems = section.items.map(item => {
            if (item.isExpandable) {
                return {
                    ...item,
                    onClick: () => toggleSection(item.sectionId),
                    expanded: expandedSections[item.sectionId] || false,
                    expandIcon: expandedSections[item.sectionId] ? <ExpandLessIcon /> : <ExpandMoreIcon />,
                    subItems: item.subItems.map(subItem => ({
                        ...subItem,
                        onClick: () => onMenuItemClick(subItem.path)
                    }))
                };
            }
            return {
                ...item,
                onClick: () => onMenuItemClick(item.path)
            };
        });

        return {
            ...section,
            items: processedItems
        };
    });

    return processedMenuItems;
};