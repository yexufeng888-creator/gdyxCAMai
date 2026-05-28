/* Campus Intelligence — Shared AI Widget + Auth
   Inject the FAB / AI drawer / login modal into any page.
   Usage: <script src="ci-widget.js" defer></script>
*/
(function(){
  if (window.__ciWidgetLoaded) return; window.__ciWidgetLoaded = true;

  const css = `
  .ci-modal-mask{position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,0.65);backdrop-filter:blur(18px);display:none;align-items:center;justify-content:center;animation:ci-fade .3s ease;}
  .ci-modal-mask.show{display:flex;}
  @keyframes ci-fade{from{opacity:0;}to{opacity:1;}}
  .ci-modal{width:min(440px,92vw);background:linear-gradient(160deg,rgba(20,20,30,0.96),rgba(8,8,16,0.96));border:1px solid rgba(255,255,255,0.12);border-radius:24px;padding:40px 36px 32px;box-shadow:0 30px 90px rgba(0,0,0,0.7),0 0 60px rgba(41,151,255,0.18);position:relative;animation:ci-pop .5s cubic-bezier(.2,.8,.2,1);font-family:'Noto Sans SC',sans-serif;color:#fff;}
  @keyframes ci-pop{from{opacity:0;transform:translateY(40px) scale(.95);}to{opacity:1;transform:translateY(0) scale(1);}}
  .ci-modal::before{content:"";position:absolute;inset:-1px;border-radius:24px;padding:1px;background:linear-gradient(135deg,#2997ff,#bf5af2,#32d74b);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:.5;pointer-events:none;}
  .ci-x{position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .2s;}
  .ci-x:hover{background:rgba(255,55,95,0.15);color:#ff5f57;transform:rotate(90deg);}
  .ci-mt{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;background:linear-gradient(135deg,#fff,#a0c4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:6px;}
  .ci-ms{font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:24px;}
  .ci-tabs{display:flex;background:rgba(255,255,255,0.04);border-radius:12px;padding:4px;margin-bottom:24px;}
  .ci-tab{flex:1;padding:10px;border-radius:10px;background:transparent;border:none;color:rgba(255,255,255,0.5);font-size:13px;cursor:pointer;font-family:inherit;transition:all .25s;}
  .ci-tab.active{background:rgba(41,151,255,0.18);color:#a0c4ff;box-shadow:0 2px 10px rgba(41,151,255,0.15);}
  .ci-fr{margin-bottom:14px;}
  .ci-fr label{display:block;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:1px;margin-bottom:6px;text-transform:uppercase;}
  .ci-fr input{width:100%;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#fff;font-family:inherit;font-size:14px;outline:none;transition:all .25s;}
  .ci-fr input:focus{border-color:#2997ff;background:rgba(41,151,255,0.06);box-shadow:0 0 0 4px rgba(41,151,255,0.1);}
  .ci-tip{font-size:11px;color:rgba(255,255,255,0.35);margin-top:6px;}
  .ci-rc{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:14px;}
  .ci-rc a{color:#2997ff;text-decoration:none;}
  .ci-submit{width:100%;padding:14px;border-radius:12px;background:linear-gradient(135deg,#0071e3,#4ba0ff);color:#fff;border:none;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit;margin-top:10px;transition:all .25s;letter-spacing:1px;}
  .ci-submit:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(41,151,255,0.35);}
  .ci-div{display:flex;align-items:center;gap:12px;margin:22px 0 16px;color:rgba(255,255,255,0.3);font-size:11px;}
  .ci-div::before,.ci-div::after{content:"";flex:1;height:1px;background:rgba(255,255,255,0.08);}
  .ci-oa{display:flex;gap:10px;}
  .ci-ob{flex:1;padding:10px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);font-size:12px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s;}
  .ci-ob:hover{background:rgba(255,255,255,0.08);}

  .ci-fab{position:fixed;bottom:28px;right:28px;z-index:1500;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#2997ff,#bf5af2);box-shadow:0 10px 40px rgba(41,151,255,0.45),0 0 0 0 rgba(41,151,255,0.45);display:flex;align-items:center;justify-content:center;color:#fff;font-size:28px;cursor:pointer;border:none;animation:ci-pulse 2.4s ease-in-out infinite;transition:transform .3s;}
  .ci-fab:hover{transform:scale(1.08) rotate(8deg);}
  @keyframes ci-pulse{0%,100%{box-shadow:0 10px 40px rgba(41,151,255,0.45),0 0 0 0 rgba(41,151,255,0.4);}50%{box-shadow:0 10px 40px rgba(41,151,255,0.45),0 0 0 18px rgba(41,151,255,0);}}
  .ci-drawer{position:fixed;bottom:28px;right:28px;z-index:1500;width:min(420px,calc(100vw - 40px));height:min(620px,calc(100vh - 60px));background:linear-gradient(160deg,rgba(15,15,25,0.97),rgba(5,5,15,0.97));border:1px solid rgba(255,255,255,0.12);border-radius:24px;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,0.6),0 0 60px rgba(41,151,255,0.2);display:none;flex-direction:column;animation:ci-slide .35s cubic-bezier(.2,.8,.2,1);font-family:'Noto Sans SC',sans-serif;}
  .ci-drawer.show{display:flex;}
  @keyframes ci-slide{from{opacity:0;transform:scale(.85) translateY(20px);}to{opacity:1;transform:scale(1) translateY(0);}}
  .ci-dh{padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.03);}
  .ci-da{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#0071e3,#bf5af2);display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 20px rgba(41,151,255,0.4);}
  .ci-di{flex:1;}
  .ci-dn{font-size:14px;color:#fff;font-weight:500;}
  .ci-ds{font-size:11px;color:#32d74b;display:flex;align-items:center;gap:5px;}
  .ci-ds::before{content:"";width:6px;height:6px;border-radius:50%;background:#32d74b;box-shadow:0 0 6px #32d74b;}
  .ci-db{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth;}
  .ci-db::-webkit-scrollbar{width:4px;}
  .ci-db::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px;}
  .ci-msg{display:flex;gap:10px;align-items:flex-start;animation:ci-mfade .4s ease both;}
  .ci-msg.user{flex-direction:row-reverse;}
  @keyframes ci-mfade{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
  .ci-mavatar{width:30px;height:30px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px;}
  .ci-mavatar.ai{background:linear-gradient(135deg,#0071e3,#bf5af2);}
  .ci-mavatar.user{background:rgba(255,255,255,0.1);}
  .ci-bubble{max-width:78%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.6;color:rgba(255,255,255,0.85);background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);word-wrap:break-word;white-space:pre-wrap;}
  .ci-msg.user .ci-bubble{background:rgba(41,151,255,0.15);border-color:rgba(41,151,255,0.25);}
  .ci-qp{display:flex;flex-wrap:wrap;gap:6px;padding:0 20px 12px;}
  .ci-qpb{padding:6px 12px;border-radius:999px;font-size:11px;background:rgba(41,151,255,0.08);border:1px solid rgba(41,151,255,0.2);color:rgba(160,196,255,0.9);cursor:pointer;font-family:inherit;transition:all .2s;}
  .ci-qpb:hover{background:rgba(41,151,255,0.18);transform:translateY(-1px);}
  .ci-din{padding:14px 16px;border-top:1px solid rgba(255,255,255,0.08);display:flex;gap:8px;align-items:center;background:rgba(255,255,255,0.02);}
  .ci-din input{flex:1;padding:10px 14px;border-radius:999px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#fff;font-family:inherit;font-size:13px;outline:none;}
  .ci-din input:focus{border-color:#2997ff;}
  .ci-send{width:38px;height:38px;border-radius:50%;border:none;background:linear-gradient(135deg,#0071e3,#4ba0ff);color:#fff;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .2s;}
  .ci-send:hover{transform:scale(1.08);box-shadow:0 6px 20px rgba(41,151,255,0.4);}
  .ci-typing span{display:inline-block;width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.4);margin:0 2px;animation:ci-dot .8s ease-in-out infinite;}
  .ci-typing span:nth-child(2){animation-delay:.15s;}
  .ci-typing span:nth-child(3){animation-delay:.3s;}
  @keyframes ci-dot{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-5px);}}
  .ci-toast{position:fixed;top:80px;left:50%;transform:translateX(-50%) translateY(-20px);background:linear-gradient(135deg,rgba(50,215,75,0.95),rgba(41,151,255,0.95));color:#fff;padding:12px 24px;border-radius:999px;font-size:13px;box-shadow:0 12px 40px rgba(0,0,0,0.4);z-index:3000;opacity:0;pointer-events:none;transition:all .35s cubic-bezier(.2,.8,.2,1);font-family:'Noto Sans SC',sans-serif;}
  .ci-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
  .ci-userchip{display:inline-flex;align-items:center;gap:8px;padding:4px 12px 4px 4px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:999px;cursor:pointer;transition:all .2s;font-family:'Noto Sans SC',sans-serif;}
  .ci-userchip:hover{background:rgba(41,151,255,0.1);border-color:rgba(41,151,255,0.3);}
  .ci-uca{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#0071e3,#bf5af2);display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;}
  .ci-ucn{font-size:12px;color:#fff;}
  .ci-loginbtn{padding:6px 14px;border-radius:999px;font-size:12px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.8);cursor:pointer;font-family:inherit;transition:all .2s;}
  .ci-loginbtn:hover{border-color:#2997ff;color:#2997ff;}
  @media(max-width:520px){.ci-drawer{width:calc(100vw - 24px);right:12px;bottom:12px;height:75vh;}.ci-fab{bottom:18px;right:18px;width:56px;height:56px;font-size:24px;}}
  `;

  const html = `
  <button class="ci-fab" id="ciFab" title="向 Campus AI 提问">💬</button>
  <div class="ci-drawer" id="ciDrawer">
    <div class="ci-dh">
      <div class="ci-da">🎓</div>
      <div class="ci-di">
        <div class="ci-dn">Campus Intelligence</div>
        <div class="ci-ds">ChatGPT 驱动 · 在线</div>
      </div>
      <button class="ci-x" id="ciDrawerX">×</button>
    </div>
    <div class="ci-db" id="ciDB">
      <div class="ci-msg"><div class="ci-mavatar ai">🎓</div><div class="ci-bubble">你好！我是 Campus Intelligence 🎓<br>大连工业大学艺术与信息工程学院的 AI 学习伙伴。<br><br>想聊点什么？写论文、调代码、规划学习都行。</div></div>
    </div>
    <div class="ci-qp">
      <button class="ci-qpb" data-q="帮我润色一段论文摘要">✍️ 论文润色</button>
      <button class="ci-qpb" data-q="讲讲什么是用户体验设计">🎨 设计思维</button>
      <button class="ci-qpb" data-q="用 Python 写一个冒泡排序">💻 写代码</button>
      <button class="ci-qpb" data-q="帮我规划本周学习计划">📅 学习计划</button>
    </div>
    <div class="ci-din">
      <input id="ciInput" type="text" placeholder="向 Campus Intelligence 提问…">
      <button class="ci-send" id="ciSend">↑</button>
    </div>
  </div>

  <div class="ci-modal-mask" id="ciAuth">
    <div class="ci-modal">
      <button class="ci-x" id="ciAuthX">×</button>
      <div class="ci-mt" id="ciAT">欢迎回来</div>
      <div class="ci-ms" id="ciAS">登录以同步你的学习进度与对话记录</div>
      <div class="ci-tabs">
        <button class="ci-tab active" id="ciTL" data-mode="login">登录</button>
        <button class="ci-tab" id="ciTR" data-mode="register">注册</button>
      </div>
      <form id="ciForm">
        <div class="ci-fr" id="ciRN" style="display:none;"><label>昵称</label><input type="text" id="ciFN" placeholder="请输入你的昵称"></div>
        <div class="ci-fr"><label>学号 / 邮箱</label><input type="text" id="ciFE" placeholder="例如 2024xxxx@dlpu.edu.cn" required></div>
        <div class="ci-fr"><label>密码</label><input type="password" id="ciFP" placeholder="至少 6 位" required minlength="6"><div class="ci-tip" id="ciPT">请妥善保管你的登录密码</div></div>
        <div class="ci-rc">
          <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" checked style="width:auto;margin:0;"> 记住我</label>
          <a href="#" id="ciForget">忘记密码?</a>
        </div>
        <button class="ci-submit" type="submit" id="ciSB">登录</button>
      </form>
      <div class="ci-div">或使用</div>
      <div class="ci-oa">
        <button class="ci-ob" data-oauth="校园卡">🎓 校园卡</button>
        <button class="ci-ob" data-oauth="微信">💬 微信</button>
        <button class="ci-ob" data-oauth="教务">📅 教务</button>
      </div>
    </div>
  </div>

  <div class="ci-toast" id="ciToast"></div>
  `;

  function init(){
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    while(wrap.firstChild) document.body.appendChild(wrap.firstChild);

    // ─── AI engine ───
    function smartReply(q){
      const t = q.trim().toLowerCase();
      const has = (...kws) => kws.some(k => t.includes(k));
      if (has('你好','hi','hello','嗨','在吗','您好')) return '你好同学！👋 很高兴见到你。我是 Campus Intelligence，可以帮你写论文、调代码、做设计、规划学习。说说今天想聊什么？';
      if (has('你是谁','介绍自己','你叫什么','what are you','who are you')) return '我是 Campus Intelligence —— 大连工业大学艺术与信息工程学院的专属 AI 助手 🎓\n由 ChatGPT 提供核心智能。你可以把我当成 24 小时在线的学长/学姐～';
      if (has('python','py3')) return '关于 Python，给你一个简单示例：\n\n```python\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n```\n\n时间复杂度 O(n²)。学好 Python，建议从基础语法→数据结构→实战项目三步走 🐍';
      if (has('javascript','js','前端','vue','react')) return '前端学习路线 ✨\n① HTML/CSS 打基础\n② JavaScript ES6+ 进阶\n③ Vue 3 或 React 18 选一深入\n④ Vite + TypeScript 工程化\n\n推荐做一个个人作品集网站把课程作业都展示出来。';
      if (has('排序','算法','数据结构','sort')) return '常见排序对比：\n· 冒泡 O(n²) — 最易理解\n· 快排 O(n log n) — 实战首选\n· 归并 O(n log n) — 稳定排序\n· 堆排 O(n log n) — 优先队列基础\n\n校招至少手撕这四种 💪';
      if (has('论文','摘要','写作','润色','paper','abstract')) return '论文润色我最擅长 ✍️\n好的摘要遵循 IMRaD：\n\n1️⃣ Introduction\n2️⃣ Method\n3️⃣ Results\n4️⃣ Discussion\n\n把你的初稿粘进来，我可以帮你优化表达、强化逻辑、补充量化指标。';
      if (has('设计','ui','ux','配色','交互','figma')) return '艺信学子的设计建议 🎨\n· 配色：60-30-10 法则\n· 字体：最多 2 种字体家族\n· 间距：8 的倍数\n· 反馈：100ms 内有视觉响应\n\n推荐多看 Apple HIG 和 Material You。';
      if (has('计划','规划','学习计划','plan','日程')) {
        const w = ['日','一','二','三','四','五','六'][new Date().getDay()];
        return `好的！基于今天周${w}：\n\n📅 09:00–11:30 · 高难度任务\n☕ 11:30–14:00 · 午休 + 轻输入\n🎨 14:00–17:00 · 动手实践\n🏃 17:00–18:00 · 运动\n📖 19:00–21:00 · 复盘 + 英语\n💤 22:30 前入睡\n\n大脑高效区在上午，把最难的留给那时。`;
      }
      if (has('考试','期末','复习','exam')) return '期末冲刺三步法 📝\n第 1 步 · 框架（1 天）：思维导图梳理\n第 2 步 · 真题（2-3 天）：标高频考点\n第 3 步 · 弱项：每题反复 3 遍\n\n记忆类用 Anki，理解类用费曼讲一遍给自己听。';
      if (has('教务','选课','成绩','jwxt','课表')) return '教务相关：\n📅 课表 → 218.24.183.144:50525/jsxsd\n🎯 选课 → 学期初 2 周\n📊 成绩 → 期末后 2 周\n📝 评教 → 影响下学期选课资格';
      if (has('谢谢','感谢','thanks','3q')) return '不客气～能帮到你就好 😊\n如果还有别的问题随时叫我。';
      if (has('再见','拜拜','bye')) return '再见！记得保持好奇心 🌟\n下次想聊就来找我。';
      if (has('能做什么','功能','help','帮助')) return '我能做这些 🚀\n📝 学术：论文润色、文献综述、查重预检\n💻 编程：示例、调试、算法、面试题\n🎨 设计：配色、版式、UX 评审\n📚 学习：规划、梳理、考试冲刺\n🌐 翻译：中英日韩学术互译';
      if (has('大连工业','艺信','学院','工大','dlpu')) return '大连工业大学艺术与信息工程学院（CAIE）位于大连庄河 🏫\n艺术与工程的交叉是这个学院的精髓——既要会画图，也要会写代码 💪';
      const intros = [`关于"${q}"，从几个维度聊聊：\n\n`,`这个问题挺有意思的，让我拆解一下：\n\n`,`好问题。从工大艺信视角看：\n\n`];
      const bodies = [`🔹 核心：抓主要矛盾，先理清概念\n🔹 实践：做一个最小可行版本（MVP）\n🔹 进阶：暴露问题再迭代\n\n`,`1. 为什么 — 背景与目标\n2. 怎么做 — 方法步骤\n3. 怎么样 — 评估改进\n\n`,`· 知识层：补齐基础概念\n· 工具层：找合适框架\n· 应用层：用项目串起来\n\n`];
      const ends = [`想让我针对哪一点展开？`,`要不要来一份执行清单？`,`告诉我具体场景，我可以更针对。`];
      const pick = a => a[Math.floor(Math.random()*a.length)];
      return pick(intros)+pick(bodies)+pick(ends);
    }
    window.ciSmartReply = smartReply;

    // ─── Toast ───
    const toast = document.getElementById('ciToast');
    function showToast(m){ toast.textContent = m; toast.classList.add('show'); clearTimeout(window.__ciT); window.__ciT = setTimeout(()=>toast.classList.remove('show'),2400); }
    window.ciToast = showToast;

    // ─── AI Drawer ───
    const fab = document.getElementById('ciFab');
    const drawer = document.getElementById('ciDrawer');
    const db = document.getElementById('ciDB');
    const input = document.getElementById('ciInput');
    const sendBtn = document.getElementById('ciSend');
    function openAI(){ drawer.classList.add('show'); fab.style.display='none'; setTimeout(()=>input.focus(),300); }
    function closeAI(){ drawer.classList.remove('show'); fab.style.display='flex'; }
    fab.onclick = openAI;
    document.getElementById('ciDrawerX').onclick = closeAI;
    window.ciOpenAI = openAI;

    async function send(text){
      text = (text||'').trim(); if(!text) return;
      input.value=''; sendBtn.disabled=true;
      const u = document.createElement('div'); u.className='ci-msg user';
      u.innerHTML = `<div class="ci-mavatar user">👤</div><div class="ci-bubble"></div>`;
      u.querySelector('.ci-bubble').textContent = text; db.appendChild(u); db.scrollTop=db.scrollHeight;
      const tp = document.createElement('div'); tp.className='ci-msg';
      tp.innerHTML = `<div class="ci-mavatar ai">🎓</div><div class="ci-bubble"><div class="ci-typing"><span></span><span></span><span></span></div></div>`;
      db.appendChild(tp); db.scrollTop=db.scrollHeight;
      await new Promise(r=>setTimeout(r,800+Math.random()*900));
      tp.remove();
      const a = document.createElement('div'); a.className='ci-msg';
      a.innerHTML = `<div class="ci-mavatar ai">🎓</div><div class="ci-bubble">${smartReply(text).replace(/\n/g,'<br>')}</div>`;
      db.appendChild(a); db.scrollTop=db.scrollHeight;
      sendBtn.disabled=false; input.focus();
    }
    sendBtn.onclick = ()=>send(input.value);
    input.addEventListener('keydown', e => { if(e.key==='Enter') send(input.value); });
    document.querySelectorAll('.ci-qpb').forEach(b => b.onclick = ()=>send(b.dataset.q));

    // ─── Auth ───
    const authMask = document.getElementById('ciAuth');
    let mode = 'login';
    function openAuth(m){ mode = m||'login'; authMask.classList.add('show'); switchAuth(mode); }
    function closeAuth(){ authMask.classList.remove('show'); }
    function switchAuth(m){
      mode = m; const isL = m==='login';
      document.getElementById('ciTL').classList.toggle('active', isL);
      document.getElementById('ciTR').classList.toggle('active', !isL);
      document.getElementById('ciRN').style.display = isL ? 'none' : 'block';
      document.getElementById('ciAT').textContent = isL ? '欢迎回来' : '加入 Campus Intelligence';
      document.getElementById('ciAS').textContent = isL ? '登录以同步你的学习进度与对话记录' : '注册新账号，开启你的智能校园之旅';
      document.getElementById('ciSB').textContent = isL ? '登录' : '创建账号';
      document.getElementById('ciPT').textContent = isL ? '请妥善保管你的登录密码' : '至少 6 位，建议字母+数字组合';
    }
    window.ciOpenAuth = openAuth;
    document.getElementById('ciAuthX').onclick = closeAuth;
    authMask.addEventListener('click', e => { if(e.target===authMask) closeAuth(); });
    document.getElementById('ciTL').onclick = ()=>switchAuth('login');
    document.getElementById('ciTR').onclick = ()=>switchAuth('register');
    document.getElementById('ciForget').onclick = e => { e.preventDefault(); showToast('请联系学院管理员重置密码'); };
    document.getElementById('ciForm').addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('ciFE').value.trim();
      const name = document.getElementById('ciFN').value.trim() || email.split('@')[0];
      if (mode==='register' && !name) { showToast('请填写昵称'); return; }
      try { localStorage.setItem('ci_user', JSON.stringify({name,email,ts:Date.now()})); } catch(_){}
      closeAuth(); refreshAuthMount();
      showToast(mode==='login' ? `欢迎回来，${name} 👋` : `注册成功，${name}！`);
    });
    document.querySelectorAll('.ci-ob').forEach(b => b.onclick = ()=>{
      const p = b.dataset.oauth;
      try { localStorage.setItem('ci_user', JSON.stringify({name:p+'同学',email:p.toLowerCase()+'@dlpu.edu.cn',via:p,ts:Date.now()})); } catch(_){}
      closeAuth(); refreshAuthMount();
      showToast(`已通过 ${p} 登录 ✨`);
    });
    function logout(){ try{localStorage.removeItem('ci_user');}catch(_){}; refreshAuthMount(); showToast('已退出登录'); }
    window.ciLogout = logout;

    // Mount auth chip into [data-ci-auth] containers
    function refreshAuthMount(){
      const slots = document.querySelectorAll('[data-ci-auth]');
      let user=null; try{user=JSON.parse(localStorage.getItem('ci_user')||'null');}catch(_){}
      slots.forEach(s => {
        if (user && user.name) {
          const ini = user.name.charAt(0).toUpperCase();
          s.innerHTML = `<div class="ci-userchip" onclick="ciLogout()" title="点击退出"><div class="ci-uca">${ini}</div><div class="ci-ucn">${user.name}</div></div>`;
        } else {
          s.innerHTML = `<button class="ci-loginbtn" onclick="ciOpenAuth('login')">登录</button> <button class="ci-loginbtn" onclick="ciOpenAuth('register')" style="background:#0071e3;color:#fff;border-color:#0071e3;">注册</button>`;
        }
      });
    }
    window.ciRefreshAuth = refreshAuthMount;
    refreshAuthMount();

    document.addEventListener('keydown', e => {
      if (e.key==='Escape') { closeAuth(); if (drawer.classList.contains('show')) closeAI(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
