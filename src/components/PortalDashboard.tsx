import React, { useState } from "react";
import { AttendeeProfile, Session, ResourceItem } from "../types";
import { 
  User, 
  MapPin, 
  Calendar, 
  FileText, 
  Utensils, 
  Sparkles, 
  Mail, 
  Globe, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  LogOut,
  QrCode,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";

interface PortalDashboardProps {
  profile: AttendeeProfile;
  bookingList: Session[];
  bookmarkList: ResourceItem[];
  onLogout: () => void;
  onUpdatePreferences: (diet: string, gala: "attending" | "declined" | "pending") => void;
  onRemoveSession: (id: string) => void;
  onRemoveBookmark: (id: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function PortalDashboard({
  profile,
  bookingList,
  bookmarkList,
  onLogout,
  onUpdatePreferences,
  onRemoveSession,
  onRemoveBookmark,
  onNavigateToTab
}: PortalDashboardProps) {
  const [dietInput, setDietInput] = useState(profile.dietaryPreferences);
  const [galaCheck, setGalaCheck] = useState<"attending" | "declined" | "pending">(profile.galaAttendance);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePreferences(dietInput, galaCheck);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      
      {/* Upper header block styled in soft light Neumorphism with an elegant Kente border and logo */}
      <div className="neumorphic-card rounded-2xl overflow-hidden p-6 md:p-8 relative">
        <div className="kente-pattern-bg absolute inset-0 opacity-5 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-headline text-2xl font-black shadow-inner">
              {profile.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
                  Accredited Delegate
                </span>
                {profile.isAdmin && (
                  <span className="bg-[#775a00]/10 text-[#775a00] border border-[#775a00]/20 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
                    Staff Liaison
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-3xl font-headline font-black text-slate-800 tracking-tight mt-1">
                {profile.fullName}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {profile.role} • <span className="font-bold text-primary">{profile.organization}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="neumorphic-btn px-4 py-2.5 rounded-lg text-xs font-bold font-headline uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* BENTO CELL 1: Digital Gate Pass / Credentials Badge (lg:col-span-4) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="neumorphic-card rounded-3xl overflow-hidden p-6 flex flex-col items-center">
            {/* Top Badge Header tag */}
            <div className="w-full flex-col items-center text-center pb-4 border-b border-dashed border-outline-variant/60">
              <span className="text-[9px] font-mono tracking-widest text-primary font-black uppercase">
                AFRICAN ORGANISATION FOR STANDARDISATION
              </span>
              <h4 className="font-headline font-black text-slate-800 text-sm tracking-tighter mt-0.5">
                32ND GENERAL ASSEMBLY • KAMPALA 2026
              </h4>
            </div>

            {/* Profile badge details */}
            <div className="mt-6 flex flex-col items-center">
              {/* Profile Image card using Neumorphic circle extrusion */}
              <div className="h-32 w-32 rounded-full neumorphic-card flex items-center justify-center p-3 text-primary relative">
                <div className="h-full w-full rounded-full bg-surface-container flex items-center justify-center text-primary/30 overflow-hidden shadow-inner font-headline text-5xl font-black">
                  {profile.fullName.includes("Nakato") ? "🇺🇬" : <User className="h-16 w-16" />}
                </div>
              </div>

              <h3 className="font-headline font-black text-primary text-xl mt-4 uppercase tracking-tight text-center leading-tight">
                {profile.fullName}
              </h3>
              <p className="text-[11px] text-slate-500 font-bold mt-1 text-center font-sans tracking-wide">
                {profile.organization}
              </p>
              
              <div className="inline-flex items-center gap-1 bg-[#775a00]/10 text-[#775a00] border border-[#775a00]/15 text-[10px] font-black font-headline uppercase tracking-widest px-3 py-1 rounded-full mt-3">
                📍 {profile.country.toUpperCase()} DELEGATE
              </div>
            </div>

            {/* Inset QR security node */}
            <div className="w-full mt-6 bg-[#f4f5f2] neumorphic-card-inset p-4 rounded-2xl flex flex-col items-center">
              <QrCode className="h-36 w-36 text-slate-800" strokeWidth={1} />
              <p className="text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-widest select-all font-bold">
                {profile.badgeCode}
              </p>
            </div>

            <div className="w-full mt-6 flex justify-between items-center text-[9px] font-mono font-bold text-slate-400 border-t border-dashed border-outline-variant/60 pt-4">
              <span className="flex items-center gap-1 text-primary">● SCANNER ACTIVE</span>
              <span>SECURE ACCESS ID</span>
            </div>
          </div>

          {/* Quick Stats sidebar sub-item */}
          <div className="neumorphic-card rounded-2xl p-5 space-y-4">
            <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest font-headline">
              Verified Registry details
            </h5>
            <div className="space-y-2 text-xs font-medium text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Secure Email</span>
                <span className="font-mono text-slate-800">{profile.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Pass Status</span>
                <span className="text-primary font-black font-headline uppercase">Accredited</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Liaison Registry Office</span>
                <span className="font-semibold text-slate-800">UNBS Liaison Node</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Gala, Custom Program & Document Bookmarks (lg:col-span-8) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* BENTO CELL 2: Gala Dinner Attendances & RSVP Form (lg:col-span-8) */}
          <div className="neumorphic-card rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#775a00]/10 text-[#775a00] border border-[#775a00]/20">
                <Utensils className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-headline font-black text-slate-800 text-base">
                  State Dinner Gala RSVP & Dietary
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Register dietary preferences with the host kitchen (UNBS Secretariat) for the closing banquet on June 19th.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Dietary requirements */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-700 font-headline uppercase tracking-wider" htmlFor="diet">
                    Dietary Requirements / Bans
                  </label>
                  <div className="neumorphic-card-inset rounded-xl p-0.5">
                    <input
                      type="text"
                      id="diet"
                      value={dietInput}
                      onChange={(e) => setDietInput(e.target.value)}
                      placeholder="e.g. Halal selection, Vegetarian buffet"
                      className="w-full text-xs p-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-800 font-semibold"
                    />
                  </div>
                </div>

                {/* Gala select status */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-700 font-headline uppercase tracking-wider" htmlFor="gala">
                    Gala RSVP status
                  </label>
                  <div className="neumorphic-card-inset rounded-xl p-0.5">
                    <select
                      id="gala"
                      value={galaCheck}
                      onChange={(e) => setGalaCheck(e.target.value as "attending" | "declined" | "pending")}
                      className="w-full text-xs p-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-800 font-semibold cursor-pointer"
                    >
                      <option value="attending">Yes, I will attend</option>
                      <option value="declined">I decline attendance</option>
                      <option value="pending">Attendance pending</option>
                    </select>
                  </div>
                </div>

              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-slate-200">
                {isSaved ? (
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4" /> Preferences saved and synchronized.
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 font-medium">
                    *RSVPs cannot be altered after June 12th.
                  </span>
                )}

                <button
                  type="submit"
                  className="neumorphic-btn-primary px-6 py-3 rounded-xl text-xs font-bold font-headline uppercase tracking-wider cursor-pointer"
                >
                  Save preferences
                </button>
              </div>
            </form>
          </div>

          {/* BENTO CELL 3: Custom Schedule Calendar Planner */}
          <div className="neumorphic-card rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-headline font-black text-slate-800 text-base">
                    Custom Assembly Schedule ({bookingList.length})
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Your personal sequence of panels and committees.
                  </p>
                </div>
              </div>
              {bookingList.length > 0 && (
                <button
                  onClick={() => onNavigateToTab("schedule")}
                  className="text-xs font-black text-primary hover:underline flex items-center gap-1 cursor-pointer font-headline"
                >
                  Timetable <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {bookingList.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {bookingList.map((session) => (
                  <div key={session.id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0 gap-4">
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 uppercase font-headline truncate tracking-tighter">
                        {session.title}
                      </p>
                      <div className="flex gap-4 text-[10px] text-slate-500 mt-1 font-semibold">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3 text-secondary" /> {session.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary" /> {session.room}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveSession(session.id)}
                      className="text-[10px] font-bold text-red-600 hover:text-red-700 bg-red-100/40 hover:bg-red-100 tracking-wider hover:border-red-500 border border-transparent rounded-lg py-1.5 px-3 shrink-0 cursor-pointer transition-all"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-[#f4f5f2] rounded-2xl border border-dashed border-outline-variant/60 flex flex-col items-center">
                <Sparkles className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600">Your custom agenda planner is empty</p>
                <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">Explore the full summit timetable program to pick panels matching your credentials.</p>
                <button
                  onClick={() => onNavigateToTab("schedule")}
                  className="neumorphic-btn text-xs font-bold font-headline uppercase mt-4 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Browse Programme
                </button>
              </div>
            )}
          </div>

          {/* BENTO CELL 4: Saved Resources Legislation Papers */}
          <div className="neumorphic-card rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-cyan-100 text-cyan-800 border border-cyan-200">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-headline font-black text-slate-800 text-base">
                  Saved Technical Legislation ({bookmarkList.length})
                </h3>
                <p className="text-xs text-slate-500 font-medium font-sans">
                  Secure in-app references and quality draft compliance handbooks.
                </p>
              </div>
            </div>

            {bookmarkList.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {bookmarkList.map((doc) => (
                  <div key={doc.id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0 gap-4">
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 font-headline truncate tracking-tighter">
                        {doc.title}
                      </p>
                      <p className="text-[9px] text-[#775a00] font-mono mt-1 font-bold">
                        FILE: {doc.fileType} • SIZE: {doc.size} • REVISION: {doc.revision || "v1.0"}
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => onNavigateToTab("resources")}
                        className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold text-[10px] font-headline uppercase py-1.5 px-3 rounded-lg transition-all cursor-pointer"
                      >
                        Read
                      </button>
                      <button
                        onClick={() => onRemoveBookmark(doc.id)}
                        className="text-slate-500 hover:text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-lg py-1.5 px-2 text-[10px] font-bold cursor-pointer transition-all"
                      >
                        Un-save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-[#f4f5f2] rounded-2xl border border-dashed border-outline-variant/60 flex flex-col items-center">
                <p className="text-xs font-bold text-slate-600">No regulatory documents saved in your briefcase</p>
                <button
                  onClick={() => onNavigateToTab("resources")}
                  className="neumorphic-btn text-xs font-bold font-headline uppercase mt-3 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Explore Documents
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
