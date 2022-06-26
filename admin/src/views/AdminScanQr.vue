<template>
  <Header class="header" />
  <div class="adminScanQr">
    <h1>Scan Qr Code</h1>
    <QrScanner @qr-data="scanQr" />
    <div class="btn">
      <router-link to="/dashboard"
        ><Button color="#008789" text="Cancel Scan" class="btn"
      /></router-link>
    </div>
  </div>
  <div class="adminScanQrModal" ref="adminScanQr">
    <div class="modal-content">
      <div class="title">
        <div>
          <h2>You're on the queue!</h2>
        </div>
      </div>
      <div class="details">
        <div>
          <span>Full Name: {{ fullName }}</span>
          <span>Queue Number: {{ queueNumber }}</span>
        </div>
      </div>
      <div class="btn">
        <Button
          color="#008789"
          text="Move To Recently Served"
          @click="closeModal"
        />
      </div>
    </div>
  </div>
  <div class="wrongOrderModal" ref="wrongOrderModal">
    <div class="modal-content">
      <div class="title-wrongOrder">
        <div>
          <h2>Sorry, {{ fullName }}</h2>
          <h2>but you skipped someone in the queue</h2>
        </div>
      </div>
      <div class="details">
        <div>
          <span>Current Queue Number: {{ currentQueue }} </span>
          <span>Your Queue Number: {{ queueNumber }} </span>
          <span>Full Name: {{ fullName }}</span>
        </div>
      </div>
      <div class="btn">
        <Button
          color="#008789"
          text="Ok"
          @click="closeWrongOrderModal"
          class="btn"
        />
      </div>
    </div>
  </div>
  <div class="behindQueueModal" ref="behindQueueModal">
    <div class="modal-content-behind">
      <div class="title-wrongOrder">
        <div>
          <h2>Sorry, {{ fullName }}</h2>
          <h2>but you missed the queue, ask the admin for help</h2>
        </div>
      </div>
      <div class="details">
        <div>
          <span>Current Queue Number: {{ currentQueue }} </span>
          <span>Your Queue Number: {{ queueNumber }} </span>
          <span>Full Name: {{ fullName }}</span>
        </div>
      </div>
      <div class="btn">
        <Button
          color="#008789"
          text="Ok"
          @click="closeBehindQueueModal"
          class="btn"
        />
      </div>
    </div>
  </div>
</template>

<script>
import QrScanner from "../components/QRScanner.vue";
import Button from "../components/Button.vue";
import Header from "../components/Header.vue";
import QueueService from "../services/QueueService";
import RecentlyServedService from "../services/RecentlyServedService";
export default {
  name: "AdminScanQr",
  components: {
    QrScanner,
    Button,
    Header,
  },
  data() {
    return {
      fullName: null,
      queueNumber: null,
      currentQueue: null,
      data: {},
      totalPeopleBeenServed: 0,
    };
  },
  methods: {
    scanQr(data) {
      //   Check if qr is valid
      const currentQueue = this.getCurrentQueueNumber;
      this.currentQueue = currentQueue;
      this.fullName = `${data.firstName} ${data.lastName}`;
      this.queueNumber = data.queueNumber;
      this.data = data;
      console.log("Current Queue Number" + currentQueue);
      console.log("Your Queue Number" + data.queueNumber);
      if (currentQueue == data.queueNumber) {
        this.showModal();
      } else if (currentQueue > data.queueNumber) {
        this.showBehindQueueModal();
      } else {
        this.showWrongOrderModal();
      }
      // this.showModal();
    },
    closeModal() {
      this.moveToRecentlyServed();
      this.$refs.adminScanQr.style.display = "none";
    },
    closeWrongOrderModal() {
      this.$refs.wrongOrderModal.style.display = "none";
    },
    showModal() {
      this.$refs.adminScanQr.style.display = "block";
    },
    showWrongOrderModal() {
      this.$refs.wrongOrderModal.style.display = "block";
    },
    showBehindQueueModal() {
      this.$refs.behindQueueModal.style.display = "block";
    },
    closeBehindQueueModal() {
      this.$refs.behindQueueModal.style.display = "none";
    },
    async moveToRecentlyServed() {
      //    Delete person in queue
      //    Add person details in recently Served
      // console.log(JSON.stringify(this.data, null, 2))
      const data = JSON.parse(JSON.stringify(this.data, null, 2));
      const id = data._id;
      const queueNumber = data.queueNumber;
      await RecentlyServedService.insertRecentlyServed(
        id,
        data.firstName,
        data.lastName,
        data.age,
        data.vaccineBrand,
        data.dose,
        data.date,
        localStorage.getItem("token")
      );
      await QueueService.deleteQueue(id, localStorage.getItem("token")); // put in the store actions
    },
  },
  computed: {
    getCurrentQueueNumber() {
      return this.$store.state.currentQueue;
    },
    getPeopleInQueue() {
      return this.$store.state.peopleInQueue;
    },
  },
  watch: {
    getPeopleInQueue(val, oldVal) {
      const currentQueue =
        this.$store.getters.getPeopleInQueue[0] === undefined
          ? 0
          : this.$store.getters.getPeopleInQueue[0].queueNumber;
      this.$store.dispatch("fetchCurrentQueue", currentQueue);
    },
  },
  created() {
    this.$store.dispatch("fetchPeopleInQueue");
  },
};
</script>

<style scoped>
.header {
  width: 100%;
}
.adminScanQr {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  text-align: center;
  padding-top: 4rem;
}
.btn {
  padding-left: 2rem;
  padding-right: 2rem;
  align-self: center;
}
a {
  text-decoration: none;
}
h1 {
  color: #008385;
}

.adminScanQrModal,
.wrongOrderModal,
.behindQueueModal {
  display: none;
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  width: 550px;
  position: relative;
  height: 50%;
  margin: 10rem auto;
  background: #fff;
  padding: 2rem 0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.modal-content-behind {
  width: 580px;
  position: relative;
  height: 50%;
  margin: 10rem auto;
  background: #fff;
  padding: 2rem 0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.details span {
  display: block;
  text-align: left;
  margin: 1rem 0;
  font-size: 1.6rem;
  color: #008385;
}

.title h2 {
  color: #008385;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: left;
}

.title,
.details {
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-wrongOrder h2 {
  text-align: center;
  margin-bottom: 0.2rem;
  color: #008385;
  font-size: 1.6rem;
}

.btn {
  padding: 1 2rem;
}
</style>
