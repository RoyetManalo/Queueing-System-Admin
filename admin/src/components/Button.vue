<template>
  <button :style="{ background: color }">{{ text }}</button>
</template>

<script>
export default {
  name: "Button",
  props: {
    text: String,
    color: String,
  },
};
</script>

<style scoped>
button {
  display: block;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  border: none;
  color: #fff;
  font-size: 1.3rem;
  cursor: pointer;
}
</style>
