import { useBlogs } from '../context/BlogContext';
import { motion } from 'framer-motion';
import {
    FileText,
    CheckCircle,
    Clock,
    ArrowUpRight,
    ChevronRight,
    Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { blogs } = useBlogs();

    const total = blogs.length;
    const published = blogs.filter(b => b.status === 'published').length;
    const drafts = blogs.filter(b => b.status === 'draft').length;

    const stats = [
        {
            label: 'Total Blogs',
            value: total,
            icon: <FileText size={20} />,
            trendUp: true,
            color: 'bg-primary/10 text-primary'
        },
        {
            label: 'Published',
            value: published,
            icon: <CheckCircle size={20} />,
            trendUp: true,
            color: 'bg-emerald-50 text-emerald-600'
        },
        {
            label: 'Drafts',
            value: drafts,
            icon: <Clock size={20} />,
            trendUp: false,
            color: 'bg-amber-50 text-amber-600'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10 pb-10"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview of your blog's performance.</p>
                </div>
                <Link to="/admin-panel/add" className="ag-button inline-flex items-center space-x-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                    <Plus size={18} />
                    <span>New Post</span>
                </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <motion.div
                        key={stat.label}
                        whileHover={{ y: -5 }}
                        className="ag-card p-6 flex items-start justify-between group cursor-default border-none shadow-slate-100"
                    >
                        <div className="space-y-4">
                            <div className={`p-3 rounded-xl w-fit ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <div className="flex items-baseline space-x-2">
                                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                        <div className="h-10 w-20 flex items-end justify-between space-x-1">
                            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
                                    className={`w-1 rounded-full ${stat.trendUp ? 'bg-emerald-500/20 group-hover:bg-emerald-500/40' : 'bg-rose-500/20 group-hover:bg-rose-500/40'} transition-colors`}
                                />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed Section */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                    <div className="ag-card overflow-hidden border-none shadow-slate-100">
                        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-slate-800 text-lg">Latest Content</h3>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider">Recent</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link to="/admin-panel/all" className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center group">
                                    Manage All <ChevronRight size={14} className="ml-0.5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {blogs.slice(0, 5).map((blog, idx) => (
                                <motion.div
                                    key={blog.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    className="p-5 hover:bg-slate-50/80 transition-all group flex flex-col sm:flex-row sm:items-center gap-4"
                                >
                                    <div className="relative w-20 h-20 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                        <img src={blog.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{blog.category}</span>
                                            <span className="text-[10px] text-slate-300">•</span>
                                            <span className="text-[10px] text-slate-400 font-medium uppercase">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-base truncate group-hover:text-primary transition-colors">{blog.title}</h4>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                                        <span className={`ag-badge ${blog.status === 'published' ? 'ag-badge-published' : 'ag-badge-draft'}`}>
                                            {blog.status}
                                        </span>
                                        <button className="p-2 text-slate-300 hover:text-primary hover:bg-primary-light rounded-lg transition-all">
                                            <ArrowUpRight size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Sidebar Section */}
                <div className="space-y-8">
                    {/* Category Distribution */}
                    <motion.div variants={itemVariants} className="ag-card p-6 space-y-6 border-none shadow-slate-100">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 italic uppercase tracking-wider text-sm">Blog Categories</h3>
                        </div>
                        <div className="space-y-5">
                            {(() => {
                                const categoriesList = [
                                    { label: 'Lifestyle', value: 'lifestyle', color: 'bg-rose-500' },
                                    { label: 'Pranayama', value: 'pranayama', color: 'bg-blue-500' },
                                    { label: 'Wellness', value: 'wellness', color: 'bg-emerald-500' },
                                    { label: 'Yoga Therapy', value: 'yoga-therapy', color: 'bg-amber-500' },
                                    { label: 'Meditation', value: 'meditation', color: 'bg-purple-500' },
                                    { label: 'Ayurveda', value: 'ayurveda', color: 'bg-teal-500' },
                                    { label: 'Practice', value: 'practice', color: 'bg-indigo-500' },
                                    { label: 'Mental Health', value: 'mental-health', color: 'bg-pink-500' },
                                    { label: 'Philosophy', value: 'philosophy', color: 'bg-cyan-500' },
                                ];

                                const publishedBlogs = blogs.filter(b => b.status === 'published');
                                const totalPublished = publishedBlogs.length;

                                return categoriesList.map((item, i) => {
                                    const count = publishedBlogs.filter(b =>
                                        b.category?.toLowerCase() === item.value ||
                                        b.category?.toLowerCase() === item.label.toLowerCase()
                                    ).length;
                                    const val = totalPublished > 0 ? Math.round((count / totalPublished) * 100) : 0;

                                    return (
                                        <div key={item.label} className="space-y-2">
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span className="text-slate-600">{item.label}</span>
                                                <span className="text-slate-400">{count}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${val}%` }}
                                                    transition={{ delay: 0.8 + (i * 0.1), duration: 1, ease: "easeOut" }}
                                                    className={`h-full ${item.color} rounded-full`}
                                                />
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
