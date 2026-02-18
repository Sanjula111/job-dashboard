const pdfParse = require('pdf-parse');
const natural = require('natural');

// Comprehensive skill database
const TECH_SKILLS = [
  // Programming Languages
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Rust', 'TypeScript', 'Scala', 'R',
  
  // Frontend
  'React', 'Vue', 'Angular', 'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'SASS', 'jQuery', 'Next.js', 'Gatsby', 'Svelte',
  
  // Backend
  'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'FastAPI',
  
  // Databases
  'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Cassandra', 'Oracle', 'SQL Server', 'SQLite', 'Firebase',
  
  // DevOps & Cloud
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Git', 'GitHub', 'GitLab',
  
  // Design & Tools
  'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX', 'Wireframing', 'Prototyping',
  
  // Data & AI
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Pandas', 'NumPy', 'Scikit-learn',
  
  // Mobile
  'React Native', 'Flutter', 'iOS', 'Android', 'Xamarin',
  
  // Other
  'GraphQL', 'REST API', 'Microservices', 'Agile', 'Scrum', 'Testing', 'Jest', 'Selenium', 'Blockchain'
];

class CVParser {
  
  async parseCV(fileBuffer) {
    try {
      // Extract text from PDF
      const data = await pdfParse(fileBuffer);
      const text = data.text;
      
      // Parse different sections
      const skills = this.extractSkills(text);
      const experience = this.extractExperience(text);
      const education = this.extractEducation(text);
      const contact = this.extractContact(text);
      
      return {
        rawText: text,
        skills,
        experience,
        education,
        contact,
        summary: this.generateSummary(text, skills, experience)
      };
      
    } catch (error) {
      console.error('CV Parsing Error:', error);
      throw new Error('Failed to parse CV');
    }
  }
  
  extractSkills(text) {
    const foundSkills = [];
    const lowerText = text.toLowerCase();
    
    TECH_SKILLS.forEach(skill => {
      const skillLower = skill.toLowerCase();
      
      // Check if skill exists in text (with word boundaries)
      const regex = new RegExp(`\\b${skillLower}\\b`, 'gi');
      const matches = text.match(regex);
      
      if (matches && matches.length > 0) {
        // Determine proficiency level based on context
        const level = this.determineSkillLevel(text, skill);
        
        foundSkills.push({
          name: skill,
          level: level,
          yearsOfExperience: this.estimateYearsOfExperience(text, skill)
        });
      }
    });
    
    return foundSkills;
  }
  
  determineSkillLevel(text, skill) {
    const lowerText = text.toLowerCase();
    const skillLower = skill.toLowerCase();
    
    // Keywords indicating expertise level
    const expertKeywords = ['expert', 'advanced', 'senior', 'lead', 'architect', 'proficient'];
    const intermediateKeywords = ['intermediate', 'solid', 'working knowledge', 'familiar'];
    const beginnerKeywords = ['beginner', 'basic', 'learning', 'exposure'];
    
    // Check context around the skill mention
    const contextWindow = 100; // characters
    const skillIndex = lowerText.indexOf(skillLower);
    
    if (skillIndex !== -1) {
      const start = Math.max(0, skillIndex - contextWindow);
      const end = Math.min(lowerText.length, skillIndex + contextWindow);
      const context = lowerText.substring(start, end);
      
      if (expertKeywords.some(kw => context.includes(kw))) return 'expert';
      if (intermediateKeywords.some(kw => context.includes(kw))) return 'intermediate';
      if (beginnerKeywords.some(kw => context.includes(kw))) return 'beginner';
    }
    
    return 'intermediate'; // default
  }
  
  estimateYearsOfExperience(text, skill) {
    const lowerText = text.toLowerCase();
    const skillLower = skill.toLowerCase();
    
    // Look for patterns like "5 years of React", "3+ years experience with Python"
    const yearPatterns = [
      new RegExp(`(\\d+)\\+?\\s*years?.*${skillLower}`, 'i'),
      new RegExp(`${skillLower}.*(\\d+)\\+?\\s*years?`, 'i')
    ];
    
    for (const pattern of yearPatterns) {
      const match = text.match(pattern);
      if (match) {
        return parseInt(match[1]);
      }
    }
    
    return 1; // default
  }
  
  extractExperience(text) {
    const lines = text.split('\n');
    let totalYears = 0;
    const positions = [];
    
    // Look for year patterns (2020-2023, 2020-Present, etc.)
    const yearPattern = /(\d{4})\s*[-–—]\s*(\d{4}|present|current)/gi;
    const matches = text.match(yearPattern);
    
    if (matches) {
      matches.forEach(match => {
        const years = match.match(/\d{4}/g);
        if (years) {
          const startYear = parseInt(years[0]);
          const endYear = years[1] ? parseInt(years[1]) : new Date().getFullYear();
          totalYears += (endYear - startYear);
        }
      });
    }
    
    // Look for job titles
    const titleKeywords = ['developer', 'engineer', 'designer', 'manager', 'analyst', 'specialist', 'consultant', 'architect', 'lead', 'senior', 'junior'];
    
    lines.forEach((line, index) => {
      const lowerLine = line.toLowerCase();
      if (titleKeywords.some(keyword => lowerLine.includes(keyword))) {
        positions.push({
          title: line.trim(),
          context: lines.slice(Math.max(0, index - 1), Math.min(lines.length, index + 3)).join(' ')
        });
      }
    });
    
    return {
      totalYears: Math.max(totalYears, 0),
      positions: positions.slice(0, 5) // Top 5 positions
    };
  }
  
  extractEducation(text) {
    const education = [];
    const degreeKeywords = [
      'bachelor', 'master', 'phd', 'doctorate', 'mba', 'b.sc', 'm.sc', 'b.tech', 'm.tech', 
      'b.e', 'm.e', 'diploma', 'associate', 'certification'
    ];
    
    const lines = text.split('\n');
    
    lines.forEach((line, index) => {
      const lowerLine = line.toLowerCase();
      if (degreeKeywords.some(keyword => lowerLine.includes(keyword))) {
        education.push({
          degree: line.trim(),
          context: lines.slice(Math.max(0, index), Math.min(lines.length, index + 2)).join(' ')
        });
      }
    });
    
    return education;
  }
  
  extractContact(text) {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const linkedinRegex = /(linkedin\.com\/in\/[\w-]+)/gi;
    const githubRegex = /(github\.com\/[\w-]+)/gi;
    
    return {
      email: text.match(emailRegex)?.[0] || null,
      phone: text.match(phoneRegex)?.[0] || null,
      linkedin: text.match(linkedinRegex)?.[0] || null,
      github: text.match(githubRegex)?.[0] || null
    };
  }
  
  generateSummary(text, skills, experience) {
    const skillCount = skills.length;
    const expYears = experience.totalYears;
    
    let summary = '';
    
    if (expYears > 5) {
      summary = `Experienced professional with ${expYears}+ years in the industry. `;
    } else if (expYears > 2) {
      summary = `Mid-level professional with ${expYears} years of experience. `;
    } else {
      summary = `Entry-level professional `;
    }
    
    if (skillCount > 10) {
      summary += `Highly skilled with expertise in ${skillCount}+ technologies. `;
    } else if (skillCount > 5) {
      summary += `Skilled in ${skillCount} key technologies. `;
    }
    
    const topSkills = skills.slice(0, 5).map(s => s.name).join(', ');
    summary += `Strong background in ${topSkills}.`;
    
    return summary;
  }
}

module.exports = new CVParser();