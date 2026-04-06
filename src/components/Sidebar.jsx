import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FilePlus2,
    FileText,
    Files,
    LayoutList,
    LogOut,
    X,
    User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/logo.png';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin-panel' },
        { name: 'Add New Blog', icon: <FilePlus2 size={20} />, path: '/admin-panel/add' },
        { name: 'All Blogs', icon: <LayoutList size={20} />, path: '/admin-panel/all-blogs' },
        { name: 'Published', icon: <FileText size={20} />, path: '/admin-panel/published' },
        { name: 'Drafts', icon: <Files size={20} />, path: '/admin-panel/drafts' },
        { name: 'Users', icon: <User size={20} />, path: '/admin-panel/users' }
    ];

    return (
        <aside className={`
      fixed top-0 left-0 h-full bg-white border-r border-slate-100 z-40 transition-all duration-300
      ${isOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0'}
    `}>
            <div className="flex flex-col h-full overflow-hidden">
                {/* Logo */}
                <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center">
                        <img src={logo} alt="Digital to Infinity" className="h-15 w-auto" />
                    </div>
                    <button className="md:hidden p-2 hover:bg-slate-50 rounded-lg transition-colors" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === '/admin-panel'}
                            onClick={() => {
                                if (window.innerWidth < 768) onClose();
                            }}
                            className={({ isActive }) => `
                sidebar-item
                ${isActive ? 'active' : ''}
              `}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`shrink-0 ${isActive ? 'text-primary' : 'text-black'}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-sm ${isActive ? 'text-primary' : 'text-black'}`}>{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-slate-50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-black hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    >
                        <LogOut size={20} />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
