"use strict";

const NAV_ITEMS = [
  { href: "index.html", label: "Home" },
  { href: "progetti.html", label: "Progetti" },
  { href: "faq.html", label: "Come funziona / FAQ" },
  { href: "chi-siamo.html", label: "Chi siamo" },
  { href: "contatti.html", label: "Contatti" },
  { href: "area-personale.html", label: "Area personale", cls: "account" },
];

function currentPage(el) {
  const attr = el.getAttribute("current");
  if (attr) return attr;
  return location.pathname.split("/").pop() || "index.html";
}

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const page = currentPage(this);
    // id del contenuto principale della pagina (default: "contenuto")
    const target = this.getAttribute("skip-target") || "contenuto";

    const links = NAV_ITEMS.map((item) => {
      const cls = item.cls ? ` class="${item.cls}"` : "";
      const cur = item.href === page ? ' aria-current="page"' : "";
      return `<a${cls}${cur} href="${item.href}">${item.label}</a>`;
    }).join("");
this.innerHTML = `
<a class="skip-link" href="#${target}">Vai al contenuto</a>

<header class="site-header" id="siteHeader">
  <div class="notice">UniTo Insieme · Progetti della comunità universitaria</div>
  <div class="nav-wrap">
    <a class="brand" href="index.html">
      <span aria-hidden="true" class="brand-mark">U+</span>
      <span>UniTo Insieme<small>UN PROGETTO STUDENTESCO</small></span>
    </a>
    <button aria-controls="mainNav" aria-expanded="false" class="menu-toggle" type="button">Menu</button>
    <nav aria-label="Navigazione principale" class="nav-links" id="mainNav">${links}</nav>
  </div>
</header>`;
    /*this.innerHTML = `
<header class="site-header" id="siteHeader">
  <div class="notice">UniTo Insieme · Progetti della comunità universitaria</div>
  <div class="nav-wrap">
    <a class="brand" href="index.html">
      <span aria-hidden="true" class="brand-mark">U+</span>
      <span>UniTo Insieme<small>UN PROGETTO STUDENTESCO</small></span>
    </a>
    <button aria-controls="mainNav" aria-expanded="false" class="menu-toggle" type="button">Menu</button>
    <nav aria-label="Navigazione principale" class="nav-links" id="mainNav">${links}</nav>
  </div>
</header>`;*/

    this.initBehavior();
  }

  initBehavior() {
    const toggle = this.querySelector(".menu-toggle");
    const menu = this.querySelector("#mainNav");
    const header = this.querySelector("#siteHeader");

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(isOpen));
      menu.classList.toggle("open", isOpen);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !menu.classList.contains("open")) return;
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    });

    const update = () => header.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", update, { passive: true });
    update();
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<div aria-hidden="true" class="unito-footer-wave"></div>
<footer class="site-footer redesigned-footer">
  <div class="footer-shell">
    <div class="footer-about">
      <a class="footer-brand" href="index.html">
        <span aria-hidden="true" class="footer-symbol">U+</span><span>UniTo Insieme</span>
      </a>
      <p>Idee, persone e progetti che fanno crescere la comunità universitaria.</p>
      <span class="footer-note">Progetto indipendente realizzato da studenti, non sito ufficiale dell’Ateneo.</span>
    </div>
    <nav aria-label="Esplora il sito" class="footer-column">
      <h2>Esplora</h2>
      <a href="index.html">Home</a>
      <a href="progetti.html">Progetti</a>
      <a href="chi-siamo.html">Chi siamo</a>
      <a href="faq.html">Domande frequenti</a>
    </nav>
    <div class="footer-column footer-contact">
      <h2>Restiamo in contatto</h2>
      <p>Hai una domanda, un'idea o vuoi saperne di più?</p>
      <a class="footer-contact-link" href="contatti.html">Vai ai contatti</a>
      <a href="https://www.unito.it" rel="noopener noreferrer" target="_blank">Sito ufficiale UniTo <span aria-hidden="true">↗</span></a>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© <span class="footer-year">${new Date().getFullYear()}</span> UniTo Insieme</span>
    <span>Costruiamo qualcosa insieme.</span>
  </div>
</footer>`;
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);
