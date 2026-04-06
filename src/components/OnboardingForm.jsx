import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeads } from '../context/LeadContext';
import { toast } from 'react-hot-toast';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Instagram, 
  Facebook, 
  Search, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Target, 
  Package, 
  ArrowRight, 
  ArrowLeft,
  Briefcase
} from 'lucide-react';

const INDUSTRIES = ['E-commerce', 'Real Estate', 'Healthcare', 'Education', 'Technology', 'Manufacturing', 'Retail', 'Others'];
const GOALS = ['Leads', 'Sales', 'Brand Awareness', 'Traffic'];
const PACKAGES = ['Premium Starter Pack', 'Business Website', 'E-commerce Solutions', 'Digital Marketing Monthly', 'SEO Mastery', 'Custom Enterprise'];

const OnboardingForm = () => {
  const { addOnboarding } = useLeads();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Business Info
    businessName: '',
    industry: '',
    otherIndustry: '',
    establishmentYear: '',
    description: '',
    website: '',
    googleProfile: '',
    facebookLink: '',
    instagramLink: '',
    address: '',
    // Step 2: Contact Details
    contactName: '',
    designation: '',
    email: '',
    mobile: '',
    whatsapp: '',
    // Step 3: Goals
    primaryGoal: '',
    pastExperience: '',
    previousAgency: '',
    reasonSwitching: '',
    // Step 4: Package
    selectedPackage: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const submission = {
        businessInfo: {
          businessName: formData.businessName,
          industry: formData.industry === 'Others' ? formData.otherIndustry : formData.industry,
          establishmentYear: formData.establishmentYear,
          description: formData.description,
          website: formData.website,
          googleProfile: formData.googleProfile,
          fbLink: formData.facebookLink,
          instaLink: formData.instagramLink,
          address: formData.address
        },
        contactDetails: {
          contactName: formData.contactName,
          designation: formData.designation,
          email: formData.email,
          mobile: formData.mobile,
          whatsapp: formData.whatsapp
        },
        goals: {
          primaryGoal: formData.primaryGoal,
          pastExperience: formData.pastExperience,
          previousAgency: formData.previousAgency,
          reasonSwitching: formData.reasonSwitching
        },
        packageDetails: {
          selectedPackage: formData.selectedPackage
        }
      };

      addOnboarding(submission);
      toast.success('Onboarding details submitted! We will contact you shortly.');
      setStep(5); // Success state
    } catch (error) {
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Business Name *</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input required name="businessName" value={formData.businessName} onChange={handleChange} className="ag-input pl-11" placeholder="Legal Entity Name" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Industry *</label>
          <select required name="industry" value={formData.industry} onChange={handleChange} className="ag-input">
            <option value="" disabled>Select Industry</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        {formData.industry === 'Others' && (
          <div className="space-y-2 md:col-span-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Specify Industry *</label>
             <input required name="otherIndustry" value={formData.otherIndustry} onChange={handleChange} className="ag-input" placeholder="Your industry type" />
          </div>
        )}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Establishment Year</label>
          <input type="number" name="establishmentYear" value={formData.establishmentYear} onChange={handleChange} className="ag-input" placeholder="e.g. 2020" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Website URL</label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input name="website" value={formData.website} onChange={handleChange} className="ag-input pl-11" placeholder="https://..." />
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Business Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="ag-input h-24 pt-4" placeholder="Briefly describe what you do..." />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Business Address *</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
            <textarea required name="address" value={formData.address} onChange={handleChange} className="ag-input h-24 pl-11 pt-4" placeholder="Full legal address" />
          </div>
        </div>
      </div>
      <button type="button" onClick={nextStep} className="w-full bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2">
        <span>Continue to Contact Details</span>
        <ArrowRight size={18} />
      </button>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Contact Person Name *</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input required name="contactName" value={formData.contactName} onChange={handleChange} className="ag-input pl-11" placeholder="Full Name" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Designation</label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input name="designation" value={formData.designation} onChange={handleChange} className="ag-input pl-11" placeholder="e.g. CEO, Marketing Head" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address *</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="ag-input pl-11" placeholder="email@business.com" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mobile Number *</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="ag-input pl-11" placeholder="+91 ..." />
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">WhatsApp Number</label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="ag-input pl-11" placeholder="Same as mobile or different" />
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button type="button" onClick={prevStep} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl">Back</button>
        <button type="button" onClick={nextStep} className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2">
          <span>Goals & Expectations</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Primary Goal *</label>
          <div className="grid grid-cols-2 gap-3">
             {GOALS.map(goal => (
               <button 
                 key={goal} 
                 type="button"
                 onClick={() => setFormData(p => ({ ...p, primaryGoal: goal }))}
                 className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${formData.primaryGoal === goal ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-600 border-slate-200'}`}
               >
                 {goal}
               </button>
             ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Worked with an agency before?</label>
          <div className="flex gap-4">
            {['Yes', 'No'].map(opt => (
              <button 
                 key={opt} 
                 type="button"
                 onClick={() => setFormData(p => ({ ...p, pastExperience: opt }))}
                 className={`px-8 py-3 rounded-xl border text-sm font-bold transition-all ${formData.pastExperience === opt ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        {formData.pastExperience === 'Yes' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Previous Agency Name</label>
              <input name="previousAgency" value={formData.previousAgency} onChange={handleChange} className="ag-input" placeholder="Who did you work with?" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Reason for switching?</label>
              <textarea name="reasonSwitching" value={formData.reasonSwitching} onChange={handleChange} className="ag-input h-24 pt-4" placeholder="What could be improved?" />
            </div>
          </motion.div>
        )}
      </div>
      <div className="flex gap-4">
        <button type="button" onClick={prevStep} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl">Back</button>
        <button type="button" onClick={nextStep} className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2">
          <span>Package Selection</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Select Your Package *</label>
        <div className="grid grid-cols-1 gap-3">
          {PACKAGES.map(pkg => (
            <button 
              key={pkg} 
              type="button"
              onClick={() => setFormData(p => ({ ...p, selectedPackage: pkg }))}
              className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all group ${formData.selectedPackage === pkg ? 'bg-primary text-white border-primary shadow-xl' : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.selectedPackage === pkg ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-primary/10 transition-colors'}`}>
                  <Package size={20} className={formData.selectedPackage === pkg ? 'text-white' : 'text-primary'} />
                </div>
                <span className="font-black tracking-tight uppercase text-xs">{pkg}</span>
              </div>
              {formData.selectedPackage === pkg && <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-primary"><Search size={14} /></div>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <button type="button" onClick={prevStep} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl">Back</button>
        <button 
          onClick={handleSubmit} 
          disabled={loading || !formData.selectedPackage} 
          className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>FINISH ONBOARDING</span><ArrowRight size={18} /></>}
        </button>
      </div>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12 space-y-6">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl mb-4">
        ✓
      </div>
      <h2 className="text-3xl font-black text-slate-900">Success!</h2>
      <p className="text-slate-500 max-w-sm mx-auto">Your onboarding information has been received. Our team will review it and get in touch with you to schedule a kick-off meeting.</p>
      <button onClick={() => setStep(1)} className="text-primary font-bold hover:underline">Start Another Onboarding</button>
    </motion.div>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-slate-100 overflow-hidden relative">
      {/* Progress Bar */}
      {step < 5 && (
        <div className="relative mb-12">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex flex-col items-center z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= s ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {s}
                </div>
                <span className={`text-[10px] mt-2 font-black uppercase tracking-widest ${step >= s ? 'text-primary' : 'text-slate-400'}`}>
                  {s === 1 ? 'Business' : s === 2 ? 'Contact' : s === 3 ? 'Goals' : 'Package'}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 -z-0">
            <motion.div 
              className="h-full bg-primary" 
              initial={{ width: '0%' }} 
              animate={{ width: `${((step - 1) / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderSuccess()}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingForm;
