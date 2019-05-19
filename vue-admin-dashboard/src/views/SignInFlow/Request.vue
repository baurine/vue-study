<template>
  <div class="container" :class="{'light-background': !isDarkMode, 'dark-background': isDarkMode}">
    <div class="login">
      <img src="@/assets/DCHQ.svg" v-if="!isDarkMode">
      <img src="@/assets/DCHQ-dark.svg" v-if="isDarkMode">
      <h4 :class="{'light-text': isDarkMode, 'dark-text': !isDarkMode}">Request Account</h4>
      <form @submit.prevent="onSubmit">
        <input
          type="email"
          placeholder="Email"
          :class="{'light-field': isDarkMode, 'dark-field': !isDarkMode}"
          v-model="email"
          required
        >
        <button>Request Account</button>
      </form>
      <router-link
        to="/signin"
        :class="{'light-link': isDarkMode, 'dark-link': !isDarkMode}"
      >Already have an account? Sign in now</router-link>
      <ThemeSwitch/>
    </div>
  </div>
</template>

<script>
import ThemeSwitch from "@/components/ThemeSwitch";

export default {
  name: "Request",
  components: {
    ThemeSwitch
  },
  data() {
    return {
      email: null
    };
  },
  computed: {
    isDarkMode() {
      return this.$store.getters.isDarkMode;
    }
  },
  methods: {
    onSubmit() {
      // TODO: send request message to slack by slack api
      this.$router.push({
        name: "signin",
        params: {
          userRequestAccount: true,
          email: this.email
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 100vh;
}
.login {
  width: 400px;
  text-align: center;
}

h4 {
  margin: 0;
  line-height: 34px;
  font-size: 24px;
  text-align: center;
}

input {
  width: 100%;
  height: 60px;
  padding-left: 20px;
  font-size: 20px;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 20px;
  outline: none;
}

button {
  width: 100%;
  background: #56ccf2;
  height: 60px;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 40px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
}

a {
  line-height: 25px;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
}
</style>
