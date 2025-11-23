<template>
  <div class="login-container">
    <div class="system-title">欢迎来到智能图库管理系统</div>
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
        <el-form-item label="手机号" v-if="!isLogin">
          <el-input v-model="form.phoneNum" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>

        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">{{ isLogin ? '登录' : '注册' }}</el-button>
          <el-button text @click="toggleMode">
            {{ isLogin ? '注册' : '登录' }}
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

// 表单数据增加 phoneNum
const form = reactive({
  username: '',
  password: '',
  phoneNum: '' 
});

// 切换模式时清空手机号
const toggleMode = () => {
  isLogin.value = !isLogin.value;
  form.phoneNum = '';
};

const handleSubmit = async () => {
  try {
    // 基础校验
    if (!form.username || !form.password) {
      return ElMessage.warning('请填写用户名和密码');
    }
    // 注册模式下的额外校验
    if (!isLogin.value && !form.phoneNum) {
      return ElMessage.warning('注册必须填写手机号');
    }

    if (isLogin.value) {
      // --- 登录逻辑 (参数不变) ---
      const res = await login({ 
        username: form.username, 
        password: form.password 
      });
      
      const { token, username } = res.data; 
      userStore.setLoginInfo(token, username);
      ElMessage.success('登录成功');
      router.push('/dashboard');

    } else {
      // 注册逻辑 
      // 这里直接传 form 即可，因为 form 里已经包含了 username, password, phoneNum
      await register(form);
      ElMessage.success('注册成功，请登录');
      
      // 注册成功后切换回登录页
      isLogin.value = true;
      form.phoneNum = ''; // 清空手机号
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.login-container {
  flex-direction: column; 
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #599f7c;
}

.system-title {
  font-size: 35px;
  font-weight: bold;
  color: #e6dcdc;
  margin-bottom: 50px;
  letter-spacing: 3px;
  text-shadow: 10px 10px 5px rgba(0, 0, 0, 0.1);
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}
.box-card {
  width: 400px;
  background-color: #ffffff;
}
</style>