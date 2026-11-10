"use strict";

const menuToggle = document.querySelector(".toggle");
const menu = document.querySelector("#menu");
const header = document.querySelector(".top");

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menu.classList.toggle("open", isOpen);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !menu.classList.contains("open")) return;
    menu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.focus();
  });
}

if (header) {
  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}

const tabs = [...document.querySelectorAll("[data-auth-tab]")];
const panels = [...document.querySelectorAll("[data-auth-panel]")];

function selectAuthPanel(selectedTab, moveFocus = false) {
  const selectedName = selectedTab.dataset.authTab;

  for (const tab of tabs) {
    const isSelected = tab === selectedTab;
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  }

  for (const panel of panels) {
    panel.hidden = panel.dataset.authPanel !== selectedName;
  }

  if (moveFocus) selectedTab.focus();
}

for (const [index, tab] of tabs.entries()) {
  tab.addEventListener("click", () => selectAuthPanel(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;

    selectAuthPanel(tabs[nextIndex], true);
  });
}

const USERS = "unito-demo-users";
const SESSION = "unito-demo-session";
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const authArea = document.querySelector('.auth-area');
const dashboard = document.querySelector('#dashboard');
function renderProfile() {
  const email = sessionStorage.getItem(SESSION);
  const user = read(USERS, {})[email];
  const loggedIn = Boolean(user);
  authArea.hidden = loggedIn;
  dashboard.hidden = !loggedIn;
  document.querySelector('.intro .lead').textContent = loggedIn ? 'Il tuo profilo e le iniziative della comunità.' : 'Accedi al tuo account oppure registrati per creare un profilo.';
  if (!loggedIn) return;
  document.querySelector('#welcome').textContent = 'Ciao, ' + user.name + '!';
  document.querySelector('#profile-name').textContent = user.name;
  document.querySelector('#profile-email').textContent = email;
  const history = read('unito-demo-donations', []).filter(item => item && String(item.email || '').toLowerCase() === email).slice().reverse();
  const holder = document.querySelector('#donation-history');
  holder.replaceChildren();
  if (!history.length) { const msg = document.createElement('p'); msg.textContent = 'Non hai ancora effettuato contributi dimostrativi.'; holder.append(msg); }
  history.forEach(item => {
    const msg = document.createElement('p');
    const date = item.date && !isNaN(Date.parse(item.date)) ? new Date(item.date).toLocaleDateString('it-IT') + ' · ' : '';
    msg.textContent = date + item.project + ' · ' + Number(item.amount).toLocaleString('it-IT',{style:'currency',currency:'EUR'}) + ' · Simulazione';
    holder.append(msg);
  });
  const supported = document.querySelector('#supported-projects');
  supported.replaceChildren();
  const grouped = new Map();
  history.forEach(item => {
    const slug = item.slug || ({'Archivi e biblioteche':'archivi','Dispensa solidale':'dispensa','Sport per tutti':'sport','Studio per tutti':'studio','Ricerca in laboratorio':'ricerca','Competenze digitali':'digitale'})[item.project];
    if (!slug || !['archivi','dispensa','sport','studio','ricerca','digitale'].includes(slug)) return;
    const entry = grouped.get(slug) || {name:item.project,amount:0,count:0};
    entry.amount += Number(item.amount) || 0; entry.count++;
    grouped.set(slug,entry);
  });
  if (!grouped.size) { const msg = document.createElement('p'); msg.textContent = 'I progetti che sosterrai compariranno qui dopo la conferma del contributo demo.'; supported.append(msg); }
  grouped.forEach((entry,slug) => {
    const card = document.createElement('a'); card.className = 'supported-card'; card.href = 'progetto-' + slug + '.html';
    const img = document.createElement('img'); img.src = 'assets/img/' + slug + '.jpg'; img.alt = ''; img.loading = 'lazy';
    const info = document.createElement('span');
    const title = document.createElement('strong'); title.textContent = entry.name;
    const amount = document.createElement('small'); amount.textContent = entry.count + (entry.count === 1 ? ' contributo demo · ' : ' contributi demo · ') + entry.amount.toLocaleString('it-IT',{style:'currency',currency:'EUR'});
    info.append(title,amount); card.append(img,info); supported.append(card);
  });
}
document.querySelector('#logout').addEventListener('click', () => { sessionStorage.removeItem(SESSION); renderProfile(); });
for (const form of document.querySelectorAll('[data-auth-form]')) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const status = form.querySelector('[data-form-status]');
    const email = form.elements.email.value.trim().toLowerCase();
    const password = form.elements.password.value;
    const users = read(USERS, {});
    const registering = form.closest('[data-auth-panel]').dataset.authPanel === 'register';
    if (registering) {
      if (users[email]) { status.textContent = 'Questa email è già registrata. Accedi oppure scegline un’altra.'; return; }
      users[email] = {name:form.elements.name.value.trim(),password};
      try { localStorage.setItem(USERS, JSON.stringify(users)); } catch { status.textContent = 'Impossibile salvare il profilo in questo browser.'; return; }
    } else if (!users[email] || users[email].password !== password) {
      status.textContent = 'Email o password non corrette. Registrati prima di accedere.'; return;
    }
    sessionStorage.setItem(SESSION,email);
    form.reset();
    renderProfile();
    document.querySelector('#contenuto').scrollIntoView();
  });
}
renderProfile();
