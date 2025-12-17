import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/requests/:id',
    name: 'RequestDetails',
    component: () => import('@/views/RequestDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/purchase-orders',
    name: 'PurchaseOrders',
    component: () => import('@/views/PurchaseOrders.vue'),
    meta: { requiresAuth: true, roles: ['procurement', 'admin'] }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/Users.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/');
  } else if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
    next('/');
  } else {
    next();
  }
});

export default router;
