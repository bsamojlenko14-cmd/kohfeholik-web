// Kohfeholik — správanie stránky
(function () {
  'use strict';

  // Otváracie hodiny: 0 = nedeľa … 6 = sobota, časy v minútach od polnoci
  var HOURS = {
    0: [9 * 60, 20 * 60], 1: [7 * 60 + 30, 20 * 60], 2: [7 * 60 + 30, 20 * 60],
    3: [7 * 60 + 30, 20 * 60], 4: [7 * 60 + 30, 20 * 60], 5: [7 * 60 + 30, 20 * 60],
    6: [9 * 60, 20 * 60]
  };
  var STORAGE_KEY = 'kohfeholik-posledna-rezervacia';

  function fmt(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return h + ':' + (m < 10 ? '0' : '') + m;
  }

  // --- Mobilné menu ---
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('hlavne-menu');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.querySelector('.visually-hidden').textContent = open ? 'Otvoriť menu' : 'Zavrieť menu';
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.querySelector('.visually-hidden').textContent = 'Otvoriť menu';
        nav.classList.remove('is-open');
      }
    });
  }

  // --- Jemné animácie pri scrollovaní ---
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // --- Otvorené teraz? + zvýraznenie dnešného dňa ---
  var now = new Date();
  var day = now.getDay();
  var minutes = now.getHours() * 60 + now.getMinutes();
  var status = document.getElementById('open-status');
  if (status) {
    var h = HOURS[day];
    var text = status.querySelector('span');
    if (minutes >= h[0] && minutes < h[1]) {
      status.classList.add('is-open');
      text.textContent = 'Teraz otvorené · dnes do ' + fmt(h[1]);
    } else {
      status.classList.add('is-closed');
      var nextDay = minutes < h[0] ? day : (day + 1) % 7;
      var when = minutes < h[0] ? 'dnes' : 'zajtra';
      text.textContent = 'Teraz zatvorené · otvárame ' + when + ' o ' + fmt(HOURS[nextDay][0]);
    }
  }
  var todayRow = document.querySelector('#hours-table tr[data-day="' + day + '"]');
  if (todayRow) {
    todayRow.classList.add('is-today');
    todayRow.querySelector('th').insertAdjacentHTML('beforeend', ' <span class="visually-hidden">(dnes)</span>');
  }

  // --- Viditeľný fokus na mape (iframe) pri ovládaní klávesnicou ---
  var mapWrap = document.querySelector('.map-wrap');
  if (mapWrap) {
    window.addEventListener('blur', function () {
      setTimeout(function () {
        if (document.activeElement && document.activeElement.tagName === 'IFRAME') mapWrap.classList.add('is-focused');
      }, 0);
    });
    window.addEventListener('focus', function () { mapWrap.classList.remove('is-focused'); });
    document.addEventListener('focusin', function () { mapWrap.classList.remove('is-focused'); });
  }

  // --- Filter menu ---
  var filters = document.querySelectorAll('.filter');
  var products = document.querySelectorAll('.product');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filters.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      var shown = 0;
      products.forEach(function (p) {
        var cats = p.getAttribute('data-cat').split(' ');
        var hide = f !== 'vsetko' && cats.indexOf(f) === -1;
        p.classList.toggle('is-hidden', hide);
        if (!hide) shown++;
      });
      document.querySelectorAll('.menu-group').forEach(function (g) {
        g.classList.toggle('is-hidden', !g.querySelector('.product:not(.is-hidden)'));
      });
      var st = document.getElementById('filter-status');
      if (st) st.textContent = 'Zobrazených položiek: ' + shown;
    });
  });

  // --- Rezervačný formulár ---
  var form = document.getElementById('reservation-form');
  if (!form) return;

  var datum = document.getElementById('datum');
  var cas = document.getElementById('cas');
  var osoby = document.getElementById('osoby');
  var meno = document.getElementById('meno');
  var priezvisko = document.getElementById('priezvisko');
  var email = document.getElementById('email');
  var telefon = document.getElementById('telefon');

  // Výber služby: stôl alebo catering
  function sluzba() { return form.querySelector('input[name="sluzba"]:checked').value; }
  function applyService() {
    var cat = sluzba() === 'catering';
    document.getElementById('stol-field').hidden = cat;
    osoby.min = cat ? 10 : 1;
    osoby.max = cat ? 80 : 10;
    if (cat && +osoby.value < 10) osoby.value = 20;
    if (!cat && +osoby.value > 10) osoby.value = 2;
    document.getElementById('osoby-hint').textContent = cat ? '10 – 80 osôb.' : '1 – 10 osôb. Pre väčšiu skupinu zvoľ catering alebo nám napíš.';
    document.getElementById('cas-label').firstChild.textContent = cat ? 'Čas začiatku akcie ' : 'Čas ';
    document.getElementById('tel-req').hidden = !cat;
    document.getElementById('poznamka-label').textContent = cat ? 'Popíš akciu (typ akcie, miesto, čo chceš objednať)' : 'Máš špeciálne želanie?';
    document.getElementById('submit-btn').textContent = cat ? 'Odoslať dopyt na catering' : 'Potvrdiť rezerváciu';
  }
  form.querySelectorAll('input[name="sluzba"]').forEach(function (r) { r.addEventListener('change', applyService); });
  if (/[?&]sluzba=catering/.test(location.search)) {
    form.querySelector('input[name="sluzba"][value="catering"]').checked = true;
  }
  applyService();

  function isoDate(d) {
    var m = d.getMonth() + 1, dd = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (dd < 10 ? '0' : '') + dd;
  }
  var today = new Date();
  var maxDate = new Date(); maxDate.setDate(maxDate.getDate() + 60);
  datum.min = isoDate(today);
  datum.max = isoDate(maxDate);

  // Ponuka časov podľa dňa (každých 30 min, posledná rezervácia hodinu pred zatvorením)
  function fillTimes() {
    var selected = cas.value;
    cas.innerHTML = '<option value="">Vyber čas</option>';
    if (!datum.value) return;
    var parts = datum.value.split('-');
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    var h = HOURS[d.getDay()];
    var isToday = datum.value === isoDate(new Date());
    var nowMin = new Date().getHours() * 60 + new Date().getMinutes();
    for (var t = Math.ceil(h[0] / 30) * 30; t <= h[1] - 60; t += 30) {
      if (isToday && t <= nowMin + 30) continue;
      var opt = document.createElement('option');
      opt.value = fmt(t); opt.textContent = fmt(t);
      cas.appendChild(opt);
    }
    if (cas.options.length === 1) {
      cas.innerHTML = '<option value="">Na tento deň už nie sú voľné časy</option>';
    }
    if (selected) cas.value = selected;
  }
  datum.addEventListener('change', fillTimes);

  function setError(input, msg) {
    var err = document.getElementById(input.id + '-err');
    if (err) err.textContent = msg;
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    return !msg;
  }

  function validate() {
    var ok = true, first = null;
    function check(input, msg) {
      var valid = setError(input, msg);
      if (!valid && !first) first = input;
      ok = ok && valid;
    }
    check(datum, !datum.value ? 'Vyber dátum.' : (datum.value < datum.min ? 'Dátum nemôže byť v minulosti.' : (datum.value > datum.max ? 'Rezervovať sa dá najviac 60 dní dopredu.' : '')));
    check(cas, !cas.value ? 'Vyber čas príchodu.' : '');
    var n = parseInt(osoby.value, 10), lo = +osoby.min, hi = +osoby.max;
    check(osoby, !(n >= lo && n <= hi) ? 'Zadaj počet osôb od ' + lo + ' do ' + hi + '.' : '');
    check(meno, meno.value.trim().length < 2 ? 'Napíš svoje meno.' : '');
    check(priezvisko, priezvisko.value.trim().length < 2 ? 'Napíš svoje priezvisko.' : '');
    check(email, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) ? 'Zadaj platný e-mail, napr. meno@gmail.com.' : '');
    var telOk = sluzba() !== 'catering' || telefon.value.replace(/\D/g, '').length >= 9;
    check(telefon, telOk ? '' : 'Pri cateringu potrebujeme telefón, napr. +421 900 123 456.');
    if (first) first.focus();
    return ok;
  }

  [datum, cas, osoby, meno, priezvisko, email, telefon].forEach(function (el) {
    el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) setError(el, ''); });
  });

  // Rýchla rezervácia (scenár 100. použitia) — zapamätané v prehliadači
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { saved = null; }
  if (saved && saved.meno) {
    var box = document.getElementById('repeat-box');
    document.getElementById('repeat-text').textContent =
      saved.meno + ' ' + (saved.priezvisko || '') + ' · ' + saved.osoby + ' os. · ' + saved.stol + (saved.cas ? ' · ' + saved.cas : '');
    box.hidden = false;
    document.getElementById('repeat-btn').addEventListener('click', function () {
      form.querySelector('input[name="sluzba"][value="stol"]').checked = true;
      applyService();
      meno.value = saved.meno; priezvisko.value = saved.priezvisko || ''; email.value = saved.email || '';
      telefon.value = saved.telefon || '';
      osoby.value = saved.osoby || 2;
      var radio = form.querySelector('input[name="stol"][value="' + saved.stol + '"]');
      if (radio) radio.checked = true;
      if (!datum.value) { datum.value = isoDate(new Date(Date.now() + 864e5)); fillTimes(); }
      if (saved.cas) cas.value = saved.cas;
      datum.focus();
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    var cat = sluzba() === 'catering';
    var data = {
      datum: datum.value, cas: cas.value, osoby: osoby.value,
      stol: form.querySelector('input[name="stol"]:checked').value,
      meno: meno.value.trim(), priezvisko: priezvisko.value.trim(), email: email.value.trim(),
      telefon: telefon.value.trim(),
      poznamka: document.getElementById('poznamka').value.trim()
    };
    if (!cat) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          meno: data.meno, priezvisko: data.priezvisko, email: data.email, telefon: data.telefon,
          osoby: data.osoby, stol: data.stol, cas: data.cas
        }));
      } catch (err) { /* úložisko nedostupné — rezervácia funguje aj bez neho */ }
    }

    var p = data.datum.split('-');
    var rows = [
      ['Služba', cat ? 'Catering na akciu' : 'Rezervácia stola'],
      ['Dátum', +p[2] + '. ' + +p[1] + '. ' + p[0]],
      ['Čas', data.cas],
      ['Počet osôb', data.osoby]
    ];
    if (!cat) rows.push(['Stôl', data.stol]);
    rows.push(['Meno', data.meno + ' ' + data.priezvisko]);
    if (data.telefon) rows.push(['Telefón', data.telefon]);
    if (data.poznamka) rows.push(['Poznámka', data.poznamka]);
    var dl = document.getElementById('conf-summary');
    dl.innerHTML = '';
    rows.forEach(function (r) {
      var dt = document.createElement('dt'); dt.textContent = r[0];
      var dd = document.createElement('dd'); dd.textContent = r[1];
      dl.appendChild(dt); dl.appendChild(dd);
    });
    document.getElementById('conf-email').textContent = data.email;
    if (cat) {
      document.getElementById('conf-title').textContent = 'Ďakujeme, dopyt na catering je odoslaný!';
      document.getElementById('conf-text').innerHTML = 'Ponuku s cenou ti pošleme na <strong></strong> do 24 hodín.';
      document.getElementById('conf-text').querySelector('strong').textContent = data.email;
    }
    form.hidden = true;
    var conf = document.getElementById('confirmation');
    conf.hidden = false;
    conf.focus({ preventScroll: true });
    document.querySelector('.form-card').scrollIntoView({ block: 'start', behavior: 'instant' });
  });
})();
