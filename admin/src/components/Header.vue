<template>
  <!-- <Logo/> -->
  <div class="header">
    <h1>Queueing System for COVID-19 Vaccination</h1>
    <div
      class="queueStatus"
      v-if="
        ['Dashboard', 'Queue', 'RecentlyServed', 'Vaccines'].indexOf(
          $route.name
        ) > -1
      "
    >
      <span><i :class="class"></i></span>
      <span>Queue is currently {{ text }}</span>
    </div>
  </div>
</template>

<script>
import Logo from "./Logo.vue";
export default {
  name: "Header",
  components: {
    Logo,
  },
  props: {
    isQueueClose: Boolean,
  },
  computed: {
    class() {
      if (this.isQueueClose == true) {
        return "fas fa-lock iconLock";
      } else {
        return "fas fa-unlock iconLock";
      }
    },
    text() {
      if (this.isQueueClose == true) {
        return "closed";
      } else {
        return "open";
      }
    },
  },
};
</script>
<style scoped>
.header {
  position: absolute;
  top: 0;
  right: 0;
  background: #008789;
  color: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2); /* Horizontal offset, Vertical offset , Blur , color*/
  padding: 1.2rem;
  height: 90px;
  text-align: center;
  margin-left: 280px;
  width: calc(100% - 280px);
  z-index: 10;
}

h1 {
  margin: 0;
  padding: 0;
}

.queueStatus {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 15px;
  right: 25px;
}
.queueStatus span {
  font-size: 1.2rem;
}
.iconLock {
  font-size: 1.5rem;
}

i {
  z-index: 100;
}

@media (max-width: 500px) {
  .lock {
    display: none;
  }
}
@media (max-width: 900px) {
  .lock {
    display: none;
  }
}
</style>
