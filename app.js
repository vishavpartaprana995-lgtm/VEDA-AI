import { supabase } from "./supabase.js";
const state = {
  name: (localStorage.getItem("hc_name") || "").trim() || "VEDA User",
  view: "dashboard",
  reports: JSON.parse(localStorage.getItem("hc_reports") || "[]"),
  medicines: JSON.parse(localStorage.getItem("hc_medicines") || "[]"),
  appointments: JSON.parse(localStorage.getItem("hc_appointments") || "[]"),
  messages: [
    {role:"ai", text:"Hi! I’m your HealthCopilot. I can explain your records, compare reports, prepare a doctor brief, or help you understand a medicine.", source:"HealthCopilot"}
  ]
};


// VEDA global interface language: English, Hindi, Punjabi.
const appLanguageMap = {
  hi: {
    "Your AI Health Companion":"आपका AI स्वास्थ्य साथी", "Your Health":"आपका स्वास्थ्य", "Journey, Simplified.":"स्वास्थ्य यात्रा, आसान बनाई गई।",
    "Get Started":"शुरू करें", "Watch Demo":"डेमो देखें", "Dashboard":"डैशबोर्ड", "AI Copilot":"AI सहायक", "Medical Records":"मेडिकल रिकॉर्ड", "Health Identity":"स्वास्थ्य पहचान", "Medicine Lens":"दवा स्कैन", "Medicines":"दवाइयाँ", "Appointments":"अपॉइंटमेंट", "Timeline":"समयरेखा", "Health Trends":"स्वास्थ्य रुझान", "Emergency Card":"आपातकालीन कार्ड", "Profile":"प्रोफ़ाइल", "Reset Demo":"डेमो रीसेट करें", "Home":"होम", "Records":"रिकॉर्ड", "Scan":"स्कैन", "AI":"AI",
    "Search your health records, ask AI, or scan medicine...":"अपने स्वास्थ्य रिकॉर्ड खोजें, AI से पूछें या दवा स्कैन करें...", "Your personal health profile":"आपकी व्यक्तिगत स्वास्थ्य प्रोफ़ाइल", "Demo settings stored locally in your browser.":"डेमो सेटिंग्स आपके ब्राउज़र में सेव हैं।", "NAME":"नाम", "BLOOD GROUP":"ब्लड ग्रुप", "EMERGENCY CONTACT":"आपातकालीन संपर्क", "AI EXPLANATION LEVEL":"AI समझाने का स्तर", "Save Changes":"बदलाव सेव करें", "Responsible AI":"ज़िम्मेदार AI", "Add Appointment":"अपॉइंटमेंट जोड़ें", "Doctor / clinic name":"डॉक्टर / क्लिनिक का नाम", "Specialty":"विशेषज्ञता", "Date and time":"तारीख और समय", "Notes / reason for visit":"नोट्स / विज़िट का कारण", "Optional — symptoms, follow-up, or questions for your doctor":"वैकल्पिक — लक्षण, फॉलो-अप या डॉक्टर के लिए सवाल", "Close":"बंद करें", "Cancel":"रद्द करें", "Save Appointment":"अपॉइंटमेंट सेव करें", "Your care calendar":"आपके इलाज का कैलेंडर", "Track doctor visits and follow-ups. Prototype appointments are saved in this browser.":"डॉक्टर विज़िट और फॉलो-अप ट्रैक करें। प्रोटोटाइप अपॉइंटमेंट इसी ब्राउज़र में सेव होते हैं।", "No appointments yet. Add a doctor visit or follow-up.":"अभी कोई अपॉइंटमेंट नहीं है। डॉक्टर विज़िट या फॉलो-अप जोड़ें।", "Delete":"हटाएँ", "AI preparation":"AI तैयारी", "Generate Doctor Brief":"डॉक्टर के लिए सारांश बनाएँ", "Simple":"सरल", "Balanced":"संतुलित", "Detailed":"विस्तृत"
  },
  pa: {
    "Your AI Health Companion":"ਤੁਹਾਡਾ AI ਸਿਹਤ ਸਾਥੀ", "Your Health":"ਤੁਹਾਡੀ ਸਿਹਤ", "Journey, Simplified.":"ਸਿਹਤ ਯਾਤਰਾ, ਹੁਣ ਆਸਾਨ।",
    "Get Started":"ਸ਼ੁਰੂ ਕਰੋ", "Watch Demo":"ਡੈਮੋ ਵੇਖੋ", "Dashboard":"ਡੈਸ਼ਬੋਰਡ", "AI Copilot":"AI ਸਹਾਇਕ", "Medical Records":"ਮੈਡੀਕਲ ਰਿਕਾਰਡ", "Health Identity":"ਸਿਹਤ ਪਛਾਣ", "Medicine Lens":"ਦਵਾਈ ਸਕੈਨ", "Medicines":"ਦਵਾਈਆਂ", "Appointments":"ਮੁਲਾਕਾਤਾਂ", "Timeline":"ਸਮਾਂ-ਰੇਖਾ", "Health Trends":"ਸਿਹਤ ਰੁਝਾਨ", "Emergency Card":"ਐਮਰਜੈਂਸੀ ਕਾਰਡ", "Profile":"ਪ੍ਰੋਫ਼ਾਈਲ", "Reset Demo":"ਡੈਮੋ ਰੀਸੈੱਟ ਕਰੋ", "Home":"ਮੁੱਖ ਪੰਨਾ", "Records":"ਰਿਕਾਰਡ", "Scan":"ਸਕੈਨ", "AI":"AI",
    "Search your health records, ask AI, or scan medicine...":"ਆਪਣੇ ਸਿਹਤ ਰਿਕਾਰਡ ਖੋਜੋ, AI ਨੂੰ ਪੁੱਛੋ ਜਾਂ ਦਵਾਈ ਸਕੈਨ ਕਰੋ...", "Your personal health profile":"ਤੁਹਾਡੀ ਨਿੱਜੀ ਸਿਹਤ ਪ੍ਰੋਫ਼ਾਈਲ", "Demo settings stored locally in your browser.":"ਡੈਮੋ ਸੈਟਿੰਗਾਂ ਤੁਹਾਡੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਸੇਵ ਹਨ।", "NAME":"ਨਾਮ", "BLOOD GROUP":"ਖੂਨ ਦਾ ਗਰੁੱਪ", "EMERGENCY CONTACT":"ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ", "AI EXPLANATION LEVEL":"AI ਸਮਝਾਉਣ ਦਾ ਪੱਧਰ", "Save Changes":"ਬਦਲਾਅ ਸੇਵ ਕਰੋ", "Responsible AI":"ਜ਼ਿੰਮੇਵਾਰ AI", "Add Appointment":"ਮੁਲਾਕਾਤ ਜੋੜੋ", "Doctor / clinic name":"ਡਾਕਟਰ / ਕਲੀਨਿਕ ਦਾ ਨਾਮ", "Specialty":"ਮਾਹਿਰਤਾ", "Date and time":"ਤਾਰੀਖ ਅਤੇ ਸਮਾਂ", "Notes / reason for visit":"ਨੋਟਸ / ਮਿਲਣ ਦਾ ਕਾਰਨ", "Optional — symptoms, follow-up, or questions for your doctor":"ਵਿਕਲਪਿਕ — ਲੱਛਣ, ਫਾਲੋ-ਅੱਪ ਜਾਂ ਡਾਕਟਰ ਲਈ ਸਵਾਲ", "Close":"ਬੰਦ ਕਰੋ", "Cancel":"ਰੱਦ ਕਰੋ", "Save Appointment":"ਮੁਲਾਕਾਤ ਸੇਵ ਕਰੋ", "Your care calendar":"ਤੁਹਾਡਾ ਇਲਾਜ ਕੈਲੰਡਰ", "Track doctor visits and follow-ups. Prototype appointments are saved in this browser.":"ਡਾਕਟਰ ਦੀਆਂ ਮੁਲਾਕਾਤਾਂ ਅਤੇ ਫਾਲੋ-ਅੱਪ ਟ੍ਰੈਕ ਕਰੋ। ਪ੍ਰੋਟੋਟਾਈਪ ਮੁਲਾਕਾਤਾਂ ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਸੇਵ ਹੁੰਦੀਆਂ ਹਨ।", "No appointments yet. Add a doctor visit or follow-up.":"ਹਾਲੇ ਕੋਈ ਮੁਲਾਕਾਤ ਨਹੀਂ। ਡਾਕਟਰ ਦੀ ਮੁਲਾਕਾਤ ਜਾਂ ਫਾਲੋ-ਅੱਪ ਜੋੜੋ।", "Delete":"ਮਿਟਾਓ", "AI preparation":"AI ਤਿਆਰੀ", "Generate Doctor Brief":"ਡਾਕਟਰ ਲਈ ਸੰਖੇਪ ਬਣਾਓ", "Simple":"ਸੌਖਾ", "Balanced":"ਦਰਮਿਆਨਾ", "Detailed":"ਵਿਸਥਾਰ ਨਾਲ"
  },
  
  te: {
    "Your AI Health Companion": "మీ AI ఆరోగ్య సహాయకుడు",
    "Your Health": "మీ ఆరోగ్యం",
    "Journey, Simplified.": "మీ ఆరోగ్య ప్రయాణం సులభంగా.",
    "Get Started": "ప్రారంభించండి",
    "Watch Demo": "డెమో చూడండి",
    "Dashboard": "డాష్‌బోర్డ్",
    "AI Copilot": "AI సహాయకుడు",
    "Medical Records": "వైద్య రికార్డులు",
    "Health Identity": "ఆరోగ్య గుర్తింపు",
    "Medicine Lens": "మందుల స్కానర్",
    "Medicines": "మందులు",
    "Appointments": "అపాయింట్‌మెంట్లు",
    "Timeline": "టైమ్‌లైన్",
    "Health Trends": "ఆరోగ్య ధోరణులు",
    "Emergency Card": "అత్యవసర కార్డు",
    "Your personal health profile": "మీ వ్యక్తిగత ఆరోగ్య ప్రొఫైల్",
    "Demo settings stored locally in your browser.": "డెమో సెట్టింగ్‌లు మీ బ్రౌజర్‌లో సేవ్ చేయబడ్డాయి."
  },
  ta: {
    "Your AI Health Companion": "உங்கள் AI சுகாதார உதவியாளர்",
    "Your Health": "உங்கள் ஆரோக்கியம்",
    "Journey, Simplified.": "உங்கள் ஆரோக்கியப் பயணம் எளிமையாக.",
    "Get Started": "தொடங்குங்கள்",
    "Watch Demo": "டெமோவைப் பாருங்கள்",
    "Dashboard": "முகப்புப் பலகை",
    "AI Copilot": "AI உதவியாளர்",
    "Medical Records": "மருத்துவப் பதிவுகள்",
    "Health Identity": "சுகாதார அடையாளம்",
    "Medicine Lens": "மருந்து ஸ்கேனர்",
    "Medicines": "மருந்துகள்",
    "Appointments": "சந்திப்புகள்",
    "Timeline": "காலவரிசை",
    "Health Trends": "ஆரோக்கியப் போக்குகள்",
    "Emergency Card": "அவசர அட்டை",
    "Your personal health profile": "உங்கள் தனிப்பட்ட சுகாதார சுயவிவரம்",
    "Demo settings stored locally in your browser.": "டெமோ அமைப்புகள் உங்கள் உலாவியில் சேமிக்கப்படுகின்றன."
  },

};
function setAppLanguage(lang){
  const supported = ["en", "hi", "pa", "te", "ta"].includes(lang) ? lang : "en";
  localStorage.setItem("veda_app_language", supported);
  document.documentElement.lang = supported === "hi" ? "hi" : supported === "pa" ? "pa" : supported === "te" ? "te" : supported === "ta" ? "ta" : "en";
  render();
  applyAppLanguage();
}
window.setAppLanguage = setAppLanguage;
function applyAppLanguage(){
  const lang = localStorage.getItem("veda_app_language") || "en";
  const selector = $("appLanguage"); if(selector && selector.value !== lang) selector.value = lang;
  const dictionaries = appLanguageMap;
  const reverse = {};
  Object.keys(dictionaries).forEach(code => Object.entries(dictionaries[code]).forEach(([en, translated]) => { reverse[translated] = en; }));
  const dict = dictionaries[lang] || {};
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = []; while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const raw = node.nodeValue; const trimmed = raw.trim(); if(!trimmed) return;
    const english = reverse[trimmed] || trimmed;
    const translated = dict[english];
    if(translated) node.nodeValue = raw.replace(trimmed, translated);
    else if(lang === "en" && reverse[trimmed]) node.nodeValue = raw.replace(trimmed, reverse[trimmed]);
  });
  document.querySelectorAll("input[placeholder],textarea[placeholder]").forEach(el => {
    const original = el.dataset.vedaEnglishPlaceholder || el.placeholder;
    if(!el.dataset.vedaEnglishPlaceholder) el.dataset.vedaEnglishPlaceholder = reverse[original] || original;
    el.placeholder = dict[el.dataset.vedaEnglishPlaceholder] || el.dataset.vedaEnglishPlaceholder;
  });
}

