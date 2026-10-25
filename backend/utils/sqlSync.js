const { User, Job, Application, Notification } = require('../models_sql');

/**
 * SQL Synchronization Utility
 * Replicates MongoDB data changes to SQL in real-time
 */

const syncUser = async (mongoUser) => {
  try {
    const data = mongoUser.toObject ? mongoUser.toObject() : mongoUser;
    // Map _id to id
    data.id = data._id.toString();
    delete data._id;
    delete data.__v;

    const [userInstance] = await User.upsert(data);
    
    // Handle Many-to-Many savedJobs
    if (data.savedJobs && Array.isArray(data.savedJobs)) {
      await userInstance.setSavedJobs(data.savedJobs.map(id => id.toString()));
    }
  } catch (err) {
    console.error('❌ SQL Sync Error (User):', err.message);
  }
};

const syncJob = async (mongoJob) => {
  try {
    const data = mongoJob.toObject ? mongoJob.toObject() : mongoJob;
    data.id = data._id.toString();
    data.recruiterId = data.recruiter.toString();
    delete data._id;
    delete data.__v;
    delete data.recruiter;

    await Job.upsert(data);
    // console.log(`🔄 Synced Job to SQL: ${data.title}`);
  } catch (err) {
    console.error('❌ SQL Sync Error (Job):', err.message);
  }
};

const syncApplication = async (mongoApp) => {
  try {
    const data = mongoApp.toObject ? mongoApp.toObject() : mongoApp;
    data.id = data._id.toString();
    data.jobId = data.job.toString();
    data.applicantId = data.applicant.toString();
    data.recruiterId = data.recruiter.toString();
    delete data._id;
    delete data.__v;
    delete data.job;
    delete data.applicant;
    delete data.recruiter;

    await Application.upsert(data);
    // console.log(`🔄 Synced Application to SQL: ${data.id}`);
  } catch (err) {
    console.error('❌ SQL Sync Error (Application):', err.message);
  }
};

const syncNotification = async (mongoNotif) => {
  try {
    const data = mongoNotif.toObject ? mongoNotif.toObject() : mongoNotif;
    data.id = data._id.toString();
    data.recipientId = data.recipient.toString();
    delete data._id;
    delete data.__v;
    delete data.recipient;

    await Notification.upsert(data);
  } catch (err) {
    console.error('❌ SQL Sync Error (Notification):', err.message);
  }
};

const deleteFromSQL = async (Model, id) => {
  try {
    await Model.destroy({ where: { id: id.toString() } });
  } catch (err) {
    console.error('❌ SQL Delete Error:', err.message);
  }
};

module.exports = {
  syncUser,
  syncJob,
  syncApplication,
  syncNotification,
  deleteFromSQL
};
