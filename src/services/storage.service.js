// src/services/storage.service.js
import { Storage } from '@capacitor/storage';

class StorageService {
  async saveInspectionDraft(inspectionData) {
    const drafts = await this.getInspectionDrafts();
    const draftId = Date.now().toString();
    drafts[draftId] = {
      ...inspectionData,
      id: draftId,
      isDraft: true,
      savedAt: new Date().toISOString()
    };
    
    await Storage.set({
      key: 'inspection_drafts',
      value: JSON.stringify(drafts)
    });
    
    return draftId;
  }

  async getInspectionDrafts() {
    const { value } = await Storage.get({ key: 'inspection_drafts' });
    return value ? JSON.parse(value) : {};
  }

  async deleteDraft(draftId) {
    const drafts = await this.getInspectionDrafts();
    delete drafts[draftId];
    
    await Storage.set({
      key: 'inspection_drafts',
      value: JSON.stringify(drafts)
    });
  }

  async syncDraftsWhenOnline() {
    const drafts = await this.getInspectionDrafts();
    
    for (const [draftId, draftData] of Object.entries(drafts)) {
      try {
        // Remove draft-specific fields
        const { isDraft, savedAt, ...inspectionData } = draftData;
        
        // Submit to API
        await ApiService.createInspection(inspectionData);
        
        // Remove draft after successful sync
        await this.deleteDraft(draftId);
        
        console.log(`Draft ${draftId} synced successfully`);
      } catch (error) {
        console.error(`Failed to sync draft ${draftId}:`, error);
      }
    }
  }
}

export default new StorageService();