async function testSupabaseConnection() {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);

    if (error) {
        console.error("❌ Supabase connection failed:", error);
        return;
    }

    console.log("✅ VEDA connected to Supabase!");
    console.log(data);
}

testSupabaseConnection();

const seedReports = [
  {id:"r1",name:"CBC Report",date:"12 Oct 2026",type:"Blood Test",size:"1.2 MB",values:{Hemoglobin:"10.2 g/dL",WBC:"7,800 /µL",Platelets:"2.1 lakh /µL",Glucose:"108 mg/dL"}},
  {id:"r2",name:"Previous CBC",date:"02 Oct 2026",type:"Blood Test",size:"980 KB",values:{Hemoglobin:"11.4 g/dL",WBC:"7,200 /µL",Platelets:"2.0 lakh /µL",Glucose:"95 mg/dL"}},
  {id:"r3",name:"Prescription",date:"08 Oct 2026",type:"Prescription",size:"890 KB",values:{}}
];
const seedMeds = [
  {id:"m1",name:"Paracetamol",strength:"500 mg",schedule:"2 times/day • 3 days",status:"Active",source:"Prescription"},
  {id:"m2",name:"Vitamin D3",strength:"60,000 IU",schedule:"1 capsule • Once a week",status:"Active",source:"Prescription"},
  {id:"m3",name:"Cetirizine",strength:"10 mg",schedule:"1 tablet • 1 time/day",status:"From Prescription",source:"Prescription"},
  {id:"m4",name:"Amoxicillin",strength:"500 mg",schedule:"1 capsule • 3 times/day",status:"Completed",source:"Prescription"}
];

function $(id){return document.getElementById(id)}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function persist(){localStorage.setItem("hc_name",state.name);localStorage.setItem("hc_reports",JSON.stringify(state.reports));localStorage.setItem("hc_medicines",JSON.stringify(state.medicines));localStorage.setItem("hc_appointments",JSON.stringify(state.appointments))}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300)}
function showModal(html){$("modalCard").innerHTML=html;$("modal").classList.remove("hidden");applyAppLanguage()}
function closeModal(){$("modal").classList.add("hidden")}
window.closeModal = closeModal;
window.openReportPicker = window.openReportPicker || (() => { const input = $("reportInput"); if (input) input.click(); });
document.addEventListener("click",e=>{if(e.target.matches("[data-close-modal]"))closeModal()})


async function init() {
  // Load Supabase medical records
  const medicalRecords = await loadMedicalRecords();

  if (medicalRecords.length > 0) {
    state.reports = medicalRecords.map(record => ({
      id: record.id,
      name: record.name,
      date:
        record.report_data ||
        record.created_at?.slice(0, 10) ||
        "",
      type: record.type || "Medical Report",
      size: "",
      values: {},
      file_url: record.file_url,
      ai_summary: record.ai_summary
    }));
  } else {
    // Keep demo reports if database is empty
    if (!state.reports.length) {
      state.reports = [...seedReports];
    }
  }

  // Existing medicine demo data
  if (!state.medicines.length) {
    state.medicines = [...seedMeds];
  }

  persist();
  render();

  const sidebarName = $("sidebarName");

  function syncDisplayName() {
    const displayName =
      (state.name || "VEDA User").trim() || "VEDA User";

    state.name = displayName;

    if (sidebarName) {
      sidebarName.textContent = displayName;
    }

    document
      .querySelectorAll(".top-actions > span")
      .forEach(el => {
        el.textContent = displayName;
      });

    const initials =
      displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0])
        .join("")
        .toUpperCase() || "V";

    document.querySelectorAll(".avatar").forEach(el => {
      el.textContent = initials;
    });
  }

  syncDisplayName();

  const initialLanguage =
    localStorage.getItem("veda_app_language") || "en";

  if ($("appLanguage")) {
    $("appLanguage").value = initialLanguage;
  }

  document.documentElement.lang =
    initialLanguage === "hi"
      ? "hi"
      : initialLanguage === "pa"
        ? "pa"
        : "en";

  applyAppLanguage();
} // ✅ init() closed here

function go(view) {
  state.view = view;

  document
    .querySelectorAll(".nav-item[data-view]")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.view === view
      );
    });

  document
    .querySelectorAll(".mobile-nav button[data-mobile-view]")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.mobileView === view
      );
    });

  $("sidebar").classList.remove("open");
  render();
}

document
  .querySelectorAll(".nav-item[data-view]")
  .forEach(button => {
    button.addEventListener("click", () => {
      go(button.dataset.view);
    });
  });

$("menuBtn").addEventListener("click", () => {
  $("sidebar").classList.toggle("open");
});

$("demoBtn").addEventListener("click", () => {
  $("welcomeScreen").classList.add("hidden");
  $("app").classList.remove("hidden");
  init();
  toast("Demo mode loaded");
});

$("resetDemo").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

$("globalSearch").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    const query = event.target.value;
    go("copilot");
    setTimeout(() => sendMessage(query), 50);
    event.target.value = "";
  }
});

function layout(titleText, sub, actions = "") {
  return `
    <section class="view">
      <div class="view-head">
        <div>
          <div class="kicker">HealthCopilot</div>
          <h2>${titleText}</h2>
          <p>${sub}</p>
        </div>
        <div class="head-actions">${actions}</div>
      </div>
    </section>`;
}

function dashboard() {
  return `
    <section class="view">
      <div class="view-head">
        <div>
          <div class="kicker">Your Health Overview</div>
          <h2>Good Evening, ${escapeHtml(state.name)} 👋</h2>
          <p>Here’s your health overview for today.</p>
        </div>
        <button class="btn btn-outline btn-sm">
          Mon, 12 Oct 2026 ▾
        </button>
      </div>

      <div class="grid stats-grid">
        <div class="card stat-card">
          <div class="stat-icon">💊</div>
          <small>Medicines Today</small>
          <h3>2 / 3</h3>
          <span class="tag">Taken</span>
        </div>

        <div class="card stat-card">
          <div class="stat-icon">▣</div>
          <small>Next Appointment</small>
          <h3>12 Oct</h3>
          <span class="tag">Dr. Sharma</span>
        </div>

        <div class="card stat-card">
          <div class="stat-icon">▤</div>
          <small>Medical Records</small>
          <h3>${state.reports.length}</h3>
          <span class="tag">Reports</span>
        </div>

        <div class="card stat-card">
          <div class="stat-icon">♥</div>
          <small>Health Status</small>
          <h3>Good</h3>
          <span class="tag">No critical issues</span>
        </div>
      </div>

      <div class="card insight page-section">
        <div class="ai-icon">🤖</div>
        <h3>AI Health Insights</h3>
        <p>
          Your latest blood report shows 2 values lower than previous.
          Consider discussing the changes with your doctor.
        </p>
        <button
          class="btn btn-primary btn-sm"
          onclick="go('records')"
        >
          View Details →
        </button>
      </div>

      <div class="page-section">
        <div class="card-title">
          <h3>Quick Actions</h3>
          <span>Everything you need, one click away</span>
        </div>

        <div class="quick-grid">
          <button class="quick" onclick="openReportPicker()">
            <span class="qicon">📄</span>Upload Report
          </button>
          <button class="quick" onclick="go('medicine-lens')">
            <span class="qicon">📷</span>Scan Medicine
          </button>
          <button class="quick" onclick="go('copilot')">
            <span class="qicon">🤖</span>Ask AI Copilot
          </button>
          <button class="quick" onclick="go('appointments')">
            <span class="qicon">📅</span>Add Appointment
          </button>
        </div>
      </div>

      <div class="grid two-col page-section">
        <div class="card">
          <div class="card-title">
            <h3>Recent Health Journey</h3>
            <button
              class="btn btn-outline btn-sm"
              onclick="go('timeline')"
            >
              View timeline
            </button>
          </div>
          ${timelineMini()}
        </div>

        <div class="card">
          <div class="card-title">
            <h3>Today’s Medicines</h3>
            <span>2 / 3 taken</span>
          </div>
          ${medicineMini()}
        </div>
      </div>
    </section>`;
}

function timelineMini(){
 const actual = (state.reports || []).filter(r => !/^r[1-3]$/.test(String(r.id)));
 if (!actual.length) return '<p class="small muted">Your saved health records will appear here after you upload them.</p>';
 return `<div class="timeline">${actual.slice(0,4).map(r=>`<div class="event"><span class="date">${escapeHtml(r.date || "Date unavailable")}</span><h4>📄 ${escapeHtml(r.name || "Medical record")}</h4><p>${escapeHtml(r.type || "Medical document")}</p></div>`).join("")}</div>`;
}

function medicineMini(){return state.medicines.slice(0,3).map(m=>`<div style="padding:11px 0;border-bottom:1px solid #edf0eb;display:flex;justify-content:space-between;gap:10px"><div><b style="font-size:11px">${escapeHtml(m.name)} ${escapeHtml(m.strength)}</b><div class="small muted">${escapeHtml(m.schedule)}</div></div><span class="status ${m.status==="Completed"?"good":"good"}">${escapeHtml(m.status)}</span></div>`).join("")}

