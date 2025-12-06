const supabase = window.supabaseClient;

const TABLE_MAIN   = "rl_qna";
const TABLE_PENDING = "rl_qna_pending";

const mqInput = document.getElementById("mqInput");
const mqSubmit = document.getElementById("mqSubmit");
const mqList = document.getElementById("mqList");

async function loadMobileQna(){
  const { data:userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if(!user){
    mqList.innerHTML = "<p>로그인 필요</p>";
    return;
  }

  const { data, error } = await supabase
    .from(TABLE_MAIN)
    .select("*")
    .eq("user_id", user.id)
    .order("created_at",{ascending:false});

  if(error){
    mqList.innerHTML = "불러오기 오류";
    return;
  }

  mqList.innerHTML = "";
  data.forEach(item=>{
    const div = document.createElement("div");
    div.className = "q-item";
    div.innerHTML = `
      <b>Q.</b> ${item.question}<br>
      <b>A.</b> ${item.answer || "<i>(대기중)</i>"}
    `;
    mqList.appendChild(div);
  });
}

mqSubmit.onclick = async ()=>{
  const q = mqInput.value.trim();
  if(!q) return;

  const { data:userData } = await supabase.auth.getUser();
  const user = userData?.user;

  // 자동답변 엔진 동일 적용
  function autoAns(question){
    const sensitive = ["의료","진단","법률","정신","약","상담"];
    if(sensitive.some(k=>question.includes(k))) return null;
    return "루웨인 자동응답: " + question;
  }

  const ans = autoAns(q);

  if(ans){
    await supabase.from(TABLE_MAIN).insert({
      user_id:user.id, question:q, answer:ans
    });
  } else {
    await supabase.from(TABLE_PENDING).insert({
      user_id:user.id, question:q, status:"pending"
    });
  }

  mqInput.value = "";
  loadMobileQna();
};

document.addEventListener("DOMContentLoaded", loadMobileQna);
