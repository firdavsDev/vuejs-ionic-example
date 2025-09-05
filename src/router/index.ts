import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/profile-setup',
    name: 'ProfileSetup',
    component: () => import('@/views/Auth/ProfileSetup.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inspections',
    name: 'InspectionList',
    component: () => import('@/views/Inspection/InspectionList.vue'),
    // meta: { requiresAuth: true }
  },
  {
    path: '/inspection/create',
    name: 'CreateInspection',
    component: () => import('@/views/Inspection/CreateInspection.vue'),
    // meta: { requiresAuth: true }
  },
  {
    path: '/inspection/detail/:id',
    name: 'InspectionDetail',
    component: () => import('@/views/Inspection/InspectionDetail.vue'),
    // meta: { requiresAuth: true }
  },
  {
    path: '/inspection/:id/pdf',
    name: 'PDFViewer',
    component: () => import('@/components/PDFViewer.vue'),
    // meta: { requiresAuth: true },
    props: route => ({
      inspectionId: route.params.id
    })
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Auth guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isLoggedIn = localStorage.getItem('authToken');
  
  if (requiresAuth && !isLoggedIn) {
    next('/login');
  } else if (to.path === '/login' && isLoggedIn) {
    next('/inspections');
  } else {
    next();
  }
});

export default router;