function copilot(){
 return `<section class="view">
  <div class="view-head"><div><div class="kicker">AI Assistant</div><h2>AI Health Copilot</h2><p>Ask questions about your own healthcare records.</p></div><button class="btn btn-outline btn-sm" onclick="clearChat()">Clear chat</button></div>
  <div class="grid two-col">
   <div class="card chat"><div class="messages" id="messages">${state.messages.map(m=>`<div class="msg ${m.role}">${escapeHtml(m.text).replace(/\n/g,"<br>")}<small>${escapeHtml(m.source||"")}</small></div>`).join("")}</div>
   <div class="suggestions">${["Explain my latest report","What changed?","What should I ask my doctor?","When was my last blood test?"].map(q=>`<button class="suggestion" onclick="sendMessage('${q.replace(/'/g,"\\'")}')">${q}</button>`).join("")}</div>
   <div class="chat-input"><input id="chatInput" placeholder="Ask anything about your health..." onkeydown="if(event.key==='Enter')sendChatInput()"><button class="send" onclick="sendChatInput()">→</button></div></div>
   <div class="card"><div class="card-title"><h3>Your context</h3></div>
    <div class="stat-card" style="min-height:0;margin-bottom:10px"><small>Medical Records</small><h3>${state.reports.length}</h3></div>
    <div class="stat-card" style="min-height:0;margin-bottom:10px"><small>Prescriptions</small><h3>3</h3></div>
    <div class="stat-card" style="min-height:0"><small>Active Medicines</small><h3>${state.medicines.filter(m=>m.status!=="Completed").length}</h3></div>
    <div class="card insight" style="margin-top:15px"><h3>Safe AI</h3><p>AI explains and organizes information. It does not diagnose or replace professional medical advice.</p></div>
   </div>
  </div>
 </section>`;
}

function sendChatInput() {
  const input = $("chatInput");
  if (!input) return;

  const message = input.value.trim();
  if (!message) return;

  input.value = "";
  sendMessage(message);
}

async function sendMessage(q) {
  if (!q || !q.trim()) return;

  state.messages.push({ role: "user", text: q.trim() });
  state.messages.push({
    role: "ai",
    text: "Thinking...",
    source: "Gemini AI"
  });

  const answerIndex = state.messages.length - 1;
  render();

  try {
    const { data, error } = await supabase.functions.invoke(
      "veda-ai",
      { body: { message: q.trim() } }
    );

    if (error) throw error;
    if (!data?.answer) {
      throw new Error(data?.error || "No answer received.");
    }

    state.messages[answerIndex] = {
      role: "ai",
      text: data.answer,
      source: "Gemini AI"
    };
  } catch (error) {
    console.error("VEDA Gemini error:", error);
    state.messages[answerIndex] = {
      role: "ai",
      text: "I couldn't connect to VEDA AI. Please try again.",
      source: "Connection error"
    };
  }

  render();

  setTimeout(() => {
    const messages = $("messages");
    if (messages) messages.scrollTop = messages.scrollHeight;
  }, 30);
}

// =====================================
// VEDA - LOAD MEDICAL RECORDS
// =====================================

async function loadMedicalRecords() {
    try {

        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
            console.log("No logged-in user.");
            return [];
        }

        const { data, error } = await supabase
            .from("medical_records")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        console.log("✅ Medical records loaded:", data);

        return data || [];

    } catch (error) {

        console.error(
            "❌ Could not load medical records:",
            error
        );

        return [];
    }
}

function clearChat(){state.messages=[{role:"ai",text:"Chat cleared. What would you like to understand about your health records?",source:"HealthCopilot"}];render()}

function records(){
 return `<section class="view">
  <div class="view-head"><div><div class="kicker">Medical Records</div><h2>Your records, organized.</h2><p>Upload reports, prescriptions and notes. Everything becomes searchable Health Memory.</p></div><button class="btn btn-primary btn-sm" onclick="openReportPicker()">+ Upload Record</button></div>
  <div class="grid two-col">
   <div class="card"><div class="card-title"><h3>Recent uploads</h3><span>${state.reports.length} records</span></div>
    <table class="table"><thead><tr><th>Record</th><th>Date</th><th>Type</th><th>Action</th></tr></thead><tbody>
    ${state.reports.map(r=>`<tr><td><b>${escapeHtml(r.name)}</b></td><td>${escapeHtml(r.date)}</td><td>${escapeHtml(r.type)}</td><td>
  <button class="btn btn-outline btn-sm" onclick="openReport('${r.id}')">View PDF</button>
  <button class="btn btn-primary btn-sm" onclick="viewReportSummary('${r.id}')">View Summary</button>
</td></tr>`).join("")}
    </tbody></table>
   </div>
   <div class="card"><div class="card-title"><h3>Smart actions</h3></div>
    <button class="quick" style="width:100%;margin-bottom:10px" onclick="openReportPicker()">📄 Analyze a new report</button>
    <button class="quick" style="width:100%;margin-bottom:10px" onclick="go('timeline')">◌ Open Health Memory</button>
    <button class="quick" style="width:100%" onclick="go('trends')">⌁ View health trends</button>
   </div>
  </div>
 </section>`;
}

async function openReport(id) {
    const report = state.reports.find(r => r.id === id);

    if (!report) {
        alert("Report not found.");
        return;
    }

    if (!report.file_url) {
        alert("This report has no uploaded file attached.");
        return;
    }

    try {
        const filePath = report.file_url;

        console.log("REPORT TO OPEN:", report);
        console.log("STORAGE PATH:", filePath);

        const { data, error } = await supabase.storage
            .from("medical_reports")
            .createSignedUrl(filePath, 60);

        if (error) throw error;

        if (!data?.signedUrl) {
            throw new Error("Signed URL was not returned.");
        }

        window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
        console.error("Report open failed:", error);
        alert("Could not open report: " + error.message);
    }
}

window.openReport = openReport;



window.viewReportSummary = async function(recordId) {
    try {
        const { data: { user }, error: userError } =
            await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("Please log in again.");

        const report = state.reports.find(r => r.id === recordId);
        if (!report) throw new Error("Report not found.");

        const { data, error } = await supabase
            .from("medical_extractions")
            .select("document_type, extracted_data, created_at")
            .eq("medical_record_id", recordId)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1);

        if (error) throw error;

        const extraction = data?.[0];
        if (!extraction) {
            alert("No reviewed AI summary found for this report yet.");
            return;
        }

        const result = extraction.extracted_data;
        const measurements = Array.isArray(result)
            ? result
            : (result.lab_values || result.extracted_data || result.results || result.values || []);

        const summary = report.ai_summary ||
            result.summary ||
            "No AI summary is available. Please review the extracted results.";

        showModal(`
          <div class="view-head">
            <div>
              <div class="kicker">VEDA · AI Medical Summary</div>
              <h2>${escapeHtml(report.name)}</h2>
              <p>${escapeHtml(extraction.document_type || report.type || "Medical Document")}</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="closeModal()">Close</button>
          </div>

          <div class="card">
            <h3>Report summary</h3>
            <p>${escapeHtml(summary)}</p>
          </div>

          <div class="card" style="margin-top:16px;overflow-x:auto">
            <h3>Extracted measurements</h3>
            ${measurements.length ? `
              <table class="table">
                <thead><tr><th>Test</th><th>Value</th><th>Unit</th><th>Reference range</th><th>Status</th></tr></thead>
                <tbody>
                  ${measurements.map(item => `
                    <tr>
                      <td>${escapeHtml(item.test_name || item.test || "—")}</td>
                      <td>${escapeHtml(item.value || "—")}</td>
                      <td>${escapeHtml(item.unit || "—")}</td>
                      <td>${escapeHtml(item.reference_range || "—")}</td>
                      <td>${escapeHtml(item.status || "Unclear")}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            ` : "<p>No individual measurements were extracted.</p>"}
          </div>

          <div class="extraction-notice" style="margin-top:16px">
            AI can make mistakes. Verify all values against the original report and consult a healthcare professional for interpretation.
          </div>

          <div class="head-actions">
            <button class="btn btn-outline" onclick="closeModal()">Close</button>
            <button class="btn btn-primary" onclick="openReport('${escapeHtml(recordId)}')">Open Original PDF</button>
          </div>
        `);
    } catch (error) {
        console.error("Loading report summary failed:", error);
        alert("Could not load the report summary: " + error.message);
    }
};


window.openReportPicker = function(){
    document.getElementById("reportInput").click();
};
document.addEventListener("DOMContentLoaded", () => {

    const reportInput = document.getElementById("reportInput");

    if (!reportInput) {
        console.error("❌ reportInput not found");
        return;
    }

    
reportInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let savedRecord = null;
    try {
        if (file.size > 15 * 1024 * 1024) {
            throw new Error("Please use a file smaller than 15 MB for this first version.");
        }
        if (!["application/pdf", "image/png", "image/jpeg", "image/webp"].includes(file.type)) {
            throw new Error("Supported formats: PDF, PNG, JPG, WEBP.");
        }

        toast("Uploading your document…");
        const uploadedFile = await uploadMedicalFile(file);
        if (!uploadedFile?.path) throw new Error("File upload did not return a Storage path.");

        savedRecord = await saveMedicalRecord({
            name: file.name,
            type: detectDocumentTypeFromName(file.name),
            report_data: new Date().toISOString().split("T")[0],
            file_url: uploadedFile.path,
            ai_summary: "Uploaded. AI extraction pending review."
        });
        if (!savedRecord) throw new Error("File uploaded, but report details could not be saved.");

        state.reports.unshift({
            id: savedRecord.id,
            name: savedRecord.name,
            date: savedRecord.report_data || "",
            type: savedRecord.type,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            values: {},
            file_url: savedRecord.file_url,
            ai_summary: savedRecord.ai_summary
        });
        persist();
        render();
        toast("Upload complete. Analyzing document…");

         // Free browser OCR — no OpenAI Edge Function call
      const extractedText = await extractReportText(file, (message) => {
        console.log("VEDA OCR:", message);
      });

      openExtractionReview(savedRecord, {
        extracted_data: {
          document_name: file.name,
          document_type: detectDocumentTypeFromName(file.name),
          extracted_text: extractedText
        }
      });
    } catch (error) {
      console.error("VEDA document upload/OCR:", error);
      alert(error.message || "Could not process this document.");
    } finally {
      e.target.value = "";
    }
  });
});

function detectDocumentTypeFromName(name = "") {
    const n = name.toLowerCase();
    if (/prescription|rx|medication/.test(n)) return "Prescription";
    if (/discharge|summary/.test(n)) return "Discharge Summary";
    if (/diagnos|scan|xray|x-ray|mri|ct-?scan|ultrasound/.test(n)) return "Diagnostic Record";
    if (/lab|blood|cbc|test|pathology/.test(n)) return "Lab Report";
    return "Medical Document";
}

