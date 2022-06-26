<template>
  <div class="adminLogin">
    <div class="left">
      <h1 class="title">
        Santa Elena Health Center <br />
        QR-Base Queueing System
      </h1>
      <img :src="imgURL" :alt="imgURL" />
    </div>
    <div class="right">
      <h1>Admin Login</h1>

      <form action="" @submit.prevent="login">
        <div class="errorMessage" ref="errorMessage">
          <span>{{ errorMessage }}</span>
        </div>
        <input
          type="text"
          id="userName"
          placeholder="Username"
          v-model="username"
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          v-model="password"
          required
        />
        <Button text="Login" color="#008789" class="loginBtn" />
        <a href="#">Forgot Password?</a>
      </form>
      <footer>
        <p>Copyright &copy; 2022</p>
        <p>A project by Royet Manalo</p>
      </footer>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Button from "../components/Button.vue";
import AdminService from "../services/AdminService";
import QueueService from "../services/QueueService";
export default {
  name: "AdminLogin",
  components: {
    Button,
  },
  data() {
    return {
      username: null,
      password: null,
      imgURL: "",
      isLogin: true,
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      // Send request to api to check for admin credentials
      const res = await AdminService.compareCredentials(
        this.username,
        this.password
      );
      const data = res.data;
      // Check for response
      if (data.status === "ERROR" && data.error === "Cannot Find Username") {
        return this.cannoFindUsername();
      }

      if (data.status === "ERROR" && data.error === "Wrong Username/Password") {
        return this.wrongPassword();
      }

      if (data.status === "OK") {
        // Get token
        const token = res.data.token;
        localStorage.setItem("token", token);
        this.routeToDashboard();
      }
      // this.$store.state.username = this.username;
      // this.$store.state.token = this.token;
      // this.$router.push("/dashboard");
      // this.$emit("is-login", this.isLogin);
    },
    errorMessageVisible() {
      this.$refs.errorMessage.style.visibility = "visible";
      setTimeout(() => {
        this.$refs.errorMessage.style.visibility = "hidden";
      }, 3000);
    },
    cannoFindUsername() {
      console.log("Cannot Find Username");
      this.errorMessage = "Cannot Find Username";
      this.errorMessageVisible();
    },
    wrongPassword() {
      console.log("Wrong Password");
      this.errorMessage = "Wrong Password";
      this.errorMessageVisible();
    },
    routeToDashboard() {
      this.$store.state.username = this.username; // use actions
      this.$store.state.token = localStorage.getItem("token"); // use actions
      this.$router.push("/dashboard");
      this.$emit("is-login", this.isLogin);
    },
  },
  created() {
    this.imgURL = require("../assets/SECH LOGO.png");
  },
};
</script>

<style scoped>
.adminLogin {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  width: 100%;
  height: 100%;
}

img {
  width: 500px;
  margin-top: 5rem;
}
.left {
  background: #008789;
  color: #fff;
  text-align: center;
  padding: 3rem;
}
.right {
  background: #fff;
  color: #008789;
  text-align: center;
  padding: 3rem 0;
  position: relative;
}

.right form {
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 0 auto;
  margin-top: 5rem;
}

.right form input {
  padding: 1rem;
  font-size: 1.2rem;
  border: none;
  border-bottom: 2px solid #008789;
  margin-bottom: 1rem;
  color: #008789;
}
.right form input:focus {
  outline: none;
}

::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #008789;
  opacity: 1; /* Firefox */
}

footer {
  position: absolute;
  bottom: 10%;
  left: 45%;
}
.loginBtn {
  align-self: flex-end;
  margin-top: 1rem;
}

.title {
  font-size: 3rem;
}

a {
  color: #008789;
  text-decoration: none;
  align-self: flex-start;
}

.errorMessage {
  margin-bottom: 1rem;
  visibility: hidden;
}
.errorMessage span {
  color: red;
  padding: 10px;
}
</style>
