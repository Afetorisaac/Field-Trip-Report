<template>
  <div class="users">
    <h1>User Management</h1>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else class="users-table-container card">
      <table class="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="badge">{{ user.role }}</span>
            </td>
            <td>{{ user.department || '-' }}</td>
            <td>
              <span :class="['badge', user.active ? 'badge-approved' : 'badge-rejected']">
                {{ user.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <button 
                @click="toggleUserStatus(user)" 
                :class="['btn', 'btn-sm', user.active ? 'btn-danger' : 'btn-success']"
              >
                {{ user.active ? 'Deactivate' : 'Activate' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && users.length === 0" class="empty-state">
      No users found.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usersAPI } from '@/api';

const users = ref([]);
const loading = ref(false);
const error = ref(null);

const loadUsers = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await usersAPI.getAll();
    users.value = response.data.users;
  } catch (err) {
    error.value = 'Failed to load users';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const toggleUserStatus = async (user) => {
  try {
    await usersAPI.update(user._id, { active: !user.active });
    loadUsers();
  } catch (err) {
    error.value = 'Failed to update user';
    console.error(err);
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.users {
  max-width: 1000px;
  margin: 0 auto;
}

.users h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.users-table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--gray-200);
}

.users-table th {
  background-color: var(--gray-100);
  font-weight: 600;
}

.users-table td {
  vertical-align: middle;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--gray-600);
}
</style>
