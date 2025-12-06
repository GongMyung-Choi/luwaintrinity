// /os/assets/js/core/memory.js
// 페이지마다 import 해서 활성화하는 자동 기록 엔진

export const LuwainMemory = {
  start() {
    console.log("[LuwainMemory] 기록 활성화됨");

    document.addEventListener("click", (e) => {
      // 클릭 기록 등 필요 시 커스텀 확장
    });

    // 나중에 Supabase 연결 가능
  }
};
