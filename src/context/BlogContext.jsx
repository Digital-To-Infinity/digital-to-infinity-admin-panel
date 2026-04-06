import { createContext, useContext, useState, useEffect } from 'react';

const BlogContext = createContext();

const STORAGE_KEY = 'dti_blogs';
const CATEGORIES_STORAGE_KEY = 'dti_categories';

const DEFAULT_CATEGORIES = [
    { value: 'Market Insights', label: 'Market Insights' },
    { value: 'Buying Guide', label: 'Buying Guide' },
    { value: 'Investment', label: 'Investment' },
    { value: 'Lifestyle', label: 'Lifestyle' },
    { value: 'Real Estate News', label: 'Real Estate News' }
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

