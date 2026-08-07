import React, { useState } from "react";
import { useGatehouse } from "../../context/GatehouseContext";

export const AdminPortalView: React.FC = () => {
  const { eventCentres, events, guests } = useGatehouse();

  const [usersList, setUsersList] = useState([
    {
      id: "u_org_1",
      name: "Chidinma Okoro",
      email: "chidinma@xquisit.ng",
      role: "organizer",
      status: "active",
      joined: "Aug 2, 2026",
    },
    {
      id: "u_centre_1",
      name: "Eko Convention Centre",
      email: "info@ekohotels.com",
      role: "centre",
      status: "active",
      joined: "Jul 28, 2026",
    },
    {
      id: "u_org_2",
      name: "Babatunde Raji",
      email: "baba@events.ng",
      role: "organizer",
      status: "active",
      joined: "Aug 4, 2026",
    },
    {
      id: "u_centre_2",
      name: "Harbour Point VI",
      email: "management@harbourpoint.ng",
      role: "centre",
      status: "active",
      joined: "Jul 30, 2026",
    },
  ]);

  const [statusMsg, setStatusMsg] = useState("");

  const totalUsers = usersList.length;
  const totalVenues = eventCentres.length;
  const totalEvents = events.length;
  const totalCheckins = guests.filter((g) => g.status === "in").length;

  const toggleUserStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "active" ? "suspended" : "active";
          setStatusMsg(
            `User ${u.name} status set to ${nextStatus.toUpperCase()}`,
          );
          setTimeout(() => setStatusMsg(""), 2500);
          return { ...u, status: nextStatus };
        }
        return u;
      }),
    );
  };

  return (
    <section className="view active" id="view-admin-portal">
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#262D38] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#331B1D] text-[#E5555C] font-mono text-xs font-bold border border-[#E5555C]/40 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#E5555C] animate-pulse" />
              SUPER-ADMIN PLATFORM OVERSIGHT (PHASE 8)
            </div>
            <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#EDEFF3]">
              Gatehouse Platform Super Admin Portal
            </h2>
            <p className="text-xs font-mono text-[#8B93A3]">
              System-wide metrics, tenant accounts, platform audit logs &amp;
              enterprise subscription tiers.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#151A22] border border-[#262D38] text-xs font-mono text-[#3ED98A] font-bold">
            🛡️ Platform Health: 99.99% Uptime (Neon DB + Vercel Serverless)
          </div>
        </div>

        {/* 4 SYSTEM METRICS CARDS */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="num text-[#3ED98A]">{totalUsers}</div>
            <div className="label">Registered Platform Accounts</div>
          </div>
          <div className="stat-card">
            <div className="num">{totalVenues}</div>
            <div className="label">Verified Event Facilities</div>
          </div>
          <div className="stat-card go">
            <div className="num">{totalEvents}</div>
            <div className="label">Active Events Hosted</div>
          </div>
          <div className="stat-card alert">
            <div className="num">{totalCheckins}</div>
            <div className="label">Total Verified Gate Passes</div>
          </div>
        </div>

        {/* STATUS BANNER */}
        {statusMsg && (
          <div className="p-3.5 rounded-xl bg-[#173226] border border-[#3ED98A] text-[#3ED98A] text-xs font-mono font-bold text-center">
            {statusMsg}
          </div>
        )}

        {/* PLATFORM USERS ACCOUNTS TABLE */}
        <div className="panel space-y-4">
          <div className="panel-head">
            <h3>Tenant Accounts &amp; Access Controls</h3>
            <span className="text-xs font-mono text-[#8B93A3]">
              Super Admin Actions
            </span>
          </div>

          <table>
            <thead>
              <tr>
                <th>User / Organization</th>
                <th>Email Address</th>
                <th>Role Tier</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong className="text-white">{u.name}</strong>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-[#8B93A3]">
                      {u.email}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`tag text-[10px] ${u.role === "centre" ? "tag-vip" : "tag-regular"}`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-xs">{u.joined}</span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${u.status === "active" ? "in" : "out"}`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`btn btn-sm font-mono ${
                        u.status === "active" ? "btn-danger" : "btn-go"
                      }`}
                    >
                      {u.status === "active"
                        ? "Suspend Account"
                        : "Activate Account"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SYSTEM AUDIT LOG FEED */}
        <div className="panel space-y-4">
          <div className="panel-head">
            <h3>Platform System Security Audit Logs</h3>
            <span className="text-xs font-mono text-[#3ED98A]">
              Real-Time Security Feed
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#080c14] border border-[#262D38] flex justify-between text-[#8B93A3]">
              <span>
                🔒 <strong>AUTH_JWT_SIGN:</strong> User chidinma@xquisit.ng
                signed in via JWT token session.
              </span>
              <span>2 mins ago</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#080c14] border border-[#262D38] flex justify-between text-[#8B93A3]">
              <span>
                🏢 <strong>VENUE_DELEGATION:</strong> Eko Convention Centre
                granted Path B delegation for EVT-8921.
              </span>
              <span>12 mins ago</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#080c14] border border-[#262D38] flex justify-between text-[#3ED98A]">
              <span>
                ⚡ <strong>HMAC_SCAN_OK:</strong> Gate Camera Agent verified
                guest Babatunde Raji (EVT-TBK88).
              </span>
              <span>24 mins ago</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#080c14] border border-[#262D38] flex justify-between text-[#F0A93B]">
              <span>
                🔓 <strong>HARDWARE_RELAY:</strong> Turnstile pulse sent to Gate
                Lane #01 (3000ms duration).
              </span>
              <span>35 mins ago</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
