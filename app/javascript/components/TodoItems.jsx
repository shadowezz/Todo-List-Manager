import React from "react";
import {Link} from "react-router-dom";
import axios from 'axios';
import EditForm from './EditForm';
import Search from './Search';
import NavBar from './NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheckCircle, faPencilAlt, faPlusSquare, faSortAlphaDown, faSortNumericDown, faSortNumericDownAlt} from '@fortawesome/free-solid-svg-icons'

//Current todo items page
class TodoItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_todos: [],
      displayed_todos: [],
      overdue_todos: 0,
      message: this.props.message,
      update: false,
      deleting: false,
      completing: false
    };

    this.updateTodo = this.updateTodo.bind(this)
    this.cancelUpdate = this.cancelUpdate.bind(this)
    this.updateDisplay = this.updateDisplay.bind(this)
    this.checkStatus = this.checkStatus.bind(this)
    this.completeTodo = this.completeTodo.bind(this)
    this.deleteTodo = this.deleteTodo.bind(this)
    this.dynamicSort = this.dynamicSort.bind(this)
    this.handleSort = this.handleSort.bind(this)
  }

  /*checks login status. 
  If logged in, fetch current todo items for current user from backend, 
  else redirect to login page with message. */
  async componentDidMount() {
    await this.props.checkLogin()
    console.log(this.props.isLoggedIn)
    if (!this.props.isLoggedIn) {
      this.props.history.push('/login')
      this.props.setMessage("Please login to continue.")

    }
    else {
      axios.get('/api/v1/todo_items/index')
        .then(response => {
          console.log(response.data);
          this.setState({all_todos: response.data, displayed_todos: response.data.map(this.checkStatus) });
        })
        .catch(error => console.log("api errors:", error))
      }
  }

  //check if the todo item is overdue
  checkStatus(todo) {
    if (new Date(todo.deadline).getTime() < new Date().getTime()) {
      todo["status"] = "overdue"
      this.setState({overdue_todos: this.state.overdue_todos + 1})
    }
    return todo
  }

  //update displayed todo items
  updateDisplay(newList) {
    this.setState({displayed_todos: newList})
  }

  //fetch the new set of current todo from backend after a todo has been updated
  updateTodo() {
    this.setState({update: false})
    axios.get('/api/v1/todo_items/index')
        .then(response => {
          console.log(response.data);
          this.setState({overdue_todos: 0})
          this.setState({all_todos: response.data, displayed_todos: response.data.map(this.checkStatus), 
            message: "Todo item updated successfully!"});
        })
        .catch(error => console.log("api errors:", error))
  }

  //cancels updating todo without posting to backend
  cancelUpdate() {
    this.setState({update: false})
  }

  /*move todo to "completed" list by updating its current_status on backend 
  and removing it on this page */
  completeTodo(todoItem) {
    let overdue = 0
    if (todoItem.status == "overdue") {
      overdue = 1
    }
    let todo = {current_status: "completed"}
    axios.put(`api/v1/update/${todoItem.id}`, {todo}, {withCredentials: true})
      .then(response => {
        console.log(response.data.status)
      })
    .then(this.setState({
      displayed_todos: this.state.displayed_todos.filter((item) => item.id != todoItem.id),
      message: "Todo item moved to Completed",
      completing: false,
      overdue_todos: this.state.overdue_todos - overdue
    }))
    .catch(error => console.log(error))
    console.log(this.state.message)
    console.log(this.props.message)
  }

  //delete todo from backend and remove from this page
  deleteTodo(todoItem) {
    let overdue = 0
    if (todoItem.status == "overdue") {
      overdue = 1
    }
    axios.delete(`/api/v1/destroy/${todoItem.id}`, {withCredentials:true})
      .then(response => {
        console.log(response.data.message)
        const new_todos = this.state.all_todos.filter((item) => item.id != todoItem.id)
        const new_display = this.state.displayed_todos.filter((item) => item.id != todoItem.id)
        this.setState({ 
          all_todos: new_todos, 
          displayed_todos: new_display, 
          message: response.data.message, 
          deleting: false,
          overdue_todos: this.state.overdue_todos - overdue})
      })
      .catch(error => console.log(error))
  }

  //sorts displayed todo based on attribute and order
  dynamicSort(key, order = 'asc') {
    return (a, b) => {
        let comparison = 0
        if (!a[key]) {
            return comparison
        }
        else if (a[key].toLowerCase() > b[key].toLowerCase()) {
            comparison = 1
        }
        else if (a[key].toLowerCase() < b[key].toLowerCase()) {
            comparison = -1
        }
        return (order === 'desc') ? comparison * -1 : comparison
    }
  }

  //allows sorting by "created_at" (desc), deadline (asc) and alpha(asc)
  handleSort(key) {
      let newList
      if (key === "created_at") {
        newList = this.state.displayed_todos.sort(this.dynamicSort(key, 'desc'))
      }
      else {
        newList = this.state.displayed_todos.sort(this.dynamicSort(key, 'asc'))
      }

      this.updateDisplay(newList)
  }

  //current todo page
  render() {
    const allTodos = this.state.displayed_todos.map((todo, index) => (
      <tr key={index} className={todo.status}>
        <th>{index + 1}</th>
        <td>{todo.title}</td>
        <td>{todo.description}</td>
        <td>{todo.category}</td>
        <td>{this.props.formatDate(todo.deadline)}</td>
        <td>{this.props.formatDate(todo.created_at)}</td>
        <td>
          <button className="btn btn-info" type="button" onClick={() => this.setState({update: todo})}>
            <FontAwesomeIcon icon={faPencilAlt}/> Update
          </button>
        </td>
        <td><button className="btn btn-warning" type="button" data-toggle="modal" data-target="#completeModal" 
          onClick={() => this.setState({completing: todo})}>
          <FontAwesomeIcon icon={faCheckCircle}/>Completed</button>
        </td>
        <td><button className="btn btn-danger" type="button" data-toggle="modal" data-target="#deleteModal" 
          onClick={() => this.setState({deleting: todo})}>
          <FontAwesomeIcon icon={faTrash}/>Delete</button>
        </td>
      </tr>
    ));

    //if not updating todo, return page with current todo
    if (!this.state.update) {
      return (
        <div className="container-fluid">
          <NavBar handleLogout={this.props.handleLogout} clearMessage={this.props.clearMessage}/>

          {/* popup modal that asks for confirmation when user completes todo */}
          <div className="modal fade" id="completeModal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Complete Todo Item</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Are you sure you want to complete this todo item "{this.state.completing.title}"?
                  This will be moved to the completed section.
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" data-dismiss="modal"
                    onClick={() => this.completeTodo(this.state.completing)}>Complete</button>
                </div>
              </div>
            </div>
          </div>

          {/* popup modal that asks for confirmation when user deletes todo */}
          <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog">
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
                    onClick={() => this.deleteTodo(this.state.deleting)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        <div>

            {/* standard page with a table of todo items */}
            <h1>Welcome {localStorage.getItem("username")}</h1>
            <h3>Here are your current todo items.</h3>
            {this.state.overdue_todos > 0 && <h5>You have {this.state.overdue_todos} overdue todo items!</h5>}
            {this.state.message !== "" && <div role="alert" className="alert alert-success"> 
              {this.state.message}
            </div>}
            <Search all_todos={this.state.all_todos} displayed_todos={this.state.displayed_todos} 
              updateDisplay={this.updateDisplay}/>
        </div>
        <div>
          <table className="table table-striped table-responsive">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">
                  Title
                  <button className="btn btn-sm btn-light" type="button" onClick={() => this.handleSort("title")}>
                    <FontAwesomeIcon icon={faSortAlphaDown}/>
                  </button>
                </th>
                <th scope="col">Description</th>
                <th scope="col">Category</th>
                <th scope="col">
                  Deadline
                  <button className="btn btn-sm btn-light" type="button" onClick={() => this.handleSort("deadline")}>
                    <FontAwesomeIcon icon={faSortNumericDown}/>
                  </button>
                </th>
                <th scope="col">
                  Created at
                  <button className="btn btn-sm btn-light" type="button" onClick={() => this.handleSort("created_at")}>
                    <FontAwesomeIcon icon={faSortNumericDownAlt}/>
                  </button>
                </th>
                <th scope="col" colSpan="3">Options</th>
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

    //if updating todo, display update form
    else {
      return (
        <EditForm todo = {this.state.update} updateTodo = {this.updateTodo}  
          cancelUpdate = {this.cancelUpdate}/>
      )
    }
  }

}

export default TodoItems;