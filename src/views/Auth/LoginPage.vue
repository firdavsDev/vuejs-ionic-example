<template>
  <ion-page>
    <ion-content class="login-content">
      <div class="login-container">
        <div class="logo-section">
          <ion-icon name="car" size="large" color="primary"></ion-icon>
          <h1>Driver Inspection</h1>
          <p>Streamline your vehicle inspections</p>
        </div>
        
        <div class="login-form">
          <ion-button 
            expand="block" 
            @click="signInWithGoogle"
            :disabled="loading"
            class="google-signin-button"
          >
            <ion-icon name="logo-google" slot="start"></ion-icon>
            {{ loading ? 'Signing in...' : 'Continue with Google' }}
          </ion-button>
          
          <div class="terms-text">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  toastController,
  loadingController
} from '@ionic/vue';
import { car, logoGoogle } from 'ionicons/icons';
import AuthService from '@/services/auth.service.js';
import ApiService from '@/services/api.service.js';

export default {
  name: 'LoginPage',
  components: {
    IonPage,
    IonContent,
    IonButton,
    IonIcon
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async signInWithGoogle() {
      this.loading = true;
      
      try {
        const googleResult = await AuthService.signInWithGoogle();
        
        // Send Google token to your Django backend
        const authResponse = await ApiService.login(googleResult.authentication.idToken);
        
        // Store auth token
        localStorage.setItem('authToken', authResponse.token);
        localStorage.setItem('userProfile', JSON.stringify(authResponse.user));
        
        // Check if user needs to complete profile
        if (!authResponse.user.profileCompleted) {
          this.$router.push('/profile-setup');
        } else {
          this.$router.push('/inspections');
        }
        
      } catch (error) {
        console.error('Login error:', error);
        
        const toast = await toastController.create({
          message: 'Login failed. Please try again.',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
      
      this.loading = false;
    }
  },
  setup() {
    return {
      car,
      logoGoogle
    }
  }
}
</script>

<style scoped>
.login-content {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 2rem;
  text-align: center;
}

.logo-section {
  margin-bottom: 3rem;
  color: white;
}

.logo-section h1 {
  font-size: 2.5rem;
  margin: 1rem 0;
  font-weight: bold;
}

.logo-section p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.login-form {
  width: 100%;
  max-width: 300px;
}

.google-signin-button {
  --background: #fff;
  --color: #333;
  --border-radius: 25px;
  font-weight: 500;
  height: 50px;
}

.terms-text {
  margin-top: 2rem;
}

.terms-text p {
  font-size: 0.85rem;
  opacity: 0.8;
  color: white;
  line-height: 1.4;
}
</style>