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
} from "@mui/icons-material";

export const SuperAdminMenuComponent = ({ onMenuItemClick }) => {
  const menuItems = [
    {
      sectionName: "Main",
      items: [
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
          text: "Blog Management",
          icon: <ArticleIcon />,
          path: "/superadmin-dashboard/blog-upload",
        },
        {
          text: "Video Management",
          icon: <VideoIcon />,
          path: "/superadmin-dashboard/video-upload",
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
      sectionName: "Profile",
      items: [
        {
          text: "My Profile",
          icon: <AccountIcon />,
          path: "/superadmin-dashboard/profile",
        },
      ],
    },
  ];

  const processedMenuItems = menuItems.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      onClick: () => onMenuItemClick(item.path),
    })),
  }));

  return processedMenuItems;
};