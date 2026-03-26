import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const CompanyDetail = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newContact, setNewContact] = useState({ 
        first_name: "", 
        last_name: "", 
        email: "", 
        phone: "" 
    });
    const [error, setError] = useState("");

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const [compRes, contRes] = await Promise.all([
                api.get(`/companies/${id}/`),
                api.get(`/contacts/?company=${id}`)
            ]);
            setCompany(compRes.data);
            setContacts(contRes.data.results || contRes.data);
        } catch (err) { 
            console.error("Failed to fetch company details:", err);
            setError("Failed to load company data.");
        } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchDetails(); }, [id]);

    const handleAddContact = async (e) => {
        e.preventDefault();
        setError("");
        try {
           
            await api.post('/contacts/', { 
                ...newContact, 
                company: Number(id) 
            });
            
            setNewContact({ first_name: "", last_name: "", email: "", phone: "" });
            fetchDetails();
        } catch (err) {
            const msg = err.response?.data?.email || err.response?.data?.non_field_errors || "Failed to add contact.";
            setError(Array.isArray(msg) ? msg[0] : msg);
        }
    };

    if (loading) return <div style={loaderStyle}>Loading Company Profile...</div>;
    if (!company) return <div style={loaderStyle}>Company not found.</div>;

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* Profile Header */}
                <div style={headerCardStyle}>
                    <div style={logoBoxStyle}>
                        {company.logo_url ? (
                            <img src={company.logo_url} alt="logo" style={logoImgStyle} />
                        ) : (
                            <span style={{color: '#94a3b8'}}>No Logo</span>
                        )}
                    </div>
                    <div style={{flex: 1}}>
                        <h1 style={{ margin: 0, color: '#1e293b', fontSize: '32px' }}>{company.name}</h1>
                        <div style={metaGridStyle}>
                            <p><strong>Industry:</strong> {company.industry || 'N/A'}</p>
                            <p><strong>Country:</strong> {company.country || 'N/A'}</p>
                            {company.website && (
                                <p><strong>Website:</strong> <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" style={{color: '#2563eb'}}>Visit Site</a></p>
                            )}
                        </div>
                    </div>
                </div>

                <div style={layoutGridStyle}>
                    {/* Add Contact Sidebar */}
                    <aside style={sidebarStyle}>
                        <h3 style={{ marginTop: 0, color: '#334155' }}>Add New Contact</h3>
                        {error && <p style={{ color: '#ef4444', fontSize: '13px', background: '#fee2e2', padding: '8px', borderRadius: '6px' }}>{error}</p>}
                        <form onSubmit={handleAddContact} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input 
                                style={sidebarInput} 
                                placeholder="First Name" 
                                required 
                                value={newContact.first_name} 
                                onChange={e => setNewContact({...newContact, first_name: e.target.value})} 
                            />
                            <input 
                                style={sidebarInput} 
                                placeholder="Last Name" 
                                required 
                                value={newContact.last_name} 
                                onChange={e => setNewContact({...newContact, last_name: e.target.value})} 
                            />
                            <input 
                                style={sidebarInput} 
                                type="email" 
                                placeholder="Email Address" 
                                required 
                                value={newContact.email} 
                                onChange={e => setNewContact({...newContact, email: e.target.value})} 
                            />
                            <input 
                                style={sidebarInput} 
                                type="text" 
                                placeholder="Phone (8-15 digits)" 
                                pattern="\d{8,15}"
                                title="Phone must be 8-15 digits"
                                value={newContact.phone} 
                                onChange={e => setNewContact({...newContact, phone: e.target.value})} 
                            />
                            <button type="submit" style={sidebarBtnStyle}>Add Contact</button>
                        </form>
                    </aside>

                    {/* Contact List */}
                    <section style={{ flex: 2 }}>
                        <div style={tableCardStyle}>
                            <h3 style={{ padding: '20px', margin: 0, borderBottom: '1px solid #f1f5f9', color: '#334155' }}>Associated Contacts</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f8fafc' }}>
                                    <tr>
                                        <th style={thStyle}>Full Name</th>
                                        <th style={thStyle}>Email</th>
                                        <th style={thStyle}>Phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.length > 0 ? contacts.map(c => (
                                        <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={tdStyle}><strong>{c.first_name} {c.last_name}</strong></td>
                                            <td style={tdStyle}>{c.email}</td>
                                            <td style={tdStyle}>{c.phone || '—'}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No contacts registered for this company.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

const loaderStyle = { padding: '100px', textAlign: 'center', color: '#64748b', fontSize: '18px' };
const headerCardStyle = { background: '#fff', padding: '30px', borderRadius: '16px', display: 'flex', gap: '30px', alignItems: 'center', border: '1px solid #e2e8f0', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const logoBoxStyle = { width: '120px', height: '120px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontWeight: 'bold', overflow: 'hidden', border: '1px solid #e2e8f0' };
const logoImgStyle = { width: '100%', height: '100%', objectFit: 'contain' };
const metaGridStyle = { display: 'flex', gap: '20px', marginTop: '10px', color: '#64748b', fontSize: '14px', flexWrap: 'wrap' };
const layoutGridStyle = { display: 'flex', gap: '30px', flexWrap: 'wrap' };
const sidebarStyle = { flex: 1, minWidth: '300px', background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content' };
const sidebarInput = { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', width: '100%', boxSizing: 'border-box' };
const sidebarBtnStyle = { padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' };
const tableCardStyle = { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' };
const thStyle = { padding: '16px 20px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', fontWeight: '600' };
const tdStyle = { padding: '16px 20px', fontSize: '14px', color: '#334155', textAlign: 'left' };

export default CompanyDetail;