import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      
      {/* 1. Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      </div>

      {/* 2. Main Hero Content */}
      <div className="relative z-10 p-8 md:p-12 max-w-3xl text-center mx-4 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl">
        
        {/* Badge */}
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold tracking-wide uppercase">
          Powered by AI
        </div>

        {/* Title (Emoji Removed) */}
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-lg">
         Itinera
        </h1>
        
        <p className="text-lg md:text-xl text-gray-200 mt-6 leading-relaxed max-w-lg mx-auto">
          Experience the future of travel. Let  AI craft your perfect itinerary based on your budget, style, and hidden passions.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/plan"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5"
          >
            Start Planning
            <svg className="w-5 h-5 ml-2 -mr-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3.5 text-base font-medium text-white transition-all duration-200 bg-transparent border border-white/30 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* 3. The "Learn More" Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-4xl bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-2">How TripWise Works</h2>
              <p className="text-gray-400 mb-8">Comprehensive planning tools at your fingertips.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors">
                  <div className="w-12 h-12 mb-4 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">1. Smart Inputs</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Simply enter your basic details: destination, dates, and budget. Our AI analyzes millions of data points to match your style.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/50 transition-colors">
                  <div className="w-12 h-12 mb-4 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">2. Visual Map View</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Don't just read a list. View your entire itinerary on an interactive map to understand distances and route logistics instantly.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors">
                  <div className="w-12 h-12 mb-4 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">3. Add & Customize</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Found a cool spot? Add new places to your trip manually. The plan adapts to your discoveries in real-time.
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                 <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white underline underline-offset-4 text-sm"
                >
                  Close details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}