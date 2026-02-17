const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'recruiter'],
    default: 'user'
  },
  profile: {
    title: String,
    location: String,
    bio: String,
    experience: {
      type: Number,
      default: 0
    },
    expectedSalary: {
      min: Number,
      max: Number
    },
    avatar: String,
    resume: String
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    yearsOfExperience: Number
  }],
  preferences: {
    jobTypes: [String],
    locations: [String],
    industries: [String],
    salaryRange: {
      min: Number,
      max: Number
    }
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  profileStrength: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile strength
userSchema.methods.calculateProfileStrength = function() {
  let strength = 0;
  
  if (this.profile.title) strength += 10;
  if (this.profile.location) strength += 10;
  if (this.profile.bio) strength += 15;
  if (this.profile.resume) strength += 20;
  if (this.skills.length > 0) strength += 20;
  if (this.skills.length >= 5) strength += 10;
  if (this.profile.experience > 0) strength += 10;
  if (this.preferences.jobTypes.length > 0) strength += 5;
  
  this.profileStrength = Math.min(strength, 100);
  return this.profileStrength;
};

module.exports = mongoose.model('User', userSchema);