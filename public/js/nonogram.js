    const DEFAULT_PUZZLE_ID = "minchong-15";
    const PUZZLE_INDEX_URL = "/puzzles/index.json";

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
      solved: false,
      answers: new Map()
    };

    const els = {
      playArea: document.getElementById("playArea"),
      grid: document.getElementById("grid"),
      status: document.getElementById("status"),
      hintTitle: document.getElementById("puzzleHintTitle"),
      size: document.getElementById("puzzleSize"),
      image: document.getElementById("solutionImage"),
      solutionTitle: document.getElementById("solutionTitle"),
      questions: document.getElementById("questions"),
      questionList: document.getElementById("questionList"),
      complete: document.getElementById("complete"),
      side: document.getElementById("sidePanel"),
      reset: document.getElementById("resetButton"),
      puzzleStrip: document.getElementById("puzzleStrip"),
      puzzleStripItems: document.getElementById("puzzleStripItems"),
      picker: document.getElementById("puzzlePicker"),
      select: document.getElementById("puzzleSelect"),
      share: document.getElementById("shareButton"),
      touchGuide: document.getElementById("touchGuide"),
      sourceNote: document.getElementById("sourceNote"),
      shareText: document.getElementById("shareText")
    };

    let touchInteractionCount = 0;
    let lastPointerType = "";
    let resizeObserver = null;

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
      els.select.innerHTML = "";
      els.puzzleStripItems.innerHTML = "";
      const hasSeries = state.puzzleIndex.some((entry) => entry.series_title);

      function appendOption(parent, entry) {
        const option = document.createElement("option");
        option.value = entry.id;
        option.textContent = entry.hint_title || entry.id;
        parent.appendChild(option);
      }

      function appendTab(entry) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "puzzle-tab";
        button.dataset.puzzleId = entry.id;
        button.textContent = entry.hint_title || entry.id;
        button.addEventListener("click", () => switchPuzzle(entry.id));
        els.puzzleStripItems.appendChild(button);
      }

      state.puzzleIndex.forEach(appendTab);

      if (hasSeries) {
        const groups = new Map();
        state.puzzleIndex.forEach((entry) => {
          const key = entry.series_id || entry.series_title || "default";
          if (!groups.has(key)) {
            const group = document.createElement("optgroup");
            group.label = entry.series_title || "기본";
            groups.set(key, group);
            els.select.appendChild(group);
          }
          appendOption(groups.get(key), entry);
        });
      } else {
        state.puzzleIndex.forEach((entry) => appendOption(els.select, entry));
      }

      els.picker.hidden = state.puzzleIndex.length <= 1;
      els.puzzleStrip.hidden = state.puzzleIndex.length === 0;
    }

    function refreshPuzzleSelection() {
      document.querySelectorAll(".puzzle-tab").forEach((button) => {
        const active = button.dataset.puzzleId === state.currentPuzzleId;
        button.classList.toggle("active", active);
        button.setAttribute("aria-current", active ? "true" : "false");
      });
    }

    function renderPuzzle(puzzle) {
      state.puzzle = puzzle;
      state.currentPuzzleId = puzzle.id || DEFAULT_PUZZLE_ID;
      state.solved = false;
      state.answers.clear();
      state.cells = Array.from({ length: puzzle.size[0] }, () => Array(puzzle.size[1]).fill(0));

      const [rows, cols] = puzzle.size;
      els.select.value = state.currentPuzzleId;
      refreshPuzzleSelection();
      els.hintTitle.textContent = puzzle.hint_title || "우리의 귀요미 마스코트";
      els.size.textContent = rows + " x " + cols;
      els.image.removeAttribute("src");
      els.solutionTitle.textContent = "이미지 해제";
      els.grid.innerHTML = "";
      updateGridMetrics(rows, cols);
      els.grid.style.gridTemplateColumns = "var(--grid-hint-w) repeat(" + cols + ", var(--grid-cell))";
      els.grid.style.gridTemplateRows = "var(--grid-hint-h) repeat(" + rows + ", var(--grid-cell))";
      els.playArea.classList.remove("is-solved");
      els.side.hidden = true;
      els.sourceNote.hidden = true;
      els.sourceNote.textContent = "";
      els.questions.classList.remove("unlocked");
      els.questionList.innerHTML = "";
      els.complete.classList.remove("show");
      els.shareText.textContent = "공유 링크 자리: /nonogram/?p=" + state.currentPuzzleId;
      els.status.textContent = "풀이 중";

      const corner = document.createElement("div");
      corner.className = "corner";
      corner.setAttribute("aria-hidden", "true");
      els.grid.appendChild(corner);

      for (let c = 0; c < cols; c += 1) {
        const hint = document.createElement("div");
        hint.className = "hint col-hint";
        hint.dataset.colHint = c;
        hint.innerHTML = formatHint(puzzle.col_hints[c]);
        els.grid.appendChild(hint);
      }

      for (let r = 0; r < rows; r += 1) {
        const rowHint = document.createElement("div");
        rowHint.className = "hint row-hint";
        rowHint.dataset.rowHint = r;
        rowHint.innerHTML = formatHint(puzzle.row_hints[r]);
        els.grid.appendChild(rowHint);

        for (let c = 0; c < cols; c += 1) {
          const cell = document.createElement("button");
          cell.type = "button";
          cell.className = "cell";
          cell.dataset.row = r;
          cell.dataset.col = c;
          cell.setAttribute("aria-label", (r + 1) + "행 " + (c + 1) + "열");
          cell.addEventListener("pointerdown", noteTouchInteraction);
          cell.addEventListener("click", (event) => applyPrimaryAction(event, r, c, cell));
          cell.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            if (lastPointerType === "touch") return;
            cycleMark(r, c, cell);
          });
          cell.addEventListener("mouseenter", () => setHover(r, c));
          cell.addEventListener("mouseleave", clearHover);
          els.grid.appendChild(cell);
        }
      }

      updateSatisfiedHints();
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

      const detail = document.createElement("span");
      detail.textContent = " / " + [source.author, source.license].filter(Boolean).join(" / ");
      els.sourceNote.appendChild(detail);
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
          rects.push('<rect x="' + (c * cell + 2) + '" y="' + (r * cell + 2) + '" width="' + (cell - 4) + '" height="' + (cell - 4) + '" fill="#d03b40"/>');
        }
      }
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + width + ' ' + height + '">' +
        '<rect width="100%" height="100%" fill="#10151b"/>' +
        rects.join("") +
        '</svg>';
      return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
    }

    function getSolutionImageSrc(puzzle) {
      return puzzle.solution_image || buildSolutionImage(puzzle);
    }

    function updateGridMetrics(rows, cols) {
      const styles = getComputedStyle(document.documentElement);
      const playStyles = getComputedStyle(els.playArea);
      const baseHint = Number.parseFloat(styles.getPropertyValue("--hint-w")) || 72;
      const maxCell = Number.parseFloat(styles.getPropertyValue("--cell")) || 48;
      const paddingX = (Number.parseFloat(playStyles.paddingLeft) || 0) + (Number.parseFloat(playStyles.paddingRight) || 0);
      const available = Math.max(180, els.playArea.clientWidth - paddingX - 2);
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
      els.grid.style.width = (compactHint + (cell * cols)) + "px";
      els.grid.style.maxWidth = "100%";
    }

    function refreshGridMetrics() {
      if (!state.puzzle) return;
      const [rows, cols] = state.puzzle.size;
      updateGridMetrics(rows, cols);
    }

    function noteTouchInteraction(event) {
      lastPointerType = event.pointerType || "";
      if (event.pointerType !== "touch") return;
      touchInteractionCount += 1;
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

      for (let r = 0; r < rows; r += 1) {
        const hint = document.querySelector('.row-hint[data-row-hint="' + r + '"]');
        if (!hint) continue;
        hint.classList.toggle("satisfied", sameHints(lineHints(state.cells[r]), state.puzzle.row_hints[r]));
      }

      for (let c = 0; c < cols; c += 1) {
        const hint = document.querySelector('.col-hint[data-col-hint="' + c + '"]');
        if (!hint) continue;
        const values = state.cells.map((row) => row[c]);
        hint.classList.toggle("satisfied", sameHints(lineHints(values), state.puzzle.col_hints[c]));
      }
    }

    function applyPrimaryAction(event, row, col, cell) {
      if (event.detail === 0 || lastPointerType === "touch") {
        cycleTouch(row, col, cell);
        return;
      }
      cycleFill(row, col, cell);
    }

    function cycleFill(row, col, cell) {
      if (state.solved) return;
      state.cells[row][col] = state.cells[row][col] === 1 ? 0 : 1;
      paintCell(cell, state.cells[row][col]);
      updateSatisfiedHints();
      checkSolved();
    }

    function cycleMark(row, col, cell) {
      if (state.solved) return;
      state.cells[row][col] = state.cells[row][col] === -1 ? 0 : -1;
      paintCell(cell, state.cells[row][col]);
      updateSatisfiedHints();
      checkSolved();
    }

    function cycleTouch(row, col, cell) {
      if (state.solved) return;
      const current = state.cells[row][col];
      const next = current === 0 ? 1 : current === 1 ? -1 : 0;
      state.cells[row][col] = next;
      paintCell(cell, next);
      updateSatisfiedHints();
      checkSolved();
    }

    function paintCell(cell, value) {
      cell.classList.toggle("filled", value === 1);
      cell.classList.toggle("marked", value === -1);
      cell.setAttribute("aria-pressed", value !== 0 ? "true" : "false");
    }

    function setHover(row, col) {
      document.querySelectorAll(".cell").forEach((cell) => {
        cell.classList.toggle("row-hover", Number(cell.dataset.row) === row);
        cell.classList.toggle("col-hover", Number(cell.dataset.col) === col);
      });
      document.querySelectorAll(".row-hint").forEach((hint) => {
        hint.classList.toggle("active", Number(hint.dataset.rowHint) === row);
      });
      document.querySelectorAll(".col-hint").forEach((hint) => {
        hint.classList.toggle("active", Number(hint.dataset.colHint) === col);
      });
    }

    function clearHover() {
      document.querySelectorAll(".row-hover, .col-hover, .hint.active").forEach((node) => {
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
      els.playArea.classList.add("is-solved");
      els.image.src = getSolutionImageSrc(state.puzzle);
      els.solutionTitle.textContent = state.puzzle.title || "이미지 해제";
      els.side.hidden = false;
      renderSourceNote(state.puzzle.source);
      renderQuestions(state.puzzle.questions || []);
      els.questions.classList.add("unlocked");
      els.status.textContent = "이미지 해제";
    }

    function renderQuestions(questions) {
      els.questionList.innerHTML = "";
      questions.forEach((question, index) => {
        const wrap = document.createElement("article");
        wrap.className = "question";

        const prompt = document.createElement("p");
        prompt.textContent = (index + 1) + ". " + question.q;
        wrap.appendChild(prompt);

        const answers = document.createElement("div");
        answers.className = "answers";
        question.a.forEach((answer, answerIndex) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "answer";
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
      group.querySelectorAll(".answer").forEach((node) => {
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
      els.complete.classList.add("show");
      els.status.textContent = "완료";
    }

    function resetPuzzle() {
      if (!state.puzzle) return;
      if (!window.confirm("퍼즐을 초기화할까요?")) return;
      renderPuzzle(state.puzzle);
    }

    function copyShareLink() {
      const link = window.location.origin + "/nonogram/?p=" + encodeURIComponent(state.currentPuzzleId);
      navigator.clipboard?.writeText(link).then(() => {
        els.shareText.textContent = "공유 링크 복사됨: " + link;
      }).catch(() => {
        els.shareText.textContent = "공유 링크: " + link;
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
        els.select.value = state.currentPuzzleId;
      }
    }

    els.reset.addEventListener("click", resetPuzzle);
    els.select.addEventListener("change", () => switchPuzzle(els.select.value));
    els.share.addEventListener("click", copyShareLink);
    resizeObserver = new ResizeObserver(refreshGridMetrics);
    resizeObserver.observe(els.playArea);

    loadInitialPuzzle().then(renderPuzzle).catch(() => {
      els.status.textContent = "로딩 실패";
    });
