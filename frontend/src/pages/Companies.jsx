import React, { useState, useEffect } from 'react';
import api from '../api/axios'; 
import Navbar from '../components/Navbar';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({ next: null, prev: null });
    
    // Form state
    const [formData, setFormData] = useState({ 
        name: '', 
        industry: '', 
        country: '', 
        website: '' 
    });

    const fetchCompanies = async (url = `/companies/?search=${search}`) => {
        setLoading(true);
        try {
            const response = await api.get(url);
            
            // Handle paginated response (DRF default)
            if (response.data.results) {
                setCompanies(response.data.results);
                setPagination({ 
                    next: response.data.next, 
                    prev: response.data.previous 
                });
            } else {
                // Handle non-paginated response (fallback)
                setCompanies(response.data);
                setPagination({ next: null, prev: null });
            }
        } catch (err) {
            console.error("Error fetching companies:", err);
            alert("Failed to load companies. Please check your connection or login status.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchCompanies(); 
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCompanies();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // ✅ FIX: Removed '/api/v1/' from the URL here as well.
            await api.post('/companies/', formData);
            
            // Reset form
            setFormData({ name: '', industry: '', country: '', website: '' });
            
            // Refresh list
            fetchCompanies(); 
            alert("Company added successfully!");
        } catch (err) {
            console.error("Creation failed", err);
            
            // Specific error handling for 403/401
            if (err.response?.status === 403) {
                alert("Permission denied. You may not have rights to create companies or your session expired.");
            } else if (err.response?.status === 401) {
                alert("Session expired. Please log in again.");
            } else {
                alert("Failed to create company.");
            }
        }
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* Add New Company Form */}
                <div style={formContainerStyle}>
                    <h3>Add New Company</h3>
                    <form onSubmit={handleSubmit} style={formGridStyle}>
                        <input 
                            style={inputStyle} 
                            placeholder="Company Name" 
                            required 
                            value={formData.name} 
                            onChange={e => setFormData({ ...formData, name: e.target.value })} 
                        />
                        <input 
                            style={inputStyle} 
                            placeholder="Industry" 
                            value={formData.industry} 
                            onChange={e => setFormData({ ...formData, industry: e.target.value })} 
                        />
                        <input 
                            style={inputStyle} 
                            placeholder="Country" 
                            value={formData.country} 
                            onChange={e => setFormData({ ...formData, country: e.target.value })} 
                        />
                        <input 
                            style={inputStyle} 
                            placeholder="Website" 
                            value={formData.website} 
                            onChange={e => setFormData({ ...formData, website: e.target.value })} 
                        />
                        <button type="submit" style={addBtnStyle}>Add Company</button>
                    </form>
                </div>

                {/* Search Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '24px', color: '#2c3e50', margin: 0 }}>Company Management</h2>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            placeholder="Search by name or country..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={searchInputStyle}
                        />
                        <button type="submit" style={buttonStyle}>Search</button>
                    </form>
                </div>

                {/* Companies Table */}
                <div style={tableCardStyle}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #edf2f7' }}>
                                <th style={thStyle}>Company Name</th>
                                <th style={thStyle}>Country</th>
                                <th style={thStyle}>Website</th>
                                <th style={thStyle}>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>Loading database...</td></tr>
                            ) : companies.length > 0 ? (
                                companies.map((company) => (
                                    <tr key={company.id} style={rowStyle} className="table-row">
                                        <td style={tdStyle}><strong>{company.name}</strong></td>
                                        <td style={tdStyle}>{company.country || '—'}</td>
                                        <td style={tdStyle}>
                                            {company.website ? (
                                                <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" style={{color: '#3498db', textDecoration: 'none'}}>
                                                    Visit Site
                                                </a>
                                            ) : '—'}
                                        </td>
                                        <td style={tdStyle}>
                                            {company.created_timestamp 
                                                ? new Date(company.created_timestamp).toLocaleDateString() 
                                                : '—'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button 
                        onClick={() => fetchCompanies(pagination.prev)} 
                        disabled={!pagination.prev} 
                        style={navBtnStyle(!!pagination.prev)}
                    >
                        ← Previous
                    </button>
                    <button 
                        onClick={() => fetchCompanies(pagination.next)} 
                        disabled={!pagination.next} 
                        style={navBtnStyle(!!pagination.next)}
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Styles ---
const formContainerStyle = { 
    background: '#fff', 
    padding: '24px', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0', 
    marginBottom: '30px', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
};

const formGridStyle = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
    gap: '15px' 
};

const inputStyle = { 
    padding: '10px 14px', 
    borderRadius: '8px', 
    border: '1px solid #cbd5e1', 
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box'
};

const addBtnStyle = { 
    padding: '10px', 
    background: '#2563eb', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    fontWeight: '600', 
    cursor: 'pointer',
    marginTop: '10px'
};

const searchInputStyle = { 
    padding: '10px 15px', 
    borderRadius: '8px', 
    border: '1px solid #d1d5db', 
    width: '280px', 
    outline: 'none' 
};

const buttonStyle = { 
    padding: '10px 20px', 
    backgroundColor: '#2c3e50', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer' 
};

const tableCardStyle = { 
    background: 'white', 
    borderRadius: '12px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
    overflow: 'hidden', 
    border: '1px solid #edf2f7' 
};

const thStyle = { 
    padding: '16px 20px', 
    color: '#64748b', 
    fontSize: '13px', 
    textTransform: 'uppercase', 
    letterSpacing: '0.5px' 
};

const tdStyle = { 
    padding: '16px 20px', 
    color: '#334155', 
    fontSize: '15px', 
    borderBottom: '1px solid #f1f5f9' 
};

const rowStyle = { transition: 'background 0.2s' };

const navBtnStyle = (active) => ({
    padding: '8px 16px', 
    borderRadius: '6px', 
    border: '1px solid #e2e8f0', 
    cursor: active ? 'pointer' : 'not-allowed',
    backgroundColor: active ? '#fff' : '#f8f9fa', 
    color: active ? '#1e293b' : '#94a3b8'
});

export default Companies;