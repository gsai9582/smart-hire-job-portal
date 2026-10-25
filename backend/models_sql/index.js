const User = require('./User');
const Job = require('./Job');
const { Application, Notification } = require('./Application');

// Associations

// Job <-> User (Recruiter)
User.hasMany(Job, { foreignKey: 'recruiterId', as: 'postedJobs' });
Job.belongsTo(User, { foreignKey: 'recruiterId', as: 'recruiter' });

// Application <-> Job
Job.hasMany(Application, { foreignKey: 'jobId' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// Application <-> User (Applicant)
User.hasMany(Application, { foreignKey: 'applicantId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'applicantId', as: 'applicant' });

// Application <-> User (Recruiter)
User.hasMany(Application, { foreignKey: 'recruiterId', as: 'managedApplications' });
Application.belongsTo(User, { foreignKey: 'recruiterId', as: 'recruiter' });

// Notification <-> User
User.hasMany(Notification, { foreignKey: 'recipientId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });

// Saved Jobs (Many-to-Many)
User.belongsToMany(Job, { through: 'UserSavedJobs', as: 'savedJobs' });
Job.belongsToMany(User, { through: 'UserSavedJobs' });

module.exports = {
  User,
  Job,
  Application,
  Notification,
};
