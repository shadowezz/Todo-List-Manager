import React from "react";
import {Link} from "react-router-dom";
import axios from 'axios';
import EditForm from './EditForm';
import Search from './Search';
import NavBar from './NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faPencilAlt, faSearch, faPlusSquare} from '@fortawesome/free-solid-svg-icons'

class TodoItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_todos: [],
      displayed_todos: [],
      hasMessage: false,
      message: this.props.message,
      update: false,
      deleting: false
    };
    this.updateTodo = this.updateTodo.bind(this)
    this.cancelUpdate = this.cancelUpdate.bind(this)
    this.updateDisplay = this.updateDisplay.bind(this)
  }


  componentDidMount() {
    if (!localStorage.getItem('logged_in')) {
      this.props.history.push('/')
    }
    else {
      axios.get('/api/v1/todo_items/index')
        .then(response => {
          console.log(response.data);
          this.setState({ all_todos: response.data, displayed_todos: response.data });
        })
        .catch(error => console.log("api errors:", error))
      }
  }

  updateDisplay = (newList) => {
    this.setState({displayed_todos: newList})
  }

  updateTodo = () => {
    this.setState({update: false})
    axios.get('/api/v1/todo_items/index')
        .then(response => {
          console.log(response.data);
          this.setState({ all_todos: response.data, displayed_todos: response.data, 
            message: "Todo item updated successfully!"});
        })
        .catch(error => console.log("api errors:", error))
  }

  cancelUpdate() {
    this.setState({update: false, hasMessage: false})
  }

  openModalHandler(todo) {
    this.setState({
        showModal: todo
    });
  }

  closeModalHandler() {
    this.setState({
        showModal: false
    });
  }

  deleteTodo = (id) => {
    axios.delete(`/api/v1/destroy/${id}`, {withCredentials:true})
      .then(response => {
        console.log(response.data.message)
        const new_todos = this.state.all_todos.filter((item) => item.id != id)
        const new_display = this.state.displayed_todos.filter((item) => item.id != id)
        this.setState({ all_todos: new_todos, displayed_todos: new_display, 
          message: response.data.message, hasMessage: true, deleting: false})
      })
      .catch(error => console.log(error))
  }

  render() {
    const allTodos = this.state.displayed_todos.map((todo, index) => (
      <tr key={index}>
        <th>{index + 1}</th>
        <td>{todo.title}</td>
        <td>{todo.description}</td>
        <td>{todo.category}</td>
        <td>{todo.deadline ? todo.deadline.slice(0, 16) : ""}</td>
        <td>{todo.created_at.slice(0, 16)}</td>
        <td>
          <button className="btn btn-info" type="button" onClick={() => this.setState({update: todo})}>
            <FontAwesomeIcon icon={faPencilAlt}/> Update
          </button>
        </td>
        <td><button className="btn btn-warning" type="button" data-toggle="modal" data-target="#myModal" 
          onClick={() => this.setState({deleting: todo})}>
          <FontAwesomeIcon icon={faCheckCircle}/>Completed</button></td>
      </tr>
    ));
    if (!this.state.update) {
      return (
        <div className="container-fluid">
          <NavBar handleLogout={this.props.handleLogout}/>         
          <div className="modal fade" id="myModal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Todo Item</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this todo item "{this.state.deleting.title}"?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" data-dismiss="modal"
                    onClick={() => this.deleteTodo(this.state.deleting.id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        <div>
            <h1>Welcome {localStorage.getItem("username")}</h1>
            <h3>Here are your todo items.</h3>
            {this.state.message !== "" && <div role="alert" className="alert alert-success"> 
              {this.state.message}
            </div>}
            <Search all_todos={this.state.all_todos} displayed_todos={this.state.displayed_todos} 
              updateDisplay={this.updateDisplay}/>
          </div>
          <div>
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Description</th>
                  <th scope="col">Category</th>
                  <th scope="col">Deadline</th>
                  <th scope="col">Created at</th>
                  <th scope="col" colSpan="2">Options</th>
                </tr>
              </thead>
              <tbody>
                { allTodos }
              </tbody>
            </table>
          </div>
          <Link className="btn btn-success btn-lg btn-block" role="button" to="/todo_items/new">
            <FontAwesomeIcon icon={faPlusSquare}/>Create New Todo!
          </Link>
        </div>
      )
    }

    else {
      return (
        <EditForm todo = {this.state.update} updateTodo = {this.updateTodo} 
          cancelUpdate = {this.cancelUpdate}/>
      )
    }
  }

}

export default TodoItems;