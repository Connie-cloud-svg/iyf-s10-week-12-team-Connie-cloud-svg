import { Button, Card, Badge } from './index';

const OpportunityCard = ({ opportunity, onView }) => {
  const { title, company, location, type, description, deadline } = opportunity;

  // Type badge color mapping
  const typeColors = {
    Job: 'blue',
    Internship: 'green',
    Announcement: 'yellow',
  };

  // Truncate description to ~100 chars
  const shortDesc = description?.length > 100
    ? description.slice(0, 100) + '...'
    : description;

  // Format deadline and check urgency
  const deadlineDate = deadline ? new Date(deadline) : null;
  const isUrgent = deadlineDate && (deadlineDate - new Date()) < 7 * 24 * 60 * 60 * 1000;
  const isExpired = deadlineDate && deadlineDate < new Date();

  const formattedDeadline = deadlineDate
    ? deadlineDate.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : 'No deadline';

  return (
    <Card
      variant="yellowGlow"
      className="opportunity-card"
      headerAction={
        <Badge variant={typeColors[type] || 'outline'}>{type}</Badge>
      }
      footer={
        <Button
          label="View Details"
          variant="primary"
          size="sm"
          onClick={onView}
        />
      }
    >
      <h3 className="opportunity-title">{title}</h3>

      <p className="opportunity-meta">
        <span className="opportunity-company">{company}</span>
        <span className="opportunity-separator">•</span>
        <span className="opportunity-location">{location}</span>
      </p>

      <p className="opportunity-deadline">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className={isExpired ? 'deadline-expired' : isUrgent ? 'deadline-urgent' : ''}>
          {isExpired ? 'Expired: ' : isUrgent ? 'Closing soon: ' : 'Deadline: '}
          {formattedDeadline}
        </span>
        {isUrgent && !isExpired && <span className="urgency-badge">Urgent</span>}
      </p>

      <p className="opportunity-description">{shortDesc}</p>
    </Card>
  );
};

export default OpportunityCard;