function extractLabValues(ocrText = "") {
    const tests = [
        { name: "Hemoglobin", pattern: /\b(?:ha?emoglobin|hb)\b/i },
        { name: "WBC", pattern: /total leukocyte count|total leucocyte count|total wbc count|wbc count|\bwbc\b/i },
        { name: "RBC", pattern: /red blood cell count|rbc count|\brbc\b/i },
        { name: "Platelets", pattern: /platelet count|platelets?/i },
        { name: "Hematocrit", pattern: /hematocrit|haematocrit|packed cell volume|\bpcv\b/i },
        { name: "MCV", pattern: /\bmcv\b/i },
        { name: "MCH", pattern: /\bmch\b/i },
        { name: "MCHC", pattern: /\bmchc\b/i },
        { name: "ESR", pattern: /\besr\b|erythrocyte sedimentation rate/i },
        { name: "CRP", pattern: /\bcrp\b|c-reactive protein/i },
        { name: "Glucose", pattern: /\bglucose\b|blood sugar/i },
        { name: "HbA1c", pattern: /\bhba1c\b/i },
        { name: "Creatinine", pattern: /\bcreatinine\b/i },
        { name: "Urea", pattern: /\burea\b/i },
        { name: "TSH", pattern: /\btsh\b|thyroid stimulating hormone/i }
    ];
    const lines = String(ocrText).split(/\r?\n/).map(x => x.replace(/\s+/g, " ").trim()).filter(Boolean);
    const results = [];
    for (let i = 0; i < lines.length; i++) {
        for (const test of tests) {
            const match = test.pattern.exec(lines[i]);
            if (!match) continue;
            const context = lines.slice(i, Math.min(i + 2, lines.length)).join(" ");
            const label = test.pattern.exec(context);
            if (!label) continue;
            const afterLabel = context.slice(label.index + label[0].length);
            const numberMatch = afterLabel.match(/(?:^|\s)(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)(?=\s|$)/);
            if (!numberMatch) continue;
            const value = Number(numberMatch[1].replace(/,/g, ""));
            if (!Number.isFinite(value)) continue;
            const afterValue = afterLabel.slice((numberMatch.index || 0) + numberMatch[0].length);
            const unitMatch = afterValue.match(/^\s*([a-zA-Zµ/%]+(?:\s*\/\s*[a-zA-Zµ0-9]+)?)/);
            const rangeMatch = context.match(/(?:\bref(?:erence)?\.?\s*)?(-?\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(-?\d+(?:\.\d+)?)/i);
            results.push({
                test: test.name,
                value: numberMatch[1],
                unit: unitMatch ? unitMatch[1].trim() : "",
                reference_range: rangeMatch ? `${rangeMatch[1]}-${rangeMatch[2]}` : "",
                source_line: context
            });
            break;
        }
    }
    return results.filter((item, index, arr) => arr.findIndex(x => x.test === item.test) === index);
}

function extractDocumentFacts(text = "") {
  const source = String(text || "");
  const lines = source.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  const medicines = [];
  const dosagePattern = /\b(?:\d+(?:\.\d+)?\s*(?:mg|mcg|µg|g|ml|mL|IU|units?)|\d+\s*%)(?:\s*\/\s*\w+)?\b/i;
  for (const line of lines) {
    if (dosagePattern.test(line) && /\b(tab(?:let)?|cap(?:sule)?|syrup|medicine|drug|take|dose|mg|mcg|ml|\bOD\b|\bBD\b|\bTDS\b|\bBID\b|\bSOS\b)\b/i.test(line)) {
      medicines.push(line.slice(0, 220));
    }
  }
  const dates = [...new Set((source.match(/\b(?:\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[, ]+\d{2,4})\b/gi) || []))].slice(0, 10);
  const diagnoses = lines.filter(line => /diagnos|impression|clinical history|assessment|discharge diagnosis|निदान|रोग|बीमारी/i.test(line)).slice(0, 8);
  return { medicines: [...new Set(medicines)].slice(0, 12), dates, diagnoses };
}

function openExtractionReview(record, analysis) {
    const extracted = analysis.extracted_data || {};
     // Save the review context for the Confirm & Save button
  window.__vedaPendingExtraction = {
    recordId: record.id,
    documentType: extracted.document_type || record.type || "Medical Document",
    documentName: record.name || extracted.document_name || "Medical report"
  };

  const text = extracted.extracted_text || "";

  showModal(`
    <div class="view-head">
      <div>
        <div class="kicker">VEDA · Free OCR</div>
        <h2>Review extracted text</h2>
        <p>${escapeHtml(record.name || "Medical report")} · Check the text against the original report.</p>
      </div>
      <button class="btn btn-outline btn-sm" onclick="closeModal()">Close</button>
    </div>

    <div class="extraction-notice">
      OCR uses English + Hindi language data. Printed bilingual text is supported; handwriting recognition is experimental and can be inaccurate. Check every medicine, dosage, diagnosis and date against the original. This is text extraction, not a medical diagnosis.
    </div>

    ${(() => {
      const labValues = extractLabValues(text);
      return `<div class="card" style="margin:16px 0;overflow-x:auto"><h3>Detected Lab Values</h3><p class="small muted">Automatically detected from OCR. Verify every value against the original report.</p>${labValues.length ? `<table class="table"><thead><tr><th>Test</th><th>Value</th><th>Unit</th></tr></thead><tbody>${labValues.map(item => `<tr><td>${escapeHtml(item.test)}</td><td>${escapeHtml(item.value)}</td><td>${escapeHtml(item.unit || "Not detected")}</td></tr>`).join("")}</tbody></table>` : `<p class="small muted">No lab values detected automatically. Please verify the report manually.</p>`}</div>`;
    })()}

    <label class="extraction-label" for="extractionJson">
      Extracted report text (editable)
    </label>

      <textarea
      id="extractionJson"
      class="extraction-json"
      spellcheck="false"
      style="min-height:280px;width:100%"
    >${escapeHtml(text)}</textarea>

      <div class="head-actions extraction-actions">
        <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary"
          onclick="saveReviewedExtraction('${escapeHtml(record.id)}')">
          Confirm &amp; Save
        </button>
      </div>
    `);

    window.__vedaPendingExtraction = {
        recordId: record.id,
        documentType: extracted.document_type || record.type || "Medical Document",
        documentName: record.name || extracted.document_name || "Medical report",
        extractedData: extracted,
        summary: extracted.summary || analysis.summary || ""
    };
}

window.saveReviewedExtraction = async function(recordId) {
    const pending = window.__vedaPendingExtraction;
    const field = document.getElementById("extractionJson");

    if (!pending || pending.recordId !== recordId || !field) {
        alert("Review session expired. Please upload the document again.");
        return;
    }

     // OCR output is plain text, NOT JSON
  const extractedText = field.value.trim();

  if (!extractedText) {
    alert("No extracted text to save. Please run OCR again.");
    return;
  }

  try {
    const { data: { user }, error: userError } =
      await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("Please log in again.");

    const extractedData = {
      document_name: pending.documentName,
      document_type: pending.documentType,
      extracted_text: extractedText,
      lab_values: extractLabValues(extractedText),
      document_facts: extractDocumentFacts(extractedText),
      ocr_language: localStorage.getItem("veda_ocr_language") || "eng+hin",
      extraction_method: "browser_ocr_multilingual",
      review_status: "user_reviewed"
    };

        const { error } = await supabase
            .from("medical_extractions")
            .insert({
                user_id: user.id,
                medical_record_id: recordId,
                document_type: extractedData.document_type ||
                    pending.documentType || "Medical Document",
                extracted_data: extractedData,
                review_status: "user_reviewed"
            });

        if (error) throw error;

        const summary = pending.summary ||
            extractedData.summary ||
            "OCR text extracted and reviewed by the user. Please verify all values against the original report.";

        const { error: updateError } = await supabase
            .from("medical_records")
            .update({ ai_summary: summary })
            .eq("id", recordId)
            .eq("user_id", user.id);

        if (updateError) {
            console.warn("Summary update failed:", updateError);
        }

        const report = state.reports.find(r => r.id === recordId);
        if (report) report.ai_summary = summary;

        persist();
        delete window.__vedaPendingExtraction;
        closeModal();
        render();
        toast("Reviewed medical data saved securely.");

    } catch (error) {
        console.error("Saving reviewed extraction failed:", error);
        alert("Could not save extracted data: " + error.message);
    }
};


function reportAnalysis(){
 const r=state.reports[0]||seedReports[0]; const vals=r.values||seedReports[0].values;
 return `<section class="view"><div class="view-head"><div><div class="kicker">AI Analysis</div><h2>${escapeHtml(r.name)}</h2><p>${escapeHtml(r.date)} • ${escapeHtml(r.type)}</p></div><div class="head-actions"><button class="btn btn-outline btn-sm" onclick="go('trends')">What Changed?</button><button class="btn btn-primary btn-sm" onclick="go('copilot')">Ask AI</button></div></div>
 <div class="card report-layout"><div class="report-preview">▤<small style="font-size:10px">Original report</small></div><div>
 <div class="report-summary"><h4>🤖 AI Summary</h4><p>Your report contains 12 parameters. 3 values are notable compared with the available previous report. This summary is for understanding and organization, not diagnosis.</p></div>
 <div class="card" style="margin-top:15px"><div class="card-title"><h3>Key Findings</h3><span>Lab reference ranges where available</span></div>
 <table class="table"><thead><tr><th>Parameter</th><th>Your Value</th><th>Reference</th><th>Status</th></tr></thead><tbody>
 <tr><td><b>Hemoglobin</b></td><td>10.2 g/dL</td><td>13.0 – 17.0</td><td><span class="status bad">Low</span></td></tr>
 <tr><td>WBC</td><td>7,800 /µL</td><td>4,000 – 11,000</td><td><span class="status good">Normal</span></td></tr>
 <tr><td>Platelets</td><td>2.1 lakh /µL</td><td>1.5 – 4.0 lakh</td><td><span class="status good">Normal</span></td></tr>
 <tr><td>Glucose</td><td>108 mg/dL</td><td>70 – 100</td><td><span class="status warn">Review</span></td></tr>
 </tbody></table></div>
 </div></div></section>`;
}

function medicineLens(){
 return `<section class="view"><div class="view-head"><div><div class="kicker">AI Vision</div><h2>Medicine Lens 📸</h2><p>Scan a medicine strip or bottle to understand what it is and connect it to your records.</p></div></div>
 <div class="grid two-col">
  <div class="camera-wrap"><div style="width:100%;display:flex;justify-content:space-between"><span>◉ Live camera</span><span>⚙</span></div><div class="camera-frame"><div class="fake-strip">PARACETAMOL<br><small>TABLETS IP 500 mg</small></div></div><p style="font-size:10px;color:#b8c6bc;text-align:center">Position the medicine name, strength and manufacturer clearly.</p><button class="shutter" onclick="openMedicinePicker()" aria-label="Capture medicine"></button><div><button class="btn btn-primary btn-sm" onclick="openMedicinePicker()">📷 Use Camera / Upload</button></div></div>
  <div class="card"><div class="card-title"><h3>How it works</h3><span>Don't guess</span></div>
   ${["Capture the full strip or bottle","OCR / Vision reads name + strength","Verify against trusted drug information","AI explains it in simple language","Match it against your saved prescription"].map((x,i)=>`<div style="display:flex;gap:12px;align-items:center;padding:13px 0;border-bottom:1px solid #edf0eb"><span class="stat-icon" style="margin:0;width:28px;height:28px">${i+1}</span><span style="font-size:11px">${x}</span></div>`).join("")}
   <div class="card insight" style="margin-top:15px"><h3>Safety rule</h3><p>If the image cannot reliably identify the medicine, the app asks for a clearer photo instead of guessing.</p></div>
  </div>
 </div>
 </section>`;
}
function openMedicinePicker(){$("medicineInput").click()}
$("medicineInput").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;showMedicineResult(f);e.target.value=""})
function showMedicineResult(f){
 showModal(`<div class="view-head"><div><div class="kicker">AI Medicine Lens</div><h2>Medicine Identified</h2><p>${escapeHtml(f.name)}</p></div><button class="btn btn-outline btn-sm" onclick="closeModal()">Close</button></div>
 <div class="medicine-card"><div class="medicine-img">💊</div><div><h2 style="margin:0 0 6px">Paracetamol 500 mg <span class="status good">Verified demo</span></h2><div class="detail-list">
 <div><b>ACTIVE INGREDIENT</b>Paracetamol (Acetaminophen)</div><div><b>GENERAL PURPOSE</b>Pain relief and fever reduction</div><div><b>MEDICINE TYPE</b>Analgesic / antipyretic</div><div><b>MANUFACTURER</b>Demo label</div></div></div></div>
 <div class="card insight" style="margin-top:15px"><h3>What is it used for?</h3><p>In this prototype, the AI converts verified medicine information into simple language. It does not decide whether you personally should take it.</p></div>
 <div class="grid two-col page-section"><button class="btn btn-outline" onclick="go('medicines');closeModal()">View Medicine Cabinet</button><button class="btn btn-primary" onclick="addScannedMedicine();closeModal()">Add to My Medicines</button></div>`);
}
function addScannedMedicine(){state.medicines.unshift({id:"m"+Date.now(),name:"Paracetamol",strength:"500 mg",schedule:"From scanned medicine",status:"Active",source:"Medicine Lens"});persist();toast("Medicine added to your cabinet")}

