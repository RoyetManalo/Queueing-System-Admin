<template>
  <div id="app">
    <Header
      v-if="
        ['Dashboard', 'Queue', 'RecentlyServed', 'Vaccines'].indexOf(
          $route.name
        ) > -1
      "
      :isQueueClose="isQueueClose"
    />
    <router-view />
    <Sidenav
      v-if="
        ['Dashboard', 'Queue', 'RecentlyServed', 'Vaccines'].indexOf(
          $route.name
        ) > -1
      "
      @reset-queue="showResetQueueModal"
      @open-queue="showOpenQueueModal"
      @close-queue="showCloseQueueModal"
      @logout="showLogoutModal"
      @settings="showSettingsModal"
    />
  </div>
  <div class="resetModal" ref="resetModal">
    <div class="modal-content">
      <Button
        class="fa-solid fa-xmark closeBtn"
        color="red"
        @click="removeResetModal"
      />
      <h2 class="modal-title">To reset the queue put your credentials</h2>
      <form @submit.prevent="resetQueue" action="">
        <div class="errorMessage resetErrorMessage" ref="resetErrorMessage">
          <span>{{ errorMessage }}</span>
        </div>
        <input
          type="text"
          placeholder="Username"
          class="vaccineBrand form-input"
          v-model="username"
          required
        />
        <input
          type="password"
          autocomplete="current-password"
          placeholder="Password"
          class="vials form-input"
          v-model="password"
          required
        />
        <Button text="Reset" color="#008789" class="submitBtn" />
      </form>
    </div>
  </div>
  <div class="openQueueModal" ref="openQueueModal">
    <div class="modal-content">
      <Button
        class="fa-solid fa-xmark closeBtn"
        color="red"
        @click="removeOpenQueueModal"
      />
      <h2 class="modal-title">To open the queue put your credentials</h2>
      <form @submit.prevent="openQueue" action="">
        <div class="errorMessage openErrorMessage" ref="openErrorMessage">
          <span>{{ errorMessage }}</span>
        </div>
        <input
          type="text"
          placeholder="Username"
          class="vaccineBrand form-input"
          v-model="username"
          required
        />
        <input
          type="password"
          autocomplete="current-password"
          placeholder="Password"
          class="vials form-input"
          v-model="password"
          required
        />
        <Button text="Open Queue" color="#008789" class="submitBtn" />
      </form>
    </div>
  </div>
  <div class="closeQueueModal" ref="closeQueueModal">
    <div class="modal-content">
      <Button
        class="fa-solid fa-xmark closeBtn"
        color="red"
        @click="removeCloseQueueModal"
      />
      <h2 class="modal-title">To close the queue put your credentials</h2>
      <form @submit.prevent="closeQueue" action="">
        <div class="errorMessage closeErrorMessage" ref="closeErrorMessage">
          <span>{{ errorMessage }}</span>
        </div>
        <input
          type="text"
          placeholder="Username"
          class="vaccineBrand form-input"
          v-model="username"
          required
        />
        <input
          type="password"
          autocomplete="current-password"
          placeholder="Password"
          class="vials form-input"
          v-model="password"
          required
        />
        <Button text="Close Queue" color="#008789" class="submitBtn" />
      </form>
    </div>
  </div>
  <div class="messageModal" ref="messageModal">
    <div class="modal-content">
      <h2 class="modal-title">{{ message }}</h2>
      <div class="OkBtn">
        <Button
          text="OK"
          color="#008789"
          class="OkBtn"
          @click="removeMessageModal"
        />
      </div>
    </div>
  </div>
  <div class="logoutModal" ref="logoutModal">
    <div class="modal-content">
      <h2 class="modal-title">Are you sure you want to Log Out?</h2>
      <div class="logoutBtn">
        <Button text="Yes" color="#008789" class="OkBtn" @click="logout" />
        <Button
          text="No"
          color="#008789"
          class="OkBtn"
          @click="removeLogoutModal"
        />
      </div>
    </div>
  </div>
  <div class="settingsModal" ref="settingsModal">
    <div class="modal-content">
      <Button
        class="fa-solid fa-xmark closeBtn"
        color="red"
        @click="removeSettingsModal"
      />
      <h2 class="modal-title">Change Username and Password</h2>
      <form @submit.prevent="changeCredentials">
        <div
          class="errorMessage settingsErrorMessage"
          ref="settingsErrorMessage"
        >
          <span>{{ errorMessage }}</span>
        </div>
        <input
          type="text"
          placeholder="Username"
          class="form-input"
          v-model="changeUsername"
          required
        />
        <input
          type="password"
          placeholder="Password"
          class="form-input"
          v-model="changePassword"
          required
        />
        <input
          type="password"
          placeholder="Verify Password"
          class="form-input"
          v-model="changeVerifyPassword"
          required
        />
        <Button text="Submit" color="#008789" class="mt-2" />
      </form>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Sidenav from "@/components/Sidenav.vue";
