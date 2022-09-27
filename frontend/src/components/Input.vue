<script lang="ts">
import { defineComponent } from "vue";
type Product = {_id: any, name: string, price: string, URL: string};

export default defineComponent ({
  data() {
    return {
      products: [] as Array<Product>,
      link: ""
    }
  },
  beforeMount() {
      this.getData()
  },
  methods: {
    getData() {
      if (!window.localStorage.getItem("products")) {
        console.log("Fetching data...");
        fetch('http://localhost:3000/getData')
        .then((res) => res.json())
        .then(data => {
          console.log(data['products'])
          data['products'].forEach((product: Product) => {
            this.products.push(product);
          });
          window.localStorage.setItem("products", JSON.stringify(this.products));
        })
        .catch(err => {
          console.log("ERROR: ", err);
        }); 
      } else {
        this.products = JSON.parse(window.localStorage.getItem("products")!); // ! - non-null assertion
      }
    },
    submit() {
      // Enters the link into the database and starts tracking
      console.log(this.link);
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
        window.localStorage.setItem("products", JSON.stringify(this.products));
        console.log(data);
      })
      .catch(err => {
        console.log("ERROR: ", err);
      });
      
    },
    async remove_product(product: Product) {
      // TODO: As an exercise, create my own popup
      if (confirm("Are you sure you want to delete this product?")) {
        //this.products.splice(this.products.indexOf(product), 1);
        //window.localStorage.setItem("products", JSON.stringify(this.products));
        // make call to backend
        const deleted_data = await fetch('http://localhost:3000/deletePrice', 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({_id: product._id})
          }
        ).then((res) => res.json());
        console.log(deleted_data);
        // Fetch the data from database
        const data = await fetch('http://localhost:3000/getData').then((res) => res.json());
        console.log(data['products']);
        this.products = data['products'];
        window.localStorage.setItem("products", JSON.stringify(this.products));
       
      }
      
    }
  }
})
</script>

<template>
  <div class="input-group mb-3 d-flex p-2 bd-highlight">
    <input v-model="link" type="text" class="form-control" placeholder="Add Amazon Product URL"  aria-label="Add Amazon Product URL" aria-describedby="button-addon2" >
    <button class="btn btn-secondary" type="button" id="button-addon2" @click="submit">Track</button>
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