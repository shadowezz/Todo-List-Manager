import React, { Component } from 'react';
import axios from 'axios'
import {Link} from "react-router-dom";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
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
    const {username, email, password, password_confirmation} = this.state
    let user = {
      username: username,
      email: email,
      password: password,
      password_confirmation: password_confirmation
    }
    axios.post('api/v1/users/create', {user}, {withCredentials: true})
      .then(response => {
        if (response.data.status === 'created') {
          this.props.handleLogin(response.data)
          this.redirect()
        } else {
          this.setState({
            errors: response.data.errors
          })
        }
      })
      .catch(error => console.log('api errors:', error))
  };
redirect = () => {
    this.props.history.push('/')
  }
handleErrors = () => {
    return (
      <div>
        <ul className="list-unstyled">{this.state.errors.map((error) => {
          return <li key={error}>{error}</li>
        })}
        </ul> 
      </div>
    )
  }
render() {
    const {username, email, password, password_confirmation} = this.state
return (
        <div className="container-fluid">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-3 row-6 border border-dark rounded-lg">
            <h3>Sign Up</h3>
            {this.state.errors !== "" && <div role="alert" className="alert alert-danger">
              {this.handleErrors()}
            </div>}        
            <form role="form" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  className="form-control"
                  placeholder="Enter username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={this.handleChange}
                />
              </div>
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
              <div className="form-group">
                <label>Password Confirmation</label>
                <input
                  className="form-control"
                  placeholder="Confirm Password"
                  type="password"
                  name="password_confirmation"
                  value={password_confirmation}
                  onChange={this.handleChange}
                />
              </div>
              <div className="text-center">
                <button className="btn btn-success btn-block" placeholder="submit" type="submit">
                  Sign Up
                </button>
                <Link to="/login">Already have an account?</Link>
              </div>        
            </form>
            
          </div>
        </div>
      </div>
    );
  }
}
export default Signup;