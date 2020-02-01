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

     this.checkLogin = this.checkLogin.bind(this)
     this.handleLogin = this.handleLogin.bind(this)
     this.handleLogout = this.handleLogout.bind(this)
     this.setMessage = this.setMessage.bind(this)
     this.clearMessage = this.clearMessage.bind(this)
  }
  // componentDidMount() {
  //   this.checkLogin()
  // }
  async checkLogin() {
    console.log(this.state.isLoggedIn)
    await axios.get('/api/v1/logged_in', {withCredentials: true})
    .then(response => {
      console.log(response.data.logged_in)
      this.handleLogin(response.data)
    })
    .catch(error => console.log('api errors:', error))
    console.log(this.state.isLoggedIn)
  }

  handleLogin = (data) => {
    this.setState({
      isLoggedIn: data.logged_in,
      user: data.user
    })
  }
  handleLogout = () => {
    axios.delete('/api/v1/logout', {withCredentials:true})
      .then(response => {
        <Redirect to='/' />
      })
      .then(this.setState({
        isLoggedIn: false , user: {}, message: ''
      }))
      .catch(error => console.log(error))
    localStorage.removeItem("username")
    localStorage.removeItem("email")
  }

  setMessage(message) {
    this.setState({message: message})
  }

  clearMessage() {
    this.setState({message: ''})
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
              <Login {...props} handleLogin={this.handleLogin} message={this.state.message}
              clearMessage={this.clearMessage}/>
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
                isLoggedIn={this.state.isLoggedIn} checkLogin={this.checkLogin} user={this.state.user} formatDate={this.formatDate}
                setMessage={this.setMessage} clearMessage={this.clearMessage}/>
              )}
            />
            <Route
              exact path='/todo_items/new'
              render={props => (
              <NewTodo {...props} handleLogout={this.handleLogout} checkLogin={this.checkLogin}
               isLoggedIn={this.state.isLoggedIn} user={this.state.user} setMessage={this.setMessage}
               clearMessage={this.clearMessage}/>
              )}
            />
            <Route
              exact path='/todo_items/completed'
              render={props => (
              <CompletedTodo {...props} handleLogout={this.handleLogout} checkLogin={this.checkLogin}
                isLoggedIn={this.state.isLoggedIn} user={this.state.user} setMessage={this.setMessage} formatDate={this.formatDate}
                clearMessage={this.clearMessage}/>
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
export default App;