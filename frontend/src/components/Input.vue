<script lang="ts">
export default {
  
  data() {
    return {
      products: []
    }
  },
  methods: {
    submit(event: any) {
      // Enters the link into the database and starts tracking
      console.log(event.target.value)
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
            URL: event.target.value 
          })
      
      })
      .then((res) => res.json())
      .then(data => {
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
}
</script>

<template>
    <input placeholder="Add Amazon Product URL" @keyup.enter="submit">
    <ul>
      <template v-for="product in products">
        <li>{{product.URL}}</li>
        <button @click="remove_product(product)"></button>
      </template>
    </ul>
</template>

<style scoped>
  input {
    width: 100%;
    padding: 10px;
  }
  
  </style>