function medicines(){
 return `<section class="view"><div class="view-head"><div><div class="kicker">Medication</div><h2>My Medicine Cabinet</h2><p>Keep your medicines organized and connected to prescriptions.</p></div><button class="btn btn-primary btn-sm" onclick="go('medicine-lens')">📷 Scan New Medicine</button></div>
 <div class="card"><div class="card-title"><h3>${state.medicines.length} medicines</h3><span>Connected to Health Memory</span></div>
 ${state.medicines.map(m=>`<div style="display:grid;grid-template-columns:55px 1fr auto;gap:13px;align-items:center;padding:13px 0;border-bottom:1px solid #edf0eb"><div class="medicine-img" style="min-height:55px">💊</div><div><b style="font-size:12px">${escapeHtml(m.name)} ${escapeHtml(m.strength)}</b><div class="small muted">${escapeHtml(m.schedule)}</div><div class="small" style="color:var(--green);margin-top:4px">Source: ${escapeHtml(m.source)}</div></div><span class="status ${m.status==="Completed"?"good":"good"}">${escapeHtml(m.status)}</span></div>`).join("")}
 </div></section>`;
}

function appointments(){
 const list = [...(state.appointments || [])].sort((a,b)=>new Date(a.datetime || a.date || 0)-new Date(b.datetime || b.date || 0));
 return `<section class="view"><div class="view-head"><div><div class="kicker">Appointments</div><h2>Your care calendar</h2><p>Track doctor visits and follow-ups. Prototype appointments are saved in this browser.</p></div><button class="btn btn-primary btn-sm" onclick="addAppointment()">+ Add Appointment</button></div>
 <div class="grid two-col"><div class="card"><div class="card-title"><h3>Appointments</h3><span>${list.length} saved</span></div>
 ${list.length ? list.map((a,i)=>`<div style="padding:15px 0;border-bottom:1px solid #edf0eb"><div style="display:flex;justify-content:space-between;gap:12px"><div><b>${escapeHtml(a.doctor || "Doctor not specified")}</b><div class="small muted">${escapeHtml(a.datetime ? new Date(a.datetime).toLocaleString() : a.date || "Date not specified")} · ${escapeHtml(a.specialty || "Specialty not specified")}</div>${a.notes?`<p class="small">${escapeHtml(a.notes)}</p>`:""}</div><button class="btn btn-outline btn-sm" onclick="deleteAppointment('${String(a.id).replace(/'/g,"\'")}')">Delete</button></div></div>`).join("") : `<p class="small muted">No appointments yet. Add a doctor visit or follow-up.</p>`}
 </div><div class="card"><div class="card-title"><h3>AI preparation</h3></div><p class="small muted" style="line-height:1.7">Prepare a visit using your saved records and extracted values. Review every detail before sharing it with a clinician.</p><button class="btn btn-primary btn-sm" onclick="showDoctorBrief()">Generate Doctor Brief</button><div class="extraction-notice" style="margin-top:15px">Prototype reminder: this version stores appointments in this browser only. It does not send notifications or create hospital bookings.</div></div></div></section>`;
}
function addAppointment(){
 showModal(`<div class="view-head appointment-modal-head"><div><div class="kicker">VEDA · Care Calendar</div><h2>Add Appointment</h2><p>Keep your doctor visits and follow-ups organized.</p></div><button class="btn btn-outline btn-sm" type="button" onclick="closeModal()">Close</button></div>
 <form id="appointmentForm" class="appointment-form" onsubmit="saveAppointment(event)">
   <div class="form-field"><label for="apptDoctor">Doctor / clinic name <span>*</span></label><input id="apptDoctor" required maxlength="120" placeholder="e.g. Dr. Sharma"></div>
   <div class="form-field"><label for="apptSpecialty">Specialty</label><input id="apptSpecialty" maxlength="100" placeholder="e.g. General Physician"></div>
   <div class="form-field"><label for="apptDateTime">Date and time <span>*</span></label><input id="apptDateTime" type="datetime-local" required></div>
   <div class="form-field appointment-notes"><label for="apptNotes">Notes / reason for visit</label><textarea id="apptNotes" rows="3" maxlength="1000" placeholder="Optional — symptoms, follow-up, or questions for your doctor"></textarea></div>
   <div class="head-actions appointment-actions"><button class="btn btn-outline" type="button" onclick="closeModal()">Cancel</button><button class="btn btn-primary" type="submit">Save Appointment</button></div>
 </form>`);
 const dateInput = $("apptDateTime");
 if (dateInput) { const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); dateInput.min = now.toISOString().slice(0,16); }
}
function saveAppointment(event){
 event.preventDefault(); const doctor=$("apptDoctor").value.trim(); const datetime=$("apptDateTime").value;
 if(!doctor || !datetime){toast("Enter doctor and date/time");return;}
 state.appointments.push({id:"appt_"+Date.now(),doctor,specialty:$("apptSpecialty").value.trim() || "Not specified",datetime,notes:$("apptNotes").value.trim(),createdAt:new Date().toISOString()});
 persist(); closeModal(); render(); toast("Appointment saved in this browser");
}
function deleteAppointment(id){state.appointments=state.appointments.filter(a=>a.id!==id);persist();render();toast("Appointment removed");}
window.addAppointment=addAppointment; window.saveAppointment=saveAppointment; window.deleteAppointment=deleteAppointment;

async function showDoctorBrief() {
    try {
        toast("Preparing your doctor brief...");

        const { data: { user }, error: authError } =
            await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) throw new Error("Please log in first.");

        const { data: records, error: recordsError } = await supabase
            .from("medical_records")
            .select("name, type, report_data, ai_summary")
            .eq("user_id", user.id)
            .order("report_data", { ascending: false })
            .limit(10);

        if (recordsError) throw recordsError;

        const prompt = `
Create a concise doctor-visit preparation brief using only these saved medical records and appointments.

Medical records:
${JSON.stringify(records || [])}

Appointments:
${JSON.stringify(state.appointments || [])}

Include:
1. Recent records and their dates.
2. Existing AI summaries, if available.
3. Questions the patient could discuss with their doctor.
4. Information that is missing and should be confirmed.

