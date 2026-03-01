import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../../components/DashboardLayout';
import { MemberMenuComponent } from './MemberMenuComponent';


export const MemberLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuItemClick = (path) => {
        navigate(path);
    };


    const structuredMenuItems = MemberMenuComponent({ onMenuItemClick: handleMenuItemClick });

    const getPageTitle = () => {
        const currentPath = location.pathname;


        for (const section of structuredMenuItems) {
            for (const item of section.items) {

                if (currentPath === item.path) return item.text;
                if (currentPath.startsWith(item.path + '/')) return item.text;

                if (item.subItems) {
                    const subItem = item.subItems.find(sub => {
                        if (currentPath === sub.path) return true;
                        if (currentPath.startsWith(sub.path + '/')) return true;
                        return false;
                    });
                    if (subItem) return subItem.text;
                }
            }
        }

        // Fallback titles for common routes
        if (currentPath === '/member-dashboard') {
            return 'Dashboard';
        }

        return 'নিয়মিত দাতা সদস্য (Regular Donor/Member) Dashboard';
    };
    
    return (
        <DashboardLayout
            title={getPageTitle()}
            menuItems={structuredMenuItems}
        >
            <Outlet />
        </DashboardLayout>
    );
};