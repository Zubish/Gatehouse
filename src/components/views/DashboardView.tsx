import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { Users, UserCheck, Percent, UserX, Download, QrCode, UserPlus, Link, Building2 } from 'lucide-react';

function fmtTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const DashboardView: React.FC = () => {
  const { guests, checkinTimeline, activeEvent, exportCsvReport, setActiveTab } = useGatehouse();

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

  // Timeline buckets
  const timeBuckets: { [key: string]: number } = {};
  checkinTimeline.forEach((t) => {
    const mins = Math.floor(t.getMinutes() / 10) * 10;
    const key = `${t.getHours().toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    timeBuckets[key] = (timeBuckets[key] || 0) + 1;
  });

  return (
    <section className="view active space-y-8" id="view-dashboard">
      
      {/* DASHBOARD HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38ef7d]/10 text-[#38ef7d] font-mono text-xs font-bold border border-[#38ef7d]/30">
            <span className="w-2 h-2 rounded-full bg-[#38ef7d] animate-pulse" />
            LIVE WORKSPACE DASHBOARD
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            {activeEvent.name}
          </h2>
          <p className="text-xs font-mono text-muted-foreground">
            🗓️ Date: {activeEvent.date} • ⏰ Start Time: {activeEvent.startTime} • 👥 Venue Cap: {activeEvent.capacity.toLocaleString()}
          </p>
        </div>

        <button
          onClick={exportCsvReport}
          className="rounded-full bg-primary px-5 py-2.5 text-xs font-mono font-bold text-primary-foreground hover:bg-primary/90 flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <Download className="h-4 w-4" />
          Export Attendance Audit CSV
        </button>
      </div>

      {/* QUICK WORKSPACE ACTIONS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('guests')}
          className="p-4 rounded-3xl border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 text-left space-y-2 transition-all cursor-pointer card-glow group"
        >
          <UserPlus className="h-5 w-5 text-[#5cbdb9] group-hover:scale-110 transition-transform" />
          <div className="text-xs font-mono font-bold text-foreground">Add Guest Pass</div>
          <div className="text-[10px] text-muted-foreground">Issue single or bulk passes</div>
        </button>

        <button
          onClick={() => setActiveTab('checkin')}
          className="p-4 rounded-3xl border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 text-left space-y-2 transition-all cursor-pointer card-glow group"
        >
          <QrCode className="h-5 w-5 text-[#38ef7d] group-hover:scale-110 transition-transform" />
          <div className="text-xs font-mono font-bold text-foreground">Gate Scanner</div>
          <div className="text-[10px] text-muted-foreground">Open live 2.5s QR camera</div>
        </button>

        <button
          onClick={() => setActiveTab('public-reg')}
          className="p-4 rounded-3xl border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 text-left space-y-2 transition-all cursor-pointer card-glow group"
        >
          <Link className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
          <div className="text-xs font-mono font-bold text-foreground">Public Self-Reg</div>
          <div className="text-[10px] text-muted-foreground">Share registration token link</div>
        </button>

        <button
          onClick={() => setActiveTab('centres')}
          className="p-4 rounded-3xl border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 text-left space-y-2 transition-all cursor-pointer card-glow group"
        >
          <Building2 className="h-5 w-5 text-[#5cbdb9] group-hover:scale-110 transition-transform" />
          <div className="text-xs font-mono font-bold text-foreground">Book Facility</div>
          <div className="text-[10px] text-muted-foreground">Browse verified Nigerian halls</div>
        </button>
      </div>

      {/* 4 KEY STAT CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-2 card-glow">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase font-bold">Total Registered</span>
            <Users className="h-4 w-4 text-[#5cbdb9]" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-foreground">{totalInvited}</div>
          <div className="text-[10px] font-mono text-muted-foreground">Expected Attendees</div>
        </div>

        <div className="rounded-3xl border border-[#38ef7d]/40 bg-card/60 p-6 space-y-2 card-glow">
          <div className="flex items-center justify-between text-[#38ef7d]">
            <span className="text-xs font-mono uppercase font-bold">Checked In</span>
            <UserCheck className="h-4 w-4 text-[#38ef7d]" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-[#38ef7d]">{checkedInCount}</div>
          <div className="text-[10px] font-mono text-muted-foreground">Verified at Gate</div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-2 card-glow">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase font-bold">Attendance Rate</span>
            <Percent className="h-4 w-4 text-primary" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-foreground">{attendanceRate}%</div>
          <div className="text-[10px] font-mono text-muted-foreground">Capacity Utilization</div>
        </div>

        <div className="rounded-3xl border border-destructive/40 bg-card/60 p-6 space-y-2 card-glow">
          <div className="flex items-center justify-between text-destructive">
            <span className="text-xs font-mono uppercase font-bold">Pending Arrival</span>
            <UserX className="h-4 w-4 text-destructive" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-destructive">{notArrivedCount}</div>
          <div className="text-[10px] font-mono text-muted-foreground">Guests Awaiting Entry</div>
        </div>

      </div>

      {/* VIP vs REGULAR RATIO & THROUGHPUT VELOCITY */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* VIP vs Regular Ratio Card */}
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-6 card-glow">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <h3 className="font-heading text-lg font-bold text-foreground">Guest Tier Ratios</h3>
            <span className="text-xs font-mono text-[#38ef7d] font-bold">Live Breakdown</span>
          </div>

          <div className="space-y-5">
            {/* VIP Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#5cbdb9] font-bold">VIP Passes</span>
                <span className="text-foreground font-bold">
                  {vipCheckedIn} / {vipCount} Checked In ({vipCount > 0 ? Math.round((vipCheckedIn / vipCount) * 100) : 0}%)
                </span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden border border-border/60">
                <div
                  className="h-full bg-[#5cbdb9] rounded-full transition-all duration-500"
                  style={{ width: `${vipCount > 0 ? (vipCheckedIn / vipCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Regular Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#38ef7d] font-bold">Regular Passes</span>
                <span className="text-foreground font-bold">
                  {regularCheckedIn} / {regularCount} Checked In ({regularCount > 0 ? Math.round((regularCheckedIn / regularCount) * 100) : 0}%)
                </span>
              </div>
              <div className="h-3 bg-navy-900 rounded-full overflow-hidden border border-border/60">
                <div
                  className="h-full bg-[#38ef7d] rounded-full transition-all duration-500"
                  style={{ width: `${regularCount > 0 ? (regularCheckedIn / regularCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 10-Minute Velocity Window Chart */}
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-6 card-glow">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <h3 className="font-heading text-lg font-bold text-foreground">10-Minute Gate Velocity</h3>
            <span className="text-xs font-mono text-muted-foreground">Scan Throughput</span>
          </div>

          <div className="h-40 bg-navy-900 rounded-2xl border border-border/60 p-4 flex items-end justify-between gap-2">
            {Object.keys(timeBuckets).length > 0 ? (
              Object.entries(timeBuckets).map(([timeStr, count]) => (
                <div key={timeStr} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-[#38ef7d] font-bold">{count}</span>
                  <div
                    className="w-full bg-[#38ef7d] rounded-t-md transition-all"
                    style={{ height: `${Math.min(100, count * 20)}px` }}
                  />
                  <span className="text-[9px] font-mono text-muted-foreground">{timeStr}</span>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-xs font-mono text-muted-foreground self-center">
                Arrival velocity timeline populates automatically as gate scans occur.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* LIVE CHECK-IN AUDIT STREAM */}
      <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-6 card-glow">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <h3 className="font-heading text-lg font-bold text-foreground">Live Gate Verification Stream</h3>
          <select
            value={feedFilter}
            onChange={(e) => setFeedFilter(e.target.value as any)}
            className="text-xs font-mono bg-navy-900 border border-border/60 text-foreground rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="all">All Tiers</option>
            <option value="VIP">VIP Only</option>
            <option value="Regular">Regular Only</option>
          </select>
        </div>

        <div className="space-y-3">
          {feedList.length > 0 ? (
            feedList.slice(0, 10).map((g) => (
              <div
                key={g.id}
                className="p-3.5 rounded-2xl bg-navy-900/80 border border-border/40 flex items-center justify-between gap-4 text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38ef7d] animate-pulse" />
                  <span className="text-foreground font-bold text-sm font-heading">{g.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-primary/20 text-primary border border-primary/30">
                    {g.category}
                  </span>
                  <span className="text-[#5cbdb9] font-bold">{g.code}</span>
                </div>
                <div className="text-muted-foreground text-right text-[11px]">
                  {g.checkinTime ? fmtTime(g.checkinTime) : 'Just now'} • Verified by {g.checkedInBy || 'Gate Sentinel'}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs font-mono text-muted-foreground bg-navy-900/40 rounded-2xl border border-border/40">
              No check-in logs recorded yet. Use the Gate Scanner to verify attendee passes.
            </div>
          )}
        </div>
      </div>

    </section>
  );
};
