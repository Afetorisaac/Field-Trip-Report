<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Procurement Requests</h1>
      <button 
        v-if="!showCreateForm" 
        @click="showCreateForm = true" 
        class="btn btn-primary"
      >
        + Create Request
      </button>
    </div>

    <div v-if="showCreateForm" class="card create-form">
      <h2>Create New Request</h2>
      <request-form @submit="handleCreateRequest" @cancel="showCreateForm = false" />
    </div>

    <div class="filters card">
      <select v-model="filters.status" @change="loadRequests" class="form-select">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="po_created">PO Created</option>
        <option value="delivered">Delivered</option>
      </select>
      
      <select v-model="filters.priority" @change="loadRequests" class="form-select">
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else class="requests-list">
      <div 
        v-for="request in requests" 
        :key="request._id" 
        class="request-card card"
        @click="viewRequest(request._id)"
      >
        <div class="request-header">
          <h3>{{ request.title }}</h3>
          <span :class="['badge', `badge-${request.status}`]">
            {{ request.status }}
          </span>
        </div>
        <p class="request-number">{{ request.requestNumber }}</p>
        <p class="request-description">{{ request.description }}</p>
        <div class="request-meta">
          <span>Total: ${{ request.totalEstimatedCost.toFixed(2) }}</span>
          <span>Priority: {{ request.priority }}</span>
          <span>Department: {{ request.department }}</span>
        </div>
        <p class="request-date">
          Created: {{ new Date(request.createdAt).toLocaleDateString() }}
        </p>
      </div>
    </div>

    <div v-if="!loading && requests.length === 0" class="empty-state">
      No requests found. Create your first request to get started!
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { requestsAPI } from '@/api';
import RequestForm from '@/components/RequestForm.vue';

const router = useRouter();

const requests = ref([]);
const loading = ref(false);
const error = ref(null);
const showCreateForm = ref(false);
const filters = ref({
  status: '',
  priority: ''
});

const loadRequests = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await requestsAPI.getAll(filters.value);
    requests.value = response.data.requests;
  } catch (err) {
    error.value = 'Failed to load requests';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleCreateRequest = async (data) => {
  try {
    await requestsAPI.create(data);
    showCreateForm.value = false;
    loadRequests();
  } catch (err) {
    error.value = 'Failed to create request';
    console.error(err);
  }
};

const viewRequest = (id) => {
  router.push(`/requests/${id}`);
};

onMounted(() => {
  loadRequests();
});
</script>

<style scoped>
.dashboard {
  max-width: 1000px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.create-form {
  margin-bottom: 2rem;
}

.create-form h2 {
  margin-bottom: 1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filters .form-select {
  flex: 1;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
}

.requests-list {
  display: grid;
  gap: 1rem;
}

.request-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.request-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
}

.request-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  flex: 1;
}

.request-number {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.request-description {
  color: var(--gray-700);
  margin-bottom: 1rem;
}

.request-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--gray-600);
}

.request-date {
  font-size: 0.875rem;
  color: var(--gray-500);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--gray-600);
  background-color: white;
  border-radius: 0.5rem;
}
</style>
