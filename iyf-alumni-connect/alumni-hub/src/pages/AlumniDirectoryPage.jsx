import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '../components';

// Demo users - replace with API call when Cheryl's backend is ready
const DEMO_USERS = [
  {
    _id: 'user1',
    name: 'Jane Mwangi',
    email: 'jane.mwangi@email.com',
    bio: 'Full-stack developer passionate about building scalable web applications. IYF Academy Cohort 3 graduate.',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS', 'Docker'],
    cohort: 'Cohort 3 (2024)',
    location: 'Nairobi, Kenya',
    role: 'Software Engineer',
  },
  {
    _id: 'user2',
    name: 'Peter Ochieng',
    email: 'peter.ochieng@email.com',
    bio: 'Backend engineer specializing in distributed systems and cloud architecture. Former Andela fellow.',
    skills: ['Python', 'Go', 'Kubernetes', 'AWS', 'PostgreSQL'],
    cohort: 'Cohort 2 (2023)',
    location: 'Kisumu, Kenya',
    role: 'Senior Backend Engineer',
  },
  {
    _id: 'user3',
    name: 'Grace Wanjiku',
    email: 'grace.wanjiku@email.com',
    bio: 'Mobile developer with a passion for fintech. Building apps that make financial services accessible.',
    skills: ['Flutter', 'Dart', 'Firebase', 'Android', 'iOS'],
    cohort: 'Cohort 4 (2025)',
    location: 'Nairobi, Kenya',
    role: 'Mobile Developer',
  },
  {
    _id: 'user4',
    name: 'Adebola Smith',
    email: 'adebola.smith@email.com',
    bio: 'UX designer and frontend developer. I believe great design is invisible and great code is poetry.',
    skills: ['Figma', 'React', 'CSS', 'UI/UX', 'Prototyping'],
    cohort: 'Cohort 3 (2024)',
    location: 'Lagos, Nigeria',
    role: 'UX Engineer',
  },
  {
    _id: 'user5',
    name: 'Samuel Kimani',
    email: 'samuel.kimani@email.com',
    bio: 'DevOps engineer automating everything that moves. CI/CD pipelines, infrastructure as code, monitoring.',
    skills: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'Jenkins', 'Linux'],
    cohort: 'Cohort 1 (2022)',
    location: 'Nairobi, Kenya',
    role: 'DevOps Engineer',
  },
  {
    _id: 'user6',
    name: 'Agnes Mutua',
    email: 'agnes.mutua@email.com',
    bio: 'Data scientist turning raw data into actionable insights. Machine learning enthusiast and mentor.',
    skills: ['Python', 'TensorFlow', 'SQL', 'Pandas', 'Data Visualization'],
    cohort: 'Cohort 2 (2023)',
    location: 'Mombasa, Kenya',
    role: 'Data Scientist',
  },
  {
    _id: 'user7',
    name: 'Dennis Okoth',
    email: 'dennis.okoth@email.com',
    bio: 'Full-stack developer with a focus on integration and API design. Connecting systems that speak different languages.',
    skills: ['Node.js', 'Express', 'GraphQL', 'MongoDB', 'React'],
    cohort: 'Cohort 3 (2024)',
    location: 'Nakuru, Kenya',
    role: 'Integration Engineer',
  },
  {
    _id: 'user8',
    name: 'Cheryl Achieng',
    email: 'cheryl.achieng@email.com',
    bio: 'Backend developer building robust APIs and database systems. Clean code advocate and code reviewer.',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Microservices'],
    cohort: 'Cohort 2 (2023)',
    location: 'Nairobi, Kenya',
    role: 'Backend Developer',
  }
];

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
        // TODO: Replace with real API call
        // const token = localStorage.getItem('token');
        // const res = await fetch('http://localhost:5000/api/users', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // if (!res.ok) throw new Error('Failed to load users');
        // const data = await res.json();

        await new Promise(resolve => setTimeout(resolve, 800));
        setUsers(DEMO_USERS);
      } catch  {
        setError('Could not load alumni directory. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filter users by name or skill
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.location.toLowerCase().includes(term) ||
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
            Connect with fellow IYF Academy graduates. Search by name, role, location, or skills.
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
              placeholder="Search by name, role, location, or skill..."
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
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {user.location}
                    </span>
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