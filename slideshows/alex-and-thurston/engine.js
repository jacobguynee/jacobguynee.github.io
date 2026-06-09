/* ── Scaling engine ─────────────────────────────── *
 * Measures viewport, computes scale = min(vw/1400, vh/800),
 * applies CSS transform: scale() to every .slide.
 * Pure transform — no zoom, no layout change.
 */
const SLIDE_W = 1400, SLIDE_H = 800;
function rescale() {
  const vw = window.innerWidth, vh = window.innerHeight;
  const scale = Math.min(vw / SLIDE_W, vh / SLIDE_H) * 0.96; // 4% margin
  document.querySelectorAll('.slide').forEach(s => {
    s.style.transform = `translate(-50%, -50%) scale(${scale})`;
    s.style.left = '50%';
    s.style.top = '50%';
  });
}
window.addEventListener('resize', rescale);
document.addEventListener('fullscreenchange', () => setTimeout(rescale, 50));

/* ── Slide & fragment navigation ────────────────── */
const slides = Array.from(document.querySelectorAll('.slide'));
let currentSlide = 0;

/* Build fragment order per slide.
 * Rules:
 *   - No data-fi:        auto-increment (next step after previous)
 *   - data-fi="same":    same step as previous fragment
 *   - data-fi="N":       jump to step N, auto continues from N+1
 */
slides.forEach(slide => {
  const frags = Array.from(slide.querySelectorAll('.frag'));
  const steps = {};  // stepIndex → [frag, frag, ...]
  let idx = 0;

  frags.forEach(f => {
    const fi = f.dataset.fi;
    if (fi === undefined || fi === '') {
      idx++;
      if (!steps[idx]) steps[idx] = [];
      steps[idx].push(f);
    } else if (fi === 'same') {
      if (!steps[idx]) steps[idx] = [];
      steps[idx].push(f);
    } else {
      idx = parseInt(fi);
      if (!steps[idx]) steps[idx] = [];
      steps[idx].push(f);
    }
  });

  const keys = Object.keys(steps).map(Number).sort((a, b) => a - b);
  slide._fragSteps = keys.map(k => steps[k]);
  slide._fragPos = -1;
});

// Build progress dots
const progressEl = document.getElementById('progress');
slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  dot.addEventListener('click', () => showSlide(i));
  progressEl.appendChild(dot);
});

