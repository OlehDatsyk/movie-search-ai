/* =========================================================
   CineMind — AI Movie Assistant
   Frontend logic: tabs, dark mode, chat, search, mood, compare
   ========================================================= */

const API = {
  search: (q, page = 1) => fetch(`/api/search?q=${encodeURIComponent(q)}&page=${page}`).then(readJson),
  movie: (id) => fetch(`/api/movie/${id}`).then(readJson),
  whyLike: (movie_id, preferences) =>
    fetch("/api/why-like", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ movie_id, preferences }) }).then(readJson),
  compare: (movie_id_1, movie_id_2) =>
    fetch("/api/compare", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ movie_id_1, movie_id_2 }) }).then(readJson),
  similar: (movie_id) =>
    fetch("/api/similar", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ movie_id }) }).then(readJson),
  mood: (mood) =>
    fetch("/api/mood", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ mood }) }).then(readJson),
  chat: (history) =>
    fetch("/api/chat", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ history }) }).then(readJson),
};

const JSON_HEADERS = { "Content-Type": "application/json" };

async function readJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data;
}

const PLACEHOLDER_POSTER_ICON = "🎬";

/* ---------------------------------------------------------
   THEME (dark mode)
--------------------------------------------------------- */

function initTheme() {
  const saved = localStorage.getItem("cinemind-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  applyTheme(theme);

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.getElementById("theme-icon").textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("cinemind-theme", theme);
}

/* ---------------------------------------------------------
   TABS
--------------------------------------------------------- */

function initTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`panel-${btn.dataset.tab}`).classList.add("active");
    });
  });
}

/* ---------------------------------------------------------
   MOVIE CARD RENDERING (shared across tabs)
--------------------------------------------------------- */

function movieCardHTML(movie) {
  const poster = movie.poster_url
    ? `<img src="${movie.poster_url}" alt="${escapeHtml(movie.title)} poster" loading="lazy">`
    : `<div class="no-poster">${PLACEHOLDER_POSTER_ICON}</div>`;

  return `
    <div class="movie-card" data-movie-id="${movie.id}">
      <div class="poster-wrap">
        ${poster}
        <span class="rating-badge">⭐ ${movie.rating ?? "N/A"}</span>
      </div>
      <div class="movie-card-body">
        <h4>${escapeHtml(movie.title)}</h4>
        <div class="year">${movie.year || ""}</div>
      </div>
    </div>`;
}

