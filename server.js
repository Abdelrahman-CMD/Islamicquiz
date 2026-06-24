const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const os = require("node:os");

const PORT = process.env.PORT || 4173;
const HOST = process.env.HOST || "0.0.0.0";
const PUBLIC_DIR = path.join(__dirname, "public");
const rooms = new Map();
const MAX_PLAYERS = 4;
const DEFAULT_QUESTION_COUNT = 5;
const DEFAULT_DURATION_SECONDS = 30;
const ALLOWED_DURATIONS = [20, 30, 45, 60];
const ROOM_PHASES = Object.freeze({
  LOBBY: "lobby",
  QUESTION: "question",
  REVEAL: "reveal",
  FINISHED: "finished"
});

const questions = [
  {
    id: "aq-b-1", level: "beginner", topic: "aqidah",
    question: "Welke soerah beschrijft Allah als Eén, zonder gelijke?",
    options: ["Al-Fātiḥah", "Al-Ikhlāṣ", "Al-Falaq", "An-Nās"], correct: 1,
    explanation: "Soerah Al-Ikhlāṣ bevestigt Allah’s absolute eenheid en dat niets met Hem vergelijkbaar is.",
    source: "Qur’an 112:1–4", sourceUrl: "https://quran.com/112"
  },
  {
    id: "aq-b-2", level: "beginner", topic: "aqidah",
    question: "Wat is de eerste pilaar van de islam?",
    options: ["De zakāh", "De shahādah", "De ḥajj", "Het vasten"], correct: 1,
    explanation: "De getuigenis dat niemand het recht heeft aanbeden te worden behalve Allah en dat Muhammad Zijn boodschapper is, staat als eerste genoemd.",
    source: "Ṣaḥīḥ al-Bukhārī 8", sourceUrl: "https://sunnah.com/bukhari:8"
  },
  {
    id: "aq-i-1", level: "intermediate", topic: "aqidah",
    question: "Welke engel bracht de openbaring aan de profeten?",
    options: ["Mīkā’īl", "Isrāfīl", "Jibrīl", "Mālik"], correct: 2,
    explanation: "Allah noemt Jibrīl als degene die de Qur’an met Allah’s toestemming naar het hart van de Profeet ﷺ bracht.",
    source: "Qur’an 2:97", sourceUrl: "https://quran.com/2/97"
  },
  {
    id: "aq-a-1", level: "advanced", topic: "aqidah",
    question: "Welke drie generaties werden door de Profeet ﷺ als de beste genoemd?",
    options: ["De Arabieren, Perzen en Romeinen", "Zijn generatie en de twee erna", "De Muhājirūn, Anṣār en Quraysh", "De geleerden van Makkah, Madinah en Shām"], correct: 1,
    explanation: "De hadith noemt de generatie van de Profeet ﷺ, daarna degenen die hen opvolgden, en daarna de volgende generatie.",
    source: "Ṣaḥīḥ al-Bukhārī 2652", sourceUrl: "https://sunnah.com/bukhari:2652"
  },
  {
    id: "qu-b-1", level: "beginner", topic: "quran",
    question: "Met welk woord begon de eerste geopenbaarde passage?",
    options: ["Schrijf", "Lees", "Bid", "Verkondig"], correct: 1,
    explanation: "De eerste verzen van Soerah Al-‘Alaq beginnen met ‘Iqra’: lees/reciteer in de Naam van jouw Heer.",
    source: "Qur’an 96:1–5", sourceUrl: "https://quran.com/96/1-5"
  },
  {
    id: "qu-b-2", level: "beginner", topic: "quran",
    question: "Welke soerah wordt in iedere rak‘ah van het gebed gereciteerd?",
    options: ["Al-Baqarah", "Al-Fātiḥah", "Yā-Sīn", "Al-Mulk"], correct: 1,
    explanation: "De Profeet ﷺ leerde dat het gebed niet geldig is zonder het reciteren van de Opening van het Boek.",
    source: "Ṣaḥīḥ al-Bukhārī 756", sourceUrl: "https://sunnah.com/bukhari:756"
  },
  {
    id: "qu-i-1", level: "intermediate", topic: "quran",
    question: "Wie worden in een sahih hadith ‘de besten onder jullie’ genoemd?",
    options: ["Wie de meeste rijkdom bezit", "Wie de Qur’an leert en onderwijst", "Wie het langst reist", "Wie het meest zwijgt"], correct: 1,
    explanation: "‘Uthmān ibn ‘Affān verhaalde dat de Profeet ﷺ de mensen die de Qur’an leren en onderwijzen als de besten omschreef.",
    source: "Ṣaḥīḥ al-Bukhārī 5027", sourceUrl: "https://sunnah.com/bukhari:5027"
  },
  {
    id: "qu-a-1", level: "advanced", topic: "quran",
    question: "In welk vers wordt bevolen om bij onenigheid terug te keren naar Allah en de Boodschapper?",
    options: ["Qur’an 2:255", "Qur’an 4:59", "Qur’an 18:10", "Qur’an 49:13"], correct: 1,
    explanation: "Qur’an 4:59 gebiedt gelovigen geschillen terug te brengen naar Allah en de Boodschapper.",
    source: "Qur’an 4:59", sourceUrl: "https://quran.com/4/59"
  },
  {
    id: "fi-b-1", level: "beginner", topic: "worship",
    question: "Hoeveel verplichte gebeden zijn er per dag en nacht?",
    options: ["Drie", "Vier", "Vijf", "Zes"], correct: 2,
    explanation: "Tijdens Al-Isrā’ wal-Mi‘rāj werden vijf dagelijkse gebeden verplicht, met de beloning van vijftig.",
    source: "Ṣaḥīḥ al-Bukhārī 349", sourceUrl: "https://sunnah.com/bukhari:349"
  },
  {
    id: "fi-b-2", level: "beginner", topic: "worship",
    question: "In welke maand vasten moslims verplicht?",
    options: ["Muḥarram", "Rajab", "Ramaḍān", "Shawwāl"], correct: 2,
    explanation: "Allah verbond de maand Ramaḍān aan de openbaring van de Qur’an en het verplichte vasten.",
    source: "Qur’an 2:185", sourceUrl: "https://quran.com/2/185"
  },
  {
    id: "fi-i-1", level: "intermediate", topic: "worship",
    question: "Wat bepaalt volgens de bekende hadith de waarde van daden?",
    options: ["De zichtbare omvang", "De intentie", "De mening van anderen", "De moeilijkheid alleen"], correct: 1,
    explanation: "Daden worden beoordeeld naar intenties, en ieder mens krijgt wat hij of zij heeft voorgenomen.",
    source: "Ṣaḥīḥ al-Bukhārī 1", sourceUrl: "https://sunnah.com/bukhari:1"
  },
  {
    id: "fi-a-1", level: "advanced", topic: "worship",
    question: "Welke instructie gaf de Profeet ﷺ over de manier van bidden?",
    options: ["Bid zoals jullie ouders bidden", "Bid zoals jullie mij hebben zien bidden", "Iedere vorm is gelijk", "Volg alleen de imam van Makkah"], correct: 1,
    explanation: "De Sunnah van de Profeet ﷺ is het praktische voorbeeld voor de uitvoering van de ṣalāh.",
    source: "Ṣaḥīḥ al-Bukhārī 631", sourceUrl: "https://sunnah.com/bukhari:631"
  },
  {
    id: "se-b-1", level: "beginner", topic: "seerah",
    question: "In welke stad werd de Profeet Muhammad ﷺ geboren?",
    options: ["Madinah", "Makkah", "Jeruzalem", "Ṭā’if"], correct: 1,
    explanation: "De Qur’an verwijst naar Makkah als deze veilige stad; de sīrah is unaniem over zijn geboorte daar.",
    source: "Qur’an 90:1–2", sourceUrl: "https://quran.com/90/1-2"
  },
  {
    id: "se-b-2", level: "beginner", topic: "seerah",
    question: "Naar welke stad maakte de Profeet ﷺ de hijrah?",
    options: ["Damascus", "Madinah", "Cairo", "Bagdad"], correct: 1,
    explanation: "De emigratie van Makkah naar Madinah markeert een beslissend moment in de islamitische geschiedenis.",
    source: "Qur’an 9:40", sourceUrl: "https://quran.com/9/40"
  },
  {
    id: "se-i-1", level: "intermediate", topic: "seerah",
    question: "Welke metgezel was bij de Profeet ﷺ in de grot tijdens de hijrah?",
    options: ["‘Umar ibn al-Khaṭṭāb", "‘Alī ibn Abī Ṭālib", "Abū Bakr aṣ-Ṣiddīq", "‘Uthmān ibn ‘Affān"], correct: 2,
    explanation: "Het vers noemt de Profeet ﷺ als ‘één van de twee’ toen hij zijn metgezel in de grot geruststelde.",
    source: "Qur’an 9:40; Ṣaḥīḥ al-Bukhārī 3653", sourceUrl: "https://sunnah.com/bukhari:3653"
  },
  {
    id: "se-a-1", level: "advanced", topic: "seerah",
    question: "Welke overeenkomst werd in de Qur’an een ‘duidelijke overwinning’ genoemd?",
    options: ["Het verdrag van Ḥudaybiyyah", "Het pact van ‘Aqabah", "De grondwet van Madinah", "De boycot van Banū Hāshim"], correct: 0,
    explanation: "Soerah Al-Fatḥ werd geopenbaard rond de terugkeer van Ḥudaybiyyah en noemt dit een duidelijke overwinning.",
    source: "Qur’an 48:1; Ṣaḥīḥ al-Bukhārī 4834", sourceUrl: "https://sunnah.com/bukhari:4834"
  },
  {
    id: "ad-i-1", level: "intermediate", topic: "character",
    question: "Wat zei de Profeet ﷺ over degene die in Allah en de Laatste Dag gelooft?",
    options: ["Hij moet altijd reizen", "Hij moet goed spreken of zwijgen", "Hij mag nooit handel drijven", "Hij moet alleen leven"], correct: 1,
    explanation: "Goede woorden en beheerst zwijgen worden direct verbonden aan geloof in Allah en de Laatste Dag.",
    source: "Ṣaḥīḥ al-Bukhārī 6018", sourceUrl: "https://sunnah.com/bukhari:6018"
  },
  {
    id: "ad-a-1", level: "advanced", topic: "character",
    question: "Wat belooft de hadith aan wie een weg bewandelt om kennis te zoeken?",
    options: ["Een leven zonder beproevingen", "Een gemakkelijke weg naar het Paradijs", "Direct leiderschap", "Altijd materiële rijkdom"], correct: 1,
    explanation: "Het zoeken van nuttige kennis is een oorzaak waardoor Allah de weg naar het Paradijs vergemakkelijkt.",
    source: "Ṣaḥīḥ Muslim 2699a", sourceUrl: "https://sunnah.com/muslim:2699a"
  }
];

