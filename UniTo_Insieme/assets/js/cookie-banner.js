/* Il sito non imposta cookie di profilazione: avviso informativo richiudibile. */
(() => {
  const key = 'unito-cookie-notice-dismissed-v1';
  try { if (localStorage.getItem(key) === 'yes') return; } catch (_) {}
  const banner = document.createElement('aside');
  banner.className = 'cookie-notice';
  banner.setAttribute('aria-label', 'Informazioni sui cookie');
  const message = document.createElement('p');
  message.textContent = 'Utilizziamo solo strumenti tecnici necessari al funzionamento del sito. Nessun cookie pubblicitario.';
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Ho capito';
  button.addEventListener('click', () => {
    try { localStorage.setItem(key, 'yes'); } catch (_) {}
    banner.remove();
  });
  banner.append(message, button);
  document.body.append(banner);
})();
