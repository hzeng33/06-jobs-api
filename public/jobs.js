import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let jobsDiv = null;
let jobsTable = null;
let jobsTableHeader = null;

export const handleJobs = () => {
  jobsDiv = document.getElementById("jobs");
  const logoff = document.getElementById("logoff");
  const addJob = document.getElementById("add-job");
  jobsTable = document.getElementById("jobs-table");
  jobsTableHeader = document.getElementById("jobs-table-header");

  jobsDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addJob) {
        showAddEdit();
      } else if (e.target === logoff) {
        setToken(null);
        message.textContent = "You have been logged off.";
        jobsTable.replaceChildren([jobsTableHeader]);
        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = ""; // Clear any previous messages
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        message.textContent = "";
        deleteJob(e.target.dataset.id);
      }
    }
  });
};

export const showJobs = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/jobs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [jobsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        jobsTable.replaceChildren(...children);
      } else {
        for (let i = 0; i < data.jobs.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.jobs[i]._id}>Edit</button></td>`;

          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.jobs[i]._id}>Delete</button></td>`;

          let rowHTML = `
          <td>${data.jobs[i].company}</td>
          <td>${data.jobs[i].position}</td>
          <td>${data.jobs[i].status}</td>
          <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        jobsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (error) {
    console.error(error);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(jobsDiv);
};

const deleteJob = async (jobId) => {
  enableInput(false);

  try {
    const response = await fetch(`api/v1/jobs/${jobId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      message.textContent = `Successfully deleted the job with the id of ${jobId}`;

      await showJobs();
    } else {
      const data = await response.json();
      message.textContent = data.msg;
    }
  } catch (error) {
    console.error(error);
    message.textContent = "A communication error occurred.";
  }

  enableInput(true);
};
