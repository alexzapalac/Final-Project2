<template>
  <div>
    <div class="link">
      <router-link class="pure-button pure-button-primary" to="/cars" tag="button">Back to Cars</router-link>
    </div>

    <div id="bar">
    </div>

    <div class="wrapcoll">
      <div class="carImage">
        <img :src="acar.path" />
      </div>

      <div class="infocoll">
        <p>Make: {{ acar.make }}</p>
        <p>Model: {{ acar.model }}</p>
        <p>Year: {{ acar.year }}</p>
        <p>By: {{ theuser.username }}</p>
      </div>
    </div>

    <div class="commWrapper" v-if="user" @submit.prevent="addTicket">
      <legend>Add a comment</legend>
      <fieldset>
        <textarea
          v-model="addedComment"
          placeholder="Submit your comment"
        ></textarea>
        <br />
        <button class="pure-button pure-button-primary" @click="addComment()">Submit</button>
      </fieldset>
    </div>

    <h3>Comments</h3>
    <div class="comments" v-for="comment in comments" :key="comment.id">
      <div class="wrapper">
        <p>Comment: {{ comment.text }}</p>
        <p>Created: {{ formatDate(comment.created) }}</p>
        <p>By: {{ comment.user.username }}</p>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  name: "car",
  data() {
    return {
      addedComment: "",
      acar: {},
      make: "",
      model: "",
      color: "",
      year: "",
      path: "",

      auser: "",
      theuser: {},
      username: "",
      firstName: "",
      comments: {},
    };
  },
  async created() {
    await this.getCar();
    await this.getUser();
    await this.getComments();
  },
  computed: {
    item() {
      return this.$route.params.id;
    },
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    formatDate(date) {
      if (moment(date).diff(Date.now(), "days") < 15)
        return moment(date).fromNow();
      else return moment(date).format("d MMMM YYYY");
    },
    async getCar() {
      try {
        let response = await axios.get(
          `/api/users/cars/${this.$route.params.id}`
        );
        this.acar = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async getUser() {
      try {
        let response = await axios.get(`/api/users/${this.acar.user}`);
        this.theuser = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async addComment() {
      try {
        await axios.post("/api/users/cars/" + this.$route.params.id, {
          text: this.addedComment,
        });
        this.addedComment = "";
        this.getComments();
      } catch (error) {
        console.log(error);
      }
    },
    async getComments() {
      try {
        let response = await axios.get(
          `/api/users/cars/${this.$route.params.id}/comments`
        );
        this.comments = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
#bar {
    color: black;
    border-block-color: black;
    margin-top: 35px;
    padding-top: 5px;
    background-color: black;
    display: flex;
}
.link {
  display: flex;
  justify-content: center;
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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 1px;
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
  align-self: center;
}

a {
  display: flex;
  justify-content: center;
  width: 90%;
  height: auto;
}
.commWrapper {
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>