const topicNames = {
  mixed: "Alles door elkaar", aqidah: "‘Aqīdah", quran: "Qur’an",
  worship: "Aanbidding", seerah: "Sīrah", character: "Adab & karakter"
};

function code() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function id() {
  return crypto.randomBytes(12).toString("hex");
}

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

function securityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Content-Security-Policy", [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'"
  ].join("; "));
}

async function body(req) {
  let data = "";
  for await (const chunk of req) {
    data += chunk;
    if (data.length > 50_000) throw new Error("Te groot");
  }
  return data ? JSON.parse(data) : {};
}

function sanitizeName(value) {
  return String(value || "").trim().replace(/[<>]/g, "").slice(0, 24);
}

function selectQuestions(level, topic) {
  const exact = questions.filter(q => q.level === level && (topic === "mixed" || q.topic === topic));
  const sameLevel = questions.filter(q => q.level === level && !exact.includes(q));
  const sameTopic = topic === "mixed" ? [] : questions.filter(q => q.topic === topic && !exact.includes(q));
  const pool = [...exact, ...sameLevel.sort(() => Math.random() - .5), ...sameTopic.sort(() => Math.random() - .5)];
  return [...new Map(pool.map(q => [q.id, q])).values()];
}

function player(room, playerId) {
  return room.players.find(p => p.id === playerId);
}

