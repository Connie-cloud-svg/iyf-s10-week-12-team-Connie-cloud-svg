import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '../components';

const SkeletonCard = () => (
  <div className="card opportunity-card">
    <div className="opportunity-card-header">
      <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ width: '70%', height: '20px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ width: '50%', height: '16px' }} />
      </div>
    </div>
    <div className="skeleton" style={{ width: '100%', height: '60px', marginTop: '12px' }} />
    <div className="skeleton" style={{ width: '60%', height: '20px', marginTop: '12px' }} />
  </div>
);

const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Please log in to view opportunities.');
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:5000/api/opportunities', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to load opportunities: ${res.status}`);
        }

        const data = await res.json();
        setOpportunities(data);
      } catch (err) {
        setError(err.message || 'Could not load opportunities. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadOpportunities();
  }, []);

  const typeColors = {
    Job: 'blue',
    Internship: 'green',
    Announcement: 'yellow',
  };

  const filtered = opportunities.filter(opp => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      opp.title.toLowerCase().includes(term) ||
      opp.company.toLowerCase().includes(term) ||
      opp.location.toLowerCase().includes(term);
    const matchesType = filterType === 'All' || opp.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatDeadline = (deadline) => {
    if (!deadline) return 'No deadline';
    const date = new Date(deadline);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const isUrgent = (deadline) => {
    if (!deadline) return false;
    const date = new Date(deadline);
    return (date - new Date()) < 7 * 24 * 60 * 60 * 1000 && date > new Date();
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title">Opportunities</h1>
          <p className="section-description">
            Jobs, internships, and announcements shared by the IYF alumni community.
          </p>
        </div>

        <div className="filter-bar">
          <div className="filter-search" style={{ flex: 1, maxWidth: '400px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="filter-search-icon">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="input-field"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            {['All', 'Job', 'Internship', 'Announcement'].map(type => (
              <button
                key={type}
                className={`filter-btn ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="grid-cards-compact stagger-children">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {error && !loading && (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ color: 'var(--color-danger)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="empty-state-title">Something went wrong</h2>
            <p className="empty-state-description">{error}</p>
            <Button label="Try Again" variant="secondary" onClick={() => window.location.reload()} />
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h2 className="empty-state-title">No opportunities found</h2>
            <p className="empty-state-description">
              {searchTerm || filterType !== 'All'
                ? 'Try adjusting your search or filters.'
                : 'No opportunities posted yet. Check back soon!'}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid-cards-compact stagger-children">
            {filtered.map(opp => (
              <Link key={opp._id} to={`/opportunities/${opp._id}`} className="opportunity-card-link">
                <Card variant="elevated" className="opportunity-card">
                  <div className="opportunity-card-header">
                    <div className="opportunity-icon">
                      {opp.type === 'Job' && '💼'}
                      {opp.type === 'Internship' && '🎓'}
                      {opp.type === 'Announcement' && '📢'}
                    </div>
                    <div className="opportunity-card-info">
                      <h3 className="opportunity-title">{opp.title}</h3>
                      <p className="opportunity-company">{opp.company}</p>
                    </div>
                    <Badge variant={typeColors[opp.type] || 'outline'}>{opp.type}</Badge>
                  </div>

                  <p className="opportunity-description">
                    {opp.description.length > 120 ? opp.description.slice(0, 120) + '...' : opp.description}
                  </p>

                  <div className="opportunity-meta">
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {opp.location}
                    </span>
                    <span className={isUrgent(opp.deadline) ? 'deadline-urgent' : ''}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {formatDeadline(opp.deadline)}
                      {isUrgent(opp.deadline) && <span className="urgency-badge">Soon</span>}
                    </span>
                  </div>

                  <div className="opportunity-footer">
                    <span className="opportunity-poster">
                      Posted by {opp.postedBy?.name || 'Unknown'}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesPage;