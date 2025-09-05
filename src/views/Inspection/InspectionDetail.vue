<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Inspection Details</ion-title>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="viewPDF">
            <ion-icon name="document-text"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content v-if="inspection">
      <!-- Basic Info Card -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Basic Information</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none">
            <ion-item>
              <ion-label>
                <strong>Driver:</strong> {{ inspection.driverName }}
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <strong>Truck Number:</strong> {{ inspection.truckNumber }}
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <strong>License Plate:</strong> {{ inspection.licensePlate }}
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <strong>Date:</strong> {{ formatDate(inspection.inspectionDate) }}
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Inspection Results Card -->
      <ion-card v-if="inspection.inspectionItems">
        <ion-card-header>
          <ion-card-title>Inspection Results</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div v-for="(category, categoryName) in inspection.inspectionItems" :key="categoryName">
            <h4>{{ categoryName }}</h4>
            <ion-list>
              <ion-item v-for="(value, itemName) in category" :key="itemName">
                <ion-icon 
                  :name="value ? 'checkmark-circle' : 'close-circle'"
                  :color="value ? 'success' : 'danger'"
                  slot="start"
                ></ion-icon>
                <ion-label>{{ formatItemName(itemName) }}</ion-label>
              </ion-item>
            </ion-list>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Images Card -->
      <ion-card v-if="inspection.images && inspection.images.length > 0">
        <ion-card-header>
          <ion-card-title>Images ({{ inspection.images.length }})</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col 
                v-for="(image, index) in inspection.images" 
                :key="index"
                size="6"
                size-md="4"
              >
                <img 
                  :src="image.url || image.webPath" 
                  :alt="`Image ${index + 1}`"
                  @click="viewImage(image)"
                  class="inspection-image"
                />
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

      <!-- Actions -->
      <div class="action-buttons">
        <ion-button expand="block" @click="viewPDF" color="primary">
          <ion-icon name="document-text" slot="start"></ion-icon>
          View PDF Report
        </ion-button>
        
        <ion-button expand="block" @click="downloadPDF" fill="outline">
          <ion-icon name="download" slot="start"></ion-icon>
          Download PDF
        </ion-button>
        
        <ion-button expand="block" @click="shareInspection" fill="outline">
          <ion-icon name="share" slot="start"></ion-icon>
          Share Report
        </ion-button>
      </div>
    </ion-content>

    <!-- Loading State -->
    <ion-content v-else>
      <div class="loading-container">
        <ion-spinner></ion-spinner>
        <p>Loading inspection details...</p>
      </div>
    </ion-content>

    <!-- Image Modal -->
    <ion-modal :is-open="showImageModal" @didDismiss="showImageModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Image View</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showImageModal = false">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="image-modal-content">
          <img v-if="selectedImage" :src="selectedImage.url || selectedImage.webPath" />
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonModal,
  modalController
} from '@ionic/vue';
import { 
  documentText, 
  download, 
  share, 
  checkmarkCircle, 
  closeCircle 
} from 'ionicons/icons';
import ApiService from '@/services/api.service.js';
import PDFService from '@/services/pdf.service.js';

export default {
  name: 'InspectionDetail',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonModal
  },
  data() {
    return {
      inspection: null,
      showImageModal: false,
      selectedImage: null
    }
  },
  async created() {
    await this.loadInspection();
  },
  methods: {
    async loadInspection() {
      try {
        const id = this.$route.params.id;
        this.inspection = await ApiService.getInspectionDetail(id);
      } catch (error) {
        console.error('Error loading inspection:', error);
        this.$router.push('/inspections');
      }
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    
    formatItemName(name) {
      return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
    },
    
    viewImage(image) {
      this.selectedImage = image;
      this.showImageModal = true;
    },
    
    async viewPDF() {
      // Navigate to PDF viewer or open modal with PDF
      this.$router.push(`/inspection/${this.inspection.id}/pdf`);
    },
    
    async downloadPDF() {
      try {
        const pdf = await PDFService.generateInspectionPDF(this.inspection);
        const filename = `inspection_${this.inspection.truckNumber}_${new Date(this.inspection.inspectionDate).toISOString().split('T')[0]}.pdf`;
        await PDFService.downloadPDF(pdf, filename);
      } catch (error) {
        console.error('Error downloading PDF:', error);
      }
    },
    
    async shareInspection() {
      // Implementation for sharing inspection
      console.log('Share inspection:', this.inspection);
    }
  },
  setup() {
    return {
      documentText,
      download,
      share,
      checkmarkCircle,
      closeCircle
    }
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
}

.inspection-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}

.action-buttons {
  padding: 1rem;
  gap: 1rem;
}

.action-buttons ion-button {
  margin-bottom: 0.5rem;
}

.image-modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 1rem;
}

.image-modal-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>