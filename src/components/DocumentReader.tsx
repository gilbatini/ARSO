import React, { useState, useMemo } from "react";
import { ResourceItem } from "../types";
import { 
  X, 
  Download, 
  Bookmark, 
  Search, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  FileText,
  AlertCircle
} from "lucide-react";

interface DocumentReaderProps {
  resource: ResourceItem;
  allResources: ResourceItem[];
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export default function DocumentReader({
  resource,
  allResources,
  onClose,
  isBookmarked,
  onToggleBookmark
}: DocumentReaderProps) {
  const [activeRes, setActiveRes] = useState<ResourceItem>(resource);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  // Filter resources to highlight technical and administrative items
  const documentList = useMemo(() => {
    return allResources.filter(r => r.category === "technical" || r.category === "administrative" || r.category === "legal");
  }, [allResources]);

  // Generate mocked pages of content to make the document reader highly immersive
  const documentPages = useMemo(() => {
    const defaultSnippet = activeRes.contentSnippet || "Full document text is currently loading from the ARSO secure node...";
    return [
      {
        pageNum: 1,
        title: "Introduction and Executive Summary",
        content: defaultSnippet
      },
      {
        pageNum: 2,
        title: "Section 2 - Core Quality Infrastructures",
        content: `MEMBER STATE COOPERATION MATRIX - ARSO 2026
Pursuant to Article 5 of the African Organisation for Standardisation treaty, all member state bureaus agree to publish quarterly alignment reports.

KEY REQUIREMENTS:
A. Reciprocal Audits: Accredited laboratories undergo joint oversight by SADCAS and EAK (EAC) validation experts.
B. Certificate Authorization: The issuing bureau verifies the origin of packaging inputs to certify compliance with AfCFTA regulations.
C. Dispute Handling: Technical disagreements face evaluation by the ARSO Regional Commission of Experts prior to tariff tribunal escalations.`
      },
      {
        pageNum: 3,
        title: "Section 3 - Legal Compliance & Penalties",
        content: `REGULATORY MANDATES & COMPLIANCE TIMELINES
All certified industrial goods transit ports of entry with mandatory QR compliance routing. Failing to carry a verified digital Certificate of Conformity (CoC) subjects cargo to secondary off-loading audits.

PENALTIES:
- Non-conforming industrial products face a 48-hour return mandate.
- Repeated compliance anomalies spark temporary suspension of mutual recognition status for the originating supplier.`
      }
    ];
  }, [activeRes]);

  const activePageData = documentPages.find(p => p.pageNum === currentPage) || documentPages[0];

  const handleDownload = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Safe search matcher to highlight searched text in the document
  const highlightSearch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 text-on-surface font-semibold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col bg-charcoal/90 backdrop-blur-md bg-black/60">
      {/* Top Bar */}
      <header className="flex justify-between items-center bg-primary text-white py-4 px-6 shadow-md border-b-2 border-secondary-container">
        <div className="flex items-center gap-3">
          <BookOpen className="text-secondary-container h-6 w-6" />
          <div>
            <h1 className="font-headline text-lg md:text-xl font-bold tracking-tight">
              ARSO secure Document Reader
            </h1>
            <p className="text-xs text-on-primary-container font-mono">
              SECURE WORKSPACE // ARSO.TC.SECURE.NODE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onToggleBookmark(activeRes.id)}
            className={`flex items-center gap-2 text-xs uppercase tracking-wider font-bold py-1.5 px-3 rounded-md border transition-all ${
              isBookmarked 
                ? "bg-secondary-container text-on-secondary-container border-secondary-container" 
                : "border-white/30 hover:bg-white/10"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">{isBookmarked ? "Bookmarked" : "Bookmark File"}</span>
          </button>

          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold bg-white text-primary hover:bg-secondary-container hover:text-on-secondary-container py-1.5 px-3 rounded-md transition-all shadow-md"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button 
            onClick={onClose}
            className="p-1 px-2 rounded-full hover:bg-white/15 text-white transition-all cursor-pointer"
            aria-label="Close document reader"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Main split-pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Navigation (Document Switcher & Metadata) */}
        <aside className="w-80 border-r border-outline/20 bg-background overflow-y-auto hidden md:flex flex-col p-6">
          <h2 className="text-xs uppercase tracking-widest text-secondary font-bold mb-4 font-headline">
            Technical Documents
          </h2>

          <div className="space-y-2 mb-6">
            {documentList.map((doc) => {
              const isActive = doc.id === activeRes.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => {
                    setActiveRes(doc);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 cursor-pointer ${
                    isActive 
                      ? "bg-primary/5 border-primary text-primary" 
                      : "bg-white border-outline-variant hover:border-primary/50"
                  }`}
                >
                  <FileText className={`h-5 w-5 mt-0.5 shrink-0 ${isActive ? "text-primary" : "text-outline"}`} />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold font-sans truncate">{doc.title}</p>
                    <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">{doc.size} • {doc.pages || "?"} Pages</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-outline/10 pt-6 mt-auto">
            <h3 className="text-[11px] uppercase tracking-widest font-bold text-on-surface-variant mb-3">
              Document Attributes
            </h3>
            
            <div className="bg-surface-container rounded-lg p-4 space-y-3 text-xs font-sans">
              <div className="flex justify-between border-b border-outline/10 pb-1.5">
                <span className="text-on-surface-variant">Document Revision</span>
                <span className="font-bold text-primary font-mono">{activeRes.revision || "v1.0"}</span>
              </div>
              <div className="flex justify-between border-b border-outline/10 pb-1.5">
                <span className="text-on-surface-variant">Pages count</span>
                <span className="font-bold text-primary font-mono">{activeRes.pages || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-outline/10 pb-1.5">
                <span className="text-on-surface-variant">Document Size</span>
                <span className="font-bold text-primary font-mono">{activeRes.size}</span>
              </div>
              <div className="flex justify-between border-b border-outline/10 pb-1.5">
                <span className="text-on-surface-variant">Language</span>
                <span className="font-bold text-primary font-mono">{activeRes.language || "EN"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-sans">Last Updated</span>
                <span className="font-bold text-primary font-mono">{activeRes.updatedAt}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-secondary-container/10 border border-secondary-container/20 rounded-lg text-[11px] text-on-secondary-container leading-relaxed flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-secondary mt-0.5" />
              <span>Standardization documents are classified inside the EAC and ECOWAS legal boundaries. Do not duplicate.</span>
            </div>
          </div>
        </aside>

        {/* Center/Right Main Reader Pane */}
        <main className="flex-1 flex flex-col bg-surface-container-low overflow-hidden">
          {/* Controls Bar */}
          <div className="bg-white border-b border-outline/15 px-6 py-3 flex flex-wrap gap-4 justify-between items-center shadow-sm">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search within page..."
                className="w-full text-xs pl-9 pr-4 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Document stats / zoom / paging */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1 border border-outline-variant bg-surface rounded-lg p-1">
                <button 
                  onClick={() => setZoomLevel(prev => Math.max(75, prev - 25))}
                  className="px-2 py-1 text-on-surface hover:bg-surface-container rounded font-sans cursor-pointer"
                  title="Zoom out"
                >
                  -
                </button>
                <span className="px-2 font-mono text-[10px]">{zoomLevel}%</span>
                <button 
                  onClick={() => setZoomLevel(prev => Math.min(200, prev + 25))}
                  className="px-2 py-1 text-on-surface hover:bg-surface-container rounded font-sans cursor-pointer"
                  title="Zoom in"
                >
                  +
                </button>
              </div>

              {/* Page selectors */}
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-1.5 rounded-md border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low disabled:opacity-40 transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono text-on-surface-variant">
                  Page <b className="text-on-surface">{currentPage}</b> of {documentPages.length}
                </span>
                <button
                  disabled={currentPage === documentPages.length}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-1.5 rounded-md border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low disabled:opacity-40 transition-all cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4 text-on-surface" />
                </button>
              </div>
            </div>
          </div>

          {/* Page Display Pane */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start">
            <div 
              className="bg-white rounded-xl shadow-lg border border-outline-variant/30 px-6 md:px-12 py-10 transition-all text-on-surface"
              style={{ 
                maxWidth: "800px", 
                width: "100%",
                transform: `scale(${zoomLevel / 100})`, 
                transformOrigin: "top center"
              }}
            >
              {/* Fake PDF Header */}
              <div className="flex justify-between items-center border-b-2 border-primary/20 pb-4 mb-6">
                <div>
                  <p className="text-[10px] font-bold text-primary font-headline uppercase tracking-widest">
                    African Organisation for Standardisation (ARSO)
                  </p>
                  <p className="text-xs font-semibold text-secondary font-headline">
                    32nd Assembly Secretariat • Kampala, Uganda
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-mono text-outline">CLASSIFICATION: CO-ACC-2026</p>
                  <p className="text-[9px] font-mono text-outline">REF: {activeRes.id.toUpperCase()}</p>
                </div>
              </div>

              {/* Page Number Badge */}
              <div className="inline-block px-2 py-0.5 bg-primary/15 text-primary text-[10px] font-mono font-bold rounded-lg mb-4">
                PAGE {currentPage} // {activePageData.title}
              </div>

              {/* Page Actual Content with optional query highlighting */}
              <div className="text-sm leading-relaxed text-on-surface font-sans space-y-4">
                {activePageData.content.split("\n\n").map((para, paraIdx) => (
                  <p key={paraIdx} className="whitespace-pre-line text-xs md:text-sm">
                    {highlightSearch(para, searchQuery)}
                  </p>
                ))}
              </div>

              {/* Fake PDF Footer */}
              <div className="border-t border-outline-variant/50 pt-4 mt-12 flex justify-between items-center text-[10px] text-outline font-mono">
                <span>© 2026 ARSO. TECHNICAL SPECIFICATION CO-ACCORDANCE.</span>
                <span> Kampala, Uganda, June 2026</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Download Alert Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-white py-3 px-5 rounded-lg shadow-2xl border border-secondary-container animate-bounce">
          <div className="p-1 bg-white/10 rounded-full">
            <Check className="h-4 w-4 text-secondary-container" />
          </div>
          <div className="text-xs">
            <p className="font-bold">Offline Sync Complete</p>
            <p className="opacity-80">"{activeRes.title}" downloaded securely to your delegate pack.</p>
          </div>
        </div>
      )}
    </div>
  );
}
