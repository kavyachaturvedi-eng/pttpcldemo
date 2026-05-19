/* ============================================================
   DevX UpTime AI — Prototype interactions
   ============================================================ */

(function() {
  'use strict';

  // ─────────── VIEW ROUTER ───────────
  const views = document.querySelectorAll('.view');
  const navItems = document.querySelectorAll('[data-view]');

  function switchView(viewId) {
    views.forEach(v => v.classList.remove('active'));
    const target = document.getElementById('view-' + viewId);
    if (target) target.classList.add('active');

    // sync sidenav
    document.querySelectorAll('.sidenav .nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.view === viewId);
    });

    // scroll to top of main
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // special: re-animate RCA on Diagnostician
    if (viewId === 'diagnostician') {
      animateRcaGeneration();
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const v = item.dataset.view;
      if (v) {
        switchView(v);
        const hudIdx = HUD_SCRIPT.findIndex(s => s.view === v);
        if (hudIdx >= 0) updateHud(hudIdx);
      }
    });
  });

  // ─────────── RCA GENERATION ANIMATION ───────────
  function animateRcaGeneration() {
    const stages = document.querySelectorAll('.gen-stage');
    // Reset
    stages.forEach(s => s.classList.remove('active'));
    // Animate sequentially
    stages.forEach((stage, i) => {
      setTimeout(() => {
        stage.classList.add('active');
      }, i * 400);
    });
  }

  const regen = document.getElementById('regenerateRca');
  if (regen) regen.addEventListener('click', animateRcaGeneration);

  // ─────────── APPROVAL FLOW ───────────
  const approveBtn = document.getElementById('approveBtn');
  const approvalSuccess = document.getElementById('approvalSuccess');
  if (approveBtn) {
    approveBtn.addEventListener('click', () => {
      approveBtn.style.display = 'none';
      document.querySelectorAll('.approval-actions .btn-secondary, .approval-actions .btn-text').forEach(b => b.style.display = 'none');
      if (approvalSuccess) approvalSuccess.classList.add('shown');

      // Animate workflow step
      const activeStep = document.querySelector('.wf-step.active');
      if (activeStep) {
        activeStep.classList.remove('active');
        activeStep.classList.add('done');
        activeStep.querySelector('.wf-icon').textContent = '✓';
        activeStep.querySelector('.wf-meta').textContent = 'Approved 02:48 ICT';
      }
      const nextPending = document.querySelector('.wf-step.pending');
      if (nextPending) {
        nextPending.classList.remove('pending');
        nextPending.classList.add('active');
        nextPending.querySelector('.wf-icon').textContent = '→';
        nextPending.querySelector('.wf-meta').textContent = 'In progress';
      }

      // Add audit row
      const auditTrail = document.querySelector('.audit-trail');
      const pendingRow = document.querySelector('.audit-row.pending');
      if (pendingRow && auditTrail) {
        pendingRow.classList.remove('pending');
        pendingRow.querySelector('.audit-time').textContent = '02:48:11';
        pendingRow.querySelector('.audit-source').textContent = 'ENGINEER';
        pendingRow.querySelector('.audit-event').textContent = 'Reliability Engineer · Approved recommendation · WO-2026-05-19-0247 created';
      }
    });
  }

  // ─────────── LANGUAGE TOGGLE ───────────
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const active = langToggle.querySelector('.lang-active');
      const inactive = langToggle.querySelector('.lang-inactive');
      const tmp = active.textContent;
      active.textContent = inactive.textContent;
      inactive.textContent = tmp;
      // Light visual feedback
      langToggle.style.background = 'var(--accent-soft)';
      setTimeout(() => { langToggle.style.background = ''; }, 300);
    });
  }

  // ─────────── DEMO HUD ───────────
  const HUD_SCRIPT = [
    {
      view: 'dashboard',
      label: 'Step 1 of 7',
      text: '02:47 AM Sriracha Refinery. This is the canvas a reliability engineer signs into. 4 alerts active. Note the critical one on P-204 — Sentinel just flagged it 11 minutes ago. Click into it.'
    },
    {
      view: 'asset',
      label: 'Step 2 of 7',
      text: 'P-204 is a crude feed pump on CDU-1 — A1 criticality, no standby. The Sentinel banner shows the early warning: 14 days to action threshold. The chart shows 90 days of vibration. Notice the drift starting 60 days ago, the orange forecast band. This is the early warning a reactive approach would never see.'
    },
    {
      view: 'diagnostician',
      label: 'Step 3 of 7',
      text: 'Click Run Diagnostician and 28 seconds later you have a full RCA. Watch the generation stages — 5 data sources pulled, cross-referenced, hypothesis formed. Every claim has a citation. The recommendation: lubricant sample first, not bearing replacement. That nuance comes from past incidents.'
    },
    {
      view: 'memory',
      label: 'Step 4 of 7',
      text: 'Memory queried 2,847 indexed incidents and found 3 matches. The top one is P-204 itself from 2022 — same signature, resolved by oil change. And read that engineer note in yellow — a retiring senior engineer captured exactly this pattern. That knowledge stays with you when they retire.'
    },
    {
      view: 'turnaround',
      label: 'Step 5 of 7',
      text: 'Now zoom out. The Turnaround Optimizer is preparing the Q3 turnaround scope. It defers 41 low-risk items, adds 8 high-risk items Sentinel surfaced — including bearing replacement for P-204. Net: 3.2 days shorter turnaround. This is custom-built scope intelligence.'
    },
    {
      view: 'action',
      label: 'Step 6 of 7',
      text: 'Critical point: nothing autonomous. Engineer reviews and approves. Approval creates a SAP work order and triggers your MOC workflow. Click Approve and watch the workflow advance and the audit trail update. Every step explainable, every action traceable.'
    },
    {
      view: 'outcomes',
      label: 'Step 7 of 7',
      text: 'In 12 minutes we have shown all four agents work together end-to-end on a real scenario. The structural shift: engineer time, captured knowledge, optimized turnarounds, cited evidence. Custom-built around your operations means outcomes platforms can not deliver.'
    }
  ];

  let hudIndex = 0;
  const hudToggle = document.getElementById('hudToggle');
  const hudContent = document.getElementById('hudContent');
  const hudScript = document.getElementById('hudScript');
  const hudTime = document.getElementById('hudTime');
  const hudPrev = document.getElementById('hudPrev');
  const hudNext = document.getElementById('hudNext');

  function updateHud(idx) {
    hudIndex = Math.max(0, Math.min(HUD_SCRIPT.length - 1, idx));
    const s = HUD_SCRIPT[hudIndex];
    if (hudScript) hudScript.textContent = s.text;
    if (hudTime) hudTime.textContent = s.label;
    if (hudPrev) hudPrev.disabled = hudIndex === 0;
    if (hudNext) hudNext.textContent = hudIndex === HUD_SCRIPT.length - 1 ? 'Restart' : 'Next →';
  }

  function advanceHud(direction) {
    const newIdx = hudIndex + direction;
    if (newIdx >= HUD_SCRIPT.length) {
      // restart
      hudIndex = 0;
    } else if (newIdx < 0) {
      hudIndex = 0;
    } else {
      hudIndex = newIdx;
    }
    const s = HUD_SCRIPT[hudIndex];
    switchView(s.view);
    updateHud(hudIndex);
  }

  if (hudToggle && hudContent) {
    hudToggle.addEventListener('click', () => {
      hudContent.classList.toggle('shown');
    });
  }

  if (hudNext) hudNext.addEventListener('click', () => advanceHud(1));
  if (hudPrev) hudPrev.addEventListener('click', () => advanceHud(-1));

  // Keyboard shortcuts for demo presenter
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      advanceHud(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      advanceHud(-1);
    } else if (e.key === 'h' || e.key === 'H') {
      if (hudContent) hudContent.classList.toggle('shown');
    }
  });

  // Initialize HUD as open
  updateHud(0);
  if (hudContent) hudContent.classList.add('shown');

  // ─────────── INITIAL ANIMATION ───────────
  // If page loads on Diagnostician view, animate immediately
  if (document.querySelector('#view-diagnostician.active')) {
    animateRcaGeneration();
  }

  // ─────────── MEMORY SEARCH (visual only) ───────────
  const memorySearch = document.getElementById('memorySearch');
  if (memorySearch) {
    memorySearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Visual pulse
        const meta = document.querySelector('.search-meta');
        if (meta) {
          meta.style.opacity = '0.5';
          setTimeout(() => { meta.style.opacity = '1'; }, 400);
        }
      }
    });
  }

})();
