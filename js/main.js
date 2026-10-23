'use strict';
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);

  const blockedCombos = new Set(['u','s']);
  document.addEventListener('contextmenu', event => event.preventDefault());
  document.addEventListener('dragstart', event => {
    const tag = (event.target && event.target.tagName ? event.target.tagName.toLowerCase() : '');
    if (['img','a'].includes(tag)) event.preventDefault();
  });
  document.addEventListener('keydown', event => {
    const key = (event.key || '').toLowerCase();
    const ctrlShiftCombo = event.ctrlKey && event.shiftKey && ['i','j','c'].includes(key);
    const ctrlCombo = event.ctrlKey && blockedCombos.has(key);
    const blockedKey = event.key === 'F12' || event.keyCode === 123;
    if (blockedKey || ctrlShiftCombo || ctrlCombo) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);

  const menuToggle = $('.menu-toggle');
  const mobileMenu = $('#mobile-menu');
  const closeMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
  };
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const opening = mobileMenu.hidden;
      mobileMenu.hidden = !opening;
      menuToggle.setAttribute('aria-expanded', String(opening));
      menuToggle.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
    });
    mobileMenu.querySelectorAll('a, button').forEach(a => a.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 920) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  const expoDialog = $('#expo-dialog');
  const beerDialog = $('#beer-dialog');
  const syncLock = () => {
    const opened = (expoDialog?.open || beerDialog?.open);
    document.body.classList.toggle('modal-visible', Boolean(opened));
  };
  const openExpo = () => {
    if (!expoDialog) return;
    if (beerDialog?.open) beerDialog.close();
    closeMenu();
    if (!expoDialog.open && typeof expoDialog.showModal === 'function') expoDialog.showModal();
    else if (!expoDialog.open) expoDialog.setAttribute('open', '');
    syncLock();
  };
  const closeExpo = () => {
    if (!expoDialog) return;
    if (typeof expoDialog.close === 'function' && expoDialog.open) expoDialog.close();
    else expoDialog.removeAttribute('open');
    syncLock();
  };
  document.querySelectorAll('[data-open-expo]').forEach(button => button.addEventListener('click', openExpo));
  $('#expo-close')?.addEventListener('click', closeExpo);
  if (expoDialog) expoDialog.addEventListener('close', syncLock);
  if (expoDialog) openExpo();

  const beers = {
    ipa: {title:'IPA',description:'Una IPA aromática, lupulada y equilibrada. Tiene presencia y carácter, pero mantiene una tomabilidad alta para seguir disfrutando sin complicaciones.',img:'img/IPA.png',background:'#f3e9cb'},
    vienna: {title:'VIENNA LAGER',description:'Una Vienna Lager maltosa, tostada y equilibrada. Redonda, amable y muy disfrutable; ideal para quienes buscan profundidad sin excesos.',img:'img/VIENNA LAGER.png',background:'#f1d9c7'},
    lager: {title:'INTERNATIONAL PALE LAGER',description:'Una International Pale Lager limpia, ligera y refrescante. Un perfil directo y fácil de beber, pensado para volver a pedir otra.',img:'img/PALE LAGER.png',background:'#dceae1'}
  };
  if (beerDialog) {
    const closeBeer = () => {
      if (typeof beerDialog.close === 'function' && beerDialog.open) beerDialog.close();
      else beerDialog.removeAttribute('open');
      syncLock();
    };
    document.querySelectorAll('[data-beer]').forEach(button => button.addEventListener('click', () => {
      const beer = beers[button.dataset.beer];
      if (!beer) return;
      $('#dialog-img').src = beer.img;
      $('#dialog-img').alt = `Botella de cerveza Lappa ${beer.title}`;
      $('#dialog-title').textContent = beer.title;
      $('#dialog-desc').textContent = beer.description;
      $('.beer-dialog-art').style.background = beer.background;
      $('#dialog-cta').href = 'https://wa.me/525520799807?text=' + encodeURIComponent(`Hola Lappa, me gustaría saber más sobre su cerveza ${beer.title}.`);
      if (expoDialog?.open) closeExpo();
      if (typeof beerDialog.showModal === 'function') beerDialog.showModal();
      else beerDialog.setAttribute('open', '');
      syncLock();
    }));
    $('#dialog-close')?.addEventListener('click', closeBeer);
    beerDialog.addEventListener('close', syncLock);
  }

  const form = $('#contact-form');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = $('#contact-name').value.trim();
    const topic = $('#contact-topic').value;
    const message = $('#contact-message').value.trim();
    const text = `Hola, soy ${name}. Me interesa: ${topic}.${message ? `
Mi mensaje: ${message}` : ''}

Los contacté a través de su página web.`;
    window.open('https://wa.me/525520799807?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
  });

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
