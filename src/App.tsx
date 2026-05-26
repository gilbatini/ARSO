import React, { useState, useEffect, useMemo } from "react";
import { 
  Building, 
  MapPin, 
  Calendar, 
  Award, 
  Layers, 
  FileText, 
  Download, 
  ArrowRight, 
  MessageSquare, 
  Menu, 
  X, 
  User, 
  Check, 
  Plus, 
  Database, 
  BookOpen, 
  Info, 
  ShieldAlert, 
  Plane, 
  Bus, 
  Hotel as HotelIcon, 
  ChevronRight,
  PhoneCall,
  Search,
  CheckCircle,
  HelpCircle,
  Clock,
  QrCode,
  Map as MapIcon,
  Mail,
  Sparkles
} from "lucide-react";
import { MOCK_SESSIONS, MOCK_RESOURCES, MOCK_HOTELS, MOCK_SHUTTLES } from "./data";
import { Session, ResourceItem, Hotel, AttendeeProfile } from "./types";
import DocumentReader from "./components/DocumentReader";
import SchedulePanel from "./components/SchedulePanel";
import PortalDashboard from "./components/PortalDashboard";
import { motion, AnimatePresence } from "motion/react";

import arsoLogo from "./assets/images/arso_logo_1779808470136.png";
import arsoBanner from "./assets/images/arso_banner_1779808489988.png";

