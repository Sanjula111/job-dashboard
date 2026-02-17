const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description']
  },
  requirements: {
    type: String,
    required: true
  },
  responsibilities: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  locationType: {
    type: String,
    enum: ['remote', 'hybrid', 'onsite'],
    default: 'onsite'
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    required: true
  },
  salary: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    required: true
  },
  requiredSkills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    required: Boolean
  }],
  niceToHaveSkills: [{
    name: String,
    level: String
  }],
  benefits: [String],
  industry: {
    type: String,
    required: true
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  companyLogo: String,
  applicationDeadline: Date,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster searches
jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ location: 1, jobType: 1, experienceLevel: 1 });

// Method to calculate match percentage with a user
jobSchema.methods.calculateMatchPercentage = function(user) {
  let matchScore = 0;
  let totalWeight = 0;

  // Skills match (40% weight)
  const skillsWeight = 40;
  const userSkillNames = user.skills.map(s => s.name.toLowerCase());
  const requiredSkillNames = this.requiredSkills.map(s => s.name.toLowerCase());
  
  const matchedSkills = requiredSkillNames.filter(skill => 
    userSkillNames.includes(skill)
  );
  
  const skillsMatch = requiredSkillNames.length > 0 
    ? (matchedSkills.length / requiredSkillNames.length) * skillsWeight 
    : 0;
  
  matchScore += skillsMatch;
  totalWeight += skillsWeight;

  // Experience level match (20% weight)
  const experienceWeight = 20;
  const experienceLevels = ['entry', 'mid', 'senior', 'lead', 'executive'];
  const userExpIndex = Math.min(Math.floor(user.profile.experience / 2), 4);
  const jobExpIndex = experienceLevels.indexOf(this.experienceLevel);
  
  const experienceMatch = Math.max(0, 100 - Math.abs(userExpIndex - jobExpIndex) * 25);
  matchScore += (experienceMatch / 100) * experienceWeight;
  totalWeight += experienceWeight;

  // Location match (15% weight)
  const locationWeight = 15;
  const locationMatch = this.locationType === 'remote' || 
                       user.preferences.locations.includes(this.location) ? 100 : 50;
  matchScore += (locationMatch / 100) * locationWeight;
  totalWeight += locationWeight;

  // Job type preference match (15% weight)
  const jobTypeWeight = 15;
  const jobTypeMatch = user.preferences.jobTypes.includes(this.jobType) ? 100 : 50;
  matchScore += (jobTypeMatch / 100) * jobTypeWeight;
  totalWeight += jobTypeWeight;

  // Salary match (10% weight)
  const salaryWeight = 10;
  let salaryMatch = 50;
  if (user.preferences.salaryRange && user.preferences.salaryRange.min) {
    if (this.salary.max >= user.preferences.salaryRange.min) {
      salaryMatch = 100;
    } else {
      salaryMatch = 30;
    }
  }
  matchScore += (salaryMatch / 100) * salaryWeight;
  totalWeight += salaryWeight;

  return Math.round(matchScore);
};

module.exports = mongoose.model('Job', jobSchema);