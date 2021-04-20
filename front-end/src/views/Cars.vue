<template>
  <div>
    <div class="tomypage" v-if="user">
      <router-link class="pure-button pure-button-primary" to="/dashboard" tag="button">To Your Page</router-link>
    </div>
    <div class="tomypage" v-else>
      <router-link class="pure-button pure-button-primary" to="/dashboard" tag="button">To Login Page</router-link>
    </div>

    <div id="bar"></div>

    <div class="wrapcoll">
      <div class="contcoll" v-for="car in cars" :key="car._id">
        <div class="carImage">
          <router-link :to="{ name: 'car', params: { id: car._id } }">
            <img :src="car.path" />
          </router-link>
        </div>

        <div class="infocoll">
          <p>Make: {{ car.make }}</p>
          <p>Model: {{ car.model }}</p>
          <p>Year: {{ car.year }}</p>
          <p>By: {{ car.user.username }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Cars",
  data() {
    return {
      cars: [],
    };
  },
  created() {
    this.getCars();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    async getCars() {
      try {
        let response = await axios.get("/api/users/cars/all");
        this.cars = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
#bar {
    color: black;
    border-block-color: black;
    margin-top: 35px;
    padding-top: 5px;
    background-color: black;
    display: flex;
}
.carImage img {
  width: 90%;
  height: 180px;
  display: flex;
  justify-content: center;
  text-align: center;
  align-content: center;
  margin-top: 5px;
}
.carHeader {
  text-align: center;
  margin-top: 20px;
}
.wrapcoll {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.contcoll {
  margin: 10px;
  margin-top: 50px;
  width: 400px;
  background-color: burlywood;
}

.carImage {
  display: flex;
  align-content: center;
  text-align: center;
  justify-content: center;
}
.carImage .router-link {
  display: flex;
  text-align: center;
}

.infocoll {
  text-align: center;
}

a {
  display: flex;
  justify-content: center;
  width: 90%;
  height: auto;
}
.tomypage {
  text-align: center;
}
</style>