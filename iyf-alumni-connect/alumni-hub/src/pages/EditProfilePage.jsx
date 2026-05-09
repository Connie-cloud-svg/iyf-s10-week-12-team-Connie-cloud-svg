import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../components';

const EditProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: [],
    newSkill: ''
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load current user data from Cheryl's API
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setGeneralError('Please log in to edit your profile.');
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
          setGeneralError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to load profile: ${res.status}`);
        }

        const data = await res.json();

        // Map backend data to form (backend has no location/role yet)
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          skills: data.skills || [],
          newSkill: ''
        });
      } catch (err) {
        setGeneralError(err.message || 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setGeneralError('');
  };

  // Add skill
  const handleAddSkill = () => {
    const skill = formData.newSkill.trim();
    if (!skill) return;
    if (formData.skills.includes(skill)) {
      setErrors(prev => ({ ...prev, newSkill: 'Skill already added' }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, skill],
      newSkill: ''
    }));
    setErrors(prev => ({ ...prev, newSkill: '' }));
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Handle Enter key for adding skills
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.trim().length < 20) {
      newErrors.bio = 'Bio must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);
    setGeneralError('');

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          skills: formData.skills
        })
      });

      if (res.status === 401) {
        setGeneralError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        setSaving(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to update profile: ${res.status}`);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 1500);

    } catch (err) {
      setGeneralError(err.message || 'Failed to save changes. Please try again.');
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="create-page">
            <div className="skeleton" style={{ width: '200px', height: '32px', marginBottom: '24px' }} />
            <div className="skeleton" style={{ height: '500px' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="create-page animate-fade-in">
          {/* Back Button */}
          <Button
            label="← Back to Profile"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="detail-back-btn"
          />

          <Card variant="elevated" className="create-card">
            <div className="auth-header" style={{ marginBottom: 'var(--space-8)' }}>
              <h1 className="auth-title">Edit Profile</h1>
              <p className="auth-subtitle">Update your information and skills</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="auth-success" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Profile saved successfully! Redirecting...
              </div>
            )}

            <form onSubmit={handleSubmit} className="create-form">
              <div className="create-form-grid">
                <Input
                  label="Full Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  error={errors.name}
                  required
                  disabled={saving || success}
                />
              </div>

              {/* Bio */}
              <div className="input-group" style={{ marginTop: 'var(--space-4)' }}>
                <label className="input-label">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                  className={`input-field ${errors.bio ? 'input-error' : ''}`}
                  rows="4"
                  disabled={saving || success}
                />
                {errors.bio && (
                  <span className="input-error-message">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.bio}
                  </span>
                )}
              </div>

              {/* Skills Editor */}
              <div className="input-group" style={{ marginTop: 'var(--space-4)' }}>
                <label className="input-label">Skills</label>

                {/* Current Skills Tags */}
                <div className="skill-tags">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        disabled={saving || success}
                        aria-label={`Remove ${skill}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add New Skill */}
                <div className="skill-input-group">
                  <input
                    type="text"
                    name="newSkill"
                    value={formData.newSkill}
                    onChange={handleChange}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="Type a skill and press Enter"
                    className={`input-field ${errors.newSkill ? 'input-error' : ''}`}
                    disabled={saving || success}
                  />
                  <Button
                    type="button"
                    label="Add"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddSkill}
                    disabled={saving || success || !formData.newSkill.trim()}
                  />
                </div>
                {errors.newSkill && (
                  <span className="input-error-message">{errors.newSkill}</span>
                )}
              </div>

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
                  label={saving ? 'Saving...' : 'Save Changes'}
                  variant="primary"
                  disabled={saving || success}
                  className="auth-submit-btn"
                />
                <Button
                  label="Cancel"
                  variant="secondary"
                  onClick={() => navigate('/profile')}
                  disabled={saving || success}
                />
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;