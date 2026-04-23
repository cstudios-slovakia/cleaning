import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ user, onLogout }) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('properties');
  const [selectedProperty, setSelectedProperty] = useState(null);

  // State for properties and rooms
  const [properties, setProperties] = useState([
    { id: 1, name: 'Central Apartment', theme: 'emerald' },
    { id: 2, name: 'Sunrise Villa', theme: 'amber' }
  ]);
  const [rooms, setRooms] = useState([
    { id: 1, propertyId: 1, name: 'Room 201 - Master Bedroom', status: 'overdue', deadline: '10:00' },
    { id: 2, propertyId: 2, name: 'Room 105 - Bathroom', status: 'pending', deadline: '14:00' },
    { id: 3, propertyId: 2, name: 'Room 302 - Living Area', status: 'clean', cleanedBy: 'Anna' }
  ]);

  // Form states
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [newPropertyName, setNewPropertyName] = useState('');
  
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleAddProperty = (e) => {
    e.preventDefault();
    if (newPropertyName.trim()) {
      const newProp = {
        id: Date.now(),
        name: newPropertyName,
        theme: properties.length % 2 === 0 ? 'emerald' : 'amber'
      };
      setProperties([...properties, newProp]);
      setNewPropertyName('');
      setShowAddProperty(false);
    }
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    if (newRoomName.trim() && selectedProperty) {
      const newRoom = {
        id: Date.now(),
        propertyId: selectedProperty.id,
        name: newRoomName,
        status: 'pending',
        deadline: '12:00'
      };
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
      setShowAddRoom(false);
    }
  };

  const getRoomsForProperty = (propId) => rooms.filter(r => r.propertyId === propId);

  const renderPropertySelection = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('dashboard.properties')}</h2>
        {user.role !== 'cleaner' && (
          <button 
            onClick={() => setShowAddProperty(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm touch-manipulation"
          >
            + Add
          </button>
        )}
      </div>

      {showAddProperty && (
        <form onSubmit={handleAddProperty} className="glass-panel p-4 rounded-xl mb-4 flex gap-2">
          <input 
            type="text" 
            value={newPropertyName}
            onChange={(e) => setNewPropertyName(e.target.value)}
            placeholder="Property Name..."
            className="flex-1 glass-input px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500/50 outline-none"
            autoFocus
          />
          <button type="submit" className="glass-button px-4 rounded-lg font-bold">Save</button>
          <button type="button" onClick={() => setShowAddProperty(false)} className="text-gray-500 px-2">Cancel</button>
        </form>
      )}

      {properties.map(prop => {
        const propRooms = getRoomsForProperty(prop.id);
        const pendingCount = propRooms.filter(r => r.status !== 'clean').length;
        
        return (
          <div 
            key={prop.id}
            onClick={() => setSelectedProperty(prop)}
            className={`glass-panel p-6 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-${prop.theme}-500 transition-colors touch-manipulation`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${prop.theme}-500/10 rounded-full blur-2xl -mr-10 -mt-10`}></div>
            <h3 className="font-bold text-xl">{prop.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {propRooms.length} {t('dashboard.rooms')} • {pendingCount === 0 ? t('dashboard.all_clean') : `${pendingCount} ${t('dashboard.need_cleaning')}`}
            </p>
          </div>
        );
      })}
      
      {properties.length === 0 && (
        <p className="text-gray-500 text-center py-8">No properties found. Add one to get started.</p>
      )}
    </div>
  );

  const renderPropertyOverview = () => {
    const propRooms = getRoomsForProperty(selectedProperty.id);

    return (
      <div className="space-y-4">
        <button 
          onClick={() => setSelectedProperty(null)}
          className="text-sm text-gray-500 mb-2 flex items-center hover:text-gray-800 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Properties
        </button>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{selectedProperty.name}</h2>
          {user.role !== 'cleaner' && (
            <button 
              onClick={() => setShowAddRoom(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm touch-manipulation"
            >
              + Add Room
            </button>
          )}
        </div>

        {showAddRoom && (
          <form onSubmit={handleAddRoom} className="glass-panel p-4 rounded-xl mb-4 flex gap-2">
            <input 
              type="text" 
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Room Name (e.g. 101 - Bedroom)"
              className="flex-1 glass-input px-3 py-2 rounded-lg focus:ring-2 focus:ring-amber-500/50 outline-none"
              autoFocus
            />
            <button type="submit" className="glass-button-gold px-4 rounded-lg font-bold text-gray-900">Save</button>
            <button type="button" onClick={() => setShowAddRoom(false)} className="text-gray-500 px-2">Cancel</button>
          </form>
        )}
        
        {/* Rooms List for this specific property */}
        {propRooms.map(room => (
          <div key={room.id} className={`glass-panel border-l-4 ${room.status === 'overdue' ? 'border-l-red-500 bg-red-500/5' : room.status === 'pending' ? 'border-l-orange-500 bg-orange-500/5' : 'border-l-emerald-500 opacity-70'} p-5 rounded-xl flex justify-between items-center touch-manipulation mb-3`}>
            <div>
              <h3 className={`font-bold text-lg ${room.status === 'clean' ? 'text-gray-600 dark:text-gray-300' : ''}`}>{room.name}</h3>
              {room.status === 'overdue' && <p className="text-sm text-red-600 dark:text-red-400 font-semibold mt-1">{t('dashboard.overdue', { time: room.deadline })}</p>}
              {room.status === 'pending' && <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold mt-1">{t('dashboard.pending', { time: room.deadline })}</p>}
              {room.status === 'clean' && <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">{t('dashboard.cleaned_today', { name: room.cleanedBy || 'System' })}</p>}
            </div>
            
            {room.status !== 'clean' ? (
              <button className={`${room.status === 'overdue' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'} text-white p-3 rounded-xl shadow-lg touch-manipulation`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </button>
            ) : (
              <div className="text-emerald-500 pr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}

        {propRooms.length === 0 && (
          <p className="text-gray-500 text-center py-6">No rooms found in this property.</p>
        )}
        
        <div className="flex gap-2 mt-6">
          <button className="flex-1 glass-button py-3 rounded-xl shadow-sm text-sm font-bold flex justify-center items-center">
            Express Clean
          </button>
          {user.role !== 'cleaner' && (
            <button className="flex-1 glass-button-gold py-3 rounded-xl shadow-sm text-sm font-bold flex justify-center items-center text-gray-900">
              View Cleaners
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderUnifiedRooms = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Unified Rooms View</h2>
      {rooms.map(room => {
        const prop = properties.find(p => p.id === room.propertyId);
        if (!prop) return null;
        
        return (
          <div key={room.id} className={`glass-panel border-l-4 ${room.status === 'overdue' ? 'border-l-red-500 bg-red-500/5' : room.status === 'pending' ? 'border-l-orange-500 bg-orange-500/5' : 'border-l-emerald-500 opacity-70'} p-5 rounded-xl flex justify-between items-center touch-manipulation mb-3`}>
            <div>
              <p className="text-xs text-gray-500 mb-1">{prop.name}</p>
              <h3 className={`font-bold text-lg ${room.status === 'clean' ? 'text-gray-600 dark:text-gray-300' : ''}`}>{room.name}</h3>
              {room.status === 'overdue' && <p className="text-sm text-red-600 dark:text-red-400 font-semibold mt-1">{t('dashboard.overdue', { time: room.deadline })}</p>}
              {room.status === 'pending' && <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold mt-1">{t('dashboard.pending', { time: room.deadline })}</p>}
              {room.status === 'clean' && <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">{t('dashboard.cleaned_today', { name: room.cleanedBy || 'System' })}</p>}
            </div>
            
            {room.status !== 'clean' ? (
              <button className={`${room.status === 'overdue' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'} text-white p-3 rounded-xl shadow-lg touch-manipulation`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </button>
            ) : (
              <div className="text-emerald-500 pr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
      
      {rooms.length === 0 && (
        <p className="text-gray-500 text-center py-6">No rooms to display.</p>
      )}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212]">
      {/* Top Header */}
      <header className="glass-panel sticky top-0 z-40 rounded-none border-x-0 border-t-0 shadow-sm px-4 py-3 flex justify-between items-center bg-white/80 dark:bg-[#1a1a1a]/80 min-h-[64px]">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${selectedProperty?.theme === 'amber' ? 'bg-gradient-to-tr from-amber-400 to-amber-600' : 'bg-gradient-to-tr from-emerald-400 to-emerald-600'} rounded-xl shadow-lg flex items-center justify-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Emerald Cleaning</h1>
            <p className="text-xs text-gray-500 font-medium">{t('dashboard.hello', { name: user.name })} ({user.role})</p>
          </div>
        </div>
        <button onClick={onLogout} className="p-3 -mr-2 text-gray-500 hover:text-red-500 transition-colors touch-manipulation">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {activeTab === 'properties' && (selectedProperty ? renderPropertyOverview() : renderPropertySelection())}
        {activeTab === 'rooms' && renderUnifiedRooms()}
        
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">{t('dashboard.settings')}</h2>
            <div className="glass-panel p-2 rounded-xl space-y-1">
              <div className="w-full flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 min-h-[60px]">
                <span className="font-medium">{t('dashboard.language')}</span>
                <select 
                  onChange={changeLanguage} 
                  value={i18n.language} 
                  className="bg-transparent text-right outline-none text-emerald-600 dark:text-emerald-400 font-medium min-h-[44px] px-2"
                >
                  <option value="en">English</option>
                  <option value="hu">Magyar</option>
                  <option value="sk">Slovenčina</option>
                  <option value="de">Deutsch</option>
                  <option value="uk">Українська</option>
                </select>
              </div>
              <button className="w-full text-left p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center min-h-[60px] touch-manipulation">
                <span className="font-medium">{t('dashboard.change_pin')}</span>
                <span className="text-gray-400">&gt;</span>
              </button>
              {user.role !== 'cleaner' && (
                <button className="w-full text-left p-4 flex justify-between items-center min-h-[60px] touch-manipulation">
                  <span className="font-medium">{t('dashboard.manage_cleaners')}</span>
                  <span className="text-gray-400">&gt;</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="glass-panel fixed bottom-0 w-full rounded-none border-x-0 border-b-0 pb-safe pt-2 px-6 flex justify-between items-center bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-xl h-[80px]">
        <button 
          onClick={() => { setActiveTab('properties'); setSelectedProperty(null); }} 
          className={`flex flex-col items-center p-3 transition-colors touch-manipulation w-20 ${activeTab === 'properties' ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-1" fill={activeTab === 'properties' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-[11px] font-medium">{t('dashboard.properties')}</span>
        </button>
        <button 
          onClick={() => setActiveTab('rooms')} 
          className={`flex flex-col items-center p-3 transition-colors touch-manipulation w-20 ${activeTab === 'rooms' ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          <div className={`${activeTab === 'rooms' ? 'bg-emerald-500 text-white rounded-full p-3 -mt-8 shadow-lg shadow-emerald-500/40 border-4 border-white dark:border-[#1a1a1a]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill={activeTab === 'rooms' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className={`text-[11px] font-medium ${activeTab === 'rooms' ? 'mt-1' : ''}`}>{t('dashboard.rooms')}</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')} 
          className={`flex flex-col items-center p-3 transition-colors touch-manipulation w-20 ${activeTab === 'settings' ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-1" fill={activeTab === 'settings' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[11px] font-medium">{t('dashboard.settings')}</span>
        </button>
      </nav>
    </div>
  );
}
