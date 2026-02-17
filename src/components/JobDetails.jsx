import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../services/api';
import { MapPin, Clock, DollarSign, Briefcase, Users, TrendingUp, CheckCircle, Building } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobsAPI.getJobById(id);
      setJob(response.data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationsAPI.apply({
        jobId: id,
        coverLetter: 'I am interested in this position.',
      });
      setApplied(true);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying:', error);
      alert(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600">Job not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-amber-600 hover:text-amber-700 font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
          <button
            onClick={() => navigate('/dashboard')}
            className="text-amber-600 hover:text-amber-700 font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Job Header */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
                {job.featured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xl text-slate-700 font-medium mb-4">{job.company}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-slate-600">
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {job.location}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {job.jobType}
                </span>
                <span className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                </span>
                <span className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  {job.experienceLevel}
                </span>
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={applying || applied}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applied ? 'Applied ✓' : applying ? 'Applying...' : 'Apply Now'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{job.views}</div>
              <div className="text-sm text-slate-600">Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{job.applications}</div>
              <div className="text-sm text-slate-600">Applicants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{job.companySize}</div>
              <div className="text-sm text-slate-600">Company Size</div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Job Description</h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Requirements</h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{job.requirements}</p>
        </div>

        {/* Responsibilities */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Responsibilities</h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{job.responsibilities}</p>
        </div>

        {/* Required Skills */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-3">
            {job.requiredSkills.map((skill, idx) => (
              <span
                key={idx}
                className={`px-4 py-2 rounded-lg border font-medium ${
                  skill.required
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {skill.name} {skill.required && '(Required)'}
              </span>
            ))}
          </div>
        </div>

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Benefits</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {job.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apply Button (Bottom) */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm text-center">
          <button
            onClick={handleApply}
            disabled={applying || applied}
            className="px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {applied ? 'Application Submitted ✓' : applying ? 'Submitting Application...' : 'Apply for this Position'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;