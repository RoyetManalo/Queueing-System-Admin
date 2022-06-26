<template>
  <div class="nav-link">
    <ul>
      <li>
        <router-link to="/dashboard" class="router-link"
          ><i class="fas fa-box"></i>Dashboard</router-link
        >
      </li>
      <li>
        <router-link to="/queue" class="router-link"
          ><i class="far fa-user"></i>Queue</router-link
        >
      </li>
      <li>
        <router-link to="/recentlyserved" class="router-link"
          ><i class="fas fa-users"></i>Recently Served</router-link
        >
      </li>
      <li>
        <router-link to="/vaccines" class="router-link"
          ><i class="fas fa-syringe"></i>Vaccines</router-link
        >
      </li>
      <li>
        <router-link to="/adminscanqr" class="router-link"
          ><i class="fas fa-qrcode"></i>Scan QR</router-link
        >
      </li>
    </ul>
    <ul class="bottom-settings">
      <li @click="$emit('open-queue')">
        <i class="fas fa-play"></i>Open Queue
      </li>
      <li @click="$emit('close-queue')">
        <i class="fas fa-stop"></i>Close Queue
      </li>
      <li @click="$emit('reset-queue')">
        <i class="fas fa-redo-alt"></i>Reset Queue
      </li>

      <li @click="$emit('settings')"><i class="fas fa-gear"></i>Settings</li>

      <li @click="$emit('logout')">
        <i class="fas fa-sign-out-alt"></i>Log Out
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Navlink",
  emits: ["reset-queue", "open-queue", "close-queue", "logout", "settings"],
  methods: {
    logout() {
      this.$store.state.username = null; // use actions
      this.$store.state.token = null;
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
}

li {
  text-decoration: none;
  font-size: 1.5rem;
  text-align: left;
  margin-bottom: 1rem;
}
.router-link-active > i {
  color: #008789;
}
.router-link-active {
  color: #008789;
  background: #fff;
  padding: 1rem 0 1rem 1rem;
  border-radius: 30px 0 0 30px;
}

.router-link,
.bottom-settings li {
  display: grid;
  grid-template-columns: 1fr 4fr;
}
.nav-link {
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.bottom-settings li {
  font-size: 1.3rem;
}

i {
  color: #fff;
  margin-right: 1rem;
  font-size: 1.5rem;
}

a {
  color: #fff;
  text-decoration: none;
  display: block;
}
li {
  cursor: pointer;
}
</style>
