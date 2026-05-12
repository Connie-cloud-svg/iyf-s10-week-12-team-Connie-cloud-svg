import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Badge } from '../components';

const OpportunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOpportunity = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Please log in to view opportunities.');
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:5000/api/opportunities/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          setLoading(false);
          return;
        }

        if (res.status === 404) {
          throw new Error('NOT_FOUND');
        }

        if (!res.ok) {
          throw new Error(`Failed to load opportunity: ${res.status}`);
        }

        const data = await res.json();
        setOpportunity(data);
      } catch (err) {
        if (err.message === 'NOT_FOUND') {
          setError('NOT_FOUND');
        } else {
          setError(err.message || 'Failed to load opportunity details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadOpportunity();
  }, [id]);

  // Type badge color mapping
  const typeColors = {
    Job: 'blue',
    Internship: 'green',
    Announcement: 'yellow',
  };

  // Format deadline
  const formatDeadline = (deadline) => {
    if (!deadline) return 'No deadline';
    const date = new Date(deadline);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // Check if deadline is urgent
  const isUrgent = (deadline) => {
    if (!deadline) return false;
    const date = new Date(deadline);
    return (date - new Date()) < 7 * 24 * 60 * 60 * 1000 && date > new Date();
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
            <div className="skeleton" style={{ width: '100%', height: '200px' }} />
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
            <h2 className="empty-state-title">Opportunity Not Found</h2>
            <p className="empty-state-description">
              This opportunity could not be found or has been removed.
            </p>
            <Button
              label="← Back to Opportunities"
              variant="primary"
              onClick={() => navigate('/opportunities')}
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
              label="← Back to Opportunities"
              variant="secondary"
              onClick={() => navigate('/opportunities')}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="detail-page animate-fade-in">
          {/* Back Button */}
          <Button
            label="← Back to Opportunities"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/opportunities')}
            className="detail-back-btn"
          />

          {/* Main Content */}
          <div className="detail-content">
            {/* Header */}
            <div className="detail-header">
              <Badge variant={typeColors[opportunity.type] || 'outline'}>
                {opportunity.type}
              </Badge>

              <h1 className="detail-title">{opportunity.title}</h1>

              <div className="detail-meta">
                <span className="detail-company">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  {opportunity.company}
                </span>
                <span className="detail-separator">•</span>
                <span className="detail-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {opportunity.location}
                </span>
              </div>
            </div>

            <hr className="divider" />

            {/* Info Grid */}
            <div className="detail-info-grid">
              <div className="detail-info-item">
                <span className="detail-info-label">Deadline</span>
                <span className={`detail-info-value ${isUrgent(opportunity.deadline) ? 'deadline-urgent' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {formatDeadline(opportunity.deadline)}
                  {isUrgent(opportunity.deadline) && (
                    <span className="urgency-badge">Closing soon</span>
                  )}
                </span>
              </div>

              <div className="detail-info-item">
                <span className="detail-info-label">Posted By</span>
                <span className="detail-info-value">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {opportunity.postedBy?.name || 'Unknown'}
                </span>
              </div>

              {opportunity.contactInfo && (
                <div className="detail-info-item">
                  <span className="detail-info-label">Contact</span>
                  <span className="detail-info-value">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    {opportunity.contactInfo}
                  </span>
                </div>
              )}
            </div>

            <hr className="divider" />

            {/* Description */}
            <div className="detail-description">
              <h2 className="detail-section-title">Description</h2>
              <p className="detail-description-text">{opportunity.description}</p>
            </div>

            {/* Actions */}
            <div className="detail-actions">
              {opportunity.applicationLink ? (
                <Button
                  label="Apply Now →"
                  variant="primary"
                  size="lg"
                  onClick={() => window.open(opportunity.applicationLink, '_blank', 'noopener,noreferrer')}
                />
              ) : (
                <Button
                  label="Contact Poster"
                  variant="secondary"
                  size="lg"
                  onClick={() => window.location.href = `mailto:${opportunity.contactInfo}`}
                />
              )}

              <Button
                label="Share"
                variant="ghost"
                size="lg"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: opportunity.title,
                      text: `Check out this opportunity: ${opportunity.title} at ${opportunity.company}`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailPage;