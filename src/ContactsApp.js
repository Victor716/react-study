import React, { Component, PropTypes } from 'react';
import ReactDOM, { render } from 'react-dom';
import propTypes from 'prop-types';
import 'whatwg-fetch';
import update from 'react-addons-update';
var contactsData = require('./contacts.json');

let student = {name: 'John', grades: ['A','C','B']};
//let newStu = update(student, {grades: {$push: ['A']}});
let newStu = update(student, {grades: {$set: ['A']}});
console.log(newStu);

class ContactItem extends Component {
	render() {
		console.log("ContactItem render", this.props.name);
		return (<li>{this.props.name} - {this.props.email}</li>);
	}
}

ContactItem.propTypes = {
	name: propTypes.string.isRequired,
	email: propTypes.string.isRequired
}


class ContactList extends Component {
	render() {
		console.log("ContactList render", this.props.contacts);
		
		let filteredContacts = this.props.contacts.filter(
			(contact) => contact.name.indexOf(this.props.filterText) !== -1
		);
		console.log("filteredContacts", filteredContacts);
		return (<ul>
					{filteredContacts.map(
						(contact) => <ContactItem key={contact.email} name={contact.name} email={contact.email} />
					)}
				</ul>);
	}
}

class SearchBar extends Component {
	handleChange(event) {
		console.log('handleChange', event.target.value);
		this.props.onUserInput(event.target.value)
	}
	render() {
		return(<input type='search' plcaeholder='search' value={this.props.filterText} onChange={this.handleChange.bind(this)} />);
	}
}

SearchBar.propTypes = {
	onUserInput: propTypes.func.isRequired,
	filterText: propTypes.string.isRequired
}

class ContactsApp extends Component {
	constructor() {
	    super();
	    this.state = {
	    	filterText: ''	
	    }
	}
	
	handleUserInput(searchTerm) {
		console.log('handleUserInput', searchTerm)
		this.setState({filterText: searchTerm})
	}
	render() {
		return (<div>
			<SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)} />
			<ContactList contacts={this.props.contacts} filterText={this.state.filterText} />
		</div>);
	}
}

ContactsApp.propTypes = {
	contacts: propTypes.arrayOf(propTypes.object)
}

class ContactsAppContainer extends Component {
	constructor() {
	    super();
	    this.state = {
	    	contacts: []
	    }
	}
	
	componentDidMount() {
//		fetch('./src/contacts.json').then((response) => response.json()).then((resData) => {
//			this.setState({contacts: resData})
//		}).catch((error) => {
//			console.log('Error fetching and parsing data', error);
//		})
		console.log(contactsData.data)
		if (contactsData.data) this.setState({contacts: contactsData.data})
	}
	
	handleUserInput(searchTerm) {
		console.log('handleUserInput', searchTerm)
		this.setState({filterText: searchTerm})
	}
	render() {
		return (<ContactsApp contacts={this.state.contacts} />);
	}
}


render(<ContactsAppContainer />, document.getElementById('root'));