import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from './storage';
import { insertUserSchema, insertJobSchema, insertRatingSchema, insertMessageSchema } from '../shared/schema';
import { z } from 'zod';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'poolpal-secret-key';

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ========== AUTH ROUTES ==========

// Register user
router.post('/auth/register', async (req, res) => {
  try {
    const userData = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await storage.createUser({
      ...userData,
      password: hashedPassword,
    });

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        isCleaner: user.isCleaner 
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Invalid user data' });
  }
});

// Login user
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        isCleaner: user.isCleaner 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========== USER ROUTES ==========

// Get current user profile
router.get('/user/me', authenticateToken, async (req: any, res) => {
  try {
    const user = await storage.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't send password
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/user/me', authenticateToken, async (req: any, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password updates here
    
    const user = await storage.updateUser(req.user.userId, updates);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all cleaners
router.get('/cleaners', async (req, res) => {
  try {
    const cleaners = await storage.getAllCleaners();
    res.json(cleaners.map(cleaner => {
      const { password, ...cleanerProfile } = cleaner;
      return cleanerProfile;
    }));
  } catch (error) {
    console.error('Get cleaners error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========== JOB ROUTES ==========

// Create new job
router.post('/jobs', authenticateToken, async (req: any, res) => {
  try {
    const jobData = insertJobSchema.parse({
      ...req.body,
      customerId: req.user.userId,
    });
    
    const job = await storage.createJob(jobData);
    res.json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(400).json({ error: 'Invalid job data' });
  }
});

// Get all open jobs
router.get('/jobs/open', async (req, res) => {
  try {
    const jobs = await storage.getOpenJobs();
    res.json(jobs);
  } catch (error) {
    console.error('Get open jobs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's jobs (customer or cleaner)
router.get('/jobs/my', authenticateToken, async (req: any, res) => {
  try {
    const user = await storage.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let jobs;
    if (user.isCleaner) {
      jobs = await storage.getJobsByCleaner(req.user.userId);
    } else {
      jobs = await storage.getJobsByCustomer(req.user.userId);
    }
    
    res.json(jobs);
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific job
router.get('/jobs/:id', authenticateToken, async (req: any, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const job = await storage.getJobById(jobId);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept job (cleaner only)
router.post('/jobs/:id/accept', authenticateToken, async (req: any, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const user = await storage.getUserById(req.user.userId);
    
    if (!user || !user.isCleaner) {
      return res.status(403).json({ error: 'Only cleaners can accept jobs' });
    }

    const job = await storage.updateJob(jobId, {
      cleanerId: req.user.userId,
      status: 'accepted',
    });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Accept job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update job status
router.put('/jobs/:id/status', authenticateToken, async (req: any, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const { status } = req.body;
    
    const job = await storage.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Check permissions
    if (job.customerId !== req.user.userId && job.cleanerId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const updatedJob = await storage.updateJob(jobId, { status });
    res.json(updatedJob);
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========== RATING ROUTES ==========

// Create rating
router.post('/ratings', authenticateToken, async (req: any, res) => {
  try {
    const ratingData = insertRatingSchema.parse({
      ...req.body,
      fromUserId: req.user.userId,
    });
    
    const rating = await storage.createRating(ratingData);
    res.json(rating);
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(400).json({ error: 'Invalid rating data' });
  }
});

// Get ratings for a user
router.get('/ratings/user/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const ratings = await storage.getRatingsByUser(userId);
    res.json(ratings);
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========== MESSAGE ROUTES ==========

// Create message
router.post('/messages', authenticateToken, async (req: any, res) => {
  try {
    const messageData = insertMessageSchema.parse({
      ...req.body,
      fromUserId: req.user.userId,
    });
    
    const message = await storage.createMessage(messageData);
    res.json(message);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(400).json({ error: 'Invalid message data' });
  }
});

// Get messages for a job
router.get('/messages/job/:id', authenticateToken, async (req: any, res) => {
  try {
    const jobId = parseInt(req.params.id);
    
    // Check if user has access to this job
    const job = await storage.getJobById(jobId);
    if (!job || (job.customerId !== req.user.userId && job.cleanerId !== req.user.userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const messages = await storage.getMessagesByJob(jobId);
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;