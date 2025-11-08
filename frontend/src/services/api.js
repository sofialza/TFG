import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventosAPI = {
  getAll: () => api.get('/eventos'),
  getById: (id) => api.get(`/eventos/${id}`),
  create: (evento) => api.post('/eventos', evento),
  update: (id, evento) => api.put(`/eventos/${id}`, evento),
  delete: (id) => api.delete(`/eventos/${id}`),
  getProyeccionConsumo: (id) => api.get(`/eventos/${id}/proyeccion-consumo`),
};

export const insumosAPI = {
  getAll: () => api.get('/insumos'),
  getById: (id) => api.get(`/insumos/${id}`),
  create: (insumo) => api.post('/insumos', insumo),
  update: (id, insumo) => api.put(`/insumos/${id}`, insumo),
  updateStock: (id, cantidad) => api.patch(`/insumos/${id}/stock`, { cantidad }),
  delete: (id) => api.delete(`/insumos/${id}`),
  getAlertasStockBajo: (umbral = 10.0) => api.get(`/insumos/alertas-stock-bajo?umbral=${umbral}`),
};

export const ordenesCompraAPI = {
  getAll: () => api.get('/ordenes-compra'),
  getPendientes: () => api.get('/ordenes-compra/pendientes'),
  getById: (id) => api.get(`/ordenes-compra/${id}`),
  create: (orden) => api.post('/ordenes-compra', orden),
  updateEstado: (id, estado) => api.patch(`/ordenes-compra/${id}/estado`, { estado }),
  delete: (id) => api.delete(`/ordenes-compra/${id}`),
};

export default api;
