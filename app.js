const STORAGE_KEY = "brighten-blooms-homework-records";

const subjects = [
  {
    id: "telugu",
    label: "TELUGU",
    color: "green",
    icon: "./assets/icons/telugu.png",
    decor: "./assets/decor/telugu-decor.png",
    watermark: "./assets/watermarks/telugu.png"
  },
  {
    id: "hindi",
    label: "HINDI",
    color: "orange",
    icon: "./assets/icons/hindi.png",
    decor: "./assets/decor/hindi-decor.png",
    watermark: "./assets/watermarks/hindi.png"
  },
  {
    id: "english",
    label: "ENGLISH",
    color: "blue",
    icon: "./assets/icons/english.png",
    decor: "./assets/decor/english-decor.png",
    watermark: "./assets/watermarks/english.png"
  },
  {
    id: "maths",
    label: "MATHS",
    color: "purple",
    icon: "./assets/icons/maths.png",
    decor: "./assets/decor/maths-decor.png",
    watermark: "./assets/watermarks/maths.png"
  },
  {
    id: "science",
    label: "EVS / SCIENCE",
    color: "green",
    icon: "./assets/icons/evs-science.png",
    decor: "./assets/decor/evs-science-decor.png",
    watermark: "./assets/watermarks/evs-science.png"
  },
  {
    id: "gkComputer",
    label: "GK / COMPUTER",
    color: "pink",
    icon: "./assets/icons/gk.png",
    decor: "./assets/decor/computer-decor.png",
    watermark: "./assets/watermarks/computer.png"
  },
  {
    id: "social",
    label: "SOCIAL",
    color: "brown",
    icon: "./assets/icons/social.png",
    decor: "./assets/decor/social-decor.png",
    watermark: "./assets/watermarks/social.png"
  }
];

let currentRecordId = null;

const els = {
  loginView: document.querySelector("#loginView"),
  dashboard: document.querySelector("#dashboard"),
  subjectList: document.querySelector("#subjectList"),
  classInput: document.querySelector("#classInput"),
  dateInput: document.querySelector("#dateInput"),
  saveButton: document.querySelector("#saveButton"),
  downloadButton: document.querySelector("#downloadButton"),
  downloadMenu: document.querySelector("#downloadMenu"),
  downloadOptions: document.querySelector("#downloadOptions"),
  clearButton: document.querySelector("#clearButton"),
  refreshButton: document.querySelector("#refreshButton"),
  logoutButton: document.querySelector("#logoutButton"),
  saveStatus: document.querySelector("#saveStatus"),
  historyList: document.querySelector("#historyList"),
  homeworkSheet: document.querySelector("#homeworkSheet")
};

function todayText() {
  const date = new Date();
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;
}

function clean(value) {
  return String(value || "").trim();
}

