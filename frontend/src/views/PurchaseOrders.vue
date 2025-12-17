<template>
  <div class="purchase-orders">
    <h1>Purchase Orders</h1>

    <div class="filters card">
      <select v-model="statusFilter" @change="loadPurchaseOrders" class="form-select">
        <option value="">All Status</option>
        <option value="created">Created</option>
        <option value="sent">Sent</option>
        <option value="confirmed">Confirmed</option>
        <option value="delivered">Delivered</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else class="po-list">
      <div v-for="po in purchaseOrders" :key="po._id" class="po-card card">
        <div class="po-header">
          <div>
            <h3>{{ po.poNumber }}</h3>
            <p class="po-supplier">{{ po.supplier.name }}</p>
          </div>
          <span :class="['badge', `badge-${po.status}`]">{{ po.status }}</span>
        </div>
        
        <p><strong>Request:</strong> {{ po.request?.requestNumber }}</p>
        <p><strong>Total:</strong> ${{ po.grandTotal.toFixed(2) }}</p>
        <p><strong>Created:</strong> {{ new Date(po.createdAt).toLocaleDateString() }}</p>
        
        <div class="po-actions" v-if="po.status !== 'delivered'">
          <button 
            @click="markAsDelivered(po._id)" 
            class="btn btn-success btn-sm"
          >
            Mark as Delivered
          </button>
        </div>
      </div>
    </div>

    <div v-if="!loading && purchaseOrders.length === 0" class="empty-state">
      No purchase orders found.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { purchaseOrdersAPI } from '@/api';

const purchaseOrders = ref([]);
const loading = ref(false);
const error = ref(null);
const statusFilter = ref('');

const loadPurchaseOrders = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const params = {};
    if (statusFilter.value) params.status = statusFilter.value;
    
    const response = await purchaseOrdersAPI.getAll(params);
    purchaseOrders.value = response.data.purchaseOrders;
  } catch (err) {
    error.value = 'Failed to load purchase orders';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const markAsDelivered = async (id) => {
  try {
    await purchaseOrdersAPI.markDelivered(id);
    loadPurchaseOrders();
  } catch (err) {
    error.value = 'Failed to mark as delivered';
    console.error(err);
  }
};

onMounted(() => {
  loadPurchaseOrders();
});
</script>

<style scoped>
.purchase-orders {
  max-width: 1000px;
  margin: 0 auto;
}

.purchase-orders h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.filters {
  margin-bottom: 2rem;
}

.po-list {
  display: grid;
  gap: 1rem;
}

.po-card {
  padding: 1.5rem;
}

.po-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.po-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
}

.po-supplier {
  color: var(--gray-600);
  margin-top: 0.25rem;
}

.po-card p {
  margin-bottom: 0.5rem;
}

.po-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-200);
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
