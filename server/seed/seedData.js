const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Job = require('../models/Job');

dotenv.config();

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    profile: {
      title: 'Senior Product Designer',
      location: 'San Francisco, CA',
      bio: 'Passionate designer with 5 years of experience',
      experience: 5,
      expectedSalary: { min: 120000, max: 150000 }
    },
    skills: [
      { name: 'UI/UX', level: 'expert', yearsOfExperience: 5 },
      { name: 'Figma', level: 'expert', yearsOfExperience: 4 },
      { name: 'Design Systems', level: 'advanced', yearsOfExperience: 3 },
      { name: 'User Research', level: 'advanced', yearsOfExperience: 4 }
    ],
    preferences: {
      jobTypes: ['full-time', 'remote'],
      locations: ['San Francisco, CA', 'Remote'],
      industries: ['Technology', 'Startups'],
      salaryRange: { min: 120000, max: 160000 }
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'recruiter',
    profile: {
      title: 'Tech Recruiter',
      location: 'New York, NY',
      bio: 'Helping companies find great talent'
    }
  }
];

const sampleJobs = [
  {
    title: 'Senior Product Designer',
    company: 'Aurora Labs',
    description: 'We are looking for a Senior Product Designer to join our growing team...',
    requirements: 'Strong portfolio, 5+ years experience, expertise in Figma and design systems',
    responsibilities: 'Lead design projects, mentor junior designers, collaborate with product team',
    location: 'San Francisco, CA',
    locationType: 'hybrid',
    jobType: 'full-time',
    salary: { min: 120000, max: 160000, currency: 'USD' },
    experienceLevel: 'senior',
    requiredSkills: [
      { name: 'UI/UX', level: 'advanced', required: true },
      { name: 'Figma', level: 'advanced', required: true },
      { name: 'Design Systems', level: 'intermediate', required: true },
      { name: 'User Research', level: 'intermediate', required: false }
    ],
    benefits: ['Health Insurance', '401k', 'Remote Work', 'Unlimited PTO'],
    industry: 'Technology',
    companySize: '51-200',
    featured: true,
    status: 'active'
  },
  {
    title: 'Lead UX Researcher',
    company: 'Nexus Digital',
    description: 'Join our UX research team to drive product insights...',
    requirements: 'PhD or Masters in HCI, 7+ years experience, strong analytical skills',
    responsibilities: 'Conduct user research, analyze data, present findings to stakeholders',
    location: 'Remote',
    locationType: 'remote',
    jobType: 'full-time',
    salary: { min: 130000, max: 170000, currency: 'USD' },
    experienceLevel: 'senior',
    requiredSkills: [
      { name: 'User Research', level: 'expert', required: true },
      { name: 'Data Analysis', level: 'advanced', required: true },
      { name: 'Usability Testing', level: 'advanced', required: true }
    ],
    benefits: ['Flexible Hours', 'Professional Development', 'Stock Options'],
    industry: 'Technology',
    companySize: '201-500',
    featured: false,
    status: 'active'
  },
  {
    title: 'Product Design Manager',
    company: 'Zenith Tech',
    description: 'Lead a team of talented designers in creating innovative products...',
    requirements: '8+ years design experience, 3+ years management experience',
    responsibilities: 'Manage design team, set design vision, work with executives',
    location: 'New York, NY',
    locationType: 'onsite',
    jobType: 'full-time',
    salary: { min: 140000, max: 180000, currency: 'USD' },
    experienceLevel: 'lead',
    requiredSkills: [
      { name: 'Leadership', level: 'advanced', required: true },
      { name: 'Design Systems', level: 'expert', required: true },
      { name: 'Figma', level: 'advanced', required: true },
      { name: 'Mentoring', level: 'advanced', required: true }
    ],
    benefits: ['Relocation Assistance', 'Gym Membership', 'Catered Meals'],
    industry: 'Technology',
    companySize: '1000+',
    featured: false,
    status: 'active'
  },
  {
    title: 'UX/UI Designer',
    company: 'Catalyst Creative',
    description: 'Creative agency seeking a talented UX/UI designer...',
    requirements: '3+ years experience, strong portfolio, client-facing experience',
    responsibilities: 'Design user interfaces, create prototypes, present to clients',
    location: 'Austin, TX',
    locationType: 'hybrid',
    jobType: 'full-time',
    salary: { min: 100000, max: 130000, currency: 'USD' },
    experienceLevel: 'mid',
    requiredSkills: [
      { name: 'UI/UX', level: 'advanced', required: true },
      { name: 'Prototyping', level: 'intermediate', required: true },
      { name: 'Figma', level: 'advanced', required: true }
    ],
    benefits: ['Creative Freedom', 'Portfolio Building', 'Team Events'],
    industry: 'Creative Agency',
    companySize: '11-50',
    featured: false,
    status: 'active'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/job-matching');
    console.log('✅ MongoDB Connected');

    await User.deleteMany({});
    await Job.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const users = await User.create(sampleUsers);
    console.log(`✅ Created ${users.length} users`);

    for (const user of users) {
      user.calculateProfileStrength();
      await user.save();
    }

    const recruiter = users.find(u => u.role === 'recruiter');

    const jobsWithPostedBy = sampleJobs.map(job => ({
      ...job,
      postedBy: recruiter._id
    }));

    const jobs = await Job.create(jobsWithPostedBy);
    console.log(`✅ Created ${jobs.length} jobs`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSample Login:');
    console.log('Email: john@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();