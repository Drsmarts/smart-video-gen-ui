/* ============ i18n & UI Text ============ */
const T = {
  ar: {
    dir: "rtl",
    genTitle: "إنشاء فيديو",
    desc: "وصف الفيديو",
    descHint: "مثال: إعلان قصير لمنتج…",
    duration: "المدة (ث)",
    aspect: "نسبة الأبعاد",
    quality: "جودة الفيديو",
    voice: "لغة التعليق الصوتي",
    style: "الأسلوب",
    theme: "الثيم",
    generate: "إنشاء الفيديو",
    previewTitle: "المعاينة",
    myVideosTitle: "فيديوهاتي",
    settings: "الإعدادات",
    save: "حفظ الإعدادات",
    saved: "تم حفظ الإعدادات!",
    preparing: "جارٍ التحضير...",
    done: "تم إنشاء عنصر معاينة تجريبي.",
    today: "اليوم",
    yesterday: "الأمس",
    placeholder: "سيظهر الفيديو هنا بعد الإنشاء."
  },
  en: {
    dir: "ltr",
    genTitle: "Generate Video",
    desc: "Video Description",
    descHint: "e.g., a short promo for a new product…",
    duration: "Duration (s)",
    aspect: "Aspect Ratio",
    quality: "Video Quality",
    voice: "Voice Language",
    style: "Style",
    theme: "Theme",
    generate: "Generate Video",
    previewTitle: "Preview",
    myVideosTitle: "My Videos",
    settings: "Settings",
    save: "Save Settings",
    saved: "Settings saved!",
    preparing: "Preparing...",
    done: "Preview item created (demo).",
    today: "Today",
    yesterday: "Yesterday",
    placeholder: "Your video will appear here after generation."
  },
  de: {
    dir: "ltr",
    genTitle: "Video erstellen",
    desc: "Videobeschreibung",
    descHint: "z. B. kurzer Werbeclip für ein neues Produkt…",
    duration: "Dauer (s)",
    aspect: "Seitenverhältnis",
    quality: "Videoqualität",
    voice: "Sprachkommentar",
    style: "Stil",
    theme: "Theme",
    generate: "Video erstellen",
    previewTitle: "Vorschau",
    myVideosTitle: "Meine Videos",
    settings: "Einstellungen",
    save: "Einstellungen speichern",
    saved: "Einstellungen gespeichert!",
    preparing: "Wird vorbereitet...",
    done: "Vorschauelement erstellt (Demo).",
    today: "Heute",
    yesterday: "Gestern",
    placeholder: "Dein Video erscheint nach der Erstellung hier."
  }
};

const els = {
  body: document.body,
  appVersion: document.getElementById("appVersion"),
  uiLang: document.getElementById("uiLang"),

  genTitle: document.getElementById("genTitle"),
  lblDesc: document.getElementById("lblDesc"),
  lblDuration: document.getElementById("lblDuration"),
  lblAspect: document.getElementById("lblAspect"),
  lblQuality: document.getElementById("lblQuality"),
  lblVoice: document.getElementById("lblVoice"),
  lblStyle: document.getElementById("lblStyle"),
  lblTheme: document.getElementById("lblTheme"),
  desc: document.getElementById("desc"),
  descHint: document.getElementById("descHint"),
  duration: document.getElementById("duration"),
  aspect: document.getElementById("aspect"),
  quality: document.getElementById("quality"),
  voice: document.getElementById("voice"),
  style: document.getElementById("style"),
  theme: document.getElementById("theme"),
  btnGenerate: document.getElementById("btnGenerate"),
  status: document.getElementById("status"),

  previewTitle: document.getElementById("previewTitle"),
  preview: document.getElementById("preview"),

  myVideosTitle: document.getElementById("myVideosTitle"),
  videoList: document.getElementById("videoList"),

  openSettings: document.getElementById("openSettings"),
  settingsDlg: document.getElementById("settingsDlg"),
  closeSettings: document.getElementById("closeSettings"),
  settingsTitle: document.getElementById("settingsTitle"),
  defLang: document.getElementById("defLang"),
  defQuality: document.getElementById("defQuality"),
  btnSaveSettings: document.getElementById("btnSaveSettings"),
  settingsMsg: document.getElementById("settingsMsg"),
};

const state = {
  locale: localStorage.getItem("ui.locale") || "ar",
  defaultQuality: localStorage.getItem("ui.quality") || "720p",
  version: "0.1.0"
};

