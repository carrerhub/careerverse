// Adds the immersive RIASEC VR experience and Science Lab to the existing CareerVerse homepage.
(function(){
 const add=()=>{
  const first=document.querySelector('#gameGrid article');
  if(first && !first.querySelector('.vr-launch')){
   const a=document.createElement('a');
   a.className='btn ghost small vr-launch';
   a.href='riasec-vr.html';
   a.target='_blank';
   a.rel='noopener';
   a.style.cssText='margin-top:8px;width:100%;border-color:#59e5f2;color:#8df5ff;text-decoration:none';
   a.textContent='🥽 ENTER RIASEC VR WORLD';
   first.appendChild(a);
  }
 };
 add();
 const grid=document.getElementById('gameGrid');
 if(grid)new MutationObserver(add).observe(grid,{childList:true});
 const loadScienceLab=()=>{
  if(document.querySelector('script[data-science-lab]'))return;
  const s=document.createElement('script');
  s.src='science-lab.js';
  s.dataset.scienceLab='true';
  s.defer=true;
  document.body.appendChild(s);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadScienceLab,{once:true});
 else loadScienceLab();
})();