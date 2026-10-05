document.getElementById('year').textContent = new Date().getFullYear();
const workflow = document.getElementById('workflow-content');
const modes = {
 before: { steps: ['Fragmented metrics', 'Manual report assembly', 'Hours of production'], text: 'Time spent gathering and assembling metrics before the weekly review.' },
 after: { steps: ['SQL-backed metrics', 'Centralized CX dashboard', 'Scorecards in minutes'], text: 'A shared view of performance, with less time spent producing the weekly report.' }
};
document.querySelectorAll('[data-mode]').forEach(button => {
 button.addEventListener('click', () => {
  if (button.getAttribute("aria-pressed") === "true") return;
  const mode = modes[button.dataset.mode];
  workflow.closest(".lab").dataset.state = button.dataset.mode;
  document.querySelectorAll('[data-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const nodes = workflow.querySelectorAll('.node strong');
  nodes.forEach((node, index) => { node.textContent = mode.steps[index]; });
  workflow.querySelector('p').textContent = mode.text;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
   workflow.getAnimations().forEach(animation => animation.cancel());
   workflow.animate([{opacity:0.45, transform:'translateY(5px)'},{opacity:1, transform:'translateY(0)'}], {duration:260, easing:'ease-out'});
  }
 });
});

// The menu remains usable without JavaScript; enhancement only collapses it on phones.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('main-nav');
function closeMenu() {
 navigation.classList.remove('is-open');
 menuButton.setAttribute('aria-expanded', 'false');
 menuButton.querySelector('span').textContent = '+';
}
menuButton.addEventListener('click', () => {
 const open = menuButton.getAttribute('aria-expanded') !== 'true';
 navigation.classList.toggle('is-open', open);
 menuButton.setAttribute('aria-expanded', String(open));
 menuButton.querySelector('span').textContent = open ? '−' : '+';
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
 if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
  closeMenu(); menuButton.focus();
 }
});
const sections = [...document.querySelectorAll('main section[id]')];
let scrollPending = false;
function updateNavigation() {
 const offset = document.querySelector('header').getBoundingClientRect().height + 90;
 let active = null;
 sections.forEach(section => { if (section.getBoundingClientRect().top <= offset) active = section.id; });
 if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10) active = 'contact';
 navigation.querySelectorAll('a').forEach(link => {
  if (link.hash === '#' + active) link.setAttribute('aria-current', 'location');
  else link.removeAttribute('aria-current');
 });
 scrollPending = false;
}
window.addEventListener('scroll', () => {
 if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateNavigation); }
}, {passive:true});
window.addEventListener('resize', updateNavigation);
updateNavigation();
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
 const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (entry.isIntersecting) { entry.target.classList.add('in-view'); reveal.unobserve(entry.target); }
  });
 }, {threshold:0.08});
 document.querySelectorAll('.case, .lab, .section-head').forEach(item => {
  item.classList.add('reveal-ready'); reveal.observe(item);
 });
}