import CloseButton from "@/components/CloseButton.vue";
import Button from "@/components/Button.vue";
import StatusService from "./services/StatusService";
import AdminService from "./services/AdminService";
import QueueService from "./services/QueueService";
export default {
  components: {
    Header,
    Sidenav,
    CloseButton,
    Button,
  },
  data() {
    return {
      username: "",
      password: "",
      message: "",
      error: "",
      errorMessage: "",
      isQueueClose: "",
      changeUsername: "",
      changePassword: "",
      changeVerifyPassword: "",
    };
  },
  methods: {
    showResetQueueModal() {
      this.$refs.resetModal.style.display = "block";
    },
    showOpenQueueModal() {
      this.$refs.openQueueModal.style.display = "block";
      // this.$refs.statusModal.style.display = "none";
    },
    showCloseQueueModal() {
      this.$refs.closeQueueModal.style.display = "block";
    },
    showMessageModal() {
      this.$refs.messageModal.style.display = "block";
    },
    removeMessageModal() {
      this.$refs.messageModal.style.display = "none";
    },
    removeOpenQueueModal() {
      this.$refs.openQueueModal.style.display = "none";
      this.username = "";
      this.password = "";
    },
    removeCloseQueueModal() {
      this.$refs.closeQueueModal.style.display = "none";
      this.username = "";
      this.password = "";
    },
    removeResetModal() {
      this.$refs.resetModal.style.display = "none";
      this.username = "";
      this.password = "";
    },
    showLogoutModal() {
      this.$refs.logoutModal.style.display = "block";
    },
    removeLogoutModal() {
      this.$refs.logoutModal.style.display = "none";
    },
    showSettingsModal() {
      this.$refs.settingsModal.style.display = "block";
    },
    removeSettingsModal() {
      this.$refs.settingsModal.style.display = "none";
      this.changeUsername = "";
      this.changePassword = "";
      this.changeVerifyPassword = "";
    },

    openErrorMessageVisible() {
      this.errorMessage = "Wrong Crendentials";
      this.$refs.openErrorMessage.style.visibility = "visible";
      setTimeout(() => {
        this.$refs.openErrorMessage.style.visibility = "hidden";
      }, 3000);
    },
    closeErrorMessageVisible() {
      this.errorMessage = "Wrong Crendentials";
      this.$refs.closeErrorMessage.style.visibility = "visible";
      setTimeout(() => {
        this.$refs.closeErrorMessage.style.visibility = "hidden";
      }, 3000);
    },
    resetErrorMessageVisible() {
      this.errorMessage = "Wrong Crendentials";
      this.$refs.resetErrorMessage.style.visibility = "visible";
      setTimeout(() => {
        this.$refs.resetErrorMessage.style.visibility = "hidden";
      }, 3000);
    },
    settingsErrorMessageVisible() {
      this.errorMessage = "Password not match";
      this.$refs.settingsErrorMessage.style.visibility = "visible";
      setTimeout(() => {
        this.$refs.settingsErrorMessage.style.visibility = "hidden";
      }, 3000);
    },

    async openQueue() {
      const res = await AdminService.compareCredentials(
        this.username,
        this.password
      );
      const data = res.data;
      if (data.status === "ERROR" && data.error === "Cannot Find Username") {
        return this.openErrorMessageVisible();
      }

      if (data.status === "ERROR" && data.error === "Wrong Username/Password") {
        return this.openErrorMessageVisible();
      }

      if (data.status === "OK") {
        await StatusService.changeStatus(false); // use  store actions idk
        this.removeOpenQueueModal();
        this.username = "";
        this.password = "";
        const statusRes = await StatusService.getStatus();
        const statusData = statusRes.data;
        const queueStatus = statusData[0].status;
        this.isQueueClose = queueStatus;
        this.showMessageModal();
        this.message = "The Queue is officially open";
      }
    },
    async closeQueue() {
      const res = await AdminService.compareCredentials(
        this.username,
        this.password
      );
      const data = res.data;
      if (data.status === "ERROR" && data.error === "Cannot Find Username") {
        return this.closeErrorMessageVisible();
      }

      if (data.status === "ERROR" && data.error === "Wrong Username/Password") {
        return this.closeErrorMessageVisible();
      }

      if (data.status === "OK") {
        await StatusService.changeStatus(true); // use  store actions idk
        this.removeCloseQueueModal();
        this.username = "";
        this.password = "";
        const statusRes = await StatusService.getStatus();
        const statusData = statusRes.data;
        const queueStatus = statusData[0].status;
        this.isQueueClose = queueStatus;
        this.showMessageModal();
        this.message = "The Queue is officially closed";
      }
    },
    async resetQueue() {
      const res = await AdminService.compareCredentials(
        this.username,
        this.password
      );
      const data = res.data;
      if (data.status === "ERROR" && data.error === "Cannot Find Username") {
        return this.resetErrorMessageVisible();
      }

      if (data.status === "ERROR" && data.error === "Wrong Username/Password") {
        return this.resetErrorMessageVisible();
      }

      if (data.status === "OK") {
        // use  store actions
        this.$store.dispatch("resetQueue");
        this.removeCloseQueueModal();
        this.username = "";
        this.password = "";
        this.showMessageModal();
        this.message = "The Queue has been officially reset";
      }
    },

    async changeCredentials() {
      if (this.changePassword !== this.changeVerifyPassword) {
        return this.settingsErrorMessageVisible();
      }

      if (
        this.changeUsername !== null ||
        this.changePassword === this.changeVerifyPassword
      ) {
        await AdminService.changeCredentials(
          this.changeUsername,
          this.changePassword
        );
        this.removeSettingsModal();
        this.changeUsername = "";
        this.changePassword = "";
        this.changeVerifyPassword = "";
        this.showMessageModal();
        this.message = "You Successfully Change Your Credentials";
      }
    },
    logout() {
      this.$store.state.username = null; // use actions
      this.$store.state.token = null;
      localStorage.clear();
      this.removeLogoutModal();
      this.$router.push("/");
    },
  },
  async created() {
    try {
      const statusRes = await StatusService.getStatus();
      const statusData = statusRes.data;
      const queueStatus = statusData[0].status;
      this.isQueueClose = queueStatus;
    } catch (err) {
      this.error = err.message;
    }
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* overflow: hidden; */
}

#app {
  width: 100vw;
  height: 100vh;
}

