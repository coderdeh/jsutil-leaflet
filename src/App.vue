<!--
 * @Author: daieh
 * @LastEditors: daieh
 * @Description: 
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  provide () {
    return {
      app: this
    }
  }
};
</script>

<style lang="scss" scoped>
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>