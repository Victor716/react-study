import React, { Component, PropTypes } from 'react';
import ReactDOM, { render } from 'react-dom';
import propTypes from 'prop-types';

class Greeter extends Component {
	render() {
		return (
			<h1>{this.props.saluation}</h1>
		);
	}
}


Greeter.propTypes = {
	saluation: propTypes.string.isRequired
}

Greeter.defaultProps = {
	saluation: 'Hello World!'
}

render(<Greeter />, document.getElementById('root'));
