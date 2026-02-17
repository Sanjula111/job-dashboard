import React, { useState } from 'react';
import { Briefcase, TrendingUp, Award, MapPin, Clock, DollarSign, ChevronRight, Star, Target, Zap } from 'lucide-react';

const JobMatchingDashboard = () => {
  const [activeTab, setActiveTab] = useState('recommended');

  const jobRecommendations = [
    {
      id: 1,
      title: 'Senior Product Designer',
      company: 'Aurora Labs',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $160k',
      matchPercentage: 94,
      skills: ['UI/UX', 'Figma', 'Design Systems', 'User Research'],
      posted: '2 days ago',
      applicants: 12,
      featured: true
    },
    {
      id: 2,
      title: 'Lead UX Researcher',
      company: 'Nexus Digital',
      location: 'Remote',
      type: 'Full-time',
      salary: '$130k - $170k',
      matchPercentage: 89,
      skills: ['User Research', 'Data Analysis', 'Usability Testing'],
      posted: '5 days ago',
      applicants: 8,
      featured: false
    },
    {
      id: 3,
      title: 'Product Design Manager',
      company: 'Zenith Tech',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$140k - $180k',
      matchPercentage: 87,
      skills: ['Leadership', 'Design Systems', 'Figma', 'Mentoring'],
      posted: '1 week ago',
      applicants: 15,
      featured: false
    },
    {
      id: 4,
      title: 'UX/UI Designer',
      company: 'Catalyst Creative',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$100k - $130k',
      matchPercentage: 82,
      skills: ['UI/UX', 'Prototyping', 'Figma', 'Illustration'],
      posted: '3 days ago',
      applicants: 20,
      featured: false
    }
  ];

  const skillGaps = [
    { skill: 'Advanced Prototyping', importance: 'High', progress: 40 },
    { skill: 'Design Systems Architecture', importance: 'Medium', progress: 65 },
    { skill: 'Motion Design', importance: 'Medium', progress: 55 },
    { skill: 'Accessibility Standards', importance: 'High', progress: 70 }
  ];

  const stats = [
    { label: 'Profile Strength', value: '87%', icon: Target, color: 'from-amber-500 to-orange-600' },
    { label: 'Applications', value: '12', icon: Briefcase, color: 'from-emerald-500 to-teal-600' },
    { label: 'Interviews', value: '3', icon: TrendingUp, color: 'from-blue-500 to-indigo-600' },
    { label: 'Saved Jobs', value: '24', icon: Star, color: 'from-purple-500 to-pink-600' }
  ];

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'from-emerald-500 to-teal-600';
    if (percentage >= 80) return 'from-blue-500 to-indigo-600';
    if (percentage >= 70) return 'from-amber-500 to-orange-600';
    return 'from-slate-400 to-slate-500';
  };

  const getImportanceColor = (importance) => {
    if (importance === 'High') return 'text-rose-600 bg-rose-50 border-rose-200';
    if (importance === 'Medium') return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-amber-50/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        h1, h2, h3 {
          font-family: 'Crimson Pro', Georgia, serif;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.4s ease-out forwards;
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        
        .job-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
        }
        
        .job-card.visible {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        .job-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
        }
        
        .featured-badge {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          animation: shimmer 3s infinite linear;
          background-size: 1000px 100%;
        }
        
        .progress-bar {
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-slide-in">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">TalentMatch</h1>
                <p className="text-sm text-slate-600">Your Career Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                Profile
              </button>
              <button className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg hover:shadow-lg hover:scale-105 transition-all">
                Update Resume
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`stat-card bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm transition-all duration-300 animate-scale-in stagger-${index + 1}`}
              style={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Job Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between animate-fade-in-up">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-1">Recommended for You</h2>
                <p className="text-slate-600">Jobs matching your skills and preferences</p>
              </div>
              <div className="flex gap-2 bg-white rounded-xl p-1 border border-slate-200/60">
                <button
                  onClick={() => setActiveTab('recommended')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'recommended'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Recommended
                </button>
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'recent'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Recent
                </button>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {jobRecommendations.map((job, index) => (
                <div
                  key={job.id}
                  className={`job-card visible bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl cursor-pointer stagger-${index + 1}`}
                  style={{ opacity: 0 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                        {job.featured && (
                          <span className="featured-badge px-3 py-1 text-xs font-semibold text-white rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 font-medium mb-3">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                        {job.matchPercentage}%
                      </div>
                      <div className="text-xs text-slate-600 font-medium">Match</div>
                    </div>
                  </div>

                  {/* Match Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-700">Skill Match</span>
                      <span className="text-xs text-slate-600">{job.matchPercentage}% compatible</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`progress-bar h-full bg-gradient-to-r ${getMatchColor(job.matchPercentage)} rounded-full`}
                        style={{ width: `${job.matchPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-600">
                      Posted {job.posted} · {job.applicants} applicants
                    </span>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all">
                      Apply Now
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skill Gap Analysis */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Skill Development</h3>
                  <p className="text-sm text-slate-600">Close the gap</p>
                </div>
              </div>

              <div className="space-y-5">
                {skillGaps.map((gap, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 mb-1">{gap.skill}</p>
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded border ${getImportanceColor(gap.importance)}`}>
                          {gap.importance} Priority
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{gap.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="progress-bar h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
                        style={{ width: `${gap.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all">
                View Learning Paths
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-left transition-all flex items-center justify-between group">
                  <span className="font-medium">Complete Profile</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-left transition-all flex items-center justify-between group">
                  <span className="font-medium">Set Job Alerts</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-left transition-all flex items-center justify-between group">
                  <span className="font-medium">Network Activity</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/60 animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">Profile Viewed 50+ Times</p>
                    <p className="text-xs text-slate-600">Last week</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">Top 5% in Design</p>
                    <p className="text-xs text-slate-600">This month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobMatchingDashboard;