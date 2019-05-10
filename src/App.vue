<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
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
  text-align: center;
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
</style>
