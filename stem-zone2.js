/* CAREERVERSE — ZONE 2 STEM ADVENTURE QUEST
   Five playable STEM worlds. Progress is saved in this browser. */
(()=>{
  if(document.getElementById('stemZone2')) return;
  const worlds=[
    {id:'math',icon:'🧮',name:'MATEMATIK',sub:'Math Code Breaker',brief:'Stesen kawalan terkunci. Selesaikan tiga masalah nombor untuk mendapatkan kod akses.',q:[
      ['Sebuah rover bergerak 18 meter setiap minit. Berapa meter dalam 4 minit?',['22 m','72 m','64 m'],1,'18 × 4 = 72 meter.'],
      ['Bateri mempunyai 80% tenaga. Rover menggunakan 25% daripada kapasiti penuh. Berapa peratus baki?',['55%','65%','45%'],0,'80% − 25% = 55%.'],
      ['Cari nombor seterusnya: 3, 6, 12, 24, ...',['30','36','48'],2,'Setiap nombor didarab 2. Jawapannya 48.']
    ],game:'code'},
    {id:'science',icon:'🧪',name:'SAINS',sub:'Science Lab Rescue',brief:'Eksperimen makmal terganggu. Susun tindakan saintifik yang betul dan kenal pasti pemboleh ubah.',q:[
      ['Apakah langkah pertama sebelum eksperimen makmal?',['Membaca arahan dan memakai PPE','Mencampurkan semua bahan','Menghidu bahan'],0,'Keselamatan dan arahan perlu diperiksa dahulu.'],
      ['Dalam eksperimen kesan cahaya terhadap pertumbuhan tumbuhan, apakah pemboleh ubah dimanipulasikan?',['Jenis tanah','Keamatan cahaya','Ketinggian tumbuhan'],1,'Keamatan cahaya ialah faktor yang sengaja diubah.'],
      ['Mengapakah eksperimen perlu diulang?',['Untuk mengubah keputusan','Untuk meningkatkan kebolehpercayaan data','Untuk menjimatkan masa'],1,'Ulangan membantu mengurangkan ralat dan meningkatkan kebolehpercayaan.']
    ],game:'lab'},
    {id:'robot',icon:'🤖',name:'ROBOTIK',sub:'Robot Assembly & Coding',brief:'Robot penyelamat belum berfungsi. Pasang komponen dan susun arahan supaya robot sampai ke sasaran.',q:[
      ['Komponen manakah membekalkan tenaga kepada robot?',['Sensor','Bateri','Roda'],1,'Bateri membekalkan tenaga elektrik.'],
      ['Susun arahan logik untuk robot bergerak ke hadapan 3 petak.',['Maju, maju, maju','Pusing, berhenti, undur','Berhenti, maju, pusing'],0,'Tiga arahan maju membawa robot tiga petak ke hadapan.'],
      ['Apakah fungsi sensor ultrasonik?',['Mengukur jarak objek','Menyimpan tenaga','Menghasilkan bunyi muzik'],0,'Sensor ultrasonik mengesan objek dan mengukur jarak.']
    ],game:'robot'},
    {id:'energy',icon:'⚡',name:'ENERGY CITY',sub:'Power the Future City',brief:'Bandar mengalami gangguan elektrik. Pilih sumber tenaga bersih dan agihkan kuasa kepada kemudahan penting.',q:[
      ['Sumber tenaga manakah boleh diperbaharui?',['Arang batu','Diesel','Cahaya matahari'],2,'Tenaga solar diperoleh daripada cahaya matahari.'],
      ['Panel solar menghasilkan 40 unit tenaga dan turbin angin 35 unit. Jumlah tenaga?',['65 unit','75 unit','85 unit'],1,'40 + 35 = 75 unit tenaga.'],
      ['Bandar memerlukan 60 unit. Anda mempunyai 75 unit. Berapa lebihan?',['15 unit','25 unit','10 unit'],0,'75 − 60 = 15 unit lebihan.']
    ],game:'energy'},
    {id:'space',icon:'🚀',name:'MISI ANGKASA',sub:'Space Rescue Mission',brief:'Kapal angkasa perlu sampai ke stesen penyelamat. Selesaikan navigasi, pengiraan bahan api dan misi kru.',q:[
      ['Kapal bergerak 12 km sesaat selama 5 saat. Jarak perjalanan?',['50 km','60 km','72 km'],1,'12 × 5 = 60 km.'],
      ['Kapal mempunyai 90 unit bahan api. Perjalanan pertama menggunakan 35 unit. Baki?',['55 unit','65 unit','45 unit'],0,'90 − 35 = 55 unit.'],
      ['Apakah tindakan paling sesuai apabila amaran oksigen kru menyala?',['Teruskan perjalanan tanpa pemeriksaan','Semak sistem oksigen dan utamakan keselamatan kru','Matikan semua komunikasi'],1,'Keselamatan kru mesti diutamakan.']
    ],game:'space'}
  ];
  const key='careerverse-zone2-stem-v1';
  let saved={done:[],xp:0};try{saved=Object.assign(saved,JSON.parse(localStorage.getItem(key)||'{}'));}catch(e){}
  let active=null,index=0,score=0,phase='brief',robotSteps=[],energyPick=[];
  const css=`
  #stemZone2{margin:34px 0;scroll-margin-top:90px}
  #stemZone2 .sz-hero{padding:26px;border:1px solid #ffffff26;border-radius:22px;background:radial-gradient(circle at 85% 10%,#3c4684,transparent 38%),linear-gradient(135deg,#10264b,#171633);display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center}
  #stemZone2 .sz-kicker{color:#59e5f2;font-size:11px;font-weight:900;letter-spacing:.18em}
  #stemZone2 h2{font-size:clamp(26px,4vw,40px);margin:7px 0}
  #stemZone2 p{color:#afbddc}
  #stemZone2 .sz-orb{font-size:75px;padding:22px;border-radius:22px;background:linear-gradient(145deg,#315b91,#543b81);box-shadow:0 12px 40px #0006}
  #stemZone2 .sz-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin:16px 0}
  #stemZone2 .sz-card{background:linear-gradient(145deg,#172447,#101a35);border:1px solid #ffffff24;border-radius:16px;padding:15px;min-width:0}
  #stemZone2 .sz-icon{font-size:35px}
  #stemZone2 .sz-card h3{font-size:14px;margin:8px 0 3px}
  #stemZone2 .sz-card p{font-size:11px;min-height:34px;margin:0 0 12px}
  #stemZone2 .sz-pill{font-size:10px;color:#ffd477}
  #stemZone2 button{cursor:pointer;border:1px solid #ffffff28;border-radius:10px;padding:10px 13px;font-weight:800}
  #stemZone2 .sz-btn{background:linear-gradient(100deg,#59e5f2,#a58bff);color:#091329}
  #stemZone2 .sz-ghost{background:#ffffff0c;color:#fff}
  #stemZone2 .sz-card button{width:100%}
  #stemZone2 .sz-meter{height:9px;background:#ffffff18;border-radius:20px;overflow:hidden}
  #stemZone2 .sz-meter i{display:block;height:100%;background:linear-gradient(90deg,#59e5f2,#a58bff);width:0}
  #stemZone2 .sz-modal{position:fixed;inset:0;z-index:150;background:#020615ed;display:none;place-items:center;padding:14px}
  #stemZone2 .sz-modal.open{display:grid}
  #stemZone2 .sz-box{width:min(760px,100%);max-height:92vh;overflow:auto;background:#101a35;border:1px solid #ffffff35;border-radius:22px;padding:22px}
  #stemZone2 .sz-top{display:flex;justify-content:space-between;align-items:center;gap:12px}
  #stemZone2 .sz-task{background:#172447;border:1px solid #ffffff20;border-radius:14px;padding:17px;margin:14px 0}
  #stemZone2 .sz-choices{display:grid;gap:9px;margin:14px 0}
  #stemZone2 .sz-choice{background:#20345b;color:white;text-align:left}
  #stemZone2 .sz-choice:hover{border-color:#59e5f2}
  #stemZone2 .sz-feedback{padding:12px;background:#123b38;border:1px solid #58d7b477;border-radius:12px;color:#d5fff0;margin:12px 0}
  #stemZone2 .sz-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:15px}
  #stemZone2 .sz-gameboard{display:flex;gap:8px;justify-content:center;align-items:center;min-height:90px;background:#0b1430;border-radius:12px;padding:12px;margin:12px 0}
  #stemZone2 .sz-tile{background:#284a78;border:1px solid #78e9ff;border-radius:8px;padding:13px;color:white;font-weight:900}
  #stemZone2 .sz-muted{font-size:12px;color:#afbddc}
  @media(max-width:900px){#stemZone2 .sz-grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:560px){#stemZone2 .sz-hero{grid-template-columns:1fr}#stemZone2 .sz-orb{display:none}#stemZone2 .sz-grid{grid-template-columns:1fr}#stemZone2 .sz-box{padding:15px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
  const section=document.createElement('section');section.id='stemZone2';section.className='section';
  section.innerHTML=`
    <div class="section-head"><div class="eyebrow">ZONE 2 · STEM ADVENTURE QUEST</div><h2>Explore. Play. Solve the Problem.</h2><p>Masuk ke setiap dunia, jawab soalan dan selesaikan permainan untuk menamatkan misi.</p></div>
    <div class="sz-hero"><div><div class="sz-kicker">FIVE WORLDS · FIVE MISSIONS</div><h2>🧠 STEM ADVENTURE QUEST</h2><p>Setiap zon mempunyai Mission Briefing, cabaran soalan dan permainan mini yang berbeza. Kumpul XP dan lengkapkan kelima-lima misi!</p><div class="sz-muted">PROGRESS SAVED AUTOMATICALLY · +100 XP PER ZONE</div></div><div class="sz-orb">🌌</div></div>
    <div class="sz-grid" id="szGrid"></div>
    <div class="panel"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><b>🏆 ZONE 2 PLAYER PROGRESS</b><b id="szStats">0 / 5 ZONES · 0 XP</b></div><div class="sz-meter" style="margin-top:12px"><i id="szBar"></i></div></div>
    <div class="sz-modal" id="szModal" role="dialog" aria-modal="true"><div class="sz-box"><div class="sz-top"><div><div class="sz-kicker" id="szKicker">MISSION BRIEFING</div><h2 id="szTitle">Mission</h2></div><button class="sz-ghost" id="szClose">✕ Close</button></div><div id="szBody"></div></div></div>`;
  const anchor=document.getElementById('games')||document.querySelector('main');
  if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(section,anchor.nextSibling);else document.body.appendChild(section);
  const $=id=>section.querySelector('#'+id);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function save(){localStorage.setItem(key,JSON.stringify(saved));render();}
  function render(){ $('szGrid').innerHTML=worlds.map(w=>'<article class="sz-card"><div class="sz-icon">'+w.icon+'</div><div class="sz-pill">'+(saved.done.includes(w.id)?'✓ MISSION COMPLETE':'100 XP REWARD')+'</div><h3>'+w.name+'</h3><p>'+w.sub+'</p><button class="sz-btn" data-world="'+w.id+'">'+(saved.done.includes(w.id)?'PLAY AGAIN ↻':'ENTER ZONE →')+'</button></article>').join('');$('szStats').textContent=saved.done.length+' / 5 ZONES · '+saved.xp+' XP';$('szBar').style.width=(saved.done.length*20)+'%';}
  function show(html){$('szBody').innerHTML=html;}
  function open(id){active=worlds.find(w=>w.id===id);index=0;score=0;phase='brief';robotSteps=[];energyPick=[];$('szTitle').textContent=active.name+' · '+active.sub;$('szModal').classList.add('open');brief();}
  function brief(){ $('szKicker').textContent='MISSION BRIEFING';show('<div class="sz-task"><div class="sz-kicker">PROBLEM ALERT</div><p>'+esc(active.brief)+'</p><p class="sz-muted">OBJECTIVE: Jawab 3 soalan dan lengkapkan permainan mini untuk memperoleh 100 XP.</p></div><div class="sz-actions"><button class="sz-btn" data-act="how">HOW TO PLAY →</button><button class="sz-ghost" data-act="close">BACK TO ZONES</button></div>');}
  function how(){ $('szKicker').textContent='HOW TO PLAY';show('<div class="sz-task"><h3>Peraturan Misi</h3><ol><li>Baca soalan dan pilih jawapan yang betul.</li><li>Jawapan betul membuka satu bahagian permainan.</li><li>Selesaikan permainan mini untuk menamatkan misi.</li><li>Anda boleh cuba semula jika tersilap.</li></ol><p class="sz-muted">Setiap zon memberi 100 XP apabila berjaya diselesaikan.</p></div><button class="sz-btn" data-act="start">START GAME ▶</button>');}
  function question(){const q=active.q[index];$('szKicker').textContent='CHALLENGE '+(index+1)+' / 3';show('<div class="sz-meter"><i style="width:'+((index)/3*100)+'%"></i></div><div class="sz-task"><div class="sz-muted">MISSION QUESTION</div><h3>'+esc(q[0])+'</h3><div class="sz-choices">'+q[1].map((v,i)=>'<button class="sz-choice" data-answer="'+i+'">'+esc(v)+'</button>').join('')+'</div><div id="szFeedback"></div></div><div class="sz-muted">SCORE: '+score+' / '+(index)+'</div>');}
  function answer(n){const q=active.q[index];if(n===q[2]){score++;$('szFeedback').innerHTML='<div class="sz-feedback">✓ Betul! '+esc(q[3])+'</div><button class="sz-btn" data-act="next">'+(index===2?'OPEN MINI-GAME →':'NEXT QUESTION →')+'</button>';}else{$('szFeedback').innerHTML='<div class="sz-feedback" style="background:#48252d;color:#ffe0e0">Belum tepat. Cuba lagi dan fikirkan petunjuk dalam soalan.</div>';}}
  function next(){index++;if(index<3)question();else miniGame();}
  function miniGame(){
    $('szKicker').textContent='MINI-GAME · '+active.name;
    if(active.game==='code')show('<div class="sz-task"><h3>🔐 Crack the Access Code</h3><p>Masukkan kod 3 digit berdasarkan jawapan cabaran tadi. Kod: <b>7 – 2 – 4</b></p><div class="sz-gameboard"><span class="sz-tile">7</span><span class="sz-tile">2</span><span class="sz-tile">4</span></div><p class="sz-muted">Taip kod untuk membuka pintu kawalan.</p><input id="szInput" class="field" inputmode="numeric" maxlength="3" placeholder="Masukkan kod 3 digit"><button class="sz-btn" data-act="checkcode">UNLOCK DOOR</button><div id="szFeedback"></div></div>');
    else if(active.game==='lab')show('<div class="sz-task"><h3>🧫 Arrange the Experiment</h3><p>Pilih urutan eksperimen yang selamat dan teratur.</p><div class="sz-choices"><button class="sz-choice" data-order="2">A. Rekod pemerhatian</button><button class="sz-choice" data-order="0">B. Baca arahan dan pakai PPE</button><button class="sz-choice" data-order="1">C. Jalankan eksperimen</button></div><p class="sz-muted">Klik mengikut urutan yang betul: keselamatan → eksperimen → pemerhatian.</p><div id="szFeedback"></div></div>');
    else if(active.game==='robot')show('<div class="sz-task"><h3>🤖 Program the Rescue Robot</h3><p>Susun arahan robot supaya bergerak ke sasaran. Pilih arahan mengikut turutan.</p><div class="sz-gameboard" id="szSequence"><span class="sz-muted">Arahan anda akan muncul di sini</span></div><div class="sz-actions"><button class="sz-ghost" data-step="FORWARD">⬆ FORWARD</button><button class="sz-ghost" data-step="LEFT">⬅ TURN LEFT</button><button class="sz-ghost" data-step="RIGHT">TURN RIGHT ➡</button><button class="sz-ghost" data-step="FORWARD">⬆ FORWARD</button></div><p class="sz-muted">Misi: FORWARD → RIGHT → FORWARD</p><button class="sz-btn" data-act="runrobot">RUN ROBOT ▶</button><div id="szFeedback"></div></div>');
    else if(active.game==='energy')show('<div class="sz-task"><h3>⚡ Restore Energy to the City</h3><p>Aktifkan sekurang-kurangnya dua sumber tenaga boleh diperbaharui untuk membekalkan kuasa bandar.</p><div class="sz-choices"><button class="sz-choice" data-energy="solar">☀️ Solar Panel · 40 units</button><button class="sz-choice" data-energy="wind">🌬️ Wind Turbine · 35 units</button><button class="sz-choice" data-energy="coal">🪨 Coal Plant · 50 units</button></div><p class="sz-muted">Sasaran: 60 unit tenaga bersih. Pilih solar dan/atau angin.</p><div id="szFeedback"></div><button class="sz-btn" data-act="powercity">POWER THE CITY</button></div>');
    else show('<div class="sz-task"><h3>🚀 Navigate to the Rescue Station</h3><p>Pilih laluan kapal angkasa yang selamat. Elakkan asteroid dan pastikan kru tiba ke stesen.</p><div class="sz-choices"><button class="sz-choice" data-route="asteroid">A. Laluan terus melalui medan asteroid</button><button class="sz-choice" data-route="safe">B. Laluan orbit selamat melalui stesen navigasi</button><button class="sz-choice" data-route="lost">C. Matikan sistem navigasi</button></div><div id="szFeedback"></div></div>');
  }
  function finish(){if(!saved.done.includes(active.id)){saved.done.push(active.id);saved.xp+=100;save();}$('szKicker').textContent='MISSION COMPLETED';show('<div class="sz-task" style="text-align:center"><div style="font-size:60px">🏆</div><h2>MISSION COMPLETED!</h2><p>Hebat! Anda berjaya menyelesaikan '+esc(active.name)+'.</p><h2 style="color:#ffd477">+100 XP</h2><p class="sz-muted">Kemajuan disimpan secara automatik pada peranti ini.</p></div><div class="sz-actions"><button class="sz-btn" data-act="close">BACK TO ZONE 2</button><button class="sz-ghost" data-act="nextzone">CHOOSE ANOTHER ZONE</button></div>');}
  section.addEventListener('click',e=>{
    const w=e.target.closest('[data-world]');if(w){open(w.dataset.world);return;}
    const a=e.target.closest('[data-act]');if(a){const act=a.dataset.act;if(act==='close'){$('szModal').classList.remove('open');return;}if(act==='how'){how();return;}if(act==='start'){index=0;score=0;question();return;}if(act==='next'){next();return;}if(act==='checkcode'){const v=$('szInput').value.trim();if(v==='724')finish();else $('szFeedback').innerHTML='<div class="sz-feedback">Kod salah. Semak semula petunjuk dan cuba lagi.</div>';return;}if(act==='runrobot'){if(robotSteps.join(',')==='FORWARD,RIGHT,FORWARD')finish();else $('szFeedback').innerHTML='<div class="sz-feedback">Robot belum sampai ke sasaran. Susun semula arahan.</div>';return;}if(act==='powercity'){const total=(energyPick.includes('solar')?40:0)+(energyPick.includes('wind')?35:0);if(total>=60)finish();else $('szFeedback').innerHTML='<div class="sz-feedback">Tenaga belum mencukupi atau bukan sumber boleh diperbaharui. Pilih solar + angin.</div>';return;}if(act==='nextzone'){brief();return;}}
    const ans=e.target.closest('[data-answer]');if(ans){answer(Number(ans.dataset.answer));return;}
    const order=e.target.closest('[data-order]');if(order){const n=Number(order.dataset.order);const expected=[0,1,2];const clicked=section.querySelectorAll('[data-order].picked').length;if(n===expected[clicked]){order.classList.add('picked');order.disabled=true;if(clicked===2)finish();}else $('szFeedback').innerHTML='<div class="sz-feedback">Urutan belum betul. Mulakan dengan langkah keselamatan.</div>';return;}
    const step=e.target.closest('[data-step]');if(step){robotSteps.push(step.dataset.step);$('szSequence').innerHTML=robotSteps.map(s=>'<span class="sz-tile">'+s+'</span>').join('');return;}
    const en=e.target.closest('[data-energy]');if(en){const v=en.dataset.energy;if(energyPick.includes(v))energyPick=energyPick.filter(x=>x!==v);else energyPick.push(v);en.style.borderColor=energyPick.includes(v)?'#59e5f2':'#ffffff28';return;}
    const route=e.target.closest('[data-route]');if(route){if(route.dataset.route==='safe')finish();else $('szFeedback').innerHTML='<div class="sz-feedback">Laluan berisiko! Pilih laluan yang mengutamakan keselamatan kru.</div>';}
  });
  $('szClose').addEventListener('click',()=>$('szModal').classList.remove('open'));
  render();
})();