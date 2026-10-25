const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db_sql');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  responsibilities: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  company: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'remote', 'freelance'),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('technology', 'design', 'marketing', 'finance', 'healthcare', 'education', 'sales', 'hr', 'operations', 'other'),
    allowNull: false,
  },
  experience: {
    type: DataTypes.ENUM('fresher', '1-2 years', '2-5 years', '5-10 years', '10+ years'),
    allowNull: false,
  },
  salary: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'closed', 'draft', 'paused'),
    defaultValue: 'active',
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  openings: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  applicantsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = Job;