// Default profile for the demo prefill
const DEFAULT_PREFILL_PROFILE: AttendeeProfile = {
  email: "sarah.nakato@test.arso.org",
  fullName: "Sarah Nakato",
  organization: "Uganda National Bureau of Standards (UNBS)",
  role: "Lead Quality Liaison Engineer",
  country: "Uganda",
  badgeCode: "ARSO-32GA-25921-UG",
  dietaryPreferences: "Halal & Gluten-free",
  galaAttendance: "attending",
  phoneNumber: "+256 701 445522",
  isAdmin: false
};

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // App primary States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("arso_logged_in") === "true";
  });
  
  const [userProfile, setUserProfile] = useState<AttendeeProfile | null>(() => {
    const cached = localStorage.getItem("arso_user_profile");
    if (cached) return JSON.parse(cached);
    return DEFAULT_PREFILL_PROFILE; // Fallback to prefabricated demo user
  });

  const [myScheduleIds, setMyScheduleIds] = useState<string[]>(() => {
    const cached = localStorage.getItem("arso_schedule_ids");
    return cached ? JSON.parse(cached) : ["sess-1", "sess-2"]; // default sample sessions pre-assigned
  });

  const [myBookmarkIds, setMyBookmarkIds] = useState<string[]>(() => {
    const cached = localStorage.getItem("arso_bookmark_ids");
    return cached ? JSON.parse(cached) : ["res-standards"]; // default technical bookmarked paper
  });

  // UI state managers
  const [activeReaderDoc, setActiveReaderDoc] = useState<ResourceItem | null>(null);
  const [selectedVenueZone, setSelectedVenueZone] = useState<string>("plenary");
  const [shuttleSearch, setShuttleSearch] = useState("");
  const [hotelSearch, setHotelSearch] = useState("");
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);
  const [registrationMode, setRegistrationMode] = useState(false);

  // BRAND NEW: Bento Dashboard Interactive States
  const [hospitalityBentoTab, setHospitalityBentoTab] = useState<"shuttles" | "hotels">("shuttles");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("UG");
  const [votesState, setVotesState] = useState<Record<string, "approve" | "reject" | "">>({
    "thc-1": "",
    "thc-3": "",
    "thc-4": "",
    "thc-13": ""
  });
  const [votesTally, setVotesTally] = useState<Record<string, { yes: number; no: number }>>({
    "thc-1": { yes: 84, no: 12 },
    "thc-3": { yes: 73, no: 18 },
    "thc-4": { yes: 91, no: 4 },
    "thc-13": { yes: 65, no: 22 }
  });

  const SOVEREIGN_MEMBERS = useMemo(() => [
    {
      country: "Uganda",
      code: "UG",
      bureau: "UNBS",
      fullName: "Uganda National Bureau of Standards",
      director: "James N. Kasigwa",
      headquarters: "Kampala, Uganda",
      activeStandards: 412,
      flag: "🇺🇬",
      alignment: 92
    },
    {
      country: "Kenya",
      code: "KE",
      bureau: "KEBS",
      fullName: "Kenya Bureau of Standards",
      director: "Esther Ngari",
      headquarters: "Nairobi, Kenya",
      activeStandards: 384,
      flag: "🇰🇪",
      alignment: 89
    },
    {
      country: "South Africa",
      code: "ZA",
      bureau: "SABS",
      fullName: "South African Bureau of Standards",
      director: "Jodi Scholtz",
      headquarters: "Pretoria, South Africa",
      activeStandards: 445,
      flag: "🇿🇦",
      alignment: 94
    },
    {
      country: "Nigeria",
      code: "NG",
      bureau: "SON",
      fullName: "Standards Organisation of Nigeria",
      director: "Dr. Ifeanyi Okeke",
      headquarters: "Abuja, Nigeria",
      activeStandards: 367,
      flag: "🇳🇬",
      alignment: 85
    },
    {
      country: "Ghana",
      code: "GH",
      bureau: "GSA",
      fullName: "Ghana Standards Authority",
      director: "Prof. Alex Dodoo",
      headquarters: "Accra, Ghana",
      activeStandards: 320,
      flag: "🇬🇭",
      alignment: 88
    },
    {
      country: "Egypt",
      code: "EG",
      bureau: "EOS",
      fullName: "Egyptian Organization for Standardization",
      director: "Dr. Khaled Sophi",
      headquarters: "Cairo, Egypt",
      activeStandards: 395,
      flag: "🇪🇬",
      alignment: 91
    }
  ], []);

  const THC_LIST = useMemo(() => [
    {
      id: "thc-1",
      name: "THC 01: Agriculture & Food Standards",
      lead: "KEBS (Kenya)",
      activeDraft: "ARSO/THC-01/D1/22-2026",
      description: "Aligns grain moisture ratios, standard packaging formats, and phytosanitary (SPS) rules to trigger tariff-free inter-state exchange.",
      impact: "Critical (Continental Food Security)"
    },
    {
      id: "thc-3",
      name: "THC 03: Building materials & Steel",
      lead: "SABS (South Africa)",
      activeDraft: "ARSO/THC-03/D5/41-2026",
      description: "Synchronizes structural Portland cement parameters, concrete load tolerances, and manufactured steel tensile metrics.",
      impact: "High (Intra-African Infrastructure)"
    },
    {
      id: "thc-4",
      name: "THC 04: Electrotechnical Equipment",
      lead: "SON (Nigeria)",
      activeDraft: "ARSO/THC-04/D2/12-2026",
      description: "Establishes testing benchmarks and single certifying tolerances for off-grid distribution transformers and solar hybrid inverters.",
      impact: "Critical (Sovereign Power Grids)"
    },
    {
      id: "thc-13",
      name: "THC 13: African Traditional Medicines",
      lead: "GSA (Ghana)",
      activeDraft: "ARSO/THC-13/D3/07-2026",
      description: "Sets rigid quality standards, active marker indexes, and safe pharmaceutical packaging codes for indigenous phytomedicines.",
      impact: "Medium (Public Health & Pharmacopeia)"
    }
  ], []);

  const handleCastConsensusVote = (thcId: string, type: "approve" | "reject") => {
    const currentVote = votesState[thcId];
    if (currentVote === type) return; // already voted this option

    setVotesState(prev => ({
      ...prev,
      [thcId]: type
    }));

    setVotesTally(prev => {
      const tally = { ...prev[thcId] };
      
      // Undoing previous vote if any
      if (currentVote === "approve") tally.yes -= 1;
      if (currentVote === "reject") tally.no -= 1;

      // Adding new vote
      if (type === "approve") tally.yes += 1;
      if (type === "reject") tally.no += 1;

      return {
        ...prev,
        [thcId]: tally
      };
    });
  };
  
  // Custom Registration Fields state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regOrg, setRegOrg] = useState("");
  const [regRole, setRegRole] = useState("");
  const [regCountry, setRegCountry] = useState("Uganda");

  // Sign In inputs state
  const [loginEmail, setLoginEmail] = useState("sarah.nakato@test.arso.org");
  const [loginPassword, setLoginPassword] = useState("password123");
  const [loginError, setLoginError] = useState("");

  // Contact Secretariat input state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");

  // Live clock ticker + real-time East Africa Time state ( Kampala ) - "Add more life"
  const [kampalaTime, setKampalaTime] = useState("");
  const [kampalaDate, setKampalaDate] = useState("");

  // Countdown clock state
  const [countdown, setCountdown] = useState({
    days: "19",
    hours: "07",
    minutes: "27",
    seconds: "19"
  });

  // Synchronize localStorage references upon state edits
  useEffect(() => {
    localStorage.setItem("arso_logged_in", isLoggedIn ? "true" : "false");
    localStorage.setItem("arso_schedule_ids", JSON.stringify(myScheduleIds));
    localStorage.setItem("arso_bookmark_ids", JSON.stringify(myBookmarkIds));
    if (userProfile) {
      localStorage.setItem("arso_user_profile", JSON.stringify(userProfile));
    }
  }, [isLoggedIn, myScheduleIds, myBookmarkIds, userProfile]);

  // Kampala Local Date Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Clock in Kampala
      const timeOpts: Intl.DateTimeFormatOptions = {
        timeZone: "Africa/Kampala",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      };
      // Date in Kampala
      const dateOpts: Intl.DateTimeFormatOptions = {
        timeZone: "Africa/Kampala",
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
      };

      setKampalaTime(new Intl.DateTimeFormat("en-US", timeOpts).format(now));
      setKampalaDate(new Intl.DateTimeFormat("en-US", dateOpts).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle dynamic timer calculations counting down to June 15, 2026.
  useEffect(() => {
    const targetDate = new Date("June 15, 2026 09:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const gap = targetDate - now;

      if (gap <= 0) {
        clearInterval(interval);
        setCountdown({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      const d = Math.floor(gap / day);
      const h = Math.floor((gap % day) / hour);
      const m = Math.floor((gap % hour) / minute);
      const s = Math.floor((gap % minute) / second);

      setCountdown({
        days: d.toString().padStart(2, "0"),
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0")
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter bookmarked elements to forward references
  const bookmarkedSessions = useMemo(() => {
    return MOCK_SESSIONS.filter(s => myScheduleIds.includes(s.id));
  }, [myScheduleIds]);

  const bookmarkedResources = useMemo(() => {
    return MOCK_RESOURCES.filter(r => myBookmarkIds.includes(r.id));
  }, [myBookmarkIds]);

  // Handle addition/subtraction of bookmarked objects
  const handleToggleSchedule = (id: string) => {
    setMyScheduleIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleToggleBookmark = (id: string) => {
    setMyBookmarkIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Sign-in processing
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === "sarah.nakato@test.arso.org" && loginPassword === "password123") {
      setIsLoggedIn(true);
      setUserProfile(DEFAULT_PREFILL_PROFILE);
      setLoginError("");
    } else if (loginEmail && loginPassword) {
      // Allow dynamic custom logins for observer accounts
      setIsLoggedIn(true);
      setUserProfile({
        email: loginEmail,
        fullName: loginEmail.split("@")[0].replace(".", " ").toUpperCase(),
        organization: "Accredited Observer Delegation",
        role: "State Regulatory Delegate",
        country: "Regional Partner",
        badgeCode: `ARSO-32GA-${Math.floor(10000 + Math.random() * 90000)}-REG`,
        dietaryPreferences: "Halal & Organic Selection",
        galaAttendance: "pending"
      });
      setLoginError("");
    } else {
      setLoginError("Please supply valid accredited credentials.");
    }
  };

  // Registration processing for fresh badge generation
  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regOrg) {
      alert("Please populate all crucial fields.");
      return;
    }
    const slugCountry = regCountry || "Uganda";
    const customProfile: AttendeeProfile = {
      email: regEmail,
      fullName: regName,
      organization: regOrg,
      role: regRole || "Delegate Inspector",
      country: slugCountry,
      badgeCode: `ARSO-32GA-${Math.floor(10000 + Math.random() * 90000)}-${slugCountry.substring(0,2).toUpperCase()}`,
      dietaryPreferences: "Halal / Standard Buffet",
      galaAttendance: "pending"
    };

    setIsLoggedIn(true);
    setUserProfile(customProfile);
    setRegistrationMode(false);
  };

  // Profile preferences updates
  const handleUpdatePreferences = (diet: string, gala: "attending" | "declined" | "pending") => {
    if (userProfile) {
      setUserProfile(prev => prev ? {
        ...prev,
        dietaryPreferences: diet,
        galaAttendance: gala
      }: null);
    }
  };

  // Contact Secretariat form submit callback
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail && contactMsg) {
      setContactFormSubmitted(true);
      setTimeout(() => {
        setContactFormSubmitted(false);
        setContactName("");
        setContactEmail("");
        setContactMsg("");
      }, 5000);
    }
  };

  // Hotels filtered search
  const filteredHotels = useMemo(() => {
    return MOCK_HOTELS.filter(hotel => {
      const matchText = `${hotel.name} ${hotel.description} ${hotel.address}`.toLowerCase();
      return !hotelSearch || matchText.includes(hotelSearch.toLowerCase());
    });
  }, [hotelSearch]);

  // Shuttles filtered search
  const filteredShuttles = useMemo(() => {
    return MOCK_SHUTTLES.filter(shuttle => {
      const matchText = `${shuttle.from} ${shuttle.to} ${shuttle.notes}`.toLowerCase();
      return !shuttleSearch || matchText.includes(shuttleSearch.toLowerCase());
    });
  }, [shuttleSearch]);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col relative pb-16 md:pb-0 font-sans">
      
      {/* Dynamic Overlay Document Reader */}
      {activeReaderDoc && (
        <DocumentReader
          resource={activeReaderDoc}
          allResources={MOCK_RESOURCES}
          onClose={() => setActiveReaderDoc(null)}
          isBookmarked={myBookmarkIds.includes(activeReaderDoc.id)}
          onToggleBookmark={handleToggleBookmark}
        />
      )}

      {/* Primary Desktop Top Bar Navigation - Styled with subtle Neumorphism border */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-[0_4px_12px_rgba(207,210,200,0.25)] flex items-center h-20 px-4 md:px-10 justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 text-primary hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <div 
            onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img 
              alt="ARSO Logo" 
              className="h-10 md:h-12 w-auto object-contain" 
              src={arsoLogo}
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col items-start leading-none">
              <span className="font-headline text-lg md:text-xl font-extrabold tracking-tight text-primary uppercase">
                ARSO 2026
              </span>
              <span className="text-[8px] font-mono tracking-widest text-[#775a00] font-black mt-0.5">
                MUTUAL ACCREDITATION
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation links backed by strong display style */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest font-headline">
          <button 
            onClick={() => setActiveTab("home")} 
            className={`py-2 px-1 relative transition-all cursor-pointer hover:text-primary ${activeTab === "home" ? "text-primary border-b-2 border-primary font-black" : "text-slate-500"}`}
          >
            Home Briefing
          </button>
          <button 
            onClick={() => setActiveTab("schedule")} 
            className={`py-2 px-1 relative transition-all cursor-pointer hover:text-primary ${activeTab === "schedule" ? "text-primary border-b-2 border-primary font-black" : "text-slate-500"}`}
          >
            Summit Programme
          </button>
          <button 
            onClick={() => setActiveTab("resources")} 
            className={`py-2 px-1 relative transition-all cursor-pointer hover:text-primary ${activeTab === "resources" ? "text-primary border-b-2 border-primary font-black" : "text-slate-500"}`}
          >
            Resources & Logistics
          </button>
          <button 
            onClick={() => setActiveTab("portal")} 
            className={`py-2 px-1 relative transition-all cursor-pointer hover:text-primary ${activeTab === "portal" ? "text-primary border-b-2 border-primary font-black" : "text-slate-500"}`}
          >
            Sovereign Portal
          </button>
        </nav>

        {/* User Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("portal")}
            className={`h-10 w-10 rounded-xl cursor-pointer flex items-center justify-center transition-all ${
              isLoggedIn 
                ? "bg-primary text-white shadow-sm shadow-primary/20" 
                : "bg-[#f4f5f2] border border-slate-200/60 text-primary hover:bg-[#009c4d]/5"
            }`}
            title={isLoggedIn ? `Accredited: ${userProfile?.fullName}` : "Login Access"}
          >
            <User className="h-5 w-5" />
          </button>

          <button
            onClick={() => {
              if (isLoggedIn) {
                setActiveTab("portal");
              } else {
                setActiveTab("portal");
                setRegistrationMode(true);
              }
            }}
            className="hidden sm:inline-block bg-[#009c4d] hover:bg-[#009c4d]/90 text-white text-[10px] font-headline font-black uppercase py-2.5 px-5 rounded-xl tracking-widest transition-all cursor-pointer shadow-sm"
          >
            {isLoggedIn ? "Badge status" : "Accredit Badge"}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-slate-900/40 backdrop-blur-sm flex pt-20">
          <div className="w-72 bg-[#f4f5f2] shadow-2xl h-full flex flex-col p-6 animate-slide-in">
            <div className="space-y-4 pb-6 font-headline font-black text-xs uppercase tracking-wider text-left flex flex-col border-b border-slate-200">
              <button 
                onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }} 
                className={`py-2 hover:text-primary text-left ${activeTab === "home" ? "text-primary" : "text-slate-600"}`}
              >
                Home Info Foyer
              </button>
              <button 
                onClick={() => { setActiveTab("schedule"); setMobileMenuOpen(false); }} 
                className={`py-2 hover:text-primary text-left ${activeTab === "schedule" ? "text-primary" : "text-slate-600"}`}
              >
                Summit Programme
              </button>
              <button 
                onClick={() => { setActiveTab("resources"); setMobileMenuOpen(false); }} 
                className={`py-2 hover:text-primary text-left ${activeTab === "resources" ? "text-primary" : "text-slate-600"}`}
              >
                Practical Resources
              </button>
              <button 
                onClick={() => { setActiveTab("portal"); setMobileMenuOpen(false); }} 
                className={`py-2 hover:text-primary text-left ${activeTab === "portal" ? "text-primary" : "text-slate-600"}`}
              >
                Accredited Member Portal
              </button>
            </div>
            <div className="pt-6 space-y-4">
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans">
                African Organisation for Standardisation (ARSO) Secretariat liaison hub 2026.
              </p>
              <div className="flex gap-2">
                <span className="text-[9px] uppercase font-mono font-bold text-[#745700] bg-[#fdce5d]/20 border border-[#fdce5d]/30 px-2.5 py-1 rounded">
                  Kampala, Uganda
                </span>
              </div>
            </div>
          </div>
          <div className="flex-grow" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 w-full max-w-container-max mx-auto px-4 md:px-10 py-8 relative">
        <div className="crane-watermark absolute inset-0 -z-10 pointer-events-none opacity-20"></div>

        {/* ----------------- TAB: HOME ----------------- */}
        {activeTab === "home" && (
          <div className="space-y-10 animate-fade-in">
            
            {/* Slogan strip spanning key columns */}
            <div className="text-white py-4 px-6 rounded-2xl relative overflow-hidden bg-primary shadow-sm border-b-2 border-primary-container">
              <div className="kente-pattern-bg absolute inset-0 opacity-10"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="italic font-headline text-xs md:text-sm font-extrabold tracking-wide uppercase">
                  "Standards enabling Intra-Africa trade under the AfCFTA — One Certificate Working for You"
                </p>
                <span className="bg-white/10 border border-white/20 text-[9px] font-mono tracking-widest font-bold px-2.5 py-1 rounded">
                  ARSO SECRETARIAT CONSENSUS
                </span>
              </div>
            </div>

            {/* BENTO GRID: REVOLUTIONARY BENTO DASHBOARD LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* BENTO CELL 1: Main Summit Hero Greeting Card (lg:col-span-8 / 66% width) */}
              <div className="lg:col-span-8 neumorphic-card rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fdce5d]/10 text-[#745700] rounded-full border border-[#fdce5d]/30">
                    <Award className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest font-headline">
                      Organised by ARSO • Hosted by UNBS
                    </span>
                  </div>

                  {/* Big Sleek Montserrat Typeface request */}
                  <h1 className="font-headline text-3xl md:text-5xl font-black text-slate-800 tracking-tighter leading-[1.05] uppercase">
                    32nd <span className="text-primary text-emerald-600 block sm:inline">ARSO</span> General Assembly 2026
                  </h1>

                  <p className="text-xs md:text-sm leading-relaxed text-slate-500 max-w-xl font-sans font-medium">
                    Welcome to the central informational briefing center. Access and sync official technical standards legislation, local airport transport timetables, secure credentials, and compliance procedures designed for your summit mission in Kampala.
                  </p>

                  {/* Practical Location coordinates Bento style */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mt-4">
                    <div className="bg-white/50 border border-slate-200/75 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
                      <div className="p-2 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-black text-primary text-xs uppercase tracking-wider font-headline">June 15th — 19th 2026</p>
                        <p className="text-slate-500 text-[11px] font-semibold mt-0.5">Plenary Hall & Committees</p>
                      </div>
                    </div>

                    <div className="bg-white/50 border border-slate-200/75 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
                      <div className="p-2 w-10 h-10 rounded-xl bg-[#775a00]/10 text-[#775a00] flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-black text-[#775a00] text-xs uppercase tracking-wider font-headline">Munyonyo Resort</p>
                        <p className="text-slate-500 text-[11px] font-semibold mt-0.5">Kampala, Uganda</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200/60 w-full">
                  <button 
                    onClick={() => setActiveTab("schedule")}
                    className="neumorphic-btn-primary px-6 py-4.5 rounded-xl text-xs uppercase tracking-widest font-black transition-all flex items-center gap-2 cursor-pointer"
                  >
                    View Timetable <ArrowRight className="h-4 w-4 text-white" />
                  </button>
                  <button 
                    onClick={() => {
                      if (isLoggedIn) {
                        setActiveTab("portal");
                      } else {
                        setActiveTab("portal");
                        setRegistrationMode(true);
                      }
                    }}
                    className="neumorphic-btn px-6 py-4.5 rounded-xl text-xs uppercase tracking-widest font-black transition-all cursor-pointer text-slate-800"
                  >
                    Accredit Delegate Badge
                  </button>
                </div>
              </div>

              {/* BENTO CELL 2: Live Clock Date, Countdowns & Time (lg:col-span-4 / 33% width) - "More Life on Site" */}
              <div className="lg:col-span-4 neumorphic-card rounded-3xl p-6 flex flex-col justify-between items-center text-center space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#009c4d]"></div>
                
                {/* Real-time Ticking Kampala clock widget */}
                <div className="space-y-2 w-full">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Desk Clock
                  </span>
                  <p className="text-[11px] font-mono tracking-widest text-slate-400 font-extrabold uppercase uppercase">Uganda Local Time</p>
                  
                  {/* Digital Clock readout */}
                  <div className="py-2 px-4 rounded-2xl bg-[#f4f5f2] border border-slate-200 shadow-inner">
                    <h3 className="font-mono text-3xl font-black text-slate-800 tracking-tight leading-none">
                      {kampalaTime || "Loading..."}
                    </h3>
                    <p className="text-[10px] font-medium text-slate-500 font-mono mt-1 uppercase tracking-wider">
                      {kampalaDate}
                    </p>
                  </div>
                </div>

                {/* Countdown Block to Assembly Date */}
                <div className="space-y-2 w-full pt-4 border-t border-dashed border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-headline">DAYS REMAINING</span>
                  
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white/70 p-2 rounded-xl border border-slate-200">
                      <span className="block font-headline font-black text-primary text-xl leading-none">{countdown.days}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase mt-1 block">Days</span>
                    </div>
                    <div className="bg-white/70 p-2 rounded-xl border border-slate-200">
                      <span className="block font-headline font-black text-primary text-xl leading-none">{countdown.hours}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase mt-1 block">Hrs</span>
                    </div>
                    <div className="bg-white/70 p-2 rounded-xl border border-slate-200">
                      <span className="block font-headline font-black text-primary text-xl leading-none">{countdown.minutes}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase mt-1 block">Mins</span>
                    </div>
                    <div className="bg-white/70 p-2 rounded-xl border border-slate-200">
                      <span className="block font-headline font-black text-primary text-xl leading-none">{countdown.seconds}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase mt-1 block">Secs</span>
                    </div>
                  </div>
                </div>

                <div className="w-full text-center py-2 text-[9px] font-mono font-bold text-slate-400 border-t border-slate-100">
                  ACC-SYS NODE: ACTIVE 🟢
                </div>
              </div>

              {/* BENTO CELL 3: Distinguished Attendees & Security Access (lg:col-span-4 / 33% width) */}
              <div className="lg:col-span-4 neumorphic-card rounded-3xl p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-headline font-black text-slate-800 text-base uppercase tracking-tighter">
                    Accredited Delegations
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed font-sans">
                    The assembly coordinates quality frameworks between regional sovereign bodies:
                  </p>

                  <div className="space-y-2 pt-2 text-[11px] font-bold text-slate-600">
                    {[
                      "ARSO Sovereign State Members",
                      "African Union Commission Observers",
                      "Regional Communities (ECOWAS, EAC)",
                      "International Quality Standards (ISO, IEC)",
                      "Liaison Secretariat Coordinators"
                    ].map((item, idx) => (
                      <div key={idx} className="flex p-2 bg-[#f4f5f2] rounded-xl border border-slate-200/70 gap-2 items-center shadow-inner">
                        <Check className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={3} />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/85">
                  <p className="text-[10px] text-slate-400 font-bold flex gap-1 items-start">
                    <ShieldAlert className="h-3.5 w-3.5 text-[#ba1a1a] shrink-0 mt-0.5" />
                    <span>Liaison audits are required prior to final badge accreditation.</span>
                  </p>
                </div>
              </div>

              {/* BENTO CELL 4: Core Assembly Pillars Grid (lg:col-span-8 / 66% width) */}
              <div className="lg:col-span-8 neumorphic-card rounded-3xl p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="font-headline font-black text-slate-800 text-base uppercase tracking-tighter">
                    Core Harmonization Pillars
                  </h3>
                  <p className="text-xs text-slate-500 font-medium font-sans">
                    Guiding metrics to align quality protocols for seamless commercial trade:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between group hover:border-[#009c4d]/50 transition-colors">
                    <div>
                      <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
                        <Layers className="h-5 w-5" />
                      </div>
                      <h4 className="font-headline font-black text-slate-800 text-sm">Harmonization</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans mt-1">
                        Consolidating inter-state quality metrics to remove duplicate inspections under AfCFTA guidelines.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between group hover:border-[#775a00]/50 transition-colors">
                    <div>
                      <div className="h-10 w-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center mb-3">
                        💡
                      </div>
                      <h4 className="font-headline font-black text-slate-800 text-sm">Digital Quality</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans mt-1">
                        Utilizing paperless compliance routing certificates and verified QR coordinate checkers.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between group hover:border-[#603912]/50 transition-colors">
                    <div>
                      <div className="h-10 w-10 bg-orange-100 text-orange-800 rounded-xl flex items-center justify-center mb-3">
                        🤝
                      </div>
                      <h4 className="font-headline font-black text-slate-800 text-sm">Mutual Recognition</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans mt-1">
                        Validating lab credentials globally, making sure tests done in Entebbe stand verified across all borders.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* BENTO CELL 5: Interactive Logistics & Hospitality Desk (lg:col-span-7 / 58% width) */}
              <div className="lg:col-span-7 neumorphic-card rounded-3xl p-6 flex flex-col justify-between space-y-4">
                
                {/* Header with bento inline tab switches */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="font-headline font-black text-slate-800 text-sm md:text-base uppercase tracking-wider flex items-center gap-2">
                      <Bus className="h-5 w-5 text-emerald-600 animate-pulse" />
                      Logistics & Transport Desk
                    </h3>
                    <p className="text-[10px] text-slate-500 font-sans font-medium">Real-time coordinated transport and accredited lodging lists.</p>
                  </div>

                  <div className="flex bg-[#f4f5f2] rounded-xl p-1 border border-slate-200/80 mt-1 font-headline text-[9px] uppercase font-bold shrink-0">
                    <button
                      onClick={() => setHospitalityBentoTab("shuttles")}
                      className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                        hospitalityBentoTab === "shuttles" ? "bg-[#009c4d] text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      🚌 Shuttles
                    </button>
                    <button
                      onClick={() => setHospitalityBentoTab("hotels")}
                      className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                        hospitalityBentoTab === "hotels" ? "bg-[#009c4d] text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      🏨 Lodge Guide
                    </button>
                  </div>
                </div>

                {/* Body Content based on Tab */}
                <div className="flex-grow flex flex-col justify-center min-h-[220px]">
                  {hospitalityBentoTab === "shuttles" ? (
                    <div className="space-y-3">
                      <div className="bg-[#fcfdfa] border border-slate-200/65 rounded-xl p-3 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#009c4d] bg-[#009c4d]/5 border border-[#009c4d]/10 px-2 py-0.5 rounded">Route: EBB Airport Terminal &rarr; Munyonyo</span>
                          <h4 className="text-xs font-black text-slate-800 font-headline leading-tight">ENTEBBE TRANSIT COACH LINE</h4>
                          <p className="text-[10px] text-[#745700] font-mono font-bold flex items-center gap-1.5 leading-none mt-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                            DEP: HOURLY departures (24/7) • BOARDING IN ~14 MINS
                          </p>
                        </div>
                        <span className="text-[9px] shrink-0 font-bold bg-[#ffdcc1] text-[#7b5027] border border-[#ffdcc1]/30 px-2 py-0.5 rounded">ACTIVE 🟢</span>
                      </div>

                      <div className="bg-[#fcfdfa] border border-[#fcfdfa]/60 rounded-xl p-3 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border border-slate-200">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded">Route: Serena lobby &rarr; Venue</span>
                          <h4 className="text-xs font-black text-slate-800 font-headline leading-tight">VIP DELEGATES COACH</h4>
                          <p className="text-[10px] text-slate-500 font-mono font-bold mt-1">
                            SCHEDULED departure times: 07:00, 07:45, 08:30 morning
                          </p>
                        </div>
                        <span className="text-[9px] shrink-0 font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded">DEPARTED</span>
                      </div>

                      <p className="text-[10px] text-slate-400 font-semibold font-sans leading-relaxed pl-1 pt-1">
                        * UNBS representative liaison desk is active immediately in Entebbe arrival halls. Present delegate credentials to board.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {MOCK_HOTELS.slice(0, 4).map((h) => (
                        <div key={h.id} className="bg-[#fcfdfa] border border-slate-200 p-3 rounded-xl flex flex-col justify-between hover:border-[#009c4d]/30 transition-colors">
                          <div className="space-y-1">
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="font-bold font-headline text-[11px] text-slate-800 leading-tight line-clamp-1">{h.name}</h4>
                              <span className="text-[8px] font-mono font-bold shrink-0 bg-[#009c4d]/10 text-[#009c4d] px-1.5 py-0.5 rounded">{h.distanceToVenue}</span>
                            </div>
                            <div className="flex items-center text-[10px] text-amber-500 leading-none">
                              {"★".repeat(h.stars)}
                            </div>
                            <p className="text-[10px] text-slate-550 line-clamp-2 leading-tight">
                              {h.description}
                            </p>
                          </div>

                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-150 text-[10px]">
                            <span className="font-mono font-black text-[#009c4d]/90">{h.pricePerNight} / night</span>
                            <a
                              href={h.bookingUrl}
                              target="_blank"
                              referrerPolicy="no-referrer"
                              className="text-[#009c4d] font-black text-[9px] uppercase tracking-wider hover:underline"
                            >
                              BOOK &rarr;
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-2 border-t border-slate-100 justify-between items-center">
                  <p className="text-[10px] text-slate-500 pl-1 font-semibold leading-relaxed font-sans max-w-sm">
                    Read the <b>Essential Delegate Handbook (v1.2)</b> containing full hotel listings & transit timetables.
                  </p>
                  <button
                    onClick={() => {
                      const esDoc = MOCK_RESOURCES.find(r => r.id === "res-essential") || MOCK_RESOURCES[0];
                      setActiveReaderDoc(esDoc);
                    }}
                    className="neumorphic-btn-primary py-2 px-3.5 rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer shadow text-white shrink-0"
                  >
                    Read Handbook
                  </button>
                </div>
              </div>


              {/* BENTO CELL 6: Interactive Venue floor guidelines HUD (lg:col-span-5 / 41% width) */}
              <div className="lg:col-span-5 neumorphic-card rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline font-black text-slate-800 text-base uppercase tracking-tighter flex items-center gap-2">
                      <MapIcon className="h-5 w-5 text-primary" /> Venue Layout
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">MUNYONYO INDEX</span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-1">
                    Select conference coordinates to reveal blueprint overlays instantly:
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] uppercase font-black font-headline">
                    {[
                      { id: "plenary", label: "Grand Ballroom" },
                      { id: "committee", label: "Chambers A / B" },
                      { id: "marina", label: "Lakeside Marina" },
                      { id: "royals", label: "closing pavilion" }
                    ].map((z) => (
                      <button
                        key={z.id}
                        onClick={() => setSelectedVenueZone(z.id)}
                        className={`py-2 px-3 rounded-lg border transition-all cursor-pointer text-center ${
                          selectedVenueZone === z.id 
                            ? "bg-[#009c4d]/10 border-[#009c4d] text-primary" 
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-650"
                        }`}
                      >
                        {z.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated interactive mini map popup */}
                <div className="bg-[#f4f5f2] p-4 rounded-2xl border border-slate-200 shadow-inner relative overflow-hidden text-xs">
                  {selectedVenueZone === "plenary" && (
                    <div className="space-y-1 animate-fade-in">
                      <p className="font-black text-primary font-headline">Ballroom (Plenary Room)</p>
                      <p className="text-slate-500 text-[11px] font-medium leading-relaxed font-sans mt-0.5">Inside Speke Resort Lobby section. Plenary sessions, Keynote speeches and voting summits host here.</p>
                    </div>
                  )}
                  {selectedVenueZone === "committee" && (
                    <div className="space-y-1 animate-fade-in">
                      <p className="font-black text-primary font-headline font-semibold">Chambers A & B</p>
                      <p className="text-slate-500 text-[11px] font-medium leading-relaxed font-sans mt-0.5">Lower lobby conference wings. Breakout sub-groups and technical committees assemble here.</p>
                    </div>
                  )}
                  {selectedVenueZone === "marina" && (
                    <div className="space-y-1 animate-fade-in">
                      <p className="font-black text-secondary font-headline">Lakeside Marina gardens</p>
                      <p className="text-slate-500 text-[11px] font-medium leading-relaxed font-sans mt-0.5">Outdoor lakeside lawns. Day 3 evening social networking cocktail reception starts here at 18:30.</p>
                    </div>
                  )}
                  {selectedVenueZone === "royals" && (
                    <div className="space-y-1 animate-fade-in">
                      <p className="font-black text-orange-900 font-headline">Royal Palms Pavilion</p>
                      <p className="text-slate-500 text-[11px] font-medium leading-relaxed font-sans mt-0.5">Elite closing awards banquets hall. Official grand presidential dinner on June 19th starts here.</p>
                    </div>
                  )}
                </div>
              </div>


              {/* BENTO CELL 9: Sovereign Standards Board Directory (lg:col-span-12 or col-span-5 / 41% width) */}
              <div className="lg:col-span-5 neumorphic-card rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-headline font-black text-slate-800 text-sm md:text-base uppercase tracking-tighter flex items-center gap-2">
                      <Database className="h-5 w-5 text-[#009c4d] animate-pulse" />
                      Sovereign State Bureaus
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">DIRECTORY</span>
                  </div>
                  
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed font-sans mt-2">
                    ARSO coordinates 43 sovereign standards bureaus. Select a state to view the chief director and technical alignment parameters:
                  </p>

                  {/* Flag horizontal selectors */}
                  <div className="flex gap-1.5 overflow-x-auto py-2.5 shrink-0 scrollbar-none font-headline text-lg justify-start border-b border-slate-100">
                    {SOVEREIGN_MEMBERS.map((m) => {
                      const isSel = m.code === selectedCountryCode;
                      return (
                        <button
                          key={m.code}
                          onClick={() => setSelectedCountryCode(m.code)}
                          className={`p-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border shrink-0 text-base ${
                            isSel 
                              ? "bg-[#009c4d] text-white border-primary shadow-xs scale-102" 
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                          title={m.fullName}
                        >
                          <span className="block shrink-0">{m.flag}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Country bureau specs */}
                  {(() => {
                    const sel = SOVEREIGN_MEMBERS.find(m => m.code === selectedCountryCode) || SOVEREIGN_MEMBERS[0];
                    return (
                      <div className="pt-2.5 space-y-2 text-xs font-sans">
                        <div className="flex justify-between items-center text-[11px] border-b border-slate-150 pb-1.5">
                          <span className="text-slate-500 font-semibold">BUREAU IDENTIFIER</span>
                          <span className="font-black text-slate-800 font-headline uppercase">{sel.bureau} ({sel.country})</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] border-b border-slate-150 pb-1.5">
                          <span className="text-slate-500 font-semibold">OFFICIAL REGISTERED BUREAU</span>
                          <span className="font-bold text-slate-700 text-right line-clamp-1">{sel.fullName}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] border-b border-slate-150 pb-1.5">
                          <span className="text-slate-500 font-semibold">Chief Sovereign Director</span>
                          <span className="font-black text-slate-850 font-headline">{sel.director}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] border-b border-slate-150 pb-1.5">
                          <span className="text-slate-500 font-semibold">Administration HQ</span>
                          <span className="font-mono text-slate-550 font-bold">{sel.headquarters}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-500 font-semibold">Harmonized Standards Accepted</span>
                          <span className="font-mono font-extrabold text-slate-800">{sel.activeStandards} / 1,240</span>
                        </div>

                        {/* Progress Bar of AfCFTA compliance alignment index */}
                        <div className="space-y-1 pt-2">
                          <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                            <span>AfCFTA Standards Compliance</span>
                            <span className="text-primary">{sel.alignment}%</span>
                          </div>
                          <div className="w-full bg-slate-150 rounded-full h-1 overflow-hidden">
                            <div 
                              className="bg-[#009c4d] h-full transition-all duration-500"
                              style={{ width: `${sel.alignment}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="w-full text-center py-2 text-[9px] font-mono font-bold text-slate-400 border-t border-slate-100">
                  SECURE SEC-NODE: WG-{selectedCountryCode}-ACTIVE
                </div>
              </div>

              {/* BENTO CELL 10: Consensus Committee voting hud (lg:col-span-7 / 58% width) */}
              <div className="lg:col-span-7 neumorphic-card rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-headline font-black text-slate-800 text-sm md:text-base uppercase tracking-tighter flex items-center gap-2">
                      <Layers className="h-5 w-5 text-emerald-600 animate-pulse" />
                      Digital Consensus Cabinet (THCs)
                    </h3>
                    <span className="text-[9px] font-mono text-[#745700] font-black bg-[#fdce5d]/25 px-2.5 py-0.5 rounded border border-[#fdce5d]/40">VOTES OPEN</span>
                  </div>

                  <p className="text-xs text-slate-500 font-semibold leading-relaxed font-sans mt-2">
                    Review and register casting votes on active draft quality standards below. Registered administrative delegation bureaus carry exactly 1 secure vote per committee:
                  </p>

                  {/* Committees grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                    {THC_LIST.map((thc) => {
                      const vote = votesState[thc.id];
                      const tally = votesTally[thc.id];
                      const totalVotes = tally.yes + tally.no;
                      const approvalRatio = totalVotes > 0 ? Math.round((tally.yes / totalVotes) * 100) : 0;
                      
                      return (
                        <div key={thc.id} className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between space-y-1.5 hover:border-[#009c4d]/30 transition-colors">
                          <div className="space-y-0.5">
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="font-black font-headline text-[11px] text-slate-800 truncate" title={thc.name}>{thc.name}</h4>
                            </div>
                            <p className="text-[10px] text-[#745700] font-black font-mono leading-none">{thc.activeDraft}</p>
                            <p className="text-[10px] text-slate-500 leading-tight line-clamp-2 mt-1">{thc.description}</p>
                          </div>

                          {/* Gauge and action vote buttons */}
                          <div className="space-y-1 pt-1.5 border-t border-slate-100 font-sans">
                            <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-400">
                              <span>Approved Consensus Ratio</span>
                              <span className="text-[#009c4d] font-black">{approvalRatio}% ({tally.yes} Yes)</span>
                            </div>
                            
                            <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                              <div 
                                className="bg-[#009c4d] h-full transition-all duration-300"
                                style={{ width: `${approvalRatio}%` }}
                              ></div>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[9px] font-bold">
                              <button
                                onClick={() => handleCastConsensusVote(thc.id, "approve")}
                                className={`py-1 rounded border text-center transition-all cursor-pointer font-sans leading-none uppercase text-[8px] font-black py-1.5 ${
                                  vote === "approve"
                                    ? "bg-[#009c4d] text-white border-primary shadow-xs"
                                    : "bg-[#f4f5f2] hover:bg-slate-100 border-slate-200 text-slate-600"
                                }`}
                              >
                                {vote === "approve" ? "Approved ✓" : "✓ Yes"}
                              </button>
                              <button
                                onClick={() => handleCastConsensusVote(thc.id, "reject")}
                                className={`py-1 rounded border text-center transition-all cursor-pointer font-sans leading-none uppercase text-[8px] font-black py-1.5 ${
                                  vote === "reject"
                                    ? "bg-[#ba1a1a] text-white border-[#ba1a1a] shadow-xs"
                                    : "bg-[#f4f5f2] hover:bg-slate-100 border-slate-200 text-slate-600"
                                }`}
                              >
                                {vote === "reject" ? "Rejected 𐄂" : "𐄂 Object"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex pt-2 border-t border-slate-100 items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>* Secure pleneray ledger updates.</span>
                  <button
                    onClick={() => setActiveTab("portal")}
                    className="text-[#009c4d] font-black uppercase text-[9px]"
                  >
                    Accreditation Portal &rarr;
                  </button>
                </div>
              </div>

              {/* BENTO CELL 6: Interactive Venue floor guidelines HUD (lg:col-span-5 / 41% width) */}
              <div className="lg:col-span-5 neumorphic-card rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline font-black text-slate-800 text-base uppercase tracking-tighter flex items-center gap-2">
                      <MapIcon className="h-5 w-5 text-primary" /> Venue Layout
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">MUNYONYO INDEX</span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-1">
                    Select conference coordinates to reveal blueprint overlays instantly:
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] uppercase font-black font-headline">
                    {[
                      { id: "plenary", label: "Grand Ballroom" },
                      { id: "committee", label: "Chambers A / B" },
                      { id: "marina", label: "Lakeside Marina" },
                      { id: "royals", label: "closing pavilion" }
                    ].map((z) => (
                      <button
                        key={z.id}
                        onClick={() => setSelectedVenueZone(z.id)}
                        className={`py-2 px-3 rounded-lg border transition-all cursor-pointer text-center ${
                          selectedVenueZone === z.id 
                            ? "bg-[#009c4d]/10 border-[#009c4d] text-primary" 
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                        }`}
                      >
                        {z.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated interactive mini map popup */}
                <div className="bg-[#f4f5f2] p-4 rounded-2xl border border-slate-200 shadow-inner relative overflow-hidden text-xs">
                  {selectedVenueZone === "plenary" && (
                    <div className="space-y-1">
                      <p className="font-black text-primary font-headline">Ballroom (Plenary Room)</p>
                      <p className="text-slate-500 text-[11px] font-medium leading-relaxed font-sans">InsideSpeke Lobby Section. Pre-opening assemblies on June 15th start here.</p>
                    </div>
                  )}
                  {selectedVenueZone === "committee" && (
                    <div className="space-y-1">
                      <p className="font-black text-primary font-headline font-semibold">Chambers A & B</p>
                      <p className="text-slate-500 text-[11px] font-medium leading-relaxed font-sans">Lower Lobby hallway. Technical sub-working groups reviewing agriculture guidelines meet here.</p>
                    </div>
                  )}
                  {selectedVenueZone === "marina" && (
                    <div className="space-y-1">
                      <p className="font-black text-secondary font-headline">Lakeside Marina gardens</p>
                      <p className="text-slate-500 text-[11px] font-medium leading-relaxed font-sans">Outdoor green gardens along Speke marina. Lakeside cocktail mixer departs June 18th, 18:30.</p>
                    </div>
                  )}
                  {selectedVenueZone === "royals" && (
                    <div className="space-y-1">
                      <p className="font-black text-orange-900 font-headline">Royal Palms closing pavilion</p>
                      <p className="text-slate-500 text-[11px] font-medium leading-relaxed font-sans">State Closing Gala dinner Hosted on June 19th. Traditional attire accreditation guidelines apply.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* BENTO CELL 7: Inquiry & Secretariat contact form (lg:col-span-6 / 50% width) */}
              <div className="lg:col-span-6 neumorphic-card rounded-3xl p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="font-headline font-black text-slate-800 text-base uppercase tracking-tighter flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                    Contact Secretariat (UNBS Host Desk)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Our designated coordinator liaison operates 24/7. Transmit any lodging, e-visa letters, shuttle, or dietary verification inquiries.
                  </p>

                  {contactFormSubmitted ? (
                    <div className="bg-primary/5 border border-primary/20 text-primary p-6 rounded-2xl text-center space-y-2">
                      <CheckCircle className="h-8 w-8 text-primary mx-auto animate-bounce" />
                      <p className="font-headline font-bold text-sm">Message Transmitted Successfully</p>
                      <p className="text-xs text-slate-500">Liaison officer will respond shortly within your certified delegate email.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3 pt-2 text-xs">
                      <div className="grid grid-cols-2 gap-3 font-headline">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500" htmlFor="c-name">Full Name</label>
                          <div className="neumorphic-card-inset rounded-lg p-0.5">
                            <input
                              id="c-name"
                              type="text"
                              required
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              placeholder="e.g. Sarah Nakato"
                              className="w-full p-2.5 bg-transparent border-0 focus:ring-0 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500" htmlFor="c-email">Accredited Email</label>
                          <div className="neumorphic-card-inset rounded-lg p-0.5">
                            <input
                              id="c-email"
                              type="email"
                              required
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              placeholder="e.g. sarah@test.arso.org"
                              className="w-full p-2.5 bg-transparent border-0 focus:ring-0 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 font-headline">
                        <label className="text-[10px] uppercase font-bold text-slate-500" htmlFor="c-msg">Inquiry Message</label>
                        <div className="neumorphic-card-inset rounded-lg p-0.5">
                          <textarea
                            id="c-msg"
                            rows={2}
                            required
                            value={contactMsg}
                            onChange={(e) => setContactMsg(e.target.value)}
                            placeholder="Inquire about Entebbe shuttles, hotel rates, or accreditation passes..."
                            className="w-full p-2.5 bg-transparent border-0 focus:ring-0 focus:outline-none focus:border-0"
                          ></textarea>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="neumorphic-btn-primary px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer w-full text-center"
                      >
                        Transmit secure message
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* BENTO CELL 8: Secretariat Contact Hotline Desk (lg:col-span-6 / 50% width) */}
              <div className="lg:col-span-6 neumorphic-card rounded-3xl p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-headline font-black text-slate-800 text-base uppercase tracking-tighter">
                    Hosting Secretariat Desk Info
                  </h3>
                  
                  <div className="space-y-3 font-sans text-xs">
                    <div className="flex gap-3">
                      <div className="p-2 w-9 h-9 rounded-xl bg-orange-100 text-orange-900 flex items-center justify-center shrink-0">
                        <Building className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 font-headline uppercase text-[11px] tracking-wider">National Partner (UNBS)</p>
                        <p className="text-slate-500 font-semibold text-[11px]">Bweyogerere Industrial Area, Central Kampala</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="p-2 w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <PhoneCall className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 font-headline uppercase text-[11px] tracking-wider">Hotline Secretariat Office</p>
                        <p className="text-slate-500 font-mono text-[11px] font-bold mt-0.5">+256 414 505900 // +256 701 445522</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="p-2 w-9 h-9 rounded-xl bg-emerald-100 text-[#009c4d] flex items-center justify-center shrink-0">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 font-headline uppercase text-[11px] tracking-wider">Official Inquiries Mailroom</p>
                        <p className="text-slate-500 font-mono text-[11px] font-black mt-0.5">arso2026@unbs.go.ug</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#f4f5f2] rounded-2xl border border-slate-200 text-[10px] text-slate-500 font-sans leading-relaxed tracking-wide flex items-center gap-2 mt-4">
                  <span className="text-emerald-600 block shrink-0 text-base animate-pulse">●</span>
                  <span>UNBS desk representatives are stationed at Entebbe departures arrivals.</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ----------------- TAB: SCHEDULE ----------------- */}
        {activeTab === "schedule" && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="font-headline text-2xl md:text-5xl font-black text-primary uppercase tracking-tighter">
                Assembly Programme
              </h1>
              <p className="text-xs text-slate-500 font-semibold tracking-wide">
                Build and lock certified panels to generate valid barcode entries for your digital delegate pass.
              </p>
            </div>

            <SchedulePanel
              sessions={MOCK_SESSIONS}
              myScheduleIds={myScheduleIds}
              onToggleSchedule={handleToggleSchedule}
              isLoggedIn={isLoggedIn}
              onNavigateToPortal={() => setActiveTab("portal")}
            />
          </div>
        )}

        {/* ----------------- TAB: RESOURCES ----------------- */}
        {activeTab === "resources" && (
          <div className="space-y-10 animate-fade-in font-sans">
            
            <div className="space-y-1">
              <h1 className="font-headline text-2xl md:text-5xl font-black text-primary uppercase tracking-tighter">
                Assemblies Resource Center
              </h1>
              <p className="text-xs text-slate-500 font-semibold">
                Access technical legislation dossiers, verified transit shuttle links, and sovereign partner logistics.
              </p>
            </div>

            {/* Practical Bento Block 1: Main hero pack download */}
            <div className="relative neumorphic-card rounded-3xl p-6 md:p-8 overflow-hidden">
              <div className="kente-pattern-bg absolute inset-0 opacity-5"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-3 flex-1">
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black px-3 py-1 rounded inline-block uppercase tracking-widest font-headline">
                    Sovereign Delegate Documents
                  </span>
                  <h2 className="font-headline text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-none">
                    Essential Assemblies Handbooks (v1.2)
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xl leading-relaxed mt-1 font-medium font-sans">
                    Obtain the certified manuals containing legal rules, hospitality hotel grids, airport Entebbe bus coordinates, local coordinate maps, and secretariat support desks.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-3">
                    <button 
                      onClick={() => {
                        const packDoc = MOCK_RESOURCES.find(r => r.id === "res-essential") || MOCK_RESOURCES[0];
                        setActiveReaderDoc(packDoc);
                      }}
                      className="neumorphic-btn-primary text-xs font-black uppercase tracking-widest py-3 px-6 rounded-xl transition-all shadow flex items-center gap-2 cursor-pointer text-white"
                    >
                      <Download className="h-4 w-4 text-white" strokeWidth={3} /> Open Reader (In-App PDF)
                    </button>
                  </div>
                </div>

                <div className="h-28 w-24 border border-slate-200 bg-[#f4f5f2] rounded-2xl flex flex-col justify-center items-center backdrop-blur-sm select-none shadow-inner shrink-0">
                  <FileText className="h-10 w-10 text-primary" />
                  <span className="text-[9px] font-mono mt-1 text-slate-400 font-bold">12.2 MB // PDF</span>
                </div>
              </div>
            </div>

            {/* Block 2: Technical documents lists */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Technical guidelines col-span-8 */}
              <div className="lg:col-span-8 neumorphic-card rounded-3xl p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <h3 className="font-headline text-sm font-black text-primay uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-emerald-600" />
                    Legislation Dossiers Registry
                  </h3>
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    SECURE STORAGE DESK
                  </span>
                </div>

                <div className="divide-y divide-slate-100 h-max">
                  {MOCK_RESOURCES.filter(r => r.category === "technical" || r.category === "legal").map((res) => {
                    const isBookmarked = myBookmarkIds.includes(res.id);
                    return (
                      <div key={res.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 font-sans overflow-hidden">
                          <p className="text-xs font-black text-slate-800 font-headline tracking-tight uppercase">{res.title}</p>
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                            {res.description}
                          </p>
                          <div className="flex gap-4 font-mono text-[9px] text-[#745700] mt-1 font-bold">
                            <span>TYPE: {res.fileType}</span>
                            <span>REVISION: {res.revision || "v1.0"}</span>
                            <span>REV DATE: {res.updatedAt}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0 self-start sm:self-center">
                          <button
                            onClick={() => setActiveReaderDoc(res)}
                            className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[10px] font-black uppercase font-headline py-2 px-4 rounded-xl transition-all cursor-pointer"
                          >
                            Open reader
                          </button>
                          <button
                            onClick={() => handleToggleBookmark(res.id)}
                            className="p-2 border border-slate-200 hover:border-primary rounded-xl transition-all cursor-pointer text-slate-400 hover:text-primary"
                            title="Save reference"
                          >
                            <span className={`text-base block ${isBookmarked ? "text-primary fill-current" : ""}`}>★</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar Document Briefing Timeline */}
              <div className="lg:col-span-4 neumorphic-card rounded-3xl p-6 space-y-6">
                <h3 className="font-headline text-sm font-black text-slate-800 border-b border-slate-200 pb-4 uppercase tracking-wider">
                  Dossier Timeline
                </h3>
                
                <div className="relative pl-6 border-l-2 border-slate-200/80 space-y-6 text-xs text-slate-500 leading-relaxed">
                  
                  {/* Item 1 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 h-3.5 w-3.5 rounded-full bg-secondary border-4 border-[#f4f5f2] shadow-xs"></span>
                    <p className="font-black text-[#775a00] font-mono text-[10px] uppercase">June 15, 2026</p>
                    <h5 className="font-black text-slate-800 mt-0.5 uppercase tracking-tighter font-headline text-[11px]">Primary Assemblies Pack</h5>
                    <p className="mt-1 leading-relaxed">Draft publication of administrative standards manuals & delegate checklists.</p>
                  </div>

                  {/* Item 2 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 h-3.5 w-3.5 rounded-full bg-primary border-4 border-[#f4f5f2] shadow-xs"></span>
                    <p className="font-black text-primary font-mono text-[10px] uppercase">June 17, 2026</p>
                    <h5 className="font-black text-slate-800 mt-0.5 uppercase tracking-tighter font-headline text-[11px]">Sub-Committee Audit Notes</h5>
                    <p className="mt-1 leading-relaxed">Harmonized agriculture and crop compliance metrics published by TC 02 panels.</p>
                  </div>

                  {/* Item 3 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 h-3.5 w-3.5 rounded-full bg-slate-400 border-4 border-[#f4f5f2] shadow-xs"></span>
                    <p className="font-black text-slate-400 font-mono text-[10px] uppercase">June 19, 2026</p>
                    <h5 className="font-black text-slate-800 mt-0.5 uppercase tracking-tighter font-headline text-[11px]">Final Treaty Signatures</h5>
                    <p className="mt-1 leading-relaxed">Sovereign treaty declaration of quality alignment locked to cross-border AfCFTA trade.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Block 3: Logistics Bento Grid Hotels and Shuttles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="logistics text-xs">
              
              {/* Box A Shuttles timetables */}
              <div className="neumorphic-card rounded-3xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Bus className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-headline font-black text-slate-800 text-sm md:text-base uppercase tracking-wider">
                      Entebbe Airport Shuttles
                    </h3>
                  </div>
                  
                  <div className="relative w-full sm:w-44">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                    <div className="neumorphic-card-inset rounded-lg p-0.5">
                      <input
                        type="text"
                        value={shuttleSearch}
                        onChange={(e) => setShuttleSearch(e.target.value)}
                        placeholder="Search routes..."
                        className="w-full text-[10px] pl-8 pr-3 py-1.5 bg-transparent border-0 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredShuttles.length > 0 ? (
                    filteredShuttles.map((sh) => (
                      <div key={sh.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
                        <div className="flex justify-between items-start flex-wrap gap-1 font-bold">
                          <span className="text-primary font-black uppercase text-[10px] bg-[#009c4d]/5 px-2 py-0.5 rounded-lg shadow-sm border border-[#009c4d]/10">
                            {sh.from} &rarr; {sh.to}
                          </span>
                          <span className="text-slate-500 tracking-tight font-mono font-bold text-[10px]">{sh.frequency}</span>
                        </div>
                        <p className="text-[11px] text-[#745700] leading-none font-bold font-mono">DEP TIMETABLE: {sh.timeString}</p>
                        <p className="text-[11px] text-slate-500 font-sans mt-1">{sh.notes}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6 font-semibold">No matching shuttle schedules found in registry.</p>
                  )}
                </div>
              </div>

              {/* Box B Sovereign Approved Hotels */}
              <div className="neumorphic-card rounded-3xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-primary">
                    <HotelIcon className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-headline font-black text-slate-800 text-sm md:text-base uppercase tracking-wider">
                      Accredited Lodging
                    </h3>
                  </div>

                  <div className="relative w-full sm:w-44">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                    <div className="neumorphic-card-inset rounded-lg p-0.5">
                      <input
                        type="text"
                        value={hotelSearch}
                        onChange={(e) => setHotelSearch(e.target.value)}
                        placeholder="Filter hotels..."
                        className="w-full text-[10px] pl-8 pr-3 py-1.5 bg-transparent border-0 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {filteredHotels.length > 0 ? (
                    filteredHotels.map((hot) => (
                      <div key={hot.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#009c4d]/30 transition-colors text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-slate-800 font-headline text-xs md:text-sm uppercase tracking-tight">{hot.name}</h4>
                          <span className="text-[10px] text-primary font-mono font-bold bg-[#009c4d]/10 px-2.5 py-0.5 rounded-full">{hot.distanceToVenue}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          {"★".repeat(hot.stars)}
                        </div>
                        <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                          {hot.description}
                        </p>
                        <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-100">
                          <span className="font-mono font-bold text-primary text-[10px]">{hot.pricePerNight} / Night</span>
                          <a
                            href={hot.bookingUrl}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="bg-primary/5 hover:bg-primary/20 text-primary border border-primary/20 text-[9px] uppercase font-black tracking-widest py-1.5 px-3 rounded-lg transition-all"
                          >
                            Reserve Portal &rarr;
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6 font-semibold">No accredited hotels match your terms.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ----------------- TAB: MEMBER PORTAL ----------------- */}
        {activeTab === "portal" && (
          <div className="animate-fade-in relative min-h-[60vh] flex flex-col justify-center">
            
            {isLoggedIn && userProfile ? (
              <PortalDashboard
                profile={userProfile}
                bookingList={bookmarkedSessions}
                bookmarkList={bookmarkedResources}
                onLogout={() => {
                  setIsLoggedIn(false);
                  setUserProfile(null);
                  localStorage.removeItem("arso_user_profile");
                  localStorage.removeItem("arso_logged_in");
                }}
                onUpdatePreferences={handleUpdatePreferences}
                onRemoveSession={handleToggleSchedule}
                onRemoveBookmark={handleToggleBookmark}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            ) : registrationMode ? (
              /* Fresh Registration Form View */
              <div className="max-w-lg mx-auto w-full bg-white shadow-2xl rounded-3xl border border-slate-250 overflow-hidden">
                <div className="kente-divider bg-primary w-full"></div>
                
                <div className="p-6 md:p-8 space-y-6 text-xs">
                  <div className="text-center">
                    <img 
                      alt="ARSO assemblies" 
                      className="h-16 mx-auto mb-3" 
                      src={arsoLogo}
                      referrerPolicy="no-referrer"
                    />
                    <h2 className="font-headline font-black text-slate-800 text-lg uppercase tracking-tight">Delegate Badge Accreditation</h2>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Complete details list to generate your digital gate access pass.</p>
                  </div>

                  <form onSubmit={handleRegistrationSubmit} className="space-y-4 font-headline">
                    <div>
                      <label className="text-[10px] uppercase font-black text-slate-500 block mb-1">Full Representative Name</label>
                      <div className="neumorphic-card-inset rounded-xl p-0.5">
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Dr. Kwame Mensah"
                          className="w-full text-xs p-3 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-black text-slate-500 block mb-1">Accredited Professional Email</label>
                      <div className="neumorphic-card-inset rounded-xl p-0.5">
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="e.g. kwame@mensah.org"
                          className="w-full text-xs p-3 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-black text-slate-500 block mb-1">Organization Bureau</label>
                        <div className="neumorphic-card-inset rounded-xl p-0.5">
                          <input
                            type="text"
                            required
                            value={regOrg}
                            onChange={(e) => setRegOrg(e.target.value)}
                            placeholder="e.g. GSA Ghana"
                            className="w-full text-xs p-3 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 font-semibold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black text-slate-500 block mb-1">Designated Role</label>
                        <div className="neumorphic-card-inset rounded-xl p-0.5">
                          <input
                            type="text"
                            value={regRole}
                            onChange={(e) => setRegRole(e.target.value)}
                            placeholder="e.g. Director General"
                            className="w-full text-xs p-3 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-black text-slate-500 block mb-1">Sovereign Country</label>
                      <div className="neumorphic-card-inset rounded-xl p-0.5">
                        <select
                          value={regCountry}
                          onChange={(e) => setRegCountry(e.target.value)}
                          className="w-full text-xs p-3 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer text-slate-800 font-semibold"
                        >
                          <option value="Uganda">Uganda (Host State)</option>
                          <option value="Kenya">Kenya</option>
                          <option value="Nigeria">Nigeria</option>
                          <option value="Ghana">Ghana</option>
                          <option value="South Africa">South Africa</option>
                          <option value="Egypt">Egypt</option>
                          <option value="Senegal">Senegal</option>
                          <option value="International Observer">International Observer</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button
                        type="button"
                        onClick={() => setRegistrationMode(false)}
                        className="w-1/2 py-3.5 border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-black transition-all font-black tracking-widest rounded-xl cursor-pointer uppercase text-[10px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-3.5 bg-primary hover:bg-primary-container text-white font-black hover:scale-[1.01] transition-all rounded-xl cursor-pointer uppercase tracking-widest text-[10px]"
                      >
                        Generate Gate Pass
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              /* Standard login card prefilled according to mockups */
              <div className="max-w-md mx-auto w-full bg-white shadow-2xl rounded-3xl border border-slate-200 overflow-hidden">
                <div className="kente-divider bg-[#009c4d] w-full"></div>
                <div className="p-8 md:p-10 space-y-6">
                  
                  <div className="flex flex-col items-center mb-4">
                    <img 
                      alt="ARSO medallion banner" 
                      className="h-20 w-auto mb-3" 
                      src={arsoBanner}
                      referrerPolicy="no-referrer"
                    />
                    <h1 className="text-xl md:text-2xl font-headline font-black text-primary tracking-tighter uppercase">
                      ARSO Member Portal
                    </h1>
                    <p className="text-[10px] font-black text-secondary font-headline uppercase tracking-widest mt-0.5">
                      32nd General Assembly — June 2026
                    </p>
                  </div>

                  <h2 className="text-lg font-headline font-black text-slate-800 uppercase tracking-tight">Accreditation Sign In</h2>

                  {loginError && (
                    <div className="p-3 bg-red-100/70 border border-red-200 text-[#ba1a1a] rounded-xl text-xs leading-relaxed font-bold flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-headline">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black text-slate-500 block">Dossier Email</label>
                      <div className="neumorphic-card-inset rounded-xl p-0.5">
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="sarah.nakato@test.arso.org"
                          className="w-full text-xs p-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-800 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black text-slate-500 block">Registry Password</label>
                      <div className="neumorphic-card-inset rounded-xl p-0.5">
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full text-xs p-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-800 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end text-[10px] font-black uppercase tracking-wider">
                      <button
                        type="button"
                        onClick={() => alert("Prefilled accredited credentials are ready. Simply hit Sign In now.")}
                        className="text-secondary hover:text-primary transition-all underline"
                      >
                        Help?
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4.5 bg-[#009c4d] hover:bg-[#009c4d]/90 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow cursor-pointer transition-all mt-2"
                    >
                      Sign In
                    </button>
                  </form>

                  <div className="border-t border-slate-100 pt-6 mt-6 flex flex-col items-center gap-2">
                    <p className="text-xs text-slate-500 font-semibold">
                      Don't have an accredited account? 
                      <button 
                        onClick={() => setRegistrationMode(true)}
                        className="text-primary font-black hover:underline uppercase tracking-wider ml-1.5 cursor-pointer"
                      >
                        Accredit here
                      </button>
                    </p>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* Primary Footer Block with complete compliance indicators */}
      <footer className="w-full bg-[#002f17] text-white border-t-8 border-secondary-container mt-16 py-12">
        <div className="max-w-container-max mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 text-xs font-sans">
          
          <div className="md:col-span-6 space-y-4">
            <h3 className="font-headline text-lg md:text-xl font-black text-white leading-none uppercase tracking-tight">
              ARSO 2026 GENERAL ASSEMBLY
            </h3>
            <p className="text-[#8ee4a6] opacity-80 leading-relaxed max-w-sm text-xs font-medium font-sans">
              African Organisation for Standardisation. Driving sovereign commercial trade under the AfCFTA boundaries through technical excellence and unified quality infrastructures since 1977.
            </p>
            <p className="text-[10px] text-[#8ee4a6] opacity-60 font-mono pt-4 select-none">
              © 25th Summit of Assemblies / African Organisation for Standardisation. All rights reserved.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-headline text-xs font-black uppercase tracking-widest text-[#fdce5d] uppercase">
              Secretariat links
            </h4>
            <div className="flex flex-col gap-2.5 font-bold text-[#8ee4a6] font-headline text-[10px] uppercase tracking-wider">
              <button onClick={() => { setActiveTab("home"); window.scrollTo(0,0); }} className="hover:text-[#fdce5d] text-left cursor-pointer transition-colors underline">Home briefings</button>
              <button onClick={() => { setActiveTab("schedule"); window.scrollTo(0,0); }} className="hover:text-[#fdce5d] text-left cursor-pointer transition-colors underline">Summit Program</button>
              <button onClick={() => { setActiveTab("resources"); window.scrollTo(0,0); }} className="hover:text-[#fdce5d] text-left cursor-pointer transition-colors underline">Sovereign Resources</button>
              <button onClick={() => { setActiveTab("portal"); window.scrollTo(0,0); }} className="hover:text-[#fdce5d] text-left cursor-pointer transition-colors underline">Accredited Portal</button>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3 font-sans">
            <h4 className="font-headline text-xs font-black uppercase tracking-widest text-[#fdce5d] uppercase">
              UNBS Host office
            </h4>
            <div className="space-y-1.5 bg-white/5 p-4 rounded-xl border border-white/10 text-xs">
              <p className="font-bold text-white uppercase tracking-tight">UNBS Headquarters</p>
              <p className="opacity-70 text-[11px] font-semibold">Bweyogerere Industrial Area, Kampala</p>
              <p className="opacity-70 text-[11px] font-mono leading-none font-bold">Liaison registry: arso2026@unbs.go.ug</p>
            </div>
          </div>

        </div>
      </footer>

      {/* BOTTOM NAVIGATION (MOBILE ONLY) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/60 shadow-lg flex justify-around items-center h-16 px-2 text-slate-500 font-headline font-black text-[9px] uppercase tracking-widest">
        <button
          onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
          className={`flex-1 flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === "home" ? "text-primary scale-105" : "text-slate-500 hover:text-primary"
          }`}
        >
          <span className="text-sm">🏠</span>
          <span className="text-[9px] tracking-widest mt-0.5">Home</span>
        </button>

        <button
          onClick={() => { setActiveTab("schedule"); setMobileMenuOpen(false); }}
          className={`flex-1 flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === "schedule" ? "text-primary scale-105" : "text-slate-500 hover:text-primary"
          }`}
        >
          <span className="text-sm">📅</span>
          <span className="text-[9px] tracking-widest mt-0.5">Programme</span>
        </button>

        <button
          onClick={() => { setActiveTab("resources"); setMobileMenuOpen(false); }}
          className={`flex-1 flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === "resources" ? "text-primary scale-105" : "text-slate-500 hover:text-primary"
          }`}
        >
          <span className="text-sm">📚</span>
          <span className="text-[9px] tracking-widest mt-0.5">Resources</span>
        </button>

        <button
          onClick={() => { setActiveTab("portal"); setMobileMenuOpen(false); }}
          className={`flex-1 flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === "portal" ? "text-primary scale-105" : "text-slate-500 hover:text-primary"
          }`}
        >
          <span className="text-sm">🎓</span>
          <span className="text-[9px] tracking-widest mt-0.5">Portal</span>
        </button>
      </nav>

    </div>
  );
}
