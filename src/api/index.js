import request from '../utils/request';

// ==========================================
//  全功能 Mock 版 API (用于无后端测试)
// ==========================================

// 模拟数据库的计数器 (刷新页面后会重置为0)
let categoryTaskCounter = 0;
let matchTaskCounter = 0;

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
        data: {
          photosList: [
            "https://via.placeholder.com/200/008000/FFFFFF?text=Match_Result_1",
            "https://via.placeholder.com/200/005000/FFFFFF?text=Match_Result_2"
          ]
        }
      });
    }, 800);
  });
};