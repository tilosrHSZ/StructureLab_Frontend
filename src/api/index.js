import request from '../utils/request';

// ==========================================
//  全功能 Mock 版 API (用于无后端测试)
// ==========================================

// 模拟数据库的计数器 (刷新页面后会重置为0)
let categoryTaskCounter = 0;
let matchTaskCounter = 0;

// 1. 造一点假的历史图片数据 (30张)
let mockHistoryDB = Array.from({ length: 30 }, (_, i) => 
  `https://via.placeholder.com/200/54a0ff/FFFFFF?text=Photo_${i + 1}`
);
// 2. 造一个空的回收站
let mockBinDB = [];

// 1. 模拟登录
export const login = (data) => {
  return new Promise((resolve) => {
    console.log('>> [Mock] 正在登录:', data);
    setTimeout(() => {
      resolve({
        code: 1,
        msg: "success",
        data: {
          username: data.username,
          token: "mock-token-" + Date.now() 
        }
      });
    }, 800); 
  });
};

// 2. 模拟注册 (支持手机号打印)
export const register = (data) => {
  return new Promise((resolve) => {
    console.log('>> [Mock] 正在注册，提交的数据:', data);
    setTimeout(() => {
      resolve({ code: 1, msg: "注册成功" });
    }, 800);
  });
};

// 3. 模拟修改信息
export const updateUser = (data) => {
  return new Promise((resolve) => {
    console.log('>> [Mock] 提交修改:', data);
    setTimeout(() => {
      resolve({ code: 1, msg: "修改成功" });
    }, 500);
  });
};

// ------------------------------------------------
//  核心功能测试：图片分类
// ------------------------------------------------

// 4. 模拟上传图片 (返回简单数字ID: 1, 2, 3...)
export const uploadCategory = (formData) => {
  return new Promise((resolve) => {
    console.log('>> [Mock] 正在上传图片...');
    // 计数器 +1
    categoryTaskCounter++;
    
    setTimeout(() => {
      resolve({
        code: 1,
        msg: "success",
        data: {
          // 这里直接返回计数器的值，模拟第几次上传
          idNum: categoryTaskCounter 
        }
      });
    }, 1500); 
  });
};

// 5. 模拟获取结果 (POST请求)
export const downloadCategory = (data) => {
  return new Promise((resolve) => {
    console.log(`>> [Mock] 查询分类结果 ID: ${data.idNum}`);
    
    setTimeout(() => {
      // 模拟随机成功 (30%概率还在处理中)
      const isReady = Math.random() > 0.3; 

      if (isReady) {
        resolve({
          code: 1,
          msg: "success",
          data: {
            result: [
              [
                "https://via.placeholder.com/200/FF0000/FFFFFF?text=Cat_A",
                "https://via.placeholder.com/200/AA0000/FFFFFF?text=Cat_B"
              ],
              [
                "https://via.placeholder.com/200/0000FF/FFFFFF?text=Dog_A"
              ]
            ]
          }
        });
      } else {
        // 模拟处理中
        resolve({ code: 0, msg: "Processing" });
      }
    }, 500);
  });
};

// ------------------------------------------------
//  核心功能测试：描述配对
// ------------------------------------------------

// 6. 模拟上传描述 (返回简单数字ID: 1, 2, 3...)
export const uploadMatch = (data) => {
  return new Promise((resolve) => {
    console.log('>> [Mock] 上传描述:', data);
    // 计数器 +1
    matchTaskCounter++;

    setTimeout(() => {
      resolve({ 
        code: 1, 
        msg: "success", 
        data: { 
            // 返回计数器的值
            idNum: matchTaskCounter 
        } 
      });
    }, 1000);
  });
};

// 7. 模拟获取配对结果 (POST请求)
export const downloadMatch = (data) => {
  return new Promise((resolve) => {
    console.log(`>> [Mock] 查询配对结果 ID: ${data.idNum}`);
    setTimeout(() => {
      resolve({
        code: 1,
        msg: "success",
        data: [
            "https://img2.baidu.com/it/u=3202947311,1189366315&fm=253&fmt=auto",
            "https://p0.meituan.net/wedding/5d99616053303d35368a6f37803a08d2857434.jpg"
          ]
      });
    }, 800);
  });
};

// 8. 分页读取历史图片
export const getHistoryPhotos = (params) => {
  return new Promise((resolve) => {
    console.log('>> [Mock] 获取历史图片 分页:', params);
    
    // 模拟分页逻辑
    const page = params.pageNum || 1;
    const size = params.pageSize || 5;
    const start = (page - 1) * size;
    const end = start + size;
    
    const pageData = mockHistoryDB.slice(start, end);

    setTimeout(() => {
      resolve({
        code: 1,
        message: "success",
        data: {
          total: mockHistoryDB.length, // 总条数
          photoList: pageData          // 当前页数据
        }
      });
    }, 500);
  });
};

// 9. 删除历史图片 (移入回收站)
export const deleteHistoryPhoto = (url) => {
  return new Promise((resolve) => {
    console.log('>> [Mock] 删除图片到回收站:', url);
    // 从历史里删掉
    mockHistoryDB = mockHistoryDB.filter(item => item !== url);
    // 加到回收站
    mockBinDB.push(url);

    setTimeout(() => {
      resolve({ code: 1, message: "success", data: null });
    }, 500);
  });
};

// 10. 回收站读取
export const getRecycleBin = () => {
  return new Promise((resolve) => {
    console.log('>> [Mock] 读取回收站');
    setTimeout(() => {
      resolve({
        code: 1,
        message: "success",
        data: {
          photoList: [...mockBinDB] // 返回回收站副本
        }
      });
    }, 500);
  });
};

// 11. 回收站彻底删除
export const deleteBinPhoto = (url) => {
  return new Promise((resolve) => {
    console.log('>> [Mock] 彻底删除图片:', url);
    // 从回收站删掉
    mockBinDB = mockBinDB.filter(item => item !== url);

    setTimeout(() => {
      resolve({ code: 1, message: "success", data: null });
    }, 500);
  });
};

// 12. 回收站恢复图片
export const recoverBinPhoto = (url) => {
  return new Promise((resolve) => {
    console.log('>> [Mock] 恢复图片:', url);
    
    // 从回收站数组删掉
    mockBinDB = mockBinDB.filter(item => item !== url);
    
    // 加回历史记录数组 (加到最前面)
    mockHistoryDB.unshift(url); 

    setTimeout(() => {
      resolve({ code: 1, message: "success", data: null });
    }, 500);
  });
};