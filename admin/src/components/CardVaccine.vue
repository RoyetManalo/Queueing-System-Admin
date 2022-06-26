<template>
  <div class="card" :style="{ width: width }">
    <h1>{{ title }}</h1>
    <div class="title">
      <h3>{{ leftTitle }}</h3>
      <h3>{{ rightTitle }}</h3>
    </div>
    <div class="data-container">
      <div :key="data.id" v-for="data in data" class="data">
        <span>{{ data.vaccineBrand }}</span>
        <span>{{ data.vials }} vials</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboardcard",
  props: {
    data: Object,
    title: String,
    leftTitle: String,
    rightTitle: String,
    width: String,
  },
};
</script>
<style scoped>
.card {
  background: #fff;
  color: #008789;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2); /* Horizontal offset, Vertical offset , Blur , color*/
  padding: 20px;
  max-height: 800px;
  text-align: center;
}
h1 {
  margin-bottom: 2rem;
}

.data {
  font-size: 1.8rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: left;
  margin-bottom: 0.6rem;
}
.data span {
  margin-left: 2rem;
  text-align: center;
}

.title {
  font-size: 1.8rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: left;
  margin-bottom: 0.6rem;
}

.title h3 {
  margin-left: 2rem;
}
</style>
