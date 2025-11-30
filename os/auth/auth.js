import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://omchtafaqgkdwcrwscrp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2h0YWZhcWdrZHdjcndzY3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODIyNjMsImV4cCI6MjA3NDQ1ODI2M30.vGV6Gfgi1V8agiwL03ho2R7BAwv4CrTp6-RGH0S3-4g
";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ------------------ 회원가입 ------------------
const signupForm = document.getElementById("signup-form");
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        let { error } = await supabase.auth.signUp({ email, password });
        if (error) alert("회원가입 실패: " + error.message);
        else {
            alert("회원가입 성공!");
            window.location.href = "login.html";
        }
    });
}

// ------------------ 로그인 ------------------
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        let { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) alert("로그인 실패: " + error.message);
        else window.location.href = "profile.html";
    });
}

// ------------------ 프로필 ------------------
const emailDisplay = document.getElementById("email");
if (emailDisplay) {
    supabase.auth.getUser().then(({ data }) => {
        if (!data?.user) {
            window.location.href = "login.html";
        } else {
            emailDisplay.textContent = "이메일: " + data.user.email;
        }
    });
}

// ------------------ 로그아웃 ------------------
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await supabase.auth.signOut();
        window.location.href = "login.html";
    });
}
