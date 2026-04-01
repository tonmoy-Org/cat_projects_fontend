import React from "react";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AccountCircle as AccountIcon,
  Article as ArticleIcon,
  ViewCarousel as CarouselIcon,
  VideoLibrary as VideoIcon,
  Pets as PetsIcon,
  Inventory as InventoryIcon,
  Home as HomeIcon,
  ShoppingCart as OrdersIcon,
  LocalShipping as ShippingIcon,
  Receipt as ReceiptIcon,
  Payments as PaymentsIcon,
  LocationOn as AddressIcon,
  Reviews,
} from "@mui/icons-material";

export const SuperAdminMenuComponent = ({ onMenuItemClick }) => {
  const menuItems = [
    {
      sectionName: "Main",
      items: [
        {
          text: "Home",
          icon: <HomeIcon />,
          path: "/",
        },
        {
          text: "Dashboard",
          icon: <DashboardIcon />,
          path: "/superadmin-dashboard",
        },
        {
          text: "Users",
          icon: <PeopleIcon />,
          path: "/superadmin-dashboard/users",
        },
      ],
    },
    {
      sectionName: "System & Configuration",
      items: [
        {
          text: "Home Carousel",
          icon: <CarouselIcon />,
          path: "/superadmin-dashboard/carousel-management",
        },
        {
          text: "Video Management",
          icon: <VideoIcon />,
          path: "/superadmin-dashboard/videos-management",
        },
        {
          text: "Blogs",
          icon: <ArticleIcon />,
          path: "/superadmin-dashboard/blogs",
        },
      ],
    },
    {
      sectionName: "Pet Management",
      items: [
        {
          text: "Cats",
          icon: <PetsIcon />,
          path: "/superadmin-dashboard/cats-management",
        },
        {
          text: "Products",
          icon: <InventoryIcon />,
          path: "/superadmin-dashboard/products-management",
        },
      ],
    },
    {
      sectionName: "Order Management",
      items: [
        {
          text: "All Orders",
          icon: <OrdersIcon />,
          path: "/superadmin-dashboard/order-management",
        },
        {
          text: 'My Orders',
          icon: <OrdersIcon />,
          path: '/superadmin-dashboard/my-orders'
        },
        // {
        //   text: "Shipping",
        //   icon: <ShippingIcon />,
        //   path: "/superadmin-dashboard/shipping-management",
        // },
        // {
        //   text: "Transactions",
        //   icon: <ReceiptIcon />,
        //   path: "/superadmin-dashboard/transactions",
        // },
        // {
        //   text: "Payments",
        //   icon: <PaymentsIcon />,
        //   path: "/superadmin-dashboard/payments",
        // },
      ],
    },
    {
      sectionName: "My Account",
      items: [
        {
          text: "My Profile",
          icon: <AccountIcon />,
          path: "/superadmin-dashboard/profile",
        },
        {
          text: 'Manage Addresses',
          icon: <AddressIcon />,
          path: '/superadmin-dashboard/addresses'
        },
        {
          text: 'My Reviews',
          icon: <Reviews />,
          path: '/superadmin-dashboard/my-review'
        },
      ],
    },
  ];

  return menuItems.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      onClick: () => onMenuItemClick(item.path),
    })),
  }));
};