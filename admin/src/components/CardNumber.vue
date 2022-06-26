<template>
  <div class="card">
    <h1>{{ title }}</h1>
    <h1 class="data">{{ data }}</h1>
  </div>
</template>

<script>
export default {
  name: "Dashboardcard",
  props: {
    data: Number,
    title: String,
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
  min-height: 300px;
  text-align: center;
  width: 400px;
  height: 45%;
  /* margin-left: 15%; */
}

.name {
  font-size: 2rem;
  text-align: left;
}
h1 {
  margin-bottom: 2rem;
}

.data {
  font-size: 5rem;
  margin: 4rem 0;
}
</style>
