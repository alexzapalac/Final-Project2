<template>
  <div class="everything">
    <div id="welcome">
      <h3>Welcome to your Local Auto Club</h3>

    </div>
    <div class="coolCars">
      <img src="logo/car1.jpg">
      <img src="logo/car2.jpg">
      <img src="logo/car3.jpg">
    </div>
    <div id="bar">
    </div>
    <div class="hero">
      <div class="heroBox">
        <form class="pure-form">
          <router-link class="pure-button pure-button-primary" to="/cars" tag="button">To Car Page</router-link>
          <p>Or Make an Account and Join</p>
          <br />
          <fieldset>
            <legend>Register for an account</legend>
            <input placeholder="first name" v-model="firstName" />
            <input placeholder="last name" v-model="lastName" />
          </fieldset>
          <fieldset>
            <input placeholder="your location" v-model="location" />
            <input placeholder="favorite vehicle" v-model="favorite" />
          </fieldset>
          <fieldset>
            <input placeholder="username" v-model="username" />
            <input type="password" placeholder="password" v-model="password" />
          </fieldset>
          <fieldset>
            <p>You Can Add More Info Later</p>
            <button
              type="submit"
              class="pure-button pure-button-primary"
              @click.prevent="register"
            >
              Register
            </button>
          </fieldset>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
        <form class="pure-form space-above">
          <fieldset>
            <legend>Or Login</legend>
            <input placeholder="username" v-model="usernameLogin" />
            <input
              type="password"
              placeholder="password"
              v-model="passwordLogin"
            />
          </fieldset>
          <fieldset>
            <button
              type="submit"
              class="pure-button pure-button-primary"
              @click.prevent="login"
            >
              Login
            </button>
          </fieldset>
        </form>
        <p v-if="errorLogin" class="error">{{ errorLogin }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HomePage",
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      usernameLogin: "",
      passwordLogin: "",
      error: "",
      errorLogin: "",
      location: "",
      favorite: "",
    };
  },

  methods: {
    async register() {
      this.error = "";
      this.errorLogin = "";
      if (!this.firstName || !this.lastName || !this.username || !this.password)
        return;
      try {
        let response = await axios.post("/api/users", {
          firstName: this.firstName,
          lastName: this.lastName,
          description: this.location,
          favorite: this.favorite,
          username: this.username,
          password: this.password,
        });
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    async login() {
      this.error = "";
      this.errorLogin = "";
      if (!this.usernameLogin || !this.passwordLogin) return;
      try {
        let response = await axios.post("/api/users/login", {
          username: this.usernameLogin,
          password: this.passwordLogin,
        });
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.errorLogin = "Error: " + error.response.data.message;
        this.$root.$data.user = null;
      }
    },
  },
};
</script>

<style scoped>
.space-above {
  margin-top: 50px;
}

h1 {
  font-size: 28px;
  font-variant: capitalize;
}

.hero {
  padding: 50px;
  display: flex;
  justify-content: center;
}

.heroBox {
  text-align: center;
}

.hero form {
  font-size: 14px;
}

.hero form legend {
  font-size: 20px;
}

input {
  margin-right: 10px;
}

.error {
  margin-top: 10px;
  display: inline;
  padding: 5px 20px;
  border-radius: 30px;
  font-size: 10px;
  background-color: #d9534f;
  color: #fff;
}
#welcome {
    align-content: center;
    align-items: center;
    text-align: center;
}

.coolCars {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 2px;
}
#bar {
    color: black;
    border-block-color: black;
    margin-top: 5px;
    padding-top: 5px;
    background-color: black;
    display: flex;
}
p {
  font-size: 18px;
}
</style>