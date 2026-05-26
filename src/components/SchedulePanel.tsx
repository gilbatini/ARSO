import React, { useState, useMemo } from "react";
import { Session } from "../types";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Search, 
  Check, 
  Plus, 
  Users,
  CalendarDays,
  Sparkles
} from "lucide-react";

interface SchedulePanelProps {
  sessions: Session[];
  myScheduleIds: string[];
  onToggleSchedule: (id: string) => void;
  isLoggedIn: boolean;
  onNavigateToPortal: () => void;
}

export default function SchedulePanel({
  sessions,
  myScheduleIds,
  onToggleSchedule,
  isLoggedIn,
  onNavigateToPortal
}: SchedulePanelProps) {
  const [activeDay, setActiveDay] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const daysList = [
    { num: 1, label: "Day 1", date: "June 15" },
    { num: 2, label: "Day 2", date: "June 16" },
    { num: 3, label: "Day 3", date: "June 17" },
    { num: 4, label: "Day 4", date: "June 18" },
    { num: 5, label: "Day 5", date: "June 19" }
  ];

  const categories = [
    { value: "all", label: "All Items" },
    { value: "keynote", label: "Keynotes" },
    { value: "committee", label: "Committees" },
    { value: "workshop", label: "Workshops" },
    { value: "general-assembly", label: "Assemblies" },
    { value: "social", label: "Socials" }
  ];

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesDay = session.day === activeDay;
      const matchesCategory = selectedCategory === "all" || session.category === selectedCategory;
      
      const sessionString = `${session.title} ${session.description} ${session.speakers?.map(s => s.name).join(" ") || ""}`.toLowerCase();
      const matchesSearch = !searchQuery || sessionString.includes(searchQuery.toLowerCase());

      return matchesDay && matchesCategory && matchesSearch;
    });
  }, [sessions, activeDay, selectedCategory, searchQuery]);

  return (
    <div className="neumorphic-card rounded-3xl overflow-hidden">
      
      {/* Top Banner with Day select tabs */}
      <div className="bg-primary/5 border-b border-slate-200/50 py-6 px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-headline font-black text-slate-800 text-lg tracking-tight">
                Summit Agenda & Technical Planner
              </h3>
              <p className="text-xs text-slate-500 font-medium font-sans">
                Build your accredited schedule to synchronize your credential badge.
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-black flex items-center gap-1.5 font-mono bg-white px-3 py-1.5 border border-slate-200/80 rounded-lg shadow-sm">
            <span>LOCATION: Commonwealth Resort</span>
          </div>
        </div>

        {/* Days selector bar using beautiful Neumorphic tabs */}
        <div className="grid grid-cols-5 gap-2 md:gap-4 mt-6">
          {daysList.map((day) => {
            const isTabActive = day.num === activeDay;
            return (
              <button
                key={day.num}
                onClick={() => setActiveDay(day.num)}
                className={`py-3 px-1 rounded-xl text-center transition-all cursor-pointer ${
                  isTabActive
                    ? "neumorphic-btn-primary scale-[1.02]"
                    : "neumorphic-btn"
                }`}
              >
                <p className="text-[9px] md:text-[10px] uppercase tracking-wider font-mono font-bold block opacity-75">{day.label}</p>
                <p className="text-[11px] md:text-sm font-headline tracking-tighter leading-none mt-1 font-black">{day.date}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid controllers search & categories */}
      <div className="p-6 border-b border-slate-200/50 bg-[#f4f5f2] flex flex-col lg:flex-row gap-5 items-center justify-between">
        
        {/* Search wrapped in an beautiful inset tactile shadow */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <div className="neumorphic-card-inset rounded-xl p-0.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keynotes, speakers, topics..."
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 font-semibold"
            />
          </div>
        </div>

        {/* Categories slider utilizing soft button capsules */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto items-center">
          {categories.map((cat) => {
            const isCatActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer border ${
                  isCatActive
                    ? "neumorphic-btn-primary border-primary"
                    : "neumorphic-btn border-transparent"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Events list */}
      <div className="p-6 divide-y divide-slate-100 bg-white">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => {
            const isBookmarked = myScheduleIds.includes(session.id);
            
            const getCategoryStyle = (cat: string) => {
              switch(cat) {
                case "keynote":
                  return "bg-secondary-container/15 text-[#745700] border-secondary-container/40";
                case "committee":
                  return "bg-[#ffdcc1] text-[#7b5027] border-[#ffdcc1]";
                case "workshop":
                  return "bg-primary-container/15 text-primary border-primary-container/40";
                case "social":
                  return "bg-pink-50 text-pink-700 border-pink-200";
                default:
                  return "bg-slate-100 text-slate-600 border-slate-200";
              }
            };

            return (
              <div key={session.id} className="py-6 flex flex-col md:flex-row gap-6 first:pt-0 last:pb-0 items-start md:items-center">
                
                {/* Event Timing Column (Nested micro bento cell) */}
                <div className="w-full md:w-1/4 shrink-0 font-sans">
                  <div className="flex items-center gap-2 text-primary font-black">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs md:text-sm font-mono tracking-tight">{session.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mt-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>{session.room}</span>
                  </div>

                  <span className={`inline-block border text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full mt-3 font-headline ${getCategoryStyle(session.category)}`}>
                    {session.category}
                  </span>
                </div>

                {/* Event details column with gorgeous title */}
                <div className="flex-1 space-y-2.5">
                  <h4 className="text-sm md:text-base font-black text-slate-800 tracking-tight leading-snug font-headline">
                    {session.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {session.description}
                  </p>

                  {/* Speakers display row */}
                  {session.speakers && session.speakers.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                      <span className="text-[9px] text-slate-500 font-extrabold flex items-center gap-1 uppercase tracking-widest font-mono">
                        <Users className="h-3.5 w-3.5" /> Presenters:
                      </span>
                      {session.speakers.map((spk, spkIdx) => (
                        <div key={spkIdx} className="inline-flex items-center gap-1 bg-[#f4f5f2] rounded-lg px-2.5 py-1 text-xs border border-slate-200">
                          <span className="font-extrabold text-[#009c4d]">{spk.name}</span>
                          <span className="text-[10px] text-slate-500 shrink-0">({spk.role}, {spk.organization})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Event Action Button styled as a tactile custom selector */}
                <div className="w-full md:w-40 flex items-start justify-start md:justify-end shrink-0 md:self-center mt-3 md:mt-0">
                  <button
                    onClick={() => onToggleSchedule(session.id)}
                    className={`w-full md:w-auto text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-black transition-all cursor-pointer uppercase tracking-wider font-headline border ${
                      isBookmarked
                        ? "neumorphic-btn-primary border-primary"
                        : "neumorphic-btn border-transparent"
                    }`}
                  >
                    {isBookmarked ? (
                      <>
                        <Check className="h-4 w-4 text-white" strokeWidth={3} /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" /> Add
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-slate-500">
            <CalendarDays className="h-12 w-12 mx-auto text-slate-400 mb-3 animate-pulse" />
            <p className="font-black font-headline">No matching sessions found</p>
            <p className="text-xs mt-1 text-slate-400">Try relaxing your search terms or choosing another category filter.</p>
          </div>
        )}
      </div>

      {/* Special Portal Invite banner if anonymous */}
      {!isLoggedIn && (
        <div className="bg-[#f0f4f1] border-t border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 font-semibold text-center md:text-left leading-relaxed max-w-xl">
            🎓 Connect directly with official committees and view your personalized delegate badge by logging into the <b>Accredited Member Portal</b>.
          </p>
          <button
            onClick={onNavigateToPortal}
            className="neumorphic-btn-primary text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl cursor-pointer shadow font-headline w-full md:w-auto text-center"
          >
            Access Portal
          </button>
        </div>
      )}
    </div>
  );
}
