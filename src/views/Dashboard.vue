<template>
    <div class="dashboard">
      <el-container>
        <el-header class="header">
          <h2>Vue3 接口对接演示系统</h2>
          <div>
            <span>欢迎, {{ userStore.username }}</span>
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
                <el-form-item label="新昵称(Name)">
                  <el-input v-model="userForm.name" />
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
                    <el-form label-width="100px">
                      <el-form-item label="任务ID">
                         <el-input v-model="categoryUpload.idNum" placeholder="例如: 1" type="number"/>
                      </el-form-item>
                      
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
                    <el-input v-model="categoryQueryId" placeholder="输入要查询的 idNum" style="margin-bottom: 10px;">
                      <template #append>
                        <el-button @click="checkCategoryResult">手动查询</el-button>
                      </template>
                    </el-input>
                    
                    <el-alert title="点击上传后，您可以稍后在此手动查询，或等待自动通知" type="info" :closable="false" show-icon />
                    
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
                      <el-form-item label="任务ID">
                         <el-input v-model="matchUpload.idNum" placeholder="例如: 2" type="number"/>
                      </el-form-item>
                      <el-form-item label="描述文本">
                         <el-input v-model="matchUpload.description" type="textarea" :rows="4" />
                      </el-form-item>
                      <el-button type="success" @click="submitMatchUpload">上传描述</el-button>
                    </el-form>
                  </el-card>
                </el-col>
                
                <el-col :span="12">
                  <el-card header="配对结果">
                     <el-input v-model="matchQueryId" placeholder="输入要查询的 idNum" style="margin-bottom: 10px;">
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
    name: ''
  });
  
  const handleUpdateUser = async () => {
    try {
      await updateUser(userForm);
      ElMessage.success('修改成功');
    } catch (e) {
      // 错误已在拦截器处理
    }
  };
  
  // --- 图片分类逻辑 ---
  const categoryUpload = reactive({
    idNum: '', // 前端生成的ID
    descriptions: [''],
    files: []
  });
  const categoryQueryId = ref('');
  const categoryResult = ref(null);
  
  const addDesc = () => categoryUpload.descriptions.push('');
  const removeDesc = (index) => categoryUpload.descriptions.splice(index, 1);
  const handleFileChange = (e) => {
    categoryUpload.files = Array.from(e.target.files);
  };
  
  const submitCategoryUpload = async () => {
    if (!categoryUpload.idNum || categoryUpload.files.length === 0) {
      return ElMessage.warning('请填写ID并选择图片');
    }
  
    const formData = new FormData();
    formData.append('username', userStore.username);
    formData.append('idNum', categoryUpload.idNum);
    // 文档要求 descriptionList 是 JSON 字符串
    formData.append('descriptionList', JSON.stringify(categoryUpload.descriptions));
    
    // 文档要求 files 字段名为 photoList
    categoryUpload.files.forEach(file => {
      formData.append('photoList', file);
    });
  
    try {
      await uploadCategory(formData);
      ElMessage.success('上传成功，系统正在处理...');
      // 自动设置查询ID
      categoryQueryId.value = categoryUpload.idNum;
      // 开启轮询 (Simple Polling)
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
    idNum: '',
    description: ''
  });
  const matchQueryId = ref('');
  const matchResult = ref([]);
  
  const submitMatchUpload = async () => {
    try {
      await uploadMatch({
        username: userStore.username,
        idNum: matchUpload.idNum,
        description: matchUpload.description
      });
      ElMessage.success('上传成功，请稍后查询');
      matchQueryId.value = matchUpload.idNum;
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
    background: #409EFF;
    color: white;
  }
  .result-group {
    border-bottom: 1px dashed #ccc;
    padding: 10px 0;
  }
  </style>