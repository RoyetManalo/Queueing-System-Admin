<template>
  <button :style="{ background: color }">
    <i :class="class"></i>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    class: String,
    color: String,
  },
};
</script>

<style scoped>
button {
  display: block;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: none;
  color: #fff;
  font-size: 1.3rem;
  cursor: pointer;
}
</style>
