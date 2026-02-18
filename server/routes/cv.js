const express = require('express');
const router = express.Router();
const multer = require('multer');
const cvParser = require('../services/cvParser');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Configure multer for file upload (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// @route   POST /api/cv/analyze
// @desc    Analyze uploaded CV
// @access  Private
router.post('/analyze', protect, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Parse CV
    const cvData = await cvParser.parseCV(req.file.buffer);
    
    // Get all active jobs
    const jobs = await Job.find({ status: 'active', isActive: true }).limit(50);
    
    // Calculate matches
    const matchedJobs = jobs.map(job => {
      const matchScore = calculateDetailedMatch(cvData, job);
      return {
        ...job.toObject(),
        matchPercentage: matchScore.percentage,
        matchReasons: matchScore.reasons,
        skillsMatched: matchScore.skillsMatched,
        skillsMissing: matchScore.skillsMissing
      };
    });
    
    // Sort by match percentage
    matchedJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Get top matches
    const topMatches = matchedJobs.slice(0, 10);
    
    // Analyze skill gaps
    const skillGapAnalysis = analyzeSkillGaps(cvData.skills, matchedJobs.slice(0, 20));
    
    // Update user profile with extracted data
    await User.findByIdAndUpdate(req.user.id, {
      skills: cvData.skills,
      'profile.experience': cvData.experience.totalYears
    });
    
    res.json({
      success: true,
      data: {
        extractedData: {
          skills: cvData.skills,
          experience: cvData.experience,
          education: cvData.education,
          contact: cvData.contact,
          summary: cvData.summary
        },
        matchedJobs: topMatches,
        skillGaps: skillGapAnalysis,
        statistics: {
          totalSkillsFound: cvData.skills.length,
          yearsOfExperience: cvData.experience.totalYears,
          averageMatchScore: Math.round(
            topMatches.reduce((sum, job) => sum + job.matchPercentage, 0) / topMatches.length
          )
        }
      }
    });
    
  } catch (error) {
    console.error('CV Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing CV',
      error: error.message
    });
  }
});

// Calculate detailed match between CV and Job
function calculateDetailedMatch(cvData, job) {
  let totalScore = 0;
  const reasons = [];
  const skillsMatched = [];
  const skillsMissing = [];
  
  // 1. Skills Match (50% weight)
  const cvSkillNames = cvData.skills.map(s => s.name.toLowerCase());
  const jobSkillNames = job.requiredSkills.map(s => s.name.toLowerCase());
  
  const matchedSkillsSet = jobSkillNames.filter(skill => 
    cvSkillNames.includes(skill)
  );
  
  const missingSkillsSet = jobSkillNames.filter(skill => 
    !cvSkillNames.includes(skill)
  );
  
  matchedSkillsSet.forEach(skill => {
    const cvSkill = cvData.skills.find(s => s.name.toLowerCase() === skill);
    const jobSkill = job.requiredSkills.find(s => s.name.toLowerCase() === skill);
    skillsMatched.push({
      name: jobSkill.name,
      yourLevel: cvSkill.level,
      requiredLevel: jobSkill.level
    });
  });
  
  missingSkillsSet.forEach(skill => {
    const jobSkill = job.requiredSkills.find(s => s.name.toLowerCase() === skill);
    skillsMissing.push({
      name: jobSkill.name,
      requiredLevel: jobSkill.level,
      required: jobSkill.required
    });
  });
  
  const skillMatchScore = jobSkillNames.length > 0 
    ? (matchedSkillsSet.length / jobSkillNames.length) * 50 
    : 0;
  
  totalScore += skillMatchScore;
  
  if (matchedSkillsSet.length > 0) {
    reasons.push(`Strong match: ${matchedSkillsSet.length} out of ${jobSkillNames.length} required skills`);
  }
  
  // 2. Experience Match (25% weight)
  const experienceLevels = { entry: 0, mid: 2, senior: 5, lead: 8, executive: 10 };
  const jobExpYears = experienceLevels[job.experienceLevel] || 0;
  const cvExpYears = cvData.experience.totalYears;
  
  let experienceScore = 0;
  if (cvExpYears >= jobExpYears) {
    experienceScore = 25;
    reasons.push(`Experience level matches: ${cvExpYears} years meets ${job.experienceLevel} requirement`);
  } else {
    experienceScore = (cvExpYears / jobExpYears) * 25;
    reasons.push(`Experience: ${cvExpYears} years (${job.experienceLevel} level typically requires ${jobExpYears}+ years)`);
  }
  
  totalScore += experienceScore;
  
  // 3. Education Match (15% weight)
  let educationScore = 15; // Default if education found
  if (cvData.education.length > 0) {
    reasons.push('Educational qualifications verified');
  }
  totalScore += educationScore;
  
  // 4. Technical Breadth (10% weight)
  const breadthScore = Math.min((cvData.skills.length / 10) * 10, 10);
  totalScore += breadthScore;
  
  if (cvData.skills.length >= 8) {
    reasons.push(`Diverse technical skillset: ${cvData.skills.length} skills identified`);
  }
  
  return {
    percentage: Math.round(Math.min(totalScore, 100)),
    reasons: reasons,
    skillsMatched: skillsMatched,
    skillsMissing: skillsMissing
  };
}

// Analyze skill gaps across top jobs
function analyzeSkillGaps(userSkills, topJobs) {
  const skillFrequency = new Map();
  
  topJobs.forEach(job => {
    job.requiredSkills.forEach(skill => {
      const skillName = skill.name.toLowerCase();
      const userHasSkill = userSkills.some(s => s.name.toLowerCase() === skillName);
      
      if (!userHasSkill) {
        if (skillFrequency.has(skillName)) {
          const current = skillFrequency.get(skillName);
          skillFrequency.set(skillName, {
            count: current.count + 1,
            importance: skill.required ? 'High' : current.importance,
            level: skill.level
          });
        } else {
          skillFrequency.set(skillName, {
            count: 1,
            importance: skill.required ? 'High' : 'Medium',
            level: skill.level
          });
        }
      }
    });
  });
  
  return Array.from(skillFrequency.entries())
    .map(([skill, data]) => ({
      skill: skill.charAt(0).toUpperCase() + skill.slice(1),
      importance: data.importance,
      appearsIn: data.count,
      recommendedLevel: data.level,
      progress: 0
    }))
    .sort((a, b) => b.appearsIn - a.appearsIn)
    .slice(0, 8);
}

module.exports = router;