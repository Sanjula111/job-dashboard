import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Briefcase, TrendingUp, X, Zap, MapPin, DollarSign, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CVUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf'))) {
      setFile(selectedFile);
      setResults(null);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const analyzeCV = async () => {
    if (!file) return;

    setAnalyzing(true);

    setTimeout(() => {
      const mockResults = {
        extractedSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'UI/UX Design', 'Figma', 'TypeScript', 'MongoDB'],
        experience: 5,
        education: 'Bachelor in Computer Science',
        matchedJobs: [
          {
            id: 1,
            title: 'Senior Full Stack Developer',
            company: 'TechCorp Inc',
            location: 'San Francisco, CA',
            salary: '$120k - $160k',
            jobType: 'Full-time',
            matchPercentage: 95,
            matchReasons: [
              'Strong JavaScript and React skills match perfectly',
              '5 years experience aligns with senior role requirements',
              'Full-stack expertise with Node.js is highly valuable',
              'UI/UX knowledge is a bonus for this position'
            ]
          },
          {
            id: 2,
            title: 'Frontend Lead Developer',
            company: 'Innovation Labs',
            location: 'Remote',
            salary: '$110k - $150k',
            jobType: 'Remote',
            matchPercentage: 89,
            matchReasons: [
              'Expert-level React and TypeScript skills',
              'Leadership potential with 5 years experience',
              'Remote work experience indicated',
              'Strong UI/UX background enhances candidacy'
            ]
          },
          {
            id: 3,
            title: 'Product Designer',
            company: 'Design Studio',
            location: 'New York, NY',
            salary: '$100k - $130k',
            jobType: 'Hybrid',
            matchPercentage: 78,
            matchReasons: [
              'Figma and UI/UX skills are directly applicable',
              'Technical background adds unique value',
              'Cross-functional experience with developers',
              'Strong portfolio potential'
            ]
          },
          {
            id: 4,
            title: 'Technical Product Manager',
            company: 'Startup Ventures',
            location: 'Austin, TX',
            salary: '$115k - $145k',
            jobType: 'Full-time',
            matchPercentage: 82,
            matchReasons: [
              'Technical skills enable better team communication',
              'Full-stack understanding of product development',
              'Experience level fits mid-senior PM role',
              'Can bridge gap between design and engineering'
            ]
          }
        ],
        missingSkills: ['TypeScript (Advanced)', 'AWS', 'Docker', 'Kubernetes', 'GraphQL'],
        recommendations: [
          'Consider deepening your TypeScript knowledge to increase match scores for senior positions',
          'Cloud platforms (AWS/Azure) are highly sought after - adding certification would boost your profile by 15-20%',
          'Docker and Kubernetes skills would make you competitive for DevOps-oriented roles',
          'GraphQL experience is becoming standard for modern full-stack positions',
          'Consider contributing to open-source projects to demonstrate your collaborative skills'
        ],
        careerInsights: {
          topIndustries: ['Technology', 'Fintech', 'SaaS'],
          avgSalaryRange: '$110k - $155k',
          demandLevel: 'Very High',
          competitionLevel: 'Moderate'
        }
      };

      setResults(mockResults);
      setAnalyzing(false);
    }, 3000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setResults(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-amber-50/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'Work Sans', sans-serif; }
        h1, h2, h3 { font-family: 'Crimson Pro', serif; }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }
          50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.6); }
        }
        
        .analyzing-animation {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
            >
              ← Back to Dashboard
            </button>
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-600" />
              <h1 className="text-2xl font-bold text-slate-900">AI CV Analysis</h1>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {!results ? (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-lg">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-3">Upload Your CV</h2>
                <p className="text-lg text-slate-600">Get AI-powered job recommendations in seconds</p>
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  file 
                    ? 'border-emerald-400 bg-emerald-50' 
                    : 'border-slate-300 hover:border-amber-500 hover:bg-amber-50/30'
                }`}
                onClick={() => document.getElementById('file-upload').click()}
              >
                {file ? (
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-2xl">
                      <FileText className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-600 mt-1">{(file.size / 1024).toFixed(2)} KB PDF Document</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-xl font-bold text-slate-900 mb-2">
                        Drop your CV here or click to browse
                      </p>
                      <p className="text-sm text-slate-600">
                        Supports PDF format - Maximum size 10MB
                      </p>
                    </div>
                  </div>
                )}
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {file && !analyzing && (
                <button
                  onClick={analyzeCV}
                  className="w-full mt-8 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Analyze CV and Find Perfect Matches
                </button>
              )}

              {analyzing && (
                <div className="mt-8 p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 analyzing-animation">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xl font-bold text-amber-900">Analyzing your CV...</span>
                  </div>
                  <div className="space-y-2 text-center text-sm text-amber-800">
                    <p>🔍 Extracting skills and experience</p>
                    <p>🎯 Matching with 1000+ job listings</p>
                    <p>📊 Calculating compatibility scores</p>
                    <p>💡 Generating personalized recommendations</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">AI-Powered Matching</h3>
                <p className="text-sm text-slate-600">Advanced algorithm analyzes your CV and matches you with the best opportunities</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Skill Gap Analysis</h3>
                <p className="text-sm text-slate-600">Identify strengths and get personalized learning recommendations</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <Briefcase className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Results</h3>
                <p className="text-sm text-slate-600">Get matched with relevant jobs in under 10 seconds</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-bold mb-2">Analysis Complete! 🎉</h2>
                  <p className="text-emerald-100 text-lg">
                    We found {results.matchedJobs.length} jobs matching your profile with an average match of{' '}
                    {Math.round(results.matchedJobs.reduce((sum, job) => sum + job.matchPercentage, 0) / results.matchedJobs.length)}%
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setResults(null);
                  }}
                  className="px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  Upload New CV
                </button>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm text-emerald-100 mb-1">Avg Salary Range</div>
                  <div className="text-xl font-bold">{results.careerInsights.avgSalaryRange}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm text-emerald-100 mb-1">Market Demand</div>
                  <div className="text-xl font-bold">{results.careerInsights.demandLevel}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm text-emerald-100 mb-1">Competition</div>
                  <div className="text-xl font-bold">{results.careerInsights.competitionLevel}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm text-emerald-100 mb-1">Experience</div>
                  <div className="text-xl font-bold">{results.experience} Years</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Your Skills Profile</h3>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-slate-700">Current Skills ({results.extractedSkills.length})</h4>
                  <span className="text-sm text-emerald-600 font-medium">✓ Strong foundation</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.extractedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 text-sm font-semibold rounded-lg border border-emerald-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-slate-700">Skills to Add ({results.missingSkills.length})</h4>
                  <span className="text-sm text-amber-600 font-medium">⚡ Boost your matches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-amber-50 text-amber-700 text-sm font-semibold rounded-lg border border-amber-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">Your Top Job Matches</h2>
              
              {results.matchedJobs.map((job, index) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => navigate('/dashboard')}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-slate-900">{job.title}</h3>
                        {index === 0 && (
                          <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold rounded-full">
                            BEST MATCH
                          </span>
                        )}
                      </div>
                      <p className="text-lg text-slate-700 font-medium mb-3">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {job.jobType}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                        {job.matchPercentage}%
                      </div>
                      <div className="text-sm text-slate-600 font-semibold">Match Score</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${
                          job.matchPercentage >= 90
                            ? 'from-emerald-500 to-teal-600'
                            : job.matchPercentage >= 80
                            ? 'from-blue-500 to-indigo-600'
                            : 'from-amber-500 to-orange-600'
                        } rounded-full transition-all duration-1000`}
                        style={{ width: `${job.matchPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-bold text-slate-700 mb-3">Why you are a great fit:</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {job.matchReasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/dashboard');
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                  >
                    View Job and Apply
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Career Growth Recommendations</h3>
              </div>
              <ul className="space-y-4">
                {results.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-4 bg-white p-4 rounded-xl">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-slate-700 leading-relaxed">{rec}</p>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/profile')}
                className="w-full mt-6 px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors"
              >
                Update My Profile with These Skills
              </button>
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-3">Ready to apply?</h3>
              <p className="text-slate-300 mb-6">Save these jobs to your dashboard and start applying today</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                Go to Dashboard →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CVUpload;