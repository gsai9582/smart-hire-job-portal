/**
 * User Model
 * Supports jobseeker, recruiter, and admin roles
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['jobseeker', 'recruiter', 'admin'],
    default: 'jobseeker'
  },
  avatar: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },

  // ── Job Seeker specific fields ──
  resume: {
    type: String,
    default: null
  },
  skills: [String],
  experience: {
    type: String,
    enum: ['fresher', '1-2 years', '2-5 years', '5-10 years', '10+ years'],
    default: 'fresher'
  },
  education: {
    degree: String,
    institution: String,
    year: String
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],

  // ── Recruiter specific fields ──
  company: {
    name: String,
    website: String,
    description: String,
    logo: String,
    industry: String,
    size: String
  },

  // ── OTP fields ──
  otp: String,
  otpExpire: Date,

  // ── Password Reset ──
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  lastLogin: Date,
}, {
  timestamps: true
});

// ─── Hash password before save ─────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Compare password method ───────────────────────────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── Generate OTP ──────────────────────────────────────────────────────────
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpire = new Date(Date.now() + (process.env.OTP_EXPIRE || 10) * 60 * 1000);
  return otp;
};

// ─── SQL Synchronization ────────────────────────────────────────────────────
const { syncUser } = require('../utils/sqlSync');

userSchema.post('save', async function(doc) {
  await syncUser(doc);
});

module.exports = mongoose.model('User', userSchema);
