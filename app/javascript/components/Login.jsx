import React, { Component } from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'



class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      email: '',
      password: '',
      errors: ''
     };
  }
handleChange = (event) => {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  };
handleSubmit = (event) => {
    event.preventDefault()
    const {email, password} = this.state
let user = {
      email: email,
      password: password
    }
    
axios.post('api/v1/login', {user}, {withCredentials: true})
    .then(response => {
      if (response.data.logged_in) {
        // localStorage.setItem('logged_in', true)
        // localStorage.setItem('username', response.data.user.username)
        // localStorage.setItem('email', response.data.user.email)
        this.props.handleLogin(response.data.user)
        this.redirect()
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
redirect = () => {
    this.props.history.push('/todo_items')
  }

render() {
    const {username, email, password} = this.state
return (
        <div className="container-fluid">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-3 row-6 border border-dark rounded-lg">
              <h3>Log In</h3>
              {this.state.errors !== "" && <div role="alert" className="alert alert-danger">
                {this.state.errors}
              </div>}
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