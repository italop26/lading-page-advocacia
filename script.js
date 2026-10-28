// Add the firm's confirmed WhatsApp number in international format, digits only.
const WHATSAPP_NUMBER = '';

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 24);
}

function closeMenu() {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';

  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  nav.classList.toggle('open', !isOpen);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});

const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -35px 0px',
  });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

document.querySelector('#year').textContent = new Date().getFullYear();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  status.classList.remove('error');

  if (!form.reportValidity()) return;

  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    status.textContent = 'Configure o número oficial do WhatsApp do escritório para habilitar o envio.';
    status.classList.add('error');
    return;
  }

  const data = new FormData(form);
  const message = [
    `Olá, meu nome é ${data.get('name')}.`,
    `Telefone: ${data.get('phone')}.`,
    data.get('area') ? `Área de interesse: ${data.get('area')}.` : '',
    `Mensagem: ${data.get('message')}`,
  ]
    .filter(Boolean)
    .join('\n');

  status.textContent = 'Abrindo o WhatsApp para você revisar e enviar a mensagem.';
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    '_blank',
    'noopener,noreferrer',
  );
});