function safeFile(value) {
  return clean(value).replace(/[^a-z0-9]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function status(text, error = false) {
  els.saveStatus.textContent = text;
  els.saveStatus.style.color = error ? "#c01845" : "";
}

function records() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecords(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function buildSubjects() {
  els.subjectList.innerHTML = subjects
    .map((subject) => `
      <div class="subject-row" data-color="${subject.color}" data-subject="${subject.id}">
        <div class="subject-icon"><img src="${subject.icon}" alt="${subject.label} icon" loading="eager" /></div>
        <label class="subject-field">
          <span class="subject-label"><span class="label-spark" aria-hidden="true"></span>${subject.label} :</span>
          <img class="subject-decor" src="${subject.decor}" alt="" aria-hidden="true" loading="eager" />
          <textarea class="subject-textarea" id="${subject.id}Input" placeholder="Enter homework..." rows="2"></textarea>
          <img class="subject-watermark" src="${subject.watermark}" alt="" aria-hidden="true" loading="eager" />
        </label>
      </div>
    `)
    .join("");

  document.querySelectorAll(".subject-textarea").forEach((textarea) => {
    textarea.addEventListener("input", () => grow(textarea));
    grow(textarea);
  });
}

function grow(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = `${Math.max(54, textarea.scrollHeight)}px`;
}

function formData() {
  const subjectData = {};
  subjects.forEach((subject) => {
    subjectData[subject.id] = clean(document.querySelector(`#${subject.id}Input`).value);
  });

  return {
    className: clean(els.classInput.value),
    dateText: clean(els.dateInput.value),
    subjects: subjectData
  };
}

function fillForm(record = {}) {
  els.classInput.value = record.className || "";
  els.dateInput.value = record.dateText || todayText();
  subjects.forEach((subject) => {
    const textarea = document.querySelector(`#${subject.id}Input`);
    textarea.value = subject.id === "gkComputer"
      ? record.subjects?.gkComputer || record.subjects?.gk || record.subjects?.computer || ""
      : record.subjects?.[subject.id] || "";
    grow(textarea);
  });
}

function renderHistory() {
  const items = records().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  if (!items.length) {
    els.historyList.innerHTML = `
      <div class="empty-state">
        <span class="empty-illustration" aria-hidden="true"></span>
        <strong>No saved records yet.</strong>
        <span>Your saved homework will appear here.</span>
      </div>
    `;
    return;
  }

  els.historyList.innerHTML = items
    .map((record) => {
      const title = [record.dateText || "No date", record.className ? `Class ${record.className}` : ""]
        .filter(Boolean)
        .join(" | ");
      return `<button class="history-item" type="button" data-id="${record.id}"><strong>${title}</strong><span>Click to edit or download again</span></button>`;
    })
    .join("");

  document.querySelectorAll(".history-item").forEach((button) => {
    button.addEventListener("click", () => {
      const record = records().find((item) => item.id === button.dataset.id);
      if (!record) return;
      currentRecordId = record.id;
      fillForm(record);
      status("Loaded saved homework.");
    });
  });
}

function saveHomework() {
  const data = formData();
  if (!data.dateText) {
    status("Please enter date.", true);
    return;
  }

  const items = records();
  const now = new Date().toISOString();
  const id = currentRecordId || `homework-${Date.now()}`;
  const existingIndex = items.findIndex((item) => item.id === id);
  const record = { id, ...data, updatedAt: now, createdAt: items[existingIndex]?.createdAt || now };

  if (existingIndex >= 0) items[existingIndex] = record;
  else items.unshift(record);

  currentRecordId = id;
  saveRecords(items);
  renderHistory();
  status("Saved successfully in this browser.");
}

function clearHomework() {
  currentRecordId = null;
  fillForm({ dateText: todayText(), subjects: {} });
  status("Ready.");
}

function loadScript(src, globalName) {
  if (window[globalName]) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function waitForRenderedAssets(container) {
  if (document.fonts?.ready) await document.fonts.ready;

  const images = Array.from(container.querySelectorAll("img"));
  await Promise.all(
    images.map((image) => {
      if (image.complete && image.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    })
  );

  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function openDownloadMenu() {
  els.downloadMenu.classList.add("is-open");
  els.downloadButton.setAttribute("aria-expanded", "true");
}

function closeDownloadMenu() {
  els.downloadMenu.classList.remove("is-open");
  els.downloadButton.setAttribute("aria-expanded", "false");
}

function toggleDownloadMenu() {
  if (els.downloadMenu.classList.contains("is-open")) closeDownloadMenu();
  else openDownloadMenu();
}

function flattenCanvas(sourceCanvas, fill = "#fff6cf") {
  const canvas = document.createElement("canvas");
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;
  const context = canvas.getContext("2d");
  context.fillStyle = fill;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(sourceCanvas, 0, 0);
  return canvas;
}

async function worksheetCanvas() {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js", "html2canvas");
  await waitForRenderedAssets(els.homeworkSheet);

  const rect = els.homeworkSheet.getBoundingClientRect();
  return window.html2canvas(els.homeworkSheet, {
    backgroundColor: "#fff6cf",
    scale: Math.max(3, window.devicePixelRatio || 1),
    useCORS: true,
    allowTaint: true,
    width: rect.width,
    height: rect.height,
    windowWidth: document.documentElement.clientWidth,
    windowHeight: document.documentElement.clientHeight,
    scrollX: 0,
    scrollY: 0,
    logging: false,
    onclone: (clonedDocument) => {
      clonedDocument.querySelectorAll(".subject-textarea").forEach((textarea) => {
        textarea.removeAttribute("placeholder");
      });
    }
  });
}

async function downloadImage(format) {
  const isPng = format === "png";
  status(`Preparing ${isPng ? "PNG" : "JPEG"}...`);

  try {
    const sourceCanvas = await worksheetCanvas();
    const canvas = isPng ? sourceCanvas : flattenCanvas(sourceCanvas);
    const data = formData();
    const link = document.createElement("a");
    link.download = `homework-${safeFile(data.dateText) || "today"}.${isPng ? "png" : "jpg"}`;
    link.href = isPng ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.92);
    link.click();
    status(`High-resolution ${isPng ? "PNG" : "JPEG"} downloaded.`);
  } catch {
    status(`${isPng ? "PNG" : "JPEG"} export could not load.`, true);
  }
}

async function downloadPdf() {
  status("Preparing PDF...");

  try {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", "jspdf");
    const sourceCanvas = await worksheetCanvas();
    const canvas = flattenCanvas(sourceCanvas);
    const data = formData();
    const pageWidth = 210;
    const pageHeight = pageWidth * (canvas.height / canvas.width);
    const pdf = new window.jspdf.jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pageWidth, pageHeight]
    });

    pdf.addImage(canvas.toDataURL("image/jpeg", 0.94), "JPEG", 0, 0, pageWidth, pageHeight);
    pdf.save(`homework-${safeFile(data.dateText) || "today"}.pdf`);
    status("High-quality PDF downloaded.");
  } catch {
    status("PDF export could not load. Opening print dialog instead.", true);
    window.print();
  }
}

function handleDownload(format) {
  closeDownloadMenu();
  if (format === "png") return downloadImage("png");
  if (format === "pdf") return downloadPdf();
  return downloadImage("jpeg");
}

function init() {
  els.loginView.classList.add("is-hidden");
  els.dashboard.classList.remove("is-hidden");
  buildSubjects();
  fillForm({ dateText: todayText(), subjects: {} });
  renderHistory();

  els.saveButton.addEventListener("click", saveHomework);
  els.downloadButton.addEventListener("click", toggleDownloadMenu);
  els.downloadOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-format]");
    if (button) handleDownload(button.dataset.format);
  });
  document.addEventListener("click", (event) => {
    if (!els.downloadMenu.contains(event.target)) closeDownloadMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDownloadMenu();
  });
  els.clearButton.addEventListener("click", clearHomework);
  els.refreshButton.addEventListener("click", renderHistory);
  els.logoutButton.addEventListener("click", clearHomework);
}

init();
