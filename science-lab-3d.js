/* CAREERVERSE — full interactive 3D Science Lab simulations.
   Three.js scenes are loaded on demand. Each mission has an explorable 3D apparatus and playable objective. */
(function(){
 const THREE_URL='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
 let threePromise=null,active=null;
 function loadThree(){
  if(window.THREE)return Promise.resolve(window.THREE);
  if(threePromise)return threePromise;
  threePromise=new Promise((resolve,reject)=>{
   const s=document.createElement('script');s.src=THREE_URL;s.onload=()=>window.THREE?resolve(window.THREE):reject(new Error('Three.js failed to initialise'));s.onerror=()=>reject(new Error('Unable to load 3D engine'));document.head.appendChild(s);
  });return threePromise;
 }
 const css=`
 .sl3d-wrap{border:1px solid #ffffff28;border-radius:17px;overflow:hidden;background:#080f24}
 .sl3d-head{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:12px 14px;background:linear-gradient(90deg,#172b50,#25204b)}
 .sl3d-stage{height:350px;position:relative;background:radial-gradient(circle at 50% 20%,#294d79,#0b1430 72%);overflow:hidden}
 .sl3d-stage canvas{display:block;width:100%;height:100%}
 .sl3d-hint{position:absolute;left:12px;bottom:12px;padding:7px 10px;border-radius:9px;background:#071329d9;border:1px solid #ffffff35;color:#d8eaff;font-size:11px;pointer-events:none}
 .sl3d-hud{display:flex;flex-wrap:wrap;gap:8px;padding:12px;background:#111d3b}
 .sl3d-hud button{border:1px solid #ffffff35;border-radius:10px;background:#20365e;color:#fff;padding:9px 12px;font-weight:750;cursor:pointer}
 .sl3d-hud button.primary{background:linear-gradient(100deg,#59e5f2,#a5a0ff);color:#091329;border:0}
 .sl3d-hud button:disabled{opacity:.4;cursor:not-allowed}
 .sl3d-status{padding:11px 14px;background:#0c1731;color:#c5d7f5;font-size:13px;min-height:44px}
 .sl3d-meter{height:7px;background:#ffffff18;border-radius:20px;overflow:hidden;margin-top:7px}
 .sl3d-meter i{display:block;height:100%;background:linear-gradient(90deg,#59e5f2,#a58bff);width:0;transition:width .25s}
 .sl3d-select{background:#0b1430;color:#fff;border:1px solid #ffffff35;border-radius:9px;padding:8px;max-width:100%}
 .sl3d-wrap .sl-small{padding:0 13px 10px}
 @media(max-width:600px){.sl3d-stage{height:280px}.sl3d-hud button{font-size:12px;padding:8px 9px}}
 `;
 if(!document.getElementById('sl3d-css')){const st=document.createElement('style');st.id='sl3d-css';st.textContent=css;document.head.appendChild(st);}
 const mat=(T,color,rough=.55,metal=0)=>new T.MeshStandardMaterial({color,roughness:rough,metalness:metal});
 function makeScene(T,host,kind){
  const scene=new T.Scene();scene.background=new T.Color(0x0a1530);scene.fog=new T.Fog(0x0a1530,13,34);
  const camera=new T.PerspectiveCamera(42,1,.1,100);camera.position.set(7,6,9);camera.lookAt(0,1,0);
  const renderer=new T.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputEncoding=T.sRGBEncoding;renderer.setSize(host.clientWidth,host.clientHeight);host.appendChild(renderer.domElement);
  scene.add(new T.HemisphereLight(0xa9d9ff,0x17203d,1.05));
  const key=new T.DirectionalLight(0xffffff,1.4);key.position.set(5,10,6);key.castShadow=true;scene.add(key);
  const cyan=new T.PointLight(0x35dfff,1.4,18);cyan.position.set(-4,3,2);scene.add(cyan);
  const violet=new T.PointLight(0x9b66ff,1.1,16);violet.position.set(4,3,-4);scene.add(violet);
  const floor=new T.Mesh(new T.PlaneGeometry(30,30),mat(T,0x142341,.9));floor.rotation.x=-Math.PI/2;floor.position.y=-.04;floor.receiveShadow=true;scene.add(floor);
  const grid=new T.GridHelper(30,30,0x39749a,0x26375b);grid.position.y=-.025;scene.add(grid);
  function box(w,h,d,color,x,y,z,metal=0){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat(T,color,.42,metal));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;}
  function cylinder(rt,rb,h,color,x,y,z,segments=32){const m=new T.Mesh(new T.CylinderGeometry(rt,rb,h,segments),mat(T,color,.32,.12));m.position.set(x,y,z);m.castShadow=true;scene.add(m);return m;}
  function sphere(r,color,x,y,z){const m=new T.Mesh(new T.SphereGeometry(r,28,20),mat(T,color,.28,.1));m.position.set(x,y,z);m.castShadow=true;scene.add(m);return m;}
  // Laboratory furniture, wall panels and overhead light strips create a shared, coherent 3D room.
  box(12,.18,2.1,0x253b60,0,1,-3.7,.25);box(12,.18,2.1,0x253b60,0,1,3.7,.25);
  box(.12,2.5,9,0x1a3153,-5.8,1.2,0);box(.12,2.5,9,0x1a3153,5.8,1.2,0);
  for(let i=0;i<5;i++){const lamp=box(1.7,.035,.12,0x57eaff,-4+i*2,4.4,-2.8,.2);lamp.material.emissive=new T.Color(0x1b9ac8);lamp.material.emissiveIntensity=.8;}
  const table=box(5,.25,2.1,0x526986,0,.95,0,.25);box(5,.16,2.1,0x1a2944,0,.72,0,.15);
  for(const x of [-2.2,2.2])for(const z of [-.8,.8])box(.16,.75,.16,0x344d70,x,.32,z,.3);
  const clickable=[];
  function click(mesh,fn){mesh.userData.action=fn;clickable.push(mesh);return mesh;}
  let down=null,dragging=false;
  const ray=new T.Raycaster(),pointer=new T.Vector2();
  renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
  renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>8)return;const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(clickable,false);if(hits.length&&hits[0].object.userData.action)hits[0].object.userData.action();});
  let frame=0,raf=0,disposed=false;
  function resize(){if(disposed)return;const w=host.clientWidth||1,h=host.clientHeight||1;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);}
  const ro=new ResizeObserver(resize);ro.observe(host);
  function render(){if(disposed)return;raf=requestAnimationFrame(render);frame+=.016;scene.traverse(o=>{if(o.userData.spin)o.rotation.y+=.01;if(o.userData.float)o.position.y=o.userData.baseY+Math.sin(frame*2+o.position.x)*.06;});renderer.render(scene,camera);}
  render();
  function dispose(){disposed=true;cancelAnimationFrame(raf);ro.disconnect();renderer.dispose();scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();}});host.innerHTML='';}
  return {scene,camera,renderer,box,cylinder,sphere,click,dispose,materials:mat(T),T};
 }
 function build(game,host,ui,onComplete){
  const T=window.THREE,ctx=makeScene(T,host,game.id),{scene,camera,renderer,box,cylinder,sphere,click}=ctx;
  const status=ui.querySelector('[data-status]'),meter=ui.querySelector('[data-meter] i'),hud=ui.querySelector('[data-hud]');
  let progress=0,finished=false,anim=null;
  function say(s){status.textContent=s;}
  function setProgress(n){progress=Math.max(progress,n);meter.style.width=(progress*100)+'%';}
  function done(message){if(finished)return;finished=true;setProgress(1);say(message+' Misi selesai! Tekan COMPLETE MISSION untuk merekod XP.');onComplete();}
  const base=box(2.2,.12,1.25,0x2e507a,0,1.25,0,.25);
  if(game.id==='chem'){
   say('Pilih tiga reagen di atas meja, kemudian tekan MIX. Perhatikan perubahan warna dalam bikar.');
   const beakers=[];
   [0x36c9ff,0xe879f9,0xf7c65b].forEach((c,i)=>{const x=-1.5+i*1.5;const glass=new T.Mesh(new T.CylinderGeometry(.32,.26,.85,32,1,true),new T.MeshPhysicalMaterial({color:0xb9f5ff,transparent:true,opacity:.25,roughness:.1,metalness:.1,side:T.DoubleSide}));glass.position.set(x,1.85,0);glass.castShadow=true;scene.add(glass);const liquid=cylinder(.255,.255,.36,c,x,1.55,0);liquid.material.transparent=true;liquid.material.opacity=.78;beakers.push({glass,liquid,selected:false});click(glass,()=>{beakers[i].selected=!beakers[i].selected;glass.material.opacity=beakers[i].selected?.65:.25;glass.material.color.set(beakers[i].selected?0x69f4ff:0xb9f5ff);say('Reagen dipilih: '+beakers.filter(b=>b.selected).length+' / 3. Pilih semua reagen.');setProgress(beakers.filter(b=>b.selected).length/4);});});
   cylinder(.06,.06,.7,0xddefff,0,2.1,-.85);const rack=box(4,.1,.2,0x253d61,0,1.35,.65);
   const mix=document.createElement('button');mix.className='primary';mix.textContent='🧪 MIX REAGENTS';mix.onclick=()=>{if(beakers.some(b=>!b.selected)){say('Pilih ketiga-tiga reagen dahulu.');return;}beakers.forEach((b,i)=>{b.liquid.material.color.set([0x9d6bff,0x40e4c0,0xffc45d][i]);b.liquid.scale.y=1.3;});const glow=sphere(.24,0x73fff0,0,2.15,0);glow.userData.float=true;glow.userData.baseY=2.15;setProgress(1);say('Simulasi tindak balas selesai. Perhatikan perubahan warna. Apakah langkah keselamatan paling penting?');const q=document.createElement('select');q.className='sl3d-select';q.innerHTML='<option value="">Pilih jawapan…</option><option value="1">Memakai gogal dan mengikut arahan</option><option value="0">Menghidu bahan secara terus</option><option value="0">Mencampur bahan secara rawak</option>';q.onchange=()=>{if(q.value==='1')done('Tepat! Keselamatan makmal diutamakan.');else say('Cuba lagi. Fikirkan keselamatan makmal.');};hud.appendChild(q);};hud.appendChild(mix);
   say('Klik setiap bikar 3D untuk memilih reagen. Kemudian tekan MIX REAGENTS.');
  }else if(game.id==='physics'){
   const ramp=box(4,.22,1.1,0x647eaa,0,1.15,-.15);ramp.rotation.z=-.19;
   for(let i=0;i<5;i++)box(.12,.45,.12,0x42d9ee,-1.6+i*.8,.48,1.15);
   const ball=sphere(.32,0xffb44e,-1.7,1.75,-.15);let launched=false;
   const slider=document.createElement('input');slider.type='range';slider.min='10';slider.max='100';slider.value='50';slider.style.width='140px';
   const label=document.createElement('span');label.textContent='Force 50%';slider.oninput=()=>label.textContent='Force '+slider.value+'%';
   const launch=document.createElement('button');launch.className='primary';launch.textContent='🚀 LAUNCH';launch.onclick=()=>{if(launched)return;launched=true;const distance=Number(slider.value)/100*4.8;const start=performance.now();function move(t){const p=Math.min(1,(t-start)/1100);ball.position.x=-1.7+distance*p;ball.position.y=1.75+Math.sin(p*Math.PI)*.65;ball.rotation.z=p*8;if(p<1)requestAnimationFrame(move);else{say('Bola bergerak sejauh '+distance.toFixed(1)+' unit maya. Sekarang jawab soalan fizik.');setProgress(.65);const q=document.createElement('select');q.className='sl3d-select';q.innerHTML='<option value="">Pilih jawapan…</option><option value="1">Daya lebih besar menghasilkan pecutan lebih besar (jisim sama)</option><option value="0">Objek hilang jisim</option><option value="0">Graviti berhenti bertindak</option>';q.onchange=()=>q.value==='1'?done('Betul! Anda memahami hubungan daya dan pecutan.'):say('Belum tepat. Cuba fikirkan Hukum Kedua Newton.');hud.appendChild(q);}}move(start);};
   hud.append(slider,label,launch);say('Laraskan daya dan tekan LAUNCH. Perhatikan bola bergerak di atas landasan 3D.');
  }else if(game.id==='build'){
   const blocks=[];const palette=[0x55dce9,0x9a82ff,0xffb65c,0x5cdbad];
   const add=document.createElement('button');add.className='primary';add.textContent='＋ ADD BLOCK';add.onclick=()=>{if(blocks.length>=8)return;const i=blocks.length,x=-1.45+(i%4)*.95,y=1.45+Math.floor(i/4)*.48;const b=box(.88,.42,.55,palette[i%palette.length],x,y,.05,.18);blocks.push(b);say('Blok '+blocks.length+' ditambah. Bina sekurang-kurangnya 5 blok sebelum ujian beban.');setProgress(Math.min(.7,blocks.length/7));};
   const test=document.createElement('button');test.textContent='⚖ TEST LOAD';test.onclick=()=>{if(blocks.length<5){say('Tambah sekurang-kurangnya 5 blok untuk membina struktur yang boleh diuji.');return;}blocks.forEach((b,i)=>{b.position.y-=.08*(i%2);});say('Ujian beban selesai. Struktur berjaya menyokong beban simulasi.');done('Hebat! Struktur jambatan anda melepasi ujian beban.');};
   hud.append(add,test);say('Klik ADD BLOCK untuk membina jambatan 3D. Tambah 5 blok atau lebih dan uji struktur.');
  }else if(game.id==='robot'){
   const body=cylinder(.62,.62,.8,0x5c9fdb,0,2.05,0,8);body.rotation.y=Math.PI/8;
   const head=sphere(.42,0x9beaff,0,2.72,0);const eye1=sphere(.07,0x172b55,-.16,2.76,.35),eye2=sphere(.07,0x172b55,.16,2.76,.35);
   const wheels=[];[-.75,.75].forEach(x=>{const w=cylinder(.25,.25,.16,0x26364f,x,1.48,0,24);w.rotation.z=Math.PI/2;wheels.push(w);});
   const arms=[];[-.85,.85].forEach(x=>arms.push(cylinder(.13,.13,.75,0x4f77b2,x,2.05,0,16)));
   const parts={power:false,sensor:false,motion:false};
   [['🔋 BATTERY','power'],['📡 SENSOR','sensor'],['⚙ WHEELS','motion']].forEach(([label,key])=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>{parts[key]=!parts[key];b.style.borderColor=parts[key]?'#59e5f2':'#ffffff35';if(key==='power')body.material.emissive.set(parts[key]?0x1d8d9a:0x000000);if(key==='sensor')head.material.emissive.set(parts[key]?0x1d8d9a:0x000000);if(key==='motion')wheels.forEach(w=>w.material.color.set(parts[key]?0x5de8d9:0x26364f));say('Komponen robot: '+Object.values(parts).filter(Boolean).length+' / 3 dipasang.');setProgress(Object.values(parts).filter(Boolean).length/4);};hud.appendChild(b);});
   const run=document.createElement('button');run.className='primary';run.textContent='▶ RUN ROBOT';run.onclick=()=>{if(!Object.values(parts).every(Boolean)){say('Pasang bateri, sensor dan roda dahulu.');return;}if(anim)return;let n=0;anim=setInterval(()=>{n++;body.position.x=Math.sin(n*.12)*.75;head.position.x=body.position.x;eye1.position.x=body.position.x-.16;eye2.position.x=body.position.x+.16;wheels.forEach(w=>w.rotation.x+=.3);arms.forEach((a,i)=>a.rotation.z=Math.sin(n*.15+(i?Math.PI:0))*.25);if(n>45){clearInterval(anim);anim=null;done('Robot berjaya bergerak dan menyelesaikan misi.');}},35);say('Robot sedang bergerak melalui laluan ujian…');};hud.appendChild(run);say('Pilih dan pasang ketiga-tiga komponen pada robot 3D. Kemudian tekan RUN ROBOT.');
  }else if(game.id==='bio'){
   const cell=sphere(1.25,0x4dbb9a,0,2,0);cell.scale.set(1.45,.78,1);cell.material.transparent=true;cell.material.opacity=.38;
   const nucleus=sphere(.42,0x9b75ff,0,2,0);nucleus.userData.float=true;nucleus.userData.baseY=2;
   const organelles=[];for(let i=0;i<7;i++){const a=i*Math.PI*2/7;const o=sphere(.13,i%2?0xffb35c:0x6bd8ff,Math.cos(a)*.9,2+Math.sin(a)*.45,.15);organelles.push(o);click(o,()=>{o.scale.setScalar(1.5);say('Organel berjaya diperhatikan. Klik nukleus untuk meneroka pusat kawalan sel.');setProgress(Math.min(.75,progress+.1));});}
   click(nucleus,()=>{say('Nukleus dipilih: struktur ini mengandungi bahan genetik dan mengawal aktiviti sel.');setProgress(.8);const q=document.createElement('select');q.className='sl3d-select';q.innerHTML='<option value="">Fungsi nukleus?</option><option value="1">Mengawal aktiviti sel</option><option value="0">Menghasilkan cahaya</option><option value="0">Menggerakkan seluruh organisma</option>';q.onchange=()=>q.value==='1'?done('Tepat! Nukleus mengawal aktiviti sel.'):say('Cuba lagi. Apakah pusat kawalan sel?');hud.appendChild(q);});
   const zoom=document.createElement('input');zoom.type='range';zoom.min='70';zoom.max='145';zoom.value='100';zoom.setAttribute('aria-label','Pembesaran mikroskop');zoom.oninput=()=>{const s=Number(zoom.value)/100;cell.scale.set(1.45*s,.78*s,s);nucleus.scale.setScalar(.42*s);organelles.forEach(o=>o.scale.setScalar(.13*s));};const lab=document.createElement('span');lab.textContent='🔍 Microscope zoom';hud.append(zoom,lab);say('Klik nukleus ungu atau organel kecil untuk meneroka sel. Laraskan zoom mikroskop.');
  }
  return {dispose:ctx.dispose};
 }
 window.CareerVerseScience3D={
  start:async function(game,host,onComplete){
   if(active){active.dispose();active=null;}
   const ui=host.closest('.sl3d-wrap');const stage=ui.querySelector('.sl3d-stage'),hud=ui.querySelector('[data-hud]');
   stage.innerHTML='<div style="padding:35px;text-align:center;color:#cce8ff">Loading 3D laboratory engine…</div>';
   try{await loadThree();if(!stage.isConnected)return;stage.innerHTML='';active=build(game,stage,ui,onComplete);return active;}
   catch(err){stage.innerHTML='<div style="padding:25px;color:#fff">3D engine could not load. Please check internet access and refresh. <small>'+String(err.message||err)+'</small></div>';ui.querySelector('[data-status]').textContent='WebGL / Three.js is unavailable on this device or network.';}
  },
  stop:function(){if(active){active.dispose();active=null;}}
 };
})();