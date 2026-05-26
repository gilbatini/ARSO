import { Session, ResourceItem, Hotel, ShuttleTime } from "./types";

export const MOCK_SESSIONS: Session[] = [
  {
    id: "sess-1",
    day: 1,
    dateString: "June 15, 2026",
    title: "Opening Ceremony and Plenary Keynotes",
    time: "09:00 AM - 11:30 AM",
    category: "keynote",
    room: "Grand Victoria Ballroom",
    description: "Official welcome address by ARSO Secretary General, address by host country representatives (UNBS), and keynote addresses from African Union representatives on standards enabling intra-African trade.",
    speakers: [
      {
        name: "Dr. Hermogene Nsengimana",
        role: "Secretary General",
        organization: "ARSO"
      },
      {
        name: "Hon. Jane Ruth Aceng",
        role: "Minister of Trade, Industry & Cooperatives",
        organization: "Government of Uganda"
      }
    ]
  },
  {
    id: "sess-2",
    day: 1,
    dateString: "June 15, 2026",
    title: "Initial Assembly Briefing: Committee Assignments",
    time: "01:00 PM - 03:30 PM",
    category: "general-assembly",
    room: "Munyonyo Plenary Hall",
    description: "Launch of the 32nd General Assembly agenda, delegate code of conduct briefing, and assignment of committees to regional harmonization panels.",
    speakers: [
      {
        name: "Sarah Nakato",
        role: "Director of Standardization",
        organization: "UNBS / Host Secretariat"
      }
    ]
  },
  {
    id: "sess-3",
    day: 2,
    dateString: "June 16, 2026",
    title: "Committee Session: Agriculture and Food Standards",
    time: "09:00 AM - 12:00 PM",
    category: "committee",
    room: "Committee Room A",
    description: "Harmonization of agricultural quality requirements for inter-state crop exchange under the AfCFTA framework. Focus on sanitary and phytosanitary (SPS) standards.",
    speakers: [
      {
        name: "Prof. Victor Mukasa",
        role: "Chairperson, TC 02",
        organization: "KARI / East African Community"
      }
    ]
  },
  {
    id: "sess-4",
    day: 2,
    dateString: "June 16, 2026",
    title: "Interactive Workshop: Digital Quality Infrastructure",
    time: "02:00 PM - 05:00 PM",
    category: "workshop",
    room: "Munyonyo Training Center",
    description: "Hands-on simulation on implementing paperless certificates of conformity and digital verification services across regional customs check points.",
    speakers: [
      {
        name: "Amara Diallo",
        role: "Lead Systems Architect",
        organization: "ECOWAS Digital Secretariat"
      }
    ]
  },
  {
    id: "sess-5",
    day: 3,
    dateString: "June 17, 2026",
    title: "Mid-Session Technical Review",
    time: "10:00 AM - 01:00 PM",
    category: "general-assembly",
    room: "Grand Victoria Ballroom",
    description: "Interim presentation of findings from standardisation working groups. Open deliberations on East African and West African harmonization bottlenecks.",
    speakers: [
      {
        name: "Dr. Hermogene Nsengimana",
        role: "Secretary General",
        organization: "ARSO"
      }
    ]
  },
  {
    id: "sess-6",
    day: 3,
    dateString: "June 17, 2026",
    title: "Panel Discussion: Mutual Recognition Frameworks",
    time: "03:00 PM - 05:30 PM",
    category: "keynote",
    room: "Munyonyo Plenary Hall",
    description: "Joint presentation between ISO representatives and ARSO on bridging the gap between global international standards and local continental frameworks.",
    speakers: [
      {
        name: "Jean-Pierre Durand",
        role: "Head of International Cooperation",
        organization: "ISO Secretariat"
      },
      {
        name: "Fatoumata Sylla",
        role: "Standards Coordinator",
        organization: "African Union Commission"
      }
    ]
  },
  {
    id: "sess-7",
    day: 4,
    dateString: "June 18, 2026",
    title: "Committee Session: Industrial Manufacturing Quality Protocols",
    time: "09:00 AM - 12:30 PM",
    category: "committee",
    room: "Committee Room B",
    description: "Finalization of standard requirements for steel, cement, and chemical goods manufactured on the continent to minimize double-testing requirements.",
    speakers: [
      {
        name: "Obioma Okafor",
        role: "Technical Convener",
        organization: "MAN / Standards Organisation of Nigeria"
      }
    ]
  },
  {
    id: "sess-8",
    day: 4,
    dateString: "June 18, 2026",
    title: "Networking Cocktail: Connecting Continental Quality",
    time: "06:30 PM - 09:00 PM",
    category: "social",
    room: "Lakeside Marina Gardens",
    description: "Outdoor buffet and live traditional entertainment. Informal networking amongst all regional coordinators, government delegations, and accredited standards experts.",
    speakers: []
  },
  {
    id: "sess-9",
    day: 5,
    dateString: "June 19, 2026",
    title: "Final Declaration Draft and Signing Ceremony",
    time: "09:30 AM - 01:00 PM",
    category: "general-assembly",
    room: "Grand Victoria Ballroom",
    description: "Formal reading of the Kampala Declaration on Continental Standards Harmonization. Acceptance of motions, final voting, and signing by national delegation leaders.",
    speakers: [
      {
        name: "Dr. Hermogene Nsengimana",
        role: "Secretary General",
        organization: "ARSO"
      },
      {
        name: "Sarah Nakato",
        role: "Secretariat Coordinator",
        organization: "UNBS"
      }
    ]
  },
  {
    id: "sess-10",
    day: 5,
    dateString: "June 19, 2026",
    title: "32nd Assembly Presidential Dinner Gala",
    time: "07:30 PM - 11:00 PM",
    category: "social",
    room: "Royal Palms Pavilion",
    description: "Elite closing dinner hosted by the Government of Uganda for all accredited foreign ministers, general directors of standards bureaus, and honorary fellows.",
    speakers: []
  }
];

export const MOCK_RESOURCES: ResourceItem[] = [
  {
    id: "res-essential",
    title: "Essential Delegate Pack v1.2",
    category: "administrative",
    description: "The complete manual containing administrative procedures, hotel profiles, shuttle services timeline, local tourism attractions in Kampala, and critical security contacts.",
    size: "24.0 MB",
    pages: "45",
    revision: "v1.2",
    language: "EN / FR",
    updatedAt: "May 25, 2026",
    fileType: "PDF",
    downloadUrl: "#",
    contentSnippet: `ARSO 2026 GENERAL ASSEMBLY DELEGATE HANDBOOK
Section 1: Host Country Welcome & Practicalities
On behalf of the African Organisation for Standardisation (ARSO) and the Uganda National Bureau of Standards (UNBS), we are pleased to welcome you to the 32nd General Assembly in Kampala, Uganda.

VENUE DETAILS:
The event sits at the Commonwealth Resort, Munyonyo. Set on 90 acres of tranquil land along Lake Victoria, this world-class venue features leading convention amenities tailored to intergovernmental delegations.

SECURITY & TRAVEL:
All official delegates entering Uganda are subject to visa-on-arrival or e-visa clearance. Standard diplomatic courtesy protocols apply. Security checkpoints operate 24/7 inside the resort perimeter. In case of emergency, contact the UNBS Secretariat Liaison immediately at desk +256 414 4455.`
  },
  {
    id: "res-standards",
    title: "Technical Standards Framework 2026",
    category: "technical",
    description: "A comprehensive guide outlining the proposed harmonization of industrial standards across East Africa, focusing on AfCFTA integration and quality assurance protocols.",
    size: "12.0 MB",
    pages: "84",
    revision: "v2.1",
    language: "EN / FR",
    updatedAt: "May 24, 2026",
    fileType: "PDF",
    downloadUrl: "#",
    contentSnippet: `ARSO TECHNICAL STANDARDS INTEGRATION SCHEME
SUB-SECTION III: CROSS-BORDER INDUSTRIAL COMPLIANCE
Historically, duplicate product certifications and conflicting quality guidelines have led to major bottlenecks in continental cargo movement. This Technical Standards Framework v2.1 introduces regional equivalence pathways:

1. COMPATIBILITY OF TEST SPECIFICATIONS
Laboratory certifications issued by SADC, ECOWAS, and EAC standards boards are compiled under a single reference matrix, ensuring tests carried out in Mombasa are valid in Lagos.

2. HARMONIZATION OF MEASUREMENT TOLERANCES
Acceptable quality deviations in manufacturing inputs (e.g. structural steel tensile strength, Portland cement grades) are locked to ARSO-Standard 322-A to facilitate friction-free mutual recognition agreements.`
  },
  {
    id: "res-harmonization",
    title: "Continental Trade Harmonization Draft",
    category: "technical",
    description: "An operational draft setting parameters for reciprocal certification recognition to decrease cross-border clearing times under the African Continental Free Trade Area (AfCFTA).",
    size: "12.8 MB",
    pages: "112",
    revision: "v1.0",
    language: "EN / FR",
    updatedAt: "May 19, 2026",
    fileType: "PDF",
    downloadUrl: "#",
    contentSnippet: `OPERATIONAL TRADE AGREEMENT MATRIX - AfCFTA & ARSO
Under Annex 6 of the AfCFTA Protocol on Trade in Goods, State Parties commit to reducing Technical Barriers to Trade (TBTs).

This draft formalizes:
1. Joint Inspections: Customs officials from originating and destination countries will perform single joint quality audits.
2. Shared Database: An online repository hosted by ARSO storing high-resolution electronic copies of Certificates of Conformity (CoCs) matching digital barcode indices on container packaging.`
  },
  {
    id: "res-conduct",
    title: "Delegate Code of Conduct",
    category: "legal",
    description: "Diplomatic ground rules for committee deliberations, procedural voting methods, conflict of interest disclosures, and administrative fairness.",
    size: "1.2 MB",
    pages: "14",
    revision: "v3.4",
    language: "EN",
    updatedAt: "May 15, 2026",
    fileType: "PDF",
    downloadUrl: "#",
    contentSnippet: `DELEGATE PROCEDURAL CONDUCT & VOTING NORMS
1. STRICT IMPARTIALITY
All delegation members must represent national and consensus regional interests. Commercial associations or lobby entities must declare their participant observer status at the commencement of each technical debate.

2. VOTING APPORTIONMENT
Every accredited ARSO state member commands exactly one vote. Voting by proxy is permissible if certified in writing by the country's Trade Minister. Resolutions require a 2/3 majority in plenary to be appended to the General Assembly record.`
  },
  {
    id: "res-dietary",
    title: "Dietary & Gala Guide",
    category: "logistics",
    description: "Complete list of diplomatic dinners, hotel dining menus, traditional dietary compliance certifications (Halal, Kosher, Vegan), and seating request registry.",
    size: "3.5 MB",
    pages: "8",
    revision: "v1.1",
    language: "EN / FR",
    updatedAt: "May 22, 2026",
    fileType: "PDF",
    downloadUrl: "#",
    contentSnippet: `ARSO 2026 SOVEREIGN DINNER & GALA LOGISTICS
Catering details for Speke Commonwealth Resort and Serena Lakeside venues:

All meats served during the assembly undergo Halal guidelines. Certified vegetarian, vegan, and gluten-free dietary stations operate at all group buffet lunches.
GALA ENTRY PROTOCOL:
State Leaders, Ministers, and Directors of Standards are requested to dress in official traditional attire or black-tie formal wear for the Presidential Dinner on June 19th.`
  },
  {
    id: "res-map",
    title: "Interactive Resort Map",
    category: "logistics",
    description: "High-resolution architectural blueprint of the Munyonyo Commonwealth Resort, containing marked committee rooms, shuttle drop-off bays, and translation centers.",
    size: "8.9 MB",
    pages: "1",
    revision: "v4.0",
    language: "EN",
    updatedAt: "May 20, 2026",
    fileType: "IMG",
    downloadUrl: "#",
    contentSnippet: `MUNYONYO RESORT LAYOUT INDEX
- Grand Victoria Ballroom: Day 1 Opening Plenary / Day 5 declaration signing.
- Munyonyo Plenary Hall: General Assembly debates & keynotes.
- Committee Room A & B: Underneath the main floor of the convention foyer.
- Lakeside Marina Gardens: Evening social cocktail.
- Royal Palms Pavilion: Presidential Closing Gala.`
  }
];

export const MOCK_HOTELS: Hotel[] = [
  {
    id: "h-1",
    name: "Speke Commonwealth Resort",
    address: "Wavamunno Road, Munyonyo, Kampala",
    stars: 5,
    pricePerNight: "$180",
    distanceToVenue: "Host Venue (0 km)",
    description: "The official luxury host resort directly hosting the general assembly. Features 5-star lakeside amenities, secure diplomatic quarters, and modern meeting chambers.",
    bookingUrl: "https://www.spekeresort.com/"
  },
  {
    id: "h-2",
    name: "Kampala Serena Hotel",
    address: "Kintu Road, Central Kampala",
    stars: 5,
    pricePerNight: "$240",
    distanceToVenue: "12 km (Shuttle Provided)",
    description: "An elegant, prestigious hotel in the heart of Kampala's central business district, surrounded by serene Ugandan gardens. Preferred hotel for international delegations and ministers.",
    bookingUrl: "https://www.serenahotels.com/kampala"
  },
  {
    id: "h-3",
    name: "Sheraton Kampala Hotel",
    address: "Ternan Avenue, Kampala",
    stars: 5,
    pricePerNight: "$165",
    distanceToVenue: "13 km (Shuttle Provided)",
    description: "Immaculate rooms overlooking Kampala city. Secure perimeters, foreign currency exchanges, and regular scheduled shuttle connections direct to the assembly ballroom.",
    bookingUrl: "https://www.marriott.com/en-us/hotels/ebbsh-sheraton-kampala-hotel/"
  },
  {
    id: "h-4",
    name: "Munyonyo Biraj Resort",
    address: "Munyonyo, near Lakeside",
    stars: 4,
    pricePerNight: "$95",
    distanceToVenue: "1.2 km",
    description: "A highly rated boutique hotel located near the lake shore, offering excellent cost-effective lodging for technical staffers, translators, and observer assistants.",
    bookingUrl: "#"
  }
];

export const MOCK_SHUTTLES: ShuttleTime[] = [
  {
    id: "sh-1",
    from: "Entebbe Airport (EBB)",
    to: "Commonwealth Resort (Munyonyo)",
    timeString: "Hourly departures (24/7)",
    frequency: "Every 60 minutes",
    notes: "Accredited delegate reception counter is operating directly in the arrival terminal. Look for ARSO 2026 signs."
  },
  {
    id: "sh-2",
    from: "Kampala Serena Hotel",
    to: "Commonwealth Resort (Munyonyo)",
    timeString: "Morning: 07:00, 07:45, 08:30 | Evening: 17:30, 18:30",
    frequency: "Scheduled sessions",
    notes: "Departs from the primary hotel lobby foyer. Security escort is active for official minister coaches."
  },
  {
    id: "sh-3",
    from: "Sheraton Kampala Hotel",
    to: "Commonwealth Resort (Munyonyo)",
    timeString: "Morning: 07:15, 08:00 | Evening: 18:00, 19:00",
    frequency: "Scheduled sessions",
    notes: "Main terminal departure from the Marriott foyer."
  }
];
