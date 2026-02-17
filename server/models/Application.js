const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn', 'accepted'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    required: false
  },
  resume: {
    type: String,
    required: false
  },
  answers: [{
    question: String,
    answer: String
  }],
  matchPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  timeline: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  interviews: [{
    scheduledDate: Date,
    type: {
      type: String,
      enum: ['phone', 'video', 'onsite', 'technical']
    },
    interviewer: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled']
    },
    feedback: String,
    notes: String
  }],
  recruiterNotes: String,
  salary: {
    offered: Number,
    negotiated: Number,
    final: Number
  },
  feedback: {
    fromRecruiter: String,
    fromCandidate: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  viewedByRecruiter: {
    type: Boolean,
    default: false
  },
  viewedAt: Date,
  respondedAt: Date
}, {
  timestamps: true
});

// Index for faster queries
applicationSchema.index({ user: 1, job: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });

// Prevent duplicate applications
applicationSchema.index({ user: 1, job: 1 }, { unique: true });

// Update timeline when status changes
applicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      date: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);