<template>
  <div class="dashboard">
    <div class="content">
      <div class="left">
        <CardNumber
          title="Currenly Vaccinated"
          :data="currentlyVaccinated"
          class="mb-1"
        />
        <CardNumber title="Total Population" :data="totalPopulation" />
      </div>
      <div class="right">
        <Timendate :currentTime="currentTime" class="mb-1" />
        <CardRecentlyServed
          title="People Recently Served"
          :data="peopleRecentlyServed"
          :recentlyServed="recentlyServed"
        />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Timendate from "../components/Timendate.vue";
import CardRecentlyServed from "../components/CardRecentlyServed.vue";
import CardNumber from "../components/CardNumber.vue";
import RecentlyServedService from "../services/RecentlyServedService";
export default {
  name: "Dashboard",
  components: {
    Timendate,
    CardRecentlyServed,
    CardNumber,
  },
  data() {
    return {
      recentlyServed: false,
      currentlyVaccinated: 33501,
      totalPopulation: 45803,
      currentTime: {
        hourDisplay: 0,
        minuteDisplay: 0,
        secondsDisplay: 0,
        displayDay: "",
        displayDate: 0,
        displayMonth: "",
        displayYear: 0,
      },
      peopleRecentlyServed: [],
    };
  },

  methods: {
    formatDay(day) {
      if (day === 0) {
        return "Sunday";
      } else if (day === 1) {
        return "Monday";
      } else if (day === 2) {
        return "Tuesday";
      } else if (day === 3) {
        return "Wednesday";
      } else if (day === 4) {
        return "Thursday";
      } else if (day === 5) {
        return "Friday";
      } else if (day === 6) {
        return "Saturday";
      }
    },

    formatMonth(month) {
      if (month === 0) {
        return "January";
      } else if (month === 1) {
        return "February";
      } else if (month === 2) {
        return "March";
      } else if (month === 3) {
        return "April";
      } else if (month === 4) {
        return "May";
      } else if (month === 5) {
        return "June";
      } else if (month === 6) {
        return "July";
      } else if (month === 7) {
        return "August";
      } else if (month === 8) {
        return "September";
      } else if (month === 9) {
        return "October";
      } else if (month === 10) {
        return "November";
      } else if (month === 11) {
        return "December";
      }
    },
    startTime() {
      const timer = setInterval(() => {
        let date = new Date();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let seconds = date.getSeconds();
        let currentDay = date.getDay();
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        this.currentTime.hourDisplay = hour;
        this.currentTime.minuteDisplay = minute;
        this.currentTime.secondsDisplay = seconds;
        this.currentTime.displayDay = this.formatDay(currentDay);
        this.currentTime.displayDate = day;
        this.currentTime.displayMonth = this.formatMonth(month);
        this.currentTime.displayYear = year;
      }, 1000);
    },
  },
  mounted() {
    this.startTime();
  },
  async created() {
    try {
      this.peopleRecentlyServed =
        await RecentlyServedService.getAllRecentlyServed(
          localStorage.getItem("token")
        );
    } catch (err) {
      this.error = err.message;
    }
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

.mb-1 {
  margin-bottom: 1.5rem;
}

.left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Fix the title and the content */
</style>
