import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI, authAPI } from '../services/api';
import { User, Mail, MapPin, Briefcase, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profile: {
      title: '',
      location: '',
      bio: '',
      experience: 0,
    },
    skills: [],
    preferences: {
      jobTypes: [],
      locations: [],
      salaryRange: { min: 0, max: 0 }
    }
  });
  const [newSkill, setNewSkill] = useState({ name: '', level: 'intermediate' });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        profile: {
          title: user.profile?.title || '',
          location: user.profile?.location || '',
          bio: user.profile?.bio || '',
          experience: user.profile?.experience || 0,
        },
        skills: user.skills || [],
        preferences: {
          jobTypes: user.preferences?.jobTypes || [],
          locations: user.preferences?.locations || [],
          salaryRange: user.preferences?.salaryRange || { min: 0, max: 0 }
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, { ...newSkill, yearsOfExperience: 1 }]
      }));
      setNewSkill({ name: '', level: 'intermediate' });
    }
  };

  const handleRemoveSkill = (index) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(profileData);
      updateUser(response.data.user);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-amber-50/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'Work Sans', sans-serif; }
        h1, h2, h3 { font-family: 'Crimson Pro', serif; }
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{profileData.name}</h2>
                <p className="text-slate-600">{profileData.profile.title || 'Add your job title'}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                  {profileData.profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profileData.profile.location}
                    </span>
                  )}
                  {profileData.profile.experience > 0 && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {profileData.profile.experience} years exp
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setProfileData({
                      name: user.name || '',
                      email: user.email || '',
                      profile: user.profile || {},
                      skills: user.skills || [],
                      preferences: user.preferences || {}
                    });
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Strength */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">Profile Strength</span>
              <span className="text-sm font-bold text-slate-900">{user?.profileStrength || 0}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${user?.profileStrength || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Basic Information</h3>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    disabled
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
                <input
                  type="text"
                  name="profile.title"
                  value={profileData.profile.title}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="e.g. Senior Product Designer"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                <input
                  type="text"
                  name="profile.location"
                  value={profileData.profile.location}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Years of Experience</label>
              <input
                type="number"
                name="profile.experience"
                value={profileData.profile.experience}
                onChange={handleChange}
                disabled={!editing}
                min="0"
                max="50"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
              <textarea
                name="profile.bio"
                value={profileData.profile.bio}
                onChange={handleChange}
                disabled={!editing}
                rows="4"
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-50 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Skills</h3>
          
          {editing && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="Skill name (e.g., React)"
                  className="flex-1 px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                  className="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {profileData.skills.length === 0 ? (
              <p className="text-slate-500 italic">No skills added yet</p>
            ) : (
              profileData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg flex items-center gap-2"
                >
                  <div>
                    <span className="font-semibold text-slate-900">{skill.name}</span>
                    <span className="text-xs text-slate-600 ml-2">({skill.level})</span>
                  </div>
                  {editing && (
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Job Preferences */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Job Preferences</h3>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Minimum Salary ($)</label>
                <input
                  type="number"
                  name="preferences.salaryRange.min"
                  value={profileData.preferences.salaryRange?.min || 0}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      salaryRange: {
                        ...prev.preferences.salaryRange,
                        min: parseInt(e.target.value)
                      }
                    }
                  }))}
                  disabled={!editing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Maximum Salary ($)</label>
                <input
                  type="number"
                  name="preferences.salaryRange.max"
                  value={profileData.preferences.salaryRange?.max || 0}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      salaryRange: {
                        ...prev.preferences.salaryRange,
                        max: parseInt(e.target.value)
                      }
                    }
                  }))}
                  disabled={!editing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-50"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;