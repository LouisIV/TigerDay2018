import React, { Component } from 'react'
class DataForm extends Component {
	constructor(props){
		super(props)
		this.state = {
		    maxNotesLength: 128,
		    notesLength: 0,
		    highButtonClass: "Option-button high",
		    medButtonClass: "Option-button med",
		    lowButtonClass: "Option-button low-p",
		}
		this.handleTextAreaChange = this.handleTextAreaChange.bind(this)
		this.handlePriorityChange = this.handlePriorityChange.bind(this)
	}

	handleTextAreaChange(e) {
		this.props.updateNotesForm(e.target.value);
		this.setState({notesLength: e.target.value.length });
	}

	handlePriorityChange(e) {
		let newPriority = e.target.id;
		switch(newPriority){
			case "high-p":
				this.setState({
					highButtonClass: "Option-button high-p",
				    medButtonClass: "Option-button med",
				    lowButtonClass: "Option-button low",
				});
				this.props.onPriorityChange(0);
				break;
			case "med-p":
				this.setState({
					highButtonClass: "Option-button high",
				    medButtonClass: "Option-button med-p",
				    lowButtonClass: "Option-button low",
				});
				this.props.onPriorityChange(1);
				break;
			case "low-p":
				this.setState({
					highButtonClass: "Option-button high",
				    medButtonClass: "Option-button med",
				    lowButtonClass: "Option-button low-p",
				});
				this.props.onPriorityChange(2);
				break;
			default:
				break;
		}
	}

	render() {
		let className = "";
		let charsRemaining = this.state.maxNotesLength - this.state.notesLength;
		if (charsRemaining <= 0){
			className = "error";
		}

		return (
			<div style={{display: 'flex', flexDirection: 'column'}}>
				<div className="User-input-box" style={{flexDirection: 'row', order: 1, justifyContent: "center"}}>
					<button id={"low-p"} onClick={this.handlePriorityChange} className={this.state.lowButtonClass} style={{marginLeft: 0}}>
						<label style={{color: 'inherit'}}>1</label>
					</button>
					<button id={"med-p"} onClick={this.handlePriorityChange} className={this.state.medButtonClass}>
						<label style={{color: 'inherit'}}>2</label>
					</button>
					<button id={"high-p"} onClick={this.handlePriorityChange} className={this.state.highButtonClass} style={{marginRight: 0}}>
						<label style={{color: 'inherit'}}>3</label>
					</button>
				</div>		
	            <label style={{order: 2}}>Notes:</label>
	            <textarea
	              type="text"
	              maxLength={this.state.maxNotesLength}
	              onChange={this.handleTextAreaChange}
	              style={{order: 3, color: "var(--dark-grey)", }}
	            />
	            <label style={{order: 4, textAlign: 'right', fontSize: '1em'}} className={className}>{charsRemaining}</label>
	        </div>
		)
	}
}
export default DataForm;