function renderMovieGrid(container, movies) {
  if (!movies || movies.length === 0) {
    container.innerHTML = `<p class="status-text">No movies found. Try a different search.</p>`;
    return;
  }
  container.innerHTML = movies.map(movieCardHTML).join("");
  container.querySelectorAll(".movie-card").forEach((card) => {
    card.addEventListener("click", () => openMovieModal(parseInt(card.dataset.movieId, 10)));
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

/* Very small Markdown -> HTML converter, just enough for AI responses
   (bold, bullet lists, line breaks). Keeps the project dependency-free. */
function markdownToHtml(text) {
  if (!text) return "";
  let html = escapeHtml(text);

  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Convert consecutive "- " lines into a <ul><li> block.
  const lines = html.split("\n");
  let out = [];
  let inList = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${trimmed.slice(2)}</li>`);
    } else {
      if (inList) { out.push("</ul>"); inList = false; }
      if (trimmed.length) out.push(`<p>${trimmed}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("");
}

/* ---------------------------------------------------------
   MOVIE DETAIL MODAL
--------------------------------------------------------- */

const modalOverlay = document.getElementById("modal-overlay");
const modalBody = document.getElementById("modal-body");

function initModal() {
  document.getElementById("modal-close").addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function closeModal() {
  modalOverlay.classList.remove("visible");
  modalBody.innerHTML = "";
}

async function openMovieModal(movieId) {
  modalOverlay.classList.add("visible");
  modalBody.innerHTML = `<div class="modal-content"><div class="loader"><div class="spinner"></div> Loading movie details…</div></div>`;

  try {
    const movie = await API.movie(movieId);
    renderModalBase(movie);
  } catch (err) {
    modalBody.innerHTML = `<div class="modal-content"><p class="status-text error">${escapeHtml(err.message)}</p></div>`;
  }
}

function renderModalBase(movie) {
  const backdrop = movie.backdrop_url || movie.poster_url;
  const genres = (movie.genres || []).map((g) => `<span class="meta-pill">${escapeHtml(g)}</span>`).join("");
  const cast = (movie.cast || []).slice(0, 6)
    .map((c) => `<span class="cast-pill">${escapeHtml(c.name)}${c.character ? ` as ${escapeHtml(c.character)}` : ""}</span>`)
    .join("");

  modalBody.innerHTML = `
    ${backdrop ? `<img class="modal-hero" src="${backdrop}" alt="${escapeHtml(movie.title)}">` : ""}
    <div class="modal-content">
      <h2>${escapeHtml(movie.title)} ${movie.year ? `(${movie.year})` : ""}</h2>
      ${movie.tagline ? `<div class="modal-tagline">"${escapeHtml(movie.tagline)}"</div>` : ""}
      <div class="modal-meta">
        <span class="meta-pill">⭐ ${movie.rating}/10</span>
        ${movie.runtime ? `<span class="meta-pill">⏱ ${movie.runtime} min</span>` : ""}
        ${movie.directors && movie.directors.length ? `<span class="meta-pill">🎬 ${escapeHtml(movie.directors.join(", "))}</span>` : ""}
        ${genres}
      </div>
      <p class="modal-overview">${escapeHtml(movie.overview)}</p>

      ${cast ? `<div class="modal-section-title">Cast</div><div class="cast-list">${cast}</div>` : ""}

      <div class="modal-actions">
        <button class="secondary-btn" id="btn-why-like">✨ Why would I like this?</button>
        <button class="secondary-btn" id="btn-find-similar">🔗 Find similar movies</button>
      </div>

      <div id="modal-ai-result"></div>
    </div>`;

  document.getElementById("btn-why-like").addEventListener("click", () => handleWhyLike(movie.id));
  document.getElementById("btn-find-similar").addEventListener("click", () => handleFindSimilar(movie.id));
}

async function handleWhyLike(movieId) {
  const target = document.getElementById("modal-ai-result");
  target.innerHTML = `<div class="loader"><div class="spinner"></div> CineMind is thinking…</div>`;
  try {
    const data = await API.whyLike(movieId, "");
    target.innerHTML = `
      <div class="modal-section-title">Why you might like this</div>
      <div class="ai-explanation visible">${markdownToHtml(data.explanation)}</div>`;
  } catch (err) {
    target.innerHTML = `<p class="status-text error">${escapeHtml(err.message)}</p>`;
  }
}

async function handleFindSimilar(movieId) {
  const target = document.getElementById("modal-ai-result");
  target.innerHTML = `<div class="loader"><div class="spinner"></div> Finding similar movies…</div>`;
  try {
    const data = await API.similar(movieId);
    const grid = (data.similar_movies || []).map(movieCardHTML).join("");
    target.innerHTML = `
      <div class="modal-section-title">Similar movies</div>
      <div class="ai-explanation visible">${markdownToHtml(data.explanation)}</div>
      <div class="movie-grid">${grid}</div>`;
    target.querySelectorAll(".movie-card").forEach((card) => {
      card.addEventListener("click", () => openMovieModal(parseInt(card.dataset.movieId, 10)));
    });
  } catch (err) {
    target.innerHTML = `<p class="status-text error">${escapeHtml(err.message)}</p>`;
  }
}

/* ---------------------------------------------------------
   SEARCH TAB
--------------------------------------------------------- */

function initSearchTab() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const status = document.getElementById("search-status");
  const results = document.getElementById("search-results");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    status.textContent = "Searching…";
    status.className = "status-text";
    results.innerHTML = "";

    try {
      const data = await API.search(query);
      status.textContent = `${data.total_results} result${data.total_results === 1 ? "" : "s"} found`;
      renderMovieGrid(results, data.results);
    } catch (err) {
      status.textContent = err.message;
      status.className = "status-text error";
    }
  });
}

/* ---------------------------------------------------------
   MOOD TAB
--------------------------------------------------------- */

function initMoodTab() {
  const chips = document.querySelectorAll(".mood-chip");
  const form = document.getElementById("mood-form");
  const input = document.getElementById("mood-input");
  const status = document.getElementById("mood-status");
  const explanation = document.getElementById("mood-explanation");
  const results = document.getElementById("mood-results");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");
      runMoodSearch(chip.dataset.mood);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const mood = input.value.trim();
    if (!mood) return;
    chips.forEach((c) => c.classList.remove("selected"));
    runMoodSearch(mood);
  });

  async function runMoodSearch(mood) {
    status.textContent = "Curating picks for your mood…";
    status.className = "status-text";
    explanation.className = "ai-explanation";
    explanation.innerHTML = "";
    results.innerHTML = "";

    try {
      const data = await API.mood(mood);
      status.textContent = data.genres_used && data.genres_used.length
        ? `Matched genres: ${data.genres_used.join(", ")}`
        : "";
      if (data.explanation) {
        explanation.innerHTML = markdownToHtml(data.explanation);
        explanation.classList.add("visible");
      }
      renderMovieGrid(results, data.movies);
    } catch (err) {
      status.textContent = err.message;
      status.className = "status-text error";
    }
  }
}

/* ---------------------------------------------------------
   COMPARE TAB
--------------------------------------------------------- */

