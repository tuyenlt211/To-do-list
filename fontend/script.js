let API_URL = "http://localhost:5000/api/todos";
let currentFilter = 'all';
let sortByDeadline = false;

async function fetchTasks() {
  const res = await fetch(API_URL);
  return await res.json();
}

async function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const deadline = document.getElementById("deadline").value;
  const tag = document.getElementById("tag").value;
  if (!text) return alert("Vui lòng nhập công việc");

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, deadline, tag })
  });

  document.getElementById("taskInput").value = '';
  document.getElementById("deadline").value = '';
  renderTasks();
}

async function toggleTask(id) {
  await fetch(`${API_URL}/${id}/toggle`, { method: "PUT" });
  renderTasks();
}

async function deleteTask(id) {
  if (!confirm("Bạn có chắc muốn xóa công việc này?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  renderTasks();
}

function filterTasks(type) {
  currentFilter = type;
  renderTasks();
}

function toggleSortByDeadline() {
  sortByDeadline = !sortByDeadline;
  renderTasks();
}

async function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = '';
  const tasks = await fetchTasks();

  let filtered = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  if (sortByDeadline) {
    filtered.sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }

  const grouped = {};
  filtered.forEach(task => {
    const key = task.tag || "Không phân loại";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(task);
  });

  for (const tag in grouped) {
    const header = document.createElement("h4");
    header.textContent = tag;
    list.appendChild(header);

    grouped[tag].forEach(task => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      const span = document.createElement("span");
      span.textContent = task.text;
      span.onclick = () => toggleTask(task.id);

      if (task.tag) {
        const tagEl = document.createElement("span");
        tagEl.className = "tag";
        tagEl.textContent = task.tag;
        span.appendChild(tagEl);
      }

      if (task.deadline) {
        const now = new Date();
        const deadlineDate = new Date(task.deadline);
        const dl = document.createElement("span");
        dl.className = "deadline";
        dl.textContent = ' ⏰ ' + deadlineDate.toLocaleString();

        if (deadlineDate < now && !task.completed) {
          dl.style.color = 'red';
        }

        span.appendChild(dl);
      }

      const btn = document.createElement("button");
      btn.textContent = "🗑";
      btn.onclick = () => deleteTask(task.id);

      li.appendChild(span);
      li.appendChild(btn);
      list.appendChild(li);
    });
  }
}

function toggleTheme() {
  const theme = document.body.getAttribute('data-theme') === 'dark' ? '' : 'dark';
  document.body.setAttribute('data-theme', theme);
}

renderTasks();
