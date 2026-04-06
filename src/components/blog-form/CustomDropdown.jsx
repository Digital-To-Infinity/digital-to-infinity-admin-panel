import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomDropdown = ({ value, onChange, options, label, icon, placeholder, onAddOption, onDeleteOption }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newOption, setNewOption] = useState('');
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    const handleAddClick = (e) => {
        e.stopPropagation();
        if (newOption.trim() && onAddOption) {
            onAddOption(newOption.trim());
            setNewOption('');
        }
    };

    const handleDeleteClick = (e, val) => {
        e.stopPropagation();
        if (onDeleteOption) {
            onDeleteOption(val);
        }
    };

    return (
        <div className="space-y-2 relative" ref={dropdownRef}>
            {label && <label className="text-sm font-semibold text-slate-500">{label}</label>}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`ag-input flex items-center justify-between text-left cursor-pointer transition-all h-12 ${isOpen ? 'ring-2 ring-primary/20 border-primary ring-offset-0' : ''
                    }`}
            >
                <div className="flex items-center space-x-3">
                    {icon && <span className="text-slate-400">{icon}</span>}
                    <span className={value ? 'text-black font-semibold' : 'text-slate-400'}>
                        {selectedOption ? selectedOption.label : (placeholder || 'Select Option')}
                    </span>
                </div>
                <ChevronDown
                    className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    size={18}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden py-2 glass-effect shadow-2xl"
                    >
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {options.map((option) => {
                                const isSelected = value === option.value;
                                return (
                                    <div key={option.value} className="relative group/item">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(option.value);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 group ${isSelected
                                                    ? 'text-primary bg-primary-light font-bold'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3 pr-16 text-left">
                                                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isSelected ? 'bg-primary scale-125' : 'bg-slate-200 group-hover:bg-primary/40'
                                                    }`} />
                                                <span className="truncate max-w-[180px]">{option.label}</span>
                                            </div>
                                        </button>
                                        
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="bg-primary/10 p-1 rounded-full"
                                                >
                                                    <Check size={14} className="text-primary" strokeWidth={3} />
                                                </motion.div>
                                            )}
                                            {onDeleteOption && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteClick(e, option.value)}
                                                    className="opacity-0 group-hover/item:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {onAddOption && (
                            <div className="p-2 mt-2 border-t border-slate-100 space-y-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={newOption}
                                        onChange={(e) => setNewOption(e.target.value)}
                                        placeholder="Add new category..."
                                        className="w-full pl-3 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary transition-all"
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddClick(e);
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddClick}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-md transition-all"
                                    >
                                        <Plus size={16} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomDropdown;