Do not invent symptoms, diagnoses, test results, or medication details.
Clearly state when information is unavailable.
This is preparation for a clinician visit, not a diagnosis.
Write in simple, readable language.
`;

        const { data, error } = await supabase.functions.invoke(
            "veda-ai",
            { body: { message: prompt } }
        );

        if (error) throw error;
        if (!data?.answer) {
            throw new Error("No doctor brief was returned.");
        }

        showModal(`
            <div class="view-head">
                <div>
                    <div class="kicker">VEDA · AI preparation</div>
                    <h2>Doctor Visit Brief</h2>
                </div>
                <button class="btn btn-outline btn-sm"
                    onclick="closeModal()">Close</button>
            </div>
            <div class="card" style="white-space:pre-wrap;line-height:1.7">
                ${escapeHtml(data.answer)}
            </div>
            <div class="extraction-notice">
                Review this brief for accuracy before sharing it with your
                healthcare professional. It is not a diagnosis.
            </div>
        `);
    } catch (error) {
        console.error("Doctor brief failed:", error);
        alert("Could not generate doctor brief: " + error.message);
    }
}

window.showDoctorBrief = showDoctorBrief;


let healthMemoryFilter = "All";
let healthSummaryLanguage = localStorage.getItem("veda_summary_language") || "en";
let cachedHealthData = null;

async function getActualHealthData(force = false) {
  if (cachedHealthData && !force) return cachedHealthData;
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error("Please log in to view your saved Health Memory.");
  const { data: reports, error: reportsError } = await supabase
    .from("medical_records")
    .select("id, name, type, report_data, created_at, ai_summary, file_url")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (reportsError) throw reportsError;
  const ids = (reports || []).map(r => r.id);
  let extractions = [];
  if (ids.length) {
    const { data, error } = await supabase
      .from("medical_extractions")
      .select("medical_record_id, document_type, extracted_data, created_at, review_status")
      .in("medical_record_id", ids)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    extractions = (data || []).filter(x => !x.review_status || x.review_status === "user_reviewed");
  }
  const latest = new Map();
  extractions.forEach(x => { if (!latest.has(x.medical_record_id)) latest.set(x.medical_record_id, x); });
  cachedHealthData = (reports || []).map(r => ({
    ...r,
    dateLabel: r.report_data || r.created_at?.slice(0, 10) || "Date unavailable",
    extraction: latest.get(r.id) || null,
    kind: normalizeHealthType(r.type || latest.get(r.id)?.document_type || r.name)
  }));
  return cachedHealthData;
}

function normalizeHealthType(raw = "") {
  const v = String(raw).toLowerCase();
  if (/prescription|medication|rx/.test(v)) return "Prescription";
  if (/discharge/.test(v)) return "Discharge Summary";
  if (/diagnos|x.?ray|mri|ct.?scan|ultrasound|scan/.test(v)) return "Diagnostic Record";
  if (/lab|blood|cbc|pathology|test result/.test(v)) return "Lab Report";
  return "Medical Document";
}
function extractedValues(record) {
  const d = record.extraction?.extracted_data;
  if (!d) return [];
  const arr = Array.isArray(d) ? d : (d.lab_values || d.values || d.results || []);
  return Array.isArray(arr) ? arr.filter(v => v && (v.test || v.test_name || v.name) && v.value !== undefined && v.value !== "") : [];
}
function setHealthLanguage(language) { healthSummaryLanguage = language === "hi" ? "hi" : "en"; localStorage.setItem("veda_summary_language", healthSummaryLanguage); const panel = $("healthMemoryPanel"); if (panel) refreshHealthMemory(); }
window.setHealthLanguage = setHealthLanguage;
function healthRecordSummary(records) {
  const hi = healthSummaryLanguage === "hi";
  if (!records.length) return `<div class="health-empty"><h3>${hi ? "अभी कोई सेव किया हुआ रिकॉर्ड नहीं" : "No saved records yet"}</h3><p>${hi ? "प्रिस्क्रिप्शन, लैब रिपोर्ट, डिस्चार्ज समरी या डायग्नोस्टिक रिकॉर्ड अपलोड करें। यहाँ केवल आपके खाते में सेव जानकारी दिखाई जाएगी।" : "Upload a prescription, lab report, discharge summary, or diagnostic record. Only information saved to your account will appear here."}</p><button class="btn btn-primary btn-sm" onclick="openReportPicker()">${hi ? "+ पहला रिकॉर्ड अपलोड करें" : "+ Upload first record"}</button></div>`;
  const summaries = records.map(r => {
    const d = r.extraction?.extracted_data || {};
    const values = extractedValues(r);
    const text = d.extracted_text || d.text || d.ocr_text || "";
    const verified = values.length ? `<ul class="health-facts">${values.slice(0,8).map(v=>`<li><b>${escapeHtml(v.test || v.test_name || v.name)}</b>: ${escapeHtml(v.value)} ${escapeHtml(v.unit || "")}</li>`).join("")}</ul>` : "";
    const facts = d.document_facts || extractDocumentFacts(d.extracted_text || d.text || "");
    const medicineFacts = facts.medicines?.length ? `<p><b>Possible medicine/dosage lines (verify):</b></p><ul class="health-facts">${facts.medicines.slice(0,5).map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul>` : "";
    const diagnosisFacts = facts.diagnoses?.length ? `<p><b>Possible diagnosis/clinical notes (verify):</b></p><ul class="health-facts">${facts.diagnoses.slice(0,4).map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul>` : "";
    const dateFacts = facts.dates?.length ? `<p class="small"><b>Dates detected:</b> ${facts.dates.map(escapeHtml).join(", ")}</p>` : "";
    const savedSummary = r.ai_summary && !/pending review|uploaded\./i.test(r.ai_summary) ? `<p>${escapeHtml(r.ai_summary)}</p>` : "";
    const textNote = text ? `<details><summary>View extracted text</summary><p class="small">${escapeHtml(String(text).slice(0,1400))}${String(text).length>1400?"…":""}</p></details>` : "";
    return `<article class="memory-summary-item"><div class="memory-meta"><span class="memory-type">${escapeHtml(r.kind)}</span><span>${escapeHtml(r.dateLabel)}</span></div><h4>${escapeHtml(r.name || "Medical record")}</h4>${savedSummary}${verified}${medicineFacts}${diagnosisFacts}${dateFacts}${textNote}${!savedSummary && !verified && !text ? '<p class="small muted">File saved; no reviewed extracted information is available yet. Open the original record to review it.</p>' : ""}</article>`;
  }).join("");
  return `<div class="summary-intro"><b>${records.length} ${hi ? "सेव रिकॉर्ड" : `saved record${records.length===1?"":"s"}`}</b><p class="small muted">${hi ? "यह सारांश आपके दस्तावेज़ों से पहले से सेव जानकारी जोड़ता है। जो जानकारी उपलब्ध या सत्यापित नहीं है, उसका अनुमान नहीं लगाया जाता।" : "This summary combines information already saved from your documents. Missing or unreviewed information is not inferred."}</p></div>${summaries}`;
}
function renderHealthMemory(records) {
  const panel = $("healthMemoryPanel");
  if (!panel) return;
  const filtered = healthMemoryFilter === "All" ? records : records.filter(r => r.kind === healthMemoryFilter);
  panel.innerHTML = `<div class="memory-count">Showing ${filtered.length} of ${records.length} saved records</div>${healthRecordSummary(filtered)}<div class="page-section"><h3>Chronological timeline</h3>${filtered.length ? `<div class="timeline">${filtered.map(r=>`<div class="event"><span class="date">${escapeHtml(r.dateLabel)}</span><h4>📄 ${escapeHtml(r.name || "Medical record")}</h4><p>${escapeHtml(r.kind)}${r.extraction ? " · reviewed extraction available" : " · no saved extraction"}</p><button class="btn btn-outline btn-sm" onclick="openReport('${String(r.id).replace(/'/g,"\'")}')">Open original</button></div>`).join("")}</div>` : '<p class="small muted">No records match this type.</p>'}</div>`;
}
async function refreshHealthMemory(force = false) {
  const panel = $("healthMemoryPanel"); if (!panel) return;
  panel.innerHTML = '<p class="small muted">Loading your saved records…</p>';
  try { const data = await getActualHealthData(force); renderHealthMemory(data); }
  catch (e) { panel.innerHTML = `<p class="small">Could not load Health Memory: ${escapeHtml(e.message)}</p>`; }
}
function timeline(){
 return `<section class="view"><div class="view-head"><div><div class="kicker">Unified Health Memory</div><h2>Your health, in one place</h2><p>Saved prescriptions, lab reports, discharge summaries and diagnostic records, organized by date and type.</p></div><div class="head-actions"><button class="btn btn-outline btn-sm" onclick="refreshHealthMemory(true)">Refresh</button><button class="btn btn-outline btn-sm" onclick="showHealthMemoryDemo()">Preview sample</button><button class="btn btn-primary btn-sm" onclick="openReportPicker()">+ Upload Record</button></div></div>
 <div class="card"><div class="card-title"><h3>Combined Health Summary / संयुक्त स्वास्थ्य सारांश</h3><span>Saved information only</span><select id="healthLanguage" aria-label="Summary language" onchange="setHealthLanguage(this.value)" style="max-width:145px"><option value="en">English</option><option value="hi">हिन्दी</option></select></div><div id="healthMemoryPanel"><p class="small muted">Loading your saved Health Memory…</p></div></div>
 <div class="card page-section"><div class="card-title"><h3>Filter by record type</h3></div><div class="memory-filters">${["All","Prescription","Lab Report","Discharge Summary","Diagnostic Record","Medical Document"].map(t=>`<button class="btn ${healthMemoryFilter===t?"btn-primary":"btn-outline"} btn-sm" onclick="setHealthMemoryFilter('${t}')">${t}</button>`).join("")}</div></div>
 <div class="extraction-notice">OCR can make mistakes. Confirm extracted values against the original document; this summary is not a diagnosis.</div></section>`;
}

function showHealthMemoryDemo(){
 const panel=$("healthMemoryPanel"); if(!panel) return;
 const samples=[
  {name:"CBC Lab Report (Sample)",kind:"Lab Report",dateLabel:"2026-10-02",ai_summary:"Sample only: the report contains blood count measurements. Compare results with the reference ranges printed by the laboratory.",extraction:{extracted_data:{lab_values:[{test:"Hemoglobin",value:"11.4",unit:"g/dL"},{test:"WBC",value:"7200",unit:"/µL"}],extracted_text:"Sample data for prototype demonstration. Not a real patient record."}}},
  {name:"Prescription (Sample)",kind:"Prescription",dateLabel:"2026-10-08",ai_summary:"Sample only: medicine and dosage details must be confirmed against the original prescription by the patient or clinician.",extraction:{extracted_data:{document_facts:{medicines:["Example medicine — dosage to verify from original prescription"],dates:["2026-10-08"],diagnoses:[]},extracted_text:"Sample prescription text; not for clinical use."}}},
  {name:"Discharge Summary (Sample)",kind:"Discharge Summary",dateLabel:"2026-10-09",ai_summary:"Sample only: admission/discharge dates and diagnosis would appear here when extracted and reviewed.",extraction:{extracted_data:{document_facts:{medicines:[],dates:["2026-10-09"],diagnoses:["Sample diagnosis line — verify against original document"]},extracted_text:"Sample discharge summary text; not for clinical use."}}}
 ];
 panel.innerHTML='<div class="extraction-notice">DEMO PREVIEW — these are fictional sample records, not connected to your account and not medical advice.</div>'+healthRecordSummary(samples)+'<div class="page-section"><h3>Chronological timeline</h3><div class="timeline">'+samples.map(r=>`<div class="event"><span class="date">${escapeHtml(r.dateLabel)}</span><h4>📄 ${escapeHtml(r.name)}</h4><p>${escapeHtml(r.kind)} · fictional sample</p></div>`).join('')+'</div></div>';
}
window.showHealthMemoryDemo=showHealthMemoryDemo;

function setHealthMemoryFilter(type) { healthMemoryFilter = type; const panel = $("healthMemoryPanel"); if (panel) refreshHealthMemory(); else render(); }
function exportBrief(){toast("Export is not connected yet. You can review the combined summary here.")}

function trends(){
 return `<section class="view"><div class="view-head"><div><div class="kicker">Health Analytics</div><h2>Actual-data Timeline & What Changed?</h2><p>Only reviewed lab values saved from your reports are compared. No sample values are shown.</p></div><button class="btn btn-outline btn-sm" onclick="showCompare()">Open comparison</button></div>
 <div class="grid two-col"><div class="card"><div class="card-title"><h3>Saved lab values</h3><span>From reviewed extractions</span></div><div id="actualTrends"><p class="small muted">Loading saved lab values…</p></div></div><div class="card"><div class="card-title"><h3>What Changed?</h3></div><div id="actualChanges"><p class="small muted">Comparing your saved values…</p></div><div class="extraction-notice">A numerical change alone does not indicate improvement or deterioration. Confirm results with a healthcare professional.</div></div></div></section>`;
}
async function refreshActualTrends(force = false) {
 const chart = $("actualTrends"), changes = $("actualChanges"); if (!chart || !changes) return;
 chart.innerHTML = '<p class="small muted">Loading…</p>'; changes.innerHTML = '<p class="small muted">Loading…</p>';
 try {
   const records = await getActualHealthData(force);
   const rows = records.flatMap(r => extractedValues(r).map(v => ({record:r, test:String(v.test || v.test_name || v.name), value:Number(String(v.value).replace(/,/g,"")), unit:String(v.unit || "")}))).filter(v=>v.test && Number.isFinite(v.value));
   if (!rows.length) { chart.innerHTML = '<p class="small muted">No reviewed lab values found yet. Upload a lab report, review OCR results, and choose Confirm & Save.</p>'; changes.innerHTML = '<p class="small muted">There are no saved lab values to compare yet.</p>'; return; }
   const byTest = new Map();
   rows.forEach(r=>{const key=r.test.toLowerCase(); if(!byTest.has(key))byTest.set(key,[]); byTest.get(key).push(r);});
   const series = [...byTest.values()].filter(a=>a.length>=1).sort((a,b)=>a[0].test.localeCompare(b[0].test));
   chart.innerHTML = series.map(items=>{const ordered=items.sort((a,b)=>new Date(a.record.report_data || a.record.created_at)-new Date(b.record.report_data || b.record.created_at)); const last=ordered[ordered.length-1]; return `<div class="trend-value"><div><b>${escapeHtml(last.test)}</b><div class="small muted">${ordered.length} saved value${ordered.length===1?"":"s"}</div></div><div class="trend-number">${escapeHtml(last.value)} ${escapeHtml(last.unit)}<small>${escapeHtml(last.record.dateLabel)}</small></div></div>${ordered.length>1?`<div class="trend-history">${ordered.map(x=>`<span>${escapeHtml(x.record.dateLabel)}: <b>${escapeHtml(x.value)} ${escapeHtml(x.unit)}</b></span>`).join("")}</div>`:""}`;}).join("");
   const comparisons=[];
   for(const items of byTest.values()){
     const ordered=items.filter(x=>!x.unit || !items.some(y=>y.unit && y.unit.toLowerCase()!==x.unit.toLowerCase())).sort((a,b)=>new Date(a.record.report_data || a.record.created_at)-new Date(b.record.report_data || b.record.created_at));
     if(ordered.length>=2){const old=ordered[ordered.length-2],cur=ordered[ordered.length-1]; if(!old.unit||!cur.unit||old.unit.toLowerCase()===cur.unit.toLowerCase()) comparisons.push(`<div class="change-row"><b>${escapeHtml(cur.test)}</b><span>${escapeHtml(old.value)} ${escapeHtml(old.unit)} → ${escapeHtml(cur.value)} ${escapeHtml(cur.unit)}</span><small>${escapeHtml(old.record.dateLabel)} → ${escapeHtml(cur.record.dateLabel)} · numeric difference ${cur.value-old.value>0?"+":""}${cur.value-old.value}</small></div>`);}
   }
   changes.innerHTML = comparisons.length ? comparisons.join("") : '<p class="small muted">Need at least two saved values for the same test, with compatible units, to show a change.</p>';
 } catch(e) { chart.innerHTML = `<p class="small">Could not load trends: ${escapeHtml(e.message)}</p>`; changes.innerHTML = '<p class="small muted">Comparison unavailable.</p>'; }
}

async function showCompare() {
    showModal(`
        <div class="view-head">
            <div>
                <div class="kicker">VEDA · Report Comparison</div>
                <h2>What Changed?</h2>
                <p>Comparing your two latest saved reports.</p>
            </div>
            <button class="btn btn-outline btn-sm"
                onclick="closeModal()">Close</button>
        </div>
        <div id="compareResults" class="page-section">
            Loading your saved report values...
        </div>
        <div class="extraction-notice" style="margin-top:15px">
            Only extracted values are compared. Verify all values
            against the original reports; this is not a diagnosis.
        </div>
    `);

    const output = document.getElementById("compareResults");

    try {
        const { data: { user }, error: authError } =
            await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) throw new Error("Please log in again.");

        const { data: reports, error: reportsError } = await supabase
            .from("medical_records")
            .select("id, name, report_data, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(20);

        if (reportsError) throw reportsError;

        if (!reports || reports.length < 2) {
            output.textContent =
                "Upload at least two reports to compare changes.";
            return;
        }

        const ids = reports.map(r => r.id);

        const { data: extractions, error: extractionError } =
            await supabase
                .from("medical_extractions")
                .select("medical_record_id, extracted_data, created_at")
                .in("medical_record_id", ids)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

        if (extractionError) throw extractionError;

        const latestExtraction = new Map();

        for (const item of (extractions || [])) {
            if (!latestExtraction.has(item.medical_record_id)) {
                latestExtraction.set(item.medical_record_id, item);
            }
        }

        const comparableReports = reports
            .map(report => ({
                ...report,
                extraction: latestExtraction.get(report.id)
            }))
            .filter(report => {
                const data = report.extraction?.extracted_data;
                return Array.isArray(data?.lab_values) &&
                    data.lab_values.length > 0;
            })
            .slice(0, 2);

        if (comparableReports.length < 2) {
            output.textContent =
                "Two reports with saved lab values are needed. " +
                "Open each report, run OCR, and use Confirm & Save first.";
            return;
        }

        const [latest, previous] = comparableReports;

        const getValues = report => {
            const map = new Map();

            for (const item of report.extraction.extracted_data.lab_values) {
                const key = String(item.test || "").trim().toLowerCase();
                const value = Number(
                    String(item.value ?? "").replace(/,/g, "")
                );

                if (key && Number.isFinite(value)) {
                    map.set(key, {
                        test: item.test,
                        value,
                        unit: item.unit || ""
                    });
                }
            }

            return map;
        };

        const oldValues = getValues(previous);
        const newValues = getValues(latest);

        const rows = [...newValues.entries()]
            .filter(([key, current]) => {
                const old = oldValues.get(key);
                return old && (!old.unit || !current.unit ||
                    old.unit.toLowerCase() === current.unit.toLowerCase());
            })
            .map(([key, current]) => {
                const old = oldValues.get(key);
                const difference = current.value - old.value;
                const change = difference > 0
                    ? `+${difference}`
                    : String(difference);

                return `
                    <tr>
                        <td>${escapeHtml(current.test)}</td>
                        <td>${old.value} ${escapeHtml(old.unit)}</td>
                        <td>${current.value} ${escapeHtml(current.unit)}</td>
                        <td>${escapeHtml(change)}</td>
                    </tr>
                `;
            });

        const dateLabel = report =>
            report.report_data || report.created_at?.slice(0, 10) || "Date unavailable";

        output.innerHTML = `
            <p class="small muted">
                Previous: ${escapeHtml(dateLabel(previous))}
                &nbsp; → &nbsp;
                Latest: ${escapeHtml(dateLabel(latest))}
            </p>
            ${
                rows.length
                    ? `<div style="overflow-x:auto">
                        <table class="table">
                            <thead><tr>
                                <th>Test</th><th>Previous</th>
                                <th>Latest</th><th>Numeric change</th>
                            </tr></thead>
                            <tbody>${rows.join("")}</tbody>
                        </table>
                    </div>`
                    : `<p>No matching tests with compatible units were found.</p>`
            }
            <p class="small muted">
                A numeric increase or decrease does not automatically mean
                improvement or deterioration. Interpret results with a clinician.
            </p>
        `;
    } catch (error) {
        console.error("What Changed comparison failed:", error);
        output.textContent =
            "Could not load the comparison: " + error.message;
    }
}
function emergency(){
 return `<section class="view"><div class="view-head"><div><div class="kicker">Emergency Access</div><h2>Emergency Health Card</h2><p>Keep selected essential information available in urgent situations.</p></div><button class="btn btn-outline btn-sm" onclick="toast('Emergency card saved')">Save Card</button></div>
 <div class="card emergency"><div class="view-head"><div><h2 style="color:#c33c3c">🚨 EMERGENCY HEALTH CARD</h2><p>Only share information you intentionally include here.</p></div><div class="qr"></div></div><div class="grid three-col"><div><small class="muted">NAME</small><h3>${escapeHtml(state.name)}</h3></div><div><small class="muted">BLOOD GROUP</small><h3>O+</h3></div><div><small class="muted">EMERGENCY CONTACT</small><h3>+91 XXXXX XXXXX</h3></div></div><div class="grid two-col page-section"><div><b>Known Allergies</b><p class="small muted">None recorded</p></div><div><b>Current Medicines</b><p class="small muted">${state.medicines.slice(0,3).map(m=>m.name).join(", ")}</p></div></div><div class="card insight" style="margin-top:15px"><h3>Privacy note</h3><p>In production, the QR should open a permission-controlled profile rather than exposing full medical history publicly.</p></div></div></section>`;
}
function profile(){
 return `<section class="view"><div class="view-head"><div><div class="kicker">Profile</div><h2>Your personal health profile</h2><p>Demo settings stored locally in your browser.</p></div><button class="btn btn-primary btn-sm" onclick="saveProfile()">Save Changes</button></div>
 <div class="card profile-grid"><div><div class="form-field"><label>NAME</label><input id="profileName" value="${escapeHtml(state.name)}"></div><div class="form-field"><label>BLOOD GROUP</label><select><option>O+</option><option>A+</option><option>B+</option><option>AB+</option></select></div></div><div><div class="form-field"><label>EMERGENCY CONTACT</label><input placeholder="+91 XXXXX XXXXX"></div><div class="form-field"><label>AI EXPLANATION LEVEL</label><select><option>Simple</option><option>Balanced</option><option>Detailed</option></select></div></div></div>
 <div class="card page-section"><div class="card-title"><h3>Responsible AI</h3></div><p class="small muted" style="line-height:1.7">HealthCopilot is designed to understand and organize health information. It should not diagnose, prescribe, or replace a healthcare professional.</p></div></section>`;
}

function saveProfile() {
  const displayName = $("profileName").value.trim() || "VEDA User";
  state.name = displayName;

  if (state.user && state.user.id) {
    localStorage.setItem(`hc_name_${state.user.id}`, displayName);
  }

  persist();
  syncDisplayName();
  render();
  toast("Profile saved — name updated across VEDA");
}
window.saveProfile = saveProfile;

function syncDisplayName() {
  const displayName =
    (state.name || "VEDA User").trim() || "VEDA User";

  state.name = displayName;

  const sidebarName = $("sidebarName");
  if (sidebarName) {
    sidebarName.textContent = displayName;
  }

  document.querySelectorAll(".top-actions > span").forEach(el => {
    el.textContent = displayName;
  });

  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase() || "V";

  document.querySelectorAll(".avatar").forEach(el => {
    el.textContent = initials;
  });
}


function render(){
 syncDisplayName();
 const vc=$("viewContainer");
 const pages={dashboard, copilot, records, "medicine-lens":medicineLens, medicines, appointments, timeline, trends, emergency, profile};
 vc.innerHTML=pages[state.view]();
 applyAppLanguage();
 if (state.view === "timeline") { const lang=$("healthLanguage"); if(lang) lang.value=healthSummaryLanguage; refreshHealthMemory(); }
 if (state.view === "trends") refreshActualTrends();
}


window.go = go;
window.showCompare = showCompare;
window.refreshHealthMemory = refreshHealthMemory;
window.setHealthMemoryFilter = setHealthMemoryFilter;
window.refreshActualTrends = refreshActualTrends;
window.setHealthLanguage = setHealthLanguage;
window.openReport = openReport;


if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",()=>{})}
// ================================
// VEDA AUTH SCREEN NAVIGATION
// ================================

const welcomeScreen = document.getElementById("welcomeScreen");
const authScreen = document.getElementById("authScreen");

const startBtn = document.getElementById("startBtn");
const backToWelcome = document.getElementById("backToWelcome");

if (startBtn) {
    startBtn.addEventListener("click", () => {
        welcomeScreen.style.display = "none";
        authScreen.style.display = "flex";
    });
}

if (backToWelcome) {
    backToWelcome.addEventListener("click", () => {
        authScreen.style.display = "none";
        welcomeScreen.style.display = "flex";
    });
}
// ================================
// VEDA SUPABASE AUTH
// ================================

const authSubmitBtn = document.getElementById("authSubmitBtn");
const authSwitchBtn = document.getElementById("authSwitchBtn");
const authSwitchText = document.getElementById("authSwitchText");

const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");

const nameField = document.getElementById("nameField");
const authName = document.getElementById("authName");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");

let isSignupMode = false;


// LOGIN ↔ SIGNUP
if (authSwitchBtn) {
    authSwitchBtn.addEventListener("click", () => {

        isSignupMode = !isSignupMode;

        if (isSignupMode) {

            authTitle.textContent = "Create Account";

            authSubtitle.textContent =
                "Create your VEDA health account.";

            nameField.style.display = "block";

            authSubmitBtn.textContent = "Create Account";

            authSwitchText.textContent =
                "Already have an account?";

            authSwitchBtn.textContent = "Login";

        } else {

            authTitle.textContent = "Welcome Back";

            authSubtitle.textContent =
                "Login to continue your health journey.";

            nameField.style.display = "none";

            authSubmitBtn.textContent = "Login";

            authSwitchText.textContent =
                "Don't have an account?";

            authSwitchBtn.textContent = "Sign Up";
        }
    });
}


// AUTH SUBMIT
if (authSubmitBtn) {

    authSubmitBtn.addEventListener("click", async () => {

        const email = authEmail.value.trim();
        const password = authPassword.value.trim();

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        try {

            authSubmitBtn.disabled = true;
            authSubmitBtn.textContent = "Please wait...";


            // =====================
            // SIGN UP
            // =====================

            if (isSignupMode) {

                const name = authName.value.trim();

                if (!name) {
                    alert("Please enter your name.");
                    return;
                }

                const { data, error } =
                    await supabase.auth.signUp({
                        email: email,
                        password: password,
                        options: {
                            data: {
                                name: name
                            }
                        }
                    });

                if (error) {
                    throw error;
                }

                const user = data.user;

                if (user) {

                    const { error: profileError } =
                        await supabase
                            .from("profiles")
                            .insert({
                                id: user.id,
                                name: name,
                                email: email
                            });

                    if (profileError) {
                        console.error(
                            "Profile error:",
                            profileError
                        );
                    }
                }

                alert("Account created successfully! 🎉");

                isSignupMode = false;

                authTitle.textContent = "Welcome Back";

                authSubtitle.textContent =
                    "Login to continue your health journey.";

                nameField.style.display = "none";

                authSubmitBtn.textContent = "Login";

                authSwitchText.textContent =
                    "Don't have an account?";

                authSwitchBtn.textContent = "Sign Up";

                authPassword.value = "";

            }


            // =====================
            // LOGIN
            // =====================

            else {

                const { data, error } =
                    await supabase.auth.signInWithPassword({
                        email: email,
                        password: password
                    });

                if (error) {
                    throw error;
                }

                console.log(
                    "✅ Logged in:",
                    data.user
                );

               
state.user = data.user;

const userStorageKey = `hc_name_${data.user.id}`;
const savedProfileName =
  (localStorage.getItem(userStorageKey) || "").trim();

if (!savedProfileName) {
  state.name =
    data.user.user_metadata?.name ||
    data.user.user_metadata?.full_name ||
    data.user.email?.split("@")[0] ||
    "VEDA User";
} else {
  state.name = savedProfileName;
}

persist();
syncDisplayName();


                alert("Welcome to VEDA 🌿");

                if (authScreen) {
                    authScreen.style.display = "none";
                }

                const dashboard = document.getElementById("app");

                if (dashboard) {
                    dashboard.classList.remove("hidden");
                    dashboard.style.display = "block";
                }

                state.view = "dashboard";
                await init();
            }

        } catch (error) {

            console.error(
                "❌ Authentication error:",
                error
            );

            alert(error.message);

        } finally {

            authSubmitBtn.disabled = false;

            authSubmitBtn.textContent =
                isSignupMode
                    ? "Create Account"
                    : "Login";
        }
    });
}
// =====================================
// VEDA - SAVE MEDICAL RECORD
// =====================================

async function saveMedicalRecord(record) {
    try {

        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
            alert("Please login first.");
            return null;
        }

        const { data, error } = await supabase
            .from("medical_records")
            .insert({
                user_id: user.id,
                name: record.name,
                type: record.type,
               report_data: record.report_data,
                file_url: record.file_url || null,
                ai_summary: record.ai_summary || null
            })
            .select()
            .single();

        if (error) throw error;

        console.log("✅ Medical record saved:", data);

        return data;

    } catch (error) {

        console.error(
            "❌ Medical record error:",
            error
        );

        alert("Could not save medical record.");

        return null;
    }
}
// =====================================
// VEDA - UPLOAD MEDICAL FILE
// =====================================

