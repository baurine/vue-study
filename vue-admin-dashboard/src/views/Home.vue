<template>
  <div class="home">
    <Header/>
    <div class="container">
      <div class="spread">
        <h3>Traffic Overview</h3>
        <div class="toggle">
          <div
            class="interval-tab"
            :class="item === currentInterval && 'active-tab'"
            v-for="item in trafficIntervals"
            :key="item"
            @click="currentInterval = item"
          >{{item}}</div>
        </div>
      </div>
      <apexchart
        class="chart1"
        width="100%"
        height="500px"
        type="area"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "home",
  components: {
    Header,
    apexchart: VueApexCharts
  },
  data() {
    return {
      trafficIntervals: ["Days", "Weeks", "Months"],
      currentInterval: "Days",

      chartOptions: {
        colors: ["#14f1d9", "#7b42f6"],
        legend: {
          labels: {
            colors: [this.$store.getters.isDarkMode ? "white" : "black"]
          },
          position: "top"
        },
        tooltip: {
          theme: "dark"
        },
        grid: {
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        chart: {
          id: "users"
        },
        xaxis: {
          type: "datetime"
        }
      },
      series: [
        {
          name: "active users",
          data: [
            [new Date("January 1, 2019"), 30],
            [new Date("January 5, 2019"), 40]
          ]
        },
        {
          name: "new users",
          data: [
            [new Date("January 1, 2019"), 80],
            [new Date("January 5, 2019"), 20]
          ]
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.home {
  text-align: center;
}
.container {
  padding: 0 15%;
}
.spread {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
}
h3 {
  @include heading-3;
}
.toggle {
  @include medium-text;
  display: flex;
  flex-wrap: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  width: 240px;
  height: 50px;
  color: $dark-gray;
  padding: 5px;
  background: rgba(255, 255, 255, 0.1);
}
.interval-tab {
  width: 33.33%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
}
.active-tab {
  background: $teal;
  border-radius: 4px;
  color: white;
}
</style>
