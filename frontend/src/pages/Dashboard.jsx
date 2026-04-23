import { useState } from 'react';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('rooms');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212]">
      {/* Top Header */}
      <header className="glass-panel sticky top-0 z-40 rounded-none border-x-0 border-t-0 shadow-sm px-4 py-3 flex justify-between items-center bg-white/80 dark:bg-[#1a1a1a]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Emerald</h1>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Hello, {user.name}</p>
          </div>
        </div>
        <button onClick={onLogout} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {activeTab === 'properties' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Your Properties</h2>
            {/* Mock Property Card */}
            <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-emerald-500 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h3 className="font-bold text-lg">Central Apartment</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">4 Rooms • 2 need cleaning</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-amber-500 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h3 className="font-bold text-lg">Sunrise Villa</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">6 Rooms • All Clean</p>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Rooms to Clean</h2>
            {/* Red / Overdue */}
            <div className="glass-panel border-l-4 border-l-red-500 p-4 rounded-xl flex justify-between items-center bg-red-500/5 dark:bg-red-500/10">
              <div>
                <h3 className="font-bold">Room 201 - Master Bedroom</h3>
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1">Overdue (Deadline: 10:00 AM)</p>
              </div>
              <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg shadow-red-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {/* Orange / Needs Cleaning */}
            <div className="glass-panel border-l-4 border-l-orange-500 p-4 rounded-xl flex justify-between items-center bg-orange-500/5 dark:bg-orange-500/10">
              <div>
                <h3 className="font-bold">Room 105 - Bathroom</h3>
                <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-1">Pending (Deadline: 14:00 PM)</p>
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg shadow-lg shadow-orange-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {/* Green / Cleaned */}
            <div className="glass-panel border-l-4 border-l-emerald-500 p-4 rounded-xl flex justify-between items-center opacity-70">
              <div>
                <h3 className="font-bold text-gray-600 dark:text-gray-300">Room 302 - Living Area</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Cleaned today by Anna</p>
              </div>
              <div className="text-emerald-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="glass-panel p-4 rounded-xl space-y-4">
              <button className="w-full text-left py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span>Language</span>
                <span className="text-gray-500">English &gt;</span>
              </button>
              <button className="w-full text-left py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span>Change PIN/Password</span>
                <span className="text-gray-500">&gt;</span>
              </button>
              {user.role !== 'cleaner' && (
                <button className="w-full text-left py-2 flex justify-between items-center">
                  <span>Manage Cleaners</span>
                  <span className="text-gray-500">&gt;</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="glass-panel fixed bottom-0 w-full rounded-none border-x-0 border-b-0 pb-safe pt-2 px-6 flex justify-between items-center bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-xl">
        <button 
          onClick={() => setActiveTab('properties')} 
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'properties' ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill={activeTab === 'properties' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-[10px] font-medium">Properties</span>
        </button>
        <button 
          onClick={() => setActiveTab('rooms')} 
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'rooms' ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          <div className={`${activeTab === 'rooms' ? 'bg-emerald-500 text-white rounded-full p-2 -mt-6 shadow-lg shadow-emerald-500/40 border-4 border-white dark:border-[#1a1a1a]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill={activeTab === 'rooms' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className={`text-[10px] font-medium ${activeTab === 'rooms' ? 'mt-1' : ''}`}>Rooms</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')} 
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'settings' ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill={activeTab === 'settings' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </nav>
    </div>
  );
}
