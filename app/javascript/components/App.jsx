import React, { Component } from 'react';
import axios from 'axios'
import {BrowserRouter, Switch, Route, Redirect, withRouter} from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Signup from './Signup'
import TodoItems from './TodoItems'
import NewTodo from './NewTodo'
import EditForm from './EditForm'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isLoggedIn: false,
      user: {}
     };
  }
  componentDidMount() {
    this.loginStatus()
  }
  loginStatus = () => {
    axios.get('api/v1/logged_in', {withCredentials: true})
    .then(response => {
      if (response.data.logged_in) {
        this.handleLogin(response)
        
      } else {
        this.handleLogout()
      }
    })
    .catch(error => console.log('api errors:', error))
  }
  handleLogin = (data) => {
    this.setState({
      isLoggedIn: true,
      user: data.user
    })
  }
  handleLogout = () => {
    axios.delete('/api/v1/logout', {withCredentials:true})
      .then(response => {
        localStorage.removeItem('logged_in');
        <Redirect to='/' />
      })
      .catch(error => console.log(error))
    this.setState({
      isLoggedIn: false,
      user: {}
    })
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
              <TodoItems {...props} handleLogout={this.handleLogout}/>
              )}
            />
            <Route
              exact path='/todo_items/new'
              render={props => (
              <NewTodo {...props} handleLogout={this.handleLogout} loggedInStatus={this.state.isLoggedIn}/>
              )}
            />
            {/*<Route
              exact path='/todo_items/update'
              render={props => (
              <EditForm {...props} handleLogout={this.handleLogout}/>
              )}
              /> */}
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
export default App;