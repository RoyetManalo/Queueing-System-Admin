<template>
  <div class="side-nav">
    <Logo />
    <Navlink
      @reset-queue="$emit('reset-queue')"
      @open-queue="$emit('open-queue')"
      @close-queue="$emit('close-queue')"
      @logout="$emit('logout')"
      @settings="$emit('settings')"
    />
  </div>
</template>

<script>
import Navlink from "./Navlink.vue";
import Logo from "./Logo.vue";
export default {
  components: {
    Navlink,
    Logo,
  },
};
</script>
<style scoped>
.side-nav {
  position: absolute;
  left: 0;
  top: 0;
  background: #008789;
  color: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2); /* Horizontal offset, Vertical offset , Blur , color*/
  padding: 20px;
  padding-top: 9rem;
  padding-right: 0;
  width: 280px;
  height: 100vh;
  z-index: 3;
}
</style>
