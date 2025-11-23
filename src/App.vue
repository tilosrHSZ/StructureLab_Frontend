<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- 路由出口：这里会根据网址自动显示 Login.vue 或 Dashboard.vue -->
  <RouterView />
</template>

<style>
:root {
  /* 主色：比如改成紫色 */
  --el-color-primary: #6295d3; 
  --el-color-success: #599f7c; 
  --el-color-danger: #d17373; 
}
/* 全局样式重置：确保页面能撑满屏幕，没有默认的白边 */
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
</style>