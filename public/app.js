const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const state = {
  roomCode: new URLSearchParams(location.search).get("room")?.toUpperCase() || "",
  playerId: "",
  room: null,
  poller: null,
  timer: null,
  system: null,
  connection: "online"
};

const levels = {
  beginner: ["Beginner", "Een rustige start met de basis"],
  intermediate: ["Gevorderd", "Meer verdieping en verbanden"],
  advanced: ["Uitdaging", "Voor de serieuze kenniszoeker"]
};
const topics = {
  mixed: "Alles door elkaar",
  aqidah: "'Aqīdah",
  quran: "Qur'an",
  worship: "Aanbidding",
  seerah: "Sīrah",
  character: "Adab & karakter"
};

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

async function request(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Er ging iets mis.");
    state.connection = "online";
    return data;
  } catch (error) {
    state.connection = "offline";
    throw error;
  }
}

function home() {
  stopPolling();
  stopTimer();
  app.innerHTML = `
    <section class="screen hero">
      <div>
        <span class="eyebrow">Samen groeien in kennis</span>
        <h1>Ontdek. Speel.<br><em>Versterk je īmān.</em></h1>
        <p class="lead">Een warme, privé quizervaring voor familie en vrienden. Speel samen via dezelfde wifi, leer van duidelijke bronnen en groei — vraag voor vraag.</p>
        <div class="button-row">
          <button class="button button-primary" id="createBtn">Maak een quiz <span>→</span></button>
          <button class="button button-secondary" id="joinBtn">Doe mee met code</button>
        </div>
        <div class="features">
          <span class="feature"><i class="feature-dot"></i> Privé via eigen wifi</span>
          <span class="feature"><i class="feature-dot"></i> Bronnen bij elk antwoord</span>
          <span class="feature"><i class="feature-dot"></i> Geen account nodig</span>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="arch"></div>
        <div class="floating-card fc-top"><span class="fc-label">Onderwerp</span><strong class="fc-value">Qur'an & Sunnah</strong></div>
        <div class="floating-card fc-bottom">
          <span class="fc-label">Samen spelen</span>
          <div class="avatars"><i class="avatar av1">AK</i><i class="avatar av2">UM</i><i class="avatar av3">AS</i><i class="avatar av4">+1</i></div>
        </div>
      </div>
    </section>`;
  document.querySelector("#createBtn").onclick = () => nameScreen("create");
  document.querySelector("#joinBtn").onclick = () => nameScreen("join");
}

function nameScreen(mode) {
  stopTimer();
  const joining = mode === "join";
  app.innerHTML = `
    <section class="screen panel">
      <span class="eyebrow">${joining ? "Welkom in de kamer" : "Jouw quizavond"}</span>
      <h2>${joining ? "Doe mee" : "Maak een kamer"}</h2>
      <p class="panel-copy">${joining ? "Vul de kamercode en jouw naam in. Een kunya mag natuurlijk ook." : "Kies hoe je tijdens de quiz zichtbaar bent. Daarna stel je in alle rust de ronde samen."}</p>
      <form id="entryForm">
        ${joining ? `<div class="field"><label for="roomCode">Kamercode</label><input id="roomCode" maxlength="6" autocomplete="off" placeholder="Bijv. N00R24" value="${escapeHtml(state.roomCode)}" autofocus></div>` : ""}
        <div class="field"><label for="nickname">Nickname of kunya</label><input id="nickname" maxlength="24" autocomplete="nickname" placeholder="Bijv. Umm Maryam" autofocus></div>
        <p class="form-error" id="formError"></p>
        <button class="button button-primary" type="submit">${joining ? "Kamer binnengaan" : "Kamer aanmaken"} <span>→</span></button>
      </form>
      <button class="small-link" id="backBtn">← Terug naar home</button>
    </section>`;
  document.querySelector("#backBtn").onclick = home;
  document.querySelector("#entryForm").onsubmit = async event => {
    event.preventDefault();
    const error = document.querySelector("#formError");
    const nickname = document.querySelector("#nickname").value.trim();
    const roomCode = joining ? document.querySelector("#roomCode").value.trim().toUpperCase() : "";
    error.textContent = "";
    try {
      const result = await request(joining ? `/api/rooms/${roomCode}/join` : "/api/rooms", {
        method: "POST", body: JSON.stringify({ nickname })
      });
      state.roomCode = result.code;
      state.playerId = result.playerId;
      sessionStorage.setItem(`noor-${result.code}`, result.playerId);
      history.replaceState({}, "", `?room=${result.code}`);
      await refresh(true);
      startPolling();
    } catch (err) {
      error.textContent = err.message;
    }
  };
}

