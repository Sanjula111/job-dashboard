import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Briefcase, TrendingUp, X, Zap, MapPin, DollarSign, Clock, Award, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CVUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf'))) {
      setFile(selectedFile);
      setResults(null);
      setError(null);
    } else {
      setError('Please upload a PDF file');
    }
  };

  const analyzeCV = async () => {
    if (!file) return;

    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/cv/analyze', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setResults(response.data.data);
    } catch (err) {
      console.error('CV Analysis Error:', err);
      setError(err.response?.data?.message || 'Failed to analyze CV. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setResults(null);
      setError(null);
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
              <h1 className="text-2xl font-bold text-slate-900">Real CV Analysis</h1>
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
                <p className="text-lg text-slate-600">Get real AI-powered analysis with actual skill extraction</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

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
                  Analyze CV with Real AI
                </button>
              )}

              {analyzing && (
                <div className="mt-8 p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 analyzing-animation">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xl font-bold text-amber-900">Analyzing your CV...</span>
                  </div>
                  <div className="space-y-2 text-center text-sm text-amber-800">
                    <p>📄 Parsing PDF document</p>
                    <p>🔍 Extracting skills and experience</p>
                    <p>🎯 Matching with real job listings</p>
                    <p>📊 Calculating compatibility scores</p>
                    <p>💡 Generating personalized insights</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Real PDF Parsing</h3>
                <p className="text-sm text-slate-600">Actual text extraction from your CV using advanced parsing algorithms</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Intelligent Matching</h3>
                <p className="text-sm text-slate-600">Real algorithm that matches your actual skills with database jobs</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <Briefcase className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Dynamic Results</h3>
                <p className="text-sm text-slate-600">Results change based on YOUR actual CV content</p>
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
                    Found {results.extractedData.skills.length} skills and matched with {results.matchedJobs.length} jobs
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
                  <div className="text-sm text-emerald-100 mb-1">Skills Found</div>
                  <div className="text-3xl font-bold">{results.extractedData.skills.length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm text-emerald-100 mb-1">Experience</div>
                  <div className="text-3xl font-bold">{results.extractedData.experience.totalYears} Years</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm text-emerald-100 mb-1">Avg Match</div>
                  <div className="text-3xl font-bold">{results.statistics.averageMatchScore}%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm text-emerald-100 mb-1">Top Matches</div>
                  <div className="text-3xl font-bold">{results.matchedJobs.length}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-amber-600" />
                Extracted from Your CV
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-slate-700 mb-3">
                    Skills Detected ({results.extractedData.skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {results.extractedData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 text-sm font-semibold rounded-lg border border-emerald-200"
                      >
                        {skill.name} ({skill.level})
                      </span>
                    ))}
                  </div>
                </div>

                {results.extractedData.summary && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="text-sm font-bold text-blue-900 mb-2">Profile Summary</h4>
                    <p className="text-sm text-blue-800">{results.extractedData.summary}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-8 h-8 text-amber-600" />
                Your Best Job Matches
              </h2>
              
              {results.matchedJobs.map((job, index) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300"
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
                          ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
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

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {job.skillsMatched && job.skillsMatched.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-emerald-700 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Skills You Have ({job.skillsMatched.length})
                        </h4>
                        <div className="space-y-1">
                          {job.skillsMatched.slice(0, 5).map((skill, idx) => (
                            <div key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              <span>{skill.name} ({skill.yourLevel})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {job.skillsMissing && job.skillsMissing.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-amber-700 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Skills to Learn ({job.skillsMissing.length})
                        </h4>
                        <div className="space-y-1">
                          {job.skillsMissing.slice(0, 5).map((skill, idx) => (
                            <div key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                              <span>{skill.name} ({skill.requiredLevel})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {job.matchReasons && job.matchReasons.length > 0 && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                      <h4 className="text-sm font-bold text-slate-700 mb-2">Why This Match</h4>
                      <div className="space-y-1">
                        {job.matchReasons.map((reason, idx) => (
                          <p key={idx} className="text-sm text-slate-600">• {reason}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                  >
                    View Full Job Details
                  </button>
                </div>
              ))}
            </div>

            {results.skillGaps && results.skillGaps.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Skills to Develop</h3>
                </div>
                <p className="text-slate-600 mb-6">
                  These skills appear frequently in your top job matches. Learning them will significantly boost your opportunities.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.skillGaps.map((gap, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900">{gap.skill}</span>
                        <span className={`text-xs px-2 py-1 rounded font-semibold ${
                          gap.importance === 'High' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {gap.importance} Priority
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        Appears in {gap.appearsIn} of your top matches
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/profile')}
                  className="w-full mt-6 px-6 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors"
                >
                  Update My Profile with These Skills
                </button>
              </div>
            )}

            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-3">Ready to Apply?</h3>
              <p className="text-slate-300 mb-6">Your profile has been updated with the extracted skills. Start applying to your matched jobs!</p>
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