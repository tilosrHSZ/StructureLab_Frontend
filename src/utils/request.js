import axios from 'axios';
import { useUserStore } from '../stores/user';
import { ElMessage } from 'element-plus';

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://124.70.106.80:8080',
  timeout: 10000
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    // 注意：文档要求在 Token 前加 Bearer
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 根据文档 CODE=1 为成功
    if (res.code === 1 || res.CODE === 1) {
      return res;
    } else {
      // 业务逻辑错误
      ElMessage.error(res.msg || res.message || '操作失败');
      return Promise.reject(new Error(res.msg || 'Error'));
    }
  },
  (error) => {
    ElMessage.error(error.message || '网络请求错误');
    return Promise.reject(error);
  }
);

export default service;