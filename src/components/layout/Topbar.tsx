import React from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import type { ViewTab } from '../../types';

export const Topbar: React.FC = () => {
  const { 
    userRole, 
    setUserRole, 
    guests, 
    activeTab, 
    setActiveTab, 
    events, 
    activeEventId, 
    setActiveEventId 
  } = useGatehouse();

  const totalCount = guests.length;
  const checkedInCount = guests.filter((g) => g.status === 'in').length;
  const isLive = checkedInCount > 0;

  const roleTabs: { id: ViewTab; label: string; count?: number }[] = [
    { id: 'landing', label: 'Overview Landing' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'guests', label: 'Guest List', count: totalCount },
    { id: 'checkin', label: 'Check-In' },
    { id: 'walkin', label: 'Walk-In' },
    { id: 'centres', label: 'Book Centres' },
    { id: 'centre_portal', label: 'Centre Portal' },
    { id: 'public_reg', label: 'Public Link (Path C)' },
    { id: 'settings', label: 'Event Setup' },
  ];

  return (
    <div className="topbar">
      {/* Top Header Row with Role Switcher & Event Picker */}
      <div className="brand-row">
        <div className="brand cursor-pointer" onClick={() => setActiveTab('landing')}>
          <div className={`gate-light ${isLive ? 'live' : ''}`} id="gateLight" />
          <div>
            <h1>Gatehouse</h1>
            <div className="sub">Event Entry &amp; Venue Operations</div>
          </div>
        </div>

        {/* Role Switcher & Event Selector */}
        <div className="flex items-center gap-3">
          
          {/* Active Event Dropdown */}
          <div className="text-right">
            <select
              value={activeEventId}
              onChange={(e) => setActiveEventId(e.target.value)}
              className="bg-[#151A22] border border-[#262D38] text-[#EDEFF3] rounded-md px-2.5 py-1 text-xs font-mono font-semibold focus:outline-none focus:border-[#3ED98A]"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name} ({evt.date})
                </option>
              ))}
            </select>
          </div>

          {/* Role Context Pill */}
          <div className="flex items-center bg-[#151A22] border border-[#262D38] rounded-md p-0.5 text-xs font-mono">
            <button
              onClick={() => {
                setUserRole('organizer');
                setActiveTab('dashboard');
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                userRole === 'organizer' && activeTab !== 'landing'
                  ? 'bg-[#3ED98A] text-[#08150E]'
                  : 'text-[#8B93A3] hover:text-[#EDEFF3]'
              }`}
            >
              Organizer
            </button>
            <button
              onClick={() => {
                setUserRole('centre');
                setActiveTab('centre_portal');
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                userRole === 'centre'
                  ? 'bg-[#F0A93B] text-[#08150E]'
                  : 'text-[#8B93A3] hover:text-[#EDEFF3]'
              }`}
            >
              Event Centre
            </button>
            <button
              onClick={() => {
                setUserRole('guest');
                setActiveTab('public_reg');
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                userRole === 'guest'
                  ? 'bg-[#E5555C] text-[#EDEFF3]'
                  : 'text-[#8B93A3] hover:text-[#EDEFF3]'
              }`}
            >
              Guest (Public)
            </button>
          </div>

        </div>
      </div>

      {/* Tabs */}
      <nav className="tabs">
        {roleTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={activeTab === t.id ? 'active' : ''}
            data-view={t.id}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="count" id="tabGuestCount">
                ({t.count})
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};
