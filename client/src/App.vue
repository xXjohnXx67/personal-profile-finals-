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

      <section class="tile gallery shadow-3">
        <h3>Gallery of Life 📸</h3>
        <div class="slider-container">
          <div class="slides">
            <div v-if="currentSlide === 0" class="photo-box animate">
              <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80" alt="Setup" />
              <span>My Workspace</span>
            </div>
            <div v-if="currentSlide === 1" class="photo-box animate">
              <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80" alt="Pet" />
              <span>Life Partner 🐈</span>
            </div>
            <div v-if="currentSlide === 2" class="photo-box animate">
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Sunset" />
              <span>Golden Hour 🌅</span>
            </div>
          </div>

          <div class="slider-controls">
            <button 
              v-for="n in 3" 
              :key="n-1" 
              @click="currentSlide = n-1"
              :class="{ active: currentSlide === n-1 }"
              class="dash-btn"
            ></button>
          </div>
        </div>
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
import { ref, onMounted } from 'vue';

const notes = ref([]);
const form = ref({ name: '', message: '' });
const currentSlide = ref(0);

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

onMounted(fetchNotes);
</script>

<style scoped>
.bento-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', system-ui, sans-serif;
  background-color: #faf9f6;
}

/* Centered Header Style */
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

.hero { grid-column: span 2; }
.vibe { grid-column: span 1; }
.gallery { grid-column: span 1; grid-row: span 2; }
.projects { grid-column: span 2; }
.guestbook { grid-column: span 3; }

.slider-container { height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
.photo-box img { width: 100%; height: 250px; object-fit: cover; border-radius: 8px; border: 2px solid #1a1a1a; }
.photo-box span { display: block; text-align: center; margin-top: 10px; font-weight: bold; }

.slider-controls { display: flex; justify-content: center; gap: 8px; margin-top: 15px; }
.dash-btn { width: 30px; height: 6px; background: #ddd; border: none; cursor: pointer; transition: 0.3s; border-radius: 3px; }
.dash-btn.active { background: #4ecdc4; width: 50px; }

.fridge-form { display: flex; flex-direction: column; gap: 10px; margin: 20px 0; }
.fridge-form input, .fridge-form textarea { padding: 12px; border: 2px solid #1a1a1a; border-radius: 8px; }
.fridge-form button { padding: 12px; background: #1a1a1a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }

.fridge-notes { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
.sticky-note { background: #fff9c4; padding: 15px; border-radius: 4px; border-left: 5px solid #fbc02d; transform: rotate(-1deg); box-shadow: 2px 2px 5px rgba(0,0,0,0.1); }

@media (max-width: 850px) {
  .bento-grid { grid-template-columns: 1fr; }
  .hero, .vibe, .gallery, .projects, .guestbook { grid-column: span 1; }
}
</style>