function activePlayers(room) {
  const cutoff = Date.now() - 20_000;
  return room.players.filter(p => !p.leftAt && (p.lastSeenAt >= cutoff || p.id === room.hostId));
}

function reconcileRoom(room) {
  const now = Date.now();
  if (room.phase === ROOM_PHASES.QUESTION && room.deadlineAt && now >= room.deadlineAt) {
    room.phase = ROOM_PHASES.REVEAL;
  }

  const host = player(room, room.hostId);
  if (host && host.lastSeenAt < now - 35_000 && room.phase !== ROOM_PHASES.FINISHED) {
    const replacement = room.players
      .filter(p => !p.leftAt && p.lastSeenAt >= now - 20_000)
      .sort((a, b) => a.joinedAt - b.joinedAt)[0];
    if (replacement) room.hostId = replacement.id;
  }

  if (room.phase === ROOM_PHASES.QUESTION) {
    const active = activePlayers(room);
    if (active.length && active.every(p => p.answers[room.questionIndex])) {
      room.phase = ROOM_PHASES.REVEAL;
    }
  }
}

function roomView(room, playerId) {
  reconcileRoom(room);
  const me = player(room, playerId);
  const current = room.quiz[room.questionIndex];
  const reveal = room.phase === ROOM_PHASES.REVEAL || room.phase === ROOM_PHASES.FINISHED;
  const now = Date.now();
  return {
    code: room.code,
    phase: room.phase,
    hostId: room.hostId,
    isHost: room.hostId === playerId,
    level: room.level,
    topic: room.topic,
    topicName: topicNames[room.topic],
    durationSeconds: room.durationSeconds,
    deadlineAt: room.deadlineAt,
    secondsRemaining: room.deadlineAt && room.phase === ROOM_PHASES.QUESTION
      ? Math.max(0, Math.ceil((room.deadlineAt - now) / 1000))
      : 0,
    players: room.players.filter(p => !p.leftAt).map(p => ({
      id: p.id, nickname: p.nickname, score: p.score,
      answered: Boolean(p.answers[room.questionIndex]),
      connected: !p.leftAt && p.lastSeenAt >= now - 20_000,
      correctAnswers: p.correctAnswers
    })).sort((a, b) => b.score - a.score),
    questionIndex: room.questionIndex,
    totalQuestions: room.quiz.length,
    me: me ? {
      id: me.id,
      nickname: me.nickname,
      answer: me.answers[room.questionIndex] || null,
      correctAnswers: me.correctAnswers
    } : null,
    question: current ? {
      question: current.question,
      options: current.options,
      ...(reveal ? {
        correct: current.correct,
        explanation: current.explanation,
        source: current.source,
        sourceUrl: current.sourceUrl
      } : {})
    } : null
  };
}

