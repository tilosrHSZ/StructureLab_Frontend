<template>
    <div class="dashboard">
      <el-container>
        <el-header class="header">
          <h2>Vue3 接口对接演示系统</h2>
          <div>
            <span>欢迎, {{ userStore.name || userStore.username }}</span>
            <el-button type="danger" size="small" style="margin-left: 10px" @click="handleLogout">退出</el-button>
          </div>
        </el-header>
  
        <el-main>
          <el-tabs type="border-card">
            
            <!-- 功能一：修改用户信息 -->
            <el-tab-pane label="用户信息修改">
              <el-form :model="userForm" label-width="100px" style="max-width: 500px">
                <el-form-item label="原账号名">
                  <el-input v-model="userForm.username" disabled />
                </el-form-item>
                <el-form-item label="新昵称">
                  <el-input v-model="userForm.name" placeholder="请输入你的昵称" />
                </el-form-item>
                <el-form-item label="新密码">
                  <el-input v-model="userForm.password" type="password" />
                </el-form-item>
                <el-form-item label="手机号">
                  <el-input v-model="userForm.phoneNum" />
                </el-form-item>
                <el-button type="primary" @click="handleUpdateUser">确认修改</el-button>
              </el-form>
            </el-tab-pane>
  
            <!-- 功能二：图片分类上传与查询 -->
            <el-tab-pane label="AI 图片分类">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card header="上传任务">
                    <el-form label-width="80px">
                      
                      <el-form-item label="描述列表">
                        <!-- 简单的动态添加描述 -->
                        <div v-for="(desc, index) in categoryUpload.descriptions" :key="index" style="margin-bottom: 5px; display: flex;">
                          <el-input v-model="categoryUpload.descriptions[index]" placeholder="输入分类描述" />
                          <el-button type="danger" :icon="Minus" circle size="small" @click="removeDesc(index)" style="margin-left: 5px"/>
                        </div>
                        <el-button type="primary" size="small" @click="addDesc">添加描述</el-button>
                      </el-form-item>
  
                      <el-form-item label="图片上传">
                         <input type="file" multiple @change="handleFileChange" />
                         <div v-if="categoryUpload.files.length">已选择 {{categoryUpload.files.length}} 张图片</div>
                      </el-form-item>
                      
                      <el-button type="success" @click="submitCategoryUpload">上传并开始处理</el-button>
                    </el-form>
                  </el-card>
                </el-col>
                
                <el-col :span="12">
                  <el-card header="结果查询 (轮询)">
                    <el-input v-model="categoryQueryId" placeholder="上传成功后自动获取ID" style="margin-bottom: 10px;" readonly>
                      <template #append>
                        <el-button @click="checkCategoryResult">刷新状态</el-button>
                      </template>
                    </el-input>
                    
                    <el-alert title="上传后自动填入ID并轮询" type="info" :closable="false" show-icon />
                    
                    <div v-if="categoryResult" style="margin-top: 20px;">
                      <h3>分类结果：</h3>
                      <div v-for="(group, index) in categoryResult" :key="index" class="result-group">
                        <p><strong>描述 {{ index + 1 }}:</strong></p>
                        <div class="img-list">
                          <el-image 
                            v-for="(url, i) in group" 
                            :key="i" 
                            :src="url" 
                            style="width: 100px; height: 100px; margin: 5px"
                            :preview-src-list="group"
                          />
                        </div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-tab-pane>
  
            <!-- 功能三：描述配对 -->
            <el-tab-pane label="描述配对">
               <el-row :gutter="20">
                <el-col :span="12">
                  <el-card header="上传描述">
                    <el-form label-width="80px">
                      <el-form-item label="描述文本">
                         <el-input v-model="matchUpload.description" type="textarea" :rows="4" />
                      </el-form-item>
                      <el-button type="success" @click="submitMatchUpload">上传描述</el-button>
                    </el-form>
                  </el-card>
                </el-col>
                
                <el-col :span="12">
                  <el-card header="配对结果">
                     <el-input v-model="matchQueryId" placeholder="上传后自动获取ID" style="margin-bottom: 10px;">
                      <template #append>
                        <el-button @click="checkMatchResult">查询结果</el-button>
                      </template>
                    </el-input>
                    
                    <div v-if="matchResult.length" style="margin-top: 20px;">
                      <h3>配对图片：</h3>
                       <el-image 
                          v-for="(url, i) in matchResult" 
                          :key="i" 
                          :src="url" 
                          style="width: 100px; height: 100px; margin: 5px"
                          :preview-src-list="matchResult"
                        />
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-tab-pane>
  
          </el-tabs>
        </el-main>
      </el-container>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useUserStore } from '../stores/user';
  import { useRouter } from 'vue-router';
  import { Minus } from '@element-plus/icons-vue';
  import { ElMessage, ElNotification } from 'element-plus';
  import { 
    updateUser, 
    uploadCategory, 
    downloadCategory, 
    uploadMatch, 
    downloadMatch 
  } from '../api';
  
  const userStore = useUserStore();
  const router = useRouter();
  
  // --- 退出登录 ---
  const handleLogout = () => {
    userStore.logout();
    router.push('/login');
  };
  
  // --- 用户信息修改 ---
  const userForm = reactive({
    username: userStore.username,
    password: '',
    phoneNum: '',
    name: userStore.name
  });
  
  const handleUpdateUser = async () => {
    try {
    // 调用后端接口
    await updateUser(userForm);
    
    // 3. 核心修改：接口成功后，手动更新前端 Store 的状态
    // 因为后端只返回了 "success"，没返回新的 name，所以我们得拿自己填在表单里的 userForm.name 去更新
    userStore.updateUserInfo(userForm.name);
    
    ElMessage.success('修改成功');
  } catch (e) {
    // 错误已在拦截器处理
  }
  };
  
  // --- 图片分类逻辑 ---
  const categoryUpload = reactive({
  // idNum 删掉，前端不维护了
  descriptions: [''],
  files: []
});
const categoryQueryId = ref('');
const categoryResult = ref(null);

const addDesc = () => categoryUpload.descriptions.push('');
const removeDesc = (index) => categoryUpload.descriptions.splice(index, 1);
const handleFileChange = (e) => { categoryUpload.files = Array.from(e.target.files); };

const submitCategoryUpload = async () => {
  if (categoryUpload.files.length === 0) return ElMessage.warning('请选择图片');

  const formData = new FormData();
  formData.append('username', userStore.username);
  // 注意：不再 append idNum
  formData.append('descriptionList', JSON.stringify(categoryUpload.descriptions));
  categoryUpload.files.forEach(file => formData.append('photoList', file));

  try {
    const res = await uploadCategory(formData);
    
    // 获取后端返回的 ID
    const newId = res.data.idNum; 
    ElMessage.success(`上传成功! 任务ID: ${newId}`);
    
    // 自动填入查询框
    categoryQueryId.value = newId;
    categoryResult.value = null; // 清空旧结果
    
    // 开始轮询
    startPolling(checkCategoryResult);
  } catch (e) {
    console.error(e);
  }
};
  
  const checkCategoryResult = async () => {
    if (!categoryQueryId.value) return;
    try {
      const res = await downloadCategory({
        username: userStore.username,
        idNum: categoryQueryId.value
      });
      
      if (res && res.data && res.data.result) {
        categoryResult.value = res.data.result;
        ElNotification({
          title: '处理完成',
          message: `任务 ${categoryQueryId.value} 分类结果已获取`,
          type: 'success',
          duration: 0
        });
        return true; // 停止轮询标记
      }
    } catch (e) {
      console.log("尚未获取结果或获取失败", e);
      return false;
    }
  };
  
  // --- 描述配对逻辑 ---
  const matchUpload = reactive({
  description: ''
  // idNum 删掉
});
const matchQueryId = ref('');
const matchResult = ref([]);

const submitMatchUpload = async () => {
  if(!matchUpload.description) return ElMessage.warning('请输入描述');
  
  try {
    const res = await uploadMatch({
      username: userStore.username,
      description: matchUpload.description
      // 不传 idNum
    });
    
    // 获取后端返回的 ID
    const newId = res.data.idNum;
    ElMessage.success(`上传成功! 任务ID: ${newId}`);
    
    matchQueryId.value = newId;
    matchResult.value = []; // 清空
    
    startPolling(checkMatchResult);
  } catch (e) {}
};
  
  const checkMatchResult = async () => {
    if (!matchQueryId.value) return;
    try {
      const res = await downloadMatch({
        username: userStore.username,
        idNum: matchQueryId.value
      });
      if (res && res.data && res.data.photosList) {
        matchResult.value = res.data.photosList;
        ElNotification({
          title: '配对成功',
          message: `任务 ${matchQueryId.value} 配对结果已获取`,
          type: 'success'
        });
        return true;
      }
    } catch (e) {
      return false;
    }
  };
  
  // --- 通用轮询工具 ---
  // 每隔 5 秒查询一次，尝试 20 次（即100秒内）
  const startPolling = (apiFunc, interval = 5000, maxRetries = 20) => {
    let count = 0;
    const timer = setInterval(async () => {
      count++;
      const isSuccess = await apiFunc();
      if (isSuccess || count >= maxRetries) {
        clearInterval(timer);
        if (!isSuccess) ElMessage.info('自动获取结果超时，请稍后手动点击查询');
      }
    }, interval);
  };
  
  onMounted(() => {
    if (!userStore.username) {
      ElMessage.error('请先登录');
      router.push('/login');
    }
  });
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #599f7c;
    color: white;
  }
  .result-group {
    border-bottom: 1px dashed #599f7c;
    padding: 10px 0;
  }
  </style>