async function uploadMedicalFile(file) {
    try {

        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
            alert("Please login first.");
            return null;
        }

        if (!file) {
            alert("Please select a file.");
            return null;
        }

       const filePath = `${user.id}/${Date.now()}-${file.name}`;

const { data, error } = await supabase.storage
    .from("medical_reports")
    .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
    });

        if (error) throw error;

        console.log("✅ Medical file uploaded:", data);

        return data;

    } catch (error) {

        console.error(
            "❌ Medical file upload failed:",
            error
        );

        alert("Could not upload medical file.");

        return null;
    }
}
// Make module functions accessible to HTML onclick handlers
window.openReport = openReport;
window.openReportPicker = function () {
    document.getElementById("reportInput")?.click();
};
window.sendChatInput = sendChatInput;
window.sendMessage = sendMessage;
window.go = go;

async function extractReportText(file, onProgress = () => {}) {
    if (!file) {
        throw new Error("Please select a report.");
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf"
    ];

    if (!allowedTypes.includes(file.type)) {
        throw new Error("Only JPG, PNG, WEBP and PDF files are supported.");
    }

    if (file.size > 15 * 1024 * 1024) {
        throw new Error("Report must be smaller than 15 MB.");
    }

    if (!window.Tesseract) {
        throw new Error("Tesseract.js library is not loaded.");
    }

    let worker;

    try {
        const ocrLanguage = localStorage.getItem("veda_ocr_language") || "eng+hin";
        worker = await window.Tesseract.createWorker(ocrLanguage, 1, {
            logger: (message) => {
                if (message.status) {
                    console.log(
                        "VEDA OCR:",
                        message.status,
                        message.progress ?? ""
                    );
                    onProgress(`OCR: ${message.status}`);
                }
            }
        });

        const pages = [];

        if (file.type === "application/pdf") {
            if (!window.pdfjsLib) {
                throw new Error("PDF.js library is not loaded.");
            }

            const bytes = new Uint8Array(await file.arrayBuffer());
            const pdf = await window.pdfjsLib.getDocument({
                data: bytes
            }).promise;

            // Process at most the first 10 pages.
            const pageCount = Math.min(pdf.numPages, 10);

            for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
                onProgress(
                    `Reading PDF page ${pageNumber}/${pageCount}...`
                );

                const page = await pdf.getPage(pageNumber);
                const viewport = page.getViewport({ scale: 1.8 });

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                if (!context) {
                    throw new Error("Could not create a canvas for PDF OCR.");
                }

                canvas.width = Math.floor(viewport.width);
                canvas.height = Math.floor(viewport.height);

                try {
                    await page.render({
                        canvasContext: context,
                        viewport
                    }).promise;

                    const result = await worker.recognize(canvas);

                    pages.push(`Page ${pageNumber}\n${result.data.text}`);
                } finally {
                    canvas.width = 0;
                    canvas.height = 0;
                }
            }

            if (pdf.numPages > 10) {
                pages.push("Note: Only the first 10 pages were processed.");
            }
        } else {
            onProgress("Reading report image...");

            const result = await worker.recognize(file);
            pages.push(result.data.text);
        }

        const extractedText = pages.join("\n\n").trim();

        if (!extractedText) {
            throw new Error(
                "No text detected. Try a clearer image or PDF."
            );
        }

        onProgress("OCR complete. Preparing review...");
        return extractedText;

    } finally {
        if (worker) {
            await worker.terminate();
        }
    }
}

