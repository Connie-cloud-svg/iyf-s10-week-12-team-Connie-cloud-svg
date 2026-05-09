import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '../components';

// Skeleton card
const SkeletonCard = () => (
    <div className="card alumni-card">
      <div className="alumni-card-header">
        <div className="skeleton" style={{ width: '56px', height: '56px', borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ width: '60%', height: '20px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '40%', height: '16px' }} />
        </div>
      </div>
      <div className="skeleton" style={{ width: '100%', height: '60px', marginTop: '12px' }} />
      <div className="skeleton" style={{ width: '80%', height: '20px', marginTop: '12px', borderRadius: '9999px' }} />
    </div>
  );

const AlumniDirectoryPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Please log in to view the alumni directory.');
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to load users: ${res.status}`);
        }

        const data = await res.json();

        // Map backend data to frontend format (backend has no role/location yet)
        const mappedUsers = data.map(user => ({
          _id: user._id,
          name: user.name,
          bio: user.bio || 'No bio yet.',
          skills: user.skills || [],
          cohort: user.cohort || 'Not specified',
          role: user.role || 'IYF Alumni',
          location: 'Not specified', // Add to backend later if needed
          profilePhoto: user.profilePhoto
        }));

        setUsers(mappedUsers);
      } catch (err) {
        setError(err.message || 'Could not load alumni directory. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filter users by name, role, or skill
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.cohort.toLowerCase().includes(term) ||
      user.skills.some(skill => skill.toLowerCase().includes(term))
    );
  });

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Page Header */}
        <div className="section-header">
          <h1 className="section-title">Alumni Directory</h1>
          <p className="section-description">
            Connect with fellow IYF Academy graduates. Search by name, role, or skills.
          </p>
        </div>

        {/* Search Bar */}
        <div className="filter-bar">
          <div className="filter-search" style={{ flex: 1, maxWidth: '500px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="filter-search-icon">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="input-field"
              placeholder="Search by name, role, or skill..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <p className="results-count" style={{ margin: 0 }}>
            <strong>{filteredUsers.length}</strong> {filteredUsers.length === 1 ? 'alumnus' : 'alumni'}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid-cards-compact stagger-children">
            <SkeletonCard />
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
            <Button label="Try Again" variant="secondary" onClick={() => window.location.reload()} />
          </div>
        )}

        {/* Empty State - No users */}
        {!loading && !error && users.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h2 className="empty-state-title">No alumni yet</h2>
            <p className="empty-state-description">The directory is empty. Check back soon!</p>
          </div>
        )}

        {/* Empty State - No search matches */}
        {!loading && !error && users.length > 0 && filteredUsers.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h2 className="empty-state-title">No matches found</h2>
            <p className="empty-state-description">
              No alumni match your search criteria. Try different keywords.
            </p>
            <Button label="Clear Search" variant="secondary" onClick={() => setSearchTerm('')} />
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="grid-cards-compact stagger-children">
            {filteredUsers.map(user => (
              <Link
                key={user._id}
                to={`/users/${user._id}`}
                className="alumni-card-link"
              >
                <Card variant="yellowGlow" className="alumni-card">
                  <div className="alumni-card-header">
                    <div className="alumni-avatar">
                      {getInitials(user.name)}
                    </div>
                    <div className="alumni-card-info">
                      <h3 className="alumni-name">{user.name}</h3>
                      <p className="alumni-role">{user.role}</p>
                    </div>
                  </div>

                  <p className="alumni-bio">
                    {user.bio.length > 100 ? user.bio.slice(0, 100) + '...' : user.bio}
                  </p>

                  <div className="alumni-meta">
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      {user.cohort}
                    </span>
                  </div>

                  <div className="alumni-skills">
                    {user.skills.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="alumni-skill-badge">{skill}</Badge>
                    ))}
                    {user.skills.length > 3 && (
                      <Badge variant="outline">+{user.skills.length - 3}</Badge>
                    )}
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

export default AlumniDirectoryPage;