// Adds the immersive RIASEC VR experience to the existing CareerVerse game card.
(function(){
 const add=()=>{
  const first=document.querySelector('#gameGrid article');
  if(!first || first.querySelector('.vr-launch')) return;
  const a=document.createElement('a');
  a.className='btn ghost small vr-launch';
  a.href='riasec-vr.html';
  a.target='_blank';
  a.rel='noopener';
  a.style.cssText='margin-top:8px;width:100%;border-color:#59e5f2;color:#8df5ff;text-decoration:none';
  a.textContent='🥽 ENTER RIASEC VR WORLD';
  first.appendChild(a);
 };
 add();
 const grid=document.getElementById('gameGrid');
 if(grid)new MutationObserver(add).observe(grid,{childList:true});
})();