<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>My Inspections</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$router.push('/inspection/create')">
            <ion-icon name="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-list v-if="inspections.length > 0">
        <ion-item
          v-for="inspection in inspections"
          :key="inspection.id"
          @click="viewDetail(inspection.id)"
          button
        >
          <ion-label>
            <h2>{{ inspection.truckNumber }}</h2>
            <p>{{ formatDate(inspection.inspectionDate) }}</p>
            <p>{{ inspection.driverName }}</p>
          </ion-label>

          <div slot="end" class="action-buttons">
            <ion-button fill="clear" @click.stop="downloadPDF(inspection.id)">
              <ion-icon name="download"></ion-icon>
            </ion-button>
            <ion-button fill="clear" @click.stop="shareInspection(inspection)">
              <ion-icon name="share"></ion-icon>
            </ion-button>
            <ion-button
              fill="clear"
              color="danger"
              @click.stop="deleteInspection(inspection.id)"
            >
              <ion-icon name="trash"></ion-icon>
            </ion-button>
          </div>
        </ion-item>
      </ion-list>

      <div v-else class="empty-state">
        <ion-icon name="clipboard-outline" size="large"></ion-icon>
        <h3>No inspections yet</h3>
        <p>Create your first inspection report</p>
        <ion-button @click="$router.push('/inspection/create')">
          Create Inspection
        </ion-button>
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
  IonButton,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  alertController,
  toastController,
  actionSheetController,
} from "@ionic/vue";
import { add, download, share, trash, clipboardOutline } from "ionicons/icons";
import ApiService from "@/services/api.service.js";
import { Share } from "@capacitor/share";

export default {
  name: "InspectionList",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
  },
  data() {
    return {
      inspections: [],
    };
  },
  async created() {
    await this.loadInspections();
  },
  methods: {
    async loadInspections() {
      try {
        this.inspections = await ApiService.getInspections();
      } catch (error) {
        console.error("Error loading inspections:", error);
        const toast = await toastController.create({
          message: "Error loading inspections",
          duration: 2000,
          color: "danger",
        });
        await toast.present();
      }
    },

    async handleRefresh(event) {
      await this.loadInspections();
      event.target.complete();
    },

    viewDetail(id) {
      this.$router.push(`/inspection/detail/${id}`);
    },

    async downloadPDF(id) {
      try {
        const pdfBlob = await ApiService.downloadPDF(id);
        // Handle PDF download/viewing logic here
        const toast = await toastController.create({
          message: "PDF downloaded successfully",
          duration: 2000,
          color: "success",
        });
        await toast.present();
      } catch (error) {
        console.error("Error downloading PDF:", error);
      }
    },

    async shareInspection(inspection) {
      try {
        await Share.share({
          title: `Inspection Report - ${inspection.truckNumber}`,
          text: `Driver: ${inspection.driverName}\nTruck: ${
            inspection.truckNumber
          }\nDate: ${this.formatDate(inspection.inspectionDate)}`,
          url: `${window.location.origin}/inspection/detail/${inspection.id}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    },

    async deleteInspection(id) {
      const alert = await alertController.create({
        header: "Delete Inspection",
        message:
          "Are you sure you want to delete this inspection? This cannot be undone.",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Delete",
            role: "destructive",
            handler: async () => {
              try {
                await ApiService.deleteInspection(id);
                await this.loadInspections();

                const toast = await toastController.create({
                  message: "Inspection deleted successfully",
                  duration: 2000,
                  color: "success",
                });
                await toast.present();
              } catch (error) {
                console.error("Error deleting inspection:", error);
              }
            },
          },
        ],
      });

      await alert.present();
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
  setup() {
    return {
      add,
      download,
      share,
      trash,
      clipboardOutline,
    };
  },
};
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  padding: 2rem;
  text-align: center;
}

.empty-state ion-icon {
  color: #ccc;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 1rem 0;
  color: #666;
}

.empty-state p {
  color: #999;
  margin-bottom: 2rem;
}
</style>