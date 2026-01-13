import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link for navigation
import api from "../api/api";

const INTERESTS = [
  "Food ", // Added subtle text emojis for visual cue (optional)
  "Adventure ",
  "Temples ",
  "Nature ",
  "Shopping ",
  "Beaches ",
  "History ",
];

export default function PlanTrip() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [budget, setBudget] = useState(15000);
  const [tripStyle, setTripStyle] = useState("mid");
  const [interests, setInterests] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleInterest(item) {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  async function handlePlan() {
    setError("");

    if (!destination || !startDate || !endDate) {
      setError("Destination and dates are required.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/trips/plan", {
        destination,
        startDate,
        endDate,
        budget: Number(budget),
        tripStyle,
        interests,
      });

      navigate(`/trip/${res.data.tripId}`);
    } catch (err) {
      const msg =
        err?.code === "ECONNABORTED"
          ? "Request timed out (AI too slow). Please try again."
          : err?.response?.data?.message || "Failed to generate itinerary.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans py-10 px-4">
      
      {/* 1. Background Image (Consistent with Home) */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-[2px]"></div>
      </div>

      {/* 2. Glass Container */}
      <div className="relative z-10 w-full max-w-2xl bg-black/40 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <Link 
            to="/" 
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-xl font-bold text-white tracking-wide">Trip Configuration</h1>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* Destination Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Where to?</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <input
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="e.g., Goa, Paris, Tokyo"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all [color-scheme:dark]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all [color-scheme:dark]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Budget Slider & Trip Style Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Budget */}
             <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">Budget Limit</label>
                <span className="text-sm font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                  ₹{Number(budget).toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="1000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹5k</span>
                <span>₹5L</span>
              </div>
            </div>

            {/* Trip Style */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Travel Style</label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                  value={tripStyle}
                  onChange={(e) => setTripStyle(e.target.value)}
                >
                  <option value="budget" className="bg-gray-900"> Budget Backpacker</option>
                  <option value="mid" className="bg-gray-900"> Balanced / Standard</option>
                  <option value="luxury" className="bg-gray-900"> Luxury / Premium</option>
                </select>
                {/* Custom Chevron Icon */}
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Interests Chips */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">What are you interested in?</label>
            <div className="flex flex-wrap gap-3">
              {INTERESTS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    interests.includes(item)
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] transform scale-105"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center p-4 text-sm text-red-200 bg-red-900/20 border border-red-500/20 rounded-lg">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handlePlan}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-200 flex items-center justify-center space-x-2
              ${loading 
                ? "bg-indigo-600/50 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/25 hover:-translate-y-0.5"
              }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Designing your trip...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                <span>Generate Itinerary</span>
              </>
            )}
          </button>
          
          {loading && (
             <p className="text-center text-xs text-gray-500 mt-2 animate-pulse">
               This might take 5-15 seconds depending on AI traffic.
             </p>
          )}

        </div>
      </div>
    </div>
  );
}