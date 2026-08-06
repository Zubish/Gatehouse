import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';

export const GuestListView: React.FC = () => {
  const { guests, addGuest, checkInGuest, undoCheckin, removeGuest, bulkImportGuests } = useGatehouse();

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
    await addGuest(addName, addPhone, addCategory);
    setAddName('');
    setAddPhone('');
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) return;
    const added = await bulkImportGuests(bulkText);
    setBulkText('');
    setImportStatusMsg(`Added ${added} guest${added !== 1 ? 's' : ''}`);
    setTimeout(() => setImportStatusMsg(''), 2500);
  };

  // Filtered guest list sorted alphabetically
  const filteredList = guests
    .filter((g) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQ =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.phone.includes(q) ||
        g.code.toLowerCase().includes(q);
      const matchesF = filterStatus === 'all' || g.status === filterStatus;
      return matchesQ && matchesF;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="view active" id="view-guests">
      <h2 className="section-title">Guest List</h2>

      {/* Add Guest Panel */}
      <div className="panel">
        <div className="panel-head">
          <h3>Add guests</h3>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Name</label>
            <input
              type="text"
              id="addName"
              placeholder="e.g. Chidinma Okoro"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Phone / WhatsApp</label>
            <input
              type="tel"
              id="addPhone"
              placeholder="080..."
              value={addPhone}
              onChange={(e) => setAddPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Category</label>
            <select
              id="addCategory"
              value={addCategory}
              onChange={(e) => setAddCategory(e.target.value as 'VIP' | 'Regular')}
            >
              <option value="Regular">Regular</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <div className="field" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              className="btn btn-go"
              style={{ width: '100%' }}
              id="addGuestBtn"
              onClick={handleAddGuest}
            >
              + Add to list
            </button>
          </div>
        </div>

        <div className="divider" />

        <label>
          Bulk import — one guest per line: <span style={{ textTransform: 'none' }}>Name, Phone, Category</span>
        </label>
        <textarea
          id="bulkText"
          rows={3}
          placeholder={`Tunde Bakare, 08031234567, VIP\nAmaka Chukwu, 08099998888, Regular`}
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
        />
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost" id="bulkImportBtn" onClick={handleBulkImport}>
            {importStatusMsg || 'Import list'}
          </button>
        </div>
      </div>

      {/* Guest Table Panel */}
      <div className="panel">
        <div className="toolbar">
          <input
            type="text"
            id="guestSearch"
            placeholder="Search by name, phone, or code…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            id="filterStatus"
            style={{ width: 'auto' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'in' | 'out')}
          >
            <option value="all">All statuses</option>
            <option value="in">Checked in</option>
            <option value="out">Not arrived</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Guest</th>
              <th>Category</th>
              <th>Code</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody id="guestTableBody">
            {filteredList.map((g) => (
              <tr key={g.id}>
                <td>
                  <b>{g.name}</b>
                  <br />
                  <span style={{ color: 'var(--text-faint)', fontSize: '11.5px' }}>
                    {g.phone || '—'}
                  </span>
                </td>
                <td>
                  <span className={`tag ${g.category === 'VIP' ? 'tag-vip' : 'tag-regular'}`}>
                    {g.category}
                  </span>
                </td>
                <td>
                  <span className="code-chip">{g.code}</span>
                </td>
                <td>
                  <span className={`status-pill ${g.status === 'in' ? 'in' : 'out'}`}>
                    {g.status === 'in' ? 'Checked in' : 'Not arrived'}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    {g.status === 'in' ? (
                      <button
                        className="btn btn-ghost btn-[#8B93A3] btn-sm"
                        onClick={() => undoCheckin(g.id)}
                      >
                        Undo
                      </button>
                    ) : (
                      <button
                        className="btn btn-go btn-sm"
                        onClick={() => checkInGuest(g.id)}
                      >
                        Check in
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeGuest(g.id)}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredList.length === 0 && (
          <div className="empty" id="guestEmptyState">
            No guests match your search.
          </div>
        )}
      </div>
    </section>
  );
};
