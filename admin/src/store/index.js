import { createStore } from "vuex";
import QueueService from "../services/QueueService";
import RecentlyServedService from "../services/RecentlyServedService";
import VaccineService from "../services/VaccineService";

export default createStore({
  state: {
    username: null,
    token: null,
    isQueueOpen: null,
    peopleInQueue: [],
    currentQueue: null,
    limitedPeopleInQueue: [],
    recentlyServedPeople: [],
    missedQueuePeople: [], //reaname this shit
    vaccines: [],
  },
  mutations: {
    fetchPeopleInQueue(state, peopleInQueue) {
      state.peopleInQueue = peopleInQueue;
    },
    fetchLimitedPeopleInQueue(state, peopleInQueue) {
      state.limitedPeopleInQueue = peopleInQueue;
    },

    deleteMultipleQueue(state, ids) {
      const IDS = Object.values(ids);
      const indexes = IDS.map((id) => {
        return state.peopleInQueue.findIndex((person) => person._id === id);
      });
      // Both Working
      // const indexSet = new Set(indexes);
      // const newValue = state.peopleInQueue.filter(
      //   (value, i) => !indexSet.has(i)
      // );

      const newValue = state.peopleInQueue.filter(
        (value, index) => indexes.indexOf(index) == -1
      );
      state.peopleInQueue = newValue;
    },
    resetQueue(state) {
      state.peopleInQueue = [];
      state.missedQueuePeople = [];
    },
    fetchMissedQueuePeople(state, missedQueuePeople) {
      state.missedQueuePeople = missedQueuePeople;
    },
    movePeopleInMissedQueue(state, peopleMissedQueue) {
      peopleMissedQueue.missedQueue.forEach((person) => {
        state.missedQueuePeople.push(person);
      });
      console.log(peopleMissedQueue.missedQueue);
    },
    fetchRecentlyServedPeople(state, peopleInQueue) {
      state.recentlyServedPeople = peopleInQueue;
    },
    insertMultipleQueue(state, people) {
      // add people to the peopleinqueue
      people.multipleQueue.forEach((person) => {
        state.peopleInQueue.push(person);
      });
      console.log(people);
    },
    deleteMultipleMissedQueue(state, ids) {
      // remove all missed quque in the missed queue people
      const IDS = Object.values(ids);
      const indexes = IDS.map((id) => {
        return state.missedQueuePeople.findIndex((person) => person._id === id);
      });
      // Both Working
      // const indexSet = new Set(indexes);
      // const newValue = state.peopleInQueue.filter(
      //   (value, i) => !indexSet.has(i)
      // );
      const newValue = state.missedQueuePeople.filter(
        (value, index) => indexes.indexOf(index) == -1
      );
      state.missedQueuePeople = newValue;
    },
    fetchVaccines(state, vaccines) {
      state.vaccines = vaccines;
    },
    addVaccine(state, newVaccine) {
      state.vaccines.push(newVaccine);
    },
    updateVaccine(state, updVaccine) {
      const index = state.vaccines.findIndex(
        (vaccine) => vaccine._id === updVaccine._id
      );
      if (index !== -1) {
        state.vaccines.splice(index, 1, updVaccine);
      }
      console.log(index);
    },
    deleteVaccine(state, id) {
      // pop the index with right id
      const index = state.vaccines.findIndex((vaccine) => vaccine._id === id);
      if (index !== -1) {
        state.vaccines.splice(index, 1); //2nd parameter means remove one item only
      }
    },
    fetchCurrentQueue(state, currentQueue) {
      state.currentQueue = currentQueue;
    },
  },
  actions: {
    async fetchPeopleInQueue({ commit }) {
      const data = await QueueService.getQueue(localStorage.getItem("token"));
      commit("fetchPeopleInQueue", data);
      console.log(data);
    },
    async fetchLimitedPeopleInQueue({ commit }) {
      const data = await QueueService.getLimitedQueue(
        11,
        localStorage.getItem("token")
      );
      commit("fetchLimitedPeopleInQueue", data);
      console.log(data);
    },
    async deleteMultipleQueue({ commit }, ids) {
      await QueueService.deleteMultipleQueue(
        ids,
        localStorage.getItem("token")
      );
      commit("deleteMultipleQueue", ids);
    },
    async resetQueue({ commit }) {
      await QueueService.deleteAllQueue(localStorage.getItem("token"));
      await QueueService.deleteAllMissedQueue(localStorage.getItem("token"));
      commit("resetQueue");
    },
    async fetchMissedQueuePeople({ commit }) {
      const data = await QueueService.getMissedQueue(
        localStorage.getItem("token")
      );
      commit("fetchMissedQueuePeople", data);
    },
    async movePeopleInMissedQueue({ commit }, peopleMissedQueue) {
      const res = await QueueService.movePeopleInMissedQueue(peopleMissedQueue);
      const data = res.data;
      commit("movePeopleInMissedQueue", data);
    },
    async fetchRecentlyServedPeople({ commit }) {
      const data = await RecentlyServedService.getAllRecentlyServed(
        localStorage.getItem("token")
      );
      commit("fetchRecentlyServedPeople", data);
      console.log(data);
    },
    async insertMultipleQueue({ commit }, people) {
      const res = await QueueService.movePeopleBackInQueue(
        people,
        localStorage.getItem("token")
      );
      commit("insertMultipleQueue", res.data);
    },
    async deleteMultipleMissedQueue({ commit }, ids) {
      const res = await QueueService.deleteMultipleMissedQueue(
        ids,
        localStorage.getItem("token")
      );
      commit("deleteMultipleMissedQueue", ids);
    },
    async fetchVaccines({ commit }) {
      const data = await VaccineService.getAllVaccine(
        localStorage.getItem("token")
      );
      commit("fetchVaccines", data);
      console.log(data);
    },
    async addVaccine({ commit }, newVaccine) {
      console.log(localStorage.getItem("token"));
      const res = await VaccineService.insertVaccine(
        newVaccine.vaccineBrand,
        newVaccine.vials,
        localStorage.getItem("token")
      );
      const latestVaccineRes = await VaccineService.getLatestVaccine(
        localStorage.getItem("token")
      );
      const latestVaccine = latestVaccineRes;
      commit("addVaccine", latestVaccine[0]);
      console.log(latestVaccine);
    },
    async updateVaccine({ commit }, updVaccine) {
      const res = await VaccineService.editVaccine(
        updVaccine.id,
        updVaccine.vials,
        localStorage.getItem("token")
      );
      const updatedVaccine = {
        // this is the problem
        _id: updVaccine.id,
        vaccineBrand: updVaccine.vaccineBrand,
        vials: res.data.vaccine.vials,
      };

      commit("updateVaccine", updatedVaccine);
      console.log(updatedVaccine);
    },

    async deleteVaccine({ commit }, id) {
      await VaccineService.deleteVaccine(id, localStorage.getItem("token"));
      commit("deleteVaccine", id);
    },
    fetchCurrentQueue({ commit }, currentQueue) {
      commit("fetchCurrentQueue", currentQueue);
    },
  },

  getters: {
    getCurrentPersonInQueue(state) {
      return state.peopleInQueue[0].queueNumber; // its working but an error pop up about undefined in reactivity of the state
    },
    getLimitedQueuePeople(state) {
      return state.peopleInQueue.slice(0, 11);
    },
    getMissedQueuePeople(state) {
      return state.missedQueuePeople.sort((a, b) => {
        if (a.queueNumber < b.queueNumber) {
          return -1;
        }
        if (b.queueNumber < a.queueNumber) {
          return 1;
        }
        return 0;
      });
    },
    getPeopleInQueue(state) {
      return state.peopleInQueue.sort((a, b) => {
        if (a.queueNumber < b.queueNumber) {
          return -1;
        }
        if (b.queueNumber < a.queueNumber) {
          return 1;
        }
        return 0;
      });
    },
  },
  modules: {},
});
