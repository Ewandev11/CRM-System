// ... inside Companies component ...
const [pagination, setPagination] = useState({ next: null, prev: null });

const fetchCompanies = async (url = `/api/v1/companies/?search=${search}`) => {
    setLoading(true);
    try {
        const response = await api.get(url);
        // DRF returns data in 'results' when pagination is on
        setCompanies(response.data.results || response.data);
        setPagination({
            next: response.data.next,
            prev: response.data.previous
        });
    } catch (err) { 
        console.error("Fetch error:", err); 
    } finally {
        setLoading(false);
    }
};

// ... Inside your JSX, below the </table> ...
<div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
    <button 
        onClick={() => fetchCompanies(pagination.prev)} 
        disabled={!pagination.prev}
        style={{ padding: '8px 16px', cursor: pagination.prev ? 'pointer' : 'not-allowed' }}
    >
        ← Previous
    </button>
    <button 
        onClick={() => fetchCompanies(pagination.next)} 
        disabled={!pagination.next}
        style={{ padding: '8px 16px', cursor: pagination.next ? 'pointer' : 'not-allowed' }}
    >
        Next →
    </button>
</div>