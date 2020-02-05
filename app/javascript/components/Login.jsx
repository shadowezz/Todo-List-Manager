import React, { Component } from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'

//Login page
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      email: '',
      password: '',
      errors: ''
     };
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

//updates the corresponding state when form input changes
handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
};

//submits login form to backend for authentication
handleSubmit(event) {
  event.preventDefault()
  this.props.clearMessage();
  const {email, password} = this.state
  let user = {
    email: email,
    password: password
  }
  /*If login successful, create local storage to store user data,
  update login state and redirect to main page.
  If unsuccessful, clear form data and display error message */
  axios.post('api/v1/login', {user}, {withCredentials: true})
      .then(response => {
        if (response.data.logged_in) {
          localStorage.setItem('username', response.data.user.username)
          localStorage.setItem('email', response.data.user.email)
          this.props.updateLogin(response.data)
          this.props.clearMessage()
          this.props.history.push('/todo_items')
        } else {
          this.setState({
            errors: response.data.errors,
            email: '',
            password: ''
          })
        }
      })
      .catch(error => console.log('api errors:', error))
};

//display login form
render() {
    const {username, email, password} = this.state
return (
        <div className="container-fluid">
          <div className="row justify-content-center align-items-center h-100">
            
            <div className="col-md-3 row-md-6 border border-dark rounded-lg">
              <h3>Log In</h3>
              {/* Area to display error messages if any */}
              {this.state.errors !== "" && <div role="alert" className="alert alert-danger">
                {this.state.errors}
              </div>}
              {this.props.message !== "" && <div role="alert" className="alert alert-info">
                {this.props.message}
              </div>}
              {/* Login form */}
              <form role="form" onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label>Email address</label>
                  <input
                    className="form-control"
                    placeholder="Enter email"
                    type="text"
                    name="email"
                    value={email}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    className="form-control"
                    placeholder="Enter password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="text-center">
                  <button className="btn btn-success btn-block" placeholder="submit" type="submit">
                    Log In
                  </button>
                  <div>
                    <Link to='/signup'>Sign up for a new account!</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
    );
  }
}
export default Login;