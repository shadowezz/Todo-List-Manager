import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

//Search bar display
class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchBy: "title",
        }
        this.handleSearch = this.handleSearch.bind(this)
        this.changeSearch = this.changeSearch.bind(this)
    }

    //toggles search attribute between 'title' and 'category'
    changeSearch(event) {
        this.setState({searchBy: event.target.value})
    }

    //filters todo list based on input in search box
    handleSearch(event) {
        let newList = []
        if (event.target.value !== "") {
            newList = this.props.all_todos.filter(item => {
                const parameter = this.state.searchBy === "title" ? item.title.toLowerCase()
                    : item.category.toLowerCase()
                const filter = event.target.value.toLowerCase()
                return parameter.includes(filter)
            })
        }
        else {
            newList = this.props.all_todos
        }
        this.props.updateDisplay(newList)
    }

    //Search bar display
    render() {
        return (
            <div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <FontAwesomeIcon icon={faSearch} size="lg" transform="down-7 left-3"/>
                        <select className="custom-select" defaultValue="title" onChange={this.changeSearch}>
                            <option value="title">Title</option>
                            <option value="category">Category</option>
                        </select>
                    </div>
                    <input className="form-control" type="text" onChange={this.handleSearch} 
                        placeholder={"Search by " + this.state.searchBy}/>
                    
                </div>
            </div>
        )
    }
}

export default Search