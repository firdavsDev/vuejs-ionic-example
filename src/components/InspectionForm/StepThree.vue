<template>
  <ion-content>
    <div class="upload-section">
      <ion-button
        @click="takePicture"
        :disabled="images.length >= 20"
        fill="outline"
      >
        <ion-icon name="camera" slot="start"></ion-icon>
        Take Picture ({{ images.length }}/20)
      </ion-button>

      <ion-button
        @click="selectFromGallery"
        :disabled="images.length >= 20"
        fill="outline"
      >
        <ion-icon name="images" slot="start"></ion-icon>
        Select from Gallery
      </ion-button>
    </div>

    <ion-grid>
      <ion-row>
        <ion-col v-for="(image, index) in images" :key="index" size="6">
          <div class="image-container">
            <img :src="image.webPath" :alt="`Image ${index + 1}`" />
            <ion-button
              @click="removeImage(index)"
              fill="clear"
              color="danger"
              class="remove-btn"
            >
              <ion-icon name="close-circle"></ion-icon>
            </ion-button>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { camera, images, closeCircle } from "ionicons/icons";

export default {
  name: "StepThree",
  components: {
    IonContent,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
  },
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    images: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    async takePicture() {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
        });

        this.images = [...this.images, image];
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    },

    async selectFromGallery() {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Photos,
        });

        this.images = [...this.images, image];
      } catch (error) {
        console.error("Error selecting from gallery:", error);
      }
    },

    removeImage(index) {
      const newImages = [...this.images];
      newImages.splice(index, 1);
      this.images = newImages;
    },
  },
  setup() {
    return {
      camera,
      images,
      closeCircle,
    };
  },
};
</script>

<style scoped>
.upload-section {
  padding: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.image-container {
  position: relative;
  margin-bottom: 1rem;
}

.image-container img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  --padding-start: 4px;
  --padding-end: 4px;
}
</style>