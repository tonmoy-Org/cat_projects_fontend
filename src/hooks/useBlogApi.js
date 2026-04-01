import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useGlobalSnackbar } from '../context/GlobalSnackbarContext';

const ITEMS_PER_PAGE = 9;

// ==================== API FUNCTIONS ====================

const fetchAllBlogs = async ({ page = 1, limit = ITEMS_PER_PAGE } = {}) => {
    const res = await axiosInstance.get(`/blogs?page=${page}&limit=${limit}`);
    return res.data;
};

const fetchBlogByTitleId = async (titleId) => {
    const res = await axiosInstance.get(`/blogs/${titleId}`);
    return res.data;
};

const fetchRelatedBlogs = async (currentBlogId, category, limit = 3) => {
    const res = await axiosInstance.get(`/blogs?category=${category}&limit=${limit + 1}&exclude=${currentBlogId}`);
    return res.data;
};

// ==================== HELPERS ====================

const getRelatedBlogs = (current, all, limit = 3) => {
    if (!current || !all?.length) return [];
    const sameCategory = all
        .filter(b => b._id !== current._id && b.category === current.category)
        .slice(0, limit);
    if (sameCategory.length >= limit) return sameCategory;
    const fallback = all
        .filter(b => !sameCategory.find(sb => sb._id === b._id) && b._id !== current._id)
        .slice(0, limit - sameCategory.length);
    return [...sameCategory, ...fallback];
};

// ==================== MAIN HOOK ====================

export const useBlogApi = () => {
    const { showSnackbar } = useGlobalSnackbar();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // ========== BLOG LISTING ==========

    const useBlogs = (options = {}) => {
        const [page, setPage] = useState(1);
        const [search, setSearch] = useState('');
        const [category, setCategory] = useState('All');
        const [sortBy, setSortBy] = useState('date');

        const query = useQuery({
            queryKey: ['blogs-listing', page, search, category, sortBy],
            queryFn: () => fetchAllBlogs({ page, limit: ITEMS_PER_PAGE }),
            staleTime: 1000 * 60 * 5,
            ...options,
        });

        const blogsData = query.data;
        const blogs = blogsData?.blogs || [];
        const pagination = blogsData?.pagination || { totalPages: 1, totalBlogs: 0 };

        const categoryOptions = useMemo(() => {
            if (!blogs.length) return ['All'];
            const unique = [...new Set(blogs.map(b => b.category).filter(Boolean))].sort();
            return ['All', ...unique];
        }, [blogs]);

        const filteredBlogs = useMemo(() => {
            let filtered = [...blogs];
            if (search.trim()) {
                filtered = filtered.filter(blog =>
                    blog.title?.toLowerCase().includes(search.trim().toLowerCase())
                );
            }
            if (category !== 'All') {
                filtered = filtered.filter(blog => blog.category === category);
            }
            if (sortBy === 'date') {
                filtered.sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date));
            } else if (sortBy === 'title') {
                filtered.sort((a, b) => a.title?.localeCompare(b.title));
            }
            return filtered;
        }, [blogs, search, category, sortBy]);

        const totalPages = pagination.totalPages;
        const paginatedBlogs = filteredBlogs;

        const handleBlogClick = (blog) => {
            navigate(`/blog/${blog.title_id}`);
        };

        const handleRefresh = async () => {
            await query.refetch();
            showSnackbar('Blogs refreshed successfully!', 'success');
        };

        const clearFilters = () => {
            setSearch('');
            setCategory('All');
            setSortBy('date');
            setPage(1);
        };

        const activeFilters = [];
        if (search.trim()) activeFilters.push({ label: `"${search}"`, key: 'search' });
        if (category !== 'All') activeFilters.push({ label: `Category: ${category}`, key: 'category' });

        return {
            ...query,
            blogs,
            filteredBlogs,
            paginatedBlogs,
            pagination,
            totalPages,
            page,
            setPage,
            search,
            setSearch,
            category,
            setCategory,
            sortBy,
            setSortBy,
            categoryOptions,
            activeFilters,
            handleBlogClick,
            handleRefresh,
            clearFilters,
        };
    };

    // ========== BLOG DETAIL ==========

    const useBlogDetail = (titleId, options = {}) => {
        const [activeTab, setActiveTab] = useState('content');
        const [relatedBlogs, setRelatedBlogs] = useState([]);

        const blogQuery = useQuery({
            queryKey: ['blog', titleId],
            queryFn: () => fetchBlogByTitleId(titleId),
            enabled: !!titleId,
            staleTime: 1000 * 60 * 5,
            ...options,
        });

        const allBlogsQuery = useQuery({
            queryKey: ['blogs-all'],
            queryFn: () => fetchAllBlogs({ page: 1, limit: 100 }),
            staleTime: 1000 * 60 * 10,
        });

        const blog = blogQuery.data?.blog || blogQuery.data;
        const allBlogs = allBlogsQuery.data?.blogs || [];

        // Fetch related blogs when blog data is available - FIXED: Added proper useEffect import
        useEffect(() => {
            if (blog && allBlogs.length > 0) {
                const related = getRelatedBlogs(blog, allBlogs, 3);
                setRelatedBlogs(related);
            }
        }, [blog, allBlogs]);

        const handleTabChange = (tab) => {
            setActiveTab(tab);
        };

        const handleBlogClick = (blog) => {
            navigate(`/blog/${blog.title_id}`);
        };

        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        };

        const stripHtmlTags = (html) => {
            if (!html) return '';
            const tmp = document.createElement('DIV');
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || '';
        };

        return {
            blog,
            relatedBlogs,
            activeTab,
            handleTabChange,
            handleBlogClick,
            formatDate,
            stripHtmlTags,
            isLoading: blogQuery.isLoading,
            error: blogQuery.error,
            allBlogsLoading: allBlogsQuery.isLoading,
        };
    };

    // ========== UTILITIES ==========

    const invalidateBlogs = () => queryClient.invalidateQueries({ queryKey: ['blogs-listing'] });
    const invalidateBlog = (titleId) => queryClient.invalidateQueries({ queryKey: ['blog', titleId] });

    return {
        useBlogs,
        useBlogDetail,
        invalidateBlogs,
        invalidateBlog,
    };
};