<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Complete Your Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <div class="profile-container">
        <div class="welcome-section">
          <ion-icon name="person-circle" size="large" color="primary"></ion-icon>
          <h2>Welcome!</h2>
          <p>Please complete your profile to get started</p>
        </div>
        
        <ion-list>
          <ion-item>
            <ion-label position="stacked">Company Name</ion-label>
            <ion-input 
              v-model="profile.companyName"
              placeholder="Enter your company name"
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Phone Number</ion-label>
            <ion-input 
              v-model="profile.phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">License Number</ion-label>
            <ion-input 
              v-model="profile.licenseNumber"
              placeholder="Enter your license number"
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Years of Experience</ion-label>
            <ion-select v-model="profile.yearsOfExperience" placeholder="Select">
              <ion-select-option value="1-2">1-2 years</ion-select-option>
              <ion-select-option value="3-5">3-5 years</ion-select-option>
              <ion-select-option value="6-10">6-10 years</ion-select-option>
              <ion-select-option value="10+">10+ years</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>
        
        <div class="save-button">
          <ion-button 
            expand="block" 
            @click="saveProfile"
            :disabled="!canSave"
          >
            Complete Profile
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  toastController
} from '@ionic/vue';
import { personCircle } from 'ionicons/icons';
import ApiService from '@/services/api.service.js';

export default {
  name: 'ProfileSetup',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon
  },
  data() {
    return {
      profile: {
        companyName: '',
        phoneNumber: '',
        licenseNumber: '',
        yearsOfExperience: ''
      }
    }
  },
  computed: {
    canSave() {
      return this.profile.companyName && 
             this.profile.phoneNumber && 
             this.profile.licenseNumber;
    }
  },
  methods: {
    async saveProfile() {
      try {
        await ApiService.updateProfile(this.profile);
        
        const toast = await toastController.create({
          message: 'Profile completed successfully!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        
        // Update local storage
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        userProfile.profileCompleted = true;
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        this.$router.push('/inspections');
        
      } catch (error) {
        console.error('Error saving profile:', error);
        
        const toast = await toastController.create({
          message: 'Error saving profile. Please try again.',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    }
  },
  setup() {
    return {
      personCircle
    }
  }
}
</script>

<style scoped>
.profile-container {
  padding: 2rem 1rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-section h2 {
  margin: 1rem 0 0.5rem 0;
  color: #333;
}

.welcome-section p {
  color: #666;
  margin: 0;
}

.save-button {
  margin-top: 2rem;
  padding: 0 1rem;
}
</style>