import React, { Component } from 'react';
import axios from 'axios'
import {BrowserRouter, Switch, Route, Redirect, withRouter} from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Signup from './Signup'
import TodoItems from './TodoItems'
import NewTodo from './NewTodo'
import CompletedTodo from './CompletedTodo'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isLoggedIn: false,
      user: {},
      message: ''
     };
  }
  // componentDidMount() {
  //   this.loginStatus()
  // }
  // loginStatus = () => {
  //   axios.get('api/v1/logged_in', {withCredentials: true})
  //   .then(response => {
  //     if (response.data.logged_in) {
  //       this.handleLogin(response)
        
  //     } else {
  //       this.handleLogout()
  //     }
  //   })
  //   .catch(error => console.log('api errors:', error))
  // }
  handleLogin = (data) => {
    this.setState({
      isLoggedIn: true,
      user: data.user
    })
  }
  handleLogout = () => {
    axios.delete('/api/v1/logout', {withCredentials:true})
      .then(response => {
        localStorage.clear();
        <Redirect to='/' />
      })
      .catch(error => console.log(error))
    this.setState({
      isLoggedIn: false,
      user: {}
    })
  }

  setMessage = (message) => {
    this.setState({message: message})
  }

  formatDate(string) {
    let options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'}
    return new Date(string).toLocaleDateString([], options);
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route 
              exact path='/' 
              render={props => (
              <Home {...props} loggedInStatus={this.state.isLoggedIn}/>
              )}
            />
            <Route 
              exact path='/login' 
              render={props => (
              <Login {...props} handleLogin={this.handleLogin}/>
              )}
            />
            <Route 
              exact path='/signup' 
              render={props => (
              <Signup {...props} handleLogin={this.handleLogin}/>
              )}
            />
            <Route
              exact path='/todo_items'
              render={props => (
              <TodoItems {...props} handleLogout={this.handleLogout} message={this.state.message}
                formatDate={this.formatDate}/>
              )}
            />
            <Route
              exact path='/todo_items/new'
              render={props => (
              <NewTodo {...props} handleLogout={this.handleLogout} setMessage={this.setMessage}/>
              )}
            />
            <Route
              exact path='/todo_items/completed'
              render={props => (
              <CompletedTodo {...props} handleLogout={this.handleLogout} setMessage={this.setMessage}
                formatDate={this.formatDate}/>
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
export default App;