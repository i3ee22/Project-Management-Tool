let projects = JSON.parse(localStorage.getItem('projects')) || [];

function saveProjects() {
  localStorage.setItem('projects', JSON.stringify(projects));
}

function addProject() {
  const nameInput = document.getElementById('projectName');
  const name = nameInput.value.trim();
  if (!name) return alert("Project name is required.");

  projects.push({ name, tasks: [] });
  nameInput.value = '';
  saveProjects();
  renderProjects();
}

function addTask(projectIndex) {
  const taskName = prompt("Enter task name:");
  const deadline = prompt("Enter deadline (YYYY-MM-DD):");
  if (taskName && deadline) {
    projects[projectIndex].tasks.push({
      name: taskName,
      deadline,
      status: 'Pending'
    });
    saveProjects();
    renderProjects();
  }
}

function changeStatus(projectIndex, taskIndex) {
  const task = projects[projectIndex].tasks[taskIndex];
  const statusOrder = ['Pending', 'In Progress', 'Completed'];
  const nextStatus = statusOrder[(statusOrder.indexOf(task.status) + 1) % 3];
  task.status = nextStatus;
  saveProjects();
  renderProjects();
}

function getStatusClass(status) {
  if (status === 'Pending') return 'status-pending';
  if (status === 'In Progress') return 'status-inprogress';
  if (status === 'Completed') return 'status-completed';
  return '';
}

function calculateProgress(tasks) {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(task => task.status === 'Completed').length;
  return Math.round((completed / tasks.length) * 100);
}

function renderProjects() {
  const container = document.getElementById('projectContainer');
  container.innerHTML = '';

  projects.forEach((project, index) => {
    const progress = calculateProgress(project.tasks);
    const tasksHTML = project.tasks.map((task, i) => `
      <li class="list-group-item d-flex justify-content-between">
        <div>
          <strong>${task.name}</strong><br>
          <small>Due: ${task.deadline}</small><br>
          <small class="${getStatusClass(task.status)}">Status: ${task.status}</small>
        </div>
        <button class="btn btn-sm btn-outline-secondary" onclick="changeStatus(${index}, ${i})">Next</button>
      </li>
    `).join('');

    const projectCard = `
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header d-flex justify-content-between">
            <h5>${project.name}</h5>
            <button class="btn btn-sm btn-success" onclick="addTask(${index})">+ Task</button>
          </div>
          <div class="card-body">
            <div class="progress mb-3">
              <div class="progress-bar bg-success" style="width: ${progress}%">${progress}%</div>
            </div>
            <ul class="list-group">${tasksHTML || '<li class="list-group-item">No tasks added</li>'}</ul>
          </div>
        </div>
      </div>
    `;

    container.innerHTML += projectCard;
  });
}

renderProjects();
