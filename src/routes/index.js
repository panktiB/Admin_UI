import VueRouter from 'vue-router';
import LandingPage from '../components/LandingPage';

const router = new VueRouter({
  routes: [
    {
      name: 'LandingPage',
      component: LandingPage,
      path: '/home'
    }
  ],
});

export default router;
