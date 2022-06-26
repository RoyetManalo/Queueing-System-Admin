<template>
  <div class="card">
    <h1>{{ title }}</h1>
    <div class="title">
      <span>Queue Number</span>
      <span>Full Name</span>
      <span>Vaccine</span>
    </div>
    <div class="data-container">
      <div :key="data.id" v-for="data in limitedPeopleInQueue" class="data">
        <span>{{ data.queueNumber }}</span>
        <span>{{ data.firstName }} {{ data.lastName }}</span>
        <span>{{ data.vaccineBrand }}</span>
      </div>
    </div>
    <div class="buttons" v-show="recentlyServed">
      <Button
        text="View Full List"
        color="#008789"
        @click="$emit('view-full-list')"
      />
    </div>
  </div>
</template>

<script>
import Button from "./Button.vue";
export default {
  name: "Dashboardcard",
  props: {
    title: String,
    recentlyServed: Boolean,
  },
  components: {
    Button,
  },
  computed: {
    limitedPeopleInQueue() {
      return this.$store.getters.getLimitedQueuePeople;
    },
  },
  created() {
    this.$store.dispatch("fetchLimitedPeopleInQueue");
  },
};
</script>
<style scoped>
.card {
  background: #fff;
  color: #008789;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2); /* Horizontal offset, Vertical offset , Blur , color*/
  min-height: 200px;
  padding: 20px;
  min-height: 700px;
  text-align: center;
  width: 700px;
  position: relative;
}

span {
  font-size: 5rem;
  text-align: center;
}
h1 {
  margin-bottom: 2rem;
}

.data,
.title {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
}

.data {
  margin-bottom: 0.8rem;
}

.title span {
  font-size: 1.8rem;
  font-weight: 800;
}
.title {
  margin-bottom: 0.8rem;
}
.data span {
  font-size: 1.5rem;
  text-align: left;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 3rem;
  margin-right: 3.5rem;
  position: absolute;
  bottom: 10px;
  right: 0;
}
</style>