document.getElementById("runOcrTest")?.addEventListener("click", async () => {
  const file = document.getElementById("ocrTestFile")?.files?.[0];
  const status = document.getElementById("ocrStatus");
  const output = document.getElementById("ocrResult");

  try {
    if (!file) {
      status.textContent = "Pehle report select kar.";
      return;
    }

    status.textContent = "OCR chal raha hai...";
    output.value = "";

    output.value = await extractReportText(file, message => {
      status.textContent = message;
    });

    status.textContent = "Text extract ho gaya! Ab review kar.";
  } catch (error) {
    status.textContent = error.message || "OCR failed.";
    console.error(error);
  }
});

async function openHealthIdentity() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    alert("Please log in to view your health identity.");
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from("health_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error(profileError);
    alert("Could not load your health profile.");
    return;
  }

  const name =
    profile?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "VEDA User";

  const demoId =
    profile?.mock_abha_id ||
    "VEDA-DEMO-" + crypto.randomUUID().slice(0, 8).toUpperCase();

  const { error: saveError } = await supabase
    .from("health_profiles")
    .upsert({
      id: user.id,
      full_name: name,
      mock_abha_id: demoId,
      abha_linked: false,
      updated_at: new Date().toISOString()
    });

  if (saveError) {
    console.error(saveError);
    alert("Could not save your demo health identity.");
    return;
  }

  showModal(`
    <div class="view-head">
      <div>
        <div class="kicker">VEDA · Digital Health</div>
        <h2>Health Identity</h2>
        <p>Prototype only — not an official ABHA account.</p>
      </div>
      <button class="btn btn-outline btn-sm" onclick="closeModal()">Close</button>
    </div>
    <div class="card insight">
      <h3>${escapeHtml(name)}</h3>
      <p>Mock ABHA ID</p>
      <h2 style="overflow-wrap:anywhere">${escapeHtml(demoId)}</h2>
      <p>This identifier is for demonstration only. It is not issued or verified by ABDM.</p>
    </div>
    <div class="page-section">
      <button class="btn btn-primary" onclick="exportFhirBundle()">Export FHIR-style JSON</button>
    </div>
  `);
}

async function exportFhirBundle() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) throw new Error("Please log in first.");

    const { data: profile, error: profileError } = await supabase
      .from("health_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    const { data: resources, error: resourcesError } = await supabase
      .from("fhir_resources")
      .select("resource_type, resource_data, created_at")
      .eq("user_id", user.id);

    if (resourcesError) throw resourcesError;

    const patient = {
      resourceType: "Patient",
      id: user.id,
      name: [{ text: profile?.full_name || "VEDA User" }],
      identifier: profile?.mock_abha_id
        ? [{
            system: "https://veda.example/demo-abha-id",
            value: profile.mock_abha_id,
            use: "temp"
          }]
        : []
    };

    const entries = [
      { resource: patient },
      ...(resources || []).map(item => ({
        resource: {
          ...item.resource_data,
          resourceType: item.resource_type
        }
      }))
    ];

    const bundle = {
      resourceType: "Bundle",
      type: "collection",
      timestamp: new Date().toISOString(),
      meta: {
        tag: [{
          system: "https://veda.example/tags",
          code: "prototype",
          display: "Demo export; not an official ABDM exchange"
        }]
      },
      entry: entries
    };

    const blob = new Blob(
      [JSON.stringify(bundle, null, 2)],
      { type: "application/fhir+json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "veda-health-demo-bundle.json";
    link.click();
    URL.revokeObjectURL(url);

    toast("FHIR-style demo export downloaded.");
  } catch (error) {
    console.error("FHIR export failed:", error);
    alert("Export failed: " + error.message);
  }
}

window.openHealthIdentity = openHealthIdentity;
window.exportFhirBundle = exportFhirBundle;


async function askAIAboutTrend() {
    const question =
        "Explain the hemoglobin trend shown in VEDA. The displayed previous value is 11.4 g/dL and the latest is 10.2 g/dL. Explain this change in simple language, mention that the values need verification against the original reports, and suggest questions to discuss with a healthcare professional. Do not diagnose.";

    go("copilot");

    setTimeout(() => {
        sendMessage(question);
    }, 300);
}

window.askAIAboutTrend = askAIAboutTrend;
window.showCompare = showCompare;