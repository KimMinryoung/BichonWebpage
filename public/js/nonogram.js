// Nonogram page (views/public/nonogram.ejs). The wrapper keeps its constants
// off the page's global scope.
//
// Input model: a fill/mark mode toggle decides what a press does (mouse users
// also get the right button for X marks), and a press that moves across cells
// paints every cell it crosses with the same value as the first one, so a run
// of five is one stroke rather than five clicks. Progress is saved per puzzle
// in localStorage so a half-solved board survives a reload.
(function () {
    const DEFAULT_PUZZLE_ID = "workers-hammer";
    const PUZZLE_INDEX_URL = "/puzzles/index.json";
    const STORAGE_KEY = "nonogram-progress-v2";
    const LAST_KEY = "nonogram-last-v2";
    const levels = { beginner: '입문', intermediate: '중급', challenge: '도전' };
    let records = {}, undo = [], redo = [], beforeChange = null, requestId = 0, retryId = null, zoomed = false;

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

    function storageNotice() {
      document.getElementById('nonoSaveNotice').textContent = '이 브라우저에서는 저장할 수 없습니다. 현재 퍼즐은 계속 풀 수 있습니다.';
    }
    function object(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
    function readStorage(key) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (error) {
        storageNotice(); return null;
      }
    }

    function writeStorage(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        storageNotice();
      }
    }

    function loadSolvedIds() {
      records = object(readStorage(STORAGE_KEY));
      state.solvedIds = new Set(Object.keys(records).filter(id => records[id]?.completed === true));
    }
    function saveProgress() {
      if (!state.puzzle) return;
      const completed = state.solved && state.answers.size === state.puzzle.questions.length;
      records[state.currentPuzzleId] = { cells: state.cells.map(r => r.slice()), revealed: state.solved,
        answers: Object.fromEntries(state.answers), completed, updatedAt: Date.now() };
      if (completed) state.solvedIds.add(state.currentPuzzleId); else state.solvedIds.delete(state.currentPuzzleId);
      writeStorage(STORAGE_KEY, records);
      writeStorage(LAST_KEY, state.currentPuzzleId);
      refreshPuzzleSelection();
    }
    function loadProgress(puzzle) {
      let record = records[puzzle.id];
      if (!record) {
        const oldCells = object(readStorage('nonogram-progress-v1'))[puzzle.id];
        const oldSolved = readStorage('nonogram-solved-v1');
        record = { cells: Array.isArray(oldSolved) && oldSolved.includes(puzzle.id) ? puzzle.solution : oldCells, answers: {} };
      }
      const saved = record?.cells;
      const [rows, cols] = puzzle.size;
      if (!Array.isArray(saved) || saved.length !== rows || !saved.every(row => Array.isArray(row) && row.length === cols && row.every(v => [0, 1, -1].includes(v)))) return null;
      for (const [index, answer] of Object.entries(object(record.answers))) {
        const question = puzzle.questions[Number(index)];
        if (question && answer === question.correct) state.answers.set(Number(index), answer);
      }
      return saved.map(row => row.slice());
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
        difficulty: Object.hasOwn(levels, entry.difficulty) ? entry.difficulty : 'intermediate',
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
        throw error;
      }
    }

    function getRequestedPuzzleId(index) {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("p");
      if (requested && index.puzzles.some((entry) => entry.id === requested)) return requested;
      if (requested) throw new Error('unknown puzzle');
      const last = readStorage(LAST_KEY);
      if (index.puzzles.some(entry => entry.id === last) && records[last] && !records[last].completed) return last;
      const unfinished = index.puzzles.filter(entry => records[entry.id] && !records[entry.id].completed)
        .sort((a, b) => (Number(records[b.id].updatedAt) || 0) - (Number(records[a.id].updatedAt) || 0));
      return unfinished[0]?.id || index.default || index.puzzles[0].id;
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
        if (!Array.isArray(puzzle.size) || puzzle.size.length !== 2 || !puzzle.size.every(n => Number.isInteger(n) && n > 0 && n <= 30) ||
            !Array.isArray(puzzle.solution) || puzzle.solution.length !== puzzle.size[0] ||
            !puzzle.solution.every(row => Array.isArray(row) && row.length === puzzle.size[1] && row.every(v => v === 0 || v === 1)) ||
            !Array.isArray(puzzle.row_hints) || puzzle.row_hints.length !== puzzle.size[0] ||
            !Array.isArray(puzzle.col_hints) || puzzle.col_hints.length !== puzzle.size[1] ||
            ![...puzzle.row_hints, ...puzzle.col_hints].every(line => Array.isArray(line) && line.every(n => Number.isInteger(n) && n > 0 && n <= 30)) ||
            !Array.isArray(puzzle.questions) || !puzzle.questions.every(q => typeof q.q === 'string' && Array.isArray(q.a) && Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.a.length)) throw new Error('invalid puzzle');
        return {
          ...puzzle,
          id: entry.id,
          hint_title: puzzle.hint_title || entry.hint_title
        };
      } catch (error) {
        throw error;
      }
    }

    async function loadInitialPuzzle() {
      const token = ++requestId;
      try {
        document.getElementById('nonoRetry').hidden = true;
        const index = await loadPuzzleIndex();
        if (token !== requestId) return;
        state.puzzleIndex = index.puzzles;
        renderPuzzlePicker();
        const puzzle = await loadPuzzleById(getRequestedPuzzleId(index));
        if (token === requestId) renderPuzzle(puzzle);
      } catch (_) { if (token === requestId) loadError(null); }
    }
    function loadError(id) {
      retryId = id;
      els.status.textContent = '퍼즐을 불러오지 못했습니다. 다시 시도하거나 다른 문제를 골라 주세요.';
      document.getElementById('nonoRetry').hidden = false;
      refreshPuzzleSelection();
    }

    function renderPuzzlePicker() {
      els.puzzleStripItems.innerHTML = "";
      const groups = {};
      for (const [level, label] of Object.entries(levels)) {
        const group = document.createElement('details'); group.className = 'nono-level';
        group.dataset.level = level;
        const summary = document.createElement('summary'); summary.textContent = label;
        const items = document.createElement('div'); items.className = 'nono-level-items';
        group.append(summary, items); els.puzzleStripItems.append(group); groups[level] = items;
      }
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
        groups[entry.difficulty].appendChild(button);
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
        button.setAttribute('aria-label', (getPuzzleEntry(id)?.hint_title || id) + (state.solvedIds.has(id) ? ' · 완료' : records[id]?.revealed ? ' · 그림 해제, 질문 남음' : records[id] ? ' · 진행 중' : ''));
        let badge = button.querySelector('.nono-tab-status');
        if (!badge) { badge = document.createElement('small'); badge.className = 'nono-tab-status'; button.append(badge); }
        badge.textContent = state.solvedIds.has(id) ? '완료' : records[id]?.revealed ? '그림 해제 · 질문 남음' : records[id] ? '진행 중' : '';
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
      stroke = null; undo = []; redo = []; beforeChange = null;
      document.getElementById('nonoHintMessage').textContent = '';
      document.getElementById('nonoRetry').hidden = true;
      const group = els.puzzleStripItems.querySelector('[data-level="' + getPuzzleEntry(state.currentPuzzleId)?.difficulty + '"]');
      if (group) group.open = true;
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
            beginChange();
            applyValue(r, c, nextValueFor(r, c, state.mode));
            finishChange();
          });
          cell.tabIndex = r === 0 && c === 0 ? 0 : -1;
          cell.addEventListener('focus', () => { els.grid.querySelectorAll('.cell[tabindex="0"]').forEach(n => { n.tabIndex = -1; }); cell.tabIndex = 0; });
          cell.addEventListener('keydown', event => {
            const move = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[event.key];
            if (!move) return;
            event.preventDefault();
            state.cellNodes[Math.max(0, Math.min(rows - 1, r + move[0]))][Math.max(0, Math.min(cols - 1, c + move[1]))].focus();
          });
          cell.addEventListener("mouseenter", () => { if (lastPointerType === "mouse") setHover(r, c); });
          cell.addEventListener("mouseleave", clearHover);
          state.cellNodes[r][c] = cell;
          paintCell(cell, state.cells[r][c]);
          els.grid.appendChild(cell);
        }
      }

      updateSatisfiedHints();
      if (saved) checkSolved(false);
      if (!state.solved) state.answers.clear();
      saveProgress(); updateTools();
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
      const compactHint = zoomed ? maxHintW : Math.min(Math.max(44, available * 0.34), maxHintW);
      const cell = zoomed ? 36 : Math.max(14, Math.min(maxCell, Math.floor((available - compactHint) / cols)));
      const requiredHintH = Math.ceil(maxColParts * colFont * 1.12 + Math.max(0, maxColParts - 1) + colPadding);
      const baseHintH = Number.parseFloat(styles.getPropertyValue("--hint-h")) || 92;
      const hintH = Math.max(62, Math.min(150, Math.max(baseHintH, requiredHintH)));
      els.grid.style.setProperty("--grid-hint-w", compactHint + "px");
      els.grid.style.setProperty("--grid-cell", cell + "px");
      els.grid.style.setProperty("--grid-hint-h", hintH + "px");
      els.grid.style.width = (compactHint + (cell * cols) + 4) + "px";
      els.grid.style.maxWidth = zoomed ? "none" : "100%";
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

    function beginChange() { if (!state.solved) beforeChange = state.cells.map(row => row.slice()); }
    function updateTools() {
      document.getElementById('nonoUndo').disabled = !undo.length || state.solved;
      document.getElementById('nonoRedo').disabled = !redo.length || state.solved;
      document.getElementById('nonoHint').disabled = !state.puzzle || state.solved;
      els.reset.disabled = !state.puzzle;
    }
    function finishChange() {
      if (beforeChange && JSON.stringify(beforeChange) !== JSON.stringify(state.cells)) {
        undo.push(beforeChange); if (undo.length > 100) undo.shift(); redo = [];
      }
      beforeChange = null;
      document.getElementById('nonoHintMessage').textContent = '';
      updateSatisfiedHints();
      saveProgress();
      checkSolved(); updateTools();
    }

    function paintCell(cell, value) {
      if (!cell) return;
      cell.classList.toggle("filled", value === 1);
      cell.classList.toggle("marked", value === -1);
      cell.setAttribute("aria-pressed", value !== 0 ? "true" : "false");
      cell.setAttribute('aria-label', `${Number(cell.dataset.row) + 1}행 ${Number(cell.dataset.col) + 1}열 · ${value === 1 ? '칠함' : value === -1 ? 'X 표시' : '미정'}`);
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
      beginChange();
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
      if (changed) finishChange(); else beforeChange = null;
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

    function checkSolved(scroll = true) {
      const puzzle = state.puzzle;
      const [rows, cols] = puzzle.size;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const filled = state.cells[r][c] === 1 ? 1 : 0;
          if (filled !== puzzle.solution[r][c]) return;
        }
      }
      revealSolution(scroll);
    }

    function revealSolution(scroll) {
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
      state.cellNodes.flat().forEach(cell => cell.setAttribute('aria-disabled', 'true'));
      checkComplete(); updateTools();
      if (scroll && window.matchMedia("(max-width: 920px)").matches) {
        els.solutionPanel.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: "start" });
        els.solutionTitle.tabIndex = -1; els.solutionTitle.focus({ preventScroll: true });
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
        const feedback = document.createElement('p'); feedback.className = 'nono-feedback'; feedback.setAttribute('aria-live', 'polite'); wrap.append(feedback);
        if (state.answers.has(index)) {
          answers.children[question.correct].classList.add('correct');
          feedback.textContent = '정답입니다. ' + (question.explanation || '');
        }
        if (question.source_url) {
          const source = document.createElement('a'); source.href = question.source_url; source.textContent = '근거 읽기 ↗'; source.target = '_blank'; source.rel = 'noopener'; wrap.append(source);
        }
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
      group.parentElement.querySelector('.nono-feedback').textContent = (isCorrect ? '정답입니다. ' : '다시 생각해 보세요. ') + (question.explanation || '');
      checkComplete(); saveProgress();
    }

    function checkComplete() {
      els.complete.hidden = state.answers.size !== state.puzzle.questions.length;
      if (els.complete.hidden) {
        els.status.textContent = '그림 해제 · 질문 남음';
        els.sideNote.textContent = '맥락 질문에 답하면 완료됩니다.';
        return;
      }
      els.complete.hidden = false;
      els.next.hidden = !getNextPuzzleEntry();
      els.status.textContent = "완료";
      els.sideNote.textContent = "퍼즐과 질문을 모두 통과했습니다.";
    }

    function resetPuzzle() {
      if (!state.puzzle) return;
      if (!window.confirm("퍼즐을 초기화할까요?")) return;
      records[state.currentPuzzleId] = { cells: state.cells.map(row => row.map(() => 0)), answers: {}, revealed: false, completed: false };
      state.solvedIds.delete(state.currentPuzzleId);
      writeStorage(STORAGE_KEY, records);
      renderPuzzle(state.puzzle);
    }

    function copyShareLink() {
      const link = window.location.origin + "/nonogram/?p=" + encodeURIComponent(state.currentPuzzleId);
      if (!navigator.clipboard) { els.shareText.textContent = link; return; }
      navigator.clipboard.writeText(link).then(() => {
        els.shareText.textContent = "복사됨: " + link;
      }).catch(() => {
        els.shareText.textContent = link;
      });
    }

    async function switchPuzzle(id) {
      if (!id) return;
      if (stroke) endStroke({ pointerId: stroke.pointerId });
      const token = ++requestId;
      els.status.textContent = '퍼즐 로딩 중';
      document.getElementById('nonoRetry').hidden = true;
      try {
        const puzzle = await loadPuzzleById(id);
        if (token !== requestId) return;
        renderPuzzle(puzzle);
        const url = new URL(window.location.href); url.searchParams.set('p', id);
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      } catch (_) { if (token === requestId) loadError(id); }
    }
    function historyStep(from, to) {
      if (!from.length || state.solved || stroke) return;
      to.push(state.cells.map(row => row.slice())); state.cells = from.pop();
      state.cells.forEach((row, r) => row.forEach((value, c) => paintCell(state.cellNodes[r][c], value)));
      beforeChange = null; finishChange();
    }
    document.getElementById('nonoUndo').addEventListener('click', () => historyStep(undo, redo));
    document.getElementById('nonoRedo').addEventListener('click', () => historyStep(redo, undo));
    document.getElementById('nonoZoom').addEventListener('click', event => {
      zoomed = !zoomed; event.currentTarget.setAttribute('aria-pressed', String(zoomed));
      event.currentTarget.textContent = zoomed ? '판 맞추기' : '크게 보기';
      document.getElementById('nonoZoomNote').hidden = !zoomed; refreshGridMetrics();
    });
    document.getElementById('nonoRetry').addEventListener('click', () => retryId ? switchPuzzle(retryId) : loadInitialPuzzle());
    document.getElementById('nonoHint').addEventListener('click', () => {
      if (!state.puzzle || state.solved) return;
      const message = document.getElementById('nonoHintMessage');
      const result = window.NonogramLogic.deduce(state.puzzle, state.cells);
      if (result.conflict || state.cells.some((row, r) => row.some((v, c) => v && (v === 1 ? 1 : 0) !== state.puzzle.solution[r][c]))) {
        message.textContent = result.conflict ? `${result.conflict.line + 1}${result.conflict.axis === 'row' ? '행' : '열'}의 표시가 힌트와 맞지 않습니다. 표시를 점검하거나 되돌리기를 사용하세요.` : '현재 표시 중 정답과 맞지 않는 칸이 있습니다. 새 힌트 전에 표시를 점검해 보세요.';
        return;
      }
      const step = result.steps[0];
      if (!step) { message.textContent = '지금은 한 줄만으로 확정할 새 칸이 없습니다. 행과 열의 힌트를 함께 살펴보세요.'; return; }
      beginChange(); applyValue(step.row, step.col, step.value); finishChange();
      message.textContent = `${step.line + 1}${step.axis === 'row' ? '행' : '열'}의 숫자와 현재 표시를 만족하는 ${step.options}가지 배치에서 ${step.row + 1}행 ${step.col + 1}열은 모두 ${step.value === 1 ? '칠한 칸' : '빈칸'}입니다. 이 한 칸을 표시했습니다.`;
    });

    els.reset.addEventListener("click", resetPuzzle);
    els.share.addEventListener("click", copyShareLink);
    els.next.addEventListener("click", () => {
      const next = getNextPuzzleEntry();
      if (next) {
        switchPuzzle(next.id);
        els.playArea.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
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
    updateTools();
    loadInitialPuzzle();
})();
