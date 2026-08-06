import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';

function fmtTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const DashboardView: React.FC = () => {
  const { guests, checkinTimeline, activeEvent, exportCsvReport } = useGatehouse();

  const [feedFilter, setFeedFilter] = useState<'all' | 'VIP' | 'Regular'>('all');

  const totalInvited = guests.length;
  const checkedInList = guests.filter((g) => g.status === 'in');
  const checkedInCount = checkedInList.length;
  const attendanceRate = totalInvited > 0 ? Math.round((checkedInCount / totalInvited) * 100) : 0;
  const notArrivedCount = totalInvited - checkedInCount;

  // Category breakdown
  const vipCount = guests.filter((g) => g.category === 'VIP').length;
  const vipCheckedIn = guests.filter((g) => g.category === 'VIP' && g.status === 'in').length;
  const regularCount = guests.filter((g) => g.category === 'Regular').length;
  const regularCheckedIn = guests.filter((g) => g.category === 'Regular' && g.status === 'in').length;

  // Filtered live feed sorted by checkinTime desc
  const feedList = checkedInList
    .filter((g) => feedFilter === 'all' || g.category === feedFilter)
    .sort((a, b) => {
      const tA = a.checkinTime ? a.checkinTime.getTime() : 0;
      const tB = b.checkinTime ? b.checkinTime.getTime() : 0;
      return tB - tA;
    });

  // Simple 10-minute arrival timeline buckets
  const timeBuckets: { [key: string]: number } = {};
  checkinTimeline.forEach((t) => {
    const mins = Math.floor(t.getMinutes() / 10) * 10;
    const key = `${t.getHours().toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    timeBuckets[key] = (timeBuckets[key] || 0) + 1;
  });

  return (
    <section className="view active" id="view-dashboard">
      <div className="space-y-6">
        
        {/* DASHBOARD HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#262D38] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173226] text-[#3ED98A] font-mono text-xs font-bold border border-[#3ED98A]/30 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#3ED98A] animate-ping" />
              EXECUTIVE ANALYTICS &amp; INSIGHTS (PHASE 6)
            </div>
            <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#EDEFF3]">
              {activeEvent.name} Access Dashboard
            </h2>
            <p className="text-xs font-mono text-[#8B93A3]">
              Event Date: {activeEvent.date} • Start Time: {activeEvent.startTime} • Capacity Cap: {activeEvent.capacity}
            </p>
          </div>

          <button
            onClick={exportCsvReport}
            className="btn btn-go font-mono text-xs font-bold px-4 py-2 flex items-center gap-2 shadow-lg shadow-[#3ED98A]/20"
          >
            📥 Export Attendance CSV Audit
          </button>
        </div>

        {/* 4 STAT CARDS GRID */}
        <div className="stat-grid">
          
          <div className="stat-card">
            <div className="num" id="statInvited">{totalInvited}</div>
            <div className="label">Total Registered Guests</div>
          </div>

          <div className="stat-card go">
            <div className="num" id="statCheckedIn">{checkedInCount}</div>
            <div className="label">Checked In (At Venue)</div>
          </div>

          <div className="stat-card">
            <div className="num" id="statRate">{attendanceRate}%</div>
            <div className="label">Live Attendance Rate</div>
          </div>

          <div className="stat-card alert">
            <div className="num" id="statNotArrived">{notArrivedCount}</div>
            <div className="label">Not Yet Arrived</div>
          </div>

        </div>

        {/* VIP vs REGULAR RATIO & THROUGHPUT VELOCITY */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* VIP vs Regular Ratio Card */}
          <div className="panel space-y-4">
            <div className="panel-head">
              <h3>VIP vs. Regular Guest Breakdown</h3>
              <span className="text-xs font-mono text-[#3ED98A]">Live Tier Ratios</span>
            </div>

            <div className="space-y-4">
              
              {/* VIP Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#F0A93B] font-bold">VIP Guests</span>
                  <span className="text-white">{vipCheckedIn} / {vipCount} Checked In ({vipCount > 0 ? Math.round((vipCheckedIn / vipCount) * 100) : 0}%)</span>
                </div>
                <div className="h-3 bg-[#080c14] rounded-full overflow-hidden border border-[#262D38]">
                  <div
                    className="h-full bg-[#F0A93B] rounded-full transition-all duration-500"
                    style={{ width: `${vipCount > 0 ? (vipCheckedIn / vipCount) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Regular Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#3ED98A] font-bold">Regular Guests</span>
                  <span className="text-white">{regularCheckedIn} / {regularCount} Checked In ({regularCount > 0 ? Math.round((regularCheckedIn / regularCount) * 100) : 0}%)</span>
                </div>
                <div className="h-3 bg-[#080c14] rounded-full overflow-hidden border border-[#262D38]">
                  <div
                    className="h-full bg-[#3ED98A] rounded-full transition-all duration-500"
                    style={{ width: `${regularCount > 0 ? (regularCheckedIn / regularCount) * 100 : 0}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* 10-Minute Velocity Window Chart */}
          <div className="panel space-y-3">
            <div className="panel-head">
              <h3>10-Minute Gate Arrival Timeline</h3>
              <span className="text-xs font-mono text-[#8B93A3]">Check-In Spikes</span>
            </div>

            <div className="h-36 bg-[#080c14] rounded-xl border border-[#262D38] p-4 flex items-end justify-between gap-2">
              {Object.keys(timeBuckets).length > 0 ? (
                Object.entries(timeBuckets).map(([timeStr, count]) => (
                  <div key={timeStr} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono text-[#3ED98A] font-bold">{count}</span>
                    <div
                      className="w-full bg-[#3ED98A] rounded-t-md transition-all"
                      style={{ height: `${Math.min(100, count * 20)}px` }}
                    />
                    <span className="text-[9px] font-mono text-[#8B93A3]">{timeStr}</span>
                  </div>
                ))
              ) : (
                <div className="w-full text-center text-xs font-mono text-[#565E6D] self-center">
                  Arrival velocity timeline populates as gate scans occur.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* LIVE CHECK-IN AUDIT FEED */}
        <div className="panel space-y-4">
          <div className="panel-head">
            <h3>Live Gate Check-In Stream</h3>
            <div className="flex items-center gap-2">
              <select
                value={feedFilter}
                onChange={(e) => setFeedFilter(e.target.value as any)}
                className="text-xs font-mono bg-[#080c14] border border-[#262D38] text-[#EDEFF3] rounded-md px-2.5 py-1"
              >
                <option value="all">All Tiers</option>
                <option value="VIP">VIP Only</option>
                <option value="Regular">Regular Only</option>
              </select>
            </div>
          </div>

          <div className="feed" id="liveFeed">
            {feedList.length > 0 ? (
              feedList.slice(0, 10).map((g) => (
                <div key={g.id} className="feed-row flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="feed-dot" />
                    <span className="feed-name text-white font-bold">{g.name}</span>
                    <span className={`tag text-[10px] ${g.category === 'VIP' ? 'tag-vip' : 'tag-regular'}`}>
                      {g.category}
                    </span>
                    <span className="code-chip text-[10px]">{g.code}</span>
                  </div>
                  <span className="feed-time font-mono text-xs text-[#8B93A3]">
                    {g.checkinTime ? fmtTime(g.checkinTime) : 'Just now'} • Verified by {g.checkedInBy || 'Gate Camera'}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty" id="feedEmptyState">
                No check-in entries recorded yet. Access scanner to verify guests.
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
