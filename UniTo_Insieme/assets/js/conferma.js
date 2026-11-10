(function () {
  "use strict";

  var KEY = "unito-contributo";
  var greeting = document.getElementById("greeting");

  var yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();


  /* Registra una sola simulazione per conferma, associata all’account attivo. */
  try {
    var data = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (!data) data = JSON.parse(new URLSearchParams(location.search).get("d") || "null");
    if (data && data.firstName && greeting) greeting.textContent = "Grazie, " + data.firstName + "!";
    if (data && data.amount && Number(data.amount) >= 1) {
      var params = new URLSearchParams(location.search);
      var names = {archivi:'Archivi e biblioteche',dispensa:'Dispensa solidale',sport:'Sport per tutti',studio:'Studio per tutti',ricerca:'Ricerca in laboratorio',digitale:'Competenze digitali'};
      var slug = params.get('progetto') || sessionStorage.getItem('unito-demo-project') || 'archivi';
      if (!names[slug]) slug = 'archivi';
      var account = sessionStorage.getItem('unito-demo-session');
      var email = (account || data.email || '').trim().toLowerCase();
      var signature = JSON.stringify([slug, data.amount, data.email, data.firstName, data.lastName]);
      var lastSignature = sessionStorage.getItem('unito-demo-confirmed-signature');
      if (signature !== lastSignature && sessionStorage.getItem(KEY)) {
        var history = JSON.parse(localStorage.getItem('unito-demo-donations') || '[]');
        if (!Array.isArray(history)) history = [];
        history.push({id:Date.now()+'-'+Math.random().toString(36).slice(2),email:email,amount:data.amount,project:names[slug],slug:slug,date:new Date().toISOString(),demo:true});
        localStorage.setItem('unito-demo-donations',JSON.stringify(history));
        sessionStorage.setItem('unito-demo-confirmed-signature',signature);
      }
      sessionStorage.setItem('unito-demo-last-donation',JSON.stringify(data));
      sessionStorage.removeItem(KEY);
    }
  } catch (e) { /* localStorage può essere disabilitato */ }
})();
