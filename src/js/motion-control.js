// Pause buttons for motion that plays by itself: animated GIFs and looping
// autoplay videos that have no controls of their own. Loaded by site-core, so
// any GIF added to a page later gets a button without extra markup.
// Opt out with data-motion-control="off" (used where a script drives the GIF).
import '../css/motion-control.css';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ICONS = {
  pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 3h3v10H4zM9 3h3v10H9z"/></svg>',
  play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>',
};

// A GIF has no pause, so pausing swaps in a still of the frame on screen.
function gifPlayer(img) {
  const animated = img.src;
  return {
    pause() {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      img.src = canvas.toDataURL('image/png');
    },
    play() {
      img.src = animated;
    },
    ready: (run) =>
      img.complete && img.naturalWidth ? run() : img.addEventListener('load', run, { once: true }),
  };
}

function videoPlayer(video) {
  return {
    pause: () => video.pause(),
    play: () => video.play().catch(() => {}),
    ready: (run) => run(),
  };
}

function attach(media, player, noun) {
  // A button cannot live inside a link, so when the media sits in a linked
  // tile the button goes after the link instead.
  const link = media.closest('a');
  const host = link ? link.parentElement : media.parentElement;
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'motion-control';
  if (link) link.after(button);
  else media.after(button);

  let playing = true;
  function render() {
    button.innerHTML = playing ? ICONS.pause : ICONS.play;
    button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${noun}`);
  }
  function set(next) {
    if (next === playing) return;
    playing = next;
    if (playing) player.play();
    else player.pause();
    render();
  }
  button.addEventListener('click', () => set(!playing));

  // Pin the button to the media's own bottom right corner, wherever the
  // media sits inside its tile.
  function place() {
    const m = media.getBoundingClientRect();
    const h = host.getBoundingClientRect();
    button.style.left = `${m.right - h.left - host.clientLeft - 48}px`;
    button.style.top = `${m.bottom - h.top - host.clientTop - 48}px`;
  }
  new ResizeObserver(place).observe(host);
  new ResizeObserver(place).observe(media);
  window.addEventListener('resize', place);

  render();
  player.ready(() => {
    place();
    // Visitors who ask their system for less motion start with it stopped.
    if (reducedMotion) set(false);
  });
}

function init() {
  const skip = '[data-motion-control="off"]';
  document.querySelectorAll(`img[src$=".gif"]:not(${skip})`).forEach((img) => {
    attach(img, gifPlayer(img), 'animation');
  });
  document
    .querySelectorAll(`video[autoplay][loop]:not([controls]):not(${skip})`)
    .forEach((video) => attach(video, videoPlayer(video), 'video'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