function getShareUrl(room) {
  const localBase = ["127.0.0.1", "localhost"].includes(location.hostname)
    ? state.system?.localUrls?.[0]
    : location.origin;
  return `${localBase || location.origin}${location.pathname}?room=${room.code}`;
}

function lobby(room) {
  stopTimer();
  const slots = [...room.players];
  while (slots.length < 4) slots.push(null);
  const shareUrl = getShareUrl(room);
  app.innerHTML = `
    <section class="screen panel panel-wide">
      <div class="room-top">
        <div>
          <span class="eyebrow">${room.isHost ? "Jij bent de host" : "Je bent binnen"}</span>
          <h2>${room.isHost ? "Stel de ronde samen" : "De host bereidt de quiz voor"}</h2>
        </div>
        <div class="room-code-box"><span>Kamercode</span><strong>${room.code}</strong><small>zelfde wifi</small></div>
      </div>
      <div class="join-card">
        <div class="join-symbol" aria-hidden="true">⌁</div>
        <div class="join-copy">
          <strong>Laat anderen meedoen</strong>
          <span>Open deze link op een telefoon die met hetzelfde wifi-netwerk verbonden is.</span>
          <code>${escapeHtml(shareUrl)}</code>
        </div>
        <button class="button button-secondary" id="copyBtn">Kopieer link</button>
      </div>
      <div class="grid-two">
        <div>
          <div class="section-label">Spelers · ${room.players.length}/4</div>
          <div class="player-list">
            ${slots.map((p, i) => p ? `
              <div class="player-card ${p.connected ? "" : "player-away"}">
                <span class="player-icon">${escapeHtml(p.nickname.slice(0, 2).toUpperCase())}</span>
                <span class="player-name"><strong>${escapeHtml(p.nickname)}</strong><small>${p.connected ? "Klaar om te spelen" : "Verbinding kwijt"}</small></span>
                ${p.id === room.hostId ? '<span class="host-tag">HOST</span>' : ""}
              </div>
            ` : `<div class="player-card empty-player"><span class="player-icon">+</span><span>Wachten op speler ${i + 1}</span></div>`).join("")}
          </div>
        </div>
        <div>
          <div class="section-label">Quizinstellingen</div>
          <div class="field"><label for="level">Kennisniveau</label>
            <select id="level" ${room.isHost ? "" : "disabled"}>
              ${Object.entries(levels).map(([key, val]) => `<option value="${key}" ${room.level === key ? "selected" : ""}>${val[0]} — ${val[1]}</option>`).join("")}
            </select>
          </div>
          <div class="field"><label for="topic">Onderwerp</label>
            <select id="topic" ${room.isHost ? "" : "disabled"}>
              ${Object.entries(topics).map(([key, value]) => `<option value="${key}" ${room.topic === key ? "selected" : ""}>${value}</option>`).join("")}
            </select>
          </div>
          <div class="field"><label for="duration">Tijd per vraag</label>
            <select id="duration" ${room.isHost ? "" : "disabled"}>
              ${[20, 30, 45, 60].map(value => `<option value="${value}" ${room.durationSeconds === value ? "selected" : ""}>${value} seconden</option>`).join("")}
            </select>
          </div>
        </div>
      </div>
      <div class="lobby-footer">
        <span class="waiting"><i class="pulse"></i>${room.players.length === 1 ? "Deel de link, of begin alvast alleen" : `${room.players.length} spelers klaar voor de start`}</span>
        <div class="button-row">
          <button class="button button-quiet" id="leaveBtn">Kamer verlaten</button>
          ${room.isHost ? '<button class="button button-primary" id="startBtn">Start de quiz <span>→</span></button>' : '<span>Even geduld, de host start zo.</span>'}
        </div>
      </div>
    </section>`;

  document.querySelector("#copyBtn").onclick = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      notify("Deellink gekopieerd");
    } catch (_) {
      notify("Selecteer en kopieer de link handmatig");
    }
  };
  document.querySelector("#leaveBtn").onclick = leaveRoom;

  if (room.isHost) {
    const update = async () => {
      try {
        state.room = await request(`/api/rooms/${room.code}/config`, {
          method: "POST",
          body: JSON.stringify({
            playerId: state.playerId,
            level: document.querySelector("#level").value,
            topic: document.querySelector("#topic").value,
            durationSeconds: Number(document.querySelector("#duration").value)
          })
        });
      } catch (err) { notify(err.message); }
    };
    document.querySelector("#level").onchange = update;
    document.querySelector("#topic").onchange = update;
    document.querySelector("#duration").onchange = update;
    document.querySelector("#startBtn").onclick = async () => {
      try {
        state.room = await request(`/api/rooms/${room.code}/start`, {
          method: "POST", body: JSON.stringify({ playerId: state.playerId })
        });
        render();
      } catch (err) { notify(err.message); }
    };
  }
}

