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
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";

export default {
  name: "home",
  data() {
    return {
      trafficIntervals: ["Days", "Weeks", "Months"],
      currentInterval: "Days"
    };
  },
  components: {
    Header
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
