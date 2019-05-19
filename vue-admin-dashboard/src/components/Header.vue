<template>
  <div id="nav" :class="{'nav-light': !isDarkMode, 'nav-dark': isDarkMode}">
    <div class="nav-1">
      <img src="@/assets/DCHQ-small.svg">
      <router-link to="/" :class="{'light-nav': !isDarkMode, 'dark-nav': isDarkMode}">Home</router-link>
      <router-link to="/team" :class="{'light-nav': !isDarkMode, 'dark-nav': isDarkMode}">Team</router-link>
    </div>
    <a @click="logOut">
      Logout
      <img src="@/assets/logout.svg">
    </a>
  </div>
</template>

<script>
export default {
  name: "Header",
  computed: {
    isDarkMode() {
      return this.$store.getters.isDarkMode;
    }
  },
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
#nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 15px 15%;
  width: 100%;

  a {
    font-weight: bold;
    color: $dark-gray;
    text-decoration: none;
    cursor: pointer;

    &.router-link-exact-active.dark-nav {
      color: $white;
    }
    &.router-link-exact-active.light-nav {
      color: $middle-blue;
    }
  }
}
.nav-light {
  background: $white;
}
.nav-dark {
  background: $super-dark-blue;
}

.nav-1 {
  display: flex;
  align-items: center;

  a {
    margin-left: 20px;
    margin-right: 20px;
  }
  img {
    margin-right: 20px;
  }
}
</style>
