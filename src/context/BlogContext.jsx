import { createContext, useContext, useState, useEffect } from 'react';

const BlogContext = createContext();

const STORAGE_KEY = 'dti_blogs';

export const BlogProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load blogs from localStorage
        const savedBlogs = localStorage.getItem(STORAGE_KEY);
        if (savedBlogs) {
            setBlogs(JSON.parse(savedBlogs));
        }
        setLoading(false);
    }, []);

    const saveToStorage = (updatedBlogs) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBlogs));
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

    return (
        <BlogContext.Provider value={{ blogs, addBlog, deleteBlog, updateBlog, updateBlogStatus, loading }}>
            {children}
        </BlogContext.Provider>
    );
};

export const useBlogs = () => useContext(BlogContext);

