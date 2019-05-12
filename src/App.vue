<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import "animate.css";
export default {
  name: "App"
};
</script>

<style lang="scss">
* {
  transition: 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

body {
  margin: 0;
  padding: 0;

  // background: $dark-blue;

  h1 {
    @include heading-1;
  }
  p {
    @include large-text-bold($purple);
  }
}
#app {
  font-family: $system-font-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $white;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #42b983;
    &.router-link-exact-active {
      color: $white;
    }
  }
}

.light-background {
  background: $light-gray;
}
.dark-background {
  background: $dark-blue;
}
.light-text {
  color: white;
}
.dark-text {
  color: black;
}
.light-field {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
}
.dark-field {
  color: black;
  background: rgba(198, 208, 235, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.2);
  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
  }
}
.light-link {
  color: rgba(255, 255, 255, 0.3);
}
.dark-link {
  color: rgba(0, 0, 0, 0.3);
}
</style>
