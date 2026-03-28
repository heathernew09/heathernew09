// Global Section Manager - Prevents cross-contamination between interactive sections
class SectionManager {
  constructor() {
    this.activeSection = null;
    this.sections = new Map();
  }

  register(sectionId, activateFn, deactivateFn) {
    this.sections.set(sectionId, {
      activate: activateFn,
      deactivate: deactivateFn,
      isActive: false,
    });

    // If this section is already in view when registered, activate it
    const el = document.getElementById(sectionId);
    if (el && el.getAttribute('data-is-intersecting') === 'true') {
      this.activate(sectionId);
    }
  }

  activate(sectionId) {
    if (this.activeSection && this.activeSection !== sectionId) {
      const current = this.sections.get(this.activeSection);
      if (current && current.isActive) {
        current.deactivate();
        current.isActive = false;
      }
    }

    const section = this.sections.get(sectionId);
    if (section && !section.isActive) {
      section.activate();
      section.isActive = true;
      this.activeSection = sectionId;
    }
  }

  deactivate(sectionId) {
    const section = this.sections.get(sectionId);
    if (section && section.isActive) {
      section.deactivate();
      section.isActive = false;
    }
    if (this.activeSection === sectionId) {
      this.activeSection = null;
    }
  }
}

// Global instance
window.sectionManager = window.sectionManager || new SectionManager();

// --- 1. THE OBSERVER LOGIC ---

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      if (!id) return;

      if (entry.isIntersecting) {
        entry.target.setAttribute('data-is-intersecting', 'true');
        entry.target.style.pointerEvents = 'auto';
        window.sectionManager.activate(id);
      } else {
        entry.target.setAttribute('data-is-intersecting', 'false');
        entry.target.style.pointerEvents = 'none';
        window.sectionManager.deactivate(id);
      }
    });
  },
  {
    threshold: 0.1,
  }
);

// --- 2. THE DYNAMIC WATCHER (MutationObserver) ---
// This ensures that sections loaded via include.js are caught
const domWatcher = new MutationObserver(() => {
  document.querySelectorAll('section[id], [data-include][id]').forEach((sec) => {
    // Only observe if we aren't already watching this element
    if (sec.getAttribute('data-observed') !== 'true') {
      sectionObserver.observe(sec);
      sec.setAttribute('data-observed', 'true');
    }
  });
});

domWatcher.observe(document.body, { childList: true, subtree: true });

// Initial scan
document.querySelectorAll('section[id]').forEach((sec) => {
  sectionObserver.observe(sec);
  sec.setAttribute('data-observed', 'true');
});
