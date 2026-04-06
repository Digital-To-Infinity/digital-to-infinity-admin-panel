import { createContext, useContext, useState, useEffect } from 'react';

const BlogContext = createContext();

const STORAGE_KEY = 'dti_blogs';
const CATEGORIES_STORAGE_KEY = 'dti_categories';

const DEFAULT_CATEGORIES = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'SEO', label: 'SEO' },
    { value: 'Business', label: 'Business' }
];

const DEFAULT_BLOGS = [
    {
        id: '1',
        title: 'The Future of AI in Digital Marketing: 2026 Trends',
        slug: 'future-ai-digital-marketing-2026',
        content: '<p>AI is transforming how we approach marketing. From personalized content to automated data analysis, the landscape is changing fast.</p><h2>Key Trends</h2><ul><li>Generative AI for Content</li><li>Predictive Customer Analytics</li><li>AI-Powered SEO</li></ul>',
        status: 'Published',
        category: 'Technology',
        author: 'Digital Guru',
        authorRole: 'Tech Lead',
        readTime: '6 min read',
        images: ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1170&auto=format&fit=crop'],
        tags: ['AI', 'Marketing', 'Digital Transformation'],
        date: '2026-04-01',
        views: 1250,
        featured: true
    },
    {
        id: '2',
        title: 'Mastering SEO: A Guide for Modern Businesses',
        slug: 'mastering-seo-modern-businesses',
        content: '<p>Search Engine Optimization is not just about keywords anymore; it is about user intent and quality content.</p>',
        status: 'Published',
        category: 'SEO',
        author: 'John Smith',
        authorRole: 'SEO Specialist',
        readTime: '4 min read',
        images: ['https://images.unsplash.com/photo-1432888622747-4eb9a8f2c20e?q=80&w=1170&auto=format&fit=crop'],
        tags: ['SEO', 'Google', 'Strategy'],
        date: '2026-04-05',
        views: 840,
        featured: false
    },
    {
        id: '3',
        title: 'Creating High-Converting Landing Pages',
        slug: 'high-converting-landing-pages',
        content: '<p>A landing page is the first point of contact for many customers. Learn how to optimize it for maximum results.</p>',
        status: 'Draft',
        category: 'Design',
        author: 'Admin',
        authorRole: 'Editor',
        readTime: '5 min read',
        images: ['https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1064&auto=format&fit=crop'],
        tags: ['UX', 'Design', 'CRO'],
        date: '2026-04-06',
        views: 0,
        featured: false
    }
];

export const BlogProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load blogs and categories from localStorage
        const savedBlogs = localStorage.getItem(STORAGE_KEY);
        if (savedBlogs) {
            setBlogs(JSON.parse(savedBlogs));
        } else {
            // Add default blogs if nothing in storage
            setBlogs(DEFAULT_BLOGS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BLOGS));
        }

        const savedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
        if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
        } else {
            setCategories(DEFAULT_CATEGORIES);
        }

        setLoading(false);
    }, []);

    const saveToStorage = (updatedBlogs) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBlogs));
    };

    const saveCategoriesToStorage = (updatedCategories) => {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
    };

    const addBlog = async (blog) => {
        try {
            const newBlog = {
                ...blog,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
            };
            const updatedBlogs = [newBlog, ...blogs];
            setBlogs(updatedBlogs);
            saveToStorage(updatedBlogs);
        } catch (error) {
            console.error("Error adding blog: ", error);
            alert("Failed to add blog. Please try again.");
        }
    };

    const deleteBlog = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog permanently?')) {
            try {
                const updatedBlogs = blogs.filter(blog => blog.id !== id);
                setBlogs(updatedBlogs);
                saveToStorage(updatedBlogs);
            } catch (error) {
                console.error("Error deleting blog: ", error);
                alert("Failed to delete blog.");
            }
        }
    };

    const updateBlog = async (id, updatedBlog) => {
        try {
            const updatedBlogs = blogs.map(blog => 
                blog.id === id ? { ...blog, ...updatedBlog, updatedAt: new Date().toISOString() } : blog
            );
            setBlogs(updatedBlogs);
            saveToStorage(updatedBlogs);
        } catch (error) {
            console.error("Error updating blog: ", error);
            alert("Failed to update blog.");
        }
    };

    const updateBlogStatus = async (id, status) => {
        try {
            const updatedBlogs = blogs.map(blog => 
                blog.id === id ? { ...blog, status } : blog
            );
            setBlogs(updatedBlogs);
            saveToStorage(updatedBlogs);
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };

    const addCategory = (categoryName) => {
        if (!categoryName.trim()) return;
        const exists = categories.some(cat => cat.label.toLowerCase() === categoryName.toLowerCase());
        if (exists) return;

        const newCategory = { value: categoryName, label: categoryName };
        const updatedCategories = [...categories, newCategory];
        setCategories(updatedCategories);
        saveCategoriesToStorage(updatedCategories);
    };

    const deleteCategory = (categoryValue) => {
        if (window.confirm(`Are you sure you want to delete the category "${categoryValue}"?`)) {
            const updatedCategories = categories.filter(cat => cat.value !== categoryValue);
            setCategories(updatedCategories);
            saveCategoriesToStorage(updatedCategories);
        }
    };

    return (
        <BlogContext.Provider value={{ 
            blogs, 
            categories,
            addBlog, 
            deleteBlog, 
            updateBlog, 
            updateBlogStatus, 
            addCategory,
            deleteCategory,
            loading 
        }}>
            {children}
        </BlogContext.Provider>
    );
};

export const useBlogs = () => useContext(BlogContext);

