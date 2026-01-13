import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";
import TripMap from "../components/TripMap";

// --- Icons ---
const Icons = {
  Back: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  Calendar: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Wallet: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
};

export default function TripDetails() {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("itinerary");
  const [selectedDay, setSelectedDay] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [addingPlace, setAddingPlace] = useState(false);
  const [placeForm, setPlaceForm] = useState({ name: "", day: 1, category: "custom", lat: "", lng: "" });

  useEffect(() => {
    async function loadTrip() {
      try {
        const res = await api.get(`/api/trips/${tripId}`);
        setTrip(res.data);
      } catch (err) {
        setError("Trip not found.");
      }
    }
    loadTrip();
  }, [tripId]);

  async function refreshTrip() {
    const res = await api.get(`/api/trips/${tripId}`);
    setTrip(res.data);
  }

  const filteredPlaces = useMemo(() => {
    if (!trip?.places) return [];
    if (selectedDay === "all") return trip.places;
    return trip.places.filter((p) => p.day === Number(selectedDay));
  }, [trip?.places, selectedDay]);

  function handleMapClick(latlng) {
    setClickedLatLng(latlng);
    setPlaceForm({
      name: "",
      day: selectedDay === "all" ? 1 : Number(selectedDay),
      category: "custom",
      lat: latlng.lat,
      lng: latlng.lng,
    });
    setShowModal(true);
  }

  function openManualAdd() {
    setClickedLatLng(null);
    setPlaceForm({ name: "", day: selectedDay === "all" ? 1 : Number(selectedDay), category: "custom", lat: "", lng: "" });
    setShowModal(true);
  }

  async function handleAddPlaceSubmit(e) {
    e.preventDefault();
    setAddingPlace(true);
    try {
      await api.post(`/api/trips/${tripId}/add-place`, {
        ...placeForm,
        day: Number(placeForm.day),
        lat: Number(placeForm.lat),
        lng: Number(placeForm.lng),
      });
      setShowModal(false);
      await refreshTrip();
    } catch {
      alert("Failed to add place");
    } finally {
      setAddingPlace(false);
    }
  }

  if (!trip) return <div className="h-screen bg-slate-900 flex items-center justify-center text-slate-400">Loading...</div>;

  return (
    // ROOT LAYOUT: Flex Column. 
    // This allows the Header to be full width at the top, pushing everything else lower.
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* =========================================
          1. GLOBAL HEADER (Full Width)
         ========================================= */}
      <header className="flex-none bg-slate-900 border-b border-slate-800 z-30">
        <div className="max-w-[1920px] mx-auto px-4 md:px-6 py-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left: Title & Meta */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Link to="/plan" className="text-slate-400 hover:text-white transition-colors">
                   <Icons.Back />
                </Link>
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {trip.destination}
                </h1>
                <span className="hidden md:inline-block h-1 w-1 rounded-full bg-slate-600"></span>
                <span className="text-xs md:text-sm text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                   {trip.tripStyle}
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-500 pl-8">
                {trip.startDate} - {trip.endDate} • {trip.itinerary?.days?.length} Days
              </p>
            </div>

            {/* Right: Controls & Tabs */}
            <div className="flex items-center justify-between md:justify-end gap-4">
               {/* Mobile Tabs (Only visible on small screens inside header row) */}
               <div className="flex bg-slate-800/50 p-1 rounded-lg">
                  <button 
                    onClick={() => setActiveTab("itinerary")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'itinerary' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}
                  >
                    Itinerary
                  </button>
                  <button 
                    onClick={() => setActiveTab("overview")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}
                  >
                    Overview
                  </button>
               </div>

               <button
                  onClick={openManualAdd}
                  className="hidden md:flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/20"
                >
                  <Icons.Plus /> <span className="ml-2">Add Place</span>
                </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================
          2. MAIN CONTENT SPLIT (Responsive)
         ========================================= */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1920px] mx-auto w-full">
        
        {/* === LEFT PANEL: ITINERARY (Scrollable) === */}
        <div className="flex-1 overflow-y-auto order-2 lg:order-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent bg-slate-950">
          <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-20">
            
            {activeTab === "itinerary" && (
              trip.itinerary?.days || []).map((day) => (
                <div key={day.day} className="relative pl-6 md:pl-8 border-l border-slate-800">
                  {/* Timeline Dot */}
                  <span className="absolute -left-3 md:-left-4 top-0 flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-slate-900 ring-4 ring-slate-950 border border-indigo-500/50 text-xs font-bold text-indigo-400">
                    {day.day}
                  </span>
                  
                  <div className="mb-6">
                     <h2 className="text-lg md:text-xl font-bold text-white">{day.theme}</h2>
                     <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Day {day.day}</p>
                  </div>

                  <div className="space-y-4">
                     {/* Sections */}
                     {['Morning', 'Afternoon', 'Evening'].map((timeSlot) => (
                        day[timeSlot.toLowerCase()]?.length > 0 && (
                          <div key={timeSlot} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors">
                            <h4 className={`text-xs font-bold uppercase mb-3 ${
                              timeSlot === 'Morning' ? 'text-amber-400' : 
                              timeSlot === 'Afternoon' ? 'text-indigo-400' : 'text-purple-400'
                            }`}>
                              {timeSlot}
                            </h4>
                            <ul className="space-y-2">
                              {day[timeSlot.toLowerCase()].map((item, i) => (
                                <li key={i} className="text-sm text-slate-300 flex items-start leading-relaxed">
                                  <span className="mr-3 text-slate-600 mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-600 flex-shrink-0"></span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                     ))}
                  </div>
                </div>
              ))
            }

            {activeTab === "overview" && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Budget */}
                  <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Icons.Wallet /></div>
                        <h3 className="font-bold text-white">Estimated Cost</h3>
                     </div>
                     <div className="space-y-3">
                        {Object.entries(trip.itinerary?.budgetBreakdown || {}).map(([k,v]) => (
                           <div key={k} className="flex justify-between text-sm pb-2 border-b border-slate-800 last:border-0">
                              <span className="text-slate-400 capitalize">{k}</span>
                              <span className="text-white font-mono">₹{Number(v).toLocaleString()}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Interests */}
                  <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                     <h3 className="font-bold text-white mb-4">Trip Interests</h3>
                     <div className="flex flex-wrap gap-2">
                        {trip.interests.map(i => (
                           <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                              {i}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* === RIGHT PANEL: MAP (Responsive) === */}
        {/* On Mobile: It is Order 1 (Top). On Desktop: It is Order 2 (Right) */}
        {/* We use h-[300px] on mobile to prevent full screen takeover. lg:h-auto fills the flex container */}
        <div className="relative order-1 lg:order-2 w-full lg:w-[45%] h-[35vh] lg:h-auto bg-slate-950 lg:bg-transparent">
           
           {/* Desktop: This wrapper gives the map the 'floating' card look */}
           <div className="w-full h-full lg:p-4"> 
              <div className="relative w-full h-full lg:rounded-2xl overflow-hidden shadow-2xl border-b lg:border border-slate-800 bg-slate-900">
                 
                 {/* Map Overlay Controls */}
                 <div className="absolute top-4 left-4 z-[500]">
                    <select 
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      className="bg-slate-900/90 backdrop-blur text-white text-xs font-medium px-3 py-2 rounded-lg border border-slate-700 shadow-xl outline-none"
                    >
                       <option value="all">View All Days</option>
                       {(trip.itinerary?.days || []).map(d => <option key={d.day} value={d.day}>Day {d.day}</option>)}
                    </select>
                 </div>

                 {/* Mobile Add Button (Floating) */}
                 <button
                    onClick={openManualAdd}
                    className="absolute top-4 right-4 z-[500] md:hidden bg-indigo-600 text-white p-2 rounded-lg shadow-xl"
                  >
                    <Icons.Plus />
                 </button>

                 <div className="w-full h-full">
                    <TripMap
                       places={filteredPlaces}
                       onAddPlace={handleMapClick}
                       selectedDay={selectedDay}
                       showRoute={true}
                    />
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* =========================================
          MODAL
         ========================================= */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                 <h3 className="font-bold text-white text-sm uppercase tracking-wide">Add Location</h3>
                 <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleAddPlaceSubmit} className="p-5 space-y-4">
                 <div>
                    <label className="text-xs text-slate-500 font-bold uppercase">Name</label>
                    <input 
                      className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 outline-none transition-colors"
                      placeholder="e.g. Hidden Cafe"
                      value={placeForm.name}
                      onChange={e => setPlaceForm({...placeForm, name: e.target.value})}
                      autoFocus
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div>
                       <label className="text-xs text-slate-500 font-bold uppercase">Day</label>
                       <input 
                         type="number" min="1" max={trip.itinerary.days.length}
                         className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 outline-none"
                         value={placeForm.day}
                         onChange={e => setPlaceForm({...placeForm, day: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="text-xs text-slate-500 font-bold uppercase">Type</label>
                       <select
                         className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 outline-none"
                         value={placeForm.category}
                         onChange={e => setPlaceForm({...placeForm, category: e.target.value})}
                       >
                          <option value="custom">Custom</option>
                          <option value="food">Food</option>
                          <option value="sightseeing">Visit</option>
                       </select>
                    </div>
                 </div>
                 <button type="submit" disabled={addingPlace} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold transition-all shadow-lg shadow-indigo-500/20">
                    {addingPlace ? "Saving..." : "Add to Itinerary"}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}