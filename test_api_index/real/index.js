import request from '../utils/request';

// 1. 登录
export const login = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data 
  });
};

// 2. 注册
export const register = (data) => {
  return request({
    url: '/user/register',
    method: 'post',
    data 
  });
};

// 3. 修改用户信息
export const updateUser = (data) => {
  return request({
    url: '/user/change',
    method: 'put',
    data 
  });
};

// 4. 图片分类上传 (修改：不再需要传 idNum)
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

// 5. 图片分类获取 (修改：改为 POST 请求)
export const downloadCategory = (data) => {
  return request({
    url: '/user/category/download',
    method: 'post', // 文档改为 POST
    data // { username, idNum }
  });
};

// 6. 描述配对上传 (修改：不再需要传 idNum)
export const uploadMatch = (data) => {
  return request({
    url: '/user/match/upload',
    method: 'post',
    data // { username, description } -> 去掉了 idNum
  });
};

// 7. 描述配对获取 (修改：改为 POST 请求)
export const downloadMatch = (data) => {
  return request({
    url: '/user/match/download',
    method: 'post', // 文档改为 POST
    data // { username, idNum }
  });
};

// 8. 分页读取历史图片
export const getHistoryPhotos = (params) => {
  return request({
    url: '/user/photos/list',
    method: 'get',
    params // { pageNum, pageSize }
  });
};

// 9. 删除历史图片 (移入回收站)
export const deleteHistoryPhoto = (photoUrl) => {
  return request({
    url: '/user/photos/delete',
    method: 'delete',
    data: { 
      url: photoUrl 
    }
  });
};

// 10. 回收站读取
export const getRecycleBin = () => {
  return request({
    url: '/user/photos/binlist',
    method: 'get'
  });
};

// 11. 回收站彻底删除
export const deleteBinPhoto = (photoUrl) => {
  return request({
    url: '/user/photos/bin',
    method: 'delete',
    data: { 
      url: photoUrl 
    }
  });
};

// 12. 回收站恢复图片
export const recoverBinPhoto = (photoUrl) => {
  return request({
    url: '/user/photos/bin',
    method: 'post', 
    data: { 
      url: photoUrl 
    }
  });
};