<template>
  <div class="vaccines">
    <div class="content">
      <div class="cards">
        <CardVaccine
          title="Total Administered Vaccine"
          :data="vaccines"
          leftTitle="Vaccine Brand"
          rightTitle="Total Vials"
          width="600px"
        />
        <CardVaccine
          title="Available Vaccine"
          :data="vaccines"
          leftTitle="Vaccine Brand"
          rightTitle="Remaining Vials"
          width="600px"
        />
      </div>
      <div class="buttons">
        <Button
          color="#008789"
          class="fas fa-plus"
          @click="showNewVaccineModal"
        />
        <Button
          color="#ffb533"
          class="fa-solid fa-pen-to-square"
          @click="ShowUpdateVaccineModal"
        />
        <Button
          color="red"
          class="fas fa-trash"
          @click="showDeleteVaccineModal"
        />
      </div>
    </div>
  </div>
  <div class="vaccineModal" ref="vaccineModal">
    <div class="modal-content">
      <CloseButton class="closeBtn" @click="removeVaccineModal" />
      <h2 class="modal-title">Add New Vaccine</h2>
      <form @submit.prevent="addVaccine" action="">
        <input
          type="text"
          placeholder="Vaccine Brand"
          class="vaccineBrand form-input"
          v-model="vaccineBrand"
        />
        <input
          type="number"
          placeholder="Vials"
          class="vials form-input"
          v-model="vials"
        />
        <Button text="Submit" color="#008789" class="submitBtn" />
      </form>
    </div>
  </div>
  <div class="updateVaccineModal" ref="updateVaccineModal">
    <div class="modal-content">
      <CloseButton class="closeBtn" @click="removeUpdateVaccineModal" />
      <h2 class="modal-title">Update Vaccine Vials Status</h2>
      <form @submit.prevent="updateVaccineVials">
        <select name="vaccinebrand" v-model="updateVaccineBrandID">
          <option selected disabled>Vaccine Brand</option>
          <option
            v-for="vaccine in vaccines"
            :key="vaccine._id"
            :value="vaccine._id"
          >
            {{ vaccine.vaccineBrand }}
          </option>
        </select>
        <select name="updateType" id="" v-model="updateType">
          <option disabled selected value="">Update Type</option>
          <option value="add">Add Vials</option>
          <option value="minus">Administered Vials</option>
        </select>
        <input
          type="number"
          placeholder="Vials Count"
          class="vials form-input"
          v-model="vialsCount"
        />
        <Button text="Update" color="#ffb533" class="submitBtn" />
      </form>
    </div>
  </div>
  <div class="deleteVaccineModal" ref="deleteModal">
    <div class="modal-content">
      <CloseButton class="closeBtn" @click="removeDeleteVaccineModal" />
      <h2 class="modal-title">Delete Vaccine</h2>
      <form @submit.prevent="showConfirmationDeleteModal">
        <select name="vaccinebrand" v-model="deleteVaccineBrandID">
          <option selected disabled>Vaccine Brand</option>
          <option
            v-for="vaccine in vaccines"
            :key="vaccine._id"
            :value="vaccine._id"
          >
            {{ vaccine.vaccineBrand }}
          </option>
        </select>
        <Button text="Delete" color="red" class="submitBtn" />
      </form>
    </div>
  </div>
  <div class="deleteConfirmModal" ref="deleteConfirmModal">
    <div class="modal-content deleteConfirmContent">
      <h2>Are you sure you want to delete this?</h2>
      <div class="deleteConfirmButtons">
        <Button
          text="Yes"
          color="red"
          class="submitBtn"
          @click="deleteVaccine"
        />
        <Button
          text="No"
          color="#ffb533"
          class="submitBtn"
          @click="removeDeleteConfirmModal"
        />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import CardVaccine from "../components/CardVaccine.vue";
import Button from "../components/Button.vue";
import IconButton from "../components/IconButton.vue";
import CloseButton from "../components/CloseButton.vue";
import VaccineService from "../services/VaccineService";
export default {
  name: "Vaccines",
  components: {
    Button,
    IconButton,
    CardVaccine,
    CloseButton,
  },
  data() {
    return {
      vaccineBrand: "",
      vials: "",
      updateVaccineBrandID: "Vaccine Brand",
      deleteVaccineBrandID: "Vaccine Brand",
      vialsCount: "",
      updateType: "",
    };
  },
  methods: {
    async showNewVaccineModal() {
      this.$refs.vaccineModal.style.display = "block";
    },
    removeVaccineModal() {
      this.$refs.vaccineModal.style.display = "none";
    },
    ShowUpdateVaccineModal() {
      this.$refs.updateVaccineModal.style.display = "block";
    },
    removeUpdateVaccineModal() {
      this.$refs.updateVaccineModal.style.display = "none";
    },
    showDeleteVaccineModal() {
      this.$refs.deleteModal.style.display = "block";
    },
    removeDeleteVaccineModal() {
      this.$refs.deleteModal.style.display = "none";
    },
    showDeleteConfirmModal() {
      this.$refs.deleteConfirmModal.style.display = "block";
    },
    removeDeleteConfirmModal() {
      this.$refs.deleteConfirmModal.style.display = "none";
    },
    async updateVaccineVials() {
      const vaccineToUpdate = await VaccineService.getVaccine(
        this.updateVaccineBrandID,
        localStorage.getItem("token")
      );
      console.log(vaccineToUpdate);
      const id = vaccineToUpdate._id;
      const currentVials = vaccineToUpdate.vials;
      const vaccineBrand = vaccineToUpdate.vaccineBrand;
      if (this.updateType === "add") {
        const finalVials = currentVials + this.vialsCount;
        const updVaccine = {
          id: this.updateVaccineBrandID,
          vaccineBrand: vaccineBrand,
          vials: finalVials,
        };

        this.$store.dispatch("updateVaccine", updVaccine);
        console.log(updVaccine);
        console.log(`updateVaccineBrandID: ${this.updateVaccineBrandID}`);
      } else {
        const finalVials = currentVials - this.vialsCount;
        const updVaccine = {
          id: this.updateVaccineBrandID,
          vaccineBrand: vaccineBrand,
          vials: finalVials,
        };
        this.$store.dispatch("updateVaccine", updVaccine);
        console.log(`updVaccine: ${updVaccine}`);
        console.log(`updateVaccineBrandID: ${this.updateVaccineBrandID}`);
      }

      this.removeUpdateVaccineModal();
      this.updateVaccineBrandID = "Vaccine Brand";
      this.vialsCount = "";

      console.log(`updateVaccineBrandID: ${this.updateVaccineBrandID}`);
    },
    addVaccine() {
      const newVaccine = { vaccineBrand: this.vaccineBrand, vials: this.vials };
      this.$store.dispatch("addVaccine", newVaccine);
      this.removeVaccineModal();
      this.vaccineBrand = "";
      this.vials = "";
    },
    showConfirmationDeleteModal() {
      this.showDeleteConfirmModal();
      this.removeDeleteVaccineModal();
    },
    deleteVaccine() {
      const vaccineID = this.deleteVaccineBrandID;
      this.$store.dispatch("deleteVaccine", vaccineID);
      console.log("Vaccine Deleted");
      console.log(this.deleteVaccineBrandID);
      this.removeDeleteConfirmModal();
      this.deleteVaccineBrandID = "Vaccine Brand";
    },
  },
  computed: {
    vaccines: {
      get() {
        return this.$store.state.vaccines;
      },
    },
  },
  watch: {
    // For debugging purposes in _id to id bug
    updateVaccineBrandID(newValue, oldValue) {
      console.log("old:" + oldValue);
      console.log("new:" + newValue);
      if (newValue == undefined) {
        this.vaccines.forEach((vaccine) => console.log(vaccine));
      }
    },
    vaccines(newValue, oldValue) {
      console.log("OLD");
      console.log(oldValue);
      console.log("NEW");
      console.log(newValue);
    },
  },
  created() {
    this.$store.dispatch("fetchVaccines");
  },
};
</script>

<style scoped>
.vaccines {
  position: absolute;
  top: 90px;
  left: 280px;
  background: #e7f3eb;
  width: calc(100% - 280px);
  height: calc(100% - 90px);
  z-index: 6;
  padding: 3rem 5rem;
}
.vaccines .content {
  display: grid;
  height: 100%;
  width: 100%;
}
.vaccines .content .cards {
  display: flex;
  justify-content: space-around;
}

.buttons {
  display: flex;
  justify-self: right;
  align-self: flex-end;
  gap: 1rem;
  margin-right: 4rem;
}

.vaccineModal,
.updateVaccineModal,
.deleteVaccineModal,
.deleteConfirmModal {
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

.modal-content {
  position: relative;
  width: 30%;
  /* height: 100%; */
  margin: 13% auto;
  background: #fff;
  /* animation-name: modalopen;
  animation-duration: var(--modal-duration); */
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

.data,
.title {
  display: flex;
  /* grid-template-columns: repeat(3, 1fr); */
  justify-content: space-around;
  text-align: center;
  align-items: center;
  gap: 1rem;
}

.title span {
  font-size: 1.8rem;
  color: #008789;
  margin-bottom: 0.5rem;
  text-align: center;
}
.data span {
  font-size: 1.5rem;
  color: #008789;
  margin-bottom: 0.5rem;
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

.form-inputm,
select {
  padding: 1rem;
  color: #008789;
  border: none;
  border-bottom: solid 2px #008789;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.form-input:focus,
select:focus {
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

.deleteConfirmContent h2 {
  text-align: center;
}

.deleteConfirmContent .deleteConfirmButtons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
