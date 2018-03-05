(() => {
  Vue.component('todo', {
    // データに状態を記述
    data: function(){
      return {
        title: 'Todo App with Vue.js',
        todos: []
      }
    },

    // テンプレートに構造を記述
    template: `
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
    `,

    // メソッドに挙動を記述
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
  })

  new Vue({
    el: '#app'
  });



})();