<template>
  <div class="request-details">
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else-if="request" class="content">
      <div class="header">
        <div>
          <h1>{{ request.title }}</h1>
          <p class="request-number">{{ request.requestNumber }}</p>
        </div>
        <span :class="['badge', `badge-${request.status}`]">{{ request.status }}</span>
      </div>

      <div class="card">
        <h2>Details</h2>
        <p><strong>Description:</strong> {{ request.description }}</p>
        <p><strong>Department:</strong> {{ request.department }}</p>
        <p><strong>Priority:</strong> {{ request.priority }}</p>
        <p><strong>Requester:</strong> {{ request.requester?.name }}</p>
        <p><strong>Total Cost:</strong> ${{ request.totalEstimatedCost.toFixed(2) }}</p>
        <p><strong>Created:</strong> {{ new Date(request.createdAt).toLocaleString() }}</p>
        <p v-if="request.notes"><strong>Notes:</strong> {{ request.notes }}</p>
      </div>

      <div class="card">
        <h2>Items</h2>
        <table class="items-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Unit</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in request.items" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>${{ item.estimatedPrice.toFixed(2) }}</td>
              <td>{{ item.unit }}</td>
              <td>${{ (item.quantity * item.estimatedPrice).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="canApprove" class="actions card">
        <h2>Actions</h2>
        <div class="action-buttons">
          <button @click="approveRequest" class="btn btn-success">Approve</button>
          <button @click="showRejectForm = true" class="btn btn-danger">Reject</button>
        </div>
        
        <div v-if="showRejectForm" class="reject-form">
          <textarea 
            v-model="rejectionReason" 
            class="form-textarea" 
            placeholder="Rejection reason (optional)"
            rows="3"
          ></textarea>
          <div class="form-actions">
            <button @click="rejectRequest" class="btn btn-danger">Confirm Reject</button>
            <button @click="showRejectForm = false" class="btn">Cancel</button>
          </div>
        </div>
      </div>

      <div v-if="canCreatePO" class="actions card">
        <h2>Create Purchase Order</h2>
        <button @click="showPOForm = !showPOForm" class="btn btn-primary">
          {{ showPOForm ? 'Cancel' : 'Create PO' }}
        </button>
        
        <purchase-order-form 
          v-if="showPOForm" 
          :request="request" 
          @submit="handleCreatePO" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { requestsAPI, purchaseOrdersAPI } from '@/api';
import PurchaseOrderForm from '@/components/PurchaseOrderForm.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const request = ref(null);
const loading = ref(false);
const error = ref(null);
const showRejectForm = ref(false);
const rejectionReason = ref('');
const showPOForm = ref(false);

const canApprove = computed(() => {
  return (authStore.isDeptHead || authStore.isAdmin) && request.value?.status === 'pending';
});

const canCreatePO = computed(() => {
  return (authStore.isProcurement || authStore.isAdmin) && request.value?.status === 'approved';
});

const loadRequest = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await requestsAPI.getById(route.params.id);
    request.value = response.data.request;
  } catch (err) {
    error.value = 'Failed to load request';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const approveRequest = async () => {
  try {
    await requestsAPI.approve(request.value._id);
    loadRequest();
  } catch (err) {
    error.value = 'Failed to approve request';
    console.error(err);
  }
};

const rejectRequest = async () => {
  try {
    await requestsAPI.reject(request.value._id, { rejectionReason: rejectionReason.value });
    showRejectForm.value = false;
    loadRequest();
  } catch (err) {
    error.value = 'Failed to reject request';
    console.error(err);
  }
};

const handleCreatePO = async (data) => {
  try {
    await purchaseOrdersAPI.create(request.value._id, data);
    showPOForm.value = false;
    loadRequest();
  } catch (err) {
    error.value = 'Failed to create purchase order';
    console.error(err);
  }
};

onMounted(() => {
  loadRequest();
});
</script>

<style scoped>
.request-details {
  max-width: 900px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.request-number {
  color: var(--gray-600);
  margin-top: 0.5rem;
}

.card {
  margin-bottom: 1.5rem;
}

.card h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.card p {
  margin-bottom: 0.5rem;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th,
.items-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--gray-200);
}

.items-table th {
  background-color: var(--gray-100);
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.reject-form {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-200);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
}
</style>
