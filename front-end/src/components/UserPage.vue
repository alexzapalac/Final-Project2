<template>
  <div class="main">
    <div class="link">
      <router-link class="pure-button pure-button-primary" to="/cars" tag="button">View other Cars</router-link>
    </div>
    <div class="menu">
      <h3>Welcome to your page!</h3>
      <h2>
        Log Out
        <a @click="logout"><i class="fas fa-sign-out-alt"></i></a>
      </h2>
    </div>
    <div id="bar">
    </div>


    <div class="wrapper">
      <div class="container">
        <div class="image">
          <img :src="person.Owns" />
        </div>
        <div class="info">
          <h3>{{ user.firstName }} {{ user.lastName }}</h3>

          <h4>Description: {{ user.description }}</h4>
          <h4>Location: {{ user.location }}</h4>
          <h4>Favorite Car: {{ user.favorite }}</h4>
        </div>
      </div>
    </div>

    <div id="editUser">
      <button class="pure-button pure-button-primary" @click="setEditUserTrue()">Edit User</button>
      <div class="EditUserButton" v-if="editUser">
        <input type="text" v-model="firstName" placeholder="First Name" />
        <br />
        <input type="text" v-model="lastName" placeholder="Last Name" />
        <br />
        <textarea type="text" v-model="description" placeholder="Description"></textarea>
        <br />
        <input type="text" v-model="location" placeholder="Your Location" />
        <br />
        <input type="text" v-model="favorite" placeholder="Favorite Car" />
        <br />
        <p>You may need to refresh the page</p>
        <button class="pure-button pure-button-primary" @click="editUserInfo(user)">Submit Changes</button>
      </div>
    </div>

    <div id="bar"></div>

    <div class="carHeader">
      <h3>My Car Collection</h3>
    </div>


    <!-- Add Car -->
    <div class="theCars">
      <button class="pure-button pure-button-primary" @click="setAddACarTrue()">Add a Car</button>
      <form @submit.prevent="addCars" v-if="addACar">
        <input type="text" v-model="make" placeholder="Make" />
        <br />
        <input type="text" v-model="model" placeholder="Model" />
        <br />
        <input type="text" v-model="color" placeholder="Color" />
        <br />
        <input type="text" v-model="year" placeholder="Year" />
        <br />
        <input  type="file" name="carphoto" @change="fileChanged" />
        <p>You may have to refresh the page</p>
        <button class="pure-button pure-button-primary" type="submit">Add Car</button>
      </form>
    </div>

    <br />

    <div class="image" v-for="photo in photos" v-bind:key="photo._id">
      <div class="photoInfo">
        <p>Make: {{ photo.make }}</p>
        <p>Model: {{ photo.model }}</p>
        <p>Color: {{ photo.color }}</p>
        <p>Year: {{ photo.year }}</p>
      </div>
    </div>

    <div class="wrapcoll">
      <div class="contcoll" v-for="car in cars" :key="car._id">
        <div class="carImage">
          <img :src="car.path" />
        </div>

        <div class="infocoll">
          <p>Make: {{ car.make }}</p>
          <p>Model: {{ car.model }}</p>
          <p>Year: {{ car.year }}</p>
          <p>Color: {{ car.color }}</p>
        </div>

        <div class="buttons">
          <button @click="setEditTrue()">Edit Car</button>
          <div class="editButton" v-if="editItem">
            <input type="text" v-model="make" placeholder="Make" />
            <br />
            <input type="text" v-model="model" placeholder="Model" />
            <br />
            <input type="text" v-model="year" placeholder="Year" />
            <br />
            <input type="text" v-model="color" placeholder="Color" />
            <br />
            <button @click="editCar(car)">Submit Edit</button>
          </div>
          <button @click="deleteCar(car)">Remove Car</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "UserPage",
  props: {
    photos: Array,
  },
  data() {
    return {
      path: "",
      loading: false,
      person: {},
      cars: [],
      car: null,
      make: "",
      model: "",
      year: "",
      color: "",
      editItem: false,
      editUser: false,
      peopleName: "",
      description: "",
      location: "",
      favorite: "",
      firstName: "",
      lastName: "",
      error: "",
      file: null,
      url: "",
      addACar: false,
    };
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  async created() {
    await this.getCars();
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
    setEditTrue() {
      this.editItem = true;
    },
    setEditUserTrue() {
      this.editUser = true;
    },
    setAddACarTrue() {
      this.addACar = true;
    },
    async editUserInfo(user) {
      try {
        await axios.put(`/api/users/${user._id}`, {
          firstName: this.firstName,
          lastName: this.lastName,
          description: this.description,
          location: this.location,
          favorite: this.favorite,
        });
        this.user();
        (this.firstName = ""),
          (this.lastName = ""),
          (this.description = ""),
          (this.favorite = ""),
          (this.location = ""),
          (this.editUser = false);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    fileChanged(event) {
      this.file = event.target.files[0];
      this.url = URL.createObjectURL(this.file);
    },
    chooseImage() {
      this.$refs.fileInput.click();
    },

    async addCars() {
      try {
        const formData1 = new FormData();
        formData1.append("carphoto", this.file, this.file.name);
        let r1 = await axios.post("/api/users/carphotos", formData1);
        let r2 = await axios.post(`/api/users/${this.user._id}/cars`, {
          make: this.make,
          model: this.model,
          color: this.color,
          year: this.year,
          path: r1.data.path,
        });
        this.addItem = r2.data;
        this.make = "";
        this.model = "";
        this.year = "";
        this.color = "";
        this.path = "";
        this.getCars();
        this.addACar = false;
      } catch (error) {
        console.log(error);
      }
    },

    async getCars() {
      try {
        const response = await axios.get(`/api/users/${this.user._id}/cars`);
        this.cars = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async editCar(car) {
      try {
        await axios.put(`/api/users/${this.user._id}/cars/${car._id}`, {
          make: this.make,
          model: this.model,
          year: this.year,
          color: this.color,
        });
        this.getCars();
        this.make = "";
        this.model = "";
        this.color = "";
        this.year = "";
        this.editItem = false;
        return true;
      } catch (error) {
        console.log(error);
      }
    },

    async deleteCar(car) {
      try {
        await axios.delete(`/api/users/${this.user._id}/cars/${car._id}`);
        this.getCars();
      } catch (error){
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.router-link {
  text-align: center;
}
.link {
  text-align: center;
}
#bar {
    color: black;
    border-block-color: black;
    margin-top: 35px;
    padding-top: 5px;
    background-color: black;
    display: flex;
}
.menu {
  display: flex;
  justify-content: space-around;
}

.menu h2 {
  font-size: 18px;
  align-self: center;
}
.wrapper {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}
.wrapper .button {
    align-content: flex-end;
}
.theCars{
  text-align: center;
}
#editUser {
    display: flex;
    justify-content: center;
    margin-top: 15px;
    margin-bottom: 15px;
}
.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    text-align: center;
}

.image {
    width: auto;
    display: flex;
    justify-content: center;
    margin-top: 5px;
}

.info {
    text-align: center;
}


.image img {
    width: 50%;

}

.carImage img {
    width: 90%;
    height: 360px;
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
    display:flex;
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

.infocoll {

    text-align: center;
}

.buttons {
    display: flex;
    justify-content: center;
}


</style>