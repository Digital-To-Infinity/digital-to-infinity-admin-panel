import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeads } from '../context/LeadContext';
import { toast } from 'react-hot-toast';
import { X, Send, User, Mail, Phone, Building2, ChevronDown, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  'Real Estate',
  'Healthcare',
  'Education',
  'Technology / SaaS',
  'E-Commerce',
  'Manufacturing',
  'Retail',
  'Other'
];

const ContactPopup = ({ isOpen, onClose }) => {
  const { addEnquiry } = useLeads();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: '',
    customCategory: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const submission = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.company,
        category: formData.category === 'Other' ? formData.customCategory : formData.category,
        message: formData.message,
        source: 'Popup'
      };

      addEnquiry(submission);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ name: '', email: '', phone: '', company: '', category: '', customCategory: '', message: '' });
      }, 3000);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl bg-white rounded-[32px] overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X className="text-slate-400" size={24} />
        </button>

        <div className="md:grid md:grid-cols-1 divide-y divide-slate-100">
          <div className="p-8 md:p-10">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-12"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500">We will get back to you shortly.</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-2 underline decoration-primary/30 underline-offset-8">Get Started</h2>
                    <p className="text-slate-500 text-sm font-semibold">Transform your business with Digital-To-Infinity.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input required name="name" value={formData.name} onChange={handleChange} className="ag-input pl-10 text-sm py-3" placeholder="John Doe" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone *</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="ag-input pl-10 text-sm py-3" placeholder="+91 ..." />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input type="email" name="email" value={formData.email} onChange={handleChange} className="ag-input pl-10 text-sm py-3" placeholder="john@email.com" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Company *</label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input required name="company" value={formData.company} onChange={handleChange} className="ag-input pl-10 text-sm py-3" placeholder="Your Business" />
                        </div>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Industry *</label>
                        <div className="relative">
                          <select required name="category" value={formData.category} onChange={handleChange} className="ag-input pl-4 pr-10 text-sm py-3 appearance-none cursor-pointer">
                            <option value="" disabled>Select category</option>
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {formData.category === 'Other' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-1 overflow-hidden">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Specify *</label>
                          <input required name="customCategory" value={formData.customCategory} onChange={handleChange} className="ag-input text-sm py-3" placeholder="Your industry" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Goals</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} className="ag-input text-sm py-3 h-24 resize-none" placeholder="What are your expectations?" />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-black text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] mt-4"
                    >
                      {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>SEND REQUEST</span><Send size={16} /></>}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default ContactPopup;
