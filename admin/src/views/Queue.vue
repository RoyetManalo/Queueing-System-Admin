<template>
  <div class="queue">
    <div class="content">
      <div class="left">
        <CardNumber
          title="Currenlty Queue Number in Service"
          class="CurrentQueue"
          :data="this.$store.state.currentQueue"
        />
        <CardNumber
          title="Total People in Queue"
          :data="totalPeopleInQueue"
          class="TotalQueue"
        />
      </div>
      <div class="right">
        <CardQueue
          title="People Currently in Queue"
          :recentlyServed="recentlyServed"
          @view-full-list="viewFullList"
        />
      </div>
    </div>
  </div>
  <div class="queueModal" ref="queueModal">
    <div class="modal-content">
      <Button
        class="fa-solid fa-xmark closeModal"
        color="red"
        @click="closeModal"
      />
      <h2 class="modal-title">Full List of People In Queue</h2>
      <div id="search" class="search">
        <input
          type="text"
          placeholder="Search name..."
          class="searchInput searchElement"
          v-model="searchPerson"
        />
      </div>
      <div class="title">
        <span></span>
        <span>Queue Number</span>
        <span>Full Name</span>
        <span>Vaccine</span>
      </div>
      <div class="queue-content">
        <div class="data-container">
          <div
            :key="person._id"
            v-for="person in queueSearchResult"
            class="data"
          >
            <input
              type="checkbox"
              :value="person"
              class="checkbox"
              :style="checkboxStyle"
              ref="checkboxes"
              v-model="checkedNames"
            />

            <span>{{ person.queueNumber }}</span>
            <span>{{ person.firstName }} {{ person.lastName }}</span>
            <span>{{ person.vaccineBrand }}</span>
          </div>
        </div>
      </div>
      <div class="buttons" ref="buttons">
        <Button
          text="Move Person to Missed Queue"
          color="#008789"
          @click="displayMoveOptions"
        />
        <Button
          class="fas fa-trash deleteIcon"
          color="red"
          @click="displayDeleteOptions"
        />
      </div>
      <div class="deleteOptions" ref="deleteOptions">
        <Button text="Select All" color="#008789" @click="checkedAll" />
        <Button text="Deselect All" color="#ffb533" @click="uncheckedAll" />
        <Button text="Delete" color="red" @click="deleteAllChecked" />
        <Button text="Cancel" color="purple" @click="removeDeleteOptions" />
      </div>
      <div class="moveOptions" ref="moveOptions">
        <Button text="Select All" color="#008789" @click="checkedAll" />
        <Button text="Deselect All" color="#ffb533" @click="uncheckedAll" />
        <Button text="Move" color="red" @click="moveAllChecked" />
        <Button text="Cancel" color="purple" @click="removeMoveOptions" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CardQueue from "../components/CardQueue.vue";
