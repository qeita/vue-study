<template>
  <div class="container">
    <h1>{{ title }}</h1>

    <form v-on:submit="addTask">
      <label for="input-task">Add Task
        <input id="input-task" type="text" value="" placeholder="Input your task" ref="input">
      </label>

      <input class="btn btn-regist" type="submit" value="Add">
    </form>

    <ul>
      <li v-for=" todo, i in todos ">
        <p>{{ todo.task }}</p>
        <button class="btn btn-delete" v-bind:data-index="i" v-on:click="delTask">Delete</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container{
  margin: 0 auto;
  padding: 40px 0;
  width: 400px;
  font-family:-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", sans-serif;
  display: block;
}
p{
  margin: 0;
  padding: 0;
}

h1{
  margin: 0 0 30px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
form{
  text-align: center;
}
label{
  font-size: 12px;
}
input{
  margin: 0 0 0 10px;
  padding: 0 6px;
  width: 200px;
  font-size: 15px;
  line-height: 2;
  height: 32px;
  outline: none;
  box-sizing: border-box;
}
.btn{
  display: inline-block;
  vertical-align: top;
  padding: 0;
  font-size: 15px;
  line-height: 2;
  height: 32px;
  border: none;
  border-radius: 0;
  outline: none;
  cursor: pointer;
  font-family:-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", sans-serif;
}
form .btn{
  width: 50px;
}
.btn-regist{
  background: #5e6ee5;
  color: #fff;
}
.btn-delete{
  background: #f34826;
  color: #fff;      
}

ul{
  margin: 30px 0 0;
  padding: 0;
}
li{
  position: relative;
  text-align: left;
  font-size: 0;
  padding: 0 0 10px;
  margin: 0 0 10px;
}
li:after{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #888;
  content: '';
  transition: 0.3s all;
}
li:hover:after{
  width: 100%;
}    
li p{
  display: inline-block;
  vertical-align: top;
  width: 320px;
  font-size: 15px;
  line-height: 2;
}
li .btn{
  width: 70px;
}
</style>


<script>
  export default {
    data: function(){
      return {
        title: 'Todo App with Vue.js',
        todos: []
      }
    },
    methods: {
      addTask(e){
        e.preventDefault();

        // console.log(this.refs.input.value);
        let task = this.$refs.input.value;
        this.todos.push({task: task});

        this.$refs.input.value = '';
      },
      delTask(e){

        // console.log(e.currentTarget.getAttribute('data-index'));
        let index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        this.todos.splice(index, 1);
      }
    }
  }
</script>
