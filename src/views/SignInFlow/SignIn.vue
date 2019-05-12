<template>
  <div class="container" :class="{'light-background': !isDarkMode, 'dark-background': isDarkMode}">
    <Notification v-if="hasText" :text="text"/>
    <RequestAccount/>
    <div class="login">
      <img src="@/assets/DCHQ.svg" v-if="!isDarkMode">
      <img src="@/assets/DCHQ-dark.svg" v-if="isDarkMode">
      <h4 :class="{'light-text': isDarkMode, 'dark-text': !isDarkMode}">Sign into Design+Code HQ</h4>
      <form @submit.prevent="onSubmit">
        <input
          type="email"
          placeholder="Email"
          :class="{'light-field': isDarkMode, 'dark-field': !isDarkMode}"
          v-model="email"
          required
        >
        <input
          type="password"
          placeholder="Password"
          :class="{'light-field': isDarkMode, 'dark-field': !isDarkMode}"
          v-model="password"
          required
        >
        <button>Sign In</button>
      </form>
      <router-link
        to="/recover"
        :class="{'light-link': isDarkMode, 'dark-link': !isDarkMode}"
      >Forgot your password?</router-link>
      <ThemeSwitch/>
    </div>
  </div>
</template>

<script>
import RequestAccount from "@/components/RequestAccount";
import ThemeSwitch from "@/components/ThemeSwitch";
import Notification from "@/components/Notification";

export default {
  name: "SignIn",
  components: {
    RequestAccount,
    ThemeSwitch,
    Notification
  },
  data() {
    return {
      email: null,
      password: null,

      hasText: false,
      text: ""
    };
  },
  mounted() {
    const params = this.$route.params;
    if (params.userLoggedOut) {
      this.hasText = true;
      this.text = "You have logged out!";
    } else if (params.userRequestAccount) {
      this.hasText = true;
      this.text = `Your request has been sent to administator for ${
        params.email
      }`;
    } else if (params.userRecoverAccount) {
      this.hasText = true;
      this.text = `A recovery email has sent to ${params.email}`;
    } else if (params.userNeedLogin) {
      this.hasText = true;
      this.text = `Please login first`;
    }
  },
  computed: {
    isDarkMode() {
      return this.$store.getters.isDarkMode;
    }
  },
  methods: {
    onSubmit() {
      window.localStorage.setItem("cur_user", this.email + "_" + this.password);
      this.$router.replace("/");
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
