const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search,
      location,
      jobType,
      experienceLevel,
      minSalary,
      maxSalary,
      locationType,
      industry,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = { status: 'active', isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (locationType) {
      query.locationType = locationType;
    }

    if (industry) {
      query.industry = new RegExp(industry, 'i');
    }

    if (minSalary || maxSalary) {
      query['salary.min'] = {};
      if (minSalary) query['salary.min'].$gte = parseInt(minSalary);
      if (maxSalary) query['salary.max'].$lte = parseInt(maxSalary);
    }

    // Execute query with pagination
    const jobs = await Job.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('postedBy', 'name email');

    const count = await Job.countDocuments(query);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
});

// @route   GET /api/jobs/recommendations
// @desc    Get personalized job recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get all active jobs
    const jobs = await Job.find({ status: 'active', isActive: true })
      .populate('postedBy', 'name email')
      .limit(50);

    // Calculate match percentage for each job
    const jobsWithMatch = jobs.map(job => {
      const jobObj = job.toObject();
      jobObj.matchPercentage = job.calculateMatchPercentage(user);
      return jobObj;
    });

    // Sort by match percentage
    jobsWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Return top matches
    const recommendations = jobsWithMatch.slice(0, 20);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
});

// @route   POST /api/jobs
// @desc    Create a job
// @access  Private (Recruiter/Admin)
router.post('/', protect, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user.id
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (Recruiter/Admin)
router.put('/:id', protect, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user owns the job
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (Recruiter/Admin)
router.delete('/:id', protect, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user owns the job
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    // Soft delete
    job.isActive = false;
    job.status = 'closed';
    await job.save();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
});

// @route   POST /api/jobs/:id/save
// @desc    Save/unsave a job
// @access  Private
router.post('/:id/save', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const jobId = req.params.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Toggle save
    const index = user.savedJobs.indexOf(jobId);
    if (index > -1) {
      user.savedJobs.splice(index, 1);
      await user.save();
      return res.json({
        success: true,
        message: 'Job removed from saved jobs',
        saved: false
      });
    } else {
      user.savedJobs.push(jobId);
      await user.save();
      return res.json({
        success: true,
        message: 'Job saved successfully',
        saved: true
      });
    }
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving job',
      error: error.message
    });
  }
});

module.exports = router;