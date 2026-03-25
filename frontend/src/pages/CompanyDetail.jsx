import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const CompanyDetail = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state for adding a contact directly to this company
    const [newContact, setNewContact] = useState({ first_name: "", last_name: "", email: "", phone: "" });
    const [error, setError] = useState("");

    const fetchDetails = async () => {
        try {
            // Using versioned API paths /api/v1/
            const compRes = await api.get(`/api/v1/companies/${id}/`);
            const contRes = await api.get(`/api/v1/contacts/?company=${id}`);
            
            setCompany(compRes.data);
            // Handle DRF pagination results key
            setContacts(contRes.data.results || contRes.data);
        } catch (err) { 
            console.error("Error fetching details", err); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleAddContact = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.post('/api/v1/contacts/', { ...newContact, company: id });
            setNewContact({ first_name: "", last_name: "", email: "", phone: "" });
            fetchDetails(); // Refresh nested list
        } catch (err) {
            const msg = err.response?.data?.email || "Failed to add contact.";
            setError(Array.isArray(msg) ? msg[0] : msg);
        }
    };

    if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Company Profile...</div>;
    if (!company) return <div style={{padding: '50px', textAlign: 'center'}}>Company not found.</div>;

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
                {/* COMPANY HEADER */}
                <div style={styles.header}>
                    {company.logo ? (
                        <img src={company.logo} alt="logo" style={styles.logo} />
                    ) : (
                        <div style={styles.logoPlaceholder}>No Logo</div>
                    )}
                    <div>
                        <h1 style={{ margin: 0, color: '#2c3e50' }}>{company.name}</h1>
                        <p style={{ color: '#7f8c8d' }}>
                            <strong>Industry:</strong> {company.industry} | <strong>Country:</strong> {company.country}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginTop: '30px' }}>
                    
                    {/* LEFT: ADD CONTACT FORM (Nested Management Requirement) */}
                    <div>
                        <h3>Add Contact</h3>
                        {error && <p style={{color: 'red', fontSize: '0.8rem'}}>{error}</p>}
                        <form onSubmit={handleAddContact} style={styles.miniForm}>
                            <input type="text" placeholder="First Name" required style={styles.input}
                                value={newContact.first_name} onChange={e => setNewContact({...newContact, first_name: e.target.value})} />
                            <input type="text" placeholder="Last Name" required style={styles.input}
                                value={newContact.last_name} onChange={e => setNewContact({...newContact, last_name: e.target.value})} />
                            <input type="email" placeholder="Email" required style={styles.input}
                                value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} />
                            <button type="submit" style={styles.btn}>Add to {company.name}</button>
                        </form>
                    </div>

                    {/* RIGHT: CONTACTS TABLE */}
                    <div>
                        <h3>Contacts at this Company</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr style={{ textAlign: 'left', background: '#f4f4f4' }}>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.length > 0 ? contacts.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={styles.td}>{c.first_name} {c.last_name}</td>
                                        <td style={styles.td}>{c.email}</td>
                                        <td style={styles.td}>{c.phone || 'N/A'}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" style={styles.td}>No contacts found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    header: { display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '2px solid #eee', paddingBottom: '20px' },
    logo: { width: '100px', height: '100px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #ddd' },
    logoPlaceholder: { width: '100px', height: '100px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#999' },
    miniForm: { display: 'flex', flexDirection: 'column', gap: '10px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' },
    input: { padding: '8px', borderRadius: '4px', border: '1px solid #ddd' },
    btn: { padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', border: '1px solid #eee' },
    th: { padding: '12px', borderBottom: '2px solid #ddd' },
    td: { padding: '12px', borderBottom: '1px solid #eee' }
};

export default CompanyDetail;