<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent ({
  data() {
    return {
      products: [] as Array<string>,
      link: ""
    }
  },
  methods: {
    submit() {
      // Enters the link into the database and starts tracking
      console.log(this.link);
      fetch('http://localhost:3000/getData')
      .then((res) => res.json())
      .then(data => console.log(data))
      .catch(err => {
        console.log("ERROR: ", err);
      });
      
      fetch('http://localhost:3000/trackPrice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            URL: this.link
          })
      
      })
      .then((res) => res.json())
      .then((data: any) => {
        this.products.push(data);
      })
      .catch(err => {
        console.log("ERROR: ", err);
      });
      
    },
    remove_product(product: any) {
      this.products.splice(this.products.indexOf(product), 1);
      // make call to backend
    }
  }
})
</script>

<template>
  <div class="input-group mb-3 d-flex p-2 bd-highlight">
    <input v-model="link" type="text" class="form-control" placeholder="Add Amazon Product URL"  aria-label="Add Amazon Product URL" aria-describedby="button-addon2" >
    <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="submit">Track</button>
  </div>
  <div class="container">
    <ul class="list-group d-flex p-2 bd-highlight">
      <template v-for="product in products">
        <div class="card" style="margin: 10px; border-width: 5px; border-color: lightgray;">
          <li class="list-group-item">{{product.name}}</li>
          <li class="list-group-item">Price: {{product.price}}</li>
          <li class="list-group-item">
            <a v-bind:href="product.URL" class="link-primary" target="_blank">Link</a>
          </li>
          <button type="button" class="btn btn-danger" style="width: 100px;" @click="remove_product(product)">Remove</button>
        </div>
      </template>
    </ul>
  </div>
</template>

<style scoped>
  input {
    width: 100%;
    padding: 10px;
  }
  
  </style>