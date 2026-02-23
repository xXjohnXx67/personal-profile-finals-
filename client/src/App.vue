<template>
  <div class="bento-wrapper">
    <header class="main-header">
      <h1>[Your Name]</h1>
      <p>Student @ WEBPROG • Digital Collector</p>
    </header>

    <main class="bento-grid">
      <section class="tile hero shadow-1">
        <h2>Hello! 👋</h2>
        <p>I build things for the web, but I spend most of my time exploring [Your City] and chasing the perfect sunset.</p>
      </section>

      <section class="tile vibe shadow-2">
        <h3>Current Vibe 🎧</h3>
        <ul>
          <li><strong>Listening:</strong> Lo-fi Beats & 90s Grunge</li>
          <li><strong>Reading:</strong> <em>Tomorrow, and Tomorrow, and Tomorrow</em></li>
          <li><strong>Learning:</strong> Film Photography & Thai Cooking</li>
        </ul>
      </section>

      <section class="tile gallery shadow-3">
        <div class="photo-grid">
          <div class="photo-box item-1">📸 Setup</div>
          <div class="photo-box item-2">🐈 Pet</div>
          <div class="photo-box item-3">🌅 Sunset</div>
        </div>
      </section>

      <section class="tile projects shadow-1">
        <h3>Recent Side Quests 🛠️</h3>
        <div class="project-item">
          <h4>Gym Tracker</h4>
          <p>"I built this because I kept losing my workout scraps of paper."</p>
        </div>
        <div class="project-item">
          <h4>Weather App</h4>
          <p>"A small tool I made because I hated the default iOS UI."</p>
        </div>
      </section>

      <section class="tile guestbook shadow-2">
        <h3>Digital Fridge 📝</h3>
        <p class="prompt">"Leave a song recommendation or tell me a joke!"</p>
        
        <form @submit.prevent="postToFridge">
          <input v-model="form.name" placeholder="Your Name" required />
          <textarea v-model="form.message" placeholder="Sticky note message..." required></textarea>
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
import { ref, onMounted } from 'vue';

const notes = ref([]);
const form = ref({ name: '', message: '' });

// Fetch notes (GET Requirement)
const fetchNotes = async () => {
  const res = await fetch('/api/guestbook');
  notes.value = await res.json();
};

// Post note (POST Requirement)
const postToFridge = async () => {
  await fetch('/api/guestbook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  });
  form.value = { name: '', message: '' };
  fetchNotes();
};

onMounted(fetchNotes);
</script>

<style scoped>
/* Bento Grid Layout */
.bento-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
  background-color: #faf9f6; /* Paper-like color */
}

.main-header { margin-bottom: 30px; text-align: center; }

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(150px, auto);
  gap: 20px;
}

.tile {
  background: white;
  border: 2px solid #1a1a1a;
  padding: 25px;
  border-radius: 12px;
  transition: transform 0.2s ease;
}

/* Shadows for Neo-brutalism look */
.shadow-1 { box-shadow: 4px 4px 0px #1a1a1a; }
.shadow-2 { box-shadow: 6px 6px 0px #ff6b6b; }
.shadow-3 { box-shadow: 6px 6px 0px #4ecdc4; }

/* Grid Positioning */
.hero { grid-column: span 2; }
.vibe { grid-column: span 1; }
.gallery { grid-column: span 1; grid-row: span 2; }
.projects { grid-column: span 2; }
.guestbook { grid-column: span 3; }

/* Internal Styling */
.photo-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}
.photo-box {
  background: #eee;
  flex-grow: 1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.sticky-note {
  background: #fff9c4;
  padding: 15px;
  margin: 10px 0;
  border-left: 5px solid #fbc02d;
  font-style: italic;
}

/* RESPONSIVE REQUIREMENT */
@media (max-width: 850px) {
  .bento-grid { grid-template-columns: 1fr; }
  .hero, .vibe, .gallery, .projects, .guestbook { grid-column: span 1; }
}
</style>