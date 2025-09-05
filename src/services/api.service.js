import axios from 'axios';

const BASE_URL = 'YOUR_DRF_API_URL'; // Replace with your Django API URL

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
    });
    
    // Add auth interceptor
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Authentication
  async login(googleToken) {
    const response = await this.api.post('/auth/google/', {
      token: googleToken
    });
    return response.data;
  }

  async logout() {
    return await this.api.post('/auth/logout/');
  }

  // Profile
  async getProfile() {
    const response = await this.api.get('/profile/');
    return response.data;
  }

  async updateProfile(profileData) {
    const response = await this.api.put('/profile/', profileData);
    return response.data;
  }

  // Inspections
  async getInspections() {
    const response = await this.api.get('/inspections/');
    return response.data;
  }

  async createInspection(inspectionData) {
    // Convert images to FormData for upload
    const formData = new FormData();
    
    // Add basic form data
    Object.keys(inspectionData).forEach(key => {
      if (key !== 'images') {
        if (typeof inspectionData[key] === 'object') {
          formData.append(key, JSON.stringify(inspectionData[key]));
        } else {
          formData.append(key, inspectionData[key]);
        }
      }
    });
    
    // Add images
    inspectionData.images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });
    
    const response = await this.api.post('/inspections/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async getInspectionDetail(id) {
    const response = await this.api.get(`/inspections/${id}/`);
    return response.data;
  }

  async deleteInspection(id) {
    return await this.api.delete(`/inspections/${id}/`);
  }

  async downloadPDF(id) {
    const response = await this.api.get(`/inspections/${id}/pdf/`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export default new ApiService();