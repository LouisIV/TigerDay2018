import React, { Component } from 'react'
class HelpMessage extends Component {
	constructor(props){
		super(props)
		this.state = {
			message: "Enter your email to get started",
			hadError: false,
			hadSucess: false,
		}
	}

	render() {
		let className = "norm";
		let icons = null;
		if (this.props.hadSucess) {
			icons = <i className="fa fa-check fa-lg success"></i>;
			className = "success";
		}
		if (this.props.hadError){
			icons = <i className="fa fa-times fa-lg error"></i>;
			className = "error";
		}

		return (
			<p className={className} style={{fontSize: '1em', marginTop: 20}}>{icons} {this.props.message}</p>
		)
	}
}
export default HelpMessage;