import axios from 'axios';

const API_URL = 'http://localhost:3000/api/tasks';  // 確保這是正確的 API 地址

// 獲取所有任務
export const getTasks = () => {
  return axios.get(API_URL);
};

// 新增任務
export const createTask = (taskData) => {
  return axios.post(API_URL, taskData);
};

// 更新任務（含狀態更新）
export const updateTask = (taskId, taskData) => {
  return axios.put(`${API_URL}/${taskId}`, taskData);
};

// 刪除任務
export const deleteTask = (taskId) => {
  return axios.delete(`${API_URL}/${taskId}`);
};
