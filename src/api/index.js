import request from '../utils/request';

// ==========================================
//  全功能 Mock 版 API (用于无后端测试)
// ==========================================

// 1. 模拟登录
export const login = (data) => {
  return new Promise((resolve) => {
    console.log('>> [Mock] 正在登录:', data);
    setTimeout(() => {
      resolve({
        code: 1,
        msg: "success",
        data: {
          // 模拟后端返回用户信息和 token
          username: data.username,
          token: "mock-token-" + Date.now() 
        }
      });
    }, 800); // 模拟 0.8秒 网络延迟
  });
};

// 2. 模拟注册
export const register = (data) => {
  return new Promise((resolve) => {
    console.log('>> [Mock] 正在注册:', data);
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

// 4. 模拟上传图片 (返回任务ID)
export const uploadCategory = (formData) => {
  return new Promise((resolve) => {
    console.log('>> [Mock] 正在上传图片...');
    // 打印一下 FormData 里的东西，证明文件传进来了
    for (var pair of formData.entries()) {
       console.log(pair[0] + ', ' + pair[1]); 
    }

    setTimeout(() => {
      resolve({
        code: 1,
        msg: "success",
        data: {
          // 返回一个随机的任务ID
          idNum: "Task-" + Math.floor(Math.random() * 1000)
        }
      });
    }, 1500); // 上传通常比较慢，模拟 1.5秒
  });
};

// 5. 模拟获取结果 (包含轮询逻辑)
// 逻辑：随机让它失败几次，模拟 AI 正在处理中，最后成功返回图片
export const downloadCategory = (data) => {
  return new Promise((resolve, reject) => {
    console.log(`>> [Mock] 查询任务结果 ID: ${data.idNum}`);
    
    setTimeout(() => {
      // 设定 70% 的概率成功，30% 的概率还在处理中 (模拟轮询效果)
      const isReady = Math.random() > 0.3; 

      if (isReady) {
        console.log("   -> [Mock] AI 处理完成，返回结果");
        resolve({
          code: 1,
          msg: "success",
          data: {
            // 这里返回可以在浏览器显示的占位图
            result: [
              // 第一组描述对应的图片
              [
                "https://via.placeholder.com/200/FF0000/FFFFFF?text=Cat_A",
                "https://via.placeholder.com/200/AA0000/FFFFFF?text=Cat_B"
              ],
              // 第二组描述对应的图片
              [
                "https://via.placeholder.com/200/0000FF/FFFFFF?text=Dog_A"
              ]
            ]
          }
        });
      } else {
        console.log("   -> [Mock] AI 处理中... (模拟返回失败，触发前端重试)");
        // 模拟后端还在处理，返回非1的code，或者直接 reject
        resolve({ code: 0, msg: "Processing" });
      }
    }, 500);
  });
};

// ------------------------------------------------
//  核心功能测试：描述配对
// ------------------------------------------------

// 6. 模拟上传描述
export const uploadMatch = (data) => {
  return new Promise((resolve) => {
    console.log('>> [Mock] 上传描述:', data);
    setTimeout(() => {
      resolve({ 
        code: 1, 
        msg: "success", 
        data: { idNum: data.idNum } 
      });
    }, 1000);
  });
};

// 7. 模拟获取配对结果
export const downloadMatch = (data) => {
  return new Promise((resolve) => {
    console.log(`>> [Mock] 查询配对结果 ID: ${data.idNum}`);
    setTimeout(() => {
      // 这里直接返回成功，为了区分上面的轮询，这里一次成功
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