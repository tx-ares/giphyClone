import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'


//Top Level Component
const AppView = React.createClass({
	//State gets set at the top level. State belongs here, according to react Docs.
	//The idea is to keep one smart component that will listen to all changes so any change
	//can trigger a re-render.  Look up Flux design.
	getInitialState: function(){
		console.log("Got initial State")
		return {
			gifColl: this.props.collection,
			focus: ''
		}
	},

	componentWillMount: function(){
		console.log('mounting')

		this.state.gifColl.on('sync update', ()=>{
			
			this.setState({
				gifColl: this.state.gifColl
			})

		//We will need a pub sub system, or a event listener / action system.  Vanilla React does not have this, so we will utilize Backbone.Event.
		//So, when the 'newId' is triggered, do the annonymous function which will set state.
		Backbone.Events.on('newId', (payload) => {
			this.setState({
					focus: payload
				})
			})	
		})
	},

	render: function() {
		console.log("Render fired!")
		console.log(this.state.gifColl)

		return (
			<div className="container">
				<Header />
				<GifContainer gifId={this.state.focus} gifColl={this.state.gifColl} />
			{/* <div id="overlay"></div> */}
			</div>
			)
	}

})

const Header = React.createClass({
	
	_handleKeyDown: function(evt){
		if(evt.keyCode === 13){
			location.hash = "search/" + evt.target.value
			evt.target.value = ""
		}
	},

	render: function(){
		return(
			<header id="mainHeader">
				<h1>Riffy </h1>
				<h3> Let's see some gifs breh... 
				<input type="text" placeholder="search" onKeyDown={this._handleKeyDown} />
				</h3>
			</header>
			)
	}
})

const SingleGif = React.createClass({

	_assignId: function(){
		// this.props.setState()

		// With Backbone.Events we can create our own event.  Trigger will set it off, and anything listening with a on.('newId') will hear it. 
		Backbone.Events.trigger('newId', this.props.model.id)
	},

	render: function(){
		console.log(this.props.gifId)

		// if(this.props.model.gifId === this.props.)

		var focusClass = 'singleGif'

		if(this.props.model.id === this.props.gifId){
			focusClass = 'active singleGif'
		}

		return(
			<div className={focusClass} onClick={this._assignId}>
				<img src={this.props.model.get('images').downsized.url} />
				
			</div>
			)
	
	}
})

const GifContainer = React.createClass({
	
	_gifMap: function(gifModel){
		//Make note that here we are passing in model into props for this component, but key will not be passed.  Why?  Because key is a special react syntax that gets stored elsewhere to give the model a unique collection id or "cid".
		return <SingleGif gifId={this.props.gifId} model={gifModel} key={gifModel.cid} />
	},

	render: function(){
		// {this.props.gifColl.models[0].get('images').downsized.url}
		
		return(
			<div id="gifContainer">
				{this.props.gifColl.map(this._gifMap)}
			</div>
			)
	}
})


export default AppView