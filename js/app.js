/**
 * FlexDB - Exercise Browser Application
 * Main application logic
 */

// Category CSS class mapping
const CAT_CLS = {
  'strength': 'b-str',
  'cardio': 'b-car',
  'plyometrics': 'b-ply',
  'powerlifting': 'b-pow',
  'olympic weightlifting': 'b-oly',
  'stretching': 'b-stc',
  'strongman': 'b-stm'
};

// Application State
const State = {
  filters: {
    muscle: '',
    equipment: '',
    level: '',
    category: '',
    mechanic: '',
    search: ''
  },
  page: 1,
  limit: 18
};

// Tabata Workout State (max 8 exercises)
const TabataWorkout = [];

// Currently loaded workout name (null if building new)
let currentWorkoutName = null;

// LocalStorage key for saved workouts
const TABATA_STORAGE_KEY = 'flexdb_tabata_workouts';

// DOM Helper
const $ = (id) => document.getElementById(id);

/**
 * Generate SVG body map showing muscle highlights
 * @param {string[]} primaryMuscles - Array of primary muscle names
 * @param {string[]} secondaryMuscles - Array of secondary muscle names
 * @param {boolean} big - Whether to render large version
 * @returns {string} SVG markup
 */
function bodySVG(primaryMuscles, secondaryMuscles, big) {
  const PRIMARY_COLOR = '#ff4d00';
  const SECONDARY_COLOR = '#ff8a5080';
  const BASE_COLOR = '#2a2a2a';

  const primary = primaryMuscles.map(m => m.toLowerCase());
  const secondary = secondaryMuscles.map(m => m.toLowerCase());

  const getColor = (muscle) => {
    if (primary.includes(muscle)) return PRIMARY_COLOR;
    if (secondary.includes(muscle)) return SECONDARY_COLOR;
    return BASE_COLOR;
  };

  const scale = big ? 1.3 : 1;
  const frontX = 10;
  const backX = big ? 135 : 100;

  return `<svg viewBox="0 0 ${big ? 260 : 190} ${big ? 270 : 195}" xmlns="http://www.w3.org/2000/svg">
${big ? `<text x="${frontX + 35 * scale}" y="${9 * scale}" fill="#555" font-size="${6.5 * scale}" font-family="DM Sans,sans-serif" text-anchor="middle" font-weight="600">FRONT</text>
<text x="${backX + 35 * scale}" y="${9 * scale}" fill="#555" font-size="${6.5 * scale}" font-family="DM Sans,sans-serif" text-anchor="middle" font-weight="600">BACK</text>` : ''}
<g transform="translate(${frontX},${big ? 15 : 5}) scale(${scale})">
  <!-- Head -->
  <ellipse cx="35" cy="12" rx="10" ry="12" fill="${BASE_COLOR}"/>
  <!-- Neck -->
  <rect x="30" y="22" width="10" height="8" fill="${getColor('neck')}"/>
  <!-- Traps front -->
  <path d="M25 30 Q35 25 45 30 L42 38 Q35 35 28 38 Z" fill="${getColor('traps')}"/>
  <!-- Shoulders -->
  <ellipse cx="18" cy="38" rx="8" ry="6" fill="${getColor('shoulders')}"/>
  <ellipse cx="52" cy="38" rx="8" ry="6" fill="${getColor('shoulders')}"/>
  <!-- Chest -->
  <path d="M22 38 Q35 42 48 38 L48 55 Q35 60 22 55 Z" fill="${getColor('chest')}"/>
  <!-- Biceps -->
  <ellipse cx="12" cy="55" rx="5" ry="12" fill="${getColor('biceps')}"/>
  <ellipse cx="58" cy="55" rx="5" ry="12" fill="${getColor('biceps')}"/>
  <!-- Forearms -->
  <ellipse cx="10" cy="78" rx="4" ry="12" fill="${getColor('forearms')}"/>
  <ellipse cx="60" cy="78" rx="4" ry="12" fill="${getColor('forearms')}"/>
  <!-- Abs -->
  <rect x="27" y="55" width="16" height="28" rx="3" fill="${getColor('abdominals')}"/>
  <!-- Obliques -->
  <rect x="22" y="58" width="5" height="20" rx="2" fill="${getColor('abductors')}"/>
  <rect x="43" y="58" width="5" height="20" rx="2" fill="${getColor('abductors')}"/>
  <!-- Quads -->
  <ellipse cx="28" cy="105" rx="7" ry="18" fill="${getColor('quadriceps')}"/>
  <ellipse cx="42" cy="105" rx="7" ry="18" fill="${getColor('quadriceps')}"/>
  <!-- Adductors -->
  <ellipse cx="35" cy="100" rx="4" ry="12" fill="${getColor('adductors')}"/>
  <!-- Calves front -->
  <ellipse cx="27" cy="145" rx="5" ry="15" fill="${getColor('calves')}"/>
  <ellipse cx="43" cy="145" rx="5" ry="15" fill="${getColor('calves')}"/>
</g>
<g transform="translate(${backX},${big ? 15 : 5}) scale(${scale})">
  <!-- Head -->
  <ellipse cx="35" cy="12" rx="10" ry="12" fill="${BASE_COLOR}"/>
  <!-- Neck back -->
  <rect x="30" y="22" width="10" height="8" fill="${getColor('neck')}"/>
  <!-- Traps -->
  <path d="M20 30 L35 22 L50 30 L45 45 Q35 40 25 45 Z" fill="${getColor('traps')}"/>
  <!-- Rear delts -->
  <ellipse cx="18" cy="38" rx="7" ry="6" fill="${getColor('shoulders')}"/>
  <ellipse cx="52" cy="38" rx="7" ry="6" fill="${getColor('shoulders')}"/>
  <!-- Lats -->
  <path d="M22 42 L25 70 Q35 72 45 70 L48 42 Q35 50 22 42" fill="${getColor('lats')}"/>
  <!-- Triceps -->
  <ellipse cx="13" cy="55" rx="5" ry="12" fill="${getColor('triceps')}"/>
  <ellipse cx="57" cy="55" rx="5" ry="12" fill="${getColor('triceps')}"/>
  <!-- Forearms back -->
  <ellipse cx="10" cy="78" rx="4" ry="12" fill="${getColor('forearms')}"/>
  <ellipse cx="60" cy="78" rx="4" ry="12" fill="${getColor('forearms')}"/>
  <!-- Lower back -->
  <rect x="28" y="55" width="14" height="18" rx="3" fill="${getColor('lower back')}"/>
  <!-- Middle back -->
  <rect x="26" y="42" width="18" height="14" rx="2" fill="${getColor('middle back')}"/>
  <!-- Glutes -->
  <ellipse cx="28" cy="82" rx="8" ry="7" fill="${getColor('glutes')}"/>
  <ellipse cx="42" cy="82" rx="8" ry="7" fill="${getColor('glutes')}"/>
  <!-- Hamstrings -->
  <ellipse cx="28" cy="108" rx="6" ry="18" fill="${getColor('hamstrings')}"/>
  <ellipse cx="42" cy="108" rx="6" ry="18" fill="${getColor('hamstrings')}"/>
  <!-- Calves back -->
  <ellipse cx="27" cy="145" rx="5" ry="15" fill="${getColor('calves')}"/>
  <ellipse cx="43" cy="145" rx="5" ry="15" fill="${getColor('calves')}"/>
</g>
</svg>`;
}

/**
 * Add exercise to Tabata workout
 * @param {string} exerciseId - Exercise ID to add
 */
function addToTabata(exerciseId) {
  if (TabataWorkout.length >= 8) return;
  if (TabataWorkout.includes(exerciseId)) return;

  TabataWorkout.push(exerciseId);
  currentWorkoutName = null; // Clear name since workout was modified
  renderTabataPanel();
  updateTabataBadge();
  updateSaveButton();
  loadExercises(); // Re-render cards to update button states
}

/**
 * Remove exercise from Tabata workout
 * @param {number} index - Index in TabataWorkout array
 */
function removeFromTabata(index) {
  TabataWorkout.splice(index, 1);
  currentWorkoutName = null; // Clear name since workout was modified
  renderTabataPanel();
  updateTabataBadge();
  updateSaveButton();
  loadExercises(); // Re-render cards to update button states
}

/**
 * Clear all exercises from Tabata workout
 */
function clearTabata() {
  TabataWorkout.length = 0;
  currentWorkoutName = null;
  renderTabataPanel();
  updateTabataBadge();
  updateSaveButton();
  loadExercises();
}

/**
 * Update the Tabata count badge in header
 */
function updateTabataBadge() {
  const badge = $('tabataCountBadge');
  const count = TabataWorkout.length;
  badge.textContent = count;
  badge.dataset.count = count;
}

/**
 * Render the Tabata panel with 8 slots
 */
function renderTabataPanel() {
  const slotsContainer = $('tabataSlots');
  const countDisplay = $('tabataCount');
  const headerTitle = document.querySelector('.tabata-header h3');

  countDisplay.textContent = `${TabataWorkout.length}/8`;
  headerTitle.textContent = currentWorkoutName || 'TABATA WORKOUT';

  let html = '';
  for (let i = 0; i < 8; i++) {
    const exerciseId = TabataWorkout[i];
    const exercise = exerciseId ? EX.find(e => e.id === exerciseId) : null;

    if (exercise) {
      html += `
        <div class="tabata-slot filled">
          <span class="round-num">${i + 1}</span>
          <div class="slot-content">
            <div class="ex-name" data-id="${exercise.id}" style="cursor:pointer">${exercise.name}</div>
          </div>
          <button class="remove-btn" onclick="removeFromTabata(${i})" title="Remove">&#10005;</button>
        </div>`;
    } else {
      html += `
        <div class="tabata-slot empty">
          <span class="round-num">${i + 1}</span>
          <div class="slot-content">
            <span class="placeholder">Add exercise</span>
          </div>
        </div>`;
    }
  }

  slotsContainer.innerHTML = html;
}

/**
 * Toggle Tabata panel visibility
 */
function toggleTabataPanel() {
  const panel = $('tabataPanel');
  const toggle = $('tabataToggle');

  panel.classList.toggle('open');
  toggle.classList.toggle('active');
}

/**
 * Get saved workouts from localStorage
 * @returns {Array} Array of saved workout objects
 */
function getSavedWorkouts() {
  const data = localStorage.getItem(TABATA_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Save workouts to localStorage
 * @param {Array} workouts - Array of workout objects
 */
function setSavedWorkouts(workouts) {
  localStorage.setItem(TABATA_STORAGE_KEY, JSON.stringify(workouts));
}

/**
 * Save current Tabata workout
 */
function saveTabataWorkout() {
  if (TabataWorkout.length === 0) return;

  const name = prompt('Enter a name for this workout:');
  if (!name || !name.trim()) return;

  const workout = {
    id: Date.now().toString(),
    name: name.trim(),
    exercises: [...TabataWorkout],
    createdAt: Date.now()
  };

  const workouts = getSavedWorkouts();
  workouts.unshift(workout);
  setSavedWorkouts(workouts);
  renderSavedWorkouts();
}

/**
 * Load a saved workout into current Tabata
 * @param {string} workoutId - ID of the workout to load
 */
function loadTabataWorkout(workoutId) {
  const workouts = getSavedWorkouts();
  const workout = workouts.find(w => w.id === workoutId);
  if (!workout) return;

  // Clear current and load saved exercises
  TabataWorkout.length = 0;
  workout.exercises.forEach(exId => {
    // Only add if exercise still exists in database
    if (EX.find(e => e.id === exId)) {
      TabataWorkout.push(exId);
    }
  });

  // Set the loaded workout name
  currentWorkoutName = workout.name;

  renderTabataPanel();
  updateTabataBadge();
  updateSaveButton();
  loadExercises();
}

/**
 * Delete a saved workout
 * @param {string} workoutId - ID of the workout to delete
 */
function deleteSavedWorkout(workoutId) {
  const workouts = getSavedWorkouts();
  const filtered = workouts.filter(w => w.id !== workoutId);
  setSavedWorkouts(filtered);
  renderSavedWorkouts();
}

/**
 * Render the list of saved workouts
 */
function renderSavedWorkouts() {
  const container = $('savedList');
  const workouts = getSavedWorkouts();

  if (workouts.length === 0) {
    container.innerHTML = '<div class="saved-empty">No saved workouts yet</div>';
    return;
  }

  container.innerHTML = workouts.map(w => `
    <div class="saved-item" data-id="${w.id}">
      <span class="saved-name" title="${w.name}">${w.name}</span>
      <span class="saved-count">${w.exercises.length}/8</span>
      <button class="saved-delete" title="Delete">&#10005;</button>
    </div>
  `).join('');
}

/**
 * Update save button state based on workout content
 */
function updateSaveButton() {
  const btn = $('tabataSave');
  btn.disabled = TabataWorkout.length === 0;
}

/**
 * Initialize the application
 */
function init() {
  // Collect unique values for filters
  const muscles = new Set();
  const equipment = new Set();
  const categories = new Set();

  EX.forEach(exercise => {
    exercise.primaryMuscles.forEach(m => muscles.add(m));
    exercise.secondaryMuscles.forEach(m => muscles.add(m));
    if (exercise.equipment) equipment.add(exercise.equipment);
    categories.add(exercise.category);
  });

  // Render stats bar
  $('statsBar').innerHTML = `
    <div class="stat-item">
      <div class="stat-value">${EX.length}</div>
      <div class="stat-label">Exercises</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${muscles.size}</div>
      <div class="stat-label">Muscles</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${equipment.size}</div>
      <div class="stat-label">Equipment</div>
    </div>`;

  // Fill filter options
  fillFilterOptions('muscleF', 'muscle', [...muscles].sort());
  fillFilterOptions('equipF', 'equipment', [...equipment].sort());
  fillFilterOptions('catF', 'category', [...categories].sort());

  // Initialize Tabata panel
  renderTabataPanel();
  updateTabataBadge();
  updateSaveButton();
  renderSavedWorkouts();

  // Initial load
  loadExercises();
}

/**
 * Fill filter options into a container
 * @param {string} containerId - DOM element ID
 * @param {string} filterKey - Filter key name
 * @param {string[]} items - Array of filter values
 */
function fillFilterOptions(containerId, filterKey, items) {
  $(containerId).innerHTML = items
    .map(item => `<button class="fb" data-f="${filterKey}" data-v="${item}">${item}</button>`)
    .join('');
}

/**
 * Load and display exercises based on current filters
 */
function loadExercises() {
  let results = [...EX];
  const filters = State.filters;

  // Apply filters
  if (filters.muscle) {
    results = results.filter(ex =>
      ex.primaryMuscles.some(m => m.toLowerCase() === filters.muscle) ||
      ex.secondaryMuscles.some(m => m.toLowerCase() === filters.muscle)
    );
  }

  if (filters.equipment) {
    results = results.filter(ex =>
      ex.equipment && ex.equipment.toLowerCase() === filters.equipment
    );
  }

  if (filters.level) {
    results = results.filter(ex => ex.level === filters.level);
  }

  if (filters.category) {
    results = results.filter(ex => ex.category === filters.category);
  }

  if (filters.mechanic) {
    results = results.filter(ex => ex.mechanic && ex.mechanic === filters.mechanic);
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    results = results.filter(ex =>
      ex.name.toLowerCase().includes(searchTerm) ||
      ex.primaryMuscles.some(m => m.includes(searchTerm)) ||
      (ex.equipment && ex.equipment.toLowerCase().includes(searchTerm))
    );
  }

  // Pagination
  const total = results.length;
  const totalPages = Math.ceil(total / State.limit);
  const start = (State.page - 1) * State.limit;
  const pageResults = results.slice(start, start + State.limit);

  // Render results
  if (!pageResults.length) {
    $('grid').innerHTML = `
      <div class="empty">
        <div class="icon">&#127947;</div>
        <h3>No exercises found</h3>
        <p>Try adjusting your filters</p>
      </div>`;
    $('pag').innerHTML = '';
    $('rc').innerHTML = '';
    return;
  }

  $('grid').innerHTML = pageResults.map((ex, i) => {
    const hasImg = ex.images && ex.images.length > 0;
    const catClass = CAT_CLS[ex.category] || 'b-str';
    const inWorkout = TabataWorkout.includes(ex.id);
    const workoutFull = TabataWorkout.length >= 8;
    const tabataDisabled = !inWorkout && workoutFull;

    return `
      <div class="card" data-id="${ex.id}" style="animation-delay:${i * 0.03}s">
        <button class="add-tabata ${inWorkout ? 'in-workout' : ''}"
                data-ex-id="${ex.id}"
                ${tabataDisabled ? 'disabled' : ''}
                title="${inWorkout ? 'In workout' : workoutFull ? 'Workout full (8/8)' : 'Add to Tabata'}">
          ${inWorkout ? '&#10003;' : '+'}
        </button>
        <div class="card-img">
          ${hasImg ? `<img src="${ex.images[0]}" alt="${ex.name}" loading="lazy" onerror="this.style.display='none'">` : ''}
        </div>
        <div class="card-body">
          <div class="card-head">
            <div class="ex-name">${ex.name}</div>
            <span class="cat-badge ${catClass}">${ex.category}</span>
          </div>
          <div class="card-muscles">
            ${ex.primaryMuscles.map(m => `<span class="mtag pm">${m}</span>`).join('')}
            ${ex.secondaryMuscles.slice(0, 2).map(m => `<span class="mtag">${m}</span>`).join('')}
          </div>
          <div class="card-meta">
            <span>&#9889; ${ex.level}</span>
            ${ex.equipment ? `<span>&#128295; ${ex.equipment}</span>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');

  $('rc').innerHTML = `Showing <strong>${total}</strong> exercises`;

  // Render pagination
  renderPagination(totalPages);
}

/**
 * Render pagination controls
 * @param {number} totalPages - Total number of pages
 */
function renderPagination(totalPages) {
  if (totalPages <= 1) {
    $('pag').innerHTML = '';
    return;
  }

  const maxVisible = 7;
  const half = Math.floor(maxVisible / 2);
  let startPage = Math.max(1, State.page - half);
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  let html = `<button class="pg" ${State.page === 1 ? 'disabled' : ''} data-p="${State.page - 1}">&larr; Prev</button>`;

  if (startPage > 1) {
    html += `<button class="pg" data-p="1">1</button>`;
    if (startPage > 2) {
      html += `<span style="color:var(--t3);padding:0 .3rem">...</span>`;
    }
  }

  for (let p = startPage; p <= endPage; p++) {
    html += `<button class="pg ${p === State.page ? 'on' : ''}" data-p="${p}">${p}</button>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      html += `<span style="color:var(--t3);padding:0 .3rem">...</span>`;
    }
    html += `<button class="pg" data-p="${totalPages}">${totalPages}</button>`;
  }

  html += `<button class="pg" ${State.page === totalPages ? 'disabled' : ''} data-p="${State.page + 1}">Next &rarr;</button>`;

  $('pag').innerHTML = html;
}

/**
 * Show exercise detail modal
 * @param {string} id - Exercise ID
 */
function showDetail(id) {
  const ex = EX.find(e => e.id === id);
  if (!ex) return;

  const hasImages = ex.images && ex.images.length > 0;

  $('mc').innerHTML = `
    <div class="modal-images">
      ${hasImages ? ex.images.map((img, i) => `
        <div class="mi">
          <img src="${img}" alt="${ex.name}" onerror="this.parentElement.style.display='none'">
          <div class="lbl">${i === 0 ? 'Start' : 'End'} Position</div>
        </div>`).join('') : ''}
      <div class="modal-svg">
        ${bodySVG(ex.primaryMuscles, ex.secondaryMuscles, true)}
        <div class="legend">
          <div class="legend-i"><div class="legend-d p"></div>Primary</div>
          <div class="legend-i"><div class="legend-d s"></div>Secondary</div>
        </div>
      </div>
    </div>
    <h2 class="modal-title">${ex.name}</h2>
    <div class="modal-badges">
      <span class="mbadge ac">${ex.category}</span>
      <span class="mbadge">${ex.level}</span>
      ${ex.equipment ? `<span class="mbadge">${ex.equipment}</span>` : ''}
      ${ex.mechanic ? `<span class="mbadge">${ex.mechanic}</span>` : ''}
      ${ex.force ? `<span class="mbadge">${ex.force}</span>` : ''}
    </div>
    <a href="${ex.youtubeSearch}" target="_blank" rel="noopener" class="yt-btn">
      <svg viewBox="0 0 24 24">
        <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.4 31.4 0 000 12a31.4 31.4 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1c.4-1.9.5-5.8.5-5.8s0-3.9-.5-5.8z"/>
        <path fill="#0a0a0a" d="M9.6 15.5V8.5l6.3 3.5-6.3 3.5z"/>
      </svg>
      Watch on YouTube
    </a>
    <div class="msec">
      <div class="msec-t">Target Muscles</div>
      <div class="mgroup">
        ${ex.primaryMuscles.map(m => `<span class="mchip p">${m}</span>`).join('')}
      </div>
    </div>
    ${ex.secondaryMuscles.length ? `
      <div class="msec">
        <div class="msec-t">Secondary Muscles</div>
        <div class="mgroup">
          ${ex.secondaryMuscles.map(m => `<span class="mchip s">${m}</span>`).join('')}
        </div>
      </div>` : ''}
    ${ex.instructions.length ? `
      <div class="msec">
        <div class="msec-t">Instructions</div>
        <ol class="inst">
          ${ex.instructions.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>` : ''}`;

  $('ov').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Close the modal
 */
function closeModal() {
  $('ov').classList.remove('open');
  document.body.style.overflow = '';
}

// Event Listeners
function setupEventListeners() {
  // Search input with debounce
  let searchTimeout;
  $('searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      State.filters.search = e.target.value;
      State.page = 1;
      loadExercises();
    }, 300);
  });

  // Filter buttons
  document.querySelector('.sidebar').addEventListener('click', (e) => {
    const button = e.target.closest('.fb');
    if (!button) return;

    const { f: filterKey, v: filterValue } = button.dataset;

    if (State.filters[filterKey] === filterValue) {
      // Deselect
      State.filters[filterKey] = '';
      button.classList.remove('on');
    } else {
      // Select new value
      document.querySelectorAll(`[data-f="${filterKey}"]`).forEach(btn => btn.classList.remove('on'));
      State.filters[filterKey] = filterValue;
      button.classList.add('on');
    }

    State.page = 1;
    loadExercises();
  });

  // Clear all filters
  $('clearBtn').addEventListener('click', () => {
    Object.keys(State.filters).forEach(key => State.filters[key] = '');
    document.querySelectorAll('.fb.on').forEach(btn => btn.classList.remove('on'));
    $('searchInput').value = '';
    State.page = 1;
    loadExercises();
  });

  // Card click for detail (but not on add-tabata button)
  $('grid').addEventListener('click', (e) => {
    // Handle add-to-tabata button click
    const addBtn = e.target.closest('.add-tabata');
    if (addBtn && !addBtn.disabled) {
      e.stopPropagation();
      const exId = addBtn.dataset.exId;
      if (TabataWorkout.includes(exId)) {
        // Remove from workout if already in
        const idx = TabataWorkout.indexOf(exId);
        removeFromTabata(idx);
      } else {
        addToTabata(exId);
      }
      return;
    }

    const card = e.target.closest('.card');
    if (card) showDetail(card.dataset.id);
  });

  // Pagination
  $('pag').addEventListener('click', (e) => {
    const button = e.target.closest('.pg');
    if (button && !button.disabled) {
      State.page = parseInt(button.dataset.p);
      loadExercises();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Modal close button
  $('mx').addEventListener('click', closeModal);

  // Modal overlay click
  $('ov').addEventListener('click', (e) => {
    if (e.target === $('ov')) closeModal();
  });

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Tabata toggle button
  $('tabataToggle').addEventListener('click', toggleTabataPanel);

  // Tabata clear button
  $('tabataClear').addEventListener('click', clearTabata);

  // Tabata slot exercise name click
  $('tabataSlots').addEventListener('click', (e) => {
    const exName = e.target.closest('.ex-name[data-id]');
    if (exName) {
      showDetail(exName.dataset.id);
    }
  });

  // Tabata save button
  $('tabataSave').addEventListener('click', saveTabataWorkout);

  // Saved workouts list interactions
  $('savedList').addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.saved-delete');
    if (deleteBtn) {
      const item = deleteBtn.closest('.saved-item');
      if (item && confirm('Delete this workout?')) {
        deleteSavedWorkout(item.dataset.id);
      }
      return;
    }

    const nameEl = e.target.closest('.saved-name');
    if (nameEl) {
      const item = nameEl.closest('.saved-item');
      if (item) {
        loadTabataWorkout(item.dataset.id);
      }
    }
  });
}

// Initialize app
setupEventListeners();
init();
