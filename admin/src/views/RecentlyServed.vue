<template>
  <div class="dashboard">
    <div class="content">
      <div class="left">
        <CardRecentlyServed
          title="List of People Recently Served"
          :recentlyServed="recentlyServed"
          @view-full-list="viewFullList"
          @view-missed-list="viewMissedList"
        />
      </div>
      <div class="right">
        <CardNumber
          title="Total People have been Served"
          :data="totalPeopleBeenServed"
        />
        <CardNumber
          title="Total People that missed queue"
          :data="totalPeopleMissedQueue"
        />
        <!-- <CardNumber title='Total Population' :data="totalPopulation"/> -->
      </div>
    </div>
  </div>
  <div class="recentlyServedModal" ref="recentlyServedModal">
    <div class="modal-content">
      <Button
        class="fa-solid fa-xmark closeModal"
        color="red"
        @click="closeModal"
      />
      <h2 class="modal-title">Full List of People Been Served</h2>
      <div id="search" class="search">
        <input
          type="text"
          placeholder="Search name..."
          class="searchInput"
          v-model="searchPerson"
        />
      </div>
      <div class="title">
        <span>Full Name</span>
        <span>Vaccine</span>
      </div>
      <div class="queue-content">
        <div class="data-container">
          <div
            :key="person._id"
            v-for="person in recentlyServedSearchResult"
            class="data"
          >
            <span>{{ person.firstName }} {{ person.lastName }}</span>
            <span>{{ person.vaccineBrand }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="missedModal" ref="missedModal">
    <div class="modal-content">
      <Button
        class="fa-solid fa-xmark closeModal"
        color="red"
        @click="closeMissedModal"
      />
      <h2 class="modal-title">Full List of People That Missed Queue</h2>
      <div id="search" class="search">
        <input
          type="text"
          placeholder="Search name..."
          class="searchInput"
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
            v-for="person in missedQueueSearchResult"
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
      <div class="button" ref="button">
        <Button
          text="Move Back To Queue"
          color="#008789"
          @click="showMoveBackOptions"
        />
      </div>
      <div class="moveBackOptions" ref="moveBackOptions">
        <Button text="Select All" color="#008789" @click="checkedAll" />
        <Button text="Deselect All" color="#ffb533" @click="uncheckedAll" />
        <Button text="Move Back" color="red" @click="moveBackAllChecked" />
        <Button text="Cancel" color="purple" @click="closeMoveBackOptions" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CardRecentlyServed from "../components/CardRecentlyServed.vue";
import CardNumber from "../components/CardNumber.vue";
import RecentlyServedService from "../services/RecentlyServedService";
import Button from "../components/Button.vue";
import CloseButton from "../components/CloseButton.vue";
export default {
  name: "Dashboard",
  components: {
    CardRecentlyServed,
    CardNumber,
    Button,
    CloseButton,
  },
  data() {
    return {
      recentlyServed: true,
      searchPerson: "",
      isMoveBackClicked: false,
      checkedNames: [],
    };
  },
  methods: {
    viewFullList() {
      this.$refs.recentlyServedModal.style.display = "block";
    },
    closeModal() {
      this.$refs.recentlyServedModal.style.display = "none";
    },
    viewMissedList() {
      this.$refs.missedModal.style.display = "block";
    },
    closeMissedModal() {
      this.checkedNames = [];
      this.isMoveBackClicked = false;
      this.$refs.missedModal.style.display = "none";
      this.$refs.moveBackOptions.style.display = "none";
      this.$refs.button.style.display = "flex";
    },
    showMoveBackOptions() {
      this.isMoveBackClicked = true;
      this.$refs.button.style.display = "none";
      this.$refs.moveBackOptions.style.display = "grid";
    },
    closeMoveBackOptions() {
      this.checkedNames = [];
      this.isMoveBackClicked = false;
      this.$refs.moveBackOptions.style.display = "none";
      this.$refs.button.style.display = "flex";
    },
    checkedAll() {
      this.isCheckedAll = true;
      if (this.isCheckedAll) {
        this.checkedNames = [];
        this.missedQueueSearchResult.forEach((person) => {
          this.checkedNames.push(person);
        });
      } else {
        this.checkedNames = [];
      }
    },
    uncheckedAll() {
      this.checkedNames = [];
    },
    async moveBackAllChecked() {
      this.$store.dispatch("insertMultipleQueue", this.checkedNames);
      const IDS = this.checkedNames.map((name) => name._id);
      this.$store.dispatch("deleteMultipleMissedQueue", IDS);
    },
  },
  props: {
    finalTotalPeopleBeenServed: Number,
  },
  computed: {
    totalPeopleBeenServed: {
      get() {
        return this.$store.state.recentlyServedPeople.length;
      },
    },
    totalPeopleMissedQueue() {
      return this.$store.state.missedQueuePeople.length;
    },
    recentlyServedSearchResult() {
      return this.$store.state.recentlyServedPeople
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
    missedQueueSearchResult() {
      return this.$store.getters.getMissedQueuePeople
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
      return { visibility: this.isMoveBackClicked ? "visible" : "hidden" };
    },
  },
  created() {
    this.$store.dispatch("fetchRecentlyServedPeople");
    this.$store.dispatch("fetchMissedQueuePeople");
  },
};
</script>

<style scoped>
.dashboard {
  position: absolute;
  top: 90px;
  left: 280px;
  background: #e7f3eb;
  width: calc(100% - 280px);
  height: calc(100% - 90px);
  z-index: 6;
  padding: 3rem 5rem;
}

.content {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.recentlyServedModal,
.missedModal {
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

.data,
.title {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-items: center;
}

.missedModal .title,
.missedModal .data {
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
  margin-left: 6rem;
  margin-bottom: 1rem;
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

.button {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
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

.moveBackOptions {
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
/* Fix the title and the content */
</style>
