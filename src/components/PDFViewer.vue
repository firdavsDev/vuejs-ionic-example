<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Inspection Report</ion-title>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="downloadPDF">
            <ion-icon name="download"></ion-icon>
          </ion-button>
          <ion-button @click="sharePDF">
            <ion-icon name="share"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <div class="pdf-container">
        <iframe 
          v-if="pdfUrl" 
          :src="pdfUrl" 
          width="100%" 
          height="100%"
          frameborder="0"
        ></iframe>
        <div v-else class="loading-container">
          <ion-spinner></ion-spinner>
          <p>Generating PDF...</p>
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
  IonButtons,
  IonBackButton,
  IonButton,
  IonContent,
  IonIcon,
  IonSpinner
} from '@ionic/vue';
import { download, share } from 'ionicons/icons';
import PDFService from '@/services/pdf.service.js';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

export default {
  name: 'PDFViewer',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonContent,
    IonIcon,
    IonSpinner
  },
  props: {
    inspectionData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      pdfUrl: null,
      pdf: null
    }
  },
  async mounted() {
    await this.generatePDF();
  },
  methods: {
    async generatePDF() {
      try {
        this.pdf = await PDFService.generateInspectionPDF(this.inspectionData);
        this.pdfUrl = this.pdf.output('datauristring');
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    },
    
    async downloadPDF() {
      if (this.pdf) {
        const filename = `inspection_${this.inspectionData.truckNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
        await PDFService.downloadPDF(this.pdf, filename);
      }
    },
    
    async sharePDF() {
      try {
        if (this.pdf) {
          const pdfBase64 = this.pdf.output('datauristring').split(',')[1];
          const filename = `inspection_${this.inspectionData.truckNumber}.pdf`;
          
          // Save to temporary directory
          const result = await Filesystem.writeFile({
            path: filename,
            data: pdfBase64,
            directory: Directory.Cache
          });
          
          await Share.share({
            title: 'Inspection Report',
            text: `Inspection report for truck ${this.inspectionData.truckNumber}`,
            files: [result.uri]
          });
        }
      } catch (error) {
        console.error('Error sharing PDF:', error);
      }
    }
  },
  setup() {
    return {
      download,
      share
    }
  }
}
</script>

<style scoped>
.pdf-container {
  height: 100%;
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loading-container p {
  margin-top: 1rem;
  color: #666;
}
</style>