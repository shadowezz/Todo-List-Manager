import React from "react";
import {Link} from "react-router-dom";
import axios from 'axios'
import DateTimePicker from 'react-datetime-picker'
import NavBar from './NavBar'

class NewTodo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            category: "",
            deadline: new Date(),
            errors: ""
        }
    ;}

    componentDidMount() {
        if (!localStorage.getItem('logged_in')) {
          this.props.history.push('/')
        }
    }
  

    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({
          [name]: value
        })
      }
    dateChange = (deadline) => {
      this.setState({deadline: deadline})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const {title, description, category, deadline} = this.state

        let todo = {
          title: title,
          description: description,
          category: category,
          deadline: deadline,
        }
        axios.post('/api/v1/todo_items/create', {todo}, {withCredentials: true})
            .then(response => {
            if (response.data.status === 'created') {
                this.props.setMessage("New Todo created successfully!")
                this.props.history.push('/todo_items')

                
            } else {
                this.setState({
                  errors: response.data.errors
                })
            }
            })
            .catch(error => console.log('api errors:', error))
        };

    handleErrors = () => {
        return (
          <div>
            <ul>{this.state.errors.map((error) => {
              return <li className="list-unstyled" key={error}>{error}</li>
            })}
            </ul> 
          </div>
        )
      }
    render() {
        const {title, description, category, deadline} = this.state
    return (
          <div className="container-fluid">
            <NavBar handleLogout={this.props.handleLogout}/>
            <div className="row justify-content-center align-items-center h-100">
              <div className="col-3 row-6 border border-dark rounded-lg">
                <h3>Create New Todo Item</h3>
                {this.state.errors != "" && <div role="alert" className="alert alert-danger"> 
                  {this.state.errors}
                </div>}
                <form role="form" onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      className="form-control"
                      placeholder="Enter Title"
                      type="text"
                      name="title"
                      value={title}
                      required
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter Description"
                      type="text"
                      name="description"
                      value={description}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      className="form-control"
                      placeholder="Enter Category"
                      type="text"
                      name="category"
                      value={category}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Deadline</label>
                    <br></br>
                    <DateTimePicker onChange={this.dateChange} value={deadline} name="deadline"
                    disableClock={true} minDate={new Date()} required/>
                  </div>

                  <div className="text-center">
                    <button className="btn btn-success btn-block" placeholder="submit" type="submit">
                      Create
                    </button>
                    <Link className="btn btn-secondary btn-block" type="button" to="/todo_items">Cancel</Link>
                  </div>
                  <br></br>
                </form>
              </div>
            </div>
          </div>
        );
      }
    
}

export default NewTodo;