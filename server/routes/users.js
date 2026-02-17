const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('applications')
      .populate('savedJobs');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// @route   GET /api/users/saved-jobs
// @desc    Get user's saved jobs
// @access  Private
router.get('/saved-jobs', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedJobs');

    res.json({
      success: true,
      count: user.savedJobs.length,
      savedJobs: user.savedJobs
    });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved jobs',
      error: error.message
    });
  }
});

// @route   GET /api/users/skill-gap
// @desc    Get skill gap analysis
// @access  Private
router.get('/skill-gap', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get top job recommendations
    const jobs = await Job.find({ status: 'active', isActive: true }).limit(20);

    // Calculate skill gaps
    const allRequiredSkills = new Map();

    jobs.forEach(job => {
      const matchPercentage = job.calculateMatchPercentage(user);

      // Only consider jobs with >70% match
      if (matchPercentage > 70) {
        job.requiredSkills.forEach(skill => {
          const skillName = skill.name.toLowerCase();
          const userHasSkill = user.skills.some(
            s => s.name.toLowerCase() === skillName
          );

          if (!userHasSkill) {
            if (allRequiredSkills.has(skillName)) {
              allRequiredSkills.set(skillName, {
                count: allRequiredSkills.get(skillName).count + 1,
                level: skill.level,
                importance: skill.required ? 'High' : 'Medium'
              });
            } else {
              allRequiredSkills.set(skillName, {
                count: 1,
                level: skill.level,
                importance: skill.required ? 'High' : 'Medium'
              });
            }
          }
        });
      }
    });

    // Convert to array and sort by frequency
    const skillGaps = Array.from(allRequiredSkills.entries())
      .map(([skill, data]) => ({
        skill: skill.charAt(0).toUpperCase() + skill.slice(1),
        importance: data.importance,
        requiredBy: data.count,
        level: data.level,
        progress: 0
      }))
      .sort((a, b) => b.requiredBy - a.requiredBy)
      .slice(0, 10);

    res.json({
      success: true,
      skillGaps,
      userSkills: user.skills
    });
  } catch (error) {
    console.error('Get skill gap error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing skill gap',
      error: error.message
    });
  }
});

// @route   GET /api/users/dashboard-stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard-stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('applications')
      .populate('savedJobs');

    const Application = require('../models/Application');
    const applications = await Application.find({ user: req.user.id });

    const stats = {
      profileStrength: user.profileStrength,
      totalApplications: applications.length,
      interviews: applications.filter(a => a.status === 'interview').length,
      savedJobs: user.savedJobs.length
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
});

module.exports = router;