.resetModal,
.openQueueModal,
.closeQueueModal,
.messageModal,
.logoutModal,
.settingsModal {
  display: none;
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: auto;
  background: rgba(0, 0, 0, 0.5);
}
.statusModal {
  display: block;
  position: fixed;
  z-index: 10;
  right: 0;
  top: 0;
  height: 100%;
  width: calc(100% - 280px);
  overflow: auto;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  width: 35%;
  margin: 13% auto;
  background: #fff;
  padding-top: 2rem;
  padding-bottom: 10px;
  border-radius: 10px;
}

.modal-title {
  text-align: center;
  color: #008789;
  font-size: 2rem;
  margin-bottom: 1rem;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #008789;
  opacity: 1; /* Firefox */
}

.form-input {
  padding: 1rem;
  color: #008789;
  border: none;
  border-bottom: solid 2px #008789;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.form-input:focus {
  outline: none;
}

form {
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: 2rem auto;
  margin-bottom: 0;
}

.submitBtn {
  align-self: flex-end;
}

.closeBtn {
  position: absolute;
  top: 10px;
  right: 10px;
}

.OkBtn {
  display: flex;
  justify-content: center;
}

.logoutBtn {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.settingsModal p {
  text-align: center;
  color: #008789;
  font-size: 1.2rem;
}

.mt-2 {
  margin-top: 2rem;
}

.openErrorMessage,
.closeErrorMessage,
.resetErrorMessage,
.settingsErrorMessage {
  visibility: hidden;
}
.errorMessage {
  text-align: center;
  margin-bottom: 1rem;
}
.errorMessage span {
  color: red;
  padding: 10px;
}
</style>
