<template>
  <main class="bento-grid">
    <section class="tile hero">
      <h1>I'm [Your Name] 🎧</h1>
      <p>I build web apps and I'm obsessed with [Your Hobby].</p>
    </section>

    <section class="tile guestbook">
      <h2>Guestbook</h2>
      <form @submit.prevent="postMessage">
        <input v-model="form.name" placeholder="Your Name" required />
        <textarea v-model="form.message" placeholder="Leave a vibe..." required></textarea>
        <button type="submit">Send</button>
      </form>

      <div class="scroll-area">
        <div v-for="msg in messages" :key="msg.id" class="entry">
          <strong>{{ msg.name }}</strong>: {{ msg.message }}
        </div>
      </div>
    </section>

    <section class="tile mood">
      <h3>Current Mood</h3>
      <p>☕ Drinking coffee while coding this finals project.</p>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const messages = ref([]);
const form = ref({ name: '', message: '' });

// Requirement: GET Method
const fetchMessages = async () => {
  const res = await fetch('/api/guestbook');
  messages.value = await res.json();
};

// Requirement: POST Method
const postMessage = async () => {
  await fetch('/api/guestbook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  });
  form.value = { name: '', message: '' };
  fetchMessages();
};

onMounted(fetchMessages);
</script>

<style scoped>
.bento-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 2rem;
  max-width: 900px;
  margin: auto;
}
.tile { background: #fdfdfd; border: 2px solid #000; padding: 1.5rem; border-radius: 12px; box-shadow: 4px 4px 0px #000; }
.hero { grid-column: span 2; }
.scroll-area { margin-top: 1rem; max-height: 200px; overflow-y: auto; }
/* Mobile Responsive Requirement */
@media (max-width: 600px) { .bento-grid { grid-template-columns: 1fr; } .hero { grid-column: span 1; } }
</style>