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
  
          <!-- 功能四: 图片管理 (新增功能) -->
          <el-tab-pane label="图片管理">
            <el-tabs v-model="activePhotoTab" @tab-click="handlePhotoTabClick">
              
              <!-- 4.1 历史图片 -->
              <el-tab-pane label="历史图片列表" name="history">
                <el-button @click="fetchHistory" :icon="Refresh" circle style="margin-bottom: 10px;" />
                
                <div v-if="historyList.length === 0" style="color: #999; padding: 20px;">暂无历史图片</div>
                
                <div class="photo-grid">
                  <div v-for="(url, index) in historyList" :key="index" class="photo-item">
                    <el-image :src="url" fit="cover" :preview-src-list="[url]" style="width: 100%; height: 100%;" />
                    <div class="photo-actions">
                      <el-button type="danger" size="small" :icon="Delete" @click="handleDeleteHistory(url)">删除</el-button>
                    </div>
                  </div>
                </div>

                <!-- 分页组件 -->
                <div style="margin-top: 20px; display: flex; justify-content: center;">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="historyTotal"
                    :page-size="historyPageSize"
                    :current-page="historyPageNum"
                    @current-change="handlePageChange"
                  />
                </div>
              </el-tab-pane>

              <!-- 4.2 回收站 -->
              <el-tab-pane label="回收站 (30天自动清理)" name="bin">
                <el-button @click="fetchBin" :icon="Refresh" circle style="margin-bottom: 10px;" />
                <el-alert title="这里的图片会在30天后自动清除" type="warning" :closable="false" style="margin-bottom: 10px;"/>
                
                <div v-if="binList.length === 0" style="color: #999; padding: 20px;">回收站是空的</div>

                <div class="photo-grid">
                  <div v-for="(url, index) in binList" :key="index" class="photo-item">
                    <el-image :src="url" fit="cover" :preview-src-list="[url]" style="width: 100%; height: 100%; opacity: 0.7;" />
                    <div class="photo-actions">
                      <el-button type="danger" size="small" @click="handleDeleteBin(url)">彻底删除</el-button>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

            </el-tabs>
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
  import { Minus, Delete, Refresh } from '@element-plus/icons-vue';
  import { ElMessage, ElNotification, ElMessageBox } from 'element-plus';
  import { 
    updateUser, 
    uploadCategory, 
    downloadCategory, 
    uploadMatch, 
    downloadMatch,
    getHistoryPhotos,
    deleteHistoryPhoto,
    getRecycleBin,
    deleteBinPhoto
  } from '../api';
  
  const userStore = useUserStore();
  const router = useRouter();
  
  // 退出登录
  const handleLogout = () => {
    userStore.logout();
    router.push('/login');
  };
  
  // 用户信息修改
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
  
  // 图片分类逻辑
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
  
  // 描述配对逻辑
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
  
  // 通用轮询工具
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
  

  // 图片管理逻辑 (历史 & 回收站) 
  // Tab 激活状态
  const activePhotoTab = ref('history');
  
  // --- 4.1 历史图片相关变量 ---
  const historyList = ref([]);
  const historyTotal = ref(0);
  const historyPageNum = ref(1);
  const historyPageSize = ref(10); // 每页显示 10 张
  
  // --- 4.2 回收站相关变量 ---
  const binList = ref([]);
  
  // 1. 获取历史图片列表
  const fetchHistory = async () => {
    try {
      const res = await getHistoryPhotos({
        pageNum: historyPageNum.value,
        pageSize: historyPageSize.value
      });
      // 确保 total 转为数字，防止后端返回字符串
      historyTotal.value = Number(res.data.total);
      // 如果 photoList 是空或 undefined，给个空数组
      historyList.value = res.data.photoList || [];
    } catch (e) {
      console.error(e);
    }
  };
  
  // 2. 翻页处理
  const handlePageChange = (newPage) => {
    historyPageNum.value = newPage;
    fetchHistory();
  };
  
  // 3. 删除历史图片 (移入回收站)
  const handleDeleteHistory = (url) => {
    ElMessageBox.confirm(
      '确定要删除这张图片吗？它将被移入回收站。',
      '删除确认',
      { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' }
    ).then(async () => {
      try {
        await deleteHistoryPhoto(url); 
        ElMessage.success('已移入回收站');
        fetchHistory(); // 刷新列表
      } catch (e) {}
    });
  };
  
  // 4. 获取回收站列表
  const fetchBin = async () => {
    try {
      const res = await getRecycleBin();
      binList.value = res.data.photoList || [];
    } catch (e) {}
  };
  
  // 5. 彻底删除回收站图片
  const handleDeleteBin = (url) => {
    ElMessageBox.confirm(
      '这将永久删除该图片，无法恢复，确定吗？',
      '彻底删除',
      { confirmButtonText: '永久删除', cancelButtonText: '取消', type: 'error' }
    ).then(async () => {
      try {
        await deleteBinPhoto(url);
        ElMessage.success('已彻底删除');
        fetchBin(); // 刷新回收站
      } catch (e) {}
    });
  };
  
  // 6. 切换 Tab 时的自动刷新逻辑
  const handlePhotoTabClick = (tab) => {
    if (tab.paneName === 'history') {
      fetchHistory();
    } else if (tab.paneName === 'bin') {
      fetchBin();
    }
  };

  onMounted(() => {
    if (!userStore.username) {
      ElMessage.error('请先登录');
      router.push('/login');
      return
    }

     // 初始化：加载第一页历史图片
     fetchHistory();
  });
  </script>
  
  <style scoped>
  .dashboard {
    min-height: 100vh; 
    display: flex;
    flex-direction: column;
    background: #ced2d7; 
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #599f7c;
    color: white;
  }
  .result-group {
    border-bottom: 1px dashed #ccc;
    padding: 10px 0;
  }
    /* 网格容器：自动适应宽度，每列最小 150px */
  .photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
    margin-top: 15px;
  }
  
  /* 单张图片卡片容器 */
  .photo-item {
    position: relative;
    height: 150px; /* 固定高度，确保整齐 */
    border: 1px solid #eee;
    border-radius: 4px;
    overflow: hidden;
    background-color: #f5f7fa;
  }
  
  /* 悬停效果：鼠标放上去显示操作按钮 */
  .photo-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.6); /* 半透明黑色背景 */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    opacity: 0; /* 默认隐藏 */
    transition: opacity 0.3s;
  }
  
  .photo-item:hover .photo-actions {
    opacity: 1; /* hover 时显示 */
  }
  </style>