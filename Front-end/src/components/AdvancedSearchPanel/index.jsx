import React, { useMemo, useState } from 'react';
import './style.css';

// AdvancedSearchPanel: lightweight panel listing key queries with a filter box
function AdvancedSearchPanel({ onNavigate, onClose }) {
    const [filter, setFilter] = useState('');

    const items = useMemo(() => ([
        { id: 'policiesByGender', label: 'Find Policies by Customer Gender' },
        { id: 'policiesByDateRange', label: 'Find Policies by Date Range' },
        { id: 'customersByPolicyType', label: 'Find Customers by Policy Type' },
    ]), []);

    const filtered = useMemo(() => {
        const q = filter.trim().toLowerCase();
        if (!q) return items;
        return items.filter(i => i.label.toLowerCase().includes(q));
    }, [filter, items]);

    const handleItemClick = (id) => {
        // Navigate to query interface; users can fill parameters there
        onNavigate('query-interface');
        if (onClose) onClose();
    };

    return (
        <div className="adv-search-panel" role="dialog" aria-modal="true">
            <div className="adv-search-header">
                <input
                    type="text"
                    placeholder="Filter queries..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="adv-search-input"
                    autoFocus
                />
                <button className="adv-search-close" onClick={onClose} aria-label="Close">×</button>
            </div>
            <div className="adv-search-list">
                {filtered.map(item => (
                    <button key={item.id} className="adv-search-item" onClick={() => handleItemClick(item.id)}>
                        {item.label}
                    </button>
                ))}
                {filtered.length === 0 && (
                    <div className="adv-search-empty">No results found. Please try a different search term.</div>
                )}
            </div>
        </div>
    );
}

export default AdvancedSearchPanel;


