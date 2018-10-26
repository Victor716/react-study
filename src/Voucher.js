import React, { Component, PropTypes } from 'react';
import ReactDOM, { render } from 'react-dom';
import propTypes from 'prop-types';
import update from 'react-addons-update';

class Voucher extends Component {
	constructor() {
		super();
		this.state = {
			passengers: ['Simon, Robert A.', 'Taylor, Kathleen R.'],
			ticket: {
				company: 'Delta',
				flightNo :'0990',
				departure: {
					airport: 'LAS',
					time: '2016-08-21T14:41:10.000Z'
				},
				arrival: {
					airport: 'MIA',
					time: '2016-08-21T14:41:10.000Z'
				},
				codeShare: [
					{company: 'GL', flightNo :'9840'},
					{company: 'TM', flightNo :'5101'}
				]
			}
		}
	}
}
