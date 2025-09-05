<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Create Inspection</ion-title>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <StepIndicator :current-step="currentStep" />

      <div class="step-content">
        <StepOne v-if="currentStep === 0" v-model="formData" />
        <StepTwo v-else-if="currentStep === 1" v-model="formData" />
        <StepThree v-else-if="currentStep === 2" v-model="formData.images" />
      </div>

      <div class="navigation-buttons">
        <ion-button v-if="currentStep > 0" @click="previousStep" fill="outline">
          Previous
        </ion-button>

        <ion-button
          v-if="currentStep < 2"
          @click="nextStep"
          :disabled="!canProceed"
        >
          Next
        </ion-button>

        <ion-button
          v-else
          @click="submitForm"
          :disabled="!canSubmit"
          color="success"
        >
          Submit Inspection
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
  IonBackButton,
  IonContent,
  IonButton,
  toastController,
  loadingController,
} from "@ionic/vue";
import StepIndicator from "@/components/InspectionForm/StepIndicator.vue";
import StepOne from "@/components/InspectionForm/StepOne.vue";
import StepTwo from "@/components/InspectionForm/StepTwo.vue";
import StepThree from "@/components/InspectionForm/StepThree.vue";
import ApiService from "@/services/api.service.js";

export default {
  name: "CreateInspection",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonButton,
    StepIndicator,
    StepOne,
    StepTwo,
    StepThree,
  },
  data() {
    return {
      currentStep: 0,
      formData: {
        driverName: "",
        truckNumber: "",
        licensePlate: "",
        inspectionDate: new Date().toISOString(),
        inspectionItems: {},
        images: [],
      },
    };
  },
  computed: {
    canProceed() {
      switch (this.currentStep) {
        case 0:
          return this.formData.driverName && this.formData.truckNumber;
        case 1:
          return true; // Can proceed even without checking all items
        default:
          return true;
      }
    },
    canSubmit() {
      return this.canProceed;
    },
  },
  methods: {
    nextStep() {
      if (this.currentStep < 2) {
        this.currentStep++;
      }
    },

    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },

    async submitForm() {
      const loading = await loadingController.create({
        message: "Creating inspection...",
      });
      await loading.present();

      try {
        const response = await ApiService.createInspection(this.formData);

        await loading.dismiss();

        const toast = await toastController.create({
          message: "Inspection created successfully!",
          duration: 2000,
          color: "success",
        });
        await toast.present();

        // Navigate to inspection detail page
        this.$router.push(`/inspection/detail/${response.data.id}`);
      } catch (error) {
        await loading.dismiss();

        const toast = await toastController.create({
          message: "Error creating inspection. Please try again.",
          duration: 3000,
          color: "danger",
        });
        await toast.present();

        console.error("Submit error:", error);
      }
    },
  },
};
</script>

<style scoped>
.step-content {
  min-height: 60vh;
}

.navigation-buttons {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.navigation-buttons ion-button {
  flex: 1;
}
</style>