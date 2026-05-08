import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../components';

// Demo users - same as AlumniDirectoryPage
const DEMO_USERS = [
  {
    _id: 'user1',
    name: 'Jane Mwangi',
    email: 'jane.mwangi@email.com',
    bio: 'Full-stack developer passionate about building scalable web applications. IYF Academy Cohort 3 graduate with experience in React, Node.js, and cloud infrastructure. Currently working at TechCorp Nairobi and mentoring junior developers in my free time.',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS', 'Docker'],
    courses: ['Web Development Fundamentals', 'Advanced JavaScript', 'Cloud Computing Basics', 'UI/UX Design Principles'],
    cohort: 'Cohort 3 (2024)',
    location: 'Nairobi, Kenya',
    role: 'Software Engineer',
  },
  {
    _id: 'user2',
    name: 'Peter Ochieng',
    email: 'peter.ochieng@email.com',
    bio: 'Backend engineer specializing in distributed systems and cloud architecture. Former Andela fellow with a passion for mentoring the next generation of developers.',
    skills: ['Python', 'Go', 'Kubernetes', 'AWS', 'PostgreSQL'],
    courses: ['Backend Development', 'System Design', 'Cloud Architecture'],
    cohort: 'Cohort 2 (2023)',
    location: 'Kisumu, Kenya',
    role: 'Senior Backend Engineer',
  },
  {
    _id: 'user3',
    name: 'Grace Wanjiku',
    email: 'grace.wanjiku@email.com',
    bio: 'Mobile developer with a passion for fintech. Building apps that make financial services accessible to everyone across Africa.',
    skills: ['Flutter', 'Dart', 'Firebase', 'Android', 'iOS'],
    courses: ['Mobile Development', 'Flutter Advanced', 'Firebase Mastery'],
    cohort: 'Cohort 4 (2025)',
    location: 'Nairobi, Kenya',
    role: 'Mobile Developer',
  },
  {
    _id: 'user4',
    name: 'Adebola Smith',
    email: 'adebola.smith@email.com',
    bio: 'UX designer and frontend developer. I believe great design is invisible and great code is poetry. Creating delightful user experiences one pixel at a time.',
    skills: ['Figma', 'React', 'CSS', 'UI/UX', 'Prototyping'],
    courses: ['Design Thinking', 'Frontend Mastery', 'User Research'],
    cohort: 'Cohort 3 (2024)',
    location: 'Lagos, Nigeria',
    role: 'UX Engineer',
  },
  {
    _id: 'user5',
    name: 'Samuel Kimani',
    email: 'samuel.kimani@email.com',
    bio: 'DevOps engineer automating everything that moves. CI/CD pipelines, infrastructure as code, monitoring, and keeping systems running 24/7.',
    skills: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'Jenkins', 'Linux'],
    courses: ['DevOps Fundamentals', 'Cloud Infrastructure', 'System Administration'],
    cohort: 'Cohort 1 (2022)',
    location: 'Nairobi, Kenya',
    role: 'DevOps Engineer',
  },
  {
    _id: 'user6',
    name: 'Agnes Mutua',
    email: 'agnes.mutua@email.com',
    bio: 'Data scientist turning raw data into actionable insights. Machine learning enthusiast and mentor to aspiring data professionals.',
    skills: ['Python', 'TensorFlow', 'SQL', 'Pandas', 'Data Visualization'],
    courses: ['Data Science', 'Machine Learning', 'Statistics for Data Science'],
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
    courses: ['Full-Stack Development', 'API Design', 'Database Systems'],
    cohort: 'Cohort 3 (2024)',
    location: 'Nakuru, Kenya',
    role: 'Integration Engineer',
  },
  {
    _id: 'user8',
    name: 'Cheryl Achieng',
    email: 'cheryl.achieng@email.com',
    bio: 'Backend developer building robust APIs and database systems. Clean code advocate and thorough code reviewer.',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Microservices'],
    courses: ['Java Enterprise', 'Database Design', 'Software Architecture'],
    cohort: 'Cohort 2 (2023)',
    location: 'Nairobi, Kenya',
    role: 'Backend Developer',
  }
];

const PublicProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connectionCount] = useState(() => 
    Math.floor(Math.random() * 10) + 1
  );

  useEffect(() => {
    const loadUser = async () => {
      try {
        // TODO: Replace with real API call
        // const token = localStorage.getItem('token');
        // const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // if (!res.ok) throw new Error('NOT_FOUND');
        // const data = await res.json();

        await new Promise(resolve => setTimeout(resolve, 600));

        const found = DEMO_USERS.find(u => u._id === id);
        if (!found) {
          throw new Error('NOT_FOUND');
        }
        setUser(found);
      } catch (err) {
        if (err.message === 'NOT_FOUND') {
          setError('NOT_FOUND');
        } else {
          setError('Failed to load user profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="detail-page">
            <div className="skeleton" style={{ width: '120px', height: '20px', marginBottom: '24px' }} />
            <div className="skeleton" style={{ width: '60%', height: '40px', marginBottom: '16px' }} />
            <div className="skeleton" style={{ width: '40%', height: '20px', marginBottom: '32px' }} />
            <div className="skeleton" style={{ width: '100%', height: '300px' }} />
          </div>
        </div>
      </div>
    );
  }

  // 404 Not Found
  if (error === 'NOT_FOUND') {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h2 className="empty-state-title">User Not Found</h2>
            <p className="empty-state-description">
              This user could not be found or may have been removed.
            </p>
            <Button
              label="← Back to Directory"
              variant="primary"
              onClick={() => navigate('/directory')}
            />
          </div>
        </div>
      </div>
    );
  }

  // API Error
  if (error) {
    return (
      <div className="page-wrapper">
        <div className="container">
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
              label="← Back to Directory"
              variant="secondary"
              onClick={() => navigate('/directory')}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="profile-page animate-fade-in">
          {/* Back Button */}
          <Button
            label="← Back to Directory"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/directory')}
            className="detail-back-btn"
          />

          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar-large">
              <span>{getInitials(user.name)}</span>
            </div>

            <div className="profile-header-info">
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-role">{user.role}</p>
              <div className="profile-meta">
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {user.location}
                </span>
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {user.email}
                </span>
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  {user.cohort}
                </span>
              </div>
            </div>

            <Button
              label="Connect"
              variant="primary"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              }
              onClick={() => alert('Connect feature coming soon!')}
            />
          </div>

          {/* Profile Grid */}
          <div className="profile-grid">
            <Card title="About" variant="elevated">
              <p className="profile-bio">{user.bio}</p>
            </Card>

            <Card title="Skills" variant="elevated">
              <div className="profile-skills">
                {user.skills.map((skill, index) => (
                  <Badge key={index} variant="yellow">{skill}</Badge>
                ))}
              </div>
            </Card>

            <Card title="Courses Completed" variant="elevated">
              <ul className="profile-courses">
                {user.courses?.map((course, index) => (
                  <li key={index}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {course}
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Activity" variant="elevated">
              <div className="profile-stats">
                <div className="profile-stat">
                  <span className="profile-stat-value">{user.skills.length}</span>
                  <span className="profile-stat-label">Skills</span>
                </div>
                <div className="profile-stat">
                    <span className="profile-stat-value">{connectionCount}</span>
                    <span className="profile-stat-label">Connections</span>
                </div>
                <div className="profile-stat">
                    <span className="profile-stat-value">{connectionCount}</span>
                    <span className="profile-stat-label">Connections</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;