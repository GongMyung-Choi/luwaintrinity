// control/db/supabase.js

// 1) 여기 두 줄을 네 Supabase 프로젝트 값으로 바꿔야 한다.
// Supabase 대시보드 > Project Settings > API 에 보면 있음.
const SUPABASE_URL = 'https://omchtafaqgkdwcrwscrp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2h0YWZhcWdrZHdjcndzY3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODIyNjMsImV4cCI6MjA3NDQ1ODI2M30.vGV6Gfgi1V8agiwL03ho2R7BAwv4CrTp6-RGH0S3-4g';

// 2) Supabase 클라이언트 생성 (CDN으로 불러온 전역 객체 사용)
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 3) 최근 메모리 이벤트 5개 가져와서 화면에 뿌리는 함수
async function loadRecentMemoryEvents() {
  const statusEl = document.getElementById('status');
  const tbody = document.getElementById('memory-table-body');

  if (!statusEl || !tbody) {
    console.error('필요한 DOM 요소를 못 찾음');
    return;
  }

  statusEl.textContent = 'Supabase 연결 확인 중...';

  const { data, error } = await supabase
    .from('memory_events')
    .select('created_at, path, content')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error(error);
    statusEl.textContent = 'Supabase 연결 실패: ' + error.message;
    return;
  }

  statusEl.textContent = 'Supabase 연결 OK (최근 5개)';

  // 테이블 비우기
  tbody.innerHTML = '';

  if (!data || data.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 3;
    td.textContent = '데이터 없음';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  for (const row of data) {
    const tr = document.createElement('tr');

    const createdTd = document.createElement('td');
    createdTd.textContent = new Date(row.created_at).toLocaleString('ko-KR');

    const pathTd = document.createElement('td');
    pathTd.textContent = row.path || '-';

    const contentTd = document.createElement('td');
    // content 는 jsonb라서 문자열로 잘라서 보여줌
    let summary = '';
    try {
      summary = JSON.stringify(row.content);
    } catch (e) {
      summary = String(row.content ?? '');
    }
    if (summary.length > 80) {
      summary = summary.slice(0, 77) + '...';
    }
    contentTd.textContent = summary;

    tr.appendChild(createdTd);
    tr.appendChild(pathTd);
    tr.appendChild(contentTd);
    tbody.appendChild(tr);
  }
}

// 4) 페이지가 로드되면 자동으로 실행
document.addEventListener('DOMContentLoaded', loadRecentMemoryEvents);