function updateProgress() {
  progressEl.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function showSlide(idx) {
  slides.forEach((s, i) => s.classList.toggle('active', i === idx));
  currentSlide = idx;
  updateHash();
  updateProgress();
}

function advance() {
  const slide = slides[currentSlide];
  if (slide._fragPos < slide._fragSteps.length - 1) {
    slide._fragPos++;
    const step = slide._fragSteps[slide._fragPos];
    step.forEach(f => {
      f.classList.add('visible');
      handleTrigger(f, true);
    });
    // Auto-advance to next step after delay if any fragment requests it
    const autoNext = step.find(f => f.dataset.autoNext);
    if (autoNext) {
      setTimeout(() => advance(), parseInt(autoNext.dataset.autoNext));
    }
  } else if (currentSlide < slides.length - 1) {
    showSlide(currentSlide + 1);
  }
}

function retreat() {
  const slide = slides[currentSlide];
  if (slide._fragPos >= 0) {
    const step = slide._fragSteps[slide._fragPos];
    step.forEach(f => {
      f.classList.remove('visible');
      handleTrigger(f, false);
    });
    slide._fragPos--;
  } else if (currentSlide > 0) {
    showSlide(currentSlide - 1);
    // Show all fragments on previous slide
    const prev = slides[currentSlide];
    prev._fragSteps.forEach(step => step.forEach(f => {
      f.classList.add('visible');
      handleTrigger(f, true);
    }));
    prev._fragPos = prev._fragSteps.length - 1;
  }
}

/* ── Trigger system (slide-scoped) ───────────── *
 * Elements use data-name="foo" instead of id="foo".
 * Triggers reference data-name values, scoped to the parent .slide.
 * This means slides are self-contained — duplicating requires no ID changes.
 */
function findInSlide(frag, name) {
  const slide = frag.closest('.slide');
  return slide.querySelector(`[data-name="${name}"]`);
}
function findAllInSlide(frag, names) {
  return names.split(',').map(n => findInSlide(frag, n.trim())).filter(Boolean);
}

function handleTrigger(frag, show) {
  const { trigger, split, target, alsoShow, alsoHide } = frag.dataset;
  if (!trigger && !alsoShow && !alsoHide && !frag.dataset.fadeout && !frag.dataset.blur && !frag.dataset.unblur && !frag.dataset.collapse) return;
  if (trigger === 'split' || trigger === 'unsplit') {
    const el = findInSlide(frag, split);
    el.classList.toggle('active', (trigger === 'split') === show);
  }
  if (trigger === 'show') {
    findAllInSlide(frag, target).forEach(el => {
      if (el.dataset.hidden !== undefined) {
        if (show) {
          el.style.display = '';
          el.offsetHeight; // force reflow so transition works
        } else {
          el.classList.remove('visible');
          el.style.display = 'none';
          return;
        }
      }
      el.classList.toggle('visible', show);
    });
  }
  if (alsoShow) {
    findAllInSlide(frag, alsoShow).forEach(el => {
      if (el.dataset.hidden !== undefined) {
        if (show) {
          el.style.display = '';
          el.offsetHeight;
        } else {
          el.classList.remove('visible');
          el.style.display = 'none';
          return;
        }
      }
      el.classList.toggle('visible', show);
    });
  }
  if (alsoHide) {
    findAllInSlide(frag, alsoHide).forEach(el => {
      el.classList.toggle('visible', !show);
    });
  }
  if (frag.dataset.fadeout) {
    findAllInSlide(frag, frag.dataset.fadeout).forEach(el => {
      el.classList.toggle('hidden-out', show);
    });
  }
  if (frag.dataset.blur) {
    findAllInSlide(frag, frag.dataset.blur).forEach(el => {
      el.classList.toggle('blurred', show);
    });
  }
  if (frag.dataset.unblur) {
    findAllInSlide(frag, frag.dataset.unblur).forEach(el => {
      el.classList.toggle('blurred', !show);
    });
  }
  const collapse = frag.dataset.collapse;
  if (collapse) {
    findAllInSlide(frag, collapse).forEach(el => {
      if (frag.dataset.animateCollapse) {
        // Animated collapse: wipe link-bullet, everything below slides up together
        if (show) {
          const meridian = findInSlide(frag, 'meridian-bullet');
          if (meridian) { meridian.style.display = ''; meridian.classList.add('visible'); }
          el.classList.add('collapsed');
        } else {
          el.classList.remove('collapsed');
          const meridian = findInSlide(frag, 'meridian-bullet');
          if (meridian) { meridian.style.display = 'none'; meridian.classList.remove('visible'); }
        }
      } else {
        // Simple collapse
        el.classList.toggle('collapsed', show);
      }
    });
  }
}

/* ── Woosh auto-cleanup ─────────────────────────── */
document.addEventListener('animationend', e => {
  if (e.target.classList.contains('woosh-text')) {
    e.target.classList.remove('visible');
    // Also hide the backdrop
    const slide = e.target.closest('.slide');
    const backdrop = slide && slide.querySelector('.woosh-backdrop');
    if (backdrop) backdrop.classList.remove('visible');
  }
});

/* ── Input handlers ─────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); advance(); }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'Backspace') { e.preventDefault(); retreat(); }
});
document.getElementById('nav-next').addEventListener('click', advance);
document.getElementById('nav-prev').addEventListener('click', retreat);
document.getElementById('fullscreen-btn').addEventListener('click', () => {
  document.documentElement.requestFullscreen();
});

/* ── Init ────────────────────────────────────────── */
renderMathInElement(document.body, {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$',  right: '$',  display: false }
  ],
  throwOnError: false
});
rescale();
const startSlide = parseInt(location.hash.replace('#','')) || 0;
showSlide(startSlide);

function updateHash() {
  history.replaceState(null, "", `#${currentSlide}`);
}