import CardNumber from "../components/CardNumber.vue";
import Button from "../components/Button.vue";
import IconButton from "../components/IconButton.vue";
import CloseButton from "../components/CloseButton.vue";
import QueueService from "../services/QueueService";
export default {
  name: "Queue",
  components: {
    Button,
    IconButton,
    CloseButton,
    CardQueue,
    CardNumber,
  },
  data() {
    return {
      recentlyServed: true,
      searchPerson: "",
      currentQueue: null,
      isDeleteClicked: false,
      checkedNames: [],
      moveQueueNames: [],
      isCheckedAll: false,
    };
  },
  methods: {
    viewFullList() {
      this.$refs.queueModal.style.display = "block";
    },
    closeModal() {
      this.$refs.queueModal.style.display = "none";
      this.isDeleteClicked = false;
      this.$refs.buttons.style.display = "flex";
      this.$refs.deleteOptions.style.display = "none";
      this.$refs.moveOptions.style.display = "none";
      this.checkedNames = [];
    },
    displayDeleteOptions() {
      this.isDeleteClicked = true;
      this.$refs.buttons.style.display = "none";
      this.$refs.deleteOptions.style.display = "grid";
      // When this is pop up cursor: pointer
    },
    removeDeleteOptions() {
      this.isDeleteClicked = false;
      this.$refs.buttons.style.display = "flex";
      this.$refs.deleteOptions.style.display = "none";
      // this.$refs.chexboxes.style.checked = "false";
      this.checkedNames = [];
    },
    displayMoveOptions() {
      this.isDeleteClicked = true;
      this.$refs.buttons.style.display = "none";
      this.$refs.moveOptions.style.display = "grid";
    },
    removeMoveOptions() {
      this.isDeleteClicked = false;
      this.$refs.buttons.style.display = "flex";
      this.$refs.moveOptions.style.display = "none";
      this.checkedNames = [];
    },
    checkedAll() {
      this.isCheckedAll = true;
      if (this.isCheckedAll) {
        this.checkedNames = [];
        this.queueSearchResult.forEach((person) => {
          this.checkedNames.push(person);
        });
        console.log(this.queueSearchResult);
      } else {
        this.checkedNames = [];
      }
    },
    uncheckedAll() {
      this.checkedNames = [];
    },
    async deleteAllChecked() {
      // put this in the store and remove the person in the array and make a watcher for the loading shits
      const IDS = this.checkedNames.map((name) => name._id);
      this.$store.dispatch("deleteMultipleQueue", IDS);
    },

    async moveAllChecked() {
      this.$store.dispatch("movePeopleInMissedQueue", this.checkedNames);
      const IDS = this.checkedNames.map((name) => name._id);
      this.$store.dispatch("deleteMultipleQueue", IDS);
    },
  },

  watch: {
    getPeopleInQueue(val, oldVal) {
      // is triggered whenever the store state changes

      const currentQueue =
        this.$store.getters.getPeopleInQueue[0] === undefined
          ? 0
          : this.$store.getters.getPeopleInQueue[0].queueNumber;
      this.$store.dispatch("fetchCurrentQueue", currentQueue);

      // this.currentQueue = this.$store.state.peopleInQueue[0].queueNumber;
    },
  },
  computed: {
    totalPeopleInQueue: {
      get() {
        return this.$store.state.peopleInQueue.length;
      },
    },
    getPeopleInQueue() {
      return this.$store.state.peopleInQueue;
    },

    //  :data="$store.getters.getCurrentPersonInQueue"

    queueSearchResult() {
      return this.$store.getters.getPeopleInQueue
        .map((person) => ({
          ...person,
          fullName: `${person.firstName} ${person.lastName}`,
        }))
        .filter((person) => {
          return (
            !this.searchPerson ||
            person.fullName
              .toLowerCase()
              .indexOf(this.searchPerson.toLowerCase()) > -1
          );
        });
    },
    checkboxStyle() {
      return { visibility: this.isDeleteClicked ? "visible" : "hidden" };
    },
  },
  async created() {
    this.$store.dispatch("fetchPeopleInQueue");
  },
};
</script>

<style scoped>
.queue {
  position: absolute;
  top: 90px;
  left: 280px;
  background: #e7f3eb;
  width: calc(100% - 280px);
  height: calc(100% - 90px);
  z-index: 10;
  padding: 3rem 5rem;
}

.content {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}
.left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.queueModal {
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
  width: 50%;
  position: relative;
  margin: 5% auto;
  background: #fff;
  padding: 2rem 0;
  border-radius: 10px;
  max-height: 820px;
}

.modal-title {
  text-align: center;
  color: #008789;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.title,
.data {
  display: grid;
  grid-template-columns: 80px 0.6fr 1fr 1fr;
  justify-items: center;
  text-align: center;
}

.title span {
  font-size: 1.8rem;
  color: #008789;
  margin-bottom: 0.5rem;
  text-align: center;
  font-weight: 800;
}
.data span {
  font-size: 1.5rem;
  color: #008789;
  margin-bottom: 0.5rem;
}

::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #008789;
  opacity: 1; /* Firefox */
}
.search {
  padding: 0 4rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
}

.searchInput {
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
  color: #008789;
  border: none;
  border-bottom: 1px solid #008789;
}

.searchInput:focus {
  outline: none;
}

.closeModal {
  position: absolute;
  top: 10px;
  right: 10px;
}

.queue-content {
  overflow-y: auto;
  height: 560px;
}

.buttons {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.deleteOptions,
.moveOptions {
  display: none;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 2rem;
  padding: 1.2rem 5rem;
}
.checkbox {
  visibility: hidden;
  margin-top: 0.5rem;
  width: 25px;
  height: 25px;
}

.deleteIcon {
  display: block;
}
</style>
