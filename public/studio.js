(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  var MODULES = {
    softening: {
      num: '01',
      purpose: 'Turn blunt instructions into requests that still carry full authority.',
      instructions: 'Paste an email, message, or sentence that may read as abrupt. The coach keeps your decision intact and adjusts phrasing so it lands as confident, not cold.',
      label: 'Your draft message',
      placeholder: 'e.g. You must sign this contract today.',
      button: 'Soften with coach',
      examples: window.STUDIO_TEMPLATES.softening,
      sample: {
        output: 'Could you share the revised numbers by end of day tomorrow? The current version does not yet meet what we need for the review, and I would like us to get it right together.',
        note: 'Notice the decision has not moved: the deadline and the standard are both still there. We simply replaced the verdict ("not acceptable") with the gap ("does not yet meet what we need"). Senior Western counterparts hear that as calm control.'
      }
    },
    pushback: {
      num: '02',
      purpose: 'Decline, disagree, or hold a position without closing the door.',
      instructions: 'Describe the request you need to refuse or the point you disagree with. The coach drafts a reply that states your position clearly and leaves a constructive next step.',
      label: 'What are you pushing back on?',
      placeholder: 'e.g. We cannot launch tomorrow. The server is completely broken.',
      button: 'Draft pushback',
      examples: window.STUDIO_TEMPLATES.pushback,
      sample: {
        output: 'I appreciate the urgency on both points, and I want to be straightforward with you: we can meet one of them, not both. If the earlier delivery date matters most, we can commit to it at current pricing. If price is the priority, we can hold the original schedule and discuss volume terms. Which would serve you better?',
        note: 'A firm "not both" followed by two real options. You are not refusing them; you are making them choose. That is the posture of someone in charge of the outcome.'
      }
    },
    zoom: {
      num: '03',
      purpose: 'Anchor a video meeting: open, redirect, interrupt, and close with presence.',
      instructions: 'Describe the meeting moment you need to manage. The coach gives you short, speakable lines with timing cues, sized for a live call.',
      label: 'Describe the meeting moment',
      placeholder: 'e.g. I need to break my silence and add an idea right now.',
      button: 'Prepare my lines',
      examples: window.STUDIO_TEMPLATES.zoom,
      sample: {
        output: 'Interrupt (raise a hand, wait for a breath):\n"Michael, may I come in here for a moment?"\n\nAcknowledge:\n"This is useful context, thank you."\n\nRedirect:\n"In the interest of time, I would like to move us to item three, the delivery plan. Let us capture the remaining points in a short follow-up note."',
        note: 'Using the speaker\'s name is the key. It stops the flow politely and signals that you are chairing. Keep each line under ten words when interrupting on a call; latency punishes long sentences.'
      }
    },
    'supply-chain': {
      num: '04',
      purpose: 'Present delays, risks, and recovery plans with calm, factual authority.',
      instructions: 'Share the supply chain situation in plain terms. The coach structures it as situation, impact, action, and ask, in language that reassures without over-apologising.',
      label: 'Situation summary',
      placeholder: 'e.g. Chip yield went up 4% this month.',
      button: 'Structure my update',
      examples: window.STUDIO_TEMPLATES['supply-chain'],
      sample: {
        output: 'Situation: Our wafer shipment is running three weeks behind due to congestion at the port of origin.\n\nImpact: Two customer orders are affected. All other commitments remain on schedule.\n\nAction: We have activated our backup supplier, which covers roughly 40 percent of the shortfall, and we are reviewing air freight for the balance.\n\nAsk: I would like your agreement on which of the two orders to prioritise by Thursday.',
        note: 'One apology at most, and only if you were at fault. Executives build trust by owning the plan, not the problem. Ending on a clear ask turns a bad-news update into a decision meeting you lead.'
      }
    }
  };
  var ORDER = ['softening', 'pushback', 'zoom', 'supply-chain'];
  var COUNTRY_LABEL = { korea: 'Korea', japan: 'Japan', taiwan: 'Taiwan' };

  var state = { module: 'softening', country: 'korea', tone: 'balanced', configured: null, genPending: false, chatPending: false, leadPending: false, mods: {} };
  ORDER.forEach(function (m) { state.mods[m] = { text: '', output: null, coachNote: null, submittedText: '', messages: [] }; });

  var SPIN = '<svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.2-8.6"/></svg>';
  var ERR_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>';

  function showError(el, msg) {
    el.innerHTML = ERR_ICON;
    var s = document.createElement('span'); s.textContent = msg; el.appendChild(s);
    el.classList.remove('hidden');
  }
  function hide(el) { el.classList.add('hidden'); }

  async function api(path, opts) {
    var res;
    try {
      res = await fetch(path, Object.assign({ headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, credentials: 'include' }, opts || {}));
    } catch (e) { throw new Error('Could not reach the studio server. Check your connection and try again.'); }
    var data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    if (!res.ok) throw new Error((data && data.error) || ('Request failed (' + res.status + '). Please try again.'));
    if (!data) throw new Error('The server returned an unexpected response.');
    return data;
  }

  /* Status */
  function setStatus(s) {
    var pill = $('status-pill');
    if (s === true) { pill.dataset.state = 'on'; $('status-text').textContent = 'Coach engine ready'; }
    else if (s === false) { pill.dataset.state = 'off'; $('status-text').textContent = 'AI not configured: examples only'; showError($('gen-error'), 'The AI coach is not configured on this server, so live coaching and chat are unavailable. The output shown is an illustrative example only.'); }
    else { pill.dataset.state = 'off'; $('status-text').textContent = 'Status unavailable'; }
  }
  api('/studio-api/status', { method: 'GET' }).then(function (d) { state.configured = !!d.configured; setStatus(state.configured); })
    .catch(function () { state.configured = null; setStatus(null); });

  /* Rendering */
  function renderModule() {
    var cfg = MODULES[state.module], ms = state.mods[state.module];
    document.querySelectorAll('.tab').forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.module === state.module)); });
    $('mod-eyebrow').textContent = 'Module ' + cfg.num;
    $('mod-purpose').textContent = cfg.purpose;
    $('mod-instructions').textContent = cfg.instructions;
    $('input-label').textContent = cfg.label;
    var ta = $('input-text'); ta.placeholder = cfg.placeholder; ta.value = ms.text; updateCount();
    $('gen-btn-label').textContent = cfg.button;
    var ex = $('examples'); ex.innerHTML = '';
    cfg.examples.forEach(function (e, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'chip';
      b.setAttribute('data-testid', 'button-example-' + i);
      b.textContent = String(i + 1).padStart(2, '0') + '. ' + e.text;
      b.title = e.context || e.text;
      b.addEventListener('click', function () { ta.value = e.text; ms.text = e.text; updateCount(); ta.focus(); });
      ex.appendChild(b);
    });
    hide($('gen-error'));
    renderOutput(); renderChat();
  }

  function renderOutput() {
    var cfg = MODULES[state.module], ms = state.mods[state.module];
    var live = ms.output !== null;
    var doc = $('output-doc');
    doc.textContent = live ? ms.output : cfg.sample.output;
    doc.classList.toggle('example', !live);
    $('coach-note').textContent = live ? (ms.coachNote || 'No additional note for this one.') : cfg.sample.note;
    var tag = $('output-tag');
    tag.className = live ? 'tag-live' : 'tag-example';
    tag.textContent = live ? 'Your coached result' : 'Illustrative example';
    $('example-note').classList.toggle('hidden', live);
    doc.classList.remove('fade-in'); void doc.offsetWidth; doc.classList.add('fade-in');
  }

  function renderChat() {
    var ms = state.mods[state.module], log = $('chat-log');
    var has = ms.output !== null;
    $('chat-empty').classList.toggle('hidden', has && ms.messages.length > 0 ? true : has);
    if (has && ms.messages.length === 0) { $('chat-empty').classList.add('hidden'); }
    if (!has) $('chat-empty').classList.remove('hidden');
    log.innerHTML = '';
    log.classList.toggle('hidden', ms.messages.length === 0);
    ms.messages.forEach(function (m, i) {
      var d = document.createElement('div'); d.className = 'msg ' + m.role;
      d.setAttribute('data-testid', 'text-chat-' + i);
      var w = document.createElement('span'); w.className = 'who'; w.textContent = m.role === 'user' ? 'You' : 'Coach';
      var c = document.createElement('span'); c.textContent = m.content;
      d.appendChild(w); d.appendChild(c); log.appendChild(d);
    });
    log.scrollTop = log.scrollHeight;
    var disabled = !has || state.chatPending;
    $('chat-input').disabled = !has;
    $('chat-btn').disabled = disabled;
    $('chat-input').placeholder = has ? 'e.g. Can you make the second sentence less formal?' : 'Available after you generate a coached version';
    hide($('chat-error'));
  }

  function updateCount() { $('char-count').textContent = $('input-text').value.length; }

  function setCountry(c) {
    var landingPages = { korea: 'korea.html', japan: 'japan.html', taiwan: 'taiwan.html' };
    if (!Object.prototype.hasOwnProperty.call(landingPages, c)) c = 'korea';
    state.country = c;
    document.querySelectorAll('#country-seg button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.country === c)); });
    $('lead-country').value = c;
    $('return-link').setAttribute('href', landingPages[c]);
    $('return-label').textContent = COUNTRY_LABEL[c] + ' executive programme';
  }

  /* Events */
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () { state.module = t.dataset.module; renderModule(); });
  });
  $('input-text').addEventListener('input', function (e) { state.mods[state.module].text = e.target.value; updateCount(); });
  document.querySelectorAll('#tone-seg button').forEach(function (b) {
    b.addEventListener('click', function () {
      state.tone = b.dataset.tone;
      document.querySelectorAll('#tone-seg button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });
  document.querySelectorAll('#country-seg button').forEach(function (b) { b.addEventListener('click', function () { setCountry(b.dataset.country); }); });
  $('lead-country').addEventListener('change', function (e) { setCountry(e.target.value); });

  $('gen-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (state.genPending) return;
    var mod = state.module, ms = state.mods[mod];
    var text = $('input-text').value.trim();
    var errEl = $('gen-error'); hide(errEl);
    if (!text) { showError(errEl, 'Add some text first, or pick one of the examples.'); return; }
    if (text.length > 6000) { showError(errEl, 'Please keep your text under 6000 characters.'); return; }
    if (state.configured === false) { showError(errEl, 'The AI coach is not configured on this server yet, so no coaching can be generated. The example above is illustrative only.'); return; }
    state.genPending = true;
    var btn = $('gen-btn'), label = MODULES[mod].button;
    btn.disabled = true; btn.querySelector('svg').outerHTML = SPIN; $('gen-btn-label').textContent = 'Coaching...';
    $('output-skeleton').classList.remove('hidden'); $('output-doc').classList.add('hidden');
    try {
      var d = await api('/studio-api/generate', { method: 'POST', body: JSON.stringify({ module: mod, text: text, country: state.country, tone: state.tone }) });
      ms.output = String(d.output || ''); ms.coachNote = d.coachNote ? String(d.coachNote) : ''; ms.submittedText = text; ms.messages = [];
    } catch (err) {
      if (state.module === mod) showError(errEl, err.message);
    } finally {
      state.genPending = false; btn.disabled = false;
      btn.querySelector('svg').outerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
      $('gen-btn-label').textContent = MODULES[state.module].button || label;
      $('output-skeleton').classList.add('hidden'); $('output-doc').classList.remove('hidden');
      if (state.module === mod) { renderOutput(); renderChat(); }
    }
  });

  $('copy-btn').addEventListener('click', async function () {
    var text = $('output-doc').textContent, l = $('copy-label');
    try { await navigator.clipboard.writeText(text); l.textContent = 'Copied'; }
    catch (e) { l.textContent = 'Copy failed'; }
    setTimeout(function () { l.textContent = 'Copy'; }, 1600);
  });

  $('chat-clear').addEventListener('click', function () { if (state.chatPending) return; state.mods[state.module].messages = []; renderChat(); });

  $('chat-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (state.chatPending) return;
    var mod = state.module, ms = state.mods[mod], input = $('chat-input'), errEl = $('chat-error');
    var q = input.value.trim(); hide(errEl);
    if (ms.output === null || !q) return;
    if (state.configured === false) { showError(errEl, 'The AI coach is not configured on this server, so follow-up chat is unavailable.'); return; }
    var history = ms.messages.concat([{ role: 'user', content: q }]).slice(-20);
    ms.messages.push({ role: 'user', content: q }); input.value = '';
    state.chatPending = true; renderChat();
    $('chat-btn-label').textContent = '...';
    try {
      var d = await api('/studio-api/chat', { method: 'POST', body: JSON.stringify({ module: mod, text: ms.submittedText, output: ms.output, messages: history }) });
      if (state.mods[mod].output === ms.output) ms.messages.push({ role: 'assistant', content: String(d.reply || '') });
      state.chatPending = false; $('chat-btn-label').textContent = 'Ask';
      if (state.module === mod) renderChat();
    } catch (err) {
      ms.messages.pop(); input.value = q;
      state.chatPending = false; $('chat-btn-label').textContent = 'Ask';
      if (state.module === mod) { renderChat(); showError(errEl, err.message); }
    }
  });

  $('lead-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (state.leadPending) return;
    var errEl = $('lead-error'), ok = $('lead-ok'); hide(errEl); hide(ok);
    var body = {
      name: $('lead-name').value.trim(), email: $('lead-email').value.trim(), phone: $('lead-phone').value.trim(),
      lineId: $('lead-line').value.trim(), country: $('lead-country').value, consent: $('lead-consent').checked
    };
    if (!body.name) return showError(errEl, 'Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return showError(errEl, 'Please enter a valid email address.');
    if (!body.consent) return showError(errEl, 'Please confirm consent so we can store your details for coaching contact.');
    state.leadPending = true; var btn = $('lead-btn'); btn.disabled = true; $('lead-btn-label').textContent = 'Saving...';
    try {
      var d = await api('/studio-api/leads', { method: 'POST', body: JSON.stringify(body) });
      if (!d.success) throw new Error('Your details could not be saved. Please try again.');
      ok.textContent = 'Saved. Your details are stored and a coach can now reach you about coaching.';
      ok.classList.remove('hidden');
      ['lead-name', 'lead-email', 'lead-phone', 'lead-line'].forEach(function (id) { $(id).value = ''; });
      $('lead-consent').checked = false;
    } catch (err) { showError(errEl, err.message); }
    finally { state.leadPending = false; btn.disabled = false; $('lead-btn-label').textContent = 'Request coaching contact'; }
  });

  setCountry(new URLSearchParams(window.location.search).get('country') || 'korea');
  renderModule();
})();
