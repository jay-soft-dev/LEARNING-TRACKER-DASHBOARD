// Default Initial Roadmap Data aligned with user profile & roadmap
const defaultGoals = [
    {
        id: "1",
        title: "Python Steps 1 to 3 (Setup, Variables, Inputs & Operators)",
        category: "Python",
        status: "Done",
        deadline: "2026-11-15",
        desc: "Completed fundamental syntax, type conversions, expense tracker, and billing calculator scripts."
    },
    {
        id: "2",
        title: "Python Steps 4 to 9 (Control Flow, Loops, DSA, OOP & APIs)",
        category: "Python",
        status: "In Progress",
        deadline: "2026-12-15",
        desc: "Mastering conditional logic, functions, object-oriented concepts, and connecting AI APIs."
    },
    {
        id: "3",
        title: "FastAPI + AI API Integration (GenAI Chat & Summarizer)",
        category: "FullStack & AI",
        status: "Upcoming",
        deadline: "2026-12-30",
        desc: "Build backend endpoints in FastAPI integrating OpenAI/Gemini APIs for text intelligence."
    },
    {
        id: "4",
        title: "AWS Cloud Deployment & MLOps Pipeline",
        category: "AWS & Cloud",
        status: "Upcoming",
        deadline: "2027-01-20",
        desc: "Deploy full-stack applications and Python AI models onto AWS EC2 & S3 infrastructure."
    },
    {
        id: "5",
        title: "C++ Data Structures & Algorithms (DSA Mastery)",
        category: "C++ & DSA",
        status: "In Progress",
        deadline: "2027-01-30",
        desc: "Practicing arrays, linked lists, stacks, queues, and sorting algorithms for interviews."
    },
    {
        id: "6",
        title: "Professional Portfolio & Vercel Deployments",
        category: "Career & Projects",
        status: "Done",
        deadline: "2026-11-10",
        desc: "Successfully deployed Resume Editor, News Editorial CMS, and Portfolio Website on Vercel."
    }
];

let goals = JSON.parse(localStorage.getItem('jay_goal_command_center_data_2026')) || defaultGoals;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);
    renderDashboard();
});

// Real-time Clock & Date
function updateClock() {
    const now = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('live-date').innerText = now.toLocaleDateString('en-US', options);
    document.getElementById('live-clock').innerText = now.toLocaleTimeString('en-US');
}

