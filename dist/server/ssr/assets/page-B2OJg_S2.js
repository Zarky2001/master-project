import { a as require_react, o as __toESM, t as require_jsx_runtime } from "../index.js";
//#region app/local-folder.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var DB_NAME = "phd_master_workspace_folder";
var STORE_NAME = "handles";
var HANDLE_KEY = "workspace-folder";
function openDb() {
	return new Promise((resolve, reject) => {
		const request = window.indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}
async function getStoredFolder() {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(HANDLE_KEY);
		request.onsuccess = () => {
			db.close();
			resolve(request.result ?? null);
		};
		request.onerror = () => {
			db.close();
			reject(request.error);
		};
	});
}
async function storeFolder(folder) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(folder, HANDLE_KEY);
		request.onsuccess = () => {
			db.close();
			resolve();
		};
		request.onerror = () => {
			db.close();
			reject(request.error);
		};
	});
}
async function forgetFolder() {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(HANDLE_KEY);
		request.onsuccess = () => {
			db.close();
			resolve();
		};
		request.onerror = () => {
			db.close();
			reject(request.error);
		};
	});
}
async function ensureFolderPermission(folder, request = false) {
	const mode = { mode: "readwrite" };
	if (await folder.queryPermission?.(mode) === "granted") return true;
	if (!request) return false;
	return await folder.requestPermission?.(mode) === "granted";
}
async function readFolderJson(folder, filename) {
	try {
		const text = await (await (await folder.getFileHandle(filename)).getFile()).text();
		return JSON.parse(text);
	} catch {
		return null;
	}
}
async function writeFolderJson(folder, filename, value) {
	const writable = await (await folder.getFileHandle(filename, { create: true })).createWritable();
	await writable.write(JSON.stringify(value, null, 2));
	await writable.close();
}
//#endregion
//#region app/page.tsx
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "phd_master_workspace_merged_v1";
var LOCAL_DATA_FILE = "phd-master-workspace-data.json";
var navItems = [
	{
		id: "home",
		label: "总览首页",
		short: "今"
	},
	{
		id: "plans",
		label: "日计划管理",
		short: "日",
		group: "计划与执行"
	},
	{
		id: "projects",
		label: "项目看板",
		short: "项",
		group: "科研推进"
	},
	{
		id: "thesis",
		label: "博士毕业论文进度",
		short: "论"
	},
	{
		id: "submissions",
		label: "投稿管理",
		short: "投"
	},
	{
		id: "researchData",
		label: "数据记录",
		short: "数"
	},
	{
		id: "literature",
		label: "文献记录",
		short: "文"
	},
	{
		id: "simulations",
		label: "代码仿真",
		short: "仿"
	},
	{
		id: "health",
		label: "健康管理",
		short: "健",
		group: "自律与支持"
	},
	{
		id: "care",
		label: "心灵关怀",
		short: "心"
	},
	{
		id: "advisor",
		label: "向上管理导师",
		short: "导"
	},
	{
		id: "review",
		label: "每日复盘",
		short: "复"
	},
	{
		id: "achievements",
		label: "成就殿堂",
		short: "成",
		group: "回看与复盘"
	},
	{
		id: "analytics",
		label: "数据看板",
		short: "数"
	},
	{
		id: "data",
		label: "数据管理",
		short: "库"
	}
];
var statusText = {
	todo: "待开始",
	in_progress: "进行中",
	done: "已完成",
	blocked: "受阻"
};
var defaultWorkspace = () => ({
	brandName: "Yang · PhD Master",
	brandSubtitle: "Workspace",
	homeNote: "把打卡、任务、专注与今日日程放在同一屏，快速判断下一步。",
	pageLabels: Object.fromEntries(navItems.map((item) => [item.id, item.label])),
	fontScale: "comfortable"
});
var blankData = () => ({
	version: 1,
	updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
	workspace: defaultWorkspace(),
	projects: [],
	tasks: [],
	clockSegments: [],
	focusRecords: [],
	scheduleBlocks: [],
	dailyPlans: [],
	researchDataRecords: [],
	literatureRecords: [],
	simulationRecords: [],
	thesis: {
		title: "",
		targetDate: "",
		version: "",
		note: "",
		milestones: [],
		chapters: [],
		logs: []
	},
	submissions: [],
	habits: [],
	habitLogs: [],
	meals: [],
	weights: [],
	careRecords: [],
	advisorRecords: [],
	reviews: []
});
var newId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
function localDate(value = /* @__PURE__ */ new Date()) {
	const offset = value.getTimezoneOffset() * 6e4;
	return new Date(value.getTime() - offset).toISOString().slice(0, 10);
}
var nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
function addDays(date, amount) {
	const next = /* @__PURE__ */ new Date(`${date}T12:00:00`);
	next.setDate(next.getDate() + amount);
	return localDate(next);
}
function displayDate(value) {
	if (!value) return "未设置";
	return new Intl.DateTimeFormat("zh-CN", {
		month: "long",
		day: "numeric",
		weekday: "short"
	}).format(/* @__PURE__ */ new Date(`${value}T12:00:00`));
}
function displayTime(value) {
	if (!value) return "—";
	return new Intl.DateTimeFormat("zh-CN", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false
	}).format(new Date(value));
}
function durationMinutes(start, end, now = Date.now()) {
	const finalTime = end ? new Date(end).getTime() : now;
	return Math.max(0, Math.round((finalTime - new Date(start).getTime()) / 6e4));
}
function isSameDay(iso, day) {
	return localDate(new Date(iso)) === day;
}
function pct(value, total) {
	return total > 0 ? Math.round(value / total * 100) : 0;
}
function normalizeData(raw) {
	const fallback = blankData();
	if (!raw || typeof raw !== "object") return fallback;
	const value = raw;
	const savedWorkspace = value.workspace ?? {};
	const savedBrand = typeof savedWorkspace.brandName === "string" ? savedWorkspace.brandName.trim() : "";
	const workspace = {
		...fallback.workspace,
		...savedWorkspace,
		pageLabels: {
			...fallback.workspace.pageLabels,
			...savedWorkspace.pageLabels ?? {}
		}
	};
	if (!savedBrand || savedBrand === "PhD Master" || savedBrand === "PhD Master Workspace") workspace.brandName = "Yang · PhD Master";
	return {
		...fallback,
		...value,
		workspace,
		projects: Array.isArray(value.projects) ? value.projects : [],
		tasks: Array.isArray(value.tasks) ? value.tasks : [],
		clockSegments: Array.isArray(value.clockSegments) ? value.clockSegments : [],
		focusRecords: Array.isArray(value.focusRecords) ? value.focusRecords : [],
		scheduleBlocks: Array.isArray(value.scheduleBlocks) ? value.scheduleBlocks : [],
		dailyPlans: Array.isArray(value.dailyPlans) ? value.dailyPlans : [],
		researchDataRecords: Array.isArray(value.researchDataRecords) ? value.researchDataRecords : [],
		literatureRecords: Array.isArray(value.literatureRecords) ? value.literatureRecords : [],
		simulationRecords: Array.isArray(value.simulationRecords) ? value.simulationRecords : [],
		submissions: Array.isArray(value.submissions) ? value.submissions : [],
		habits: Array.isArray(value.habits) ? value.habits : [],
		habitLogs: Array.isArray(value.habitLogs) ? value.habitLogs : [],
		meals: Array.isArray(value.meals) ? value.meals : [],
		weights: Array.isArray(value.weights) ? value.weights : [],
		careRecords: Array.isArray(value.careRecords) ? value.careRecords : [],
		advisorRecords: Array.isArray(value.advisorRecords) ? value.advisorRecords : [],
		reviews: Array.isArray(value.reviews) ? value.reviews : [],
		thesis: {
			...fallback.thesis,
			...value.thesis ?? {},
			milestones: Array.isArray(value.thesis?.milestones) ? value.thesis.milestones : [],
			chapters: Array.isArray(value.thesis?.chapters) ? value.thesis.chapters : [],
			logs: Array.isArray(value.thesis?.logs) ? value.thesis.logs : []
		}
	};
}
function SectionTitle({ eyebrow, title, note, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "section-title",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: title }),
			note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "section-note",
				children: note
			})
		] }), action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "section-action",
			children: action
		})]
	});
}
function EmptyState({ title, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "empty-state",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: detail })]
	});
}
function Metric({ label, value, note, tone = "blue" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `metric metric-${tone}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: label }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: value }),
			note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: note })
		]
	});
}
function Progress({ value, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "progress-wrap",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "progress-track",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${Math.max(0, Math.min(value, 100))}%` } })
		}), label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "progress-label",
			children: label
		})]
	});
}
function Home() {
	const today = localDate();
	const tomorrow = addDays(today, 1);
	const [page, setPage] = (0, import_react.useState)("home");
	const [period, setPeriod] = (0, import_react.useState)("每日");
	const [data, setData] = (0, import_react.useState)(() => blankData());
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [toast, setToast] = (0, import_react.useState)("");
	const [clockNow, setClockNow] = (0, import_react.useState)(() => Date.now());
	const [showTaskForm, setShowTaskForm] = (0, import_react.useState)(false);
	const [showProjectForm, setShowProjectForm] = (0, import_react.useState)(false);
	const [taskFilter, setTaskFilter] = (0, import_react.useState)("all");
	const [leaveType, setLeaveType] = (0, import_react.useState)("病假");
	const [taskDraft, setTaskDraft] = (0, import_react.useState)({
		title: "",
		projectId: "",
		priority: "重要",
		dueDate: today,
		estimate: "30"
	});
	const [projectDraft, setProjectDraft] = (0, import_react.useState)({
		name: "",
		goal: "",
		stage: "规划中",
		deadline: ""
	});
	const [manualFocus, setManualFocus] = (0, import_react.useState)({
		title: "",
		minutes: "45",
		date: today
	});
	const [scheduleDraft, setScheduleDraft] = (0, import_react.useState)({
		taskId: "",
		start: "09:00",
		end: "10:00"
	});
	const [milestoneDraft, setMilestoneDraft] = (0, import_react.useState)({
		title: "",
		deadline: ""
	});
	const [chapterDraft, setChapterDraft] = (0, import_react.useState)({
		title: "",
		progress: "0"
	});
	const [thesisLogDraft, setThesisLogDraft] = (0, import_react.useState)({
		minutes: "60",
		words: "",
		note: "",
		date: today
	});
	const [submissionDraft, setSubmissionDraft] = (0, import_react.useState)({
		title: "",
		journal: "",
		status: "准备中",
		submittedDate: "",
		notes: ""
	});
	const [submissionLogDraft, setSubmissionLogDraft] = (0, import_react.useState)({
		submissionId: "",
		note: "",
		date: today
	});
	const [habitDraft, setHabitDraft] = (0, import_react.useState)({
		name: "",
		icon: "●",
		method: "打卡"
	});
	const [habitValues, setHabitValues] = (0, import_react.useState)({});
	const [mealDraft, setMealDraft] = (0, import_react.useState)({
		meal: "午餐",
		note: "",
		date: today
	});
	const [weightDraft, setWeightDraft] = (0, import_react.useState)({
		weight: "",
		date: today
	});
	const [careDraft, setCareDraft] = (0, import_react.useState)({
		stress: "3",
		energy: "3",
		drain: "",
		care: "",
		gratitude: "",
		support: "",
		words: ""
	});
	const [advisorDraft, setAdvisorDraft] = (0, import_react.useState)({
		status: "准备沟通",
		channel: "当面",
		pressure: "中",
		clarity: "中",
		topic: "",
		prepared: "",
		request: "",
		risk: "",
		feedback: "",
		promise: "",
		confirmation: "",
		followUpDate: "",
		tracking: "待跟进",
		boundary: "",
		nextAction: ""
	});
	const [reviewDraft, setReviewDraft] = (0, import_react.useState)({
		energy: "3",
		note: "",
		output: "",
		unfinished: "",
		insight: "",
		obstacle: "",
		tomorrow: ""
	});
	const [importText, setImportText] = (0, import_react.useState)("");
	const [dayPlanDraft, setDayPlanDraft] = (0, import_react.useState)({
		date: today,
		time: "09:00",
		title: "",
		priority: "重要",
		note: ""
	});
	const [selectedPlanDate, setSelectedPlanDate] = (0, import_react.useState)(today);
	const [researchDataDraft, setResearchDataDraft] = (0, import_react.useState)({
		date: today,
		title: "",
		kind: "实验数据",
		metrics: "",
		location: "",
		note: ""
	});
	const [expandedResearchDataId, setExpandedResearchDataId] = (0, import_react.useState)(null);
	const [researchDataEditDraft, setResearchDataEditDraft] = (0, import_react.useState)(null);
	const [literatureDraft, setLiteratureDraft] = (0, import_react.useState)({
		date: today,
		title: "",
		source: "",
		status: "待读",
		tags: "",
		link: "",
		insight: ""
	});
	const [simulationDraft, setSimulationDraft] = (0, import_react.useState)({
		date: today,
		project: "",
		scenario: "",
		status: "准备中",
		scale: "",
		codeRef: "",
		result: ""
	});
	const [localFolder, setLocalFolder] = (0, import_react.useState)(null);
	const [localFolderStatus, setLocalFolderStatus] = (0, import_react.useState)("not-connected");
	const [localFolderReady, setLocalFolderReady] = (0, import_react.useState)(false);
	const [lastLocalSync, setLastLocalSync] = (0, import_react.useState)("");
	const update = (change) => setData((current) => ({
		...change(current),
		updatedAt: nowIso()
	}));
	const notify = (message) => {
		setToast(message);
		window.setTimeout(() => setToast(""), 2800);
	};
	(0, import_react.useEffect)(() => {
		let alive = true;
		const restore = async () => {
			let browserData = blankData();
			try {
				const saved = window.localStorage.getItem(STORAGE_KEY);
				if (saved) browserData = normalizeData(JSON.parse(saved));
			} catch {
				window.localStorage.removeItem(STORAGE_KEY);
			}
			if (!alive) return;
			setData(browserData);
			setHydrated(true);
			try {
				const folder = await getStoredFolder();
				if (!folder || !alive) {
					if (alive) setLocalFolderReady(true);
					return;
				}
				const allowed = await ensureFolderPermission(folder);
				if (!alive) return;
				if (!allowed) {
					setLocalFolder(folder);
					setLocalFolderStatus("needs-permission");
					setLocalFolderReady(true);
					return;
				}
				const folderData = await readFolderJson(folder, LOCAL_DATA_FILE);
				if (!alive) return;
				const imported = folderData ? normalizeData(folderData) : null;
				setData(imported && new Date(imported.updatedAt).getTime() > new Date(browserData.updatedAt).getTime() ? imported : browserData);
				setLocalFolder(folder);
				setLocalFolderStatus("connected");
				setLocalFolderReady(true);
			} catch {
				if (alive) {
					setLocalFolderStatus("unsupported");
					setLocalFolderReady(true);
				}
			}
		};
		restore();
		return () => {
			alive = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	}, [data, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!localFolder || !localFolderReady || localFolderStatus !== "connected") return;
		writeFolderJson(localFolder, LOCAL_DATA_FILE, data).then(() => setLastLocalSync(nowIso())).catch(() => setLocalFolderStatus("needs-permission"));
	}, [
		data,
		localFolder,
		localFolderReady,
		localFolderStatus
	]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		document.title = `${data.workspace.brandName} ${data.workspace.brandSubtitle}`.trim() || "博士生工作台";
	}, [
		data.workspace.brandName,
		data.workspace.brandSubtitle,
		hydrated
	]);
	const activeFocus = data.focusRecords.find((record) => !record.end);
	(0, import_react.useEffect)(() => {
		if (!activeFocus) return;
		const timer = window.setInterval(() => setClockNow(Date.now()), 1e3);
		return () => window.clearInterval(timer);
	}, [activeFocus]);
	const activeFocusSeconds = activeFocus ? Math.max(0, Math.floor((clockNow - new Date(activeFocus.start).getTime()) / 1e3)) : 0;
	const focusDisplay = `${String(Math.floor(activeFocusSeconds / 3600)).padStart(2, "0")}:${String(Math.floor(activeFocusSeconds % 3600 / 60)).padStart(2, "0")}:${String(activeFocusSeconds % 60).padStart(2, "0")}`;
	const todayFocusMinutes = data.focusRecords.filter((record) => isSameDay(record.start, today)).reduce((sum, record) => sum + durationMinutes(record.start, record.end, clockNow), 0);
	const todayWorkSegments = data.clockSegments.filter((segment) => segment.type === "work" && isSameDay(segment.start, today));
	const todayWorkMinutes = todayWorkSegments.reduce((sum, segment) => sum + durationMinutes(segment.start, segment.end, clockNow), 0);
	const todayLeaves = data.clockSegments.filter((segment) => segment.type === "leave" && isSameDay(segment.start, today));
	const openWork = todayWorkSegments.find((segment) => !segment.end);
	const inProgress = data.tasks.filter((task) => task.status === "in_progress");
	const todayTasks = data.tasks.filter((task) => task.dueDate === today && task.status !== "done");
	const activeHabits = data.habits.filter((habit) => habit.active);
	const completedHabitIds = new Set(data.habitLogs.filter((log) => log.date === today).map((log) => log.habitId));
	const habitRate = pct(completedHabitIds.size, activeHabits.length);
	const supportToday = data.careRecords.filter((record) => record.date === today).length + data.advisorRecords.filter((record) => record.date === today).length + data.reviews.filter((record) => record.date === today).length;
	const ongoingSubmissions = data.submissions.filter((submission) => ![
		"已录用",
		"已拒稿",
		"撤稿"
	].includes(submission.status));
	const thesisProgress = Math.round((pct(data.thesis.milestones.filter((item) => item.done).length, data.thesis.milestones.length) + (data.thesis.chapters.length ? Math.round(data.thesis.chapters.reduce((sum, item) => sum + item.progress, 0) / data.thesis.chapters.length) : 0)) / 2);
	const pageLabel = (key) => data.workspace.pageLabels[key]?.trim() || navItems.find((item) => item.id === key)?.label || "工作台";
	const pageTitle = pageLabel(page);
	const beginWork = () => {
		if (openWork) return notify("当前已有未结束的工作段");
		update((current) => ({
			...current,
			clockSegments: [{
				id: newId("work"),
				type: "work",
				start: nowIso()
			}, ...current.clockSegments]
		}));
		notify("已记录到位打卡");
	};
	const endWork = () => {
		if (!openWork) return notify("没有需要结束的工作段");
		update((current) => ({
			...current,
			clockSegments: current.clockSegments.map((segment) => segment.id === openWork.id ? {
				...segment,
				end: nowIso()
			} : segment)
		}));
		notify("已记录离开打卡");
	};
	const addLeave = () => {
		update((current) => ({
			...current,
			clockSegments: [{
				id: newId("leave"),
				type: "leave",
				leaveType,
				start: nowIso()
			}, ...current.clockSegments]
		}));
		notify(`已记录${leaveType}`);
	};
	const closeAllWork = () => {
		const end = nowIso();
		update((current) => ({
			...current,
			clockSegments: current.clockSegments.map((segment) => segment.type === "work" && isSameDay(segment.start, today) && !segment.end ? {
				...segment,
				end
			} : segment)
		}));
		notify("今天所有未结束工作段已关闭");
	};
	const clearTodayLeaves = () => {
		update((current) => ({
			...current,
			clockSegments: current.clockSegments.filter((segment) => !(segment.type === "leave" && isSameDay(segment.start, today)))
		}));
		notify("已清空今日请假记录");
	};
	const addTask = () => {
		const title = taskDraft.title.trim();
		if (!title) return notify("请先写下一个可执行的任务");
		const task = {
			id: newId("task"),
			title,
			projectId: taskDraft.projectId || void 0,
			priority: taskDraft.priority,
			status: "todo",
			dueDate: taskDraft.dueDate || void 0,
			estimateMinutes: Number(taskDraft.estimate) || void 0,
			createdAt: nowIso()
		};
		update((current) => ({
			...current,
			tasks: [task, ...current.tasks]
		}));
		setTaskDraft({
			title: "",
			projectId: "",
			priority: "重要",
			dueDate: today,
			estimate: "30"
		});
		setShowTaskForm(false);
		notify("任务已加入看板");
	};
	const addProject = () => {
		if (!projectDraft.name.trim()) return notify("项目需要一个名称");
		update((current) => ({
			...current,
			projects: [{
				id: newId("project"),
				name: projectDraft.name.trim(),
				goal: projectDraft.goal.trim(),
				stage: projectDraft.stage,
				deadline: projectDraft.deadline || void 0,
				createdAt: nowIso()
			}, ...current.projects]
		}));
		setProjectDraft({
			name: "",
			goal: "",
			stage: "规划中",
			deadline: ""
		});
		setShowProjectForm(false);
		notify("项目已建立");
	};
	const startTask = (task) => {
		const start = nowIso();
		update((current) => ({
			...current,
			tasks: current.tasks.map((item) => item.id === task.id ? {
				...item,
				status: "in_progress"
			} : item),
			focusRecords: current.focusRecords.some((record) => !record.end) ? current.focusRecords : [{
				id: newId("focus"),
				start,
				title: task.title,
				taskId: task.id,
				source: "task"
			}, ...current.focusRecords]
		}));
		notify("任务已开始，专注计时同步启动");
	};
	const endFocus = (completeTaskId) => {
		if (!activeFocus) return notify("当前没有正在进行的专注段");
		const end = nowIso();
		update((current) => ({
			...current,
			focusRecords: current.focusRecords.map((record) => record.id === activeFocus.id ? {
				...record,
				end
			} : record),
			scheduleBlocks: [{
				id: newId("block"),
				title: activeFocus.title,
				taskId: activeFocus.taskId,
				start: activeFocus.start,
				end,
				source: activeFocus.source === "task" ? "task" : "focus"
			}, ...current.scheduleBlocks],
			tasks: current.tasks.map((task) => task.id === (completeTaskId ?? activeFocus.taskId) ? {
				...task,
				status: "done",
				completedAt: end
			} : task)
		}));
		notify(completeTaskId ? "任务已完成，专注与日程已沉淀" : "专注记录已保存到日程");
	};
	const finishTask = (task) => {
		if (activeFocus?.taskId === task.id) return endFocus(task.id);
		update((current) => ({
			...current,
			tasks: current.tasks.map((item) => item.id === task.id ? {
				...item,
				status: "done",
				completedAt: nowIso()
			} : item)
		}));
		notify("任务已完成");
	};
	const beginFocus = () => {
		if (activeFocus) return notify("已有正在进行的专注段");
		const task = inProgress[0];
		update((current) => ({
			...current,
			focusRecords: [{
				id: newId("focus"),
				start: nowIso(),
				title: task?.title ?? "自主专注",
				taskId: task?.id,
				source: "focus"
			}, ...current.focusRecords]
		}));
		notify(task ? "已关联当前任务开始专注" : "已开始自主专注");
	};
	const discardFocus = () => {
		if (!activeFocus) return notify("当前没有需要放弃的专注段");
		update((current) => ({
			...current,
			focusRecords: current.focusRecords.filter((record) => record.id !== activeFocus.id)
		}));
		notify("本次专注未计入记录");
	};
	const addManualFocus = () => {
		const minutes = Number(manualFocus.minutes);
		if (!manualFocus.title.trim() || !minutes) return notify("请填写专注事项与时长");
		const start = /* @__PURE__ */ new Date(`${manualFocus.date}T09:00:00`);
		const end = new Date(start.getTime() + minutes * 6e4);
		update((current) => ({
			...current,
			focusRecords: [{
				id: newId("manual"),
				title: manualFocus.title.trim(),
				start: start.toISOString(),
				end: end.toISOString(),
				source: "manual"
			}, ...current.focusRecords]
		}));
		setManualFocus({
			title: "",
			minutes: "45",
			date: today
		});
		notify("补录专注已保存");
	};
	const addSchedule = () => {
		const task = data.tasks.find((item) => item.id === scheduleDraft.taskId);
		if (!task) return notify("请选择需要排入日程的任务");
		if (scheduleDraft.end <= scheduleDraft.start) return notify("结束时间需晚于开始时间");
		update((current) => ({
			...current,
			scheduleBlocks: [{
				id: newId("plan"),
				title: task.title,
				taskId: task.id,
				start: (/* @__PURE__ */ new Date(`${today}T${scheduleDraft.start}:00`)).toISOString(),
				end: (/* @__PURE__ */ new Date(`${today}T${scheduleDraft.end}:00`)).toISOString(),
				source: "plan"
			}, ...current.scheduleBlocks]
		}));
		setScheduleDraft({
			taskId: "",
			start: "09:00",
			end: "10:00"
		});
		notify("时间块已排入今日日程");
	};
	const updateThesis = (field, value) => update((current) => ({
		...current,
		thesis: {
			...current.thesis,
			[field]: value
		}
	}));
	const addMilestone = () => {
		if (!milestoneDraft.title.trim()) return notify("请填写里程碑");
		update((current) => ({
			...current,
			thesis: {
				...current.thesis,
				milestones: [...current.thesis.milestones, {
					id: newId("milestone"),
					title: milestoneDraft.title.trim(),
					deadline: milestoneDraft.deadline || void 0,
					done: false
				}]
			}
		}));
		setMilestoneDraft({
			title: "",
			deadline: ""
		});
		notify("里程碑已添加");
	};
	const addChapter = () => {
		if (!chapterDraft.title.trim()) return notify("请填写章节名称");
		update((current) => ({
			...current,
			thesis: {
				...current.thesis,
				chapters: [...current.thesis.chapters, {
					id: newId("chapter"),
					title: chapterDraft.title.trim(),
					progress: Math.min(100, Math.max(0, Number(chapterDraft.progress) || 0))
				}]
			}
		}));
		setChapterDraft({
			title: "",
			progress: "0"
		});
		notify("章节已添加");
	};
	const addThesisLog = () => {
		if (!thesisLogDraft.note.trim()) return notify("请记录本次写作或修改的具体推进");
		update((current) => ({
			...current,
			thesis: {
				...current.thesis,
				logs: [{
					id: newId("thesis-log"),
					date: thesisLogDraft.date,
					minutes: Number(thesisLogDraft.minutes) || 0,
					words: Number(thesisLogDraft.words) || void 0,
					note: thesisLogDraft.note.trim()
				}, ...current.thesis.logs]
			}
		}));
		setThesisLogDraft({
			minutes: "60",
			words: "",
			note: "",
			date: today
		});
		notify("论文推进日志已记录");
	};
	const addSubmission = () => {
		if (!submissionDraft.title.trim() || !submissionDraft.journal.trim()) return notify("请填写论文题目和目标期刊");
		update((current) => ({
			...current,
			submissions: [{
				id: newId("submission"),
				title: submissionDraft.title.trim(),
				journal: submissionDraft.journal.trim(),
				status: submissionDraft.status,
				submittedDate: submissionDraft.submittedDate || void 0,
				notes: submissionDraft.notes.trim() || void 0,
				logs: []
			}, ...current.submissions]
		}));
		setSubmissionDraft({
			title: "",
			journal: "",
			status: "准备中",
			submittedDate: "",
			notes: ""
		});
		notify("投稿项目已建立");
	};
	const addSubmissionLog = () => {
		if (!submissionLogDraft.submissionId || !submissionLogDraft.note.trim()) return notify("请选择投稿项目并写下推进内容");
		update((current) => ({
			...current,
			submissions: current.submissions.map((submission) => submission.id === submissionLogDraft.submissionId ? {
				...submission,
				logs: [{
					id: newId("submission-log"),
					date: submissionLogDraft.date,
					note: submissionLogDraft.note.trim()
				}, ...submission.logs]
			} : submission)
		}));
		setSubmissionLogDraft({
			submissionId: "",
			note: "",
			date: today
		});
		notify("投稿推进日志已记录");
	};
	const addHabit = () => {
		if (!habitDraft.name.trim()) return notify("请填写习惯名称");
		update((current) => ({
			...current,
			habits: [...current.habits, {
				id: newId("habit"),
				name: habitDraft.name.trim(),
				icon: habitDraft.icon || "●",
				method: habitDraft.method,
				active: true
			}]
		}));
		setHabitDraft({
			name: "",
			icon: "●",
			method: "打卡"
		});
		notify("健康习惯已添加");
	};
	const logHabit = (habit) => {
		const value = habitValues[habit.id] || (habit.method === "打卡" ? "已完成" : "1");
		update((current) => ({
			...current,
			habitLogs: [{
				id: newId("habit-log"),
				habitId: habit.id,
				date: today,
				value
			}, ...current.habitLogs.filter((log) => !(log.habitId === habit.id && log.date === today))]
		}));
		setHabitValues((current) => ({
			...current,
			[habit.id]: ""
		}));
		notify(`${habit.name}已记录`);
	};
	const addMeal = () => {
		if (!mealDraft.note.trim()) return notify("请简要记录饮食内容");
		update((current) => ({
			...current,
			meals: [{
				id: newId("meal"),
				...mealDraft,
				note: mealDraft.note.trim()
			}, ...current.meals]
		}));
		setMealDraft({
			meal: "午餐",
			note: "",
			date: today
		});
		notify("饮食记录已保存");
	};
	const addWeight = () => {
		if (!Number(weightDraft.weight)) return notify("请填写有效体重");
		update((current) => ({
			...current,
			weights: [{
				id: newId("weight"),
				date: weightDraft.date,
				weight: Number(weightDraft.weight)
			}, ...current.weights]
		}));
		setWeightDraft({
			weight: "",
			date: today
		});
		notify("体重记录已保存");
	};
	const saveCare = () => {
		update((current) => ({
			...current,
			careRecords: [{
				id: newId("care"),
				date: today,
				stress: Number(careDraft.stress),
				energy: Number(careDraft.energy),
				drain: careDraft.drain.trim(),
				care: careDraft.care.trim(),
				gratitude: careDraft.gratitude.trim(),
				support: careDraft.support.trim(),
				words: careDraft.words.trim()
			}, ...current.careRecords.filter((record) => record.date !== today)]
		}));
		notify("今天的心灵关怀记录已保存");
	};
	const saveAdvisor = () => {
		if (!advisorDraft.topic.trim()) return notify("请先写明本次沟通主题");
		const dueDate = advisorDraft.followUpDate || tomorrow;
		update((current) => ({
			...current,
			advisorRecords: [{
				id: newId("advisor"),
				date: today,
				...advisorDraft,
				topic: advisorDraft.topic.trim(),
				prepared: advisorDraft.prepared.trim(),
				request: advisorDraft.request.trim(),
				risk: advisorDraft.risk.trim(),
				feedback: advisorDraft.feedback.trim(),
				promise: advisorDraft.promise.trim(),
				confirmation: advisorDraft.confirmation.trim(),
				boundary: advisorDraft.boundary.trim(),
				nextAction: advisorDraft.nextAction.trim()
			}, ...current.advisorRecords.filter((record) => record.date !== today)],
			tasks: advisorDraft.nextAction.trim() ? [{
				id: newId("advisor-task"),
				title: `导师跟进：${advisorDraft.nextAction.trim()}`,
				priority: "重要",
				status: "todo",
				dueDate,
				createdAt: nowIso()
			}, ...current.tasks] : current.tasks
		}));
		notify("导师沟通已保存，并同步生成跟进任务");
	};
	const saveReview = () => {
		if (!reviewDraft.output.trim() && !reviewDraft.tomorrow.trim()) return notify("至少写下今天的具体产出或明日第一步");
		update((current) => ({
			...current,
			reviews: [{
				id: newId("review"),
				date: today,
				energy: Number(reviewDraft.energy),
				note: reviewDraft.note.trim(),
				output: reviewDraft.output.trim(),
				unfinished: reviewDraft.unfinished.trim(),
				insight: reviewDraft.insight.trim(),
				obstacle: reviewDraft.obstacle.trim(),
				tomorrow: reviewDraft.tomorrow.trim()
			}, ...current.reviews.filter((record) => record.date !== today)],
			tasks: reviewDraft.tomorrow.trim() ? [{
				id: newId("review-task"),
				title: reviewDraft.tomorrow.trim(),
				priority: "重要",
				status: "todo",
				dueDate: tomorrow,
				createdAt: nowIso()
			}, ...current.tasks] : current.tasks
		}));
		notify("每日复盘已保存，明日优先任务已加入任务表");
	};
	const addDayPlan = () => {
		if (!dayPlanDraft.title.trim()) return notify("请先写下当天要推进的事项");
		update((current) => ({
			...current,
			dailyPlans: [{
				id: newId("day-plan"),
				date: dayPlanDraft.date,
				time: dayPlanDraft.time,
				title: dayPlanDraft.title.trim(),
				priority: dayPlanDraft.priority,
				note: dayPlanDraft.note.trim(),
				status: "planned",
				createdAt: nowIso()
			}, ...current.dailyPlans]
		}));
		setDayPlanDraft((current) => ({
			date: current.date,
			time: "09:00",
			title: "",
			priority: "重要",
			note: ""
		}));
		notify("日计划已加入");
	};
	const toggleDayPlan = (plan) => {
		update((current) => ({
			...current,
			dailyPlans: current.dailyPlans.map((item) => item.id === plan.id ? {
				...item,
				status: item.status === "done" ? "planned" : "done"
			} : item)
		}));
		notify(plan.status === "done" ? "日计划已恢复待办" : "日计划已标记完成");
	};
	const removeDayPlan = (id) => {
		update((current) => ({
			...current,
			dailyPlans: current.dailyPlans.filter((item) => item.id !== id)
		}));
		notify("日计划已删除");
	};
	const addResearchDataRecord = () => {
		if (!researchDataDraft.title.trim()) return notify("请填写数据或实验记录名称");
		update((current) => ({
			...current,
			researchDataRecords: [{
				id: newId("research-data"),
				date: researchDataDraft.date,
				title: researchDataDraft.title.trim(),
				kind: researchDataDraft.kind.trim() || "实验数据",
				metrics: researchDataDraft.metrics.trim(),
				location: researchDataDraft.location.trim(),
				note: researchDataDraft.note.trim(),
				createdAt: nowIso()
			}, ...current.researchDataRecords]
		}));
		setResearchDataDraft({
			date: today,
			title: "",
			kind: "实验数据",
			metrics: "",
			location: "",
			note: ""
		});
		notify("数据记录已保存");
	};
	const toggleResearchDataDetail = (record) => {
		if (expandedResearchDataId === record.id) {
			setExpandedResearchDataId(null);
			setResearchDataEditDraft(null);
			return;
		}
		setExpandedResearchDataId(record.id);
		setResearchDataEditDraft({ ...record });
	};
	const closeResearchDataDetail = () => {
		setExpandedResearchDataId(null);
		setResearchDataEditDraft(null);
	};
	const saveResearchDataEdit = () => {
		if (!researchDataEditDraft || !researchDataEditDraft.title.trim()) return notify("请填写数据或实验记录名称");
		const next = {
			...researchDataEditDraft,
			title: researchDataEditDraft.title.trim(),
			kind: researchDataEditDraft.kind.trim() || "实验数据",
			metrics: researchDataEditDraft.metrics.trim(),
			location: researchDataEditDraft.location.trim(),
			note: researchDataEditDraft.note.trim()
		};
		update((current) => ({
			...current,
			researchDataRecords: current.researchDataRecords.map((item) => item.id === next.id ? next : item)
		}));
		setResearchDataEditDraft(next);
		notify("数据记录已修改");
	};
	const copyResearchDataLocation = async (location) => {
		if (!location.trim()) return notify("尚未填写数据位置");
		try {
			if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
			await navigator.clipboard.writeText(location);
			notify("数据位置已复制");
		} catch {
			notify("浏览器未允许复制，请手动复制位置");
		}
	};
	const removeResearchDataRecord = (id) => {
		update((current) => ({
			...current,
			researchDataRecords: current.researchDataRecords.filter((item) => item.id !== id)
		}));
		if (expandedResearchDataId === id) closeResearchDataDetail();
		notify("数据记录已删除");
	};
	const addLiteratureRecord = () => {
		if (!literatureDraft.title.trim()) return notify("请填写文献题目");
		update((current) => ({
			...current,
			literatureRecords: [{
				id: newId("literature"),
				date: literatureDraft.date,
				title: literatureDraft.title.trim(),
				source: literatureDraft.source.trim(),
				status: literatureDraft.status,
				tags: literatureDraft.tags.trim(),
				link: literatureDraft.link.trim(),
				insight: literatureDraft.insight.trim(),
				createdAt: nowIso()
			}, ...current.literatureRecords]
		}));
		setLiteratureDraft({
			date: today,
			title: "",
			source: "",
			status: "待读",
			tags: "",
			link: "",
			insight: ""
		});
		notify("文献记录已保存");
	};
	const updateLiteratureStatus = (id, status) => update((current) => ({
		...current,
		literatureRecords: current.literatureRecords.map((item) => item.id === id ? {
			...item,
			status
		} : item)
	}));
	const removeLiteratureRecord = (id) => {
		update((current) => ({
			...current,
			literatureRecords: current.literatureRecords.filter((item) => item.id !== id)
		}));
		notify("文献记录已删除");
	};
	const addSimulationRecord = () => {
		if (!simulationDraft.project.trim() || !simulationDraft.scenario.trim()) return notify("请填写代码项目与仿真场景");
		update((current) => ({
			...current,
			simulationRecords: [{
				id: newId("simulation"),
				date: simulationDraft.date,
				project: simulationDraft.project.trim(),
				scenario: simulationDraft.scenario.trim(),
				status: simulationDraft.status,
				scale: simulationDraft.scale.trim(),
				codeRef: simulationDraft.codeRef.trim(),
				result: simulationDraft.result.trim(),
				createdAt: nowIso()
			}, ...current.simulationRecords]
		}));
		setSimulationDraft({
			date: today,
			project: "",
			scenario: "",
			status: "准备中",
			scale: "",
			codeRef: "",
			result: ""
		});
		notify("代码仿真记录已保存");
	};
	const updateSimulationStatus = (id, status) => update((current) => ({
		...current,
		simulationRecords: current.simulationRecords.map((item) => item.id === id ? {
			...item,
			status
		} : item)
	}));
	const removeSimulationRecord = (id) => {
		update((current) => ({
			...current,
			simulationRecords: current.simulationRecords.filter((item) => item.id !== id)
		}));
		notify("仿真记录已删除");
	};
	const exportData = () => {
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `phd-master-workspace-${today}.json`;
		link.click();
		URL.revokeObjectURL(url);
		notify("JSON 备份已下载");
	};
	const copyData = async () => {
		try {
			await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
			notify("JSON 已复制到剪贴板");
		} catch {
			notify("浏览器未允许复制，请使用下方文本框手动复制");
		}
	};
	const importData = (value = importText) => {
		try {
			setData(normalizeData(JSON.parse(value)));
			setImportText("");
			notify("数据已导入并覆盖当前本机记录");
		} catch {
			notify("JSON 格式不正确，尚未导入");
		}
	};
	const handleFileImport = (file) => {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const text = String(reader.result ?? "");
			setImportText(text);
			importData(text);
		};
		reader.readAsText(file);
	};
	const updateWorkspace = (patch) => update((current) => ({
		...current,
		workspace: {
			...current.workspace,
			...patch
		}
	}));
	const setPageLabel = (key, label) => update((current) => ({
		...current,
		workspace: {
			...current.workspace,
			pageLabels: {
				...current.workspace.pageLabels,
				[key]: label
			}
		}
	}));
	const activateLocalFolder = async (folder) => {
		if (!await ensureFolderPermission(folder, true)) {
			setLocalFolder(folder);
			setLocalFolderStatus("needs-permission");
			notify("未获得文件夹写入权限");
			return;
		}
		const stored = await readFolderJson(folder, LOCAL_DATA_FILE);
		const imported = stored ? normalizeData(stored) : null;
		const preferred = imported && new Date(imported.updatedAt).getTime() > new Date(data.updatedAt).getTime() ? imported : data;
		await writeFolderJson(folder, LOCAL_DATA_FILE, preferred);
		await storeFolder(folder);
		setData(preferred);
		setLocalFolder(folder);
		setLocalFolderStatus("connected");
		setLocalFolderReady(true);
		setLastLocalSync(nowIso());
		notify(imported && preferred === imported ? "已连接本地文件夹，并保留较新的本地数据" : "已连接本地文件夹，当前数据已写入本地");
	};
	const connectLocalFolder = async () => {
		if (localFolder && localFolderStatus === "needs-permission") {
			try {
				await activateLocalFolder(localFolder);
			} catch {
				notify("无法恢复本地文件夹连接，请重新选择文件夹");
			}
			return;
		}
		if (!window.showDirectoryPicker) {
			setLocalFolderStatus("unsupported");
			notify("当前浏览器不支持本地文件夹同步，请使用 Edge 或 Chrome");
			return;
		}
		try {
			await activateLocalFolder(await window.showDirectoryPicker({
				id: "phd-master-workspace",
				mode: "readwrite"
			}));
		} catch (error) {
			if (error.name !== "AbortError") notify("未能连接本地文件夹，请重试");
		}
	};
	const syncToLocalFolder = async () => {
		if (!localFolder) return connectLocalFolder();
		try {
			if (!await ensureFolderPermission(localFolder, true)) {
				setLocalFolderStatus("needs-permission");
				notify("需要重新授权本地文件夹");
				return;
			}
			await writeFolderJson(localFolder, LOCAL_DATA_FILE, data);
			setLocalFolderStatus("connected");
			setLastLocalSync(nowIso());
			notify("已同步到本地 JSON 文件");
		} catch {
			notify("本地同步失败，请重新选择文件夹");
		}
	};
	const disconnectLocalFolder = async () => {
		try {
			await forgetFolder();
		} catch {}
		setLocalFolder(null);
		setLocalFolderStatus("not-connected");
		setLocalFolderReady(true);
		notify("已断开文件夹同步；本地文件不会被删除");
	};
	const todayBlocks = data.scheduleBlocks.filter((block) => isSameDay(block.start, today)).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
	const filteredTasks = data.tasks.filter((task) => taskFilter === "all" || task.status === taskFilter || task.projectId === taskFilter);
	const lastWeight = data.weights[0];
	const dataSize = hydrated ? `${(new Blob([JSON.stringify(data)]).size / 1024).toFixed(1)} KB` : "读取中";
	const recentActivities = (0, import_react.useMemo)(() => {
		return [
			...data.focusRecords.filter((item) => item.end).map((item) => ({
				date: item.end ?? item.start,
				title: `专注 · ${item.title}`,
				kind: "专注"
			})),
			...data.dailyPlans.map((item) => ({
				date: `${item.date}T${item.time || "12:00"}:00`,
				title: `日计划 · ${item.title}`,
				kind: item.status === "done" ? "已完成计划" : "日计划"
			})),
			...data.thesis.logs.map((item) => ({
				date: `${item.date}T12:00:00`,
				title: `论文 · ${item.note}`,
				kind: "论文"
			})),
			...data.submissions.flatMap((item) => item.logs.map((log) => ({
				date: `${log.date}T12:00:00`,
				title: `投稿 · ${log.note}`,
				kind: "投稿"
			}))),
			...data.researchDataRecords.map((item) => ({
				date: `${item.date}T12:00:00`,
				title: `数据 · ${item.title}`,
				kind: "数据记录"
			})),
			...data.literatureRecords.map((item) => ({
				date: `${item.date}T12:00:00`,
				title: `文献 · ${item.title}`,
				kind: "文献记录"
			})),
			...data.simulationRecords.map((item) => ({
				date: `${item.date}T12:00:00`,
				title: `仿真 · ${item.project}`,
				kind: "代码仿真"
			})),
			...data.reviews.map((item) => ({
				date: `${item.date}T20:00:00`,
				title: `复盘 · ${item.output || item.tomorrow}`,
				kind: "复盘"
			}))
		].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 12);
	}, [data]);
	const weekDays = Array.from({ length: 7 }, (_, index) => addDays(today, index - 6));
	const maxFocus = Math.max(30, ...weekDays.map((day) => data.focusRecords.filter((record) => isSameDay(record.start, day)).reduce((sum, record) => sum + durationMinutes(record.start, record.end, clockNow), 0)));
	const renderHome = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "TODAY / 每日推进",
			title: pageLabel("home"),
			note: data.workspace.homeNote,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "button button-primary",
				onClick: () => {
					setShowTaskForm(true);
					setPage("home");
				},
				children: "＋ 新增临时任务"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "metric-grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "专注时长",
					value: `${todayFocusMinutes} 分钟`,
					note: "任务与手动专注合并统计",
					tone: "blue"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "进行中任务",
					value: inProgress.length,
					note: inProgress[0]?.title ?? "暂无进行中的任务",
					tone: "orange"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "习惯完成度",
					value: `${habitRate}%`,
					note: activeHabits.length ? `${completedHabitIds.size}/${activeHabits.length} 项已记录` : "先添加一项健康习惯",
					tone: "green"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "支持页记录",
					value: supportToday,
					note: "关怀 / 导师 / 复盘",
					tone: "violet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "投稿进行中",
					value: ongoingSubmissions.length,
					note: "从准备到外审均计入",
					tone: "blue"
				})
			]
		}),
		showTaskForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "inline-form card form-wide",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "form-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "新增临时任务" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "text-button",
					onClick: () => setShowTaskForm(false),
					children: "收起"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "form-grid four",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "任务名称" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							value: taskDraft.title,
							onChange: (event) => setTaskDraft({
								...taskDraft,
								title: event.target.value
							}),
							placeholder: "例如：完成拥堵实验的指标核查"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "项目归属" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: taskDraft.projectId,
							onChange: (event) => setTaskDraft({
								...taskDraft,
								projectId: event.target.value
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "临时任务"
							}), data.projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: project.id,
								children: project.name
							}, project.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "优先级" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: taskDraft.priority,
							onChange: (event) => setTaskDraft({
								...taskDraft,
								priority: event.target.value
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "紧急" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "重要" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "一般" })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "截止日期" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: taskDraft.dueDate,
							onChange: (event) => setTaskDraft({
								...taskDraft,
								dueDate: event.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "预计分钟" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: "5",
							value: taskDraft.estimate,
							onChange: (event) => setTaskDraft({
								...taskDraft,
								estimate: event.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "form-actions",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-primary",
							onClick: addTask,
							children: "加入今日执行"
						})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "dashboard-grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "card clock-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-heading",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "打卡记录"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "工作到位与离开" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `status-dot ${openWork ? "is-live" : ""}`,
								children: openWork ? "工作中" : "未打卡"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "muted",
							children: "一天内可多次开始 / 结束工作；请假只记录类别，不写原因。"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "button-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button button-primary",
								onClick: beginWork,
								children: "开始工作 / 到位打卡"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button button-secondary",
								onClick: endWork,
								children: "结束工作 / 离开打卡"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "button-row leave-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "请假类别",
								value: leaveType,
								onChange: (event) => setLeaveType(event.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "病假" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "事假" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "调休" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "其他" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button button-quiet",
								onClick: addLeave,
								children: "记录请假"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "small-stat-grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "今日打卡次数" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: todayWorkSegments.length })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "今日工作时长" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [todayWorkMinutes, " 分钟"] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "今日请假记录" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: todayLeaves.length })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "未结束工作段" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: todayWorkSegments.filter((item) => !item.end).length })] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "list-label",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "今日打卡 / 请假明细" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "text-button",
								onClick: closeAllWork,
								children: "关闭未结束"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "text-button danger",
								onClick: clearTodayLeaves,
								children: "清空请假"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "compact-list",
							children: [[...todayWorkSegments, ...todayLeaves].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()).map((segment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "compact-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `row-icon ${segment.type}`,
										children: segment.type === "work" ? "工" : "假"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: segment.type === "work" ? "工作段" : segment.leaveType }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										displayTime(segment.start),
										" ",
										segment.type === "work" && `— ${segment.end ? displayTime(segment.end) : "进行中"}`
									] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: segment.type === "work" ? `${durationMinutes(segment.start, segment.end, clockNow)} 分钟` : "已记录" })
								]
							}, segment.id)), !todayWorkSegments.length && !todayLeaves.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: "今天还没有打卡",
								detail: "开始工作后，这里会形成可修正的时间记录。"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "card execution-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-heading",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "今日执行"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "任务推进" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "text-button",
								onClick: () => setPage("projects"),
								children: "查看任务表 →"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "muted",
							children: "开始 / 结束任务会自动形成专注记录与日程时间块。"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "current-task",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["进行中 ", inProgress.length] }), inProgress.length ? inProgress.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "current-task-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: task.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "button button-small",
									onClick: () => finishTask(task),
									children: "完成"
								})]
							}, task.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: "当前没有进行中任务",
								detail: "从今日任务中开始一项，或新增临时任务。"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "list-label",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "今日需要完成的任务" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "muted",
								children: [todayTasks.length, " 项"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "task-stack",
							children: [todayTasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "task-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `priority priority-${task.priority}`,
										children: task.priority
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: task.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										data.projects.find((project) => project.id === task.projectId)?.name ?? "临时任务",
										" · 预计 ",
										task.estimateMinutes ?? "—",
										" 分钟"
									] })] }),
									task.status === "in_progress" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "button button-small",
										onClick: () => finishTask(task),
										children: "结束"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "button button-small button-primary",
										onClick: () => startTask(task),
										children: "开始"
									})
								]
							}, task.id)), !todayTasks.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: "暂无今日任务",
								detail: "在项目看板设定截止日期，或新建一个临时任务。"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "card focus-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-heading",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "专注计时器"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: activeFocus ? activeFocus.title : "未开始" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "focus-source",
								children: activeFocus?.source === "task" ? "任务自动关联" : activeFocus ? "自主专注" : "准备好后开始"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `timer-display ${activeFocus ? "is-running" : ""}`,
							children: activeFocus ? focusDisplay : "00:00:00"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "muted",
							children: "当前专注段会自动关联到进行中的任务标题。"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "button-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "button button-primary",
									onClick: beginFocus,
									children: "开始专注"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "button button-secondary",
									onClick: () => endFocus(),
									children: "结束专注"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "button button-quiet",
									onClick: discardFocus,
									children: "放弃本次"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "manual-box",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "手动补录" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "manual-grid",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: manualFocus.title,
										onChange: (event) => setManualFocus({
											...manualFocus,
											title: event.target.value
										}),
										placeholder: "专注事项"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: "1",
										value: manualFocus.minutes,
										onChange: (event) => setManualFocus({
											...manualFocus,
											minutes: event.target.value
										}),
										placeholder: "分钟"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: manualFocus.date,
										onChange: (event) => setManualFocus({
											...manualFocus,
											date: event.target.value
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "button button-small",
										onClick: addManualFocus,
										children: "添加"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "list-label",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "专注时间线" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
								"今日 ",
								todayFocusMinutes,
								" 分钟"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "compact-list",
							children: [data.focusRecords.filter((record) => isSameDay(record.start, today) && record.end).slice(0, 4).map((record) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "compact-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "row-icon focus",
										children: "专"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: record.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										displayTime(record.start),
										" — ",
										displayTime(record.end)
									] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [durationMinutes(record.start, record.end), " 分钟"] })
								]
							}, record.id)), !data.focusRecords.some((record) => isSameDay(record.start, today) && record.end) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: "还没有专注记录",
								detail: "从任务开始，或直接启动专注计时器。"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "card schedule-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-heading",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "今日日程"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "时间块规划" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "muted",
								children: [todayBlocks.length, " 个时间块"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "muted",
							children: "把软任务锁定到具体时间块，执行顺序会更清晰。"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "schedule-form",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: scheduleDraft.taskId,
									onChange: (event) => setScheduleDraft({
										...scheduleDraft,
										taskId: event.target.value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "从今日任务选择"
									}), todayTasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: task.id,
										children: task.title
									}, task.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "time",
									value: scheduleDraft.start,
									onChange: (event) => setScheduleDraft({
										...scheduleDraft,
										start: event.target.value
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "至" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "time",
									value: scheduleDraft.end,
									onChange: (event) => setScheduleDraft({
										...scheduleDraft,
										end: event.target.value
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "button button-small button-primary",
									onClick: addSchedule,
									children: "排入日程"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "timeline",
							children: [todayBlocks.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "timeline-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: displayTime(block.start) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `timeline-dot ${block.source}` }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: block.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										displayTime(block.start),
										" — ",
										displayTime(block.end),
										" · ",
										block.source === "plan" ? "计划" : "实际执行"
									] })] })
								]
							}, block.id)), !todayBlocks.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: "今天还没有时间块",
								detail: "从今日任务选择一项，把它放进具体时段。"
							})]
						})
					]
				})
			]
		})
	] });
	const renderPlans = () => {
		const yesterday = addDays(today, -1);
		const plans = [...data.dailyPlans].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
		const todayPlans = plans.filter((item) => item.date === today);
		const doneToday = todayPlans.filter((item) => item.status === "done").length;
		const recordedDates = new Set(data.dailyPlans.map((item) => item.date));
		const olderDates = [...recordedDates].filter((date) => date < yesterday).sort((a, b) => b.localeCompare(a));
		const laterDates = [...recordedDates].filter((date) => date > tomorrow).sort((a, b) => a.localeCompare(b));
		const planDates = [
			yesterday,
			today,
			tomorrow,
			...olderDates,
			...laterDates
		].filter((date) => recordedDates.has(date));
		const activePlanDate = planDates.includes(selectedPlanDate) ? selectedPlanDate : planDates[0];
		const dateLabel = (date) => date === yesterday ? "昨天" : date === today ? "今天" : date === tomorrow ? "明天" : displayDate(date);
		const scrollToPlanDate = (date) => {
			setSelectedPlanDate(date);
			setDayPlanDraft((current) => ({
				...current,
				date
			}));
			window.requestAnimationFrame(() => document.getElementById(`plan-day-${date}`)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			}));
		};
		const daySummary = (date) => {
			const dayPlans = plans.filter((item) => item.date === date);
			const work = data.clockSegments.filter((item) => item.type === "work" && isSameDay(item.start, date));
			const focus = data.focusRecords.filter((item) => isSameDay(item.start, date));
			const habitIds = new Set(data.habitLogs.filter((item) => item.date === date).map((item) => item.habitId));
			return {
				plans: dayPlans,
				done: dayPlans.filter((item) => item.status === "done").length,
				workCount: work.length,
				workMinutes: work.reduce((sum, item) => sum + durationMinutes(item.start, item.end, clockNow), 0),
				focusMinutes: focus.reduce((sum, item) => sum + durationMinutes(item.start, item.end, clockNow), 0),
				habitDone: habitIds.size
			};
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "DAILY PLAN / 排定今天的推进顺序",
				title: pageLabel("plans"),
				note: "把当天要推进的事项放进具体时段；任务、专注和日程仍保留在总览首页执行。",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "button button-secondary",
					onClick: () => setPage("home"),
					children: "查看今日执行"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "metric-grid research-metrics",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "今日计划",
						value: todayPlans.length,
						note: "已写入当天的推进事项",
						tone: "blue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "今日完成",
						value: doneToday,
						note: todayPlans.length ? `${pct(doneToday, todayPlans.length)}% 已完成` : "先安排一件事",
						tone: "green"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "未来计划",
						value: plans.filter((item) => item.date > today && item.status === "planned").length,
						note: "后续日程中的待推进事项",
						tone: "orange"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "已沉淀计划",
						value: plans.length,
						note: "可在数据管理中导出备份",
						tone: "violet"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card research-form",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-heading",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "新增日计划"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "先明确一件要推进的事" })] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "form-grid four",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "计划日期" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: dayPlanDraft.date,
								onChange: (event) => setDayPlanDraft({
									...dayPlanDraft,
									date: event.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "计划时间" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "time",
								value: dayPlanDraft.time,
								onChange: (event) => setDayPlanDraft({
									...dayPlanDraft,
									time: event.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field field-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "计划事项" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: dayPlanDraft.title,
								onChange: (event) => setDayPlanDraft({
									...dayPlanDraft,
									title: event.target.value
								}),
								placeholder: "例如：完成 200 车规模实验的第一轮参数扫描"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "优先级" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: dayPlanDraft.priority,
								onChange: (event) => setDayPlanDraft({
									...dayPlanDraft,
									priority: event.target.value
								}),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "紧急" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "重要" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "一般" })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field field-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "完成标准 / 备注" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: dayPlanDraft.note,
								onChange: (event) => setDayPlanDraft({
									...dayPlanDraft,
									note: event.target.value
								}),
								placeholder: "写下可验收的结果，而不是泛泛的“继续做”"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "form-actions",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button button-primary",
								onClick: addDayPlan,
								children: "加入计划"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card plan-overview-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "每日总览"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "按日期集中查看计划与打卡" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "muted",
						children: [plans.length, " 条计划"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "plan-calendar-layout",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "plan-date-rail",
						"aria-label": "选择日期",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "选择日期" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "plan-date-scroll",
							children: planDates.map((date) => {
								const summary = daySummary(date);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: activePlanDate === date ? "active" : "",
									onClick: () => scrollToPlanDate(date),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dateLabel(date) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										date.slice(5).replace("-", "/"),
										" · ",
										summary.plans.length,
										" 项"
									] })]
								}, date);
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "plan-day-list",
						children: [planDates.map((date) => {
							const summary = daySummary(date);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: `plan-day-group ${activePlanDate === date ? "is-selected" : ""}`,
								id: `plan-day-${date}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
									className: "plan-day-heading",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dateLabel(date) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: displayDate(date) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "plan-day-stats",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["计划 ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
												summary.done,
												"/",
												summary.plans.length
											] })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["打卡 ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [summary.workCount, " 次"] })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["工作 ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [summary.workMinutes, " 分钟"] })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["专注 ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [summary.focusMinutes, " 分钟"] })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["习惯 ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
												summary.habitDone,
												"/",
												activeHabits.length
											] })] })
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "plan-day-items",
									children: [summary.plans.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
										className: `research-record plan-record ${plan.status === "done" ? "is-done" : ""}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "record-top",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `record-badge plan-${plan.status}`,
													children: plan.status === "done" ? "已完成" : "待推进"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: plan.time || "待定" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: plan.title }),
											plan.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "record-note",
												children: plan.note
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "record-bottom",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `priority priority-${plan.priority}`,
													children: plan.priority
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "record-actions",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "button button-small",
														onClick: () => toggleDayPlan(plan),
														children: plan.status === "done" ? "恢复" : "完成"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "text-button danger",
														onClick: () => removeDayPlan(plan.id),
														children: "删除"
													})]
												})]
											})
										]
									}, plan.id)), !summary.plans.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
										title: `${dateLabel(date)}还没有计划`,
										detail: "从左侧选择日期，新建计划时会自动使用该日期。"
									})]
								})]
							}, date);
						}), !planDates.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "还没有日计划",
							detail: "新增一条计划后，对应日期会自动出现在这里。"
						})]
					})]
				})]
			})
		] });
	};
	const renderResearchData = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "RESEARCH DATA / 数据、实验与证据",
			title: pageLabel("researchData"),
			note: "记录每组实验数据的来源、关键指标、存放位置和判断；点击下方数据条可展开查看和修改。"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card research-form",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "新增数据记录"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "把结果和证据放在一起" })] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "form-grid four",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "记录日期" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: researchDataDraft.date,
							onChange: (event) => setResearchDataDraft({
								...researchDataDraft,
								date: event.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "记录类型" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: researchDataDraft.kind,
							onChange: (event) => setResearchDataDraft({
								...researchDataDraft,
								kind: event.target.value
							}),
							placeholder: "实验数据 / 现场数据"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "数据 / 实验名称" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: researchDataDraft.title,
							onChange: (event) => setResearchDataDraft({
								...researchDataDraft,
								title: event.target.value
							}),
							placeholder: "例如：RHCR 200 车规模扫描结果"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "关键指标 / 结论" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: researchDataDraft.metrics,
							onChange: (event) => setResearchDataDraft({
								...researchDataDraft,
								metrics: event.target.value
							}),
							placeholder: "吞吐率、等待率、规划时间，或一条可复用判断"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "文件位置 / 链接" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: researchDataDraft.location,
							onChange: (event) => setResearchDataDraft({
								...researchDataDraft,
								location: event.target.value
							}),
							placeholder: "本地文件夹、网盘链接、实验批次编号均可"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "备注" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: researchDataDraft.note,
							onChange: (event) => setResearchDataDraft({
								...researchDataDraft,
								note: event.target.value
							}),
							placeholder: "记录异常、复现条件或下一步分析"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "form-actions",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-primary",
							onClick: addResearchDataRecord,
							children: "保存记录"
						})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "数据日志"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "实验与证据清单" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "card-note",
						children: "点击任一数据条，即可展开完整详情、数据位置与可编辑字段。"
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "muted",
					children: [data.researchDataRecords.length, " 条记录"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "data-strip-list",
				children: [data.researchDataRecords.map((record) => {
					const isExpanded = expandedResearchDataId === record.id;
					const editDraft = isExpanded && researchDataEditDraft?.id === record.id ? researchDataEditDraft : null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: `data-strip ${isExpanded ? "is-expanded" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "data-strip-trigger",
							type: "button",
							onClick: () => toggleResearchDataDetail(record),
							"aria-expanded": isExpanded,
							"aria-controls": `research-data-detail-${record.id}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "data-strip-date",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "记录日期" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: displayDate(record.date) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "data-strip-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "record-badge",
										children: record.kind || "实验数据"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: record.title })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "data-strip-summary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "关键指标" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: record.metrics || "未填写" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "data-strip-location",
									title: record.location || "尚未填写",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "数据位置" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: record.location || "尚未填写" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "data-strip-chevron",
									"aria-hidden": "true",
									children: isExpanded ? "−" : "+"
								})
							]
						}), isExpanded && editDraft && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "data-strip-detail",
							id: `research-data-detail-${record.id}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "data-detail-header",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "eyebrow",
										children: "数据详情与编辑"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: record.title })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "text-button",
										type: "button",
										onClick: closeResearchDataDetail,
										children: "收起"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "data-location-panel",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "数据存放位置 / 链接" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: editDraft.location || "尚未填写数据位置，请在下方补充。" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "data-location-actions",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "button button-small button-secondary",
											type: "button",
											onClick: () => copyResearchDataLocation(editDraft.location),
											children: "复制位置"
										}), /^https?:\/\//i.test(editDraft.location.trim()) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "button button-small button-secondary",
											href: editDraft.location.trim(),
											target: "_blank",
											rel: "noreferrer",
											children: "打开链接"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "form-grid four data-edit-grid",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "field",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "记录日期" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												value: editDraft.date,
												onChange: (event) => setResearchDataEditDraft({
													...editDraft,
													date: event.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "field",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "记录类型" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: editDraft.kind,
												onChange: (event) => setResearchDataEditDraft({
													...editDraft,
													kind: event.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "field field-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "数据 / 实验名称" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: editDraft.title,
												onChange: (event) => setResearchDataEditDraft({
													...editDraft,
													title: event.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "field field-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "关键指标 / 结论" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: editDraft.metrics,
												onChange: (event) => setResearchDataEditDraft({
													...editDraft,
													metrics: event.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "field field-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "文件位置 / 链接" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: editDraft.location,
												onChange: (event) => setResearchDataEditDraft({
													...editDraft,
													location: event.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "field field-span-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "备注" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: editDraft.note,
												onChange: (event) => setResearchDataEditDraft({
													...editDraft,
													note: event.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "form-actions data-edit-actions",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "button button-primary",
												type: "button",
												onClick: saveResearchDataEdit,
												children: "保存修改"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "text-button danger",
												type: "button",
												onClick: () => removeResearchDataRecord(record.id),
												children: "删除记录"
											})]
										})
									]
								})
							]
						})]
					}, record.id);
				}), !data.researchDataRecords.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "还没有数据记录",
					detail: "每次实验结束后记下数据名称、指标、位置和异常情况。"
				})]
			})]
		})
	] });
	const renderLiterature = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "LITERATURE / 从阅读到研究判断",
			title: pageLabel("literature"),
			note: "不只收藏文献：留下它解决什么问题、能否支持你的研究、下一步如何使用。"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card research-form",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "新增文献记录"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "建立可回看的阅读卡片" })] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "form-grid four",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "记录日期" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: literatureDraft.date,
							onChange: (event) => setLiteratureDraft({
								...literatureDraft,
								date: event.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "阅读状态" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: literatureDraft.status,
							onChange: (event) => setLiteratureDraft({
								...literatureDraft,
								status: event.target.value
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "待读" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "在读" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "已读" })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "文献题目" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: literatureDraft.title,
							onChange: (event) => setLiteratureDraft({
								...literatureDraft,
								title: event.target.value
							}),
							placeholder: "论文标题或书籍章节"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "作者 / 期刊 / 会议" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: literatureDraft.source,
							onChange: (event) => setLiteratureDraft({
								...literatureDraft,
								source: event.target.value
							}),
							placeholder: "例如：作者，期刊，年份"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "关键词 / 标签" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: literatureDraft.tags,
							onChange: (event) => setLiteratureDraft({
								...literatureDraft,
								tags: event.target.value
							}),
							placeholder: "例如：拥堵机理、MAPF、实时重调度"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DOI / 链接 / 本地位置" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: literatureDraft.link,
							onChange: (event) => setLiteratureDraft({
								...literatureDraft,
								link: event.target.value
							}),
							placeholder: "可粘贴链接或记录本地文献位置"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "核心观点 / 对我研究的启发" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: literatureDraft.insight,
							onChange: (event) => setLiteratureDraft({
								...literatureDraft,
								insight: event.target.value
							}),
							placeholder: "用一句话说明：它能如何支撑、修正或反驳我的研究判断"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "form-actions",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-primary",
							onClick: addLiteratureRecord,
							children: "保存文献"
						})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "阅读库"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "文献状态与研究启发" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "muted",
					children: [data.literatureRecords.length, " 条记录"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "research-record-grid",
				children: [data.literatureRecords.map((record) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "research-record",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "record-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "record-badge",
								children: "文献"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: displayDate(record.date) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: record.title }),
						record.source && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "record-detail",
							children: record.source
						}),
						record.tags && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "record-detail",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "标签：" }), record.tags]
						}),
						record.link && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "record-detail",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "位置：" }), record.link]
						}),
						record.insight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "record-note",
							children: record.insight
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "record-bottom",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "record-status",
								"aria-label": "文献阅读状态",
								value: record.status,
								onChange: (event) => updateLiteratureStatus(record.id, event.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "待读" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "在读" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "已读" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "record-actions",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "text-button danger",
									onClick: () => removeLiteratureRecord(record.id),
									children: "删除"
								})
							})]
						})
					]
				}, record.id)), !data.literatureRecords.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "还没有文献记录",
					detail: "从一篇关键论文开始，留下题目、状态和一条自己的研究判断。"
				})]
			})]
		})
	] });
	const renderSimulations = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "CODE & SIMULATION / 代码、场景与结果",
			title: pageLabel("simulations"),
			note: "把代码版本、仿真条件、规模和结果连起来，避免后续找不到“这组图是怎么跑出来的”。"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card research-form",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "新增代码仿真记录"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "让每次运行可追溯" })] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "form-grid four",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "记录日期" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: simulationDraft.date,
							onChange: (event) => setSimulationDraft({
								...simulationDraft,
								date: event.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "运行状态" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: simulationDraft.status,
							onChange: (event) => setSimulationDraft({
								...simulationDraft,
								status: event.target.value
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "准备中" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "运行中" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "已完成" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "待复现" })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "代码项目 / 仓库" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: simulationDraft.project,
							onChange: (event) => setSimulationDraft({
								...simulationDraft,
								project: event.target.value
							}),
							placeholder: "例如：lifelong-smart 拥堵调度实验"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "仿真场景 / 参数组" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: simulationDraft.scenario,
							onChange: (event) => setSimulationDraft({
								...simulationDraft,
								scenario: event.target.value
							}),
							placeholder: "例如：仓库 A，Batch-Skewed，RHCR"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "规模 / 批次" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: simulationDraft.scale,
							onChange: (event) => setSimulationDraft({
								...simulationDraft,
								scale: event.target.value
							}),
							placeholder: "200 车 / run-001"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "代码位置 / commit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: simulationDraft.codeRef,
							onChange: (event) => setSimulationDraft({
								...simulationDraft,
								codeRef: event.target.value
							}),
							placeholder: "路径、分支或提交号"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "关键结果 / 异常与结论" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: simulationDraft.result,
							onChange: (event) => setSimulationDraft({
								...simulationDraft,
								result: event.target.value
							}),
							placeholder: "吞吐率、耗时、异常日志或下一步实验判断"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "form-actions",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-primary",
							onClick: addSimulationRecord,
							children: "保存仿真"
						})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "仿真运行日志"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "代码与结果索引" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "muted",
					children: [data.simulationRecords.length, " 条记录"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "research-record-grid",
				children: [data.simulationRecords.map((record) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "research-record",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "record-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "record-badge",
								children: record.scale || "代码仿真"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: displayDate(record.date) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: record.project }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "record-detail",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "场景：" }), record.scenario]
						}),
						record.codeRef && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "record-detail",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "代码：" }), record.codeRef]
						}),
						record.result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "record-note",
							children: record.result
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "record-bottom",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "record-status",
								"aria-label": "仿真运行状态",
								value: record.status,
								onChange: (event) => updateSimulationStatus(record.id, event.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "准备中" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "运行中" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "已完成" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "待复现" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "record-actions",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "text-button danger",
									onClick: () => removeSimulationRecord(record.id),
									children: "删除"
								})
							})]
						})
					]
				}, record.id)), !data.simulationRecords.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "还没有仿真记录",
					detail: "每次运行至少记录项目、场景、规模和一条结果，后续复现会轻松很多。"
				})]
			})]
		})
	] });
	const renderProjects = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "PROJECTS / 可执行推进",
			title: pageLabel("projects"),
			note: "先管理项目，再拆解任务；总览首页负责具体执行与时间块。",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "button-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "button button-secondary",
					onClick: () => setPage("home"),
					children: "查看今天"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "button button-primary",
					onClick: () => setShowProjectForm(!showProjectForm),
					children: "＋ 新建项目"
				})]
			})
		}),
		showProjectForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "inline-form card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "form-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "新增项目" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "text-button",
					onClick: () => setShowProjectForm(false),
					children: "收起"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "form-grid four",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "项目名称" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							value: projectDraft.name,
							onChange: (event) => setProjectDraft({
								...projectDraft,
								name: event.target.value
							}),
							placeholder: "例如：拥堵感知协同调度研究"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "当前阶段" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: projectDraft.stage,
							onChange: (event) => setProjectDraft({
								...projectDraft,
								stage: event.target.value
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "规划中" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "推进中" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "等待反馈" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "已完成" })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "阶段截止" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: projectDraft.deadline,
							onChange: (event) => setProjectDraft({
								...projectDraft,
								deadline: event.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field field-span-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "目标 / 当前成果" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: projectDraft.goal,
							onChange: (event) => setProjectDraft({
								...projectDraft,
								goal: event.target.value
							}),
							placeholder: "一句话写清这一阶段要形成什么结果"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "form-actions",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-primary",
							onClick: addProject,
							children: "保存项目"
						})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "项目"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [data.projects.length, " 个项目"] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "muted",
					children: "点击项目可筛选任务"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "project-grid",
				children: [data.projects.map((project) => {
					const tasks = data.tasks.filter((task) => task.projectId === project.id);
					const done = tasks.filter((task) => task.status === "done").length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "project-card",
						onClick: () => setTaskFilter(project.id),
						tabIndex: 0,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "project-stage",
									children: project.stage
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: project.name }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: project.goal || "尚未补充阶段目标" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "project-footer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: project.deadline ? `截止 ${displayDate(project.deadline)}` : "未设截止" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
									done,
									"/",
									tasks.length,
									" 任务完成"
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: pct(done, tasks.length) })
						]
					}, project.id);
				}), !data.projects.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "先建立一个长期项目",
					detail: "项目应有结果、阶段和截止；任务则是项目下的具体动作。"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card task-board",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "任务总表"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "所有可执行动作" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "button-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "filter-select",
							value: taskFilter,
							onChange: (event) => setTaskFilter(event.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "全部任务"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "todo",
									children: "待开始"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "in_progress",
									children: "进行中"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "done",
									children: "已完成"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "blocked",
									children: "受阻"
								}),
								data.projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: project.id,
									children: project.name
								}, project.id))
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-primary",
							onClick: () => setShowTaskForm(!showTaskForm),
							children: "＋ 新建任务"
						})]
					})]
				}),
				showTaskForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-form soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-grid four",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field field-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "任务名称" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: taskDraft.title,
									onChange: (event) => setTaskDraft({
										...taskDraft,
										title: event.target.value
									}),
									placeholder: "能在一个工作段内推进的动作"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "归属项目" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: taskDraft.projectId,
									onChange: (event) => setTaskDraft({
										...taskDraft,
										projectId: event.target.value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "临时任务"
									}), data.projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: project.id,
										children: project.name
									}, project.id))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "截止日期" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: taskDraft.dueDate,
									onChange: (event) => setTaskDraft({
										...taskDraft,
										dueDate: event.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "优先级" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: taskDraft.priority,
									onChange: (event) => setTaskDraft({
										...taskDraft,
										priority: event.target.value
									}),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "紧急" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "重要" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "一般" })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "预计分钟" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: taskDraft.estimate,
									onChange: (event) => setTaskDraft({
										...taskDraft,
										estimate: event.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "form-actions",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "button button-primary",
									onClick: addTask,
									children: "新增任务"
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-wrap",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "任务" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "项目" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "优先级" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "状态" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "截止" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filteredTasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: task.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
							"预计 ",
							task.estimateMinutes ?? "—",
							" 分钟"
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: data.projects.find((project) => project.id === task.projectId)?.name ?? "临时任务" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `priority priority-${task.priority}`,
							children: task.priority
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `task-status ${task.status}`,
							children: statusText[task.status]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: task.dueDate ? displayDate(task.dueDate) : "未设" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: task.status === "todo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-button",
							onClick: () => startTask(task),
							children: "开始"
						}) : task.status === "in_progress" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-button",
							onClick: () => finishTask(task),
							children: "完成"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-button",
							onClick: () => update((current) => ({
								...current,
								tasks: current.tasks.map((item) => item.id === task.id ? {
									...item,
									status: "todo",
									completedAt: void 0
								} : item)
							})),
							children: "重开"
						}) })
					] }, task.id)), !filteredTasks.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "这里还没有任务",
							detail: "任务要能归属项目、判断紧急程度、设置状态和关键时间。"
						})
					}) })] })] })
				})
			]
		})
	] });
	const renderThesis = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "THESIS / 日周月推进",
			title: pageLabel("thesis"),
			note: "用里程碑、章节进度和推进日志，把写作与修改沉淀为可统计的证据。"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card thesis-summary",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "thesis-main",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "论文信息"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: data.thesis.title || "尚未填写论文题目" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "muted",
							children: "信息保存在本地浏览器，可在数据管理中导出备份。"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "big-progress",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [thesisProgress, "%"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "总体进度" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: thesisProgress,
					label: "基于“里程碑完成度 + 章节进度”估算"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "form-grid four thesis-info",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field field-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "论文题目" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: data.thesis.title,
								onChange: (event) => updateThesis("title", event.target.value),
								placeholder: "可暂时留空"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "目标答辩日期" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: data.thesis.targetDate,
								onChange: (event) => updateThesis("targetDate", event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "当前版本" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: data.thesis.version,
								onChange: (event) => updateThesis("version", event.target.value),
								placeholder: "例如 V1.0"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field field-span-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "备注" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: data.thesis.note,
								onChange: (event) => updateThesis("note", event.target.value),
								placeholder: "例如当前最需要解决的章节或问题"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "form-actions",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button button-secondary",
								onClick: () => notify("论文信息已自动保存"),
								children: "保存信息"
							})
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "two-column",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-heading",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "里程碑"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "关键节点" })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: milestoneDraft.title,
								onChange: (event) => setMilestoneDraft({
									...milestoneDraft,
									title: event.target.value
								}),
								placeholder: "例如：完成第三章仿真实验"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: milestoneDraft.deadline,
								onChange: (event) => setMilestoneDraft({
									...milestoneDraft,
									deadline: event.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button button-small button-primary",
								onClick: addMilestone,
								children: "添加"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "check-list",
						children: [data.thesis.milestones.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "check-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: item.done,
									onChange: () => update((current) => ({
										...current,
										thesis: {
											...current.thesis,
											milestones: current.thesis.milestones.map((row) => row.id === item.id ? {
												...row,
												done: !row.done
											} : row)
										}
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.deadline ? `截止 ${displayDate(item.deadline)}` : "未设截止" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "icon-button danger",
									"aria-label": "删除里程碑",
									onClick: (event) => {
										event.preventDefault();
										update((current) => ({
											...current,
											thesis: {
												...current.thesis,
												milestones: current.thesis.milestones.filter((row) => row.id !== item.id)
											}
										}));
									},
									children: "×"
								})
							]
						}, item.id)), !data.thesis.milestones.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "先放入 3—6 个关键里程碑",
							detail: "只记录会改变论文整体推进状态的节点。"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-heading",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "章节进度"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "写作 / 修改" })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: chapterDraft.title,
								onChange: (event) => setChapterDraft({
									...chapterDraft,
									title: event.target.value
								}),
								placeholder: "例如：第三章 拥堵机理"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: "0",
								max: "100",
								value: chapterDraft.progress,
								onChange: (event) => setChapterDraft({
									...chapterDraft,
									progress: event.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button button-small button-primary",
								onClick: addChapter,
								children: "添加"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chapter-list",
						children: [data.thesis.chapters.map((chapter) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "chapter-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: chapter.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [chapter.progress, "%"] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: "0",
									max: "100",
									value: chapter.progress,
									onChange: (event) => update((current) => ({
										...current,
										thesis: {
											...current.thesis,
											chapters: current.thesis.chapters.map((item) => item.id === chapter.id ? {
												...item,
												progress: Number(event.target.value)
											} : item)
										}
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "icon-button danger",
									onClick: () => update((current) => ({
										...current,
										thesis: {
											...current.thesis,
											chapters: current.thesis.chapters.filter((item) => item.id !== chapter.id)
										}
									})),
									children: "×"
								})
							]
						}, chapter.id)), !data.thesis.chapters.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "还没有章节进度",
							detail: "先把当前真实写作的章节列出来。"
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "论文推进日志"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "把投入与成果写下来" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "muted",
						children: "用于日 / 周 / 月统计"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "form-grid four",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "日期" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: thesisLogDraft.date,
								onChange: (event) => setThesisLogDraft({
									...thesisLogDraft,
									date: event.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "投入分钟" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: thesisLogDraft.minutes,
								onChange: (event) => setThesisLogDraft({
									...thesisLogDraft,
									minutes: event.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "字数（可选）" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: thesisLogDraft.words,
								onChange: (event) => setThesisLogDraft({
									...thesisLogDraft,
									words: event.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field field-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "具体推进" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: thesisLogDraft.note,
								onChange: (event) => setThesisLogDraft({
									...thesisLogDraft,
									note: event.target.value
								}),
								placeholder: "例如：完成临界密度指标的定义与验证结果整理"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "form-actions",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button button-primary",
								onClick: addThesisLog,
								children: "添加日志"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "log-list",
					children: [data.thesis.logs.slice(0, 8).map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "log-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: displayDate(log.date) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: log.note }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
							log.minutes,
							" 分钟",
							log.words ? ` · ${log.words} 字` : ""
						] })] })]
					}, log.id)), !data.thesis.logs.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "第一条推进日志很重要",
						detail: "记录写作、修改、读文献或梳理实验的真实投入。"
					})]
				})
			]
		})
	] });
	const renderSubmissions = () => {
		const stages = [
			"准备中",
			"已投稿",
			"编辑处理中",
			"外审中",
			"返修中"
		];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "SUBMISSIONS / 投稿与成果",
				title: pageLabel("submissions"),
				note: "保留每个项目的阶段、进展与关键日期；成功项目自动归入成果档案。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-heading",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "添加投稿项目"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "新的论文工作流" })] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "form-grid four",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field field-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "论文题目" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: submissionDraft.title,
								onChange: (event) => setSubmissionDraft({
									...submissionDraft,
									title: event.target.value
								}),
								placeholder: "英文或中文题目均可"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "目标期刊 / 会议" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: submissionDraft.journal,
								onChange: (event) => setSubmissionDraft({
									...submissionDraft,
									journal: event.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "当前阶段" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: submissionDraft.status,
								onChange: (event) => setSubmissionDraft({
									...submissionDraft,
									status: event.target.value
								}),
								children: [
									...stages,
									"已录用",
									"已拒稿",
									"撤稿"
								].map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: status }, status))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "投稿日期" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: submissionDraft.submittedDate,
								onChange: (event) => setSubmissionDraft({
									...submissionDraft,
									submittedDate: event.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field field-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "备注" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: submissionDraft.notes,
								onChange: (event) => setSubmissionDraft({
									...submissionDraft,
									notes: event.target.value
								}),
								placeholder: "例如：稿件版本 / 主要等待事项"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "form-actions",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button button-primary",
								onClick: addSubmission,
								children: "保存项目"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "投稿流程看板"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "进行中的项目" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "muted",
						children: [ongoingSubmissions.length, " 项推进中"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kanban",
					children: stages.map((stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "kanban-column",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "kanban-head",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: stage }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: data.submissions.filter((item) => item.status === stage).length })]
							}),
							data.submissions.filter((item) => item.status === stage).map((submission) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "submission-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: submission.journal }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: submission.title }),
									submission.submittedDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["投稿 ", displayDate(submission.submittedDate)] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: submission.status,
										onChange: (event) => update((current) => ({
											...current,
											submissions: current.submissions.map((item) => item.id === submission.id ? {
												...item,
												status: event.target.value
											} : item)
										})),
										children: [
											...stages,
											"已录用",
											"已拒稿",
											"撤稿"
										].map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: status }, status))
									})
								]
							}, submission.id)),
							!data.submissions.some((item) => item.status === stage) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "kanban-empty",
								children: "暂无"
							})
						]
					}, stage))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "two-column",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-heading",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "成果归档"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "已录用成果" })] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "archive-list",
						children: [data.submissions.filter((item) => item.status === "已录用").map((submission) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "log-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "row-icon success",
								children: "成"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: submission.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: submission.journal })] })]
						}, submission.id)), !data.submissions.some((item) => item.status === "已录用") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "暂无归档成果",
							detail: "录用后将自动出现在这里。"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-heading",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "投稿推进日志"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "每次动作都留痕" })] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "form-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: submissionLogDraft.submissionId,
									onChange: (event) => setSubmissionLogDraft({
										...submissionLogDraft,
										submissionId: event.target.value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "选择投稿项目"
									}), data.submissions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: item.id,
										children: item.title
									}, item.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: submissionLogDraft.date,
									onChange: (event) => setSubmissionLogDraft({
										...submissionLogDraft,
										date: event.target.value
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: submissionLogDraft.note,
									onChange: (event) => setSubmissionLogDraft({
										...submissionLogDraft,
										note: event.target.value
									}),
									placeholder: "例如：补充作者信息后重新提交"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "button button-small button-primary",
									onClick: addSubmissionLog,
									children: "添加"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "log-list",
							children: [data.submissions.flatMap((submission) => submission.logs.map((log) => ({
								...log,
								title: submission.title
							}))).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "log-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: displayDate(log.date) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: log.note }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: log.title })] })]
							}, log.id)), !data.submissions.some((item) => item.logs.length) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: "暂无投稿推进日志",
								detail: "记录每次提交、催询、返修和决定。"
							})]
						})
					]
				})]
			})
		] });
	};
	const renderHealth = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "HEALTH / 维持可持续的工作能力",
			title: pageLabel("health"),
			note: "把睡眠、运动、饮食等健康习惯集中在一页，记录应当轻量且可长期坚持。",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "button button-secondary",
				onClick: () => setPage("home"),
				children: "查看今天"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "metric-grid health-metrics",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "健康习惯完成度",
					value: `${habitRate}%`,
					note: "今日已记录的激活习惯",
					tone: "green"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "饮食记录",
					value: `${data.meals.filter((item) => item.date === today).length} 条`,
					note: "轻量记录，不追求详尽",
					tone: "orange"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "体重记录",
					value: lastWeight ? `${lastWeight.weight} kg` : "未记录",
					note: lastWeight ? displayDate(lastWeight.date) : "可按需记录",
					tone: "blue"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "健康习惯记录"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "按记录方式分类" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "muted",
					children: [activeHabits.length, " 项激活习惯"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "habit-grid",
				children: [activeHabits.map((habit) => {
					const logged = completedHabitIds.has(habit.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: `habit-card ${logged ? "done" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "habit-icon",
								children: habit.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: habit.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [habit.method, "记录"] })] }),
							habit.method === "打卡" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button button-small",
								onClick: () => logHabit(habit),
								children: logged ? "已完成" : "打卡"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "habit-entry",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: habitValues[habit.id] ?? "",
									onChange: (event) => setHabitValues({
										...habitValues,
										[habit.id]: event.target.value
									}),
									placeholder: habit.method === "时长" ? "分钟" : habit.method === "次数" ? "次数" : "一句记录"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "button button-small",
									onClick: () => logHabit(habit),
									children: "记录"
								})]
							})
						]
					}, habit.id);
				}), !activeHabits.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "还没有健康习惯",
					detail: "先加一项最容易坚持的，例如睡眠、运动或喝水。"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "two-column",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-heading",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "饮食记录"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "简单记录即可" })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: mealDraft.meal,
								onChange: (event) => setMealDraft({
									...mealDraft,
									meal: event.target.value
								}),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "早餐" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "午餐" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "晚餐" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "加餐" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: mealDraft.date,
								onChange: (event) => setMealDraft({
									...mealDraft,
									date: event.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: mealDraft.note,
								onChange: (event) => setMealDraft({
									...mealDraft,
									note: event.target.value
								}),
								placeholder: "例如：米饭、青菜、鸡胸"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button button-small button-primary",
								onClick: addMeal,
								children: "添加"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "log-list",
						children: [data.meals.filter((item) => item.date === today).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "log-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: item.meal }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.note }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: displayDate(item.date) })] })]
						}, item.id)), !data.meals.some((item) => item.date === today) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "今天尚未记录饮食",
							detail: "一句话即可，重点是看见规律。"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-heading",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "体重记录"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "按需追踪" })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: weightDraft.date,
								onChange: (event) => setWeightDraft({
									...weightDraft,
									date: event.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								step: "0.1",
								value: weightDraft.weight,
								onChange: (event) => setWeightDraft({
									...weightDraft,
									weight: event.target.value
								}),
								placeholder: "kg"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button button-small button-primary",
								onClick: addWeight,
								children: "添加"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "log-list",
						children: [data.weights.slice(0, 5).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "log-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: displayDate(item.date) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [item.weight, " kg"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "体重记录" })] })]
						}, item.id)), !data.weights.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "暂无体重记录",
							detail: "不需要每日记录，按你的健康目标安排即可。"
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-heading",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "习惯管理"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "新增、停用或删除" })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "form-grid four",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field field-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "习惯名称" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: habitDraft.name,
								onChange: (event) => setHabitDraft({
									...habitDraft,
									name: event.target.value
								}),
								placeholder: "例如：午后步行 15 分钟"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "图标" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: habitDraft.icon,
								onChange: (event) => setHabitDraft({
									...habitDraft,
									icon: event.target.value
								}),
								maxLength: 2
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "记录方式" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: habitDraft.method,
								onChange: (event) => setHabitDraft({
									...habitDraft,
									method: event.target.value
								}),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "打卡" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "时长" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "次数" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "文字" })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "form-actions",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button button-primary",
								onClick: addHabit,
								children: "添加习惯"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "manage-habits",
					children: data.habits.map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "manage-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: habit.icon }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: habit.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: habit.method }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "text-button",
								onClick: () => update((current) => ({
									...current,
									habits: current.habits.map((item) => item.id === habit.id ? {
										...item,
										active: !item.active
									} : item)
								})),
								children: habit.active ? "停用" : "启用"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "text-button danger",
								onClick: () => update((current) => ({
									...current,
									habits: current.habits.filter((item) => item.id !== habit.id),
									habitLogs: current.habitLogs.filter((log) => log.habitId !== habit.id)
								})),
								children: "删除"
							})
						]
					}, habit.id))
				})
			]
		})
	] });
	const renderCare = () => {
		const latestCare = data.careRecords[0];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "CARE / 情绪、能量与支持",
				title: pageLabel("care"),
				note: "不追求完美，只记录此刻真实状态与一个能执行的恢复动作。",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "button button-secondary",
					onClick: () => setPage("home"),
					children: "查看今天"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card care-form",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-heading",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "今日心理健康记录"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "给自己一个清晰的停靠点" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-button danger",
							onClick: () => {
								setCareDraft({
									stress: "3",
									energy: "3",
									drain: "",
									care: "",
									gratitude: "",
									support: "",
									words: ""
								});
								notify("已清空本次填写内容");
							},
							children: "清空当天"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "range-grid",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "range-field",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "压力等级" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: "1",
									max: "5",
									value: careDraft.stress,
									onChange: (event) => setCareDraft({
										...careDraft,
										stress: event.target.value
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [careDraft.stress, " / 5"] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "range-field",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "能量等级" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: "1",
									max: "5",
									value: careDraft.energy,
									onChange: (event) => setCareDraft({
										...careDraft,
										energy: event.target.value
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [careDraft.energy, " / 5"] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "今天最消耗我的是什么" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: careDraft.drain,
									onChange: (event) => setCareDraft({
										...careDraft,
										drain: event.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "我做了什么自我关怀" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: careDraft.care,
									onChange: (event) => setCareDraft({
										...careDraft,
										care: event.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "我想感谢的一件事" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: careDraft.gratitude,
									onChange: (event) => setCareDraft({
										...careDraft,
										gratitude: event.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "我需要的支持 / 边界" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: careDraft.support,
									onChange: (event) => setCareDraft({
										...careDraft,
										support: event.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field field-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "对自己说的话" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: careDraft.words,
									onChange: (event) => setCareDraft({
										...careDraft,
										words: event.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "form-actions",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-primary",
							onClick: saveCare,
							children: "保存心灵关怀记录"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card support-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-heading",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "今日支持面板"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "最近关怀记录" })] })
				}), latestCare ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "care-summary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "care-score",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "压力" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: latestCare.stress }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "能量" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: latestCare.energy })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: latestCare.words || "你已经在主动照顾自己的状态。" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: latestCare.care || latestCare.drain || "下一步：为自己留出一个真实的恢复时间块。" })] })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "尚未记录关怀状态",
					detail: "给今天留下一句真实的话，就已经足够。"
				})]
			})
		] });
	};
	const renderAdvisor = () => {
		const waiting = data.advisorRecords.filter((item) => item.tracking === "待跟进");
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "ADVISOR / 清楚沟通与主动跟进",
				title: pageLabel("advisor"),
				note: "把汇报、等待反馈、导师承诺和下一步写清楚，减少只靠记忆承担的不确定感。",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "button button-secondary",
					onClick: () => setPage("home"),
					children: "查看今天"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card advisor-form",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-heading",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "今日导师沟通记录"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "先准备，再沟通，再确认" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-button danger",
							onClick: () => {
								setAdvisorDraft({
									status: "准备沟通",
									channel: "当面",
									pressure: "中",
									clarity: "中",
									topic: "",
									prepared: "",
									request: "",
									risk: "",
									feedback: "",
									promise: "",
									confirmation: "",
									followUpDate: "",
									tracking: "待跟进",
									boundary: "",
									nextAction: ""
								});
								notify("已清空本次填写内容");
							},
							children: "清空当天"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-grid four",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "当前状态" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: advisorDraft.status,
									onChange: (event) => setAdvisorDraft({
										...advisorDraft,
										status: event.target.value
									}),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "准备沟通" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "已沟通" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "等待反馈" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "需要跟进" })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "沟通方式" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: advisorDraft.channel,
									onChange: (event) => setAdvisorDraft({
										...advisorDraft,
										channel: event.target.value
									}),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "当面" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "微信" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "邮件" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "会议" })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "沟通压力" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: advisorDraft.pressure,
									onChange: (event) => setAdvisorDraft({
										...advisorDraft,
										pressure: event.target.value
									}),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "低" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "中" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "高" })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "预期清晰度" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: advisorDraft.clarity,
									onChange: (event) => setAdvisorDraft({
										...advisorDraft,
										clarity: event.target.value
									}),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "低" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "中" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "高" })
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field field-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "这次沟通主题" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: advisorDraft.topic,
									onChange: (event) => setAdvisorDraft({
										...advisorDraft,
										topic: event.target.value
									}),
									placeholder: "例如：确认第二篇论文的研究边界与实验优先级"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "我已经准备好的进展 / 证据" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: advisorDraft.prepared,
									onChange: (event) => setAdvisorDraft({
										...advisorDraft,
										prepared: event.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "我希望导师给的支持 / 决策" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: advisorDraft.request,
									onChange: (event) => setAdvisorDraft({
										...advisorDraft,
										request: event.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "当前卡点 / 误解风险" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: advisorDraft.risk,
									onChange: (event) => setAdvisorDraft({
										...advisorDraft,
										risk: event.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "导师这次的反馈 / 决策" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: advisorDraft.feedback,
									onChange: (event) => setAdvisorDraft({
										...advisorDraft,
										feedback: event.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "subsection",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "防忘管理"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "导师说过的话 / 承诺 / 计划" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-grid",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "导师承诺或计划" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: advisorDraft.promise,
											onChange: (event) => setAdvisorDraft({
												...advisorDraft,
												promise: event.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "我复述确认 / 会后纪要" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: advisorDraft.confirmation,
											onChange: (event) => setAdvisorDraft({
												...advisorDraft,
												confirmation: event.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "下次核对日期" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "date",
											value: advisorDraft.followUpDate,
											onChange: (event) => setAdvisorDraft({
												...advisorDraft,
												followUpDate: event.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "追踪状态" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: advisorDraft.tracking,
											onChange: (event) => setAdvisorDraft({
												...advisorDraft,
												tracking: event.target.value
											}),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "待跟进" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "已确认" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "已完成" })
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "我要守住的边界 / 沟通策略" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: advisorDraft.boundary,
											onChange: (event) => setAdvisorDraft({
												...advisorDraft,
												boundary: event.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "下一次跟进动作 / 时间" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: advisorDraft.nextAction,
											onChange: (event) => setAdvisorDraft({
												...advisorDraft,
												nextAction: event.target.value
											})
										})]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "form-actions",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-primary",
							onClick: saveAdvisor,
							children: "保存导师沟通记录"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "two-column",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-heading",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "今日沟通面板"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "等待与下一步" })] })
						}),
						waiting.slice(0, 4).map((record) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "log-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: record.followUpDate ? displayDate(record.followUpDate) : "待定" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: record.nextAction || record.topic }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: record.promise || record.feedback || "尚未补充承诺或反馈" })] })]
						}, record.id)),
						!waiting.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "没有待跟进承诺",
							detail: "保存沟通记录后，这里会固定显示等待什么、下一步做什么。"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-heading",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "最近 7 天导师互动"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "主动推进留痕" })] })
						}),
						data.advisorRecords.slice(0, 5).map((record) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "log-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: displayDate(record.date) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: record.topic }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								record.status,
								" · ",
								record.channel,
								" · ",
								record.nextAction || "暂无下一步"
							] })] })]
						}, record.id)),
						!data.advisorRecords.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "还没有导师互动记录",
							detail: "从下一次周报、请示或会后纪要开始。"
						})
					]
				})]
			})
		] });
	};
	const renderReview = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "REVIEW / 把经验变成下一步",
			title: pageLabel("review"),
			note: "优先写具体产出和明日优先任务，少写泛泛的“今天在做中”。",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "button button-secondary",
				onClick: () => setPage("home"),
				children: "查看今天"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card review-form",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "PhD 学术复盘"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "今天的推进与阻碍" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "text-button danger",
						onClick: () => {
							setReviewDraft({
								energy: "3",
								note: "",
								output: "",
								unfinished: "",
								insight: "",
								obstacle: "",
								tomorrow: ""
							});
							notify("已清空本次填写内容");
						},
						children: "清空当天"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "range-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "range-field",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "状态 / 能量值" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: "1",
								max: "5",
								value: reviewDraft.energy,
								onChange: (event) => setReviewDraft({
									...reviewDraft,
									energy: event.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [reviewDraft.energy, " / 5"] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "能量管理备注" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: reviewDraft.note,
							onChange: (event) => setReviewDraft({
								...reviewDraft,
								note: event.target.value
							}),
							placeholder: "例如：午后阅读效率较低，改用整理实验记录"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-grid",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "今天的具体产出" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: reviewDraft.output,
								onChange: (event) => setReviewDraft({
									...reviewDraft,
									output: event.target.value
								}),
								placeholder: "文件、图表、结论、提交物，而不是‘看论文’"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "未完成与拖延分析" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: reviewDraft.unfinished,
								onChange: (event) => setReviewDraft({
									...reviewDraft,
									unfinished: event.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "学术洞见 / 判断更新" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: reviewDraft.insight,
								onChange: (event) => setReviewDraft({
									...reviewDraft,
									insight: event.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "障碍与对策" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: reviewDraft.obstacle,
								onChange: (event) => setReviewDraft({
									...reviewDraft,
									obstacle: event.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field field-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "明日优先任务" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: reviewDraft.tomorrow,
								onChange: (event) => setReviewDraft({
									...reviewDraft,
									tomorrow: event.target.value
								}),
								placeholder: "保存后会自动进入任务总表，截止日期设为明天。"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "form-actions",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "button button-primary",
						onClick: saveReview,
						children: "保存复盘"
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "最近 7 天回顾"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "从记录中看趋势" })] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "review-list",
				children: [data.reviews.slice(0, 7).map((record) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "review-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: displayDate(record.date) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"能量 ",
							record.energy,
							"/5"
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: record.output || "未填写具体产出" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: record.tomorrow || record.insight || "未补充明日动作或洞见" })
					]
				}, record.id)), !data.reviews.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "还没有复盘记录",
					detail: "从今天的一件具体产出和明天的第一步开始。"
				})]
			})]
		})
	] });
	const renderAchievements = () => {
		const lines = [
			{
				name: "执行系统",
				current: Math.min(3, Math.floor((data.tasks.filter((task) => task.status === "done").length + data.focusRecords.filter((item) => item.end).length) / 5) + 1),
				count: data.tasks.filter((task) => task.status === "done").length,
				hint: "完成任务 + 专注记录"
			},
			{
				name: "科研推进",
				current: Math.min(3, Math.floor((data.thesis.logs.length + data.submissions.flatMap((item) => item.logs).length) / 4) + 1),
				count: data.thesis.logs.length + data.submissions.flatMap((item) => item.logs).length,
				hint: "论文与投稿推进"
			},
			{
				name: "身心恢复",
				current: Math.min(3, Math.floor((data.habitLogs.length + data.careRecords.length) / 5) + 1),
				count: data.habitLogs.length + data.careRecords.length,
				hint: "习惯与关怀记录"
			},
			{
				name: "支持体系",
				current: Math.min(3, Math.floor((data.advisorRecords.length + data.reviews.length) / 4) + 1),
				count: data.advisorRecords.length + data.reviews.length,
				hint: "导师沟通与复盘"
			}
		];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "ACHIEVEMENTS / 看见持续积累",
				title: pageLabel("achievements"),
				note: "同一条能力线会随着记录累积不断升阶：开始做、持续做、稳定做。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card achievement-intro",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "升阶体系"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "不是一次性徽章，而是长期能力线" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "持续记录的意义，是让你看见自己从“开始”走向“稳定”的过程。" })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "achievement-number",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: data.tasks.filter((task) => task.status === "done").length + data.focusRecords.filter((item) => item.end).length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "已沉淀推进记录" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "achievement-grid",
				children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "achievement-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "row-icon success",
							children: "★"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: line.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
								"第 ",
								line.current,
								" 阶"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								line.count,
								" 条 ",
								line.hint
							] })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "level-dots",
							children: [
								1,
								2,
								3
							].map((level) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: level <= line.current ? "active" : "",
								children: level === 1 ? "初阶" : level === 2 ? "进阶" : "高阶"
							}, level))
						})
					]
				}, line.name))
			})
		] });
	};
	const renderAnalytics = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "ANALYTICS / 统一视角",
			title: pageLabel("analytics"),
			note: "把推进、恢复与沟通放进同一时间范围，更容易判断真正的瓶颈在哪里。",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "segmented",
				children: [
					"每日",
					"每周",
					"每月"
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: period === item ? "active" : "",
					onClick: () => setPeriod(item),
					children: item
				}, item))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "metric-grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "范围亮点",
					value: period === "每日" ? `${todayFocusMinutes} 分钟` : period === "每周" ? `${data.focusRecords.filter((record) => weekDays.includes(localDate(new Date(record.start)))).reduce((sum, record) => sum + durationMinutes(record.start, record.end), 0)} 分钟` : `${data.focusRecords.reduce((sum, record) => sum + durationMinutes(record.start, record.end), 0)} 分钟`,
					note: "专注投入",
					tone: "blue"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "模块覆盖",
					value: `${[
						data.focusRecords.length,
						data.thesis.logs.length,
						data.submissions.length,
						data.habitLogs.length,
						data.careRecords.length + data.advisorRecords.length + data.reviews.length
					].filter(Boolean).length}/5`,
					note: "留下真实记录的模块",
					tone: "green"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "论文投入",
					value: `${data.thesis.logs.reduce((sum, log) => sum + log.minutes, 0)} 分钟`,
					note: "累计推进日志",
					tone: "orange"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "投稿项目",
					value: data.submissions.length,
					note: "含归档成果",
					tone: "violet"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "专注时长趋势"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "最近 7 天" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "muted",
					children: "按专注记录自动汇总"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bar-chart",
				children: weekDays.map((day) => {
					const value = data.focusRecords.filter((record) => isSameDay(record.start, day)).reduce((sum, record) => sum + durationMinutes(record.start, record.end, clockNow), 0);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bar-unit",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bar-value",
								children: value || ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bar-rail",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { height: `${Math.max(value ? 8 : 0, value / maxFocus * 100)}%` } })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: (/* @__PURE__ */ new Date(`${day}T12:00:00`)).toLocaleDateString("zh-CN", { weekday: "narrow" }) })
						]
					}, day);
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "two-column",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-heading",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "健康习惯完成度"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "今天" })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: habitRate,
						label: `${completedHabitIds.size}/${activeHabits.length} 项完成`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "module-list",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["工作打卡时长 ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [todayWorkMinutes, " 分钟"] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["饮食记录 ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [data.meals.filter((item) => item.date === today).length, " 条"] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["最近体重 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: lastWeight ? `${lastWeight.weight} kg` : "—" })] })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-heading",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "关怀 / 导师 / 复盘"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "支持系统" })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "module-list",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["心灵关怀 ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [data.careRecords.length, " 条"] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["导师沟通 ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [data.advisorRecords.length, " 条"] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["每日复盘 ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [data.reviews.length, " 条"] })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "muted",
						children: "若科研推进卡住，先看是否是恢复与沟通不足，而不是单纯不够努力。"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "投稿阶段分布"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "当前投稿项目" })] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "stage-distribution",
				children: [
					"准备中",
					"已投稿",
					"编辑处理中",
					"外审中",
					"返修中",
					"已录用"
				].map((stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stage }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: data.submissions.filter((item) => item.status === stage).length })] }, stage))
			})]
		})
	] });
	const renderData = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "DATA / 本机保存与备份",
			title: pageLabel("data"),
			note: "浏览器数据与本地文件夹可并行保存；定期备份可以避免设备或浏览器更换造成的损失。"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card workspace-settings",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "页面文字与显示"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "工作台名称、页面名称和字号" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "muted",
						children: "修改后立即保存"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "form-grid four",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "工作台主标题" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: data.workspace.brandName,
								onChange: (event) => updateWorkspace({ brandName: event.target.value }),
								placeholder: "例如：PhD Master"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "工作台副标题" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: data.workspace.brandSubtitle,
								onChange: (event) => updateWorkspace({ brandSubtitle: event.target.value }),
								placeholder: "例如：Workspace"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "整体字号" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: data.workspace.fontScale,
								onChange: (event) => updateWorkspace({ fontScale: event.target.value }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "standard",
									children: "标准（约五号）"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "comfortable",
									children: "舒适（约四号）"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field field-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "首页说明" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: data.workspace.homeNote,
								onChange: (event) => updateWorkspace({ homeNote: event.target.value }),
								placeholder: "写一段你希望每天看到的工作提示"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "copy-grid",
					children: navItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [item.label, " 的页面名称"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: data.workspace.pageLabels[item.id] ?? item.label,
							onChange: (event) => setPageLabel(item.id, event.target.value)
						})]
					}, item.id))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card local-sync-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "本地文件夹同步"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "把数据同步到你选择的本地文件夹" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `sync-status ${localFolderStatus}`,
						children: localFolderStatus === "connected" ? `已连接 · ${localFolder?.name}` : localFolderStatus === "needs-permission" ? "等待授权" : localFolderStatus === "unsupported" ? "浏览器不支持" : "未连接"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "muted",
					children: [
						"首次点击后，在弹出的选择窗口中选择一个专用文件夹。当前网页中已保存的数据会自动写入其中的 ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: LOCAL_DATA_FILE }),
						"，以后每次修改都会同步。"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "button-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-primary",
							onClick: connectLocalFolder,
							children: localFolderStatus === "needs-permission" ? "恢复本地文件夹权限" : "选择本地工作台文件夹"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-secondary",
							onClick: syncToLocalFolder,
							disabled: localFolderStatus === "unsupported",
							children: "立即同步到本地"
						}),
						localFolder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-quiet",
							onClick: disconnectLocalFolder,
							children: "断开同步"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sync-foot",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["本地文件：", localFolder ? `${localFolder.name}\${LOCAL_DATA_FILE}` : "尚未选择"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lastLocalSync ? `最近同步：${displayTime(lastLocalSync)}` : "连接后会显示同步时间" })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card storage-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "storage-meta",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "兼容存储键" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: STORAGE_KEY })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "数据大小" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: dataSize })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "最后更新" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: data.updatedAt ? `${displayDate(localDate(new Date(data.updatedAt)))} ${displayTime(data.updatedAt)}` : "—" })] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "button-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-primary",
							onClick: exportData,
							children: "下载 JSON 备份"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-secondary",
							onClick: copyData,
							children: "复制 JSON 到剪贴板"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "button button-secondary file-button",
							children: ["导入 JSON 文件", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "application/json",
								onChange: (event) => handleFileImport(event.target.files?.[0])
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-danger",
							onClick: () => {
								if (window.confirm("确定清空全部数据吗？此操作仅能通过已下载的备份恢复。")) {
									setData(blankData());
									notify("全部本机数据已清空");
								}
							},
							children: "清空全部数据"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "import-area",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "粘贴 JSON 进行导入" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: importText,
							onChange: (event) => setImportText(event.target.value),
							placeholder: "把此前导出的 JSON 粘贴在这里"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "button button-secondary",
						onClick: () => importData(),
						children: "导入这段 JSON"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "最近新增"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "记录概览" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "muted",
					children: [recentActivities.length, " 条可回看记录"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "activity-list",
				children: [recentActivities.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "log-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: displayDate(localDate(new Date(item.date))) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.kind })] })]
				}, `${item.date}-${index}`)), !recentActivities.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "数据还是空的",
					detail: "开始打卡、建立任务或保存一条论文推进日志后，这里会显示近期记录。"
				})]
			})]
		})
	] });
	let content;
	if (page === "home") content = renderHome();
	else if (page === "plans") content = renderPlans();
	else if (page === "projects") content = renderProjects();
	else if (page === "thesis") content = renderThesis();
	else if (page === "submissions") content = renderSubmissions();
	else if (page === "researchData") content = renderResearchData();
	else if (page === "literature") content = renderLiterature();
	else if (page === "simulations") content = renderSimulations();
	else if (page === "health") content = renderHealth();
	else if (page === "care") content = renderCare();
	else if (page === "advisor") content = renderAdvisor();
	else if (page === "review") content = renderReview();
	else if (page === "achievements") content = renderAchievements();
	else if (page === "analytics") content = renderAnalytics();
	else content = renderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "workspace-shell",
		"data-font-scale": data.workspace.fontScale,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sidebar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "brand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "brand-mark",
							children: data.workspace.brandName.trim().slice(0, 1).toUpperCase() || "Y"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: data.workspace.brandName || "Yang · PhD Master" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: data.workspace.brandSubtitle || "Workspace" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sidebar-date",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "今天" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: displayDate(today) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						"aria-label": "工作台导航",
						children: navItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "nav-group",
							children: [item.group && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.group }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: `nav-item ${page === item.id ? "active" : ""}`,
								onClick: () => setPage(item.id),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.short }),
									pageLabel(item.id),
									item.id === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: todayTasks.length })
								]
							})]
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sidebar-foot",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: localFolderStatus === "connected" ? "本地同步已启用" : "本机模式" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: localFolderStatus === "connected" ? `已同步到 ${localFolder?.name} 文件夹。` : "当前数据保存在浏览器；可在数据管理中连接本地文件夹。" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "main",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ambient-orb ambient-orb-one",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ambient-orb ambient-orb-two",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "topbar",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "masthead",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "masthead-seal",
								"aria-hidden": "true",
								children: "Y"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "crumb",
								children: [
									data.workspace.brandName,
									" ",
									data.workspace.brandSubtitle,
									" / ",
									pageTitle
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: pageTitle })] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "topbar-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "segmented compact",
								children: [
									"每日",
									"每周",
									"每月"
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: period === item ? "active" : "",
									onClick: () => setPeriod(item),
									children: item
								}, item))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "date-chip",
								onClick: () => setPage("home"),
								children: "回到今天"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "content page-enter",
						children: content
					}, page)
				]
			}),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "toast",
				role: "status",
				children: toast
			})
		]
	});
}
//#endregion
export { Home as default };
