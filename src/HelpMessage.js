import React, { Component } from 'react'
class HelpMessage extends Component {
	constructor(props){
		super(props)
		this.state = {
			message: "Enter your email to get started",
		}
	}

	render() {
		let className = "norm";
		let icons = null;
		if (this.props.status === "success") {
			icons = <i className="fa fa-check fa-lg success"></i>;
			className = "success";
		}
		else if (this.props.status === "error"){
			icons = <i className="fa fa-times-circle fa-lg error"></i>;
			className = "error";
		}
		else if (this.props.status === "warn"){
			icons = <i className="fa fa-exclamation-triangle"></i>;
			className = "warn";
		}
		else if(this.props.status === "loading"){
			icons = <i className="fa fa-spin fa-circle-o-notch"></i>;
			className = "norm";
		}

		return (
			<p className={className} style={{fontSize: '1em', fontWeight: 600}}>{icons} {this.props.message}</p>
		)
	}
}
export default HelpMessage;