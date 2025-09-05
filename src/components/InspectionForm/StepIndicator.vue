<template>
  <div class="step-indicator">
    <div 
      v-for="(step, index) in steps" 
      :key="index"
      :class="getStepClass(index)"
    >
      <div class="step-number">{{ index + 1 }}</div>
      <div class="step-title">{{ step }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepIndicator',
  props: {
    currentStep: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      steps: ['Basic Info', 'Inspection', 'Images']
    }
  },
  methods: {
    getStepClass(index) {
      return {
        'step': true,
        'active': index === this.currentStep,
        'completed': index < this.currentStep
      }
    }
  }
}
</script>

<style scoped>
.step-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.step {
  text-align: center;
  flex: 1;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  transition: all 0.3s;
}

.step.active .step-number {
  background: #3880ff;
  color: white;
}

.step.completed .step-number {
  background: #2dd36f;
  color: white;
}
</style>