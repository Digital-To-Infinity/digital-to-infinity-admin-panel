import { useState } from 'react';
import { useBlogs } from '../context/BlogContext';
import { Link } from 'react-router-dom';
import { Trash2, Edit3, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogList = ({ statusFilter = 'all', title = 'All Posts' }) => {
    const { blogs, deleteBlog } = useBlogs();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBlogs = blogs.filter(blog => {
        const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (blog.category && blog.category.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
        >
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{title}</h1>
                    <p className="text-slate-500 mt-1">Manage your blog content repository.</p>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border-none shadow-sm rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 w-48 focus:w-64 transition-all outline-none"
                        />
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm overflow-hidden border-none text-black">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-50">
                                <th className="px-6 py-4">Article</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date Created</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredBlogs.length > 0 ? (
                                filteredBlogs.map((blog, idx) => (
                                    <motion.tr
                                        key={blog.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                                                    <img src={blog.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <span className="font-bold text-slate-800 text-sm truncate max-w-[250px]">{blog.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                                                {blog.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`ag-badge ${blog.status === 'published' ? 'ag-badge-published' : 'ag-badge-draft'}`}>
                                                {blog.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-400 font-medium">
                                            {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end space-x-1 transition-opacity">
                                                <Link
                                                    to={`/admin-panel/edit/${blog.id}`}
                                                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary-light rounded-lg transition-all cursor-pointer"
                                                >
                                                    <Edit3 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => deleteBlog(blog.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-medium italic">
                                        No articles found in this section.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default BlogList;
