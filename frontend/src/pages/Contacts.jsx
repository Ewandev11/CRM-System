import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "", phone: "", company: "" });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [conRes, comRes] = await Promise.all([
                api.get('/api/v1/contacts/'),
                api.get('/api/v1/companies/')
            ]);
            setContacts(conRes.data.results || conRes.data);
            setCompanies(comRes.data.results || comRes.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.post('/api/v1/contacts/', formData);
            setFormData({ first_name: "", last_name: "", email: "", phone: "", company: "" });
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.email || err.response?.data?.non_field_errors || "Submission failed";
            setError(Array.isArray(msg) ? msg[0] : msg);
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                <h2>Contact Management</h2>
                {error && <div style={{background: '#e74c3c', color: 'white', padding: '10px', marginBottom: '10px'}}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={{background: '#f4f4f4', padding: '20px', marginBottom: '20px'}}>
                    <input placeholder="First Name" required onChange={e => setFormData({...formData, first_name: e.target.value})} />
                    <input placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} />
                    <select required onChange={e => setFormData({...formData, company: e.target.value})}>
                        <option value="">Select Company</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button type="submit">Add Contact</button>
                </form>

                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead style={{background: '#eee'}}>
                        <tr><th>Name</th><th>Email</th><th>Company</th></tr>
                    </thead>
                    <tbody>
                        {contacts.map(c => (
                            <tr key={c.id}>
                                <td>{c.first_name} {c.last_name}</td>
                                <td>{c.email}</td>
                                <td>{c.company_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Contacts;