function initCompareTab() {
  setupCompareSlot(1);
  setupCompareSlot(2);

  const compareBtn = document.getElementById("compare-btn");
  const status = document.getElementById("compare-status");
  const result = document.getElementById("compare-result");

  compareBtn.addEventListener("click", async () => {
    if (!compareState[1] || !compareState[2]) return;
    status.textContent = "Analyzing both movies…";
    status.className = "status-text";
    result.className = "ai-explanation";
    result.innerHTML = "";
    compareBtn.disabled = true;

    try {
      const data = await API.compare(compareState[1].id, compareState[2].id);
      result.innerHTML = markdownToHtml(data.comparison);
      result.classList.add("visible");
      status.textContent = "";
    } catch (err) {
      status.textContent = err.message;
      status.className = "status-text error";
    } finally {
      compareBtn.disabled = false;
    }
  });
}

const compareState = { 1: null, 2: null };
let compareDebounce = { 1: null, 2: null };

function setupCompareSlot(slot) {
  const input = document.getElementById(`compare-search-${slot}`);
  const list = document.getElementById(`compare-list-${slot}`);
  const picked = document.getElementById(`compare-picked-${slot}`);

  input.addEventListener("input", () => {
    clearTimeout(compareDebounce[slot]);
    const query = input.value.trim();
    if (!query) {
      list.classList.remove("visible");
      return;
    }
    compareDebounce[slot] = setTimeout(async () => {
      try {
        const data = await API.search(query);
        renderAutocomplete(slot, data.results.slice(0, 6));
      } catch (err) {
        list.innerHTML = `<div class="autocomplete-item">${escapeHtml(err.message)}</div>`;
        list.classList.add("visible");
      }
    }, 350);
  });

  document.addEventListener("click", (e) => {
    if (!list.contains(e.target) && e.target !== input) {
      list.classList.remove("visible");
    }
  });

  function renderAutocomplete(slot, movies) {
    if (!movies.length) {
      list.innerHTML = `<div class="autocomplete-item">No matches found</div>`;
      list.classList.add("visible");
      return;
    }
    list.innerHTML = movies.map((m) => `
      <div class="autocomplete-item" data-id="${m.id}">
        ${m.poster_url ? `<img src="${m.poster_url}" alt="">` : `<div class="ac-title">🎬</div>`}
        <div>
          <div class="ac-title">${escapeHtml(m.title)}</div>
          <div class="ac-year">${m.year || ""}</div>
        </div>
      </div>`).join("");
    list.classList.add("visible");

    list.querySelectorAll(".autocomplete-item[data-id]").forEach((item) => {
      item.addEventListener("click", () => {
        const movie = movies.find((m) => m.id === parseInt(item.dataset.id, 10));
        compareState[slot] = movie;
        picked.innerHTML = `
          ${movie.poster_url ? `<img src="${movie.poster_url}" alt="">` : ""}
          <div>
            <div class="pm-title">${escapeHtml(movie.title)}</div>
            <div class="pm-year">${movie.year || ""}</div>
          </div>`;
        picked.classList.add("visible");
        list.classList.remove("visible");
        input.value = "";
        updateCompareButton();
      });
    });
  }
}

function updateCompareButton() {
  document.getElementById("compare-btn").disabled = !(compareState[1] && compareState[2]);
}

/* ---------------------------------------------------------
   CHAT TAB
--------------------------------------------------------- */

const CHAT_STORAGE_KEY = "cinemind-chat-history";

function initChatTab() {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const scroll = document.getElementById("chat-scroll");
  const clearBtn = document.getElementById("clear-chat");

  loadChatHistory();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    input.value = "";
    sendChatMessage(message);
  });

  document.querySelectorAll(".chip[data-prompt]").forEach((chip) => {
    chip.addEventListener("click", () => sendChatMessage(chip.dataset.prompt));
  });

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    scroll.innerHTML = "";
    renderChatEmptyState();
  });
}

