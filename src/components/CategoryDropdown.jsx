import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryDropdown = ({ value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
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

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`ag-input flex items-center justify-between text-left cursor-pointer transition-all ${isOpen ? 'ring-2 ring-primary/20 border-primary ring-offset-0' : ''
                    }`}
            >
                <span className={value ? 'text-black' : 'text-slate-400'}>
                    {selectedOption ? selectedOption.label : 'Select Category'}
                </span>
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
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden py-2 glass-effect"
                    >
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {options.map((option) => {
                                const isSelected = value === option.value;
                                return (
                                    <button
                                        key={option.value}
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
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isSelected ? 'bg-primary scale-125' : 'bg-slate-200 group-hover:bg-primary/40'
                                                }`} />
                                            <span>{option.label}</span>
                                        </div>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="bg-primary/10 p-1 rounded-full"
                                            >
                                                <Check size={14} className="text-primary" strokeWidth={3} />
                                            </motion.div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryDropdown;
