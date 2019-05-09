<template>
  <div class="container">
    <div class="request">
      Don't have a Design+Code HQ account?&nbsp;
      <router-link to="/request">Request an account</router-link>
    </div>
    <div class="login">
      <img src="@/assets/DCHQ.svg">
      <h4>Sign into Design+Code HQ</h4>
      <input type="email" placeholder="Email">
      <input type="password" placeholder="Password">
      <button>Sign In</button>
      <router-link to="/recover">Forgot your password?</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignIn"
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 100vh;
}

.request {
  position: absolute;
  right: 40px;
  top: 40px;
  color: rgba(255, 255, 255, 0.3);

  a {
    color: white;
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
  color: white;
}

input {
  width: 100%;
  height: 60px;
  padding-left: 20px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  margin-top: 20px;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
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
</style>
