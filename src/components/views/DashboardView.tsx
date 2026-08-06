import React from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

function fmtTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const DashboardView: React.FC = () => {
  const { guests, checkinTimeline, exportCsvReport } = useGatehouse();

  const total = guests.length;
  const inCount = guests.filter((g) => g.status === 'in').length;
  const rate = total ? Math.round((inCount / total) * 100) : 0;
  const outCount = total - inCount;

  // Timeline buckets (10-min windows)
  const buckets: { [label: string]: number } = {};
  checkinTimeline.forEach((t) => {
    const key = new Date(t);
    key.setSeconds(0, 0);
    key.setMinutes(Math.floor(key.getMinutes() / 10) * 10);
    const label = fmtTime(key);
    buckets[label] = (buckets[label] || 0) + 1;
  });

  const chartData = Object.keys(buckets).map((time) => ({
    time,
    count: buckets[time],
  }));

  let peakLabel = '';
  if (chartData.length > 0) {
    const maxVal = Math.max(...chartData.map((d) => d.count));
    const maxItem = chartData.find((d) => d.count === maxVal);
    if (maxItem) {
      peakLabel = `Peak: ${maxItem.time} — ${maxItem.count} in 10 min`;
    }
  }

  // Live feed: arrived guests sorted by checkinTime desc
  const arrived = guests
    .filter((g) => g.status === 'in' && g.checkinTime)
    .sort((a, b) => (b.checkinTime?.getTime() || 0) - (a.checkinTime?.getTime() || 0))
    .slice(0, 12);

  return (
    <section className="view active" id="view-dashboard">
      {/* Stat Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="num" id="statTotal">
            {total}
          </div>
          <div className="label">Invited</div>
        </div>
        <div className="stat-card go">
          <div className="num" id="statIn">
            {inCount}
          </div>
          <div className="label">Checked In</div>
        </div>
        <div className="stat-card">
          <div className="num" id="statRate">
            {rate}%
          </div>
          <div className="label">Attendance Rate</div>
        </div>
        <div className="stat-card alert">
          <div className="num" id="statOut">
            {outCount}
          </div>
          <div className="label">Not Arrived</div>
        </div>
      </div>

      {/* Entry Timeline Panel */}
      <div className="panel">
        <div className="panel-head">
          <h3>Entry Timeline</h3>
          <span className="helper" id="peakLabel">
            {peakLabel}
          </span>
        </div>

        <div style={{ height: 180, width: '100%' }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="time"
                  stroke="#565E6D"
                  fontSize={10}
                  fontFamily="IBM Plex Mono"
                  tickLine={false}
                />
                <YAxis
                  stroke="#565E6D"
                  fontSize={10}
                  fontFamily="IBM Plex Mono"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1B2129',
                    borderColor: '#262D38',
                    borderRadius: '6px',
                    color: '#EDEFF3',
                    fontSize: '12px',
                    fontFamily: 'IBM Plex Mono',
                  }}
                />
                <Bar dataKey="count" fill="#3ED98A" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty" style={{ paddingTop: 60 }}>
              Entry timeline will populate as guests arrive.
            </div>
          )}
        </div>
      </div>

      {/* Live Feed Panel */}
      <div className="panel">
        <div className="panel-head">
          <h3>Live Feed</h3>
          <button className="btn btn-ghost btn-sm" id="exportBtn" onClick={exportCsvReport}>
            Export report (.csv)
          </button>
        </div>
        <div className="feed" id="liveFeed">
          {arrived.length === 0 ? (
            <div className="empty">No check-ins yet. They'll appear here in real time.</div>
          ) : (
            arrived.map((g) => (
              <div key={g.id} className="feed-row">
                <div className="feed-dot" />
                <div className="feed-name">{g.name}</div>
                <span className={`tag ${g.category === 'VIP' ? 'tag-vip' : 'tag-regular'}`}>
                  {g.category}
                </span>
                <div className="feed-time">{g.checkinTime ? fmtTime(g.checkinTime) : ''}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
