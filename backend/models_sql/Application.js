const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db_sql');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('applied', 'viewed', 'shortlisted', 'interview', 'rejected', 'hired'),
    defaultValue: 'applied',
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  expectedSalary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  interviewDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  statusHistory: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  timestamps: true,
});

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = { Application, Notification };
