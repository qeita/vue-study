<!-- カスタムタグの中に、構造・見た目・挙動が並列に記載 -->
<todo>
  <h1>{ title }</h1>

  <form onsubmit={ addTask }>
    <label for="input-task">Add Task
      <input id="input-task" type="text" value="" placeholder="Input your task" ref="input">
    </label>

    <input class="btn btn-regist" type="submit" value="Add">
  </form>

  <ul>
    <li each={ todo, i in todos }>
      <p>{ todo.task }</p>
      <button class="btn btn-delete" onclick={ delTask }>Delete</button>
    </li>
  </ul>

  <style>
    :scope{
      margin: 0 auto;
      padding: 40px 0;
      width: 400px;
      font-family:-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", sans-serif;
      display: block;
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
    }
    li{
      position: relative;
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
    this.title = 'Todo App with Riot.js (v3.9.0)';

    this.todos = [];

    /**
     * タスク追加
     */
    addTask(e){
      e.preventDefault();
      if(this.refs.input.value === '') return;

      // console.log(this.refs.input.value);
      let task = this.refs.input.value;
      this.todos.push({task: task});

      this.refs.input.value = '';
    }

    /**
     * タスク削除
     */
    delTask(e){
      // console.log(e.item);
      this.todos.splice(e.item.i, 1);
    }           
  </script>
</todo> 