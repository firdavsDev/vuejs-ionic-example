class AnalyticsService {
  trackEvent(eventName, parameters = {}) {
    // Track user interactions
    console.log('Event tracked:', eventName, parameters);
    
    // In production, send to analytics service
    if (environment.production) {
      // Send to Google Analytics, Firebase, etc.
    }
  }

  trackScreenView(screenName) {
    this.trackEvent('screen_view', { screen_name: screenName });
  }

  trackInspectionCreated(inspectionData) {
    this.trackEvent('inspection_created', {
      truck_number: inspectionData.truckNumber,
      images_count: inspectionData.images?.length || 0
    });
  }
}

export default new AnalyticsService();