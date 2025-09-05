// تنقّل بين الشاشات
const screens = {
  generate: document.getElementById('screen-generate'),
  myvideos: document.getElementById('screen-myvideos'),
  settings: document.getElementById('screen-settings')
};
const headerStatus = document.getElementById('deployStatus');

document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.target;
    Object.values(screens).forEach(s=>s.classList.remove('active'));
    screens[target].classList.add('active');
  });
});

// تحميل الإعدادات الافتراضية من LocalStorage
(function initSettings(){
  const defLang = localStorage.getItem('defaultLanguage') || 'ar-EG';
  const defQuality = localStorage.getItem('defaultQuality') || '720p';
  document.getElementById('defaultLanguage').value = defLang;
  document.getElementById('defaultQuality').value = defQuality;
  document.getElementById('language').value = defLang;
  document.getElementById('quality').value = defQuality;
})();

// حفظ الإعدادات
document.getElementById('btnSaveSettings').addEventListener('click', ()=>{
  const defLang = document.getElementById('defaultLanguage').value;
  const defQuality = document.getElementById('defaultQuality').value;
  localStorage.setItem('defaultLanguage', defLang);
  localStorage.setItem('defaultQuality', defQuality);
  document.getElementById('language').value = defLang;
  document.getElementById('quality').value = defQuality;
  const toast = document.getElementById('settingsToast');
  toast.classList.remove('hidden');
  setTimeout(()=>toast.classList.add('hidden'), 1500);
});

// محاكاة إنشاء فيديو (واجهة فقط حالياً)
document.getElementById('btnGenerate').addEventListener('click', async ()=>{
  const prompt = document.getElementById('prompt').value.trim();
  const language = document.getElementById('language').value;
  const duration = document.getElementById('duration').value;
  const aspect = document.getElementById('aspect').value;
  const quality = document.getElementById('quality').value;

  if(!prompt){ alert('من فضلك اكتب وصف الفيديو أولاً'); return; }

  const progress = document.getElementById('progress');
  const bar = document.getElementById('progressBar');
  const result = document.getElementById('result');

  progress.classList.remove('hidden');
  bar.style.width = '0%';
  headerStatus.textContent = 'قيد المعالجة…';

  // محاكاة تقدّم
  for(let p=0;p<=100;p+=8){
    await new Promise(r=>setTimeout(r,120));
    bar.style.width = p+'%';
  }

  // لاحقاً: استبدل هذا بالنداء الحقيقي إلى الـAPI عبر /api/*
  result.classList.remove('muted');
  result.innerHTML = `
    <strong>تم الإنشاء (محاكاة):</strong><br/>
    اللغة: ${language} • المدة: ${duration}s • الأبعاد: ${aspect} • الجودة: ${quality}<br/>
    <em>سيتم ربط هذه الواجهة بالأوركسترايشن لاحقًا (TTS → Video → Mux → Safety).</em>
  `;
  headerStatus.textContent = 'جاهز';
  progress.classList.add('hidden');
});

// إشارة جاهزية النشر
window.addEventListener('load', ()=>{
  headerStatus.textContent = 'جاهز';
});
