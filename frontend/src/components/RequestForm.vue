<template>
  <form @submit.prevent="handleSubmit" class="request-form">
    <div class="form-group">
      <label class="form-label">Title *</label>
      <input v-model="form.title" type="text" class="form-input" required />
    </div>

    <div class="form-group">
      <label class="form-label">Description *</label>
      <textarea v-model="form.description" class="form-textarea" rows="3" required></textarea>
    </div>

    <div class="form-group">
      <label class="form-label">Priority</label>
      <select v-model="form.priority" class="form-select">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>
    </div>

    <div class="items-section">
      <h3>Items</h3>
      <div v-for="(item, index) in form.items" :key="index" class="item-row">
        <div class="form-group">
          <input v-model="item.name" type="text" class="form-input" placeholder="Item name" required />
        </div>
        <div class="form-group">
          <input v-model.number="item.quantity" type="number" class="form-input" placeholder="Qty" min="1" required />
        </div>
        <div class="form-group">
          <input v-model.number="item.estimatedPrice" type="number" class="form-input" placeholder="Price" step="0.01" min="0" required />
        </div>
        <div class="form-group">
          <input v-model="item.unit" type="text" class="form-input" placeholder="Unit" />
        </div>
        <button type="button" @click="removeItem(index)" class="btn btn-danger" v-if="form.items.length > 1">×</button>
      </div>
      <button type="button" @click="addItem" class="btn btn-primary btn-sm">+ Add Item</button>
    </div>

    <div class="form-group">
      <label class="form-label">Notes</label>
      <textarea v-model="form.notes" class="form-textarea" rows="2"></textarea>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary">Submit Request</button>
      <button type="button" @click="$emit('cancel')" class="btn">Cancel</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['submit', 'cancel']);

const form = ref({
  title: '',
  description: '',
  priority: 'medium',
  items: [
    { name: '', quantity: 1, estimatedPrice: 0, unit: 'pcs' }
  ],
  notes: ''
});

const addItem = () => {
  form.value.items.push({ name: '', quantity: 1, estimatedPrice: 0, unit: 'pcs' });
};

const removeItem = (index) => {
  form.value.items.splice(index, 1);
};

const handleSubmit = () => {
  emit('submit', form.value);
};
</script>

<style scoped>
.request-form {
  max-width: 800px;
}

.items-section {
  border: 1px solid var(--gray-300);
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.items-section h3 {
  margin-bottom: 1rem;
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: end;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
