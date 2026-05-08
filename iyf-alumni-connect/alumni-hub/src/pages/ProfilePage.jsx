import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../components';

// Demo user data - replace with API call when Cheryl's backend is ready
const DEMO_USER = {
  _id: 'user1',
  name: 'Jane Mwangi',
  email: 'jane.mwangi@email.com',
  bio: 'Full-stack developer passionate about building scalable web applications. IYF Academy Cohort 3 graduate with experience in React, Node.js, and cloud infrastructure. Currently working at TechCorp Nairobi and mentoring junior developers in my free time.',
  skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS', 'Docker'],
  courses: ['Web Development Fundamentals', 'Advanced JavaScript', 'Cloud Computing Basics', 'UI/UX Design Principles'],
  cohort: 'Cohort 3 (2024)',
  location: 'Nairobi, Kenya',
  role: 'Software Engineer',
  avatar: null
};

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // TODO: Replace with real API call when Cheryl's backend is ready
        // const token = localStorage.getItem('token');
        // const res = await fetch('http://localhost:5000/api/users/me', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // if (!res.ok) throw new Error('Failed to load profile');
        // const data = await res.json();

        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 700));
        setUser(DEMO_USER);
      } catch {
        setError('Could not load your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Get initials for avatar
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
          <div className="profile-page">
            <div className="profile-header-skeleton">
              <div className="skeleton profile-avatar-skeleton" />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: '200px', height: '32px', marginBottom: '12px' }} />
                <div className="skeleton" style={{ width: '150px', height: '20px' }} />
              </div>
            </div>
            <div className="profile-grid">
              <div className="skeleton" style={{ height: '300px' }} />
              <div className="skeleton" style={{ height: '300px' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
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
            <Button label="Try Again" variant="secondary" onClick={() => window.location.reload()} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="profile-page animate-fade-in">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar-large">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{getInitials(user.name)}</span>
              )}
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
              label="Edit Profile"
              variant="primary"
              onClick={() => navigate('/profile/edit')}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              }
            />
          </div>

          {/* Profile Grid */}
          <div className="profile-grid">
            {/* Bio Card */}
            <Card title="About" variant="elevated">
              <p className="profile-bio">{user.bio}</p>
            </Card>

            {/* Skills Card */}
            <Card title="Skills" variant="elevated">
              <div className="profile-skills">
                {user.skills.map((skill, index) => (
                  <Badge key={index} variant="yellow">{skill}</Badge>
                ))}
              </div>
            </Card>

            {/* Courses Card */}
            <Card title="Courses Completed" variant="elevated">
              <ul className="profile-courses">
                {user.courses.map((course, index) => (
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

            {/* Stats Card */}
            <Card title="Activity" variant="elevated">
              <div className="profile-stats">
                <div className="profile-stat">
                  <span className="profile-stat-value">{user.skills.length}</span>
                  <span className="profile-stat-label">Skills</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-value">{user.courses.length}</span>
                  <span className="profile-stat-label">Courses</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-value">3</span>
                  <span className="profile-stat-label">Posts</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;