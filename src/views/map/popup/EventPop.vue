<!--
 * @Author: daieh
 * @LastEditors: daieh
 * @Description: 
-->
<template>
  <div class="event-popup">
    自定义leaflet的popup弹框
  </div>
</template>

<script>
export default {
  name: 'EventPopup',
  props: {
    detail: {
      type: Object,
      default: () => { }
    }
  }
}
</script>

<style lang="scss" scoped>
.event-popup {
  background: #ff00f0;
  border-radius: 4px;
  width: 300px;
  height: 200px;
  padding: 16px;
  color: #fff;
  font-size: 20px;
}
</style>