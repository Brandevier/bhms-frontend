import apiClient from "../redux/middleware/apiClient";
const API_BASE_URL = '/api/or-schedules';

export default {
  async createOrSchedule(data) {
    return apiClient.post(API_BASE_URL, data);
  },
  
  async getOrSchedules(params) {
    return apiClient.get(API_BASE_URL, { params });
  },
  
  async getOrScheduleById(id) {
    return apiClient.get(`${API_BASE_URL}/${id}`);
  },
  
  async updateOrSchedule(id, updates) {
    return apiClient.put(`${API_BASE_URL}/${id}`, updates);
  },
  
  async cancelOrSchedule(id, cancellation_reason) {
    return apiClient.put(`${API_BASE_URL}/${id}/cancel`, { cancellation_reason });
  },
  
  async completeSurgery(id, data) {
    return apiClient.put(`${API_BASE_URL}/${id}/complete`, data);
  },
  
  async getSchedulesBySurgeon(params) {
    return axios.get(`${API_BASE_URL}/surgeon/${params.surgeon_id}`, { params });
  },
  
  async getAvailableTimeSlots(date, institution_id) {
    return apiClient.get(`${API_BASE_URL}/available/${date}`, { params: { institution_id } });
  }
};