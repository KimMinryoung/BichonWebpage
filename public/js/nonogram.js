// Nonogram page (views/public/nonogram.ejs). The wrapper keeps its constants
// off the page's global scope.
//
// Input model: a fill/mark mode toggle decides what a press does (mouse users
// also get the right button for X marks), and a press that moves across cells
// paints every cell it crosses with the same value as the first one, so a run
// of five is one stroke rather than five clicks. Progress is saved per puzzle
// in localStorage so a half-solved board survives a reload.
(function () {
    const DEFAULT_PUZZLE_ID = "minchong-15";
    const PUZZLE_INDEX_URL = "/puzzles/index.json";
    const STORAGE_KEY = "nonogram-progress-v1";
    const SOLVED_KEY = "nonogram-solved-v1";

    const FALLBACK_PUZZLE = {
      "id": "freenono-letter-l",
      "title": "L",
      "hint_title": "레닌의 첫 글자",
      "size": [14, 8],
      "row_hints": [[], [2], [2], [2], [2], [2], [2], [2], [2], [2], [2], [6], [6], []],
      "col_hints": [[], [12], [12], [2], [2], [2], [2], []],
      "solution": [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ],
      "solution_image": "/puzzles/freenono-letter-l/solution.png",
      "questions": [
        {"q": "이 퍼즐 데이터가 온 공개 프로젝트는?", "a": ["FreeNono", "webpbn", "Conceptis"], "correct": 0},
        {"q": "노노그램에서 숫자 힌트가 가리키는 것은?", "a": ["연속해서 칠할 칸 묶음", "아무 위치에 칠할 총합만", "정답 이미지의 색상 수"], "correct": 0},
        {"q": "이 글자를 첫 퍼즐로 고른 이유에 가장 가까운 것은?", "a": ["Lenin 이름의 첫 글자를 떠올리게 해서", "정답을 성별로 설명하기 위해서", "큰 화면에서만 풀 수 있어서"], "correct": 0}
      ]
    };

    const FALLBACK_INDEX = {
      default: DEFAULT_PUZZLE_ID,
      puzzles: [
        {
          id: DEFAULT_PUZZLE_ID,
          hint_title: "레닌의 첫 글자",
          size: [14, 8],
          path: "/puzzles/freenono-letter-l/puzzle.json"
        }
      ]
    };

    const state = {
      puzzle: null,
      puzzleIndex: [],
      currentPuzzleId: DEFAULT_PUZZLE_ID,
      cells: [],
      cellNodes: [],
      solved: false,
      mode: "fill",
      answers: new Map(),
      solvedIds: new Set()
    };

    const els = {
      playArea: document.getElementById("playArea"),
      grid: document.getElementById("grid"),
      status: document.getElementById("status"),
      hintTitle: document.getElementById("puzzleHintTitle"),
      size: document.getElementById("puzzleSize"),
      image: document.getElementById("solutionImage"),
      solutionPanel: document.getElementById("solutionPanel"),
      solutionTitle: document.getElementById("solutionTitle"),
      questions: document.getElementById("questions"),
      questionList: document.getElementById("questionList"),
      complete: document.getElementById("complete"),
      side: document.getElementById("sidePanel"),
      sideNote: document.getElementById("sideNote"),
      reset: document.getElementById("resetButton"),
      puzzleStrip: document.getElementById("puzzleStrip"),
      puzzleStripItems: document.getElementById("puzzleStripItems"),
      share: document.getElementById("shareButton"),
      next: document.getElementById("nextButton"),
      sourceNote: document.getElementById("sourceNote"),
      shareText: document.getElementById("shareText"),
      modeFill: document.getElementById("modeFill"),
      modeMark: document.getElementById("modeMark"),
      progressRows: document.getElementById("progressRows"),
      progressCols: document.getElementById("progressCols"),
      progressRowsBar: document.getElementById("progressRowsBar"),
      progressColsBar: document.getElementById("progressColsBar")
    };

    let resizeObserver = null;
    // Row/column highlighting follows the mouse only: after a touch the compat
    // mouseenter would otherwise leave the last tapped line lit up.
    let lastPointerType = "mouse";
    // The stroke in progress: the value every crossed cell receives, and the
    // last cell painted so a slow pointer does not repaint the same one.
    let stroke = null;

    function readStorage(key) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (error) {
        return null;
      }
    }

    function writeStorage(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        /* private mode or quota: progress simply is not kept */
      }
    }

    function loadSolvedIds() {
      const saved = readStorage(SOLVED_KEY);
      state.solvedIds = new Set(Array.isArray(saved) ? saved : []);
    }

    function markSolvedId(id) {
      if (state.solvedIds.has(id)) return;
      state.solvedIds.add(id);
      writeStorage(SOLVED_KEY, Array.from(state.solvedIds));
      refreshPuzzleSelection();
    }

    function saveProgress() {
      if (!state.puzzle) return;
      const all = readStorage(STORAGE_KEY) || {};
      const hasInput = state.cells.some((row) => row.some((value) => value !== 0));
      if (hasInput && !state.solved) {
        all[state.currentPuzzleId] = state.cells;
      } else {
        delete all[state.currentPuzzleId];
      }
      writeStorage(STORAGE_KEY, all);
    }

    function loadProgress(puzzle) {
      const all = readStorage(STORAGE_KEY) || {};
      const saved = all[puzzle.id];
      const [rows, cols] = puzzle.size;
      if (!Array.isArray(saved) || saved.length !== rows) return null;
      if (!saved.every((row) => Array.isArray(row) && row.length === cols)) return null;
      return saved.map((row) => row.map((value) => (value === 1 || value === -1 ? value : 0)));
    }

    function maxHintParts(hints) {
      if (!Array.isArray(hints) || hints.length === 0) return 1;
      return Math.max(1, ...hints.map((hint) => Array.isArray(hint) && hint.length ? hint.length : 1));
    }

    function normalizePuzzleEntry(entry, series) {
      if (!entry || !entry.id) return null;
      const id = String(entry.id);
      return {
        id,
        hint_title: entry.hint_title || entry.title || id,
        size: Array.isArray(entry.size) ? entry.size : null,
        path: entry.path || "/puzzles/" + encodeURIComponent(id) + "/puzzle.json",
        series_id: series?.id || entry.series_id || "",
        series_title: series?.title || entry.series_title || ""
      };
    }

    function collectPuzzleEntries(payload) {
      if (Array.isArray(payload.series)) {
        const seriesEntries = payload.series.flatMap((series) => {
          const puzzles = Array.isArray(series.puzzles) ? series.puzzles : [];
          return puzzles.map((entry) => normalizePuzzleEntry(entry, series)).filter(Boolean);
        });
        if (seriesEntries.length > 0) return seriesEntries;
      }

      return Array.isArray(payload.puzzles) ? payload.puzzles.map((entry) => normalizePuzzleEntry(entry)).filter(Boolean) : [];
    }

    async function loadPuzzleIndex() {
      try {
        const response = await fetch(PUZZLE_INDEX_URL, { cache: "no-cache" });
        if (!response.ok) throw new Error("puzzle index fetch failed");
        const payload = await response.json();
        const puzzles = collectPuzzleEntries(payload);
        if (puzzles.length === 0) throw new Error("empty puzzle index");
        const requestedDefault = typeof payload.default === "string" ? payload.default : puzzles[0].id;
        const defaultId = puzzles.some((entry) => entry.id === requestedDefault) ? requestedDefault : puzzles[0].id;
        return { default: defaultId, puzzles };
      } catch (error) {
        return FALLBACK_INDEX;
      }
    }

    function getRequestedPuzzleId(index) {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("p");
      if (requested && index.puzzles.some((entry) => entry.id === requested)) return requested;
      return index.default || index.puzzles[0].id;
    }

    function getPuzzleEntry(id) {
      return state.puzzleIndex.find((entry) => entry.id === id) || null;
    }

    function getNextPuzzleEntry() {
      const position = state.puzzleIndex.findIndex((entry) => entry.id === state.currentPuzzleId);
      if (position < 0 || position + 1 >= state.puzzleIndex.length) return null;
      return state.puzzleIndex[position + 1];
    }

    async function loadPuzzleById(id) {
      const entry = getPuzzleEntry(id);
      if (!entry) throw new Error("unknown puzzle");

      try {
        const response = await fetch(entry.path, { cache: "no-cache" });
        if (!response.ok) throw new Error("puzzle fetch failed");
        const puzzle = await response.json();
        return {
          ...puzzle,
          id: puzzle.id || entry.id,
          hint_title: puzzle.hint_title || entry.hint_title
        };
      } catch (error) {
        if (id === DEFAULT_PUZZLE_ID && FALLBACK_PUZZLE.id === id) return FALLBACK_PUZZLE;
        throw error;
      }
    }

    async function loadInitialPuzzle() {
      const index = await loadPuzzleIndex();
      state.puzzleIndex = index.puzzles;
      renderPuzzlePicker();
      return loadPuzzleById(getRequestedPuzzleId(index));
    }

    function renderPuzzlePicker() {
      els.puzzleStripItems.innerHTML = "";
      state.puzzleIndex.forEach((entry) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "nono-tab";
        button.dataset.puzzleId = entry.id;
        const title = document.createElement("span");
        title.className = "nono-tab-title";
        title.textContent = entry.hint_title || entry.id;
        button.appendChild(title);
        if (Array.isArray(entry.size)) {
          const size = document.createElement("small");
          size.textContent = entry.size[0] + " × " + entry.size[1];
          button.appendChild(size);
        }
        button.addEventListener("click", () => switchPuzzle(entry.id));
        els.puzzleStripItems.appendChild(button);
      });
      els.puzzleStrip.hidden = state.puzzleIndex.length === 0;
      refreshPuzzleSelection();
    }

    function refreshPuzzleSelection() {
      els.puzzleStripItems.querySelectorAll(".nono-tab").forEach((button) => {
        const id = button.dataset.puzzleId;
        const active = id === state.currentPuzzleId;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-current", active ? "true" : "false");
        const title = button.querySelector(".nono-tab-title");
        if (title) title.classList.toggle("nono-tab-done", state.solvedIds.has(id));
      });
    }

    function setMode(mode) {
      state.mode = mode === "mark" ? "mark" : "fill";
      const fill = state.mode === "fill";
      els.modeFill.classList.toggle("is-active", fill);
      els.modeMark.classList.toggle("is-active", !fill);
      els.modeFill.setAttribute("aria-pressed", fill ? "true" : "false");
      els.modeMark.setAttribute("aria-pressed", fill ? "false" : "true");
    }

    function renderPuzzle(puzzle) {
      state.puzzle = puzzle;
      state.currentPuzzleId = puzzle.id || DEFAULT_PUZZLE_ID;
      state.solved = false;
      state.answers.clear();
      stroke = null;
      const [rows, cols] = puzzle.size;
      const saved = loadProgress(puzzle);
      state.cells = saved || Array.from({ length: rows }, () => Array(cols).fill(0));
      state.cellNodes = Array.from({ length: rows }, () => Array(cols).fill(null));

      refreshPuzzleSelection();
      els.hintTitle.textContent = puzzle.hint_title || "우리의 귀요미 마스코트";
      els.size.textContent = rows + " × " + cols;
      els.image.removeAttribute("src");
      els.solutionTitle.textContent = "이미지 해제";
      els.grid.innerHTML = "";
      updateGridMetrics(rows, cols);
      els.grid.style.gridTemplateColumns = "var(--grid-hint-w) repeat(" + cols + ", var(--grid-cell))";
      els.grid.style.gridTemplateRows = "var(--grid-hint-h) repeat(" + rows + ", var(--grid-cell))";
      els.playArea.classList.remove("is-solved");
      els.solutionPanel.hidden = true;
      els.sourceNote.hidden = true;
      els.sourceNote.textContent = "";
      els.questions.hidden = true;
      els.questionList.innerHTML = "";
      els.complete.hidden = true;
      els.shareText.textContent = "";
      els.sideNote.textContent = saved ? "이어서 풉니다. 저장된 진행을 불러왔습니다." : "힌트를 모두 만족하면 그림이 열립니다.";
      els.status.textContent = "풀이 중";

      const corner = document.createElement("div");
      corner.className = "corner";
      corner.setAttribute("aria-hidden", "true");
      els.grid.appendChild(corner);

      for (let c = 0; c < cols; c += 1) {
        const hint = document.createElement("div");
        hint.className = "hint col-hint" + (c > 0 && c % 5 === 0 ? " c5" : "");
        hint.dataset.colHint = c;
        hint.innerHTML = formatHint(puzzle.col_hints[c]);
        els.grid.appendChild(hint);
      }

      for (let r = 0; r < rows; r += 1) {
        const rowHint = document.createElement("div");
        rowHint.className = "hint row-hint" + (r > 0 && r % 5 === 0 ? " r5" : "");
        rowHint.dataset.rowHint = r;
        rowHint.innerHTML = formatHint(puzzle.row_hints[r]);
        els.grid.appendChild(rowHint);

        for (let c = 0; c < cols; c += 1) {
          const cell = document.createElement("button");
          cell.type = "button";
          cell.className = "cell" + (c > 0 && c % 5 === 0 ? " c5" : "") + (r > 0 && r % 5 === 0 ? " r5" : "");
          cell.dataset.row = r;
          cell.dataset.col = c;
          cell.setAttribute("aria-label", (r + 1) + "행 " + (c + 1) + "열");
          cell.addEventListener("click", (event) => {
            // Pointer input is handled by the stroke; only a keyboard activation
            // (Enter/Space, detail 0) reaches the board through click.
            if (event.detail !== 0) return;
            applyValue(r, c, nextValueFor(r, c, state.mode));
            finishChange();
          });
          cell.addEventListener("mouseenter", () => { if (lastPointerType === "mouse") setHover(r, c); });
          cell.addEventListener("mouseleave", clearHover);
          state.cellNodes[r][c] = cell;
          paintCell(cell, state.cells[r][c]);
          els.grid.appendChild(cell);
        }
      }

      updateSatisfiedHints();
      if (saved) checkSolved();
    }

    function renderSourceNote(source) {
      if (!source || !source.name) {
        els.sourceNote.hidden = true;
        els.sourceNote.textContent = "";
        return;
      }

      els.sourceNote.hidden = false;
      els.sourceNote.innerHTML = "";
      const label = document.createElement("span");
      label.textContent = "출처: ";
      els.sourceNote.appendChild(label);

      if (source.url) {
        const link = document.createElement("a");
        link.href = source.url;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = source.name;
        els.sourceNote.appendChild(link);
      } else {
        const name = document.createElement("strong");
        name.textContent = source.name;
        els.sourceNote.appendChild(name);
      }

      const detail = [source.author, source.license].filter(Boolean).join(" / ");
      if (detail) {
        const tail = document.createElement("span");
        tail.textContent = " / " + detail;
        els.sourceNote.appendChild(tail);
      }
    }

    function buildSolutionImage(puzzle) {
      const [rows, cols] = puzzle.size;
      const cell = 28;
      const width = cols * cell;
      const height = rows * cell;
      const rects = [];
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          if (puzzle.solution?.[r]?.[c] !== 1) continue;
          rects.push('<rect x="' + (c * cell + 2) + '" y="' + (r * cell + 2) + '" width="' + (cell - 4) + '" height="' + (cell - 4) + '" fill="#214d2e"/>');
        }
      }
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + width + ' ' + height + '">' +
        '<rect width="100%" height="100%" fill="#faf2da"/>' +
        rects.join("") +
        '</svg>';
      return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
    }

    function getSolutionImageSrc(puzzle) {
      return puzzle.solution_image || buildSolutionImage(puzzle);
    }

    function updateGridMetrics(rows, cols) {
      const styles = getComputedStyle(els.grid);
      const playStyles = getComputedStyle(els.playArea);
      const baseHint = Number.parseFloat(styles.getPropertyValue("--hint-w")) || 72;
      const maxCell = Number.parseFloat(styles.getPropertyValue("--cell")) || 44;
      const paddingX = (Number.parseFloat(playStyles.paddingLeft) || 0) + (Number.parseFloat(playStyles.paddingRight) || 0);
      const available = Math.max(180, els.playArea.clientWidth - paddingX - 4);
      const compact = available < 520;
      const rowFont = compact ? 13 : 15;
      const colFont = compact ? 12 : 14;
      const rowGap = compact ? 4 : 7;
      const rowPadding = compact ? 14 : 22;
      const colPadding = compact ? 14 : 18;
      const maxRowParts = maxHintParts(state.puzzle?.row_hints);
      const maxColParts = maxHintParts(state.puzzle?.col_hints);
      const requiredHintW = Math.max(44, maxRowParts * rowFont + Math.max(0, maxRowParts - 1) * rowGap + rowPadding);
      const maxHintW = Math.max(baseHint, requiredHintW);
      const compactHint = Math.min(Math.max(44, available * 0.34), maxHintW);
      const cell = Math.max(14, Math.min(maxCell, Math.floor((available - compactHint) / cols)));
      const requiredHintH = Math.ceil(maxColParts * colFont * 1.12 + Math.max(0, maxColParts - 1) + colPadding);
      const baseHintH = Number.parseFloat(styles.getPropertyValue("--hint-h")) || 92;
      const hintH = Math.max(62, Math.min(150, Math.max(baseHintH, requiredHintH)));
      els.grid.style.setProperty("--grid-hint-w", compactHint + "px");
      els.grid.style.setProperty("--grid-cell", cell + "px");
      els.grid.style.setProperty("--grid-hint-h", hintH + "px");
      els.grid.style.width = (compactHint + (cell * cols) + 4) + "px";
      els.grid.style.maxWidth = "100%";
    }

    function refreshGridMetrics() {
      if (!state.puzzle) return;
      const [rows, cols] = state.puzzle.size;
      updateGridMetrics(rows, cols);
    }

    function formatHint(values) {
      if (!values || values.length === 0) return "<span>0</span>";
      return values.map((value) => "<span>" + value + "</span>").join("");
    }

    function lineHints(values) {
      const hints = [];
      let run = 0;
      values.forEach((value) => {
        if (value === 1) {
          run += 1;
          return;
        }
        if (run > 0) {
          hints.push(run);
          run = 0;
        }
      });
      if (run > 0) hints.push(run);
      return hints;
    }

    function sameHints(current, target) {
      const normalizedTarget = Array.isArray(target) ? target : [];
      if (current.length !== normalizedTarget.length) return false;
      return current.every((value, index) => value === normalizedTarget[index]);
    }

    function updateSatisfiedHints() {
      if (!state.puzzle) return;
      const [rows, cols] = state.puzzle.size;
      let rowsDone = 0;
      let colsDone = 0;

      for (let r = 0; r < rows; r += 1) {
        const hint = els.grid.querySelector('.row-hint[data-row-hint="' + r + '"]');
        if (!hint) continue;
        const done = sameHints(lineHints(state.cells[r]), state.puzzle.row_hints[r]);
        hint.classList.toggle("satisfied", done);
        if (done) rowsDone += 1;
      }

      for (let c = 0; c < cols; c += 1) {
        const hint = els.grid.querySelector('.col-hint[data-col-hint="' + c + '"]');
        if (!hint) continue;
        const values = state.cells.map((row) => row[c]);
        const done = sameHints(lineHints(values), state.puzzle.col_hints[c]);
        hint.classList.toggle("satisfied", done);
        if (done) colsDone += 1;
      }

      els.progressRows.textContent = rowsDone + " / " + rows;
      els.progressCols.textContent = colsDone + " / " + cols;
      els.progressRowsBar.style.width = Math.round((rowsDone / rows) * 100) + "%";
      els.progressColsBar.style.width = Math.round((colsDone / cols) * 100) + "%";
    }

    // The value a press in `mode` gives a cell: toggling off when it already
    // holds that value, otherwise setting it.
    function nextValueFor(row, col, mode) {
      const target = mode === "mark" ? -1 : 1;
      return state.cells[row][col] === target ? 0 : target;
    }

    function applyValue(row, col, value) {
      if (state.solved) return false;
      if (state.cells[row][col] === value) return false;
      state.cells[row][col] = value;
      paintCell(state.cellNodes[row][col], value);
      return true;
    }

    function finishChange() {
      updateSatisfiedHints();
      saveProgress();
      checkSolved();
    }

    function paintCell(cell, value) {
      if (!cell) return;
      cell.classList.toggle("filled", value === 1);
      cell.classList.toggle("marked", value === -1);
      cell.setAttribute("aria-pressed", value !== 0 ? "true" : "false");
    }

    function cellFromPoint(x, y) {
      const node = document.elementFromPoint(x, y);
      const cell = node && node.closest ? node.closest(".nono-grid .cell") : null;
      if (!cell || !els.grid.contains(cell)) return null;
      return { row: Number(cell.dataset.row), col: Number(cell.dataset.col) };
    }

    function beginStroke(event) {
      lastPointerType = event.pointerType || "mouse";
      if (lastPointerType !== "mouse") clearHover();
      if (state.solved) return;
      if (event.pointerType === "mouse" && event.button !== 0 && event.button !== 2) return;
      const cell = event.target.closest ? event.target.closest(".cell") : null;
      if (!cell || !els.grid.contains(cell)) return;
      event.preventDefault();
      const row = Number(cell.dataset.row);
      const col = Number(cell.dataset.col);
      const mode = event.pointerType === "mouse" && event.button === 2 ? "mark" : state.mode;
      stroke = { pointerId: event.pointerId, value: nextValueFor(row, col, mode), last: row + ":" + col, changed: false };
      try { els.grid.setPointerCapture(event.pointerId); } catch (error) { /* capture is a nicety */ }
      if (applyValue(row, col, stroke.value)) stroke.changed = true;
      updateSatisfiedHints();
    }

    function moveStroke(event) {
      if (!stroke || event.pointerId !== stroke.pointerId) return;
      const hit = cellFromPoint(event.clientX, event.clientY);
      if (!hit) return;
      const key = hit.row + ":" + hit.col;
      if (key === stroke.last) return;
      stroke.last = key;
      if (applyValue(hit.row, hit.col, stroke.value)) {
        stroke.changed = true;
        updateSatisfiedHints();
      }
      if (event.pointerType === "mouse") setHover(hit.row, hit.col);
    }

    function endStroke(event) {
      if (!stroke || event.pointerId !== stroke.pointerId) return;
      const changed = stroke.changed;
      stroke = null;
      try { els.grid.releasePointerCapture(event.pointerId); } catch (error) { /* already released */ }
      if (changed) {
        saveProgress();
        checkSolved();
      }
    }

    function setHover(row, col) {
      els.grid.querySelectorAll(".cell").forEach((cell) => {
        cell.classList.toggle("row-hover", Number(cell.dataset.row) === row);
        cell.classList.toggle("col-hover", Number(cell.dataset.col) === col);
      });
      els.grid.querySelectorAll(".row-hint").forEach((hint) => {
        hint.classList.toggle("active", Number(hint.dataset.rowHint) === row);
      });
      els.grid.querySelectorAll(".col-hint").forEach((hint) => {
        hint.classList.toggle("active", Number(hint.dataset.colHint) === col);
      });
    }

    function clearHover() {
      els.grid.querySelectorAll(".row-hover, .col-hover, .hint.active").forEach((node) => {
        node.classList.remove("row-hover", "col-hover", "active");
      });
    }

    function checkSolved() {
      const puzzle = state.puzzle;
      const [rows, cols] = puzzle.size;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const filled = state.cells[r][c] === 1 ? 1 : 0;
          if (filled !== puzzle.solution[r][c]) return;
        }
      }
      revealSolution();
    }

    function revealSolution() {
      if (state.solved) return;
      state.solved = true;
      stroke = null;
      clearHover();
      els.playArea.classList.add("is-solved");
      els.image.src = getSolutionImageSrc(state.puzzle);
      els.solutionTitle.textContent = state.puzzle.title || "이미지 해제";
      els.solutionPanel.hidden = false;
      renderSourceNote(state.puzzle.source);
      renderQuestions(state.puzzle.questions || []);
      els.questions.hidden = false;
      els.status.textContent = "이미지 해제";
      els.sideNote.textContent = "그림이 열렸습니다. 아래 맥락 질문에 답해 보세요.";
      saveProgress();
      markSolvedId(state.currentPuzzleId);
      if (window.matchMedia("(max-width: 920px)").matches) {
        els.solutionPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    function renderQuestions(questions) {
      els.questionList.innerHTML = "";
      questions.forEach((question, index) => {
        const wrap = document.createElement("article");
        wrap.className = "nono-question";

        const prompt = document.createElement("p");
        prompt.textContent = (index + 1) + ". " + question.q;
        wrap.appendChild(prompt);

        const answers = document.createElement("div");
        answers.className = "nono-answers";
        question.a.forEach((answer, answerIndex) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "nono-answer";
          button.textContent = answer;
          button.addEventListener("click", () => chooseAnswer(index, answerIndex, button));
          answers.appendChild(button);
        });
        wrap.appendChild(answers);
        els.questionList.appendChild(wrap);
      });
    }

    function chooseAnswer(questionIndex, answerIndex, button) {
      const question = state.puzzle.questions[questionIndex];
      const group = button.parentElement;
      group.querySelectorAll(".nono-answer").forEach((node) => {
        node.classList.remove("correct", "wrong");
      });

      const isCorrect = answerIndex === question.correct;
      button.classList.add(isCorrect ? "correct" : "wrong");
      if (isCorrect) {
        state.answers.set(questionIndex, answerIndex);
      } else {
        state.answers.delete(questionIndex);
      }
      checkComplete();
    }

    function checkComplete() {
      if (state.answers.size !== state.puzzle.questions.length) return;
      els.complete.hidden = false;
      els.next.hidden = !getNextPuzzleEntry();
      els.status.textContent = "완료";
      els.sideNote.textContent = "퍼즐과 질문을 모두 통과했습니다.";
    }

    function resetPuzzle() {
      if (!state.puzzle) return;
      if (!window.confirm("퍼즐을 초기화할까요?")) return;
      const all = readStorage(STORAGE_KEY) || {};
      delete all[state.currentPuzzleId];
      writeStorage(STORAGE_KEY, all);
      renderPuzzle(state.puzzle);
    }

    function copyShareLink() {
      const link = window.location.origin + "/nonogram/?p=" + encodeURIComponent(state.currentPuzzleId);
      navigator.clipboard?.writeText(link).then(() => {
        els.shareText.textContent = "복사됨: " + link;
      }).catch(() => {
        els.shareText.textContent = link;
      });
    }

    async function switchPuzzle(id) {
      if (!id || id === state.currentPuzzleId) return;
      els.status.textContent = "퍼즐 로딩 중";
      try {
        const puzzle = await loadPuzzleById(id);
        renderPuzzle(puzzle);
        const url = new URL(window.location.href);
        url.searchParams.set("p", id);
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      } catch (error) {
        els.status.textContent = "로딩 실패";
        refreshPuzzleSelection();
      }
    }

    els.reset.addEventListener("click", resetPuzzle);
    els.share.addEventListener("click", copyShareLink);
    els.next.addEventListener("click", () => {
      const next = getNextPuzzleEntry();
      if (next) {
        switchPuzzle(next.id);
        els.playArea.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    els.modeFill.addEventListener("click", () => setMode("fill"));
    els.modeMark.addEventListener("click", () => setMode("mark"));
    els.grid.addEventListener("pointerdown", beginStroke);
    els.grid.addEventListener("pointermove", moveStroke);
    els.grid.addEventListener("pointerup", endStroke);
    els.grid.addEventListener("pointercancel", endStroke);
    els.grid.addEventListener("contextmenu", (event) => event.preventDefault());
    els.grid.addEventListener("mouseleave", clearHover);
    resizeObserver = new ResizeObserver(refreshGridMetrics);
    resizeObserver.observe(els.playArea);

    loadSolvedIds();
    loadInitialPuzzle().then(renderPuzzle).catch(() => {
      els.status.textContent = "로딩 실패";
    });
})();
