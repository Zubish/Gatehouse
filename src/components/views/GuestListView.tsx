import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { Users, UserPlus, FileSpreadsheet, Search, CheckCircle2, XCircle, Trash2, Undo, Filter } from 'lucide-react';

export const GuestListView: React.FC = () => {
  const { guests, addGuest, checkInGuest, undoCheckin, removeGuest, bulkImportGuests, exportCsvReport } = useGatehouse();

  // Add Guest State
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addCategory, setAddCategory] = useState<'VIP' | 'Regular'>('Regular');

  // Bulk Import State
  const [bulkText, setBulkText] = useState('');
  const [importStatusMsg, setImportStatusMsg] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in' | 'out'>('all');

  const handleAddGuest = async () => {
    if (!addName.trim()) return;
    await addGuest({
      name: addName,
      phone: addPhone || '+234 800 000 0000',
      category: addCategory,
      organization: 'Guest List Entry',
    });
    setAddName('');
    setAddPhone('');
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) return;
    const added = await bulkImportGuests(bulkText);
    setBulkText('');
    setImportStatusMsg(`Added ${added} guest pass${added !== 1 ? 'es' : ''}`);
    setTimeout(() => setImportStatusMsg(''), 2500);
  };

  // Filtered guest list sorted alphabetically
  const filteredList = guests
    .filter((g) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQ =
        !q ||
        g.name.toLowerCase().includes(q) ||
        (g.phone && g.phone.includes(q)) ||
        g.code.toLowerCase().includes(q);
      const matchesF = filterStatus === 'all' || g.status === filterStatus;
      return matchesQ && matchesF;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="view active space-y-8" id="view-guests">
      
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5cbdb9]/10 text-[#5cbdb9] font-mono text-xs font-bold border border-[#5cbdb9]/30">
            <Users className="h-3.5 w-3.5" />
            ATTENDEE ROSTER &amp; PASS DISPATCH
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            Guest List Management
          </h2>
          <p className="text-xs font-mono text-muted-foreground">
            Issue single QR passes, bulk import CSV rosters, and manage check-in statuses.
          </p>
        </div>

        <button
          onClick={exportCsvReport}
          className="rounded-full bg-primary px-5 py-2.5 text-xs font-mono font-bold text-primary-foreground hover:bg-primary/90 flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export Guest CSV Audit
        </button>
      </div>

      {/* 2-COLUMN ADD GUEST & BULK IMPORT GRID */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* ADD SINGLE GUEST PASS */}
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-4 card-glow">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-[#38ef7d]" />
              <h3 className="font-heading text-base font-bold text-foreground">Issue Single Guest Pass</h3>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">HMAC-SHA256 Signed</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-muted-foreground font-bold">Attendee Full Name</label>
              <input
                type="text"
                placeholder="e.g. Chidinma Okoro"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Phone / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="0803 000 0000"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-bold">Pass Category</label>
                <select
                  value={addCategory}
                  onChange={(e) => setAddCategory(e.target.value as 'VIP' | 'Regular')}
                  className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Regular">Regular Pass</option>
                  <option value="VIP">VIP Pass</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddGuest}
              className="w-full rounded-2xl bg-primary py-3 text-xs font-mono font-bold text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-md mt-2"
            >
              + Issue Digital QR Pass
            </button>
          </div>
        </div>

        {/* BULK CSV IMPORT */}
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-4 card-glow">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-[#5cbdb9]" />
              <h3 className="font-heading text-base font-bold text-foreground">Bulk Roster CSV Import</h3>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">Format: Name, Email/Phone, Category</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <textarea
              rows={4}
              placeholder={`Tunde Bakare, tunde@company.ng, VIP\nAmaka Chukwu, amaka@company.ng, Regular`}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={handleBulkImport}
                className="rounded-2xl border border-[#5cbdb9]/40 bg-[#5cbdb9]/10 text-[#5cbdb9] px-5 py-2.5 text-xs font-mono font-bold hover:bg-[#5cbdb9]/20 transition-all cursor-pointer"
              >
                Import Guest List
              </button>
              {importStatusMsg && (
                <span className="text-xs font-mono text-[#38ef7d] font-bold animate-in fade-in">
                  {importStatusMsg}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* GUEST TABLE PANEL */}
      <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-6 card-glow">
        
        {/* TOOLBAR SEARCH & FILTER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search guests by name, phone, or pass code…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border/80 bg-navy-900 pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'in' | 'out')}
              className="rounded-2xl border border-border/80 bg-navy-900 px-3.5 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="in">Checked In</option>
              <option value="out">Pending Arrival</option>
            </select>
          </div>
        </div>

        {/* GUEST ROSTER TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border/40 text-muted-foreground uppercase text-[10px]">
                <th className="py-3 px-4">Attendee Guest</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pass Code</th>
                <th className="py-3 px-4">Gate Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredList.map((g) => (
                <tr key={g.id} className="hover:bg-navy-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-bold text-foreground">
                    <div className="text-sm font-heading">{g.name}</div>
                    <div className="text-[11px] font-mono text-muted-foreground">{g.phone || g.email || '—'}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      g.category === 'VIP'
                        ? 'bg-[#5cbdb9]/10 text-[#5cbdb9] border-[#5cbdb9]/30'
                        : 'bg-primary/10 text-primary border-primary/30'
                    }`}>
                      {g.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[#38ef7d] font-bold">{g.code}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${
                      g.status === 'in'
                        ? 'bg-[#38ef7d]/10 text-[#38ef7d] border-[#38ef7d]/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {g.status === 'in' ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Checked In
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" /> Pending Arrival
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {g.status === 'in' ? (
                        <button
                          onClick={async () => {
                            try {
                              await undoCheckin(g.id);
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl border border-border/80 bg-navy-900 hover:bg-card text-muted-foreground hover:text-foreground text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Undo className="h-3 w-3" /> Undo
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            try {
                              await checkInGuest(g.id, 'Host Manager', 'manual_code');
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-[11px] font-mono font-bold hover:bg-primary/90 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle2 className="h-3 w-3" /> Check In
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          try {
                            await removeGuest(g.id);
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className="p-1.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        title="Remove Pass"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredList.length === 0 && (
            <div className="p-8 text-center text-xs font-mono text-muted-foreground bg-navy-900/40 rounded-2xl border border-border/40">
              No attendee guest passes match your search filter.
            </div>
          )}
        </div>

      </div>

    </section>
  );
};
