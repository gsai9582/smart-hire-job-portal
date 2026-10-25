/**
 * Application Model
 * Tracks job applications with status pipeline
 */

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'viewed', 'shortlisted', 'interview', 'rejected', 'hired'],
    default: 'applied'
  },
  resume: {
    type: String, // Path to uploaded resume
    required: true
  },
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },
  expectedSalary: Number,
  note: String, // Recruiter's internal note
  interviewDate: Date,
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    note: String
  }]
}, {
  timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Notification Model
 */
const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'application_received',   // Recruiter gets this
      'application_viewed',
      'application_shortlisted',
      'application_rejected',
      'application_hired',
      'job_posted',
      'job_closed',
      'new_message',
      'profile_update',
      'system'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: String,           // Frontend route to navigate to
  isRead: { type: Boolean, default: false },
  data: mongoose.Schema.Types.Mixed, // Extra payload
}, {
  timestamps: true
});

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

// ─── SQL Synchronization ────────────────────────────────────────────────────
const { syncApplication, syncNotification } = require('../utils/sqlSync');

applicationSchema.post('save', async function(doc) {
  await syncApplication(doc);
});

notificationSchema.post('save', async function(doc) {
  await syncNotification(doc);
});

module.exports = { Application, Notification };
