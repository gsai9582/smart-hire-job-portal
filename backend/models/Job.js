/**
 * Job Model
 * Full job posting schema with location, salary, filters
 */

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  requirements: [String],
  responsibilities: [String],
  skills: [String],

  // ── Company/Recruiter ──
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    name: { type: String, required: true },
    logo: String,
    website: String
  },

  // ── Job Details ──
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote', 'freelance'],
    required: true
  },
  category: {
    type: String,
    enum: ['technology', 'design', 'marketing', 'finance', 'healthcare', 'education', 'sales', 'hr', 'operations', 'other'],
    required: true
  },
  experience: {
    type: String,
    enum: ['fresher', '1-2 years', '2-5 years', '5-10 years', '10+ years'],
    required: true
  },

  // ── Salary ──
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' },
    period: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' },
    isNegotiable: { type: Boolean, default: false }
  },

  // ── Location ──
  location: {
    city: String,
    state: String,
    country: { type: String, default: 'India' },
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    isRemote: { type: Boolean, default: false }
  },

  // ── Status ──
  status: {
    type: String,
    enum: ['active', 'closed', 'draft', 'paused'],
    default: 'active'
  },
  deadline: Date,
  openings: { type: Number, default: 1 },
  applicantsCount: { type: Number, default: 0 },

  // ── Tags & SEO ──
  tags: [String],
  views: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
}, {
  timestamps: true
});

// Index for search
jobSchema.index({ title: 'text', description: 'text', 'company.name': 'text', tags: 'text' });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ 'location.city': 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ type: 1 });

// ─── SQL Synchronization ────────────────────────────────────────────────────
const { syncJob, deleteFromSQL } = require('../utils/sqlSync');
const { Job: JobSQL } = require('../models_sql');

jobSchema.post('save', async function(doc) {
  await syncJob(doc);
});

jobSchema.post('findOneAndDelete', async function(doc) {
  if (doc) await deleteFromSQL(require('../models_sql').Job, doc._id);
});

module.exports = mongoose.model('Job', jobSchema);
