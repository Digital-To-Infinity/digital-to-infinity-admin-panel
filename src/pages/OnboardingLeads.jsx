import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useLeads } from '../context/LeadContext';
import {
  Search,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  Clock,
  Briefcase,
  MoreVertical,
  Check,
  X,
  Trash2,
  MessageCircle,
  Copy,
  Tag,
  Globe,
  MapPin,
  Calendar,
  ExternalLink,
  Target,
  Zap,
  Package,
  User
} from 'lucide-react';

const OnboardingLeads = () => {
  const { onboardingLeads, updateOnboardingStatus, deleteOnboarding, loading } = useLeads();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isFocused, setIsFocused] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('down');
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (e, id) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    const availableSpaceBelow = window.innerHeight - rect.bottom;
    const side = (availableSpaceBelow < 300 && rect.top > 300) ? 'up' : 'down';
    setDropdownPosition(side);
    setDropdownCoords({
      top: side === 'up' ? rect.top + window.scrollY : rect.bottom + window.scrollY,
      left: rect.right + window.scrollX
    });
    setOpenDropdownId(id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
    }, 150);
  };

  const filteredLeads = onboardingLeads.filter(lead => {
    const matchesTab = activeTab === 'all' || lead.status.toLowerCase() === activeTab.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      lead.businessInfo.businessName.toLowerCase().includes(searchLower) ||
      lead.contactDetails.contactName.toLowerCase().includes(searchLower) ||
      lead.contactDetails.email.toLowerCase().includes(searchLower);

    return matchesTab && matchesSearch;
  });

  const handleResolve = (id) => {
    updateOnboardingStatus(id, 'Resolved');
    toast.success('Lead marked as onboarded!');
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <Trash2 size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-900">Delete Onboarding Lead?</p>
            <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => {
              deleteOnboarding(id);
              toast.dismiss(t.id);
              toast.success('Lead deleted successfully!');
            }}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[12px] font-black px-4 py-3 rounded-full transition-all cursor-pointer active:scale-95 uppercase tracking-wider"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[12px] font-black px-4 py-3 rounded-full transition-all cursor-pointer active:scale-95 uppercase tracking-wider"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: {
        minWidth: '300px',
        padding: '16px',
        borderRadius: '24px',
        background: '#fff',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      },
    });
    setOpenDropdownId(null);
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 max-[426px]:text-center max-[426px]:text-3xl">Onboarding Leads</h1>
        <p className="text-slate-500 max-[426px]:hidden">Detailed business information from new client signups.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="ag-card p-6 max-[769px]:p-4 max-[426px]:p-6 flex items-center space-x-4 border-l-4 border-primary">
          <div className="p-3 bg-primary/10 text-primary rounded-xl"><Zap size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Leads</p>
            <p className="text-xl font-bold text-black">{onboardingLeads.length}</p>
          </div>
        </div>
        <div className="ag-card p-6 max-[769px]:p-4 max-[426px]:p-6 flex items-center space-x-4 border-l-4 border-amber-500">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Pending Setup</p>
            <p className="text-xl font-bold text-black">{onboardingLeads.filter(i => i.status === 'Pending').length}</p>
          </div>
        </div>
        <div className="ag-card p-6 max-[769px]:p-4 max-[426px]:p-6 flex items-center space-x-4 border-l-4 border-emerald-500">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Onboarded</p>
            <p className="text-xl font-bold text-black">{onboardingLeads.filter(i => i.status === 'Resolved').length}</p>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col nav:flex-row nav:items-center justify-between gap-6">
        <div className="flex items-center bg-white p-1 rounded-full border border-slate-100 w-full nav:w-fit overflow-x-auto no-scrollbar shrink-0">
          {['all', 'pending', 'resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 nav:flex-none px-4 nav:px-10 py-2.5 rounded-full text-sm font-semibold capitalize transition-all cursor-pointer whitespace-nowrap
                ${activeTab === tab
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-500 hover:text-black hover:bg-slate-50'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-3 group w-full nav:w-auto">
          <div className="relative w-full">
            <motion.div
              initial={false}
              animate={{ width: windowWidth <= 769 ? '100%' : ((searchTerm || isFocused) ? '400px' : '280px') }}
              className="relative flex items-center"
            >
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${(searchTerm || isFocused) ? 'text-primary' : 'text-slate-500'}`}
                size={18}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search business, contact name..."
                className="w-full bg-white border border-slate-200 rounded-full py-2.5 pl-11 pr-10 text-sm focus:ring-primary focus:border-primary focus:outline-none transition-all placeholder:text-slate-500 hover:border-slate-300"
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 p-1 hover:bg-slate-100 rounded-lg text-black transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="ag-card p-6 max-[426px]:p-4 hover:border-primary/30 transition-all group relative">
            <div className="flex flex-col space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold">
                      {lead.businessInfo.businessName.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-black">{lead.businessInfo.businessName}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-primary/5 text-primary border-primary/20">
                          Onboarding
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">Submitted on {lead.date}</p>
                    </div>
                  </div>
                  <div>
                    {lead.status === 'Resolved' ? (
                      <span className="ag-badge ag-badge-published">Onboarded</span>
                    ) : (
                      <span className="ag-badge ag-badge-draft">Pending</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 text-sm">
                  <div className="flex items-center text-slate-600 font-medium"><User size={16} className="mr-2 text-primary" /> {lead.contactDetails.contactName}</div>
                  <div className="flex items-center text-slate-600 font-medium"><Mail size={16} className="mr-2 text-primary" /> {lead.contactDetails.email}</div>
                  <div className="flex items-center text-slate-600 font-medium"><Tag size={16} className="mr-2 text-primary" /> {lead.businessInfo.industry}</div>
                </div>

                <div className="flex items-center text-slate-900 font-semibold text-left">
                  <Package size={16} className="mr-2 text-primary" /> Selected Package: {lead.packageDetails.selectedPackage}
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-base text-slate-700 leading-relaxed text-left line-clamp-2">
                  {lead.businessInfo.description || "No description provided."}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-row items-center justify-between w-full border-t border-slate-100 pt-6">
                <div>
                  <button
                    onClick={() => { setSelectedLead(lead); setIsModalOpen(true); }}
                    className="flex items-center bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    View Full Details
                  </button>
                </div>

                <div className="relative">
                  <button
                    onMouseEnter={(e) => handleMouseEnter(e, lead.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === lead.id ? null : lead.id);
                    }}
                    className={`p-2.5 transition-colors rounded-full border cursor-pointer ${openDropdownId === lead.id ? 'bg-slate-100 text-black border-slate-200' : 'text-slate-500 hover:text-slate-800 bg-white border-slate-200 hover:bg-slate-50'}`}
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedLead && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center text-xl font-black">{selectedLead.businessInfo.businessName.charAt(0)}</div>
                   <div>
                     <h2 className="text-2xl font-black text-slate-900">{selectedLead.businessInfo.businessName}</h2>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedLead.businessInfo.industry} • Established {selectedLead.businessInfo.establishmentYear || 'N/A'}</p>
                   </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
              </div>

              <div className="p-8 overflow-y-auto no-scrollbar space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                   <div className="space-y-6">
                      <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2"><Building2 size={16}/> Business Summary</h3>
                      <p className="text-slate-600 font-medium leading-relaxed">{selectedLead.businessInfo.description || "No description provided."}</p>
                      <div className="space-y-3">
                         <div className="flex items-center gap-3 text-sm font-bold text-slate-700"><Globe size={16} className="text-slate-400"/> {selectedLead.businessInfo.website || "No website"}</div>
                         <div className="flex items-center gap-3 text-sm font-bold text-slate-700"><MapPin size={16} className="text-slate-400"/> {selectedLead.businessInfo.address}</div>
                      </div>
                   </div>
                   <div className="space-y-6 text-left">
                      <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2"><Briefcase size={16}/> Contact Person</h3>
                      <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name & Position</p>
                            <p className="font-bold text-slate-900">{selectedLead.contactDetails.contactName} ({selectedLead.contactDetails.designation || 'Owner'})</p>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                               <p className="text-xs font-bold text-slate-900 truncate">{selectedLead.contactDetails.email}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile</p>
                               <p className="text-xs font-bold text-slate-900">{selectedLead.contactDetails.mobile}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                   <div className="space-y-6">
                      <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2"><Target size={16}/> Strategic Goals</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-black uppercase tracking-widest">{selectedLead.goals.primaryGoal}</span>
                           <span className="text-xs font-bold text-slate-500">primary objective</span>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl">
                           <p className="text-xs font-bold text-slate-500 leading-relaxed italic">" {selectedLead.goals.reasonSwitching || "No switching reason provided."} "</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Past Experience: {selectedLead.goals.pastExperience} {selectedLead.goals.previousAgency && `(with ${selectedLead.goals.previousAgency})`}</p>
                        </div>
                      </div>
                   </div>
                   <div className="space-y-6 text-left">
                      <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2"><Package size={16}/> Selected Solution</h3>
                      <div className="p-8 bg-black text-white rounded-[40px] relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/40 transition-all" />
                         <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Package Choice</p>
                         <h4 className="text-2xl font-black italic">{selectedLead.packageDetails.selectedPackage}</h4>
                         <button className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-white transition-colors">Generate Proposal <ExternalLink size={14}/></button>
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                 <button onClick={() => handleDelete(selectedLead.id)} className="text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded-xl transition-all">Discard Lead</button>
                 <div className="flex gap-4">
                    <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Close</button>
                    {selectedLead.status === 'Pending' && (
                      <button onClick={() => { handleResolve(selectedLead.id); setIsModalOpen(false); }} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all">Approve & Onboard</button>
                    )}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Action Dropdown Portal */}
      {createPortal(
        <AnimatePresence>
          {openDropdownId && (
            <div className="fixed inset-0 z-[9999] pointer-events-none" onClick={() => setOpenDropdownId(null)}>
              <div className="relative w-full h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: dropdownPosition === 'up' ? 10 : -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: dropdownPosition === 'up' ? 10 : -10 }}
                  onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); }}
                  onMouseLeave={handleMouseLeave}
                  ref={dropdownRef}
                  style={{
                    position: 'absolute',
                    top: dropdownPosition === 'up' ? dropdownCoords.top - window.scrollY - 8 : dropdownCoords.top - window.scrollY + 8,
                    left: dropdownCoords.left - 224,
                    transformOrigin: dropdownPosition === 'up' ? 'bottom right' : 'top right',
                  }}
                  className={`pointer-events-auto w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-2 text-left ${dropdownPosition === 'up' ? '-translate-y-full' : ''}`}
                >
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lead Actions</p>
                  </div>
                  <button onClick={() => { const lead = onboardingLeads.find(l => l.id === openDropdownId); setSelectedLead(lead); setIsModalOpen(true); setOpenDropdownId(null); }} className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer">
                    <ExternalLink size={16} /> <span>View Details</span>
                  </button>
                  <button onClick={() => { const l = onboardingLeads.find(ld => ld.id === openDropdownId); navigator.clipboard.writeText(`Business: ${l.businessInfo.businessName}\nContact: ${l.contactDetails.contactName}\nEmail: ${l.contactDetails.email}\nPackage: ${l.packageDetails.selectedPackage}`); toast.success('Details copied!'); setOpenDropdownId(null); }} className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer">
                    <Copy size={16} /> <span>Copy Details</span>
                  </button>
                  <button onClick={() => handleDelete(openDropdownId)} className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                    <Trash2 size={16} /> <span>Delete Lead</span>
                  </button>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default OnboardingLeads;
