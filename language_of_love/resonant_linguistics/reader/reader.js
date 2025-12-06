// ========================
// EPUB VIEWER
// ========================
const book = ePub("../epub/");
let rendition = book.renderTo("viewer", { width:"100%", height:"100%" });
const tocBox = document.getElementById("toc");

book.ready.then(() => book.loaded.navigation).then(toc => {
  toc.forEach(item=>{
    const div = document.createElement("div");
    div.textContent = item.label;
    div.style.cursor = "pointer";
    div.onclick = ()=>rendition.display(item.href);
    tocBox.appendChild(div);
  });
});

rendition.display();


// ========================
// SUPABASE
// ========================
const supabase = window.supabaseClient;  // script_reverb.js에서 제공됨

const TABLE_MAIN   = "rl_qna";
const TABLE_PENDING = "rl_qna_pending";
const TABLE_PUBLIC  = "rl_qna_public";


// ========================
// Q&A 로직
// ========================
const qInput = document.getElementById("qInput");
const qSubmit = document.getElementById("qSubmit");
const qList = document.getElementById("qList");

async function loadMyQuestions(){
  const { data:userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if(!user){ 
    qList.innerHTML = "<p>로그인 필요</p>";
    return;
  }

  const { data, error } = await supabase
    .from(TABLE_MAIN)
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending:false });

  if(error){
    qList.innerHTML = "불러오기 오류";
    return;
  }

  qList.innerHTML = "";
  data.forEach(item=>{
    const div = document.createElement("div");
    div.className = "q-item";
    div.innerHTML = `
      <b>Q.</b> ${item.question}<br>
      <b>A.</b> ${item.answer || "<i>(대기중)</i>"}
    `;
    qList.appendChild(div);
  });
}

qSubmit.onclick = async ()=>{
  const q = qInput.value.trim();
  if(!q) return;

  const { data:userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if(!user){
    alert("로그인 필요");
    return;
  }

  // ========================
  // 1) 루웨인 자동답변 생성
  // ========================
  function ruweinAutoAnswer(question){
    // 간단한 필터링 — 실제로는 여기에 “루웨인 초안 엔진” 붙임
    const sensitive = ["의료","진단","법률","정신","약","상담"];
    if(sensitive.some(k=>question.includes(k))){
      return null; // 보류 처리
    }
    return "루웨인 자동응답: " + question;
  }

  const auto = ruweinAutoAnswer(q);

  if(auto){
    // 정상 자동답변 → MAIN 저장
    await supabase.from(TABLE_MAIN).insert({
      user_id:user.id,
      question:q,
      answer:auto
    });
  } else {
    // 보류 → pending 저장
    await supabase.from(TABLE_PENDING).insert({
      user_id:user.id,
      question:q,
      status:"pending"
    });
  }

  qInput.value = "";
  loadMyQuestions();
};

document.addEventListener("DOMContentLoaded", loadMyQuestions);
