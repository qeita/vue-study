(() => {

  class Todo extends React.Component{
    constructor(){
      super();

      this.state = {
        title: 'Todo App with React.js',
        todos: [],
        text: ''
      };
    }

    changeText(e){
      this.setState({ text: e.target.value });
    }

    addTask(e){
      e.preventDefault();
      // console.log(e);

      this.setState({ todos: this.state.todos.concat({ task: this.refs.input.value }) });

      this.setState({ text: '' });
    }

    delTask(){

    }

    render(){
      let todos = this.state.todos;
      
      let items = todos.map( (el, index) => {
        return <li key={index}>
          <p>{ el.task }</p>
          <button className="btn btn-delete">Delete</button>
        </li>
      } );


      return (
        <div className="container">
          <h1>{ this.state.title }</h1>

          <form onSubmit={(e) => { this.addTask(e) }}>
            <label>Add Task
              <input id="input-task" type="text" value={this.state.text} placeholder="Input your task" ref="input" onChange={(e) => { this.changeText(e) }} />
            </label>

            <input className="btn btn-regist" type="submit" value="Add" />
          </form>

          <ul>
            {items}
          </ul>
        </div>        
      )
    }
  }

  /**
   * var [コンポーネント名] = React.createClass();
   * or
   * class [コンポーネント名] extends React.Component();
   * 
   * でコンポーネントの定義。
   * ReactDOM.render( <[コンポーネント名] />, マウント要素 );で呼び出し
   */
  ReactDOM.render(
    <Todo />,
    document.getElementById('app')
  );

})();