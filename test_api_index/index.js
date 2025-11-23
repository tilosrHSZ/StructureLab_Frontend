import request from '../utils/request';

// 1. 登录
export const login = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data // { username, password }
  });
};

// 2. 注册
export const register = (data) => {
  return request({
    url: '/user/register',
    method: 'post',
    data // { username, password, phoneNum}
  });
};

// 3. 修改用户信息
export const updateUser = (data) => {
  return request({
    url: '/user/change',
    method: 'put',
    data // { username, password, phoneNum, name }
  });
};

// 4. 图片分类上传
export const uploadCategory = (formData) => {
  return request({
    url: '/user/category/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 5. 图片分类获取 (GET请求带Body)
export const downloadCategory = (data) => {
  return request({
    url: '/user/category/download',
    method: 'get',
    data // { username, idNum } - 注意：部分浏览器或代理可能会拦截GET请求的Body
  });
};

// 6. 描述配对上传
export const uploadMatch = (data) => {
  return request({
    url: '/user/match/upload',
    method: 'post',
    data // { username, idNum, description }
  });
};

// 7. 描述配对获取 (GET请求带Body)
export const downloadMatch = (data) => {
  return request({
    url: '/user/match/download',
    method: 'get',
    data // { username, idNum }
  });
};