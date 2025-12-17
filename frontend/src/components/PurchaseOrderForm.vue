<template>
  <form @submit.prevent="handleSubmit" class="po-form">
    <h3>Supplier Information</h3>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Supplier Name *</label>
        <input v-model="form.supplier.name" type="text" class="form-input" required />
      </div>
      <div class="form-group">
        <label class="form-label">Contact</label>
        <input v-model="form.supplier.contact" type="text" class="form-input" />
      </div>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Email</label>
        <input v-model="form.supplier.email" type="email" class="form-input" />
      </div>
      <div class="form-group">
        <label class="form-label">Delivery Date</label>
        <input v-model="form.deliveryDate" type="date" class="form-input" />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Address</label>
      <textarea v-model="form.supplier.address" class="form-textarea" rows="2"></textarea>
    </div>

    <h3>Items</h3>
    <div v-for="(item, index) in form.items" :key="index" class="item-row">
      <input v-model="item.name" type="text" class="form-input" placeholder="Item name" required />
      <input v-model.number="item.quantity" type="number" class="form-input" placeholder="Qty" min="1" required />
      <input v-model.number="item.unitPrice" type="number" class="form-input" placeholder="Unit Price" step="0.01" min="0" required />
      <input v-model="item.unit" type="text" class="form-input" placeholder="Unit" />
    </div>

    <div class="form-group">
      <label class="form-label">Tax Amount</label>
      <input v-model.number="form.tax" type="number" class="form-input" step="0.01" min="0" />
    </div>

    <div class="form-group">
      <label class="form-label">Notes</label>
      <textarea v-model="form.notes" class="form-textarea" rows="2"></textarea>
    </div>

    <div class="totals">
      <p><strong>Subtotal:</strong> ${{ subtotal.toFixed(2) }}</p>
      <p><strong>Tax:</strong> ${{ form.tax.toFixed(2) }}</p>
      <p><strong>Grand Total:</strong> ${{ grandTotal.toFixed(2) }}</p>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary">Create Purchase Order</button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  request: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['submit']);

const form = ref({
  supplier: {
    name: '',
    contact: '',
    email: '',
    address: ''
  },
  items: props.request.items.map(item => ({
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.estimatedPrice,
    unit: item.unit
  })),
  tax: 0,
  deliveryDate: '',
  notes: ''
});

const subtotal = computed(() => {
  return form.value.items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);
});

const grandTotal = computed(() => {
  return subtotal.value + form.value.tax;
});

const handleSubmit = () => {
  emit('submit', form.value);
};
</script>

<style scoped>
.po-form {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-200);
}

.po-form h3 {
  margin: 1.5rem 0 1rem;
  font-size: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.totals {
  background-color: var(--gray-100);
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.totals p {
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