function getChatHistory() {
  try {
    return JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveChatHistory(history) {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(history));
}

function loadChatHistory() {
  const history = getChatHistory();
  const scroll = document.getElementById("chat-scroll");
  if (!history.length) {
    renderChatEmptyState();
    return;
  }
  scroll.innerHTML = "";
  history.forEach((msg) => appendChatBubble(msg.role, msg.content, false));
  scroll.scrollTop = scroll.scrollHeight;
}

function renderChatEmptyState() {
  const scroll = document.getElementById("chat-scroll");
  scroll.innerHTML = `
    <div class="chat-empty" id="chat-empty">
      <div class="chat-empty-icon">🍿</div>
      <h2>Hi, I'm CineMind!</h2>
      <p>Ask me for recommendations, describe a movie you love, or say how you're feeling tonight.</p>
      <div class="suggestion-chips">
        <button class="chip" data-prompt="Recommend a mind-bending sci-fi movie like Inception">Mind-bending sci-fi</button>
        <button class="chip" data-prompt="I loved The Grand Budapest Hotel, what else would I like?">More like Grand Budapest Hotel</button>
        <button class="chip" data-prompt="I want something funny and light for a Friday night">Funny & light tonight</button>
        <button class="chip" data-prompt="Suggest a great 90s crime thriller">90s crime thriller</button>
      </div>
    </div>`;
  scroll.querySelectorAll(".chip[data-prompt]").forEach((chip) => {
    chip.addEventListener("click", () => sendChatMessage(chip.dataset.prompt));
  });
}

function appendChatBubble(role, content, animate = true) {
  const scroll = document.getElementById("chat-scroll");
  const emptyState = document.getElementById("chat-empty");
  if (emptyState) emptyState.remove();

  const bubble = document.createElement("div");
  bubble.className = `msg ${role}`;
  bubble.innerHTML = role === "assistant" ? markdownToHtml(content) : escapeHtml(content);
  if (!animate) bubble.style.animation = "none";
  scroll.appendChild(bubble);
  scroll.scrollTop = scroll.scrollHeight;
  return bubble;
}

function appendMovieMiniGrid(movies) {
  if (!movies || !movies.length) return;
  const scroll = document.getElementById("chat-scroll");
  const wrap = document.createElement("div");
  wrap.className = "chat-mini-grid";

  // De-duplicate by movie id, keep first 8
  const seen = new Set();
  const unique = [];
  for (const m of movies) {
    if (m && m.id && !seen.has(m.id)) {
      seen.add(m.id);
      unique.push(m);
    }
  }

  wrap.innerHTML = unique.slice(0, 8).map((m) => `
    <div class="chat-mini-card" data-movie-id="${m.id}">
      ${m.poster_url ? `<img src="${m.poster_url}" alt="${escapeHtml(m.title)}">` : `<div class="no-poster">${PLACEHOLDER_POSTER_ICON}</div>`}
      <div class="mini-title">${escapeHtml(m.title)}</div>
    </div>`).join("");

  wrap.querySelectorAll(".chat-mini-card").forEach((card) => {
    card.addEventListener("click", () => openMovieModal(parseInt(card.dataset.movieId, 10)));
  });

  scroll.appendChild(wrap);
  scroll.scrollTop = scroll.scrollHeight;
}

function showTypingIndicator() {
  const scroll = document.getElementById("chat-scroll");
  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  indicator.id = "typing-indicator";
  indicator.innerHTML = "<span></span><span></span><span></span>";
  scroll.appendChild(indicator);
  scroll.scrollTop = scroll.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");
  if (indicator) indicator.remove();
}

async function sendChatMessage(message) {
  const sendBtn = document.getElementById("chat-send");
  appendChatBubble("user", message);

  const history = getChatHistory();
  history.push({ role: "user", content: message });
  saveChatHistory(history);

  sendBtn.disabled = true;
  showTypingIndicator();

  try {
    const data = await API.chat(history);
    removeTypingIndicator();
    await typeOutReply(data.reply || "I'm not sure how to respond to that.");

    const updatedHistory = getChatHistory();
    updatedHistory.push({ role: "assistant", content: data.reply || "" });
    saveChatHistory(updatedHistory);

    if (data.movies_mentioned && data.movies_mentioned.length) {
      appendMovieMiniGrid(data.movies_mentioned);
    }
  } catch (err) {
    removeTypingIndicator();
    appendChatBubble("error", `⚠️ ${err.message}`);
  } finally {
    sendBtn.disabled = false;
  }
}

/* Renders the assistant reply with a lightweight "typing" animation by
   revealing the markdown-rendered text progressively. */
function typeOutReply(fullText) {
  return new Promise((resolve) => {
    const scroll = document.getElementById("chat-scroll");
    const bubble = document.createElement("div");
    bubble.className = "msg assistant";
    scroll.appendChild(bubble);

    const characters = Array.from(fullText);
    const totalDurationMs = Math.min(900, Math.max(250, characters.length * 8));
    const stepMs = Math.max(6, totalDurationMs / Math.max(characters.length, 1));

    let i = 0;
    function step() {
      i += Math.max(1, Math.round(characters.length / (totalDurationMs / 16)));
      const visibleText = characters.slice(0, i).join("");
      bubble.innerHTML = markdownToHtml(visibleText);
      scroll.scrollTop = scroll.scrollHeight;

      if (i < characters.length) {
        setTimeout(step, 16);
      } else {
        bubble.innerHTML = markdownToHtml(fullText);
        resolve();
      }
    }
    step();
  });
}

/* ---------------------------------------------------------
   INIT
--------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initTabs();
  initModal();
  initSearchTab();
  initMoodTab();
  initCompareTab();
  initChatTab();
});
