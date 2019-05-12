<template>
  <div id="nav">
    <router-link to="/">Home</router-link>&nbsp;|
    <router-link to="/about">About</router-link>&nbsp;|
    <a @click="logOut">Logout</a>
  </div>
</template>

<script>
export default {
  name: "Header",
  methods: {
    logOut() {
      this.$router.push({
        name: "signin",
        params: { userLoggedOut: true }
      });
      window.localStorage.removeItem("cur_user");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