function localUrls(port) {
  const urls = [];
  for (const addresses of Object.values(os.networkInterfaces())) {
    for (const address of addresses || []) {
      if (address.family === "IPv4" && !address.internal) {
        urls.push(`http://${address.address}:${port}`);
      }
    }
  }
  return urls;
}

function roomOr404(res, codeValue) {
  const room = rooms.get(codeValue.toUpperCase());
  if (!room) json(res, 404, { error: "Deze kamer bestaat niet (meer)." });
  return room;
}

setInterval(() => {
  const cutoff = Date.now() - 1000 * 60 * 60 * 6;
  for (const [key, room] of rooms) if (room.updatedAt < cutoff) rooms.delete(key);
}, 1000 * 60 * 15).unref();

async function api(req, res, url) {
  const parts = url.pathname.split("/").filter(Boolean);
  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      return json(res, 200, { ok: true, rooms: rooms.size, uptimeSeconds: Math.round(process.uptime()) });
    }

    if (req.method === "GET" && url.pathname === "/api/system") {
      return json(res, 200, {
        appName: "Noor Quiz",
        localUrls: localUrls(PORT),
        maxPlayers: MAX_PLAYERS,
        questionCount: DEFAULT_QUESTION_COUNT,
        offlineReady: true
      });
    }

    if (req.method === "POST" && url.pathname === "/api/rooms") {
      const data = await body(req);
      const nickname = sanitizeName(data.nickname);
      if (!nickname) return json(res, 400, { error: "Vul een nickname of kunya in." });
      let roomCode;
      do roomCode = code(); while (rooms.has(roomCode));
      const playerId = id();
      const room = {
        code: roomCode, hostId: playerId, phase: ROOM_PHASES.LOBBY,
        level: "beginner", topic: "mixed", quiz: [], questionIndex: 0,
        durationSeconds: DEFAULT_DURATION_SECONDS,
        questionStartedAt: null, deadlineAt: null, updatedAt: Date.now(),
        players: [{
          id: playerId, nickname, score: 0, answers: {}, correctAnswers: 0,
          joinedAt: Date.now(), lastSeenAt: Date.now(), leftAt: null
        }]
      };
      rooms.set(roomCode, room);
      return json(res, 201, { code: roomCode, playerId });
    }

    if (parts[0] === "api" && parts[1] === "rooms" && parts[2]) {
      const room = roomOr404(res, parts[2]);
      if (!room) return;
      room.updatedAt = Date.now();

      if (req.method === "GET" && parts.length === 3) {
        const requestingPlayer = player(room, url.searchParams.get("playerId"));
        if (requestingPlayer) requestingPlayer.lastSeenAt = Date.now();
        return json(res, 200, roomView(room, url.searchParams.get("playerId")));
      }

      const data = await body(req);
      if (req.method === "POST" && parts[3] === "join") {
        if (room.phase !== ROOM_PHASES.LOBBY) return json(res, 409, { error: "Deze quiz is al begonnen." });
        if (room.players.filter(p => !p.leftAt).length >= MAX_PLAYERS) {
          return json(res, 409, { error: `Deze kamer zit vol (maximaal ${MAX_PLAYERS}).` });
        }
        const nickname = sanitizeName(data.nickname);
        if (!nickname) return json(res, 400, { error: "Vul een nickname of kunya in." });
        if (room.players.some(p => !p.leftAt && p.nickname.toLowerCase() === nickname.toLowerCase())) {
          return json(res, 409, { error: "Deze naam wordt al gebruikt in de kamer." });
        }
        const playerId = id();
        room.players.push({
          id: playerId, nickname, score: 0, answers: {}, correctAnswers: 0,
          joinedAt: Date.now(), lastSeenAt: Date.now(), leftAt: null
        });
        return json(res, 201, { code: room.code, playerId });
      }

      const actingPlayer = player(room, data.playerId);
      if (!actingPlayer) return json(res, 403, { error: "Je sessie is niet meer geldig." });
      actingPlayer.lastSeenAt = Date.now();

      if (req.method === "POST" && parts[3] === "config") {
        if (room.hostId !== data.playerId) return json(res, 403, { error: "Alleen de host kan dit aanpassen." });
        if (room.phase !== ROOM_PHASES.LOBBY) return json(res, 409, { error: "De quiz is al begonnen." });
        if (["beginner", "intermediate", "advanced"].includes(data.level)) room.level = data.level;
        if (Object.keys(topicNames).includes(data.topic)) room.topic = data.topic;
        if (ALLOWED_DURATIONS.includes(Number(data.durationSeconds))) {
          room.durationSeconds = Number(data.durationSeconds);
        }
        return json(res, 200, roomView(room, data.playerId));
      }

      if (req.method === "POST" && parts[3] === "start") {
        if (room.hostId !== data.playerId) return json(res, 403, { error: "Alleen de host kan starten." });
        if (room.phase !== ROOM_PHASES.LOBBY) return json(res, 409, { error: "Deze quiz is al gestart." });
        room.quiz = selectQuestions(room.level, room.topic).slice(0, DEFAULT_QUESTION_COUNT);
        if (!room.quiz.length) return json(res, 400, { error: "Nog geen vragen voor deze combinatie." });
        room.questionIndex = 0;
        room.phase = ROOM_PHASES.QUESTION;
        room.questionStartedAt = Date.now();
        room.deadlineAt = room.questionStartedAt + room.durationSeconds * 1000;
        return json(res, 200, roomView(room, data.playerId));
      }

      if (req.method === "POST" && parts[3] === "answer") {
        reconcileRoom(room);
        if (room.phase !== ROOM_PHASES.QUESTION) return json(res, 409, { error: "De antwoordtijd is voorbij." });
        if (actingPlayer.answers[room.questionIndex]) return json(res, 409, { error: "Je antwoord is al opgeslagen." });
        const current = room.quiz[room.questionIndex];
        const choice = Number(data.choice);
        if (!Number.isInteger(choice) || choice < 0 || choice >= current.options.length) {
          return json(res, 400, { error: "Ongeldig antwoord." });
        }
        const correct = choice === current.correct;
        const elapsed = Date.now() - room.questionStartedAt;
        const points = correct ? 1000 + Math.max(0, Math.round(500 - elapsed / 40)) : 0;
        actingPlayer.score += points;
        if (correct) actingPlayer.correctAnswers += 1;
        actingPlayer.answers[room.questionIndex] = { choice, correct, points, responseMs: elapsed };
        if (activePlayers(room).every(p => p.answers[room.questionIndex])) room.phase = ROOM_PHASES.REVEAL;
        return json(res, 200, roomView(room, data.playerId));
      }

      if (req.method === "POST" && parts[3] === "reveal") {
        if (room.hostId !== data.playerId) return json(res, 403, { error: "Alleen de host kan onthullen." });
        if (room.phase !== ROOM_PHASES.QUESTION) return json(res, 409, { error: "Deze vraag is al onthuld." });
        room.phase = ROOM_PHASES.REVEAL;
        return json(res, 200, roomView(room, data.playerId));
      }

      if (req.method === "POST" && parts[3] === "next") {
        if (room.hostId !== data.playerId) return json(res, 403, { error: "Alleen de host kan doorgaan." });
        if (room.phase !== ROOM_PHASES.REVEAL) return json(res, 409, { error: "Onthul eerst het antwoord." });
        if (room.questionIndex >= room.quiz.length - 1) {
          room.phase = ROOM_PHASES.FINISHED;
          room.deadlineAt = null;
        } else {
          room.questionIndex += 1;
          room.phase = ROOM_PHASES.QUESTION;
          room.questionStartedAt = Date.now();
          room.deadlineAt = room.questionStartedAt + room.durationSeconds * 1000;
        }
        return json(res, 200, roomView(room, data.playerId));
      }

      if (req.method === "POST" && parts[3] === "leave") {
        actingPlayer.leftAt = Date.now();
        if (room.hostId === actingPlayer.id) {
          const replacement = room.players
            .filter(p => !p.leftAt)
            .sort((a, b) => a.joinedAt - b.joinedAt)[0];
          if (replacement) room.hostId = replacement.id;
        }
        reconcileRoom(room);
        return json(res, 200, { ok: true });
      }

      if (req.method === "POST" && parts[3] === "rematch") {
        if (room.hostId !== data.playerId) return json(res, 403, { error: "Alleen de host kan een nieuwe ronde starten." });
        if (room.phase !== ROOM_PHASES.FINISHED) return json(res, 409, { error: "Maak eerst deze ronde af." });
        room.phase = ROOM_PHASES.LOBBY;
        room.quiz = [];
        room.questionIndex = 0;
        room.deadlineAt = null;
        for (const p of room.players.filter(p => !p.leftAt)) {
          p.score = 0;
          p.correctAnswers = 0;
          p.answers = {};
        }
        return json(res, 200, roomView(room, data.playerId));
      }
    }
    json(res, 404, { error: "Niet gevonden." });
  } catch (error) {
    console.error(error);
    json(res, 500, { error: "Er ging iets mis. Probeer het opnieuw." });
  }
}

function serve(req, res, url) {
  const requested = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const filePath = path.normalize(path.join(PUBLIC_DIR, requested));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403); return res.end("Forbidden");
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      fs.readFile(path.join(PUBLIC_DIR, "index.html"), (fallbackError, html) => {
        if (fallbackError) { res.writeHead(404); return res.end("Not found"); }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
      });
      return;
    }
    const ext = path.extname(filePath);
    const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml" };
    res.writeHead(200, { "Content-Type": `${types[ext] || "application/octet-stream"}; charset=utf-8` });
    res.end(data);
  });
}

http.createServer((req, res) => {
  securityHeaders(res);
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/")) return api(req, res, url);
  serve(req, res, url);
}).listen(PORT, HOST, () => {
  console.log(`Noor Quiz draait lokaal op http://127.0.0.1:${PORT}`);
  for (const url of localUrls(PORT)) console.log(`Op hetzelfde wifi-netwerk: ${url}`);
});