// Render Dashboard
function renderDashboard() {
    const searchVal = document.getElementById('search-input').value.toLowerCase();
    const catVal = document.getElementById('category-filter').value;

    const filtered = goals.filter(g => {
        const matchesSearch = g.title.toLowerCase().includes(searchVal) || g.desc.toLowerCase().includes(searchVal);
        const matchesCat = catVal === 'ALL' || g.category === catVal;
        return matchesSearch && matchesCat;
    });

    const tbody = document.getElementById('goals-table-body');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
        document.getElementById('empty-state').classList.remove('hidden');
    } else {
        document.getElementById('empty-state').classList.add('hidden');
        filtered.forEach(goal => {
            let statusBadge = '';
            if (goal.status === 'Done') {
                statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><i class="fa-solid fa-circle-check text-[10px]"></i> Done</span>`;
            } else if (goal.status === 'In Progress') {
                statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><i class="fa-solid fa-bolt text-[10px]"></i> In Progress</span>`;
            } else {
                statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700"><i class="fa-solid fa-clock text-[10px]"></i> Upcoming</span>`;
            }

            let catBadgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            if (goal.category === 'FullStack & AI') catBadgeColor = 'bg-violet-500/10 text-violet-400 border-violet-500/20';
            if (goal.category === 'AWS & Cloud') catBadgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            if (goal.category === 'C++ & DSA') catBadgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            if (goal.category === 'Career & Projects') catBadgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

            const row = document.createElement('tr');
            row.className = 'hover:bg-slate-950/40 transition-colors group';
            row.innerHTML = `
                <td class="py-4 px-6 whitespace-nowrap">${statusBadge}</td>
                <td class="py-4 px-6">
                    <div class="font-semibold text-white group-hover:text-indigo-400 transition-colors">${goal.title}</div>
                    <div class="text-xs text-slate-400 mt-0.5 line-clamp-1">${goal.desc || 'No description provided.'}</div>
                </td>
                <td class="py-4 px-6 whitespace-nowrap">
                    <span class="px-2.5 py-1 rounded-lg text-xs font-medium border ${catBadgeColor}">${goal.category}</span>
                </td>
                <td class="py-4 px-6 whitespace-nowrap text-slate-300 font-mono text-xs">
                    <i class="fa-regular fa-calendar text-slate-500 mr-1.5"></i> ${goal.deadline}
                </td>
                <td class="py-4 px-6 text-right whitespace-nowrap">
                    <button onclick="editGoal('${goal.id}')" class="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white transition-all mr-1" title="Edit Goal">
                        <i class="fa-solid fa-pen text-xs"></i>
                    </button>
                    <button onclick="deleteGoal('${goal.id}')" class="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:bg-rose-600 hover:text-white transition-all" title="Delete Goal">
                        <i class="fa-solid fa-trash text-xs"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateKPIs();
    document.getElementById('goal-count-badge').innerText = `${filtered.length} items`;
}

// Update KPI Metrics
function updateKPIs() {
    const total = goals.length;
    const completed = goals.filter(g => g.status === 'Done').length;
    const inProgress = goals.filter(g => g.status === 'In Progress').length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('kpi-progress-text').innerText = `${pct}%`;
    document.getElementById('kpi-progress-bar').style.width = `${pct}%`;
    document.getElementById('kpi-completed').innerText = `${completed} / ${total}`;
    document.getElementById('kpi-completed-pct').innerText = `${pct}%`;
    document.getElementById('kpi-active').innerText = inProgress;

    const activeGoals = goals.filter(g => g.status !== 'Done' && g.deadline);
    if (activeGoals.length > 0) {
        activeGoals.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        const nearest = activeGoals[0];
        const diffTime = new Date(nearest.deadline) - new Date();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        document.getElementById('kpi-countdown').innerText = diffDays >= 0 ? `${diffDays} Days` : `Overdue`;
        document.getElementById('kpi-countdown-label').innerText = nearest.title;
    } else {
        document.getElementById('kpi-countdown').innerText = `0 Days`;
        document.getElementById('kpi-countdown-label').innerText = `All current goals completed!`;
    }

    localStorage.setItem('jay_goal_command_center_data_2026', JSON.stringify(goals));
}

function filterGoals() {
    renderDashboard();
}

function openModal(id = null) {
    document.getElementById('goal-modal').classList.remove('hidden');
    if (id) {
        const g = goals.find(item => item.id === id);
        document.getElementById('modal-title').innerHTML = `<i class="fa-solid fa-pen-to-square text-indigo-400"></i> Edit Goal`;
        document.getElementById('goal-id').value = g.id;
        document.getElementById('form-title').value = g.title;
        document.getElementById('form-category').value = g.category;
        document.getElementById('form-status').value = g.status;
        document.getElementById('form-deadline').value = g.deadline;
        document.getElementById('form-desc').value = g.desc;
    } else {
        document.getElementById('modal-title').innerHTML = `<i class="fa-solid fa-circle-plus text-indigo-400"></i> Add New Goal`;
        document.getElementById('goal-form').reset();
        document.getElementById('goal-id').value = '';
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 7);
        document.getElementById('form-deadline').value = tomorrow.toISOString().split('T')[0];
    }
}

function closeModal() {
    document.getElementById('goal-modal').classList.add('hidden');
}

function saveGoal(e) {
    e.preventDefault();
    const id = document.getElementById('goal-id').value;
    const title = document.getElementById('form-title').value;
    const category = document.getElementById('form-category').value;
    const status = document.getElementById('form-status').value;
    const deadline = document.getElementById('form-deadline').value;
    const desc = document.getElementById('form-desc').value;

    if (id) {
        const idx = goals.findIndex(item => item.id === id);
        if (idx !== -1) {
            goals[idx] = { id, title, category, status, deadline, desc };
        }
    } else {
        const newGoal = {
            id: Date.now().toString(),
            title,
            category,
            status,
            deadline,
            desc
        };
        goals.unshift(newGoal);
    }

    closeModal();
    renderDashboard();
}

function editGoal(id) {
    openModal(id);
}

function deleteGoal(id) {
    if (confirm("Are you sure you want to delete this goal?")) {
        goals = goals.filter(item => item.id !== id);
        renderDashboard();
    }
}

function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(goals, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `my_learning_goals_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function resetDefaults() {
    if (confirm("Reset all goals to default roadmap items?")) {
        goals = [...defaultGoals];
        renderDashboard();
    }
}