const { haikuQueue, sonnetQueue } = require("../../../../queue/tarotQueue");
const AppError = require("../../../../common/errors/AppError");

const getJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return next(new AppError("ValidationError", "Job ID is required", 400));
    }

    let job = await haikuQueue.getJob(jobId);
    if (!job) {
      job = await sonnetQueue.getJob(jobId);
    }

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const state = await job.getState();
    const result = job.returnvalue;
    const progress = job.progress();
    const reason = job.failedReason;

    res.status(200).json({
      success: true,
      jobId,
      state, // "completed", "failed", "delayed", "active", "waiting"
      progress,
      result: state === "completed" ? result : null,
      error: state === "failed" ? reason : null,
    });
  } catch (err) {
    next(new AppError("JobStatusError", err.message, 500));
  }
};

module.exports = getJobStatus;
