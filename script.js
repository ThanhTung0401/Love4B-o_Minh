/* =========================================================
   Gửi em bé 💌 — script
   Muốn sửa câu hỏi / phiếu / lời nhắn: chỉ cần sửa phần NỘI DUNG ngay dưới đây.
   ========================================================= */
(() => {
  'use strict';

  /* ================== NỘI DUNG ================== */

  // mood: normal | happy | love | sad  (biểu cảm của Bé Tim)
  const QUESTIONS = [
    {
      q: 'Hôm nay em có cảm thấy cô đơn không?',
      yes: { text: 'Sai rồi nhen em bé! Luôn có anh và gia đình luôn ở bên em bé mà 🫶 Em không bao giờ phải một mình đâu.', mood: 'love' },
      no: { text: 'Cảm ơn em đã nhận ra, vì luôn có anh và gia đình lo lắng và ở bên cạnh em 🥰', mood: 'happy' }
    },
    {
      q: 'Bụng em bé hôm nay có đau không nè?',
      yes: { text: 'Thương em bé quá à 🥺 Em nhớ uống nước ấm, chườm ấm bụng rồi nằm nghỉ một chút nha. Anh không ở cạnh được nên anh gửi em một cái xoa bụng online nè: xoa xoa xoa 🤲💕', mood: 'sad' },
      no: { text: 'Giỏi quá trời luôn em bé ơi 🥳 Nhưng lát nữa mà đau thì phải nói anh liền nha, không được chịu một mình đâu đó 😤', mood: 'happy' }
    },
    {
      q: 'Hôm nay em có đang quạu anh không?',
      yes: { text: 'Dạ anh biết lỗi rồi ạ 🙇 Em cứ quạu thoải mái nha, anh nhận hết. Quạu xong rồi thì cho anh xin một cái ôm làm hòa nha 🥺👉👈', mood: 'sad' },
      no: { text: 'Hihi vậy là hôm nay anh được thương rồi 😚 Mà kể cả em có quạu thì anh vẫn thương em y chang à.', mood: 'love' }
    },
    {
      q: 'Câu cuối nè: Em có thương anh bé không?',
      runaway: true, // nút "Không" sẽ chạy trốn 😝
      yes: { text: 'Anh biết mà 😝 Anh cũng thương em bé nhiều nhiều nhiều hơn nữa, nhiều hơn cả số sao trên trời luôn! ✨', mood: 'love' }
    }
  ];

  const TEASES = [
    'Ơ kìa, bấm hụt rồi nhen 🤭',
    'Nút này hong có bấm được đâu 😝',
    'Suy nghĩ kỹ lại đi em bé 🥺',
    'Nút “Không” bị hư rồi á 🙈',
    'Thôi chọn Có đi mà 🥹'
  ];
  const MAX_DODGES = 5;

  const LETTER_TITLE = 'Gửi em bé đáng yêu, xinh xắn, hay quạu của anh bé ạ! 💌';

  const COUPONS = [
    ['🤗', 'Phiếu ôm', 'Không giới hạn số lần'],
    ['😤', 'Phiếu được quạu', 'Không cần lý do, anh chịu hết'],
    ['🧋', 'Phiếu trà sữa', 'Anh bao, size to nhất'],
    ['🌙', 'Phiếu kể chuyện', 'Anh nghe tới khi em ngủ'],
    ['🫶', 'Phiếu xoa bụng', 'Tặng kèm xoa đầu'],
    ['🙇', 'Phiếu anh xin lỗi trước', 'Dù chưa biết mình sai gì']
  ];

  const HUG_MESSAGES = {
    1: 'Anh nhận được 1 cái ôm rồi nè 🤗',
    5: '5 cái ôm! Anh tan chảy luôn rồi 🫠',
    10: '10 cái! Em bé thương anh nhiều quá trời 😭💕',
    20: '20 cái ôm... anh ghi sổ, gặp nhau trả đủ nha 🥰',
    50: '50 cái!!! Anh là người hạnh phúc nhất thế giới 🌍💗'
  };

  // Nếu bỏ file nhạc vào assets/music.mp3 thì trang sẽ phát file đó,
  // còn không sẽ tự chơi một bản hộp nhạc nhỏ.
  const MUSIC_FILE = 'assets/music.mp3';

  /* ================== TIỆN ÍCH ================== */

  const $ = (s, r = document) => r.querySelector(s);
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function centerOf(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function typeText(el, text, speed = 28) {
    return new Promise((resolve) => {
      const chars = Array.from(text);
      let i = 0;
      let done = false;
      el.textContent = '';
      el.classList.add('typing');
      const finish = () => {
        if (done) return;
        done = true;
        clearInterval(timer);
        el.textContent = text;
        el.classList.remove('typing');
        el._finish = null;
        resolve();
      };
      const timer = setInterval(() => {
        el.textContent += chars[i++];
        if (i >= chars.length) finish();
      }, reduceMotion ? 1 : speed);
      el._finish = finish;
    });
  }

  /* ================== BÉ TIM (linh vật) ================== */

  const MASCOT_SVG = `
  <svg viewBox="0 0 200 190" aria-hidden="true">
    <path d="M100 178 C40 132 2 100 2 58 C2 24 27 2 57 2 C77 2 93 13 100 29 C107 13 123 2 143 2 C173 2 198 24 198 58 C198 100 160 132 100 178Z" fill="url(#gHeart)"/>
    <ellipse cx="52" cy="42" rx="17" ry="9" fill="#fff" opacity=".45" transform="rotate(-32 52 42)"/>
    <circle cx="78" cy="22" r="4" fill="#fff" opacity=".5"/>
    <ellipse cx="50" cy="104" rx="14" ry="8" fill="#ff4f86" opacity=".42"/>
    <ellipse cx="150" cy="104" rx="14" ry="8" fill="#ff4f86" opacity=".42"/>

    <g class="e e-normal" fill="#4a1d2c">
      <g class="eye"><ellipse cx="70" cy="82" rx="9" ry="12"/><circle cx="73.5" cy="77" r="3.6" fill="#fff"/></g>
      <g class="eye"><ellipse cx="130" cy="82" rx="9" ry="12"/><circle cx="133.5" cy="77" r="3.6" fill="#fff"/></g>
    </g>
    <g class="e e-happy" fill="none" stroke="#4a1d2c" stroke-width="5.5" stroke-linecap="round">
      <path d="M59 86 q11 -15 22 0"/><path d="M119 86 q11 -15 22 0"/>
    </g>
    <g class="e e-love" fill="#c2185b">
      <use href="#i-heart" x="58" y="70" width="24" height="24"/>
      <use href="#i-heart" x="118" y="70" width="24" height="24"/>
    </g>
    <g class="e e-sad">
      <g fill="#4a1d2c">
        <ellipse cx="70" cy="86" rx="8" ry="10"/><circle cx="73" cy="82" r="3.2" fill="#fff"/>
        <ellipse cx="130" cy="86" rx="8" ry="10"/><circle cx="133" cy="82" r="3.2" fill="#fff"/>
      </g>
      <path d="M57 71 L81 64 M119 64 L143 71" stroke="#4a1d2c" stroke-width="4.5" stroke-linecap="round"/>
      <path class="tear" d="M62 98 q-5 8 0 11 q5 -3 0 -11Z" fill="#8fd3ff"/>
    </g>

    <path class="m m-smile" d="M86 106 q14 14 28 0" fill="none" stroke="#4a1d2c" stroke-width="5" stroke-linecap="round"/>
    <g class="m m-open">
      <path d="M83 102 q17 26 34 0Z" fill="#7a1f3d"/>
      <path d="M92 113 q8 -6 16 0 q-8 7 -16 0Z" fill="#ff7aa2"/>
    </g>
    <path class="m m-sad" d="M88 116 q12 -10 24 0" fill="none" stroke="#4a1d2c" stroke-width="5" stroke-linecap="round"/>
  </svg>`;

  document.querySelectorAll('[data-mascot]').forEach((el) => { el.innerHTML = MASCOT_SVG; });

  function setMood(el, mood) {
    el.dataset.mood = mood;
    el.classList.remove('jump');
    void el.offsetWidth; // chạy lại animation
    el.classList.add('jump');
  }

  /* ================== HIỆU ỨNG HẠT (tim, cánh hồng) ================== */

  const COLORS = {
    petal: ['#e11d48', '#f43f5e', '#fb7185', '#be123c', '#f472b6', '#ff8fab'],
    heart: ['#ff4d7d', '#ff7aa2', '#e11d48', '#ff9ec0', '#f43f73', '#ffb3c7']
  };

  class Layer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.items = [];
      this.clean = false;
      this.resize();
    }
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = window.innerWidth;
      this.h = window.innerHeight;
      this.canvas.width = Math.round(this.w * dpr);
      this.canvas.height = Math.round(this.h * dpr);
      this.canvas.style.width = this.w + 'px';
      this.canvas.style.height = this.h + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    update(dt) {
      if (!this.items.length) {
        if (!this.clean) { this.ctx.clearRect(0, 0, this.w, this.h); this.clean = true; }
        return;
      }
      this.clean = false;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.w, this.h);
      for (let i = this.items.length - 1; i >= 0; i--) {
        const p = this.items[i];
        if (!stepParticle(p, dt, this)) { this.items.splice(i, 1); continue; }
        drawParticle(p, ctx, this);
      }
      ctx.globalAlpha = 1;
    }
  }

  function heartPath(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, 0.45);
    ctx.bezierCurveTo(-0.15, 0.3, -0.5, 0.1, -0.5, -0.15);
    ctx.bezierCurveTo(-0.5, -0.42, -0.15, -0.52, 0, -0.28);
    ctx.bezierCurveTo(0.15, -0.52, 0.5, -0.42, 0.5, -0.15);
    ctx.bezierCurveTo(0.5, 0.1, 0.15, 0.3, 0, 0.45);
    ctx.closePath();
  }

  function petalPath(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.95, -s * 0.7, s * 0.75, s * 0.75, 0, s);
    ctx.bezierCurveTo(-s * 0.75, s * 0.75, -s * 0.95, -s * 0.7, 0, -s);
    ctx.closePath();
  }

  function stepParticle(p, dt, L) {
    p.age += dt;
    if (p.g) p.vy += p.g * dt;
    if (p.drag) { const d = Math.pow(p.drag, dt * 60); p.vx *= d; p.vy *= d; }
    if (p.maxVy && p.vy > p.maxVy) p.vy = p.maxVy;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.swayAmp) { p.sway += dt * p.swaySpeed; p.x += Math.cos(p.sway) * p.swayAmp * dt; }
    p.rot += p.vr * dt;
    if (p.vf) p.flip += p.vf * dt;
    if (p.age >= p.life) return false;
    if (p.y > L.h + 40 || p.x < -60 || p.x > L.w + 60) return false;
    if (p.float && p.y < -40) return false;
    return true;
  }

  function drawParticle(p, ctx, L) {
    let a = p.alpha;
    if (p.life !== Infinity) {
      const t = p.age / p.life;
      if (t > 0.65) a *= 1 - (t - 0.65) / 0.35;
    }
    if (p.float) a *= Math.min(1, (L.h - p.y) / 120, p.y / 160);
    if (p.life === Infinity && p.age < 0.25) a *= p.age / 0.25;
    if (a <= 0.01) return;
    ctx.globalAlpha = a;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    if (p.type === 'petal') {
      ctx.scale(1, Math.abs(Math.cos(p.flip)) * 0.75 + 0.25);
      petalPath(ctx, p.size);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.globalAlpha = a * 0.3;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(-p.size * 0.2, -p.size * 0.25, p.size * 0.22, p.size * 0.45, 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'heart') {
      ctx.scale(p.size, p.size);
      heartPath(ctx);
      ctx.fillStyle = p.color;
      ctx.fill();
    } else {
      // lấp lánh 4 cánh
      const s = p.size * (0.6 + 0.4 * Math.sin(p.age * 12));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, 0, s, 0);
      ctx.quadraticCurveTo(0, 0, 0, s);
      ctx.quadraticCurveTo(0, 0, -s, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s);
      ctx.fill();
    }
    ctx.restore();
  }

  const base = { vx: 0, vy: 0, g: 0, drag: 0, rot: 0, vr: 0, flip: 0, vf: 0, sway: 0, swayAmp: 0, swaySpeed: 1.4, age: 0, life: Infinity, alpha: 1 };

  function fallingPetal(L) {
    return Object.assign({}, base, {
      type: 'petal', x: rand(0, L.w), y: -20,
      vx: rand(-12, 12), vy: rand(40, 80),
      rot: rand(0, 6.28), vr: rand(-1.6, 1.6), flip: rand(0, 6.28), vf: rand(1.5, 3.5),
      sway: rand(0, 6.28), swayAmp: rand(15, 40), swaySpeed: rand(1, 2),
      size: rand(6, 11), color: pick(COLORS.petal), alpha: rand(0.6, 0.9)
    });
  }

  function floatingHeart(L) {
    return Object.assign({}, base, {
      type: 'heart', float: true, x: rand(0, L.w), y: L.h + 20,
      vy: -rand(28, 60), rot: rand(-0.35, 0.35),
      sway: rand(0, 6.28), swayAmp: rand(10, 28), swaySpeed: rand(0.8, 1.6),
      size: rand(12, 26), color: pick(COLORS.heart), alpha: rand(0.3, 0.6)
    });
  }

  const bg = new Layer($('#bg'));
  const fx = new Layer($('#fx'));

  function burst(x, y, count = 16, power = 340, withPetals = false) {
    if (reduceMotion) count = Math.ceil(count / 3);
    for (let i = 0; i < count; i++) {
      const ang = rand(0, Math.PI * 2);
      const sp = rand(0.35, 1) * power;
      const petal = withPetals && Math.random() < 0.5;
      fx.items.push(Object.assign({}, base, {
        type: petal ? 'petal' : 'heart',
        x, y,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - power * 0.35,
        g: petal ? 160 : 520, drag: 0.985, maxVy: petal ? 140 : 0,
        rot: rand(-0.6, 0.6), vr: rand(-3, 3), flip: rand(0, 6.28), vf: petal ? rand(2, 4) : 0,
        size: petal ? rand(7, 12) : rand(9, 20),
        color: pick(petal ? COLORS.petal : COLORS.heart),
        life: petal ? rand(2.2, 3.4) : rand(0.9, 1.6)
      }));
    }
    for (let i = 0; i < Math.ceil(count / 4); i++) {
      const ang = rand(0, Math.PI * 2);
      const sp = rand(0.2, 0.7) * power;
      fx.items.push(Object.assign({}, base, {
        type: 'spark', x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        drag: 0.93, size: rand(4, 8), color: '#fff6c2', life: rand(0.6, 1)
      }));
    }
  }

  // Mưa hoa hồng trên lớp trên cùng
  function petalRain(seconds, perSecond) {
    rainUntil = performance.now() + seconds * 1000;
    rainRate = perSecond;
  }

  let ambient = { hearts: 1.1, petals: 0 };
  let rainUntil = 0;
  let rainRate = 0;
  const acc = { hearts: 0, petals: 0, rain: 0 };
  const MAX_BG = 40;

  function spawn(dt, now) {
    const k = reduceMotion ? 0.25 : 1;
    acc.hearts += ambient.hearts * k * dt;
    acc.petals += ambient.petals * k * dt;
    while (acc.hearts >= 1) { acc.hearts--; if (bg.items.length < MAX_BG) bg.items.push(floatingHeart(bg)); }
    while (acc.petals >= 1) { acc.petals--; if (bg.items.length < MAX_BG) bg.items.push(fallingPetal(bg)); }
    if (now < rainUntil) {
      acc.rain += rainRate * k * dt;
      while (acc.rain >= 1) {
        acc.rain--;
        // cánh rơi nhanh hơn để mưa hoa qua đi trước khi em bắt đầu đọc
        if (fx.items.length < 160) fx.items.push(Object.assign(fallingPetal(fx), { vy: rand(110, 170) }));
      }
    }
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    spawn(dt, now);
    bg.update(dt);
    fx.update(dt);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { bg.resize(); fx.resize(); }, 120);
  });

  // Chạm vào bất cứ đâu là nở tim
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, .envelope, .coupon')) return;
    burst(e.clientX, e.clientY, 7, 200);
  }, { passive: true });

  /* ================== NHẠC ================== */

  const Music = (() => {
    let ctx = null;
    let master = null;
    let echo = null;
    let timer = null;
    let idx = 0;
    let loopStart = 0;
    let playing = false;
    let fileOk = false;
    let audioEl = null;

    const BEAT = 0.5;
    const LOOP_BEATS = 24;
    // Giai điệu hộp nhạc nhỏ (tự sáng tác), mỗi ô nhịp 3 phách
    const MELODY = [[76, 1], [79, 1], [84, 1], [83, 1.5], [81, 0.5], [76, 1], [77, 1], [81, 1], [84, 1], [83, 2], [null, 1],
      [84, 1], [83, 0.5], [81, 0.5], [79, 1], [76, 1], [81, 1], [79, 1], [77, 1], [76, 0.5], [74, 0.5], [77, 1], [74, 1.5], [71, 0.5], [72, 1]];
    const CHORDS = [[48, 55, 60], [45, 52, 57], [41, 48, 53], [43, 50, 55], [48, 55, 60], [45, 52, 57], [41, 48, 53], [43, 50, 55]];

    const EVENTS = [];
    let t = 0;
    MELODY.forEach(([m, d]) => { if (m) EVENTS.push({ t, m, v: 0.22 }); t += d; });
    CHORDS.forEach((c, bar) => c.forEach((m, i) => EVENTS.push({ t: bar * 3 + i, m, v: i ? 0.08 : 0.12 })));
    EVENTS.sort((a, b) => a.t - b.t);

    // Kiểm tra trước xem có file nhạc riêng không
    if (location.protocol.startsWith('http')) {
      fetch(MUSIC_FILE, { method: 'HEAD' }).then((r) => { fileOk = r.ok; }).catch(() => {});
    }

    function unlock() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.55;
        master.connect(ctx.destination);
        const delay = ctx.createDelay();
        delay.delayTime.value = 0.33;
        const fb = ctx.createGain();
        fb.gain.value = 0.3;
        const wet = ctx.createGain();
        wet.gain.value = 0.25;
        delay.connect(fb).connect(delay);
        delay.connect(wet).connect(ctx.destination);
        echo = delay;
        // iOS: phát một buffer im lặng để mở khóa âm thanh
        const buf = ctx.createBuffer(1, 1, 22050);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
      }
      if (ctx.state === 'suspended') ctx.resume();
    }

    function pluck(time, m, vel) {
      const f = 440 * Math.pow(2, (m - 69) / 12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(vel, time + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 1.8);
      g.connect(master);
      g.connect(echo);
      const o1 = ctx.createOscillator();
      o1.type = 'sine';
      o1.frequency.value = f;
      o1.connect(g);
      const o2 = ctx.createOscillator();
      o2.type = 'sine';
      o2.frequency.value = f * 3;
      const g2 = ctx.createGain();
      g2.gain.value = 0.12;
      o2.connect(g2).connect(g);
      o1.start(time); o2.start(time);
      o1.stop(time + 1.9); o2.stop(time + 1.9);
    }

    function schedule() {
      while (true) {
        const ev = EVENTS[idx];
        const when = loopStart + ev.t * BEAT;
        if (when > ctx.currentTime + 0.3) break;
        if (when >= ctx.currentTime - 0.05) pluck(when, ev.m, ev.v);
        idx++;
        if (idx >= EVENTS.length) { idx = 0; loopStart += LOOP_BEATS * BEAT; }
      }
    }

    function startBox() {
      if (!ctx) return;
      idx = 0;
      loopStart = ctx.currentTime + 0.15;
      clearInterval(timer);
      timer = setInterval(schedule, 60);
      schedule();
    }

    function play() {
      unlock();
      if (fileOk) {
        audioEl = audioEl || Object.assign(new Audio(MUSIC_FILE), { loop: true, volume: 0.6 });
        audioEl.play().catch(() => { fileOk = false; startBox(); });
      } else {
        startBox();
      }
      playing = true;
    }

    function stop() {
      clearInterval(timer);
      timer = null;
      if (audioEl) audioEl.pause();
      playing = false;
    }

    document.addEventListener('visibilitychange', () => {
      if (!ctx) return;
      if (document.hidden) { ctx.suspend(); if (audioEl && playing) audioEl.pause(); }
      else if (playing) { ctx.resume(); if (audioEl && fileOk) audioEl.play().catch(() => {}); }
    });

    return { play, stop, get playing() { return playing; } };
  })();

  const musicBtn = $('#musicBtn');
  musicBtn.addEventListener('click', () => {
    if (Music.playing) Music.stop(); else Music.play();
    musicBtn.setAttribute('aria-pressed', String(Music.playing));
  });

  /* ================== ĐIỀU HƯỚNG MÀN HÌNH ================== */

  const screens = {
    start: $('#s-start'),
    quiz: $('#s-quiz'),
    envelope: $('#s-envelope'),
    letter: $('#s-letter')
  };
  let current = 'start';

  function go(name) {
    screens[current].classList.remove('is-active');
    current = name;
    screens[name].classList.add('is-active');
    if (onEnter[name]) onEnter[name]();
  }

  const onEnter = {
    start() { ambient = { hearts: 1.1, petals: 0 }; },
    quiz() { ambient = { hearts: 0.7, petals: 0 }; qi = 0; renderQuestion(true); },
    envelope() { ambient = { hearts: 0.9, petals: 0.5 }; resetEnvelope(); },
    letter() { ambient = { hearts: 0.4, petals: 1.4 }; enterLetter(); }
  };

  $('#startBtn').addEventListener('click', (e) => {
    const c = centerOf(e.currentTarget);
    burst(c.x, c.y, 22, 380);
    Music.play();
    musicBtn.hidden = false;
    musicBtn.setAttribute('aria-pressed', 'true');
    setTimeout(() => go('quiz'), 350);
  });

  /* ================== CÂU HỎI ================== */

  const card = $('#quizCard');
  const quizMascot = $('#quizMascot');
  const qText = $('#qText');
  const qCount = $('#qCount');
  const qActions = $('#qActions');
  const qTease = $('#qTease');
  const yesBtn = $('#yesBtn');
  const noBtn = $('#noBtn');
  const answerBox = $('#answer');
  const answerText = $('#answerText');
  const nextBtn = $('#nextBtn');
  const progress = $('#progress');

  progress.innerHTML = QUESTIONS.map(() => '<svg viewBox="-12 -12 24 24"><use href="#i-heart" x="-12" y="-12" width="24" height="24"/></svg>').join('');

  let qi = 0;
  let answered = false;
  let dodges = 0;
  let lastDodge = 0;

  function renderQuestion(first) {
    const q = QUESTIONS[qi];
    answered = false;
    dodges = 0;
    resetNoBtn();
    qCount.textContent = `Câu ${qi + 1} / ${QUESTIONS.length}`;
    qText.textContent = q.q;
    qTease.textContent = '';
    qActions.hidden = false;
    qActions.classList.remove('hide');
    answerBox.hidden = true;
    nextBtn.classList.remove('show');
    quizMascot.dataset.mood = 'normal';
    [...progress.children].forEach((h, i) => {
      h.classList.toggle('done', i < qi);
      h.classList.toggle('now', i === qi);
    });
    card.classList.remove('card-out', 'card-in');
    void card.offsetWidth;
    card.classList.add('card-in');
    if (!first) setMood(quizMascot, 'normal');
  }

  function answer(isYes, fromEl) {
    if (answered) return;
    answered = true;
    const q = QUESTIONS[qi];
    const r = isYes || !q.no ? q.yes : q.no;
    const c = centerOf(fromEl);
    burst(c.x, c.y, 18, 340);
    setMood(quizMascot, r.mood);
    qActions.classList.add('hide');
    resetNoBtn();
    progress.children[qi].classList.add('done');
    setTimeout(async () => {
      qActions.hidden = true;
      qTease.textContent = '';
      answerBox.hidden = false;
      nextBtn.textContent = qi === QUESTIONS.length - 1 ? 'Mở thư thôi 💌' : 'Tiếp nè ➜';
      await typeText(answerText, r.text);
      nextBtn.classList.add('show');
    }, 260);
  }

  answerText.addEventListener('click', () => { if (answerText._finish) answerText._finish(); });

  yesBtn.addEventListener('click', () => answer(true, yesBtn));

  noBtn.addEventListener('click', (e) => {
    const q = QUESTIONS[qi];
    if (q.runaway && dodges < MAX_DODGES) { e.preventDefault(); dodge(); return; }
    // cú chạm vừa biến nút thành "Có luôn" thì chưa tính là trả lời
    if (q.runaway && performance.now() - lastDodge < 450) return;
    answer(q.runaway ? true : false, noBtn);
  });
  noBtn.addEventListener('pointerdown', (e) => {
    if (QUESTIONS[qi].runaway && dodges < MAX_DODGES && !answered) { e.preventDefault(); dodge(); }
  });
  noBtn.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse' && QUESTIONS[qi].runaway && dodges < MAX_DODGES && !answered) dodge();
  });

  function dodge() {
    const now = performance.now();
    if (now - lastDodge < 260) return;
    lastDodge = now;
    dodges++;

    const r = noBtn.getBoundingClientRect();
    if (!noBtn.classList.contains('runaway')) {
      // đưa nút ra ngoài body để position: fixed không bị ảnh hưởng bởi transform của thẻ cha
      noBtn._home = noBtn.parentNode;
      noBtn.style.left = r.left + 'px';
      noBtn.style.top = r.top + 'px';
      noBtn.style.width = r.width + 'px';
      document.body.appendChild(noBtn);
      noBtn.classList.add('runaway');
      void noBtn.offsetWidth;
    }

    const pad = 16;
    const yesR = yesBtn.getBoundingClientRect();
    const top0 = pad + 56; // chừa chỗ cho nút nhạc
    let x = 0;
    let y = 0;
    for (let i = 0; i < 14; i++) {
      x = rand(pad, window.innerWidth - r.width - pad);
      y = rand(top0, window.innerHeight - r.height - pad - 20);
      const farFromNow = Math.hypot(x - r.left, y - r.top) > 120;
      const overlapsYes = x < yesR.right + 12 && x + r.width > yesR.left - 12 && y < yesR.bottom + 12 && y + r.height > yesR.top - 12;
      if (farFromNow && !overlapsYes) break;
    }
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';

    qTease.textContent = TEASES[Math.min(dodges - 1, TEASES.length - 1)];
    yesBtn.style.transform = `scale(${1 + dodges * 0.1})`;
    setMood(quizMascot, dodges % 2 ? 'happy' : 'love');

    if (dodges >= MAX_DODGES) {
      noBtn.textContent = 'Có luôn ❤️';
      noBtn.classList.add('converted');
      qTease.textContent = 'Nút “Không” cũng biến thành “Có” luôn rồi nè 😝';
    }
  }

  function resetNoBtn() {
    if (noBtn._home) {
      noBtn._home.appendChild(noBtn);
      noBtn._home = null;
    }
    noBtn.classList.remove('runaway', 'converted');
    noBtn.removeAttribute('style');
    noBtn.textContent = 'Không';
    yesBtn.removeAttribute('style');
  }

  nextBtn.addEventListener('click', () => {
    const c = centerOf(nextBtn);
    burst(c.x, c.y, 10, 240);
    if (qi < QUESTIONS.length - 1) {
      card.classList.remove('card-in');
      card.classList.add('card-out');
      setTimeout(() => { qi++; renderQuestion(); }, 400);
    } else {
      go('envelope');
    }
  });

  /* ================== PHONG THƯ ================== */

  const envelope = $('#envelope');
  let opening = false;

  function resetEnvelope() {
    opening = false;
    envelope.classList.remove('open-seal', 'open-flap', 'flap-back', 'open-letter');
    envelope.parentNode.classList.remove('opening');
  }

  async function openEnvelope() {
    if (opening) return;
    opening = true;
    const r = envelope.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    envelope.classList.add('open-seal');
    envelope.parentNode.classList.add('opening');
    burst(cx, r.top + r.height * 0.58, 20, 360);
    await wait(350);
    envelope.classList.add('open-flap');
    await wait(450);
    envelope.classList.add('flap-back', 'open-letter');
    await wait(650);
    burst(cx, r.top, 34, 520, true);
    petalRain(3.5, 8);
    await wait(900);
    go('letter');
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });

  /* ================== BỨC THƯ ================== */

  const letterEl = screens.letter;
  const letterTitle = $('#letterTitle');
  let io = null;

  $('#letterDate').textContent = 'Viết cho em, ' + new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' });

  let titleTimer;
  function enterLetter() {
    letterEl.scrollTop = 0;
    if (letterTitle._finish) letterTitle._finish();
    letterTitle.textContent = '';
    clearTimeout(titleTimer);
    titleTimer = setTimeout(() => typeText(letterTitle, LETTER_TITLE, 55), 700);

    const items = letterEl.querySelectorAll('.reveal');
    items.forEach((el) => el.classList.remove('in'));
    if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('in')); return; }
    if (io) io.disconnect();
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { root: letterEl, threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach((el) => io.observe(el));
  }

  // Phiếu yêu thương
  const couponsEl = $('#coupons');
  const couponNote = $('#couponNote');
  couponsEl.innerHTML = COUPONS.map(([emoji, title, sub]) => `
    <button class="coupon" type="button" aria-pressed="false">
      <span class="c-emoji" aria-hidden="true">${emoji}</span>
      <span class="c-title">${title}</span>
      <span class="c-sub">${sub}</span>
      <span class="stamp" aria-hidden="true">ĐÃ DUYỆT ❤</span>
    </button>`).join('');

  couponsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.coupon');
    if (!btn) return;
    const used = btn.classList.toggle('used');
    btn.setAttribute('aria-pressed', String(used));
    if (used) {
      const c = centerOf(btn);
      burst(c.x, c.y, 14, 280);
      const title = btn.querySelector('.c-title').textContent;
      couponNote.textContent = `Anh đã nhận “${title}”, sẽ thực hiện sớm nhất nha 🫡`;
    } else {
      couponNote.textContent = 'Phiếu đã được hoàn lại, xài lại bao nhiêu lần cũng được 😚';
    }
  });

  // Ôm anh 1 cái
  const hugBtn = $('#hugBtn');
  const hugCount = $('#hugCount');
  let hugs = 0;
  hugBtn.addEventListener('click', () => {
    hugs++;
    const c = centerOf(hugBtn);
    burst(c.x, c.y, hugs % 10 === 0 ? 50 : 24, hugs % 10 === 0 ? 560 : 400);
    hugBtn.classList.remove('squish');
    void hugBtn.offsetWidth;
    hugBtn.classList.add('squish');
    hugCount.textContent = HUG_MESSAGES[hugs] || `Em đã gửi anh ${hugs} cái ôm 🤗`;
  });

  // Đọc lại từ đầu
  $('#replayBtn').addEventListener('click', () => {
    hugs = 0;
    hugCount.textContent = 'Bấm vào trái tim để gửi anh một cái ôm nha 🤗';
    couponsEl.querySelectorAll('.coupon').forEach((b) => { b.classList.remove('used'); b.setAttribute('aria-pressed', 'false'); });
    couponNote.textContent = '';
    go('start');
  });
})();
