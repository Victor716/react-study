import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
import 'whatwg-fetch';
import update from 'react-addons-update';
import 'babel-polyfill';

//const API_URL = 'http://47.106.249.172:6777';
const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
	'Content-Type': 'application/json',
	Authorization: 'any-string-you-like'
}

class Search extends Component {
	constructor() {
		super();
		this.state = {
			searchTerm: 'React'
		}
	}
	handle(event) {
		this.setState({
			searchTerm: event.target.value.substr(0, 50)
		});
	}
	render() {
		return (
			<div>
				Search Term: <input type='search' value={this.state.searchTerm} onChange={this.handle.bind(this)}/>
			</div>
		);
	}
}


class CheckList extends Component {
	
	checkInputKeyPress(evt) {
		if (evt.key === 'Enter') {
			this.props.taskCallbacks.add(this.props.cardID, evt.target.value);
			evt.target.value = '';
		}
	}
	
	render() {
		let tasks = this.props.tasks.map((task, taskIndex) => {
			return  <li className='checklist-task'>
						<input type='checkbox' defaultChecked={task.done} onChange={
							this.props.taskCallbacks.toggle.bind(null, this.props.cardID, task.id, taskIndex)
						} />
						{task.name} {' '}
						<a href='#' className='checklist-task-rm' onClick={
							this.props.taskCallbacks.delete.bind(null, this.props.cardID, task.id, taskIndex)
						} >X</a>
					</li>
		});
		return (
			<div className="checklist">
				<ul>
					{tasks}
					<input type='text' className='checklist-addtask' placeholder='Type then hit enter to add a task' onKeyPress={this.checkInputKeyPress.bind(this)} />
				</ul>
			</div>
		);
	}
}

CheckList.propTypes = {
	cardId: propTypes.number,
	tasks: propTypes.arrayOf(propTypes.object),
	taskCallbacks: propTypes.object
}

class Card extends Component {
	constructor() {
		super();
		this.state = {
			showDetails: false
		}
	}
	
	toggleDetails() {
		console.log("=====toggleDetails=====");
		this.setState({showDetails: !this.state.showDetails});	
	}
	
	render() {
		let cardDetails;
		if (this.state.showDetails) {
			cardDetails = (
				<div>
					{this.props.description}
					<CheckList cardID='card-title' tasks={this.props.tasks} taskCallbacks={this.props.taskCallbacks}/>
				</div>
			);
		}
		return (
			<div className="card">
				<div className="card-title" onClick={this.toggleDetails.bind(this)} >
					{this.props.title}
				</div>
				{cardDetails}
			</div>
		);
	}
}

Card.propTypes = {
	id: propTypes.number,
	description: propTypes.string,
	color: propTypes.string,
	title: propTypes.string,
	cards: propTypes.arrayOf(propTypes.object),
	taskCallbacks: propTypes.object
}

class List extends Component {
	render() {
		var cards = this.props.cards.map((card) => {
			return  <Card id={card.id} title={card.title} description={card.description} tasks={card.tasks} taskCallbacks={this.props.taskCallbacks} />
		});
		return (
			<div className="list">
				<Search />
				<h1>{this.props.title}</h1>
				{cards}
			</div>
		);
	}
}

List.propTypes = {
	title: propTypes.string.isRequired,
	cards: propTypes.arrayOf(propTypes.object),
	taskCallbacks: propTypes.object
}

class Board extends Component {
	
	render() {
		return (
			<div className="app">
				<List id='todo' title='To Do' cards={this.props.cards.filter((card) => card.status === 'to-do')} taskCallbacks={this.props.taskCallbacks} />
				<List id='in-progress' title='In-Progress' cards={this.props.cards.filter((card) => card.status === 'in-progress')}  taskCallbacks={this.props.taskCallbacks} />
				<List id='done' title='Done' cards={this.props.cards.filter((card) => card.status === 'done')} taskCallbacks={this.props.taskCallbacks} />
			</div>
		);
	}
}

Board.propTypes = {
	cards: propTypes.arrayOf(propTypes.object),
	taskCallbacks: propTypes.object
}

class BoardContainer extends Component {
	constructor() {
	    super();
	    this.state = {
	    	cards: []
	    }
	}
	
	componentDidMount() {
		fetch(API_URL + '/cards', API_HEADERS)
		.then((res) => res.json())
		.then((r) => {
			this.setState({cards: r});
		})
		.catch((error) => {
			console.log('Error fetching and parsing data', error);
		})
	}
	
	addTask(cardID, taskName) {
		let cardIndex = this.state.cards.findIndex((card) => card.id == cardID);
		let newTask = {id: Date.now(), name: taskName, done: false};
		let nextState = update(this.state.cards, {
			[cardIndex]: {
				tasks: {$push: [newTask]}
			}
		});
		this.setState({cards: nextState});
		fetch(`${API_URL}/cards/${cardID}/tasks`, {
			method: 'post',
			headers: API_HEADERS,
			body: JSON.stringfy(newTask)
		}).then((res) => res.json())
		.then((r) => {
			newTask.id = r.id;
			this.setState({cards: nextState});
		})
	}
	
	deleteTask(cardID, taskID, taskIndex) {
		let cardIndex = this.state.cards.findIndex((card) => card.id == cardID);
		
		let nextState = update(this.state.cards, {
			[cardIndex]: {
				tasks: {$splice: [[taskIndex, 1]]}
			}
		});
		
		this.setState({cards: nextState});
		fetch(`${API_URL}/cards/${cardID}/tasks/${taskID}`, {
			method: 'delete',
			headers: API_HEADERS
		})
	}
	
	toggleTask(cardID, taskID, taskIndex) {
		console.log("=====toggleTask=====");
		let cardIndex = this.state.cards.findIndex((card) => card.id == cardID);
		console.log(cardIndex);
		let newDoneValue;
		let nextState = update(this.state.cards, {
			[cardIndex]: {
				tasks: {
					[taskIndex]: {
						done: {
							$apply: (done) => {
								newDoneValue = !done;
								return newDoneValue;
							}
						}
					}
				}
			}
		});
		this.setState({cards: nextState});
		
		fetch(`${API_URL}/cards/${cardID}/tasks/${taskID}`, {
			method: 'put',
			headers: API_HEADERS,
			body: JSON.stringfy({done: newDoneValue})
		})
	}
	
	render() {
		return (
			<Board cards={this.state.cards} taskCallbacks={{
				toggle: this.toggleTask.bind(this),
				delete: this.deleteTask.bind(this),
				add: this.addTask.bind(this)
			}}/>
		);
	}
}

export default BoardContainer;