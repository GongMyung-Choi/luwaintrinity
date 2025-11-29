async function checkSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    location.href = "diary.html";
  } else {
    location.href = "login.html";
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const pw = document.getElementById("pw").value;

  let { error } = await supabase.auth.signInWithPassword({ email, password: pw });

  if (error) alert(error.message);
  else location.href = "diary.html";
}

async function signup() {
  const email = document.getElementById("email").value;
  const pw = document.getElementById("pw").value;

  let { error } = await supabase.auth.signUp({ email, password: pw });

  if (error) alert(error.message);
  else alert("가입 성공! 로그인 해주세요.");
}
