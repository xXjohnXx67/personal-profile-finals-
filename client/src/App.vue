<template>
  <div class="bento-wrapper" :class="{ dark: isDark }">
    <header class="main-header">
      <div class="header-text">
        <h1>John Adrian Ochoa</h1>
        <p>Student @ WEBPROG • Digital Collector</p>
      </div>

      <!-- Dark / Light Toggle -->
      <button class="theme-toggle" @click="isDark = !isDark" :title="isDark ? 'Switch to Light' : 'Switch to Dark'">
        <span class="toggle-track">
          <span class="toggle-thumb">
            <span class="toggle-icon">{{ isDark ? '🌙' : '☀️' }}</span>
          </span>
        </span>
        <span class="toggle-label">{{ isDark ? 'Dark' : 'Light' }}</span>
      </button>
    </header>

    <main class="bento-grid">
      <section class="tile hero shadow-1">
        <h2>Hello! 👋</h2>
        <p>I build things for the web, but I spend most of my time exploring the city and chasing the perfect sunset. I believe every line of code should have a bit of personality.</p>
      </section>

      <section class="tile vibe shadow-2">
        <h3>Current Vibe 🎧</h3>
        <ul>
          <li><strong>Listening:</strong> Lo-fi Beats & 90s Grunge</li>
          <li><strong>Playing:</strong> Valorant & Elden Ring</li>
          <li><strong>Learning:</strong> Film Photography & Thai Cooking</li>
        </ul>
      </section>

      <!-- ✨ GALLERY TILE -->
      <section class="tile gallery shadow-3">
        <h3>Gallery of Life 📸</h3>

        <div class="category-tabs">
          <button
            v-for="(cat, index) in categories"
            :key="index"
            @click="switchCategory(index)"
            :class="{ active: activeCat === index }"
            class="cat-tab"
          >
            {{ cat.emoji }} {{ cat.label }}
          </button>
        </div>

        <div class="slideshow">
          <button class="nav-btn prev" @click="prevSlide">&#8592;</button>
          <div class="slide-frame">
            <transition name="fade" mode="out-in">
              <div :key="activeCat + '-' + currentSlide" class="photo-box">
                <img :src="currentImages[currentSlide].src" :alt="currentImages[currentSlide].caption" />
                <span class="caption">{{ currentImages[currentSlide].caption }}</span>
              </div>
            </transition>
          </div>
          <button class="nav-btn next" @click="nextSlide">&#8594;</button>
        </div>

        <div class="dot-controls">
          <button
            v-for="(img, i) in currentImages"
            :key="i"
            @click="goToSlide(i)"
            :class="{ active: currentSlide === i }"
            class="dot"
          ></button>
        </div>

        <p class="slide-counter">{{ currentSlide + 1 }} / {{ currentImages.length }}</p>
      </section>

      <section class="tile projects shadow-1">
        <h3>Recent Side Quests 🛠️</h3>
        <div class="project-list">
          <div class="project-item">
            <h4>Gym Tracker</h4>
            <p>"I built this because I kept losing my workout scraps of paper. Simple, functional, and efficient."</p>
          </div>
          <div class="project-item border-top">
            <h4>Weather App</h4>
            <p>"A small tool I made because I hated the default iOS UI. I wanted something more minimalist."</p>
          </div>
        </div>
      </section>

      <section class="tile guestbook shadow-2">
        <h3>Digital Fridge 📝</h3>
        <form @submit.prevent="postToFridge" class="fridge-form">
          <input v-model="form.name" placeholder="Your Name" required />
          <textarea v-model="form.message" placeholder="Write a sticky note..." required></textarea>
          <button type="submit">Stick it! 📌</button>
        </form>
        <div class="fridge-notes">
          <div v-for="note in notes" :key="note.id" class="sticky-note">
            <p>"{{ note.message }}"</p>
            <small>— {{ note.name }}</small>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

// ── Theme ────────────────────────────────────────────────────────────────
const isDark = ref(false);

// Automatically sync body background + save preference
watch(isDark, (val) => {
  document.body.classList.toggle('dark-body', val);
  localStorage.setItem('theme', val ? 'dark' : 'light');
});

// ── Gallery Data ─────────────────────────────────────────────────────────
const categories = [
  {
    label: 'Cats', emoji: '🐈',
    images: [
      { src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80', caption: 'Morning zoomies 🐾' },
      { src: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=500&q=80', caption: 'Professional loaf 🍞' },
      { src: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=500&q=80', caption: 'Sunbeam nap 😴' },
    ],
  },
  {
    label: 'Girlfriend', emoji: '💕',
    images: [
      { src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=500&q=80', caption: 'Our first trip 🌿' },
      { src: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=500&q=80', caption: 'Golden hour adventures 🌅' },
      { src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=500&q=80', caption: 'Coffee dates ☕' },
    ],
  },
  {
    label: 'Family', emoji: '👨‍👩‍👧',
    images: [
      { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80', caption: 'Sunday picnic 🧺' },
      { src: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=500&q=80', caption: 'Holiday dinner 🍽️' },
      { src: 'https://images.unsplash.com/photo-1541178735493-479c1a27ed24?auto=format&fit=crop&w=500&q=80', caption: 'Beach day 🏖️' },
    ],
  },
];

const activeCat = ref(0);
const currentSlide = ref(0);
const currentImages = computed(() => categories[activeCat.value].images);

let autoTimer = null;

const startAuto = () => {
  autoTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % currentImages.value.length;
  }, 3000);
};

const resetAuto = () => {
  clearInterval(autoTimer);
  startAuto();
};

const switchCategory = (i) => {
  activeCat.value = i;
  currentSlide.value = 0;
  resetAuto();
};

const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + currentImages.value.length) %
    currentImages.value.length;
  resetAuto();
};

const nextSlide = () => {
  currentSlide.value =
    (currentSlide.value + 1) %
    currentImages.value.length;
  resetAuto();
};

const goToSlide = (i) => {
  currentSlide.value = i;
  resetAuto();
};

// ── Guestbook ────────────────────────────────────────────────────────────
const notes = ref([]);
const form = ref({ name: '', message: '' });

const fetchNotes = async () => {
  try {
    const res = await fetch('/api/guestbook');
    const data = await res.json();
    notes.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

const postToFridge = async () => {
  try {
    await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });
    form.value = { name: '', message: '' };
    fetchNotes();
  } catch (err) {
    console.error("Post error:", err);
  }
};

onMounted(() => {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    isDark.value = true;
  }

  // Apply body background immediately
  document.body.classList.toggle('dark-body', isDark.value);

  fetchNotes();
  startAuto();
});

onUnmounted(() => clearInterval(autoTimer));
</script>

<style scoped>
/* ── CSS Variables: Light Mode ── */
.bento-wrapper {
  --bg-page:       #f0f4ff;
  --bg-tile:       #ffffff;
  --border:        #1a1a2e;
  --text-primary:  #1a1a2e;
  --text-muted:    #5a6a8a;
  --accent:        #3b82f6;
  --accent-hover:  #2563eb;
  --accent-soft:   #dbeafe;
  --shadow-1:      #1a1a2e;
  --shadow-2:      #ef4444;
  --shadow-3:      #3b82f6;
  --tab-bg:        #e8edf8;
  --tab-hover:     #d1daf5;
  --img-bg:        #e8edf8;
  --input-bg:      #ffffff;
  --sticky-bg:     #fff9c4;
  --sticky-border: #fbc02d;
  --nav-bg:        #1a1a2e;
  --toggle-track:  #cbd5e1;
  --toggle-thumb:  #ffffff;

  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--bg-page);
  color: var(--text-primary);
  transition: background-color 0.35s ease, color 0.35s ease;
}

/* ── Full-page dark background ── */
:global(body):has(.bento-wrapper.dark) {
  background-color: #0d1117;
  transition: background-color 0.35s ease;
}
:global(body):has(.bento-wrapper:not(.dark)) {
  background-color: #f0f4ff;
  transition: background-color 0.35s ease;
}

/* ── CSS Variables: Dark Mode ── */
.bento-wrapper.dark {
  --bg-page:       #0d1117;
  --bg-tile:       #161b27;
  --border:        #2d3a5c;
  --text-primary:  #e2e8f8;
  --text-muted:    #7a90c0;
  --accent:        #60a5fa;
  --accent-hover:  #93c5fd;
  --accent-soft:   #1e3a5f;
  --shadow-1:      #0a0f1e;
  --shadow-2:      #7f1d1d;
  --shadow-3:      #1e40af;
  --tab-bg:        #1e2a42;
  --tab-hover:     #263452;
  --img-bg:        #1a2236;
  --input-bg:      #1e2a42;
  --sticky-bg:     #3a3200;
  --sticky-border: #ca8a04;
  --nav-bg:        #2d3a5c;
  --toggle-track:  #3b82f6;
  --toggle-thumb:  #ffffff;
}

/* ── Header ── */
.main-header {
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.header-text { text-align: center; }
.main-header h1 { margin: 0 0 4px; color: var(--text-primary); transition: color 0.35s; }
.main-header p  { margin: 0; color: var(--text-muted); transition: color 0.35s; }

/* ── Theme Toggle Button ── */
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 2px solid var(--border);
  border-radius: 999px;
  padding: 6px 14px 6px 8px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 0.8rem;
  font-weight: 700;
  transition: border-color 0.35s, background 0.3s, color 0.35s;
}

.theme-toggle:hover { background: var(--accent-soft); }

.toggle-track {
  width: 42px;
  height: 22px;
  background: var(--toggle-track);
  border-radius: 999px;
  position: relative;
  display: block;
  transition: background 0.35s;
  flex-shrink: 0;
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background: var(--toggle-thumb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 1px 4px rgba(0,0,0,0.25);
}

.dark .toggle-thumb { transform: translateX(20px); }

.toggle-icon { font-size: 11px; line-height: 1; }
.toggle-label { letter-spacing: 0.03em; }

/* ── Bento Grid ── */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
  gap: 20px;
}

/* ── Tiles ── */
.tile {
  background: var(--bg-tile);
  border: 2px solid var(--border);
  padding: 25px;
  border-radius: 16px;
  color: var(--text-primary);
  transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, color 0.35s ease;
}

.shadow-1 { box-shadow: 4px 4px 0px var(--shadow-1); }
.shadow-2 { box-shadow: 6px 6px 0px var(--shadow-2); }
.shadow-3 { box-shadow: 6px 6px 0px var(--shadow-3); }

/* Original layout */
.hero      { grid-column: span 2; }
.vibe      { grid-column: span 1; }
.gallery   { grid-column: span 1; display: flex; flex-direction: column; gap: 12px; align-self: start; }
.projects  { grid-column: span 2; padding: 16px; }
.guestbook { grid-column: span 3; }

h2, h3, h4 { color: var(--text-primary); transition: color 0.35s; margin-top: 0; }
p, li, small { color: var(--text-muted); transition: color 0.35s; }
strong { color: var(--text-primary); }
ul { padding-left: 18px; }

/* ── Category Tabs ── */
.category-tabs { display: flex; gap: 6px; flex-wrap: wrap; }

.cat-tab {
  flex: 1;
  padding: 6px 8px;
  font-size: 0.72rem;
  font-weight: 700;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--tab-bg);
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, border-color 0.35s, color 0.35s;
  white-space: nowrap;
}

.cat-tab:hover { background: var(--tab-hover); }

.cat-tab.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  box-shadow: 2px 2px 0 var(--shadow-1);
  transform: translateY(-1px);
}

/* ── Slideshow ── */
.slideshow { display: flex; align-items: center; gap: 8px; }

.slide-frame {
  flex: 1;
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid var(--border);
  transition: border-color 0.35s;
}

.photo-box img {
  width: 100%;
  height: 160px;
  object-fit: contain;
  display: block;
  background: var(--img-bg);
  transition: background 0.35s;
}

.caption {
  display: block;
  text-align: center;
  padding: 8px 4px;
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--bg-tile);
  color: var(--text-primary);
  transition: background 0.35s, color 0.35s;
}

.nav-btn {
  background: var(--nav-bg);
  color: #fff;
  border: none;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  font-size: 1rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s, transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover { background: var(--accent); transform: scale(1.1); }

/* ── Dots ── */
.dot-controls { display: flex; justify-content: center; gap: 8px; }

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: var(--tab-bg);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, border-color 0.35s;
  padding: 0;
}

.dot.active { background: var(--accent); border-color: var(--accent); transform: scale(1.3); }

.slide-counter { text-align: center; font-size: 0.75rem; color: var(--text-muted); margin: 0; }

/* ── Fade ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.35s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Guestbook ── */
.fridge-form { display: flex; flex-direction: column; gap: 10px; margin: 20px 0; }

.fridge-form input,
.fridge-form textarea {
  padding: 12px;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-family: inherit;
  transition: background 0.35s, border-color 0.35s, color 0.35s;
}

.fridge-form input::placeholder,
.fridge-form textarea::placeholder { color: var(--text-muted); }

.fridge-form button {
  padding: 12px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}
.fridge-form button:hover { background: var(--accent-hover); }

.fridge-notes { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }

.sticky-note {
  background: var(--sticky-bg);
  padding: 15px;
  border-radius: 4px;
  border-left: 5px solid var(--sticky-border);
  transform: rotate(-1deg);
  box-shadow: 2px 2px 5px rgba(0,0,0,0.15);
  transition: background 0.35s, border-color 0.35s;
}

/* ── Projects ── */
.project-item { padding: 10px 0; }
.project-item.border-top { border-top: 1px solid var(--border); transition: border-color 0.35s; }

/* ── Responsive ── */
@media (max-width: 850px) {
  .bento-grid { grid-template-columns: 1fr; }
  .hero, .vibe, .gallery, .projects, .guestbook { grid-column: 1; grid-row: auto; }
}
</style>