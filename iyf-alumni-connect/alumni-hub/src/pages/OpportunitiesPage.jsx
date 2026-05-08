import { useState, useEffect } from  'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';
import OpportunityCard from '../components/OpportunityCard';

// Hardcoded demo data - replace with API call when Ian's backend is ready
const DEMO_OPPORTUNITIES = [
  {
    _id: '1',
    title: 'Frontend Developer Intern',
    company: 'TechCorp Nairobi',
    location: 'Nairobi, Kenya',
    type: 'Internship',
    description: 'We are looking for a passionate frontend developer intern to join our growing team. You will work with React, TypeScript, and modern CSS frameworks to build beautiful user interfaces for our clients.',
    deadline: '2026-05-15',
    contactInfo: 'hr@techcorp.co.ke',
    applicationLink: 'https://techcorp.co.ke/careers',
    postedBy: { name: 'Jane Mwangi' }
  },
  {
    _id: '2',
    title: 'Senior Software Engineer',
    company: 'Andela',
    location: 'Remote',
    type: 'Job',
    description: 'Join our distributed engineering team working with Fortune 500 companies. We need experienced engineers who can lead projects and mentor junior developers.',
    deadline: '2026-06-30',
    contactInfo: 'talent@andela.com',
    applicationLink: 'https://andela.com/jobs',
    postedBy: { name: 'Peter Ochieng' }
  },
  {
    _id: '3',
    title: 'Alumni Networking Event',
    company: 'IYF Academy',
    location: 'Virtual',
    type: 'Announcement',
    description: 'Join us for our quarterly virtual networking event where alumni from all cohorts come together to share experiences, discuss industry trends, and build meaningful connections.',
    deadline: '2026-05-10',
    contactInfo: 'events@iyf.academy',
    postedBy: { name: 'Admin Team' }
  },
  {
    _id: '4',
    title: 'Backend Developer',
    company: 'Safaricom',
    location: 'Nairobi, Kenya',
    type: 'Job',
    description: 'Build scalable microservices and APIs that power Kenya\'s leading telecommunications platform. Experience with Node.js, Python, and cloud infrastructure required.',
    deadline: '2026-07-20',
    contactInfo: 'careers@safaricom.co.ke',
    applicationLink: 'https://safaricom.co.ke/careers',
    postedBy: { name: 'Grace Wanjiku' }
  },
  {
    _id: '5',
    title: 'UX Design Internship',
    company: 'Flutterwave',
    location: 'Lagos, Nigeria (Remote)',
    type: 'Internship',
    description: 'Learn from experienced UX designers while contributing to real fintech products. You will conduct user research, create wireframes, and collaborate with engineers.',
    deadline: '2026-05-08',
    contactInfo: 'design@flutterwave.com',
    postedBy: { name: 'Adebola Smith' }
  },
  {
    _id: '6',
    title: 'Mentorship Program Launch',
    company: 'IYF Alumni Network',
    location: 'Online',
    type: 'Announcement',
    description: 'We are excited to announce our new mentorship program connecting experienced alumni with recent graduates. Sign up to be a mentor or mentee and help shape the next generation of tech leaders.',
    deadline: '2026-06-01',
    contactInfo: 'mentorship@iyf.academy',
    postedBy: { name: 'Connie (Project Lead)' }
  }
];

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="card opportunity-card">
      <div className="skeleton" style={{ width: '80px', height: '24px', marginBottom: '12px', borderRadius: '9999px' }} />
      <div className="skeleton" style={{ width: '70%', height: '24px', marginBottom: '8px' }} />
      <div className="skeleton" style={{ width: '50%', height: '16px', marginBottom: '12px' }} />
      <div className="skeleton" style={{ width: '40%', height: '16px', marginBottom: '16px' }} />
      <div className="skeleton" style={{ width: '100%', height: '60px', marginBottom: '16px' }} />
      <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '8px' }} />
    </div>
  );

const OpportunitiesPage = () => {
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Fetch opportunities - currently using demo data, swap for API when ready
  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        // TODO: Replace with real API call when Ian's backend is ready
        // const token = localStorage.getItem('token');
        // const res = await fetch('http://localhost:5000/api/opportunities', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // if (!res.ok) throw new Error('Failed to load opportunities');
        // const data = await res.json();

        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setOpportunities(DEMO_OPPORTUNITIES);
      } catch  {
        setError('Could not load opportunities. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadOpportunities();
  }, []);

  // Combined filter logic - keyword AND type
  const filtered = opportunities.filter(opp => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      opp.title.toLowerCase().includes(term) ||
      opp.company.toLowerCase().includes(term) ||
      opp.location.toLowerCase().includes(term) ||
      opp.description.toLowerCase().includes(term);

    const matchesType = typeFilter === 'All' || opp.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Page Header */}
        <div className="section-header">
          <h1 className="section-title">Opportunities Board</h1>
          <p className="section-description">
            Discover jobs, internships, and announcements shared by the IYF alumni community.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="filter-search-icon">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="input-field"
              placeholder="Search by title, company, or keyword..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-type">
            <select
              className="input-field"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Job">Jobs</option>
              <option value="Internship">Internships</option>
              <option value="Announcement">Announcements</option>
            </select>
          </div>

          <Button
            label="Post Opportunity"
            variant="primary"
            size="sm"
            onClick={() => navigate('/opportunities/create')}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }
          />
        </div>

        {/* Results Count */}
        {!loading && !error && (
          <p className="results-count">
            Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'opportunity' : 'opportunities'}
            {searchTerm && ` for "${searchTerm}"`}
            {typeFilter !== 'All' && ` in ${typeFilter}`}
          </p>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid-cards stagger-children">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Error State */}
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
            <Button
              label="Try Again"
              variant="secondary"
              onClick={() => window.location.reload()}
            />
          </div>
        )}

        {/* Empty State - No opportunities at all */}
        {!loading && !error && opportunities.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h2 className="empty-state-title">No opportunities yet</h2>
            <p className="empty-state-description">
              Be the first to post an opportunity for the community!
            </p>
            <Button
              label="Post an Opportunity"
              variant="primary"
              onClick={() => navigate('/opportunities/create')}
            />
          </div>
        )}

        {/* Empty State - No filter matches */}
        {!loading && !error && opportunities.length > 0 && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h2 className="empty-state-title">No matches found</h2>
            <p className="empty-state-description">
              No opportunities match your search criteria. Try adjusting your filters.
            </p>
            <Button
              label="Clear Filters"
              variant="secondary"
              onClick={() => { setSearchTerm(''); setTypeFilter('All'); }}
            />
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid-cards stagger-children">
            {filtered.map(opp => (
              <OpportunityCard
                key={opp._id}
                opportunity={opp}
                onView={() => navigate(`/opportunities/${opp._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesPage;