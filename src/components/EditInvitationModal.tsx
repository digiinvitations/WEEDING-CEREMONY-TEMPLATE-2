import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Edit3,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Music,
  Heart,
  Sparkles,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Send,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Share2
} from "lucide-react";
import { WeddingConfig } from "../weddingConfig";

interface EditInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: WeddingConfig;
}

interface CeremonyEvent {
  id: string;
  eventName: string;
  date: string;
  day: string;
  time: string;
  venueName: string;
  venueAddress: string;
  mapDirectionsUrl: string;
}

export function getDayAndYear(dateStr: string): { day: string; year: string } {
  if (!dateStr) return { day: "", year: "" };
  const parts = dateStr.split("T")[0].split("-");
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dateObj = new Date(y, m, d);
    if (!isNaN(dateObj.getTime())) {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return {
        day: days[dateObj.getDay()],
        year: dateObj.getFullYear().toString(),
      };
    }
  }
  return { day: "", year: "" };
}

export function EditInvitationModal({ isOpen, onClose, currentConfig }: EditInvitationModalProps) {
  // 1. Bride & Groom State
  const [groomName, setGroomName] = useState(currentConfig.groom?.name || "");
  const [groomFather, setGroomFather] = useState(currentConfig.groom?.fatherName || "");
  const [groomMother, setGroomMother] = useState(currentConfig.groom?.motherName || "");
  const [groomBio, setGroomBio] = useState(currentConfig.groom?.bio || "");

  const [brideName, setBrideName] = useState(currentConfig.bride?.name || "");
  const [brideFather, setBrideFather] = useState(currentConfig.bride?.fatherName || "");
  const [brideMother, setBrideMother] = useState(currentConfig.bride?.motherName || "");
  const [brideBio, setBrideBio] = useState(currentConfig.bride?.bio || "");

  // 2. Main Wedding Info State
  // Extract date part YYYY-MM-DD
  const initialWeddingDate = currentConfig.weddingDate ? currentConfig.weddingDate.split("T")[0] : "2026-12-12";
  const [weddingDate, setWeddingDate] = useState(initialWeddingDate);
  const [weddingTime, setWeddingTime] = useState("07:00 PM Onwards");
  const [venueName, setVenueName] = useState(currentConfig.weddingEvents?.[0]?.venueName || "The Taj Mahal Palace & Tower");
  const [venueAddress, setVenueAddress] = useState(currentConfig.weddingEvents?.[0]?.venueAddress || "Apollo Bandar, Colaba, Mumbai, Maharashtra 400001");
  const [venueMapUrl, setVenueMapUrl] = useState(currentConfig.weddingEvents?.[0]?.mapDirectionsUrl || "");

  // 3. Wedding Ceremonies
  const initialEvents: CeremonyEvent[] = (currentConfig.weddingEvents && currentConfig.weddingEvents.length > 0)
    ? currentConfig.weddingEvents.map((evt, idx) => {
        const dInfo = getDayAndYear(initialWeddingDate);
        return {
          id: `evt-${idx}-${Date.now()}`,
          eventName: evt.eventName || "Ceremony",
          date: initialWeddingDate,
          day: dInfo.day,
          time: evt.time || "",
          venueName: evt.venueName || "",
          venueAddress: evt.venueAddress || "",
          mapDirectionsUrl: evt.mapDirectionsUrl || ""
        };
      })
    : [
        {
          id: "evt-haldi",
          eventName: "Haldi Ceremony",
          date: initialWeddingDate,
          day: getDayAndYear(initialWeddingDate).day,
          time: "10:00 AM",
          venueName: "Poolside Lawn, The Taj Mahal Palace",
          venueAddress: "Mumbai, Maharashtra",
          mapDirectionsUrl: ""
        },
        {
          id: "evt-sangeet",
          eventName: "Sangeet & Cocktail",
          date: initialWeddingDate,
          day: getDayAndYear(initialWeddingDate).day,
          time: "07:00 PM",
          venueName: "Grand Ballroom, The Taj Mahal Palace",
          venueAddress: "Mumbai, Maharashtra",
          mapDirectionsUrl: ""
        },
        {
          id: "evt-wedding",
          eventName: "Shubh Vivah (Wedding)",
          date: initialWeddingDate,
          day: getDayAndYear(initialWeddingDate).day,
          time: "07:30 PM",
          venueName: "Royal Courtyard, The Taj Mahal Palace",
          venueAddress: "Mumbai, Maharashtra",
          mapDirectionsUrl: ""
        }
      ];

  const [ceremonies, setCeremonies] = useState<CeremonyEvent[]>(initialEvents);
  const [selectedPreset, setSelectedPreset] = useState("Haldi Ceremony");

  // 4. Family Details (Optional)
  const [brideFamily, setBrideFamily] = useState(
    currentConfig.familyDetails?.welcomingText ? `${currentConfig.familyDetails.welcomingText}: Sharma & Extended Family` : ""
  );
  const [groomFamily, setGroomFamily] = useState(
    currentConfig.familyDetails?.names?.join(", ") || ""
  );

  // 5. Invitation Message (Optional)
  const [invitationMessage, setInvitationMessage] = useState(
    currentConfig.welcomeMessage?.text || ""
  );

  // 6. Background Music (Optional)
  const [musicUrl, setMusicUrl] = useState(currentConfig.musicUrl || "");

  // 7. Specific Details / New Features & Quick-Insert Chips
  const [customFeatures, setCustomFeatures] = useState("");

  // Accordion Sections Open/Close
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    couple: true,
    weddingInfo: true,
    ceremonies: true,
    family: false,
    message: false,
    music: false,
    features: true
  });

  // Validation State
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Auto-calculated wedding day & year
  const mainWeddingDateInfo = getDayAndYear(weddingDate);

  // Helper chip items
  const helperChips = [
    { label: "👗 Dress Code / Theme", snippet: "• Dress Code / Color Theme: Traditional Indian / Pastel Gold\n" },
    { label: "🏷️ Wedding Hashtag", snippet: "• Wedding Hashtag: #\n" },
    { label: "📸 Photo Gallery Section", snippet: "• Photo Gallery: Want to include 8-12 couple portrait photos\n" },
    { label: "🎥 Live Streaming Link", snippet: "• Live Stream: Need YouTube/Zoom live stream link for remote relatives\n" },
    { label: "💌 RSVP Form", snippet: "• RSVP: Require guest count and meal preferences (Veg/Jain)\n" },
    { label: "⏳ Countdown Timer", snippet: "• Countdown Timer: Display live countdown days/hours to ceremony\n" },
    { label: "🏨 Hotel & Stay Info", snippet: "• Accommodation & Stay: Hotel check-in details and transport desk info\n" },
  ];

  const handleInsertChip = (snippet: string) => {
    setCustomFeatures((prev) => (prev.trim() ? `${prev.trim()}\n${snippet}` : snippet));
    // Ensure features section is open
    setOpenSections((prev) => ({ ...prev, features: true }));
  };

  // Add Ceremony
  const handleAddCeremony = () => {
    const dInfo = getDayAndYear(weddingDate);
    const newEvt: CeremonyEvent = {
      id: `evt-${Date.now()}`,
      eventName: selectedPreset === "Custom Event" ? "" : selectedPreset,
      date: weddingDate,
      day: dInfo.day,
      time: "11:00 AM",
      venueName: venueName || "",
      venueAddress: venueAddress || "",
      mapDirectionsUrl: venueMapUrl || ""
    };
    setCeremonies([...ceremonies, newEvt]);
  };

  // Remove Ceremony
  const handleRemoveCeremony = (id: string) => {
    setCeremonies(ceremonies.filter((c) => c.id !== id));
  };

  // Update Ceremony Field
  const handleUpdateCeremony = (id: string, field: keyof CeremonyEvent, val: string) => {
    setCeremonies((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, [field]: val };
          if (field === "date") {
            const dInfo = getDayAndYear(val);
            updated.day = dInfo.day;
          }
          return updated;
        }
        return c;
      })
    );
  };

  // Validation & WhatsApp Redirection
  const handleSendOnWhatsApp = () => {
    const errors: { [key: string]: string } = {};

    if (!groomName.trim()) {
      errors.groomName = "Please enter Groom's full name";
    }
    if (!brideName.trim()) {
      errors.brideName = "Please enter Bride's full name";
    }
    if (!weddingDate) {
      errors.weddingDate = "Please select the wedding date";
    }
    if (!venueName.trim()) {
      errors.venueName = "Please enter the wedding venue name";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Auto open required sections
      setOpenSections((prev) => ({
        ...prev,
        couple: true,
        weddingInfo: true
      }));
      return;
    }

    setValidationErrors({});

    // Current page link to identify selected template
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";

    // Build structured clean WhatsApp message
    let msg = `💍 *WEDDING INVITATION CUSTOMIZATION DETAILS* 💍\n`;
    msg += `-------------------------------------------\n`;
    msg += `🌐 *Selected Template URL:*\n${currentUrl}\n\n`;

    msg += `🤵 *GROOM DETAILS:*\n`;
    msg += `• Name: ${groomName.trim()}\n`;
    if (groomFather.trim()) msg += `• Father: ${groomFather.trim()}\n`;
    if (groomMother.trim()) msg += `• Mother: ${groomMother.trim()}\n`;
    if (groomBio.trim()) msg += `• Intro: ${groomBio.trim()}\n`;
    msg += `\n`;

    msg += `👰 *BRIDE DETAILS:*\n`;
    msg += `• Name: ${brideName.trim()}\n`;
    if (brideFather.trim()) msg += `• Father: ${brideFather.trim()}\n`;
    if (brideMother.trim()) msg += `• Mother: ${brideMother.trim()}\n`;
    if (brideBio.trim()) msg += `• Intro: ${brideBio.trim()}\n`;
    msg += `\n`;

    msg += `📅 *MAIN WEDDING INFORMATION:*\n`;
    msg += `• Date: ${weddingDate} (${mainWeddingDateInfo.day || "Day"}, ${mainWeddingDateInfo.year || ""})\n`;
    if (weddingTime.trim()) msg += `• Time: ${weddingTime.trim()}\n`;
    msg += `• Venue: ${venueName.trim()}\n`;
    if (venueAddress.trim()) msg += `• Address: ${venueAddress.trim()}\n`;
    if (venueMapUrl.trim()) msg += `• Maps Link: ${venueMapUrl.trim()}\n`;
    msg += `\n`;

    if (ceremonies.length > 0) {
      msg += `🎉 *WEDDING CEREMONIES (${ceremonies.length}):*\n`;
      ceremonies.forEach((evt, idx) => {
        msg += `${idx + 1}. *${evt.eventName || "Ceremony"}*\n`;
        msg += `   • Date & Day: ${evt.date} (${evt.day || "Calculated"})\n`;
        if (evt.time) msg += `   • Time: ${evt.time}\n`;
        if (evt.venueName) msg += `   • Venue: ${evt.venueName}\n`;
        if (evt.venueAddress) msg += `   • Address: ${evt.venueAddress}\n`;
        if (evt.mapDirectionsUrl) msg += `   • Map: ${evt.mapDirectionsUrl}\n`;
      });
      msg += `\n`;
    }

    if (brideFamily.trim() || groomFamily.trim()) {
      msg += `👨‍👩‍👧‍👦 *FAMILY DETAILS:*\n`;
      if (brideFamily.trim()) msg += `• Bride's Side: ${brideFamily.trim()}\n`;
      if (groomFamily.trim()) msg += `• Groom's Side: ${groomFamily.trim()}\n`;
      msg += `\n`;
    }

    if (invitationMessage.trim()) {
      msg += `💌 *CUSTOM INVITATION MESSAGE:*\n`;
      msg += `"${invitationMessage.trim()}"\n\n`;
    }

    if (musicUrl.trim()) {
      msg += `🎵 *BACKGROUND MUSIC (YOUTUBE LINK):*\n`;
      msg += `${musicUrl.trim()}\n\n`;
    }

    if (customFeatures.trim()) {
      msg += `✨ *SPECIFIC DETAILS / REQUESTED FEATURES:*\n`;
      msg += `${customFeatures.trim()}\n\n`;
    }

    msg += `-------------------------------------------\n`;
    msg += `Sent via Wedding Invitation Demo Customizer`;

    const encoded = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/919456411569?text=${encoded}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-[#FFFBF7] rounded-2xl shadow-2xl border border-amber-300/60 overflow-hidden flex flex-col max-h-[92vh] my-auto text-gray-800"
        >
          {/* Header */}
          <div className="relative px-5 py-4 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-amber-200">
                <Edit3 size={16} />
              </div>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold tracking-wide text-amber-100 flex items-center gap-2">
                  Edit Your Invitation
                </h3>
                <p className="text-[11px] sm:text-xs text-amber-200/80">
                  Fill your wedding details &amp; send directly on WhatsApp
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/15 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            {/* Top Prompt Banner */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-amber-900 text-[11px] sm:text-xs leading-relaxed">
              <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Quick &amp; Easy:</span> Enter your wedding details below. When you tap <strong>"Send Details on WhatsApp"</strong>, a pre-filled message with your template link will open ready for you to send to WhatsApp number: <strong>9456411569</strong>.
              </div>
            </div>

            {/* Validation Banner if any */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700 text-xs">
                <AlertCircle size={16} className="shrink-0" />
                <span>Please fill in the required fields marked in red below.</span>
              </div>
            )}

            {/* SECTION 1: BRIDE & GROOM DETAILS */}
            <div className="bg-white rounded-xl border border-amber-200/70 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("couple")}
                className="w-full px-4 py-3 bg-gradient-to-r from-amber-50/60 to-rose-50/40 flex items-center justify-between text-left font-display font-semibold text-amber-950 hover:bg-amber-100/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-rose-500 fill-rose-500/20" />
                  <span className="text-sm sm:text-base">1. Bride &amp; Groom Details</span>
                </div>
                {openSections.couple ? <ChevronUp size={18} className="text-amber-700" /> : <ChevronDown size={18} className="text-amber-700" />}
              </button>

              {openSections.couple && (
                <div className="p-4 space-y-5 border-t border-amber-100">
                  {/* Groom Section */}
                  <div className="bg-amber-50/30 rounded-lg p-3 border border-amber-100/80">
                    <h4 className="font-semibold text-amber-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <User size={14} className="text-amber-700" />
                      Groom Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={groomName}
                          onChange={(e) => setGroomName(e.target.value)}
                          placeholder="e.g. Aarav Sharma"
                          className={`w-full px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 ${
                            validationErrors.groomName ? "border-red-500 ring-red-400 bg-red-50/30" : "border-gray-300 focus:ring-amber-500"
                          }`}
                        />
                        {validationErrors.groomName && <p className="text-[10px] text-red-600 mt-0.5">{validationErrors.groomName}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Father's Name</label>
                        <input
                          type="text"
                          value={groomFather}
                          onChange={(e) => setGroomFather(e.target.value)}
                          placeholder="e.g. Shri Rajesh Sharma"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Mother's Name</label>
                        <input
                          type="text"
                          value={groomMother}
                          onChange={(e) => setGroomMother(e.target.value)}
                          placeholder="e.g. Smt. Sunita Sharma"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                    <div className="mt-2.5">
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Short Introduction (2–4 lines)</label>
                      <textarea
                        rows={2}
                        value={groomBio}
                        onChange={(e) => setGroomBio(e.target.value)}
                        placeholder="e.g. Software engineer based in Bengaluru with a passion for music and travel..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Bride Section */}
                  <div className="bg-rose-50/30 rounded-lg p-3 border border-rose-100/80">
                    <h4 className="font-semibold text-rose-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <User size={14} className="text-rose-700" />
                      Bride Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={brideName}
                          onChange={(e) => setBrideName(e.target.value)}
                          placeholder="e.g. Ananya Verma"
                          className={`w-full px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 ${
                            validationErrors.brideName ? "border-red-500 ring-red-400 bg-red-50/30" : "border-gray-300 focus:ring-amber-500"
                          }`}
                        />
                        {validationErrors.brideName && <p className="text-[10px] text-red-600 mt-0.5">{validationErrors.brideName}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Father's Name</label>
                        <input
                          type="text"
                          value={brideFather}
                          onChange={(e) => setBrideFather(e.target.value)}
                          placeholder="e.g. Shri Devendra Verma"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">Mother's Name</label>
                        <input
                          type="text"
                          value={brideMother}
                          onChange={(e) => setBrideMother(e.target.value)}
                          placeholder="e.g. Smt. Poonam Verma"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                    <div className="mt-2.5">
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Short Introduction (2–4 lines)</label>
                      <textarea
                        rows={2}
                        value={brideBio}
                        onChange={(e) => setBrideBio(e.target.value)}
                        placeholder="e.g. Architect and designer who loves art, dance and celebrating moments..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: WEDDING INFORMATION */}
            <div className="bg-white rounded-xl border border-amber-200/70 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("weddingInfo")}
                className="w-full px-4 py-3 bg-gradient-to-r from-amber-50/60 to-rose-50/40 flex items-center justify-between text-left font-display font-semibold text-amber-950 hover:bg-amber-100/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-amber-700" />
                  <span className="text-sm sm:text-base">2. Wedding Information</span>
                </div>
                {openSections.weddingInfo ? <ChevronUp size={18} className="text-amber-700" /> : <ChevronDown size={18} className="text-amber-700" />}
              </button>

              {openSections.weddingInfo && (
                <div className="p-4 space-y-3.5 border-t border-amber-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">
                        Wedding Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 ${
                          validationErrors.weddingDate ? "border-red-500 ring-red-400 bg-red-50/30" : "border-gray-300 focus:ring-amber-500"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">
                        Wedding Day <span className="text-amber-600 font-semibold">(Auto-calculated)</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={mainWeddingDateInfo.day || "Select date"}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50/60 text-amber-900 font-semibold text-xs cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">
                        Wedding Year <span className="text-amber-600 font-semibold">(Auto-calculated)</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={mainWeddingDateInfo.year || "Select date"}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50/60 text-amber-900 font-semibold text-xs cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">Wedding Time</label>
                      <input
                        type="text"
                        value={weddingTime}
                        onChange={(e) => setWeddingTime(e.target.value)}
                        placeholder="e.g. 07:00 PM onwards"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">
                        Wedding Venue Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        placeholder="e.g. The Taj Mahal Palace"
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 ${
                          validationErrors.venueName ? "border-red-500 ring-red-400 bg-red-50/30" : "border-gray-300 focus:ring-amber-500"
                        }`}
                      />
                      {validationErrors.venueName && <p className="text-[10px] text-red-600 mt-0.5">{validationErrors.venueName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">Full Venue Address</label>
                    <textarea
                      rows={2}
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      placeholder="e.g. Apollo Bandar, Colaba, Mumbai, Maharashtra 400001"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">Google Maps Link</label>
                    <input
                      type="url"
                      value={venueMapUrl}
                      onChange={(e) => setVenueMapUrl(e.target.value)}
                      placeholder="e.g. https://maps.app.goo.gl/..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: WEDDING CEREMONIES */}
            <div className="bg-white rounded-xl border border-amber-200/70 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("ceremonies")}
                className="w-full px-4 py-3 bg-gradient-to-r from-amber-50/60 to-rose-50/40 flex items-center justify-between text-left font-display font-semibold text-amber-950 hover:bg-amber-100/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-700" />
                  <span className="text-sm sm:text-base">3. Wedding Ceremonies ({ceremonies.length})</span>
                </div>
                {openSections.ceremonies ? <ChevronUp size={18} className="text-amber-700" /> : <ChevronDown size={18} className="text-amber-700" />}
              </button>

              {openSections.ceremonies && (
                <div className="p-4 space-y-4 border-t border-amber-100">
                  {/* Add Ceremony Bar */}
                  <div className="flex flex-wrap items-center gap-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60">
                    <span className="text-xs font-semibold text-amber-900 shrink-0">Choose Ceremony:</span>
                    <select
                      value={selectedPreset}
                      onChange={(e) => setSelectedPreset(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-500 flex-grow sm:flex-grow-0"
                    >
                      <option value="Haldi Ceremony">Haldi Ceremony</option>
                      <option value="Mehndi Ceremony">Mehndi Ceremony</option>
                      <option value="Sangeet &amp; Cocktail">Sangeet &amp; Cocktail</option>
                      <option value="Ring Ceremony / Engagement">Ring Ceremony / Engagement</option>
                      <option value="Shubh Vivah (Wedding)">Shubh Vivah (Wedding)</option>
                      <option value="Grand Reception">Grand Reception</option>
                      <option value="Custom Event">Custom Event</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddCeremony}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold transition-colors shadow-sm ml-auto cursor-pointer"
                    >
                      <Plus size={14} />
                      Add Event
                    </button>
                  </div>

                  {/* List of Ceremonies */}
                  <div className="space-y-3">
                    {ceremonies.map((evt, idx) => (
                      <div
                        key={evt.id}
                        className="p-3.5 bg-gray-50/70 border border-gray-200 rounded-xl relative space-y-2.5 transition-all hover:border-amber-300"
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-gray-200">
                          <span className="font-semibold text-amber-900 text-xs flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-amber-200/70 text-amber-900 text-[10px] flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            Ceremony #{idx + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveCeremony(evt.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove ceremony"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Event Name</label>
                            <input
                              type="text"
                              value={evt.eventName}
                              onChange={(e) => handleUpdateCeremony(evt.id, "eventName", e.target.value)}
                              placeholder="e.g. Haldi Ceremony"
                              className="w-full px-2 py-1 rounded-md border border-gray-300 text-xs bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Event Date</label>
                            <input
                              type="date"
                              value={evt.date}
                              onChange={(e) => handleUpdateCeremony(evt.id, "date", e.target.value)}
                              className="w-full px-2 py-1 rounded-md border border-gray-300 text-xs bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-medium text-gray-500 mb-0.5">
                              Day <span className="text-amber-600">(Auto)</span>
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={evt.day || getDayAndYear(evt.date).day || "-"}
                              className="w-full px-2 py-1 rounded-md border border-amber-200 bg-amber-50/50 text-amber-900 font-medium text-xs cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Time</label>
                            <input
                              type="text"
                              value={evt.time}
                              onChange={(e) => handleUpdateCeremony(evt.id, "time", e.target.value)}
                              placeholder="e.g. 10:00 AM onwards"
                              className="w-full px-2 py-1 rounded-md border border-gray-300 text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Venue Name</label>
                            <input
                              type="text"
                              value={evt.venueName}
                              onChange={(e) => handleUpdateCeremony(evt.id, "venueName", e.target.value)}
                              placeholder="e.g. Poolside Lawn"
                              className="w-full px-2 py-1 rounded-md border border-gray-300 text-xs bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Full Address</label>
                            <input
                              type="text"
                              value={evt.venueAddress}
                              onChange={(e) => handleUpdateCeremony(evt.id, "venueAddress", e.target.value)}
                              placeholder="e.g. The Taj Mahal Palace, Mumbai"
                              className="w-full px-2 py-1 rounded-md border border-gray-300 text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Google Maps Link</label>
                            <input
                              type="url"
                              value={evt.mapDirectionsUrl}
                              onChange={(e) => handleUpdateCeremony(evt.id, "mapDirectionsUrl", e.target.value)}
                              placeholder="e.g. https://maps.google.com/..."
                              className="w-full px-2 py-1 rounded-md border border-gray-300 text-xs bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: FAMILY DETAILS (OPTIONAL) */}
            <div className="bg-white rounded-xl border border-amber-200/70 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("family")}
                className="w-full px-4 py-3 bg-gradient-to-r from-amber-50/60 to-rose-50/40 flex items-center justify-between text-left font-display font-semibold text-amber-950 hover:bg-amber-100/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-amber-700" />
                  <span className="text-sm sm:text-base">4. Family Details (Optional)</span>
                </div>
                {openSections.family ? <ChevronUp size={18} className="text-amber-700" /> : <ChevronDown size={18} className="text-amber-700" />}
              </button>

              {openSections.family && (
                <div className="p-4 space-y-3 border-t border-amber-100">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      Bride's Side Family Names
                    </label>
                    <textarea
                      rows={2}
                      value={brideFamily}
                      onChange={(e) => setBrideFamily(e.target.value)}
                      placeholder="e.g. Sharma Family, Dr. Rajiv Sharma, Smt. Meena Sharma &amp; all family members"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      Groom's Side Family Names
                    </label>
                    <textarea
                      rows={2}
                      value={groomFamily}
                      onChange={(e) => setGroomFamily(e.target.value)}
                      placeholder="e.g. Verma Family, Shri Ramesh Verma, Smt. Geeta Verma &amp; all family members"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 5: INVITATION MESSAGE (OPTIONAL) */}
            <div className="bg-white rounded-xl border border-amber-200/70 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("message")}
                className="w-full px-4 py-3 bg-gradient-to-r from-amber-50/60 to-rose-50/40 flex items-center justify-between text-left font-display font-semibold text-amber-950 hover:bg-amber-100/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-amber-700" />
                  <span className="text-sm sm:text-base">5. Invitation Message (Optional)</span>
                </div>
                {openSections.message ? <ChevronUp size={18} className="text-amber-700" /> : <ChevronDown size={18} className="text-amber-700" />}
              </button>

              {openSections.message && (
                <div className="p-4 space-y-2 border-t border-amber-100">
                  <label className="block text-[11px] font-medium text-gray-700">
                    Preferred Invitation Message / Blessings Text
                  </label>
                  <textarea
                    rows={3}
                    value={invitationMessage}
                    onChange={(e) => setInvitationMessage(e.target.value)}
                    placeholder="e.g. Two souls, one heart. With great pleasure and happiness, we cordially invite you and your family to celebrate the auspicious union..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>

            {/* SECTION 6: BACKGROUND MUSIC (OPTIONAL) */}
            <div className="bg-white rounded-xl border border-amber-200/70 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("music")}
                className="w-full px-4 py-3 bg-gradient-to-r from-amber-50/60 to-rose-50/40 flex items-center justify-between text-left font-display font-semibold text-amber-950 hover:bg-amber-100/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Music size={16} className="text-amber-700" />
                  <span className="text-sm sm:text-base">6. Background Music (Optional)</span>
                </div>
                {openSections.music ? <ChevronUp size={18} className="text-amber-700" /> : <ChevronDown size={18} className="text-amber-700" />}
              </button>

              {openSections.music && (
                <div className="p-4 space-y-2 border-t border-amber-100">
                  <label className="block text-[11px] font-medium text-gray-700">
                    YouTube Song / Instrumental Link or Audio Preference
                  </label>
                  <input
                    type="url"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=... or song name"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-gray-500">
                    Provide a YouTube link or specify your favorite romantic/shehnai wedding track.
                  </p>
                </div>
              )}
            </div>

            {/* SECTION 7: SPECIFIC DETAILS & QUICK-INSERT HELPER CHIPS */}
            <div className="bg-white rounded-xl border border-amber-200/70 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("features")}
                className="w-full px-4 py-3 bg-gradient-to-r from-amber-50/60 to-rose-50/40 flex items-center justify-between text-left font-display font-semibold text-amber-950 hover:bg-amber-100/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-700" />
                  <span className="text-sm sm:text-base">7. Specific Details &amp; Feature Requests</span>
                </div>
                {openSections.features ? <ChevronUp size={18} className="text-amber-700" /> : <ChevronDown size={18} className="text-amber-700" />}
              </button>

              {openSections.features && (
                <div className="p-4 space-y-3 border-t border-amber-100">
                  <div className="space-y-1.5">
                    <span className="block text-[11px] font-semibold text-amber-900">
                      Tap quick-insert chips to add common client requests:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {helperChips.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleInsertChip(chip.snippet)}
                          className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 text-[11px] font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      Custom Instructions, Theme, or Extra Sections
                    </label>
                    <textarea
                      rows={4}
                      value={customFeatures}
                      onChange={(e) => setCustomFeatures(e.target.value)}
                      placeholder="Enter dress code, hashtag, live streaming links, countdown preferences, hotel accommodations, or any special requests..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Submit CTA */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-amber-50 to-orange-50/50 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] text-gray-500 text-center sm:text-left">
              Send to WhatsApp: <strong className="text-amber-900">+91 9456411569</strong>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition-colors flex-1 sm:flex-none cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendOnWhatsApp}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 flex-1 sm:flex-none cursor-pointer"
              >
                {/* WhatsApp Logo SVG */}
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.632.073-1.012-.047-.238-.076-.549-.176-.94-.343-1.657-.714-2.73-2.39-2.812-2.502-.082-.112-.669-.893-.669-1.703 0-.811.424-1.21.574-1.374.151-.164.33-.206.44-.206.11 0 .221.002.318.006.102.005.239-.039.373.284.144.35.494 1.206.538 1.294.044.088.073.191.015.306-.059.115-.088.187-.175.289-.088.102-.185.228-.264.306-.089.088-.182.184-.078.362.103.179.46 1.139 1.487 1.637.284.137.525.222.705.279.285.09.544.077.749.047.228-.034.704-.288.803-.566.099-.279.099-.517.07-.566-.029-.049-.108-.078-.228-.138z"/>
                  <path d="M12 2C6.486 2 2 6.486 2 12c0 1.846.505 3.578 1.385 5.068L2 22l5.093-1.336C8.544 21.516 10.231 22 12 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm0 18c-1.633 0-3.153-.497-4.423-1.353l-.317-.213-2.695.707.72-2.628-.234-.338C4.168 15.011 3.65 13.545 3.65 12c0-4.604 3.746-8.35 8.35-8.35 4.604 0 8.35 3.746 8.35 8.35 0 4.604-3.746 8.35-8.35 8.35z"/>
                </svg>
                Send Details on WhatsApp
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
