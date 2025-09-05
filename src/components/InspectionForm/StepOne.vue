<template>
  <ion-content>
    <ion-list>
      <ion-item>
        <ion-label position="stacked">Driver Name</ion-label>
        <ion-input
          v-model="formData.driverName"
          placeholder="Enter driver name"
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Truck Number</ion-label>
        <ion-input
          v-model="formData.truckNumber"
          placeholder="Enter truck number"
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">License Plate</ion-label>
        <ion-input
          v-model="formData.licensePlate"
          placeholder="Enter license plate"
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Inspection Date</ion-label>
        <ion-datetime
          v-model="formData.inspectionDate"
          display-format="MM/DD/YYYY"
        ></ion-datetime>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetime,
} from "@ionic/vue";

export default {
  name: "StepOne",
  components: {
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonDatetime,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    formData: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>