const getAllJobs = async (req, res) => {
  res.send("Get all jobs");
};

const getJob = async (req, res) => {
  res.send("Get the job");
};

const createJob = async (req, res) => {
  res.send("Create the job");
};

const updateJob = async (req, res) => {
  res.send("Update the job");
};

const deleteJob = async (req, res) => {
  res.send("Delete the job");
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
