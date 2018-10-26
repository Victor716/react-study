import '../app/css/dashboard.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import BoardContainer from './Board';

let cardsList = [
	{
		id: 1,
		title: 'Read the book',
		description: 'I should read the book',
		status: 'in-progress',
		tasks: []
	},
	{
		id: 2,
		title: 'Write some code',
		description: 'Code along with the samples in the book',
		status: 'to-do',
		tasks: [
			{
				id: 1,
				name: "Contact list example",
				done: true
			}, {
				id: 2,
				name: "Kanban example",
				done: false
			}, {
				id: 3,
				name: "My example",
				done: true
			}
		]
	}
];

//Parent Component
class GroceryList extends Component {
	render() {
		return (
			<ul>
				<ListItem quantity="1" name="Bread" />
				<ListItem quantity="6" name="Eggs" />
				<ListItem quantity="2" name="Milk" />
			</ul>
		);
	}
}

//Child Component
class ListItem extends Component {
	render() {
		return (
			<li>
				{this.props.quantity} x {this.props.name} //this.props.children引用前置和后置tag间的内容
			</li>
		);
	}
}

class App extends Component {
	
	render() {
		var place = 'world!';
		return (
			<h1>Hello {place}</h1>
		);
	}
}

ReactDOM.render(<BoardContainer cards={cardsList} />, document.getElementById('root'));
