import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../components';

const CreateOpportunityPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Job',
    description: '',
    deadline: '',
    contactInfo: '',
    applicationLink: ''
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setGeneralError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (formData.applicationLink && !/^https?:\/\/.+/.test(formData.applicationLink)) {
      newErrors.applicationLink = 'Please enter a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    setGeneralError('');

    try {
      // TODO: Replace with real API call when Ian's backend is ready
      // const token = localStorage.getItem('token');
      // const res = await fetch('http://localhost:5000/api/opportunities', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      // if (!res.ok) throw new Error('Failed to create opportunity');

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success - redirect to opportunities list
      navigate('/opportunities');

    } catch (err) {
      setGeneralError(err.message || 'Failed to create opportunity. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="create-page animate-fade-in">
          {/* Back Button */}
          <Button
            label="← Back to Opportunities"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/opportunities')}
            className="detail-back-btn"
          />

          <Card variant="elevated" className="create-card">
            <div className="auth-header" style={{ marginBottom: 'var(--space-8)' }}>
              <h1 className="auth-title">Post an Opportunity</h1>
              <p className="auth-subtitle">
                Share a job, internship, or announcement with the alumni community
              </p>
            </div>

            <form onSubmit={handleSubmit} className="create-form">
              <div className="create-form-grid">
                <Input
                  label="Title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Frontend Developer"
                  error={errors.title}
                  required
                  disabled={submitting}
                />

                <Input
                  label="Company / Organization"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g., TechCorp"
                  error={errors.company}
                  required
                  disabled={submitting}
                />

                <Input
                  label="Location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Nairobi, Kenya or Remote"
                  error={errors.location}
                  required
                  disabled={submitting}
                />

                <div className="input-group">
                  <label className="input-label">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="input-field"
                    disabled={submitting}
                  >
                    <option value="Job">Job</option>
                    <option value="Internship">Internship</option>
                    <option value="Announcement">Announcement</option>
                  </select>
                </div>

                <Input
                  label="Deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  disabled={submitting}
                  hint="Optional - leave blank for no deadline"
                />

                <Input
                  label="Contact Email"
                  name="contactInfo"
                  type="email"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  placeholder="e.g., hr@company.com"
                  error={errors.contactInfo}
                  disabled={submitting}
                  hint="How should applicants reach out?"
                />
              </div>

              <div className="input-group" style={{ marginTop: 'var(--space-4)' }}>
                <label className="input-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the opportunity, requirements, and what makes it exciting..."
                  className={`input-field ${errors.description ? 'input-error' : ''}`}
                  rows="5"
                  disabled={submitting}
                />
                {errors.description && (
                  <span className="input-error-message">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.description}
                  </span>
                )}
              </div>

              <Input
                label="Application Link (Optional)"
                name="applicationLink"
                type="url"
                value={formData.applicationLink}
                onChange={handleChange}
                placeholder="https://company.com/careers"
                error={errors.applicationLink}
                disabled={submitting}
                hint="Direct link to apply - leave blank if applicants should email you"
              />

              {generalError && (
                <div className="auth-error" role="alert" style={{ marginTop: 'var(--space-4)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {generalError}
                </div>
              )}

              <div className="create-actions">
                <Button
                  type="submit"
                  label={submitting ? 'Posting...' : 'Post Opportunity'}
                  variant="primary"
                  disabled={submitting}
                  className="auth-submit-btn"
                />
                <Button
                  label="Cancel"
                  variant="secondary"
                  onClick={() => navigate('/opportunities')}
                  disabled={submitting}
                />
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateOpportunityPage;