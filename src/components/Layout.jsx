import  { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';

const Layout = () => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm md:hidden z-30 transition-all"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navbar */}
                <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 md:ml-72 transition-all">
                    <div className="flex items-center flex-1">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 mr-4 md:hidden text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Search Bar */}
                        <div className="relative max-w-md w-full hidden sm:block">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-black placeholder:text-black focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="flex items-center space-x-3 pl-2 md:pl-4 border-l border-slate-100">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-slate-800 leading-none">Digital To Infinity</p>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">Administrator</p>
                            </div>
                            <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary border border-primary/10 select-none">
                                <span className="font-bold">DTI</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 md:ml-72 p-6 md:p-10 transition-all duration-300">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