/* ============ Helpers ============ */
function setLocale(lc) {
  const t = T[lc] || T.ar;
  state.locale = lc;
  localStorage.setItem("ui.locale", lc);

  document.documentElement.lang = lc;
  document.documentElement.dir = t.dir;
  els.body.classList.toggle("rtl", t.dir === "rtl");
  els.body.classList.toggle("ltr", t.dir === "ltr");

  // Labels & titles
  els.genTitle.textContent = t.genTitle;
  els.lblDesc.textContent = t.desc;
  els.descHint.textContent = t.descHint;
  els.lblDuration.textContent = t.duration;
  els.lblAspect.textContent = t.aspect;
  els.lblQuality.textContent = t.quality;
  els.lblVoice.textContent = t.voice;
  els.lblStyle.textContent = t.style;
  els.lblTheme.textContent = t.theme;
  els.btnGenerate.textContent = t.generate;
  els.previewTitle.textContent = t.previewTitle;
  els.myVideosTitle.textContent = t.myVideosTitle;
  els.settingsTitle.textContent = t.settings;
  els.btnSaveSettings.textContent = t.save;

  // Placeholder
  const ph = t.placeholder;
  if (!els.preview.querySelector(".placeholder")) {
    els.preview.innerHTML = `<div class="placeholder"><span>${ph}</span></div>`;
  } else {
    els.preview.querySelector(".placeholder span").textContent = ph;
  }
}

function msg(txt) { els.status.textContent = txt; }
function fmtDateGroup(d) {
  const now = new Date(); const date = new Date(d);
  const diff = (now - date) / (1000*60*60*24);
  if (diff < 1 && now.getDate() === date.getDate())
    return T[state.locale].today;
  if (diff < 2 && new Date(now-86400000).getDate() === date.getDate())
    return T[state.locale].yesterday;
  return date.toLocaleDateString(state.locale);
}

function renderList(items) {
  els.videoList.innerHTML = "";
  const groups = {};
  items.forEach(x => {
    const g = fmtDateGroup(x.date);
    groups[g] = groups[g] || [];
    groups[g].push(x);
  });

  Object.entries(groups).forEach(([g, list]) => {
    const h3 = document.createElement("h3");
    h3.textContent = g;
    h3.style.margin = "8px 0";
    els.videoList.appendChild(h3);

    list.forEach(v => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div class="thumb">${v.aspect}</div>
        <div>
          <h4>${v.title}</h4>
          <div class="meta">${v.duration}s • ${v.quality} • ${new Date(v.date).toLocaleTimeString(state.locale)}</div>
        </div>
        <div class="badge">${v.status}</div>
      `;
      els.videoList.appendChild(div);
    });
  });
}

/* Demo seed */
const demoItems = [
  { title: "قناة تركي فقية", duration: 10, quality: "720p", aspect: "16:9", status: "جاهز", date: new Date().toISOString() },
  { title: "كليب ربح", duration: 10, quality: "720p", aspect: "1:1", status: "جاهز", date: new Date(Date.now()-86400000).toISOString() }
];

/* ============ Events ============ */
function wireEvents() {
  els.uiLang.value = state.locale;
  els.uiLang.addEventListener("change", e => {
    setLocale(e.target.value);
    els.defLang.value = e.target.value;
  });

  // Settings dialog
  els.openSettings.addEventListener("click", () => els.settingsDlg.showModal());
  els.closeSettings.addEventListener("click", () => els.settingsDlg.close());
  els.defLang.value = state.locale;
  els.defQuality.value = state.defaultQuality;

  els.settingsDlg.addEventListener("close", () => els.settingsMsg.textContent = "");
  els.btnSaveSettings.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.setItem("ui.locale", els.defLang.value);
    localStorage.setItem("ui.quality", els.defQuality.value);
    state.defaultQuality = els.defQuality.value;
    setLocale(els.defLang.value);
    els.settingsMsg.textContent = T[state.locale].saved;
    setTimeout(()=> els.settingsMsg.textContent="", 1800);
  });

  // Generate demo
  document.getElementById("genForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    els.btnGenerate.disabled = true;
    msg(T[state.locale].preparing);

    // TODO: لاحقًا — نربط بـ Azure Function / APIM
    await new Promise(res => setTimeout(res, 900));

    // Write Preview
    els.preview.innerHTML = `
      <div class="placeholder">
        <span> ${T[state.locale].done} (${els.aspect.value}, ${els.quality.value}, ${els.duration.value}s) </span>
      </div>
    `;

    // Push into list (demo)
    demoItems.unshift({
      title: (els.desc.value || "مشروع جديد").slice(0, 40),
      duration: parseInt(els.duration.value, 10) || 15,
      quality: els.quality.value,
      aspect: els.aspect.value,
      status: "Queue",
      date: new Date().toISOString()
    });
    renderList(demoItems);

    msg("");
    els.btnGenerate.disabled = false;
  });
}

/* ============ Init ============ */
(function init(){
  els.appVersion.textContent = "v" + state.version;
  setLocale(state.locale);
  // Defaults into form
  els.quality.value = state.defaultQuality;
  els.voice.value = state.locale;
  renderList(demoItems);
  wireEvents();
})();
