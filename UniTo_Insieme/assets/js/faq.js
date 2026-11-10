const header=document.getElementById('siteHeader');
const menuButton=document.querySelector('.menu-toggle');
const nav=document.getElementById('mainNav');
const search=document.getElementById('faqSearch');
const emptyState=document.getElementById('emptyState');
const year=document.getElementById('year');
if(year)year.textContent=new Date().getFullYear();
if(header){const updateHeader=()=>header.classList.toggle('scrolled',window.scrollY>40);updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});}
if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});document.addEventListener('keydown',event=>{if(event.key==='Escape'){menuButton.setAttribute('aria-expanded','false');nav.classList.remove('open')}});}
const items=[...document.querySelectorAll('.faq-item')];
function setOpen(item,open){const button=item.querySelector('.faq-question');const answer=item.querySelector('.faq-answer');if(!button||!answer)return;button.setAttribute('aria-expanded',String(open));answer.hidden=open?false:'until-found';}
items.forEach((item,index)=>{const button=item.querySelector('.faq-question');const answer=item.querySelector('.faq-answer');if(!button||!answer)return;const id='faq-answer-'+(index+1);answer.id=id;button.setAttribute('aria-controls',id);setOpen(item,false);button.addEventListener('click',()=>setOpen(item,button.getAttribute('aria-expanded')!=='true'));});
function normalize(text){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('it').trim();}
function filterFaq(){const term=normalize(search.value);let count=0;items.forEach(item=>{const question=item.querySelector('.faq-question')?.textContent||'';const answer=item.querySelector('.faq-answer')?.textContent||'';const match=!term||normalize(question+' '+answer).includes(term);item.hidden=!match;if(match)count++;if(term)setOpen(item,match);else setOpen(item,false);});document.querySelectorAll('.group').forEach(group=>{group.hidden=![...group.querySelectorAll('.faq-item')].some(item=>!item.hidden);});if(emptyState)emptyState.style.display=count?'none':'block';}
if(search){search.addEventListener('input',filterFaq);const query=new URLSearchParams(window.location.search).get('q');if(query){search.value=query;filterFaq();}}
//items.forEach(item=>{const answer=item.querySelector('.faq-answer');if(!answer)return;answer.addEventListener('beforematch',()=>setOpen(item,true));});
items.forEach(item=>{const answer=item.querySelector('.faq-answer');const button=item.querySelector('.faq-question');if(!answer||!button)return;new MutationObserver(()=>{if(!answer.hidden&&button.getAttribute('aria-expanded')!=='true')setOpen(item,true);}).observe(answer,{attributes:true,attributeFilter:['hidden']});});
