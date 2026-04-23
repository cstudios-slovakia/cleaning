import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ user, onLogout }) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('properties');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // State for properties and rooms
  const [systemUsers] = useState([
    { id: 1, name: 'Anna', role: 'cleaner' },
    { id: 2, name: 'John', role: 'cleaner' },
    { id: 3, name: 'Sarah', role: 'manager' },
    { id: 4, name: 'Erik', role: 'manager' }
  ]);

  const [properties, setProperties] = useState([
    { id: 1, name: 'Central Apartment', theme: 'emerald', secondaryTheme: 'teal', managers: [3, 4], cleaners: [1, 2], logo: null, bgImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800' },
    { id: 2, name: 'Sunrise Villa', theme: 'amber', secondaryTheme: 'orange', managers: [4], cleaners: [1], logo: null, bgImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800' }
  ]);
  const [rooms, setRooms] = useState([
    { id: 1, propertyId: 1, name: 'Room 201 - Master Bedroom', status: 'overdue', deadline: '10:00', date: new Date().toISOString().split('T')[0], logs: [], checklist: [{id: 1, text: 'Change sheets', done: false}, {id: 2, text: 'Clean bathroom', done: false}, {id: 3, text: 'Empty trash', done: false}] },
    { id: 2, propertyId: 2, name: 'Room 105 - Bathroom', status: 'pending', deadline: '14:00', date: new Date().toISOString().split('T')[0], logs: [], checklist: [{id: 1, text: 'Scrub toilet', done: false}, {id: 2, text: 'Clean mirror', done: false}, {id: 3, text: 'Mop floor', done: false}] },
    { id: 3, propertyId: 2, name: 'Room 302 - Living Area', status: 'clean', cleanedBy: 'Anna', deadline: '12:00', date: new Date().toISOString().split('T')[0], logs: [{date: new Date().toISOString().split('T')[0], time: '11:45', user: 'Anna'}], checklist: [{id: 1, text: 'Vacuum carpet', done: true}, {id: 2, text: 'Dust shelves', done: true}] }
  ]);

  // Form states
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [newPropertyName, setNewPropertyName] = useState('');
  const [newPropertyTheme, setNewPropertyTheme] = useState('emerald');
  const [newPropertyLogo, setNewPropertyLogo] = useState(null);
  const [newPropertyBg, setNewPropertyBg] = useState(null);
  
  const logoInputRef = useRef(null);
  const bgInputRef = useRef(null);
  
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const [newChecklistText, setNewChecklistText] = useState('');
  
  const [showExpressClean, setShowExpressClean] = useState(false);
  const [expressData, setExpressData] = useState({ roomId: '', date: new Date().toISOString().split('T')[0], time: '12:00' });
  
  const [showEditSchedule, setShowEditSchedule] = useState(false);
  const [scheduleData, setScheduleData] = useState({ date: '', time: '' });

  const [showPropertySettings, setShowPropertySettings] = useState(false);
  const [propSettingsData, setPropSettingsData] = useState(null);

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameInput, setRenameInput] = useState('');

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleAddProperty = (e) => {
    e.preventDefault();
    if (newPropertyName.trim()) {
      const newProp = {
        id: Date.now(),
        name: newPropertyName,
        theme: newPropertyTheme,
        secondaryTheme: newPropertyTheme, // default
        managers: [user.id || 4],
        cleaners: [],
        logo: newPropertyLogo ? URL.createObjectURL(newPropertyLogo) : null,
        bgImage: newPropertyBg ? URL.createObjectURL(newPropertyBg) : null
      };
      setProperties([...properties, newProp]);
      setNewPropertyName('');
      setNewPropertyTheme('emerald');
      setNewPropertyLogo(null);
      setNewPropertyBg(null);
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
        date: new Date().toISOString().split('T')[0],
        deadline: '12:00',
        checklist: [
          {id: 1, text: 'Empty trash', done: false},
          {id: 2, text: 'Dust surfaces', done: false},
          {id: 3, text: 'Vacuum floor', done: false}
        ]
      };
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
      setShowAddRoom(false);
    }
  };

  const handleExpressCleanSubmit = (e) => {
    e.preventDefault();
    if (expressData.roomId) {
      setRooms(rooms.map(r => {
        if (r.id === parseInt(expressData.roomId)) {
          return {
            ...r,
            status: 'pending',
            date: expressData.date,
            deadline: expressData.time,
            cleanedBy: null,
            checklist: r.checklist.map(t => ({...t, done: false})) // reset checklist
          };
        }
        return r;
      }));
      setShowExpressClean(false);
      setExpressData({ roomId: '', date: new Date().toISOString().split('T')[0], time: '12:00' });
    }
  };

  const handleUpdateSchedule = (e) => {
    e.preventDefault();
    if (scheduleData.roomId) {
      // Global schedule edit from clicking label
      const updatedRooms = rooms.map(r => {
        if (r.id === scheduleData.roomId) {
          return { ...r, date: scheduleData.date, deadline: scheduleData.time, status: 'pending', cleanedBy: null, checklist: r.checklist.map(t => ({...t, done: false})) };
        }
        return r;
      });
      setRooms(updatedRooms);
      if (selectedRoom && selectedRoom.id === scheduleData.roomId) setSelectedRoom(updatedRooms.find(r => r.id === scheduleData.roomId));
      setShowEditSchedule(false);
    } else if (selectedRoom) {
      // Inline schedule edit from room view
      const updatedRooms = rooms.map(r => {
        if (r.id === selectedRoom.id) {
          return { ...r, date: scheduleData.date, deadline: scheduleData.time, status: 'pending', cleanedBy: null, checklist: r.checklist.map(t => ({...t, done: false})) };
        }
        return r;
      });
      setRooms(updatedRooms);
      setSelectedRoom(updatedRooms.find(r => r.id === selectedRoom.id));
      setShowEditSchedule(false);
    }
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (renameInput.trim() && selectedRoom) {
      const updatedRooms = rooms.map(r => r.id === selectedRoom.id ? { ...r, name: renameInput } : r);
      setRooms(updatedRooms);
      setSelectedRoom({ ...selectedRoom, name: renameInput });
      setIsRenaming(false);
    }
  };

  const handleImmediateExpressClean = () => {
    if (selectedRoom) {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const updatedRooms = rooms.map(r => {
        if (r.id === selectedRoom.id) {
          return {
            ...r,
            status: 'overdue', // Flag it immediately
            date: now.toISOString().split('T')[0],
            deadline: timeStr,
            cleanedBy: null,
            checklist: r.checklist.map(t => ({...t, done: false}))
          };
        }
        return r;
      });
      setRooms(updatedRooms);
      setSelectedRoom(updatedRooms.find(r => r.id === selectedRoom.id));
    }
  };

  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (newChecklistText.trim() && selectedRoom) {
      const updatedRooms = rooms.map(r => {
        if (r.id === selectedRoom.id) {
          const newChecklistItem = { id: Date.now(), text: newChecklistText, done: false };
          return { ...r, checklist: [...r.checklist, newChecklistItem] };
        }
        return r;
      });
      setRooms(updatedRooms);
      setSelectedRoom(updatedRooms.find(r => r.id === selectedRoom.id));
      setNewChecklistText('');
      setShowAddChecklist(false);
    }
  };

  const toggleChecklist = (roomId, taskId) => {
    const updatedRooms = rooms.map(r => {
      if (r.id === roomId) {
        const newChecklist = r.checklist.map(task => 
          task.id === taskId ? { ...task, done: !task.done } : task
        );
        // Automatically mark room clean if all tasks are done
        const allDone = newChecklist.length > 0 && newChecklist.every(t => t.done);
        let logs = r.logs || [];
        if (allDone && r.status !== 'clean') {
          const now = new Date();
          logs = [{ date: now.toISOString().split('T')[0], time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`, user: user.name }, ...logs];
        }
        return { 
          ...r, 
          logs,
          checklist: newChecklist,
          status: allDone ? 'clean' : (r.status === 'clean' ? 'pending' : r.status),
          cleanedBy: allDone ? user.name : null
        };
      }
      return r;
    });
    setRooms(updatedRooms);
    if (selectedRoom && selectedRoom.id === roomId) {
      setSelectedRoom(updatedRooms.find(r => r.id === roomId));
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
        <form onSubmit={handleAddProperty} className="glass-panel p-5 rounded-2xl mb-6 space-y-4 shadow-lg shadow-black/5 dark:shadow-black/20 border border-emerald-500/20">
          <h3 className="font-bold text-lg mb-2">Create New Property</h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Property Name</label>
            <input 
              type="text" 
              value={newPropertyName}
              onChange={(e) => setNewPropertyName(e.target.value)}
              placeholder="e.g. Grand Hotel"
              className="w-full glass-input px-3 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none font-medium"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Theme Color</label>
            <select 
              value={newPropertyTheme}
              onChange={(e) => setNewPropertyTheme(e.target.value)}
              className="w-full glass-input px-3 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none font-medium appearance-none"
            >
              <option value="emerald">Emerald Green</option>
              <option value="amber">Amber Gold</option>
              <option value="blue">Ocean Blue</option>
              <option value="purple">Royal Purple</option>
              <option value="rose">Rose Red</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Logo</label>
              <button 
                type="button"
                onClick={() => logoInputRef.current.click()}
                className="w-full glass-input px-3 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center justify-center border-dashed border-2 hover:border-emerald-500 transition-colors"
              >
                {newPropertyLogo ? '✓ Selected' : '+ Upload Logo'}
              </button>
              <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={(e) => setNewPropertyLogo(e.target.files[0])} />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Background Image</label>
              <button 
                type="button"
                onClick={() => bgInputRef.current.click()}
                className="w-full glass-input px-3 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center justify-center border-dashed border-2 hover:border-emerald-500 transition-colors"
              >
                {newPropertyBg ? '✓ Selected' : '+ Upload Image'}
              </button>
              <input type="file" accept="image/*" className="hidden" ref={bgInputRef} onChange={(e) => setNewPropertyBg(e.target.files[0])} />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 glass-button py-3 rounded-xl font-bold">Save Property</button>
            <button type="button" onClick={() => setShowAddProperty(false)} className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold">Cancel</button>
          </div>
        </form>
      )}

      {properties.map(prop => {
        const propRooms = getRoomsForProperty(prop.id);
        const pendingCount = propRooms.filter(r => r.status !== 'clean').length;
        
        return (
          <div 
            key={prop.id}
            onClick={() => setSelectedProperty(prop)}
            className={`glass-panel rounded-2xl relative overflow-hidden group cursor-pointer hover:border-${prop.theme}-500 transition-all touch-manipulation min-h-[140px] flex flex-col justify-end shadow-md mb-4`}
          >
            {/* Background Image Layer */}
            {prop.bgImage && (
              <div 
                className="absolute inset-0 bg-cover bg-center z-0 opacity-40 group-hover:opacity-50 transition-opacity"
                style={{ backgroundImage: `url(${prop.bgImage})` }}
              ></div>
            )}
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10`}></div>
            
            <div className="relative z-20 p-5 w-full flex items-end justify-between">
              <div>
                <h3 className="font-bold text-2xl text-white drop-shadow-md">{prop.name}</h3>
                <p className={`text-sm text-${prop.theme}-300 font-medium drop-shadow mt-1`}>
                  {propRooms.length} {t('dashboard.rooms')} • {pendingCount === 0 ? t('dashboard.all_clean') : `${pendingCount} ${t('dashboard.need_cleaning')}`}
                </p>
              </div>
              {prop.logo && (
                <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border-2 border-white/50 flex-shrink-0">
                  <img src={prop.logo} alt="logo" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
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
          className="text-sm text-gray-500 mb-2 flex items-center hover:text-gray-800 dark:hover:text-gray-200 p-2 -ml-2 touch-manipulation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Properties
        </button>
        
        {/* Dynamic Property Header */}
        <div className={`relative w-full rounded-3xl overflow-hidden mb-6 shadow-xl shadow-${selectedProperty.theme}-500/10 border border-${selectedProperty.theme}-500/20`}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
          {selectedProperty.bgImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center z-0 opacity-60"
              style={{ backgroundImage: `url(${selectedProperty.bgImage})` }}
            ></div>
          )}
          <div className="relative z-20 p-6 flex items-center justify-between gap-4 min-h-[120px]">
            <div className="flex items-center gap-4">
              {selectedProperty.logo ? (
                <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border-2 border-white/50 flex-shrink-0 flex items-center justify-center p-1">
                  <img src={selectedProperty.logo} alt="logo" className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className={`w-16 h-16 bg-gradient-to-br from-${selectedProperty.theme}-400 to-${selectedProperty.theme}-600 rounded-2xl shadow-lg flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold`}>
                  {selectedProperty.name.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-black text-white drop-shadow-md leading-tight">{selectedProperty.name}</h2>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full bg-${selectedProperty.theme}-500/30 border border-${selectedProperty.theme}-500/50 text-${selectedProperty.theme}-100 text-xs font-bold backdrop-blur-md`}>
                  Active Dashboard
                </span>
              </div>
            </div>
            
            {user.role !== 'cleaner' && (
              <button 
                onClick={() => {
                  setPropSettingsData({...selectedProperty});
                  setShowPropertySettings(true);
                }}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-xl text-white transition-colors border border-white/30 shadow-lg touch-manipulation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Property Settings Modal */}
        {showPropertySettings && propSettingsData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm touch-manipulation overflow-y-auto pt-20 pb-20">
            <div className="glass-panel w-full max-w-md p-6 rounded-3xl shadow-2xl relative my-auto">
              <button 
                type="button" 
                onClick={() => setShowPropertySettings(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-xl font-bold mb-4">Property Settings</h2>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Property Name</label>
                  <input 
                    type="text" 
                    value={propSettingsData.name}
                    onChange={(e) => setPropSettingsData({...propSettingsData, name: e.target.value})}
                    className="w-full glass-input px-3 py-3 rounded-xl focus:ring-2 outline-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Primary Color</label>
                    <select 
                      value={propSettingsData.theme}
                      onChange={(e) => setPropSettingsData({...propSettingsData, theme: e.target.value})}
                      className="w-full glass-input px-3 py-3 rounded-xl outline-none font-medium appearance-none"
                    >
                      <option value="emerald">Emerald</option>
                      <option value="amber">Amber</option>
                      <option value="blue">Blue</option>
                      <option value="purple">Purple</option>
                      <option value="rose">Rose</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Secondary Color</label>
                    <select 
                      value={propSettingsData.secondaryTheme}
                      onChange={(e) => setPropSettingsData({...propSettingsData, secondaryTheme: e.target.value})}
                      className="w-full glass-input px-3 py-3 rounded-xl outline-none font-medium appearance-none"
                    >
                      <option value="emerald">Emerald</option>
                      <option value="amber">Amber</option>
                      <option value="blue">Blue</option>
                      <option value="purple">Purple</option>
                      <option value="rose">Rose</option>
                      <option value="teal">Teal</option>
                      <option value="orange">Orange</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Managers</label>
                  <div className="flex flex-wrap gap-2">
                    {systemUsers.filter(u => u.role === 'manager').map(u => (
                      <button 
                        key={u.id}
                        type="button"
                        onClick={() => {
                          const managers = propSettingsData.managers.includes(u.id) 
                            ? propSettingsData.managers.filter(id => id !== u.id)
                            : [...propSettingsData.managers, u.id];
                          setPropSettingsData({...propSettingsData, managers});
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${propSettingsData.managers.includes(u.id) ? 'bg-amber-500 text-white border-amber-500' : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}
                      >
                        {u.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Cleaners</label>
                  <div className="flex flex-wrap gap-2">
                    {systemUsers.filter(u => u.role === 'cleaner').map(u => (
                      <button 
                        key={u.id}
                        type="button"
                        onClick={() => {
                          const cleaners = propSettingsData.cleaners.includes(u.id) 
                            ? propSettingsData.cleaners.filter(id => id !== u.id)
                            : [...propSettingsData.cleaners, u.id];
                          setPropSettingsData({...propSettingsData, cleaners});
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${propSettingsData.cleaners.includes(u.id) ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}
                      >
                        {u.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Logo</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          setPropSettingsData({...propSettingsData, logo: URL.createObjectURL(e.target.files[0])});
                        }
                      }}
                      className="absolute inset-0 top-6 w-full h-[48px] opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full h-[48px] glass-input rounded-xl text-sm font-medium flex items-center justify-center border-dashed border-2">
                      Upload Logo
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Background</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          setPropSettingsData({...propSettingsData, bgImage: URL.createObjectURL(e.target.files[0])});
                        }
                      }}
                      className="absolute inset-0 top-6 w-full h-[48px] opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full h-[48px] glass-input rounded-xl text-sm font-medium flex items-center justify-center border-dashed border-2">
                      Upload Bg
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setProperties(properties.map(p => p.id === propSettingsData.id ? propSettingsData : p));
                      setSelectedProperty(propSettingsData);
                      setShowPropertySettings(false);
                    }}
                    className="flex-1 glass-button py-3 rounded-xl font-bold"
                  >
                    Save Changes
                  </button>
                </div>
                
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
                        setProperties(properties.filter(p => p.id !== propSettingsData.id));
                        setRooms(rooms.filter(r => r.propertyId !== propSettingsData.id));
                        setShowPropertySettings(false);
                        setSelectedProperty(null);
                      }
                    }}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 py-3 rounded-xl font-bold transition-colors"
                  >
                    Delete Property
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Rooms</h3>
          {user.role !== 'cleaner' && (
            <button 
              onClick={() => setShowAddRoom(true)}
              className={`bg-${selectedProperty.theme}-500 hover:bg-${selectedProperty.theme}-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm touch-manipulation`}
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
              placeholder="Room Name"
              className="flex-1 glass-input px-3 py-2 rounded-lg focus:ring-2 focus:ring-amber-500/50 outline-none"
              autoFocus
            />
            <button type="submit" className="glass-button-gold px-4 rounded-lg font-bold text-gray-900">Save</button>
            <button type="button" onClick={() => setShowAddRoom(false)} className="text-gray-500 px-2">Cancel</button>
          </form>
        )}

        {/* Express Clean Modal */}
        {showExpressClean && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm touch-manipulation">
            <form onSubmit={handleExpressCleanSubmit} className="glass-panel w-full max-w-sm p-6 rounded-3xl shadow-2xl relative">
              <button 
                type="button" 
                onClick={() => setShowExpressClean(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-xl font-bold mb-4">Express Clean</h2>
              <p className="text-sm text-gray-500 mb-4">Schedule a quick cleaning for a room.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Select Room</label>
                  <select 
                    value={expressData.roomId}
                    onChange={e => setExpressData({...expressData, roomId: e.target.value})}
                    className="w-full glass-input px-3 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none font-medium appearance-none"
                    required
                  >
                    <option value="" disabled>Choose a room...</option>
                    {propRooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input 
                      type="date"
                      value={expressData.date}
                      onChange={e => setExpressData({...expressData, date: e.target.value})}
                      className="w-full glass-input px-3 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Time</label>
                    <input 
                      type="time"
                      value={expressData.time}
                      onChange={e => setExpressData({...expressData, time: e.target.value})}
                      className="w-full glass-input px-3 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none font-medium"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="w-full glass-button py-3 mt-2 rounded-xl font-bold shadow-lg">Schedule Cleaning</button>
              </div>
            </form>
          </div>
        )}
        
        {/* Rooms List */}
        {propRooms.map(room => (
          <div 
            key={room.id} 
            onClick={() => setSelectedRoom(room)}
            className={`glass-panel border-l-4 ${room.status === 'overdue' ? 'border-l-red-500 bg-red-500/5' : room.status === 'pending' ? 'border-l-orange-500 bg-orange-500/5' : 'border-l-emerald-500 opacity-70'} p-5 rounded-xl flex justify-between items-center touch-manipulation cursor-pointer mb-3 hover:shadow-md transition-shadow`}
          >
            <div className="w-full pr-4">
              <h3 className={`font-bold text-lg ${room.status === 'clean' ? 'text-gray-600 dark:text-gray-300' : ''}`}>{room.name}</h3>
              
              <div className="flex justify-between items-center mt-1">
                <span className={`text-sm font-semibold ${
                  room.status === 'overdue' ? 'text-red-600 dark:text-red-400' : 
                  room.status === 'pending' ? 'text-orange-600 dark:text-orange-400' : 
                  'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {room.status === 'overdue' ? 'Overdue!' : room.status === 'pending' ? 'Pending' : `Cleaned by ${room.cleanedBy || 'System'}`}
                </span>
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (user.role !== 'cleaner') {
                      setScheduleData({ roomId: room.id, date: room.date || new Date().toISOString().split('T')[0], time: room.deadline || '12:00' });
                      setShowEditSchedule(true);
                    }
                  }}
                  className={`text-xs font-bold px-2 py-1 rounded-md transition-colors ${user.role !== 'cleaner' ? 'cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50 bg-white/50 dark:bg-black/30 text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-black/30'}`}
                >
                  Next: {room.date} {room.deadline}
                </span>
              </div>
              
              <div className="flex gap-1 mt-3">
                {room.checklist.map((task, i) => (
                  <div key={i} className={`h-1.5 w-6 rounded-full ${task.done ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                ))}
              </div>
            </div>
            
            <div className="text-gray-400 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}

        {propRooms.length === 0 && (
          <p className="text-gray-500 text-center py-6">No rooms found in this property.</p>
        )}
        
        <div className="flex gap-2 mt-6">
          <button 
            onClick={() => setShowExpressClean(true)}
            className="flex-1 glass-button py-3 rounded-xl shadow-sm text-sm font-bold flex justify-center items-center touch-manipulation"
          >
            Express Clean
          </button>
          {user.role !== 'cleaner' && (
            <button className="flex-1 glass-button-gold py-3 rounded-xl shadow-sm text-sm font-bold flex justify-center items-center text-gray-900 touch-manipulation">
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
          <div 
            key={room.id} 
            onClick={() => setSelectedRoom(room)}
            className={`glass-panel border-l-4 ${room.status === 'overdue' ? 'border-l-red-500 bg-red-500/5' : room.status === 'pending' ? 'border-l-orange-500 bg-orange-500/5' : 'border-l-emerald-500 opacity-70'} p-5 rounded-xl flex justify-between items-center touch-manipulation cursor-pointer mb-3 hover:shadow-md transition-shadow`}
          >
            <div className="w-full pr-4">
              <p className="text-xs text-gray-500 mb-1">{prop.name}</p>
              <h3 className={`font-bold text-lg ${room.status === 'clean' ? 'text-gray-600 dark:text-gray-300' : ''}`}>{room.name}</h3>
              
              <div className="flex justify-between items-center mt-1">
                <span className={`text-sm font-semibold ${
                  room.status === 'overdue' ? 'text-red-600 dark:text-red-400' : 
                  room.status === 'pending' ? 'text-orange-600 dark:text-orange-400' : 
                  'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {room.status === 'overdue' ? 'Overdue!' : room.status === 'pending' ? 'Pending' : `Cleaned by ${room.cleanedBy || 'System'}`}
                </span>
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (user.role !== 'cleaner') {
                      setScheduleData({ roomId: room.id, date: room.date || new Date().toISOString().split('T')[0], time: room.deadline || '12:00' });
                      setShowEditSchedule(true);
                    }
                  }}
                  className={`text-xs font-bold px-2 py-1 rounded-md transition-colors ${user.role !== 'cleaner' ? 'cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50 bg-white/50 dark:bg-black/30 text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-black/30'}`}
                >
                  Next: {room.date} {room.deadline}
                </span>
              </div>
            </div>
            
            <div className="text-gray-400 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        );
      })}
      
      {rooms.length === 0 && (
        <p className="text-gray-500 text-center py-6">No rooms to display.</p>
      )}
    </div>
  );

  const handleCloneRoom = () => {
    if (selectedRoom) {
      const clonedRoom = {
        ...selectedRoom,
        id: Date.now(),
        name: `${selectedRoom.name} - Copy`,
        status: 'pending',
        cleanedBy: null,
        checklist: selectedRoom.checklist.map(t => ({...t, done: false}))
      };
      setRooms([...rooms, clonedRoom]);
      setSelectedRoom(null); // Go back to overview to see the clone
    }
  };

  const renderRoomChecklist = () => {
    if (!selectedRoom) return null;
    const prop = properties.find(p => p.id === selectedRoom.propertyId);

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={() => { setSelectedRoom(null); setShowEditSchedule(false); }}
            className="text-sm text-gray-500 flex items-center hover:text-gray-800 dark:hover:text-gray-200 p-2 -ml-2 touch-manipulation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          
          {user.role !== 'cleaner' && (
            <button 
              onClick={handleCloneRoom}
              className="text-sm font-semibold text-amber-600 dark:text-amber-500 flex items-center bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-500/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Clone Room
            </button>
          )}
        </div>
        
        <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-900/30 relative overflow-hidden">
          {/* Quick Express Status Badge */}
          {selectedRoom.status === 'overdue' && (
             <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
               NEEDS IMMEDIATE CLEANING
             </div>
          )}
          
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className={`text-sm text-${prop?.theme}-600 dark:text-${prop?.theme}-400 font-semibold mb-1`}>{prop?.name}</p>
              
              {isRenaming ? (
                <form onSubmit={handleRenameSubmit} className="flex items-center gap-2 mb-2">
                  <input 
                    type="text" 
                    value={renameInput}
                    onChange={(e) => setRenameInput(e.target.value)}
                    className="glass-input px-2 py-1 rounded-lg text-lg font-bold outline-none flex-1"
                    autoFocus
                  />
                  <button type="submit" className="bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-bold">Save</button>
                  <button type="button" onClick={() => setIsRenaming(false)} className="text-gray-500 text-xs">Cancel</button>
                </form>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h2 className="text-2xl font-bold">{selectedRoom.name}</h2>
                  {user.role !== 'cleaner' && (
                    <button 
                      onClick={() => { setRenameInput(selectedRoom.name); setIsRenaming(true); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-emerald-500 p-1 touch-manipulation"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              {selectedRoom.status === 'clean' ? (
                 <div className="mt-3 inline-flex items-center bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-xs font-bold px-2 py-1 rounded-full">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                   </svg>
                   Cleaned by {selectedRoom.cleanedBy}
                 </div>
              ) : (
                 <p className="text-sm text-gray-500 mt-1 flex items-center">
                   <span className="font-semibold text-orange-500 mr-2">{selectedRoom.status === 'overdue' ? 'OVERDUE' : 'PENDING'}</span>
                 </p>
              )}
              
              <div className="mt-3 inline-block bg-white/70 dark:bg-black/40 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm">
                Next Cleaning: {selectedRoom.date} {selectedRoom.deadline}
              </div>
            </div>
            
            {user.role !== 'cleaner' && (
              <button 
                onClick={() => {
                  setScheduleData({ date: selectedRoom.date || new Date().toISOString().split('T')[0], time: selectedRoom.deadline || '12:00' });
                  setShowEditSchedule(!showEditSchedule);
                }}
                className="bg-white/50 dark:bg-black/30 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white/80 transition-colors touch-manipulation ml-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          
          {user.role !== 'cleaner' && (
            <div className="mt-4 flex gap-2">
              <button 
                onClick={handleImmediateExpressClean}
                className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm touch-manipulation flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Express Clean Now!
              </button>
            </div>
          )}
        </div>

        {showEditSchedule && (
          <form onSubmit={handleUpdateSchedule} className="glass-panel p-4 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700 animate-fade-in">
            <h3 className="font-bold text-sm mb-3 text-gray-700 dark:text-gray-300">Schedule Next Cleaning</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                <input 
                  type="date"
                  value={scheduleData.date}
                  onChange={e => setScheduleData({...scheduleData, date: e.target.value})}
                  className="w-full glass-input px-2 py-2 rounded-lg focus:ring-2 outline-none font-medium text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Time (Deadline)</label>
                <input 
                  type="time"
                  value={scheduleData.time}
                  onChange={e => setScheduleData({...scheduleData, time: e.target.value})}
                  className="w-full glass-input px-2 py-2 rounded-lg focus:ring-2 outline-none font-medium text-sm"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 glass-button py-2 rounded-lg text-sm font-bold">Save Schedule</button>
              <button type="button" onClick={() => setShowEditSchedule(false)} className="px-3 bg-gray-200 dark:bg-gray-800 rounded-lg text-sm font-bold">Cancel</button>
            </div>
          </form>
        )}

        <div className="mt-6 flex justify-between items-end">
          <h3 className="text-lg font-bold">Checklist</h3>
          {user.role !== 'cleaner' && (
            <button 
              onClick={() => setShowAddChecklist(true)}
              className={`text-${prop?.theme}-600 dark:text-${prop?.theme}-400 text-sm font-semibold hover:underline touch-manipulation p-2`}
            >
              + Add Item
            </button>
          )}
        </div>

        {showAddChecklist && (
          <form onSubmit={handleAddChecklist} className="glass-panel p-4 rounded-xl mb-4 flex gap-2">
            <input 
              type="text" 
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              placeholder="New Task..."
              className="flex-1 glass-input px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500/50 outline-none"
              autoFocus
            />
            <button type="submit" className="glass-button px-4 rounded-lg font-bold">Save</button>
            <button type="button" onClick={() => setShowAddChecklist(false)} className="text-gray-500 px-2">Cancel</button>
          </form>
        )}

        <div className="space-y-3">
          {selectedRoom.checklist.map(task => (
            <div 
              key={task.id} 
              onClick={() => toggleChecklist(selectedRoom.id, task.id)}
              className={`glass-panel p-4 rounded-xl flex items-center cursor-pointer touch-manipulation transition-colors ${task.done ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center mr-4 flex-shrink-0 ${task.done ? 'bg-emerald-500 text-white' : 'border-2 border-gray-300 dark:border-gray-600'}`}>
                {task.done && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`flex-1 text-lg ${task.done ? 'line-through text-gray-500 dark:text-gray-400' : 'font-medium'}`}>
                {task.text}
              </span>
            </div>
          ))}
          
          {selectedRoom.checklist.length === 0 && (
            <p className="text-center text-gray-500 py-8">No checklist items. Add one above.</p>
          )}
        </div>
        
        {selectedRoom.checklist.length > 0 && selectedRoom.status !== 'clean' && (
          <div className="mt-8">
            <button 
              onClick={() => {
                // Force mark all as done
                const now = new Date();
                const logEntry = { date: now.toISOString().split('T')[0], time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`, user: user.name };
                const updatedRooms = rooms.map(r => {
                  if (r.id === selectedRoom.id) {
                    return {
                      ...r,
                      status: 'clean',
                      cleanedBy: user.name,
                      logs: [logEntry, ...(r.logs || [])],
                      checklist: r.checklist.map(t => ({...t, done: true}))
                    };
                  }
                  return r;
                });
                setRooms(updatedRooms);
                setSelectedRoom(updatedRooms.find(r => r.id === selectedRoom.id));
              }}
              className="w-full glass-button py-4 rounded-2xl shadow-lg text-lg font-bold touch-manipulation"
            >
              Complete Cleaning
            </button>
          </div>
        )}

        {/* Cleaning Logs */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Cleaning Logs</h3>
          {selectedRoom.logs && selectedRoom.logs.length > 0 ? (
            <div className="space-y-3">
              {selectedRoom.logs.map((log, i) => (
                <div key={i} className="glass-panel p-3 rounded-xl flex items-center justify-between opacity-80">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold mr-3">
                      {log.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{log.user}</p>
                      <p className="text-xs text-gray-500">{log.date} at {log.time}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Cleaned
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No cleaning logs recorded for this room yet.</p>
          )}
        </div>
      </div>
    );
  };

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
        {selectedRoom ? (
          renderRoomChecklist()
        ) : (
          <>
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
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      {!selectedRoom && (
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
      )}
    </div>
  );
}