function quiz(room) {
  const q = room.question;
  const answered = room.me?.answer;
  const revealed = room.phase === "reveal";
  const keys = ["A", "B", "C", "D"];
  const timerPercent = Math.max(0, Math.min(100, (room.secondsRemaining / room.durationSeconds) * 100));
  app.innerHTML = `
    <section class="screen quiz-shell">
      <div class="quiz-meta">
        <span>${escapeHtml(room.topicName)} · ${levels[room.level][0]}</span>
        <span class="connection-pill ${state.connection}"><i></i>${state.connection === "online" ? "Verbonden" : "Herverbinden…"}</span>
        <strong>Vraag ${room.questionIndex + 1} van ${room.totalQuestions}</strong>
      </div>
      <div class="progress"><span style="width:${((room.questionIndex + 1) / room.totalQuestions) * 100}%"></span></div>
      <article class="question-card">
        <div class="question-head">
          <span class="eyebrow">${revealed ? "Het antwoord" : "Kies één antwoord"}</span>
          ${!revealed ? `<div class="timer" id="timer" style="--timer:${timerPercent}%"><strong id="timerValue">${room.secondsRemaining}</strong><span>sec</span></div>` : ""}
        </div>
        <h2>${escapeHtml(q.question)}</h2>
        <div class="answers">
          ${q.options.map((option, index) => {
            let cls = "";
            if (revealed) {
              if (index === q.correct) cls = "correct";
              else if (answered?.choice === index) cls = "wrong";
              else cls = "dimmed";
            } else if (answered?.choice === index) cls = "selected";
            return `<button class="answer ${cls}" data-choice="${index}" ${answered || revealed ? "disabled" : ""}><span class="answer-key">${keys[index]}</span><span>${escapeHtml(option)}</span></button>`;
          }).join("")}
        </div>
        <div class="answer-status">
          <span>${answered ? (revealed ? (answered.correct ? `Mā shā' Allāh — +${answered.points} punten` : "Niet juist — maar wel iets geleerd") : "Antwoord opgeslagen. Neem rustig adem.") : "Kies jouw antwoord hierboven."}</span>
          ${room.isHost && room.phase === "question" ? '<button class="small-link" id="revealBtn">Antwoord onthullen</button>' : ""}
        </div>
      </article>
      <div class="quiz-bottom">
        ${revealed ? `
          <article class="source-card reveal-card">
            <span class="source-kicker">Leer van de bron</span>
            <h3>Waarom is dit juist?</h3>
            <p>${escapeHtml(q.explanation)}</p>
            <a class="source-link" href="${q.sourceUrl}" target="_blank" rel="noopener">Bron: ${escapeHtml(q.source)} ↗</a>
            ${room.isHost ? `<div style="margin-top:18px"><button class="button button-primary" id="nextBtn">${room.questionIndex === room.totalQuestions - 1 ? "Bekijk wat we leerden" : "Volgende vraag"} <span>→</span></button></div>` : ""}
          </article>` :
          `<article class="source-card"><span class="source-kicker">Na je antwoord</span><h3>Bron en uitleg</h3><p>Na iedere vraag verschijnt hier een korte uitleg met de gebruikte Qur'an- of hadith-referentie.</p></article>`
        }
        <aside class="score-mini">
          <div class="section-label">Tussenstand</div>
          ${room.players.map((p, i) => `<div class="score-row"><span>${i + 1}. ${escapeHtml(p.nickname)}</span><strong>${p.score}</strong></div>`).join("")}
        </aside>
      </div>
    </section>`;

  if (!revealed) startTimer(room.deadlineAt, room.durationSeconds);
  document.querySelectorAll(".answer:not(:disabled)").forEach(button => {
    button.onclick = async () => {
      document.querySelectorAll(".answer").forEach(item => item.disabled = true);
      try {
        state.room = await request(`/api/rooms/${room.code}/answer`, {
          method: "POST",
          body: JSON.stringify({ playerId: state.playerId, choice: Number(button.dataset.choice) })
        });
        render();
      } catch (err) { notify(err.message); await refresh(true); }
    };
  });
  if (room.isHost && room.phase === "question") {
    document.querySelector("#revealBtn").onclick = async () => {
      try {
        state.room = await request(`/api/rooms/${room.code}/reveal`, {
          method: "POST", body: JSON.stringify({ playerId: state.playerId })
        });
        render();
      } catch (err) { notify(err.message); }
    };
  }
  if (room.isHost && revealed) {
    document.querySelector("#nextBtn").onclick = async () => {
      try {
        state.room = await request(`/api/rooms/${room.code}/next`, {
          method: "POST", body: JSON.stringify({ playerId: state.playerId })
        });
        render();
      } catch (err) { notify(err.message); }
    };
  }
}

function finished(room) {
  stopTimer();
  const top = room.players.slice(0, 3);
  const podiumOrder = [top[1], top[0], top[2]];
  const winner = top[0];
  app.innerHTML = `
    <section class="screen panel panel-wide" style="text-align:center">
      <span class="eyebrow">Alḥamdulillāh · samen geleerd</span>
      <h2>De eindstand</h2>
      <p class="panel-copy" style="margin-inline:auto">Iedere bron die je onthoudt is winst. Dit is hoe de ronde eindigde.</p>
      ${winner ? `<div class="winner-note"><span>✦</span><div><small>Meeste punten</small><strong>${escapeHtml(winner.nickname)}</strong></div><b>${winner.correctAnswers}/${room.totalQuestions} juist</b></div>` : ""}
      <div class="podium">
        ${podiumOrder.map((p, i) => {
          if (!p) return "";
          const place = [2, 1, 3][i];
          return `<div class="podium-place place-${place}"><div class="podium-name">${escapeHtml(p.nickname)}</div><div class="podium-block">${place}</div><strong>${p.score} pt</strong></div>`;
        }).join("")}
      </div>
      <div class="final-list">
        ${room.players.map((p, i) => `<div class="final-row"><strong>${i + 1}</strong><span style="text-align:left">${escapeHtml(p.nickname)}<small>${p.correctAnswers}/${room.totalQuestions} juist — ${p.score} punten</small></span></div>`).join("")}
      </div>
      <div class="button-row" style="justify-content:center">
        ${room.isHost ? '<button class="button button-primary" id="rematchBtn">Nog een ronde</button>' : ""}
        <button class="button button-secondary" id="homeBtn">Terug naar home</button>
      </div>
    </section>`;
  document.querySelector("#homeBtn").onclick = () => {
    history.replaceState({}, "", location.pathname);
    state.roomCode = ""; state.playerId = ""; state.room = null;
    home();
  };
  if (room.isHost) {
    document.querySelector("#rematchBtn").onclick = async () => {
      try {
        state.room = await request(`/api/rooms/${room.code}/rematch`, {
          method: "POST", body: JSON.stringify({ playerId: state.playerId })
        });
        render();
      } catch (err) { notify(err.message); }
    };
  }
}

function render() {
  if (!state.room) return;
  if (state.room.phase === "lobby") lobby(state.room);
  else if (state.room.phase === "finished") finished(state.room);
  else quiz(state.room);
}

async function refresh(force = false) {
  if (!state.roomCode || !state.playerId) return;
  try {
    const latest = await request(`/api/rooms/${state.roomCode}?playerId=${state.playerId}`);
    const meaningfulChange = force || !state.room ||
      latest.phase !== state.room.phase ||
      latest.questionIndex !== state.room.questionIndex ||
      latest.level !== state.room.level ||
      latest.topic !== state.room.topic ||
      latest.durationSeconds !== state.room.durationSeconds ||
      JSON.stringify(latest.players) !== JSON.stringify(state.room.players);
    state.room = latest;
    if (meaningfulChange) render();
  } catch (err) {
    notify("Verbinding onderbroken — ik blijf proberen");
  }
}

function startPolling() {
  stopPolling();
  state.poller = setInterval(refresh, 1000);
}

function stopPolling() {
  if (state.poller) clearInterval(state.poller);
  state.poller = null;
}

function startTimer(deadlineAt, durationSeconds) {
  stopTimer();
  const update = () => {
    const remaining = Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000));
    const timer = document.querySelector("#timer");
    const value = document.querySelector("#timerValue");
    if (timer) timer.style.setProperty("--timer", `${(remaining / durationSeconds) * 100}%`);
    if (value) value.textContent = remaining;
    if (remaining <= 0) {
      stopTimer();
      refresh(true);
    }
  };
  update();
  state.timer = setInterval(update, 250);
}

function stopTimer() {
  if (state.timer) clearInterval(state.timer);
  state.timer = null;
}

async function leaveRoom() {
  try {
    await request(`/api/rooms/${state.roomCode}/leave`, {
      method: "POST", body: JSON.stringify({ playerId: state.playerId })
    });
  } catch (_) {}
  sessionStorage.removeItem(`noor-${state.roomCode}`);
  history.replaceState({}, "", location.pathname);
  state.roomCode = ""; state.playerId = ""; state.room = null;
  home();
}

async function boot() {
  try { state.system = await request("/api/system"); } catch (_) {}
  if (state.roomCode) {
    const savedId = sessionStorage.getItem(`noor-${state.roomCode}`);
    if (savedId) {
      state.playerId = savedId;
      await refresh(true);
      startPolling();
    } else {
      nameScreen("join");
    }
  } else {
    home();
  }
}

boot();
