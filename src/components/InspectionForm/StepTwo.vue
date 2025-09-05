<template>
  <ion-content>
    <ion-list>
      <ion-item-group
        v-for="(category, categoryName) in inspectionItems"
        :key="categoryName"
      >
        <ion-item-divider>
          <ion-label>{{ categoryName }}</ion-label>
        </ion-item-divider>

        <ion-item v-for="(item, index) in category" :key="index">
          <ion-checkbox
            v-model="formData.inspectionItems[categoryName][item.key]"
          ></ion-checkbox>
          <ion-label class="ion-margin-start">
            {{ item.label }}
          </ion-label>
        </ion-item>
      </ion-item-group>
    </ion-list>
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonList,
  IonItem,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonCheckbox,
} from "@ionic/vue";

export default {
  name: "StepTwo",
  components: {
    IonContent,
    IonList,
    IonItem,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonCheckbox,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      inspectionItems: {
        Engine: [
          { key: "engineOil", label: "Engine Oil Level" },
          { key: "coolant", label: "Coolant Level" },
          { key: "belts", label: "Belts Condition" },
          { key: "hoses", label: "Hoses Condition" },
        ],
        Brakes: [
          { key: "brakeFluid", label: "Brake Fluid Level" },
          { key: "brakePads", label: "Brake Pads Condition" },
          { key: "brakeLines", label: "Brake Lines" },
        ],
        Tires: [
          { key: "tireCondition", label: "Tire Condition" },
          { key: "tirePressure", label: "Tire Pressure" },
          { key: "wheelNuts", label: "Wheel Nuts Tight" },
        ],
        Lights: [
          { key: "headlights", label: "Headlights Working" },
          { key: "taillights", label: "Taillights Working" },
          { key: "indicators", label: "Turn Indicators Working" },
          { key: "hazards", label: "Hazard Lights Working" },
        ],
      },
    };
  },
  computed: {
    formData: {
      get() {
        // Initialize inspection items if not exists
        if (!this.modelValue.inspectionItems) {
          const initialItems = {};
          Object.keys(this.inspectionItems).forEach((category) => {
            initialItems[category] = {};
            this.inspectionItems[category].forEach((item) => {
              initialItems[category][item.key] = false;
            });
          });
          this.$emit("update:modelValue", {
            ...this.modelValue,
            inspectionItems: initialItems,
          });
          return { ...this.modelValue, inspectionItems: initialItems };
        }
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>