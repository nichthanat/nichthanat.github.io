    // ========= Utils =========
    const nl2br = (s) => String(s).replace(/\n/g, '<br>');
    const $ = (sel) => document.querySelector(sel);
    const playPop = (() => { // Soft UI pop using WebAudio
      let ctx;
      return () => {
        try {
          ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(520, ctx.currentTime);
          o.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.08);
          g.gain.setValueAtTime(0.0001, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
          o.connect(g).connect(ctx.destination);
          o.start(); o.stop(ctx.currentTime + 0.13);
        } catch (e) {/* silent */ }
      };
    })();

    // ========= Starfield =========
    ; (() => {
      const c = document.getElementById('stars');
      const ctx = c.getContext('2d');
      let w, h, stars;
      function resize() { w = c.width = innerWidth; h = c.height = innerHeight; init(); }
      function init() { const count = Math.min(450, Math.floor(w * h / 5000)); stars = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, z: Math.random() * 1 + 0.2, a: Math.random() * 1 })); }
      function draw() { ctx.clearRect(0, 0, w, h); for (const s of stars) { s.y += 0.03 * s.z; if (s.y > h) s.y = 0; s.a += 0.005; const tw = (Math.sin(s.a) * 0.5 + 0.5); const r = s.z * 1.8 + tw * 0.8; ctx.fillStyle = `rgba(124,249,255,${0.35 + tw * 0.35})`; ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill(); } requestAnimationFrame(draw); }
      addEventListener('resize', resize, { passive: true }); resize(); draw();
    })();

    // ========= Data =========
    const CATS = [
      { id: 'frontend', name: 'Frontend', img: 'frontend' },
      { id: 'backend', name: 'Backend', img: 'backend' },
      { id: 'fullstack', name: 'Full‑stack', img: 'fullstack' },
      { id: 'mobile', name: 'Mobile', img: 'mobile' },
      { id: 'data', name: 'Data / ML', img: 'data' },
      { id: 'devops', name: 'DevOps', img: 'devops' },
    ];

    // Images placeholder (replace src with your AI images URLs/base64)
    const IMG = {
      frontend: 'https://picsum.photos/seed/foxneon/700/900',
      backend: 'https://picsum.photos/seed/cyberbear/700/900',
      fullstack: 'https://picsum.photos/seed/pandadual/700/900',
      mobile: 'https://picsum.photos/seed/chameleandroid/700/900',
      data: 'https://picsum.photos/seed/aiowl/700/900',
      devops: 'https://picsum.photos/seed/cloudshark/700/900',
     
    };

    // 10 Questions (one-by-one) — from user
    const Q = [
      {
        icon: '🧩', t: 'ถ้าโค้ดของคุณรันไม่ออก คุณจะ…', o: [
          ['A. เปิด console ดู error แล้วรีเฟรชใหม่รัว ๆ', { frontend: 1 }],
          ['B. อ่านเอกสาร doc แบบละเอียดสุด ๆ จนเข้าใจสาเหตุ', { backend: 1}],
          ['C. สร้าง test case จำลองทุกเงื่อนไขมาดีบัก', { fullstack: 1 }],
          ['D. พิมพ์คำถามใน Stack Overflow ทันที', { data: 1 }],
          ['E. ปล่อยโค้ดนั้นไว้ก่อน ไปกินข้าวก่อนค่อยกลับมาดู', { mobile: 1 }],
          ['F. เขียนสคริปต์อัตโนมัติช่วยเช็ก error ครั้งต่อไป', { devops: 1 }],
        ]
      },
      {
        icon: '💻', t: 'เวลาคุณเปิดเว็บที่ดีไซน์สวยมาก ๆ คุณจะโฟกัสที่…', o: [
          ['A. การจัดวาง ฟอนต์ สี และเอฟเฟกต์เวลา hover', { frontend: 1 }],
          ['B. ความเร็วในการโหลด', { fullstack: 1 }],
          ['C. การทำงานของระบบเบื้องหลัง', { backend: 1 }],
          ['D. ความปลอดภัยของข้อมูล', { devops: 1 }],
          ['E. ความเข้ากันได้บนมือถือ', { mobile: 1 }],
          ['F. ความเสถียรของ server', { data: 1 }],
        ]
      },
      {
        icon: '⚡', t: 'ถ้ามีเวลา 1 วันให้สร้างโปรเจกต์อะไรก็ได้ คุณจะทำ…', o: [
          ['A. เว็บไซต์ portfolio เท่ ๆ ของตัวเอง', { frontend: 1 }],
          ['B. API ที่จัดการข้อมูลแบบอัจฉริยะ', { backend: 1 }],
          ['C. แอปมือถือที่ใช้ง่าย', { mobile: 1 }],
          ['D. Dashboard แสดงข้อมูลแบบเรียลไทม์', { data: 1 }],
          ['E. ระบบอัตโนมัติที่ deploy เองได้', { devops: 1 }],
          ['F. เกมเล็ก ๆ ที่มีเอฟเฟกต์เจ๋ง ๆ', { fullstack: 1 }],
        ]
      },
      {
        icon: '🧠', t: 'ถ้ามีคนชมว่า “คุณเก่งมาก” คุณอยากให้ชมเรื่องอะไร?', o: [
          ['A. ดีไซน์เว็บที่คุณทำมันดูเป็นมืออาชีพ', { frontend: 2 }],
          ['B. โค้ดคุณสะอาดและอ่านง่าย', { backend: 2 }],
          ['C. ระบบคุณทำงานเร็วและไม่พัง', { fullstack: 2 }],
          ['D. คุณเข้าใจข้อมูลลึกมาก', { data: 2 }],
          ['E. คุณแก้บั๊กได้ไวเกินมนุษย์', { devops: 2 }],
          ['F. ทุกอย่างในโปรเจกต์เชื่อมกันได้แบบลงตัว', { mobile: 2 }],
        ]
      },
      {
        icon: '📊', t: 'ถ้าเปรียบการเขียนโค้ดเป็นการทำอาหาร คุณคือ…', o: [
          ['A. เชฟแต่งจานให้สวยก่อนเสิร์ฟ ', { frontend: 2 }],
          ['B. นักวิทยาศาสตร์ในครัว ', { backend: 2 }],
          ['C. เชฟที่ทำได้ทุกขั้นตอนตั้งแต่หั่นยันเสิร์ฟ ', { fullstack: 2 }],
          ['D. คนชิมรสแล้ววิเคราะห์สูตร ', { data: 2 }],
          ['E. คนจัดระบบครัวให้สะอาดและอัตโนมัติ ', { devops: 2 }],
          ['F. คนส่งอาหารให้ลูกค้าผ่านแอปมือถือ ', { mobile: 2 }],
        ]
      },
      {
        icon: '📱', t: 'ถ้าคุณต้องเลือกอุปกรณ์พัฒนาได้แค่ 1 อย่าง', o: [
          ['A. จอ ultrawide สำหรับจัด layout', { frontend: 2 }],
          ['B. server ส่วนตัวไว้ลองระบบ', { backend: 2}],
          ['C. iPad / Emulator สำหรับเทสต์แอป', { mobile: 2 }],
          ['D. เครื่องแรง ๆ สำหรับประมวลผลข้อมูล', { data: 2 }],
          ['E. ระบบ cloud พร้อมเครื่องมือ CI/CD', { devops: 2 }],
          ['F. laptop น้ำหนักเบาแต่พกพาสะดวก', { fullstack: 2 }],
        ]
      },
      {
        icon: '🧩', t: 'เวลามี bug โผล่มาตอนตีสอง คุณจะทำยังไง', o: [
          ['A. เปิด devtools ทันที ไม่หลับจนกว่าจะเจอ', { frontend: 1 }],
          ['B. ล็อกทุกค่าใน console ดูทีละบรรทัด', { backend: 1}],
          ['C. เปิด music เบา ๆ แล้วดีบักแบบมีสมาธิ', { mobile: 1 }],
          ['D. สร้าง log อัตโนมัติให้จับ error เอง', { data: 1 }],
          ['E. สั่ง restart server ดูก่อน', { devops: 1 }],
          ['F. นอนก่อน ตื่นเช้ามาโค้ดจะตอบเราเอง', { fullstack: 1 }],
        ]
      },
      {
        icon: '⚙️', t: 'คำสั่งไหนที่คุณใช้บ่อยสุดในชีวิต', o: [
          ['A. console.log()', { frontend: 2 }],
          ['B. fetch()', { backend: 2 }],
          ['C. npm install', { fullstack: 2 }],
          ['D. git push', { fullstack: 1, devops: 1 }],
          ['E. sudo', { devops: 2 }],
          ['F. pip install pandas', { data: 2 }],
        ]
      },
      {
        icon: '🧮', t: 'ถ้าคุณต้องเลือกเพื่อนร่วมทีมซักคน', o: [
          ['A. คนที่โค้ดสวย', { frontend: 1 }],
          ['B. คนที่อธิบาย logic เก่ง', { backend: 1 }],
          ['C. คนที่มีไอเดียใหม่ตลอด', {  mobile: 1 }],
          ['D. คนที่ชอบวิเคราะห์ข้อมูล', { data: 1 }],
          ['E. คนที่ใจเย็นและแก้ปัญหาทีละขั้น', { devops: 1 }],
          ['F. คนที่รู้ระบบทุกส่วนและช่วยได้ทุกเรื่อง', { fullstack: 3 }],
        ]
      },
      {
        icon: '💬', t: 'ถ้าเว็บของคุณพังตอนเดโม คุณจะ…', o: [
          ['A. รีบหาปัญหาด้าน UI', { frontend: 2 }],
          ['B. เช็ก API ว่าล่มหรือไม่', { backend: 2 }],
          ['C. ดู log ของ server', { devops: 2 }],
          ['D. วิเคราะห์ว่ามันเกิดจากข้อมูลหรือระบบ', { data: 2 }],
          ['E. กู้ระบบผ่าน backup', { devops: 1 }],
          ['F. แก้เฉพาะหน้าแล้วกลับไป refactor ทีหลัง', { fullstack: 1 }],
        ]
      },
    ];

    const RESULT_TEXT = {
      frontend: { title: 'คุณเหมาะกับสาย Frontend ' },
      backend: { title: 'คุณเหมาะกับสาย Backend '},
      fullstack: { title: 'คุณเหมาะกับสาย Full‑stack'},
      mobile: { title: 'คุณเหมาะกับสาย Mobile ' },
      data: { title: 'คุณเหมาะกับสาย Data / ML '},
      devops: { title: 'คุณเหมาะกับสาย DevOps / Cloud '},
    };

    // ========= State =========
    let idx = 0; // current question index
    const answers = Array(Q.length).fill(null); // store chosen option index 0..5

    // ========= Elements =========
    const elHome = document.getElementById('screen-home');
    const elQuiz = document.getElementById('screen-quiz');
    const elResult = document.getElementById('screen-result');
    const bar = document.getElementById('bar');
    const chipIdx = document.getElementById('chipIdx');
    const stage = document.getElementById('stage');
    const qtitle = document.getElementById('qtitle');
    const qicon = document.getElementById('qicon');
    const qopts = document.getElementById('qopts');
    const scoreList = document.getElementById('scoreList');
    const headline = document.getElementById('headline');
    const desc = document.getElementById('desc');
    const charSlot = document.getElementById('charSlot');
    const testlog = document.getElementById('testlog');

    // ========= Nav =========
    const nav = (to) => { for (const s of [elHome, elQuiz, elResult]) s.classList.remove('active'); to.classList.add('active'); scrollTo({ top: 0, behavior: 'smooth' }); };
    document.getElementById('btnStart').onclick = () => { playPop(); idx = 0; renderQ(); nav(elQuiz); };
    document.getElementById('btnPreview').onclick = () => { playPop(); idx = 0; renderQ(); nav(elQuiz); };
    document.getElementById('btnBackHome').onclick = () => { playPop(); nav(elHome); };
    document.getElementById('btnReset').onclick = () => { playPop(); answers.fill(null); idx = 0; renderQ(); };
    document.getElementById('btnRetake').onclick = () => { playPop(); answers.fill(null); idx = 0; renderQ(); nav(elHome); };

    // ========= Render One Question =========
    function renderQ() {
      const q = Q[idx];
      chipIdx.textContent = `ข้อที่ ${idx + 1}/${Q.length}`;
      qtitle.textContent = q.t;
      qicon.textContent = q.icon;
      qopts.innerHTML = q.o.map((pair, j) => {
        const id = `q_${idx}_${j}`;
        const checked = answers[idx] === j ? 'checked' : '';
        return `<label class="opt" for="${id}">
          <input type="radio" name="q${idx}" id="${id}" ${checked} data-i="${idx}" data-j="${j}" />
          <span>${pair[0]}</span>
        </label>`;
      }).join('');
      // Wire
      qopts.querySelectorAll('input[type=radio]').forEach(inp => {
        inp.addEventListener('change', () => { answers[idx] = +inp.dataset.j; updateProgress(); playPop(); });
      });
      // Buttons
      $('#btnPrev').disabled = idx === 0;
      $('#btnNext').style.display = idx < Q.length - 1 ? 'inline-block' : 'none';
      $('#btnSubmit').style.display = idx === Q.length - 1 ? 'inline-block' : 'none';
      updateProgress();
    }

    function updateProgress() {
      const done = answers.filter(a => a !== null).length;
      bar.style.width = (done / Q.length * 100).toFixed(1) + '%';
      stage.textContent = answers[idx] === null ? 'เลือกคำตอบของคุณ' : 'เลือกแล้ว';
    }

    // ========= Navigation Buttons =========
    document.getElementById('btnNext').onclick = () => { if (answers[idx] === null) { alert('ยังไม่ได้เลือกคำตอบ'); return; } playPop(); idx = Math.min(Q.length - 1, idx + 1); renderQ(); };
    document.getElementById('btnPrev').onclick = () => { playPop(); idx = Math.max(0, idx - 1); renderQ(); };
    document.getElementById('btnSubmit').onclick = () => { if (answers[idx] === null) { alert('ยังไม่ได้เลือกคำตอบ'); return; } playPop(); compute(); };

    // ========= Compute Result =========
    function compute() {
      if (answers.some(a => a === null)) return alert('ยังตอบไม่ครบ');
      const score = Object.fromEntries(CATS.map(c => [c.id, 0]));
      answers.forEach((ans, i) => { const weights = Q[i].o[ans][1]; for (const k in weights) score[k] += weights[k]; });
      const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
      const [k1, s1] = sorted[0];
      const [k2, s2] = sorted[1] || [null, null];
      const top = RESULT_TEXT[k1];
      const second = k2 ? RESULT_TEXT[k2] : null;

      document.getElementById('resTitle').textContent = top.title;
      headline.textContent = second ? `สำรองที่น่าสนใจ: ${second.title}` : '—';

      scoreList.innerHTML = sorted.map(([k, s]) => {
        const name = CATS.find(c => c.id === k)?.name ?? k;
        const pct = (s / (Q.length * 3) * 100);
        return `<div class="scoreItem">
          <div style="display:flex; justify-content:space-between; padding:8px 10px; font-size:13px"><span>${name}</span><span>${s}</span></div>
          <div class="progress" style="height:8px; border-radius:0"><div class="bar" style="width:${Math.min(100, pct).toFixed(0)}%"></div></div>
        </div>`;
      }).join('');


      // Character image
      const imgId = CATS.find(c => c.id === k1).img;
      charSlot.innerHTML = `<img class="charImg" alt="${top.title}" src="${IMG[imgId]}"/>`;

      nav(elResult);
    }

    // Share
    document.getElementById('btnShare').onclick = async () => {
      const txt = document.getElementById('resTitle').textContent + "\n" + headline.textContent;
      try { await navigator.clipboard.writeText(txt); alert('คัดลอกผลลัพธ์แล้ว'); } catch { alert(txt); }
    };

    // ========= Self Tests =========
    (function selfTests() {
      const cases = [];
      function test(name, fn) { try { const res = fn(); cases.push({ name, ok: !!res }); } catch (e) { cases.push({ name, ok: false, err: String(e) }); } }

      // Existing tests (fixed for syntax correctness)
      test('nl2br replaces\\n', () => nl2br('a\nb').includes('<br>'));
      test('renderQ builds options', () => { idx = 0; renderQ(); return qopts.children.length >= 6; });
      test('weights test placeholder', () => { answers.fill(0); return true; });

      // Added tests
      test('Q has 10 items', () => Q.length === 10);
      test('progress increases after select', () => { const before = bar.style.width; answers[0] = 0; updateProgress(); return bar.style.width !== before; });
      test('compute sets a title', () => { answers.fill(0); compute(); return document.getElementById('resTitle').textContent.length > 0; });

      const ok = cases.filter(c => c.ok).length; const total = cases.length;
      if (testlog) { testlog.innerHTML = `<div class="badge">Self‑tests: ${ok}/${total} passed</div>`; }
      console.table(cases);
    })();

    // Init
    answers.fill(null);
    idx = 0;
    nav(elHome);


   