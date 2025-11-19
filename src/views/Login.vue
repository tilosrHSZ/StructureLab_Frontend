<template>
    <div class="login-container">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{ isLogin ? '用户登录' : '用户注册' }}</span>
          </div>
        </template>
        
        <el-form :model="form" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">{{ isLogin ? '登录' : '注册' }}</el-button>
            <el-button text @click="isLogin = !isLogin">
              去{{ isLogin ? '注册' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { login, register } from '../api';
  import { useUserStore } from '../stores/user';
  import { ElMessage } from 'element-plus';
  
  const router = useRouter();
  const userStore = useUserStore();
  const isLogin = ref(true);
  
  const form = reactive({
    username: '',
    password: ''
  });
  
  const handleSubmit = async () => {
    try {
      if (!form.username || !form.password) return ElMessage.warning('请填写完整信息');
  
      if (isLogin.value) {
        // 登录逻辑
        const res = await login(form);
        // 假设后端返回 res.data 包含 { username, token }
        // 注意：请根据实际后端返回结构调整，有的后端Token放在header里，文档说是data里
        const { token, username } = res.data; 
        userStore.setLoginInfo(token, username);
        ElMessage.success('登录成功');
        router.push('/dashboard');
      } else {
        // 注册逻辑
        await register(form);
        ElMessage.success('注册成功，请登录');
        isLogin.value = true;
      }
    } catch (error) {
      console.error(error);
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f2f5;
  }
  .box-card {
    width: 400px;
  }
  </style>