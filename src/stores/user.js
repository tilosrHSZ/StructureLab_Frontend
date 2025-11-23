import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '');
  const username = ref(localStorage.getItem('username') || '');
  // 1. 新增 name 状态 (尝试从本地取，取不到就为空)
  const name = ref(localStorage.getItem('name') || '');

  function setLoginInfo(newToken, newUsername, newName = '') {
    token.value = newToken;
    username.value = newUsername;
    // 如果登录接口没返回 name，暂时设为空或者和 username 一样
    name.value = newName; 
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    localStorage.setItem('name', newName);
  }

  // 2. 新增：单独更新用户信息的动作
  function updateUserInfo(newName) {
    if (newName) {
        name.value = newName;
        localStorage.setItem('name', newName);
    }
  }

  function logout() {
    token.value = '';
    username.value = '';
    name.value = '';
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
  }

  return { token, username, name, setLoginInfo, updateUserInfo, logout };
});