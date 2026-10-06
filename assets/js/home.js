'use strict';
// Progressive enhancement: all information/downloads work without JavaScript.
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}
const views={maintenance:{src:'/assets/images/desktop-maintenance.png',alt:'Actual Rovarin Windows Maintenance interface',label:'Maintenance on your desktop',width:1100,height:820},desktop:{src:'/assets/images/desktop-dashboard.png',alt:'Actual Rovarin Windows desktop dashboard',label:'The Windows desktop dashboard'},mobile:{src:'/assets/images/phone-dashboard.jpg',alt:'Actual Rovarin dashboard on an iPhone',label:'The same dashboard, on your phone'}};
const screen=document.getElementById('showcase-screen'),image=document.getElementById('showcase-image');
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{const view=views[button.dataset.view];if(!view)return;document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));screen.classList.toggle('mobile',button.dataset.view==='mobile');image.src=view.src;image.alt=view.alt;image.width=view.width||(button.dataset.view==='mobile'?589:900);image.height=view.height||(button.dataset.view==='mobile'?1280:680);document.getElementById('showcase-label').textContent=view.label;}));
const dialog=document.getElementById('screenshot-dialog'),expand=document.getElementById('expand-shot');
expand.addEventListener('click',()=>{const full=document.getElementById('full-shot');full.src=image.src;full.alt=image.alt;if(typeof dialog.showModal==='function')dialog.showModal();else window.open(image.src,'_blank','noopener');});
document.getElementById('close-shot').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>expand.focus());
(()=>{const button=document.querySelector('[data-menu]');const nav=document.querySelector('[data-nav]');if(button&&nav){button.addEventListener('click',()=>{const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(open))});nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');button.setAttribute('aria-expanded','false')}})}})();
