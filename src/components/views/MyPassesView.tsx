import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { api } from '../../lib/api-client';
import type { Guest } from '../../types';
import { QRCodePass } from './QRCodePass';
import { Ticket, Search, Calendar, Share2, Download, ShieldCheck, CheckCircle2, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';

export const MyPassesView: React.FC = () => {
  const { setActiveTab, activeEvent } = useGatehouse();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [foundPasses, setFoundPasses] = useState<Guest[]>([]);
  const [selectedPass, setSelectedPass] = useState<Guest | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const results = await api.lookupGuests(searchQuery.trim());
      setFoundPasses(results);
      if (results.length > 0) {
        setSelectedPass(results[0]);
      } else {
        setSelectedPass(null);
      }
    } catch (err) {
      console.error('Pass lookup failed:', err);
      setFoundPasses([]);
      setSelectedPass(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPass = (pass: Guest) => {
    const passData = `GATEHOUSE OFFICIAL ACCESS PASS\nEvent: ${activeEvent.name}\nGuest: ${pass.name}\nCategory: ${pass.category}\nAccess Code: ${pass.code}\nHMAC Signature: ${pass.qrPayload}`;
    const blob = new Blob([passData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Gatehouse-Pass-${pass.code}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShareWhatsApp = (pass: Guest) => {
    const text = encodeURIComponent(
      `🎉 My Official Access Pass for ${activeEvent.name}\nAccess Code: ${pass.code}\nStatus: Active ✅\nGatehouse HMAC Verified`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Topbar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs tracking-wider uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographic Gate Pass Wallet</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-2">
            <Ticket className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Guest Pass Wallet & Pass Recovery
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Enter your email address, phone number, or 9-character access code to recover your digital event entry pass.
          </p>
        </div>

        {/* Search & Lookup Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-2xl">
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Email (e.g. guest@company.com), Phone or Code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Find My Pass</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Search Results Display */}
        {searched && (
          <div className="space-y-6">
            {foundPasses.length === 0 ? (
              <div className="bg-slate-900/50 border border-red-500/20 rounded-2xl p-8 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
                <h3 className="text-lg font-semibold text-white">No Pass Found</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  We could not find any active event pass matching <span className="text-indigo-400 font-mono">"{searchQuery}"</span>. Please check your credentials or register for an upcoming event.
                </p>
                <button
                  onClick={() => setActiveTab('register')}
                  className="mt-2 inline-flex items-center space-x-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-5 py-2.5 rounded-xl font-medium text-sm transition-all"
                >
                  <span>Register for Event</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Pass Selector List */}
                <div className="space-y-3 md:col-span-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                    Your Registered Passes ({foundPasses.length})
                  </h3>
                  {foundPasses.map((pass) => (
                    <div
                      key={pass.id}
                      onClick={() => setSelectedPass(pass)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedPass?.id === pass.id
                          ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white text-sm truncate">{pass.name}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          pass.status === 'in'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {pass.status === 'in' ? 'Checked In' : 'Active Pass'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">Code: {pass.code}</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{activeEvent.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Pass QR Detail View */}
                {selectedPass && (
                  <div className="md:col-span-2 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">Official Entry Pass</span>
                        <h2 className="text-xl font-bold text-white mt-0.5">{selectedPass.name}</h2>
                        <p className="text-xs text-slate-400">{selectedPass.email} • {selectedPass.category} Tier</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-mono">Access Code</span>
                        <span className="text-lg font-mono font-bold text-emerald-400">{selectedPass.code}</span>
                      </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="bg-white p-4 rounded-xl shadow-xl">
                        <QRCodePass value={selectedPass.qrPayload} size={180} />
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>HMAC-SHA256 Signed Token</span>
                      </div>
                    </div>

                    {/* Event & Venue Info */}
                    <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block">Event</span>
                        <span className="text-white font-semibold">{activeEvent.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Date & Time</span>
                        <span className="text-white font-semibold">{activeEvent.date} @ {activeEvent.startTime}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleDownloadPass(selectedPass)}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl flex items-center justify-center space-x-2 text-sm transition-all border border-slate-700"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Pass</span>
                      </button>
                      <button
                        onClick={() => handleShareWhatsApp(selectedPass)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl flex items-center justify-center space-x-2 text-sm transition-all shadow-lg shadow-emerald-600/20"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share to WhatsApp</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
