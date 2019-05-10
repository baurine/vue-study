<template>
  <div class="container" :class="{'light-background': !isDarkMode, 'dark-background': isDarkMode}">
    <div class="request" :class="{'light-request': isDarkMode, 'dark-request': !isDarkMode}">
      Don't have a Design+Code HQ account?&nbsp;
      <router-link to="/request">Request an account</router-link>
    </div>
    <div class="login">
      <img src="@/assets/DCHQ.svg" v-if="!isDarkMode">
      <img src="@/assets/DCHQ-dark.svg" v-if="isDarkMode">
      <h4 :class="{'light-text': isDarkMode, 'dark-text': !isDarkMode}">Sign into Design+Code HQ</h4>
      <input
        type="email"
        placeholder="Email"
        :class="{'light-field': isDarkMode, 'dark-field': !isDarkMode}"
      >
      <input
        type="password"
        placeholder="Password"
        :class="{'light-field': isDarkMode, 'dark-field': !isDarkMode}"
      >
      <button>Sign In</button>
      <router-link
        to="/recover"
        :class="{'light-link': isDarkMode, 'dark-link': !isDarkMode}"
      >Forgot your password?</router-link>
      <button @click="toggleDarkMode">Toggle</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignIn",
  data() {
    return {
      isDarkMode: true
    };
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
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

.light-background {
  background: $light-gray;
}
.dark-background {
  background: $dark-blue;
}

.request {
  position: absolute;
  right: 40px;
  top: 40px;
}
.light-request {
  color: rgba(255, 255, 255, 0.3);

  a {
    color: white;
  }
}
.dark-request {
  color: rgba(0, 0, 0, 0.3);

  a {
    color: black;
  }
}

.login {
  width: 400px;
}

h4 {
  margin: 0;
  line-height: 34px;
  font-size: 24px;
  text-align: center;
}
.light-text {
  color: white;
}
.dark-text {
  color: black;
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
.ligth-field {
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
  color: rgba(255, 255, 255, 0.3);
  text-decoration: none;
}
.light-link {
  color: rgba(255, 255, 255, 0.3);
}
.dark-link {
  color: rgba(0, 0, 0, 0.3);
}
</style>
