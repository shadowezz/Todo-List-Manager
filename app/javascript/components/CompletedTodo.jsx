import React from "react";
import {Link} from "react-router-dom";
import axios from 'axios';
import Search from './Search';
import NavBar from './NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSortAlphaDown, faSortNumericDown, faSortNumericDownAlt} from '@fortawesome/free-solid-svg-icons'

class CompletedTodo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_todos: [],
      displayed_todos: [],
      hasMessage: false,
      message: "",
      deleting: false,
    };
    this.updateDisplay = this.updateDisplay.bind(this)
  }

  async componentDidMount() {
    await this.props.checkLogin()
    console.log(this.props.isLoggedIn)
    if (!this.props.isLoggedIn) {
      this.props.history.push('/')
    }
    else {
      axios.get('/api/v1/todo_items/completed')
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

  handleSort(key) {
      let newList
      if (key === "created_at") {
        newList = this.state.displayed_todos.sort(this.dynamicSort(key, 'desc'))
      }
      else {
        newList = this.state.displayed_todos.sort(this.dynamicSort(key, 'asc'))
      }

      this.setState({displayed_todos: newList})
  }

  render() {
    const allTodos = this.state.displayed_todos.map((todo, index) => (
      <tr key={index} className="status" cond="hello">
        <th>{index + 1}</th>
        <td>{todo.title}</td>
        <td>{todo.description}</td>
        <td>{todo.category}</td>
        <td>{this.props.formatDate(todo.deadline)}</td>
        <td>{this.props.formatDate(todo.created_at)}</td>
        <td><button className="btn btn-danger" type="button" data-toggle="modal" data-target="#deleteModal" 
          onClick={() => this.setState({deleting: todo})}>
          <FontAwesomeIcon icon={faTrash}/>Delete</button>
        </td>
      </tr>
    ));

    return (
        <div className="container-fluid">
            <NavBar handleLogout={this.props.handleLogout} user={this.props.user}/>

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
                            onClick={() => this.deleteTodo(this.state.deleting.id)}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h1>Welcome {this.props.user.username}</h1>
                <h3>Here are your completed todo items.</h3>
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
                            <th scope="col">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                    { allTodos }
                    </tbody>
                </table>
            </div>
        </div>
    )
  } 
}

export default CompletedTodo