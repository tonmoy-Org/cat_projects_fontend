import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../../components/DashboardLayout';
import { ClientMenuComponent } from './ClientMenuComponent';


export const ClientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuItemClick = (path) => {
    navigate(path);
  };

  // Get menu items from the component with section structure
  const structuredMenuItems = ClientMenuComponent({ onMenuItemClick: handleMenuItemClick });

  // Function to determine the current page title based on route
  const getPageTitle = () => {
    const currentPath = location.pathname;

    // Flatten all items to find current
    const allItems = structuredMenuItems.flatMap(section => section.items);

    // Find the matching menu item
    const menuItem = allItems.find(item => {
      if (currentPath === item.path) return true;
      // For nested routes (like /forms/edit/:id)
      if (currentPath.startsWith(item.path + '/')) return true;
      return false;
    });

    if (menuItem) {
      return menuItem.text;
    }

    // Fallback titles for common routes
    if (currentPath === '/client-dashboard') {
      return 'Dashboard';
    }

    return 'Clint Dashboard';
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