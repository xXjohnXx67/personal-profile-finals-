<template>
  <div class="bento-wrapper">
    <header class="main-header">
      <h1>John Adrian Ochoa</h1>
      <p>Student @ WEBPROG • Digital Collector</p>
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

      <!-- ✨ UPGRADED GALLERY TILE -->
      <section class="tile gallery shadow-3">
        <h3>Gallery of Life 📸</h3>

        <!-- Category Tabs -->
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

        <!-- Slideshow -->
        <div class="slideshow">
          <button class="nav-btn prev" @click="prevSlide">&#8592;</button>

          <div class="slide-frame">
            <transition name="fade" mode="out-in">
              <div :key="activeCat + '-' + currentSlide" class="photo-box">
                <img
                  :src="currentImages[currentSlide].src"
                  :alt="currentImages[currentSlide].caption"
                />
                <span class="caption">{{ currentImages[currentSlide].caption }}</span>
              </div>
            </transition>
          </div>

          <button class="nav-btn next" @click="nextSlide">&#8594;</button>
        </div>

        <!-- Dot Controls -->
        <div class="dot-controls">
          <button
            v-for="(img, i) in currentImages"
            :key="i"
            @click="goToSlide(i)"
            :class="{ active: currentSlide === i }"
            class="dot"
          ></button>
        </div>

        <!-- Slide counter -->
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

// ── Gallery Data ──────────────────────────────────────────────────────────────
const categories = [
  {
    label: 'Cats',
    emoji: '🐈',
    images: [
      { src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80', caption: 'Morning zoomies 🐾' },
      { src: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=500&q=80', caption: 'Professional loaf 🍞' },
      { src: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=500&q=80', caption: 'Sunbeam nap 😴' },
    ],
  },
  {
    label: 'Girlfriend',
    emoji: '💕',
    images: [
      { src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=500&q=80', caption: 'Our first trip 🌿' },
      { src: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=500&q=80', caption: 'Golden hour adventures 🌅' },
      { src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=500&q=80', caption: 'Coffee dates ☕' },
    ],
  },
  {
    label: 'Family',
    emoji: '👨‍👩‍👧',
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

// Auto-advance
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

const switchCategory = (index) => {
  activeCat.value = index;
  currentSlide.value = 0;
  resetAuto();
};
const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + currentImages.value.length) % currentImages.value.length;
  resetAuto();
};
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % currentImages.value.length;
  resetAuto();
};
const goToSlide = (i) => {
  currentSlide.value = i;
  resetAuto();
};

// ── Guestbook ─────────────────────────────────────────────────────────────────
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
  fetchNotes();
  startAuto();
});
onUnmounted(() => clearInterval(autoTimer));
</script>

<style scoped>
.bento-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', system-ui, sans-serif;
  background-color: #faf9f6;
}

.main-header {
  margin-bottom: 50px;
  text-align: center;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(180px, auto);
  gap: 20px;
}

.tile {
  background: white;
  border: 2px solid #1a1a1a;
  padding: 25px;
  border-radius: 16px;
}

.shadow-1 { box-shadow: 4px 4px 0px #1a1a1a; }
.shadow-2 { box-shadow: 6px 6px 0px #ff6b6b; }
.shadow-3 { box-shadow: 6px 6px 0px #4ecdc4; }

.hero     { grid-column: span 2; }
.vibe     { grid-column: span 1; }
.gallery  { grid-column: span 1; grid-row: span 2; display: flex; flex-direction: column; gap: 12px; }
.projects { grid-column: span 2; }
.guestbook { grid-column: span 3; }

/* ── Category Tabs ── */
.category-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.cat-tab {
  flex: 1;
  padding: 6px 8px;
  font-size: 0.72rem;
  font-weight: 700;
  border: 2px solid #1a1a1a;
  border-radius: 8px;
  background: #f0f0f0;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  white-space: nowrap;
}

.cat-tab:hover { background: #e0e0e0; }

.cat-tab.active {
  background: #4ecdc4;
  color: #fff;
  box-shadow: 2px 2px 0 #1a1a1a;
  transform: translateY(-1px);
}

/* ── Slideshow ── */
.slideshow {
  display: flex;
  align-items: center;
  gap: 8px;
}

.slide-frame {
  flex: 1;
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid #1a1a1a;
}

.photo-box img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.caption {
  display: block;
  text-align: center;
  padding: 8px 4px;
  font-size: 0.8rem;
  font-weight: 600;
  background: white;
}

.nav-btn {
  background: #1a1a1a;
  color: white;
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

.nav-btn:hover {
  background: #4ecdc4;
  transform: scale(1.1);
}

/* ── Dot Controls ── */
.dot-controls {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #1a1a1a;
  background: #ddd;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  padding: 0;
}

.dot.active {
  background: #4ecdc4;
  transform: scale(1.3);
}

.slide-counter {
  text-align: center;
  font-size: 0.75rem;
  color: #888;
  margin: 0;
}

/* ── Fade Transition ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Guestbook ── */
.fridge-form { display: flex; flex-direction: column; gap: 10px; margin: 20px 0; }
.fridge-form input, .fridge-form textarea { padding: 12px; border: 2px solid #1a1a1a; border-radius: 8px; }
.fridge-form button { padding: 12px; background: #1a1a1a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }

.fridge-notes { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
.sticky-note { background: #fff9c4; padding: 15px; border-radius: 4px; border-left: 5px solid #fbc02d; transform: rotate(-1deg); box-shadow: 2px 2px 5px rgba(0,0,0,0.1); }

/* ── Project List ── */
.project-item { padding: 10px 0; }
.project-item.border-top { border-top: 1px solid #eee; }

/* ── Responsive ── */
@media (max-width: 850px) {
  .bento-grid { grid-template-columns: 1fr; }
  .hero, .vibe, .gallery, .projects, .guestbook { grid-column: span 1; }
}
</style>