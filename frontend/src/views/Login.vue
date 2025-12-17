<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Ella Procurement System</h1>
      <p class="login-subtitle">Sign in to your account</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="credentials.email"
            type="email"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            class="form-input"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="btn btn-primary btn-block"
          :disabled="loading"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="demo-credentials">
        <p class="demo-title">Demo Credentials:</p>
        <p>Admin: admin@ella.com / admin123</p>
        <p>Ella: ella@ella.com / ella123</p>
        <p>Dept Head: depthead@ella.com / dept123</p>
        <p>Procurement: procurement@ella.com / proc123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();

const credentials = ref({
  email: '',
  password: ''
});

const loading = ref(false);
const error = ref(null);

const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    await authStore.login(credentials.value);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 1.875rem;
  font-weight: 700;
  text-align: center;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.login-subtitle {
  text-align: center;
  color: var(--gray-600);
  margin-bottom: 2rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.btn-block {
  width: 100%;
  margin-top: 1rem;
}

.demo-credentials {
  background-color: var(--gray-100);
  padding: 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.demo-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.demo-credentials p {
  margin: 0.25rem 0;
  color: var(--gray-700);
}
</style>
