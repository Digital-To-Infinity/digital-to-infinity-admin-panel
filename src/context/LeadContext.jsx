import { createContext, useContext, useState, useEffect } from 'react';

const LeadContext = createContext();

const ENQUIRIES_STORAGE_KEY = 'dti_enquiries';
const ONBOARDING_STORAGE_KEY = 'dti_onboarding';

const DEFAULT_ENQUIRIES = [
  { 
    id: '1', 
    name: 'Rahul Sharma', 
    email: 'rahul.s@example.com', 
    phone: '+91 98765 43210', 
    companyName: 'Sharma & Sons',
    category: 'Real Estate', 
    source: 'Main Form',
    status: 'Pending', 
    date: '2026-03-22', 
    message: 'I am interested in SEO services for my real estate portal.' 
  },
  { 
    id: '2', 
    name: 'Anjali Gupta', 
    email: 'anjali@example.com', 
    phone: '+91 91234 56789', 
    companyName: 'Gupta Healthcare',
    category: 'Healthcare', 
    source: 'Popup',
    status: 'Resolved', 
    date: '2026-03-21', 
    message: 'Looking for social media management.' 
  }
];

const DEFAULT_ONBOARDING = [
  {
    id: '1',
    status: 'Pending',
    date: '2026-03-25',
    businessInfo: {
      businessName: 'Organic Harvest',
      industry: 'E-commerce',
      establishmentYear: '2022',
      description: 'D2C brand for organic food products.',
      website: 'https://organicharvest.com',
      address: 'Mumbai, Maharashtra'
    },
    contactDetails: {
      contactName: 'Suresh Kumar',
      designation: 'Founder',
      email: 'suresh@organic.com',
      mobile: '+91 98765 43211',
      whatsapp: '+91 98765 43211'
    },
    goals: {
      primaryGoal: 'Sales',
      pastExperience: 'Yes',
      previousAgency: 'X-Agency',
      reasonSwitching: 'Looking for better ROAS'
    },
    packageDetails: {
      selectedPackage: 'Premium Starter Pack'
    }
  }
];

export const LeadProvider = ({ children }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [onboardingLeads, setOnboardingLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedEnquiries = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
    if (savedEnquiries) {
      setEnquiries(JSON.parse(savedEnquiries));
    } else {
      setEnquiries(DEFAULT_ENQUIRIES);
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(DEFAULT_ENQUIRIES));
    }

    const savedOnboarding = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (savedOnboarding) {
      setOnboardingLeads(JSON.parse(savedOnboarding));
    } else {
      setOnboardingLeads(DEFAULT_ONBOARDING);
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(DEFAULT_ONBOARDING));
    }

    setLoading(false);
  }, []);

  const addEnquiry = (enquiry) => {
    const newEnquiry = {
      ...enquiry,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    const updated = [newEnquiry, ...enquiries];
    setEnquiries(updated);
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  };

  const updateEnquiryStatus = (id, status) => {
    const updated = enquiries.map(e => e.id === id ? { ...e, status } : e);
    setEnquiries(updated);
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteEnquiry = (id) => {
    const updated = enquiries.filter(e => e.id !== id);
    setEnquiries(updated);
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  };

  const addOnboarding = (data) => {
    const newOnboarding = {
      ...data,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    const updated = [newOnboarding, ...onboardingLeads];
    setOnboardingLeads(updated);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(updated));
  };

  const updateOnboardingStatus = (id, status) => {
    const updated = onboardingLeads.map(e => e.id === id ? { ...e, status } : e);
    setOnboardingLeads(updated);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteOnboarding = (id) => {
    const updated = onboardingLeads.filter(e => e.id !== id);
    setOnboardingLeads(updated);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <LeadContext.Provider value={{
      enquiries,
      onboardingLeads,
      addEnquiry,
      updateEnquiryStatus,
      deleteEnquiry,
      addOnboarding,
      updateOnboardingStatus,
      deleteOnboarding,
      loading
    }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => useContext(LeadContext);
