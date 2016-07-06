import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'

import AppView from './AppView.js'

// parameters note >> http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC 


// Start out by creating a collection where we will get all our our api results.
const app = function() {

    var GifCollection = Backbone.Collection.extend({
        //The params should be stated here according to what the api requires to make a request.
        url: 'http://api.giphy.com/v1/gifs/search',
        _key: 'dc6zaTOxFJmzC',

        parse: function(jsonResp) {
            return jsonResp.data
        }

    })

    //The heart of of the app where all changing of views is handled.
    const GifRouter = Backbone.Router.extend({
        routes: {
            //search is the first part of the hash seperated by /:query,  query can now be passed an input to _handleSearch.
            'search/:query': '_handleSearch',
            'home': 'showAllGifs',
            '#default': 'redirect'
        },

        _handleSearch: function(query) {
        	//Make a new instance of the collection in order to invoke it.
    		var gifColl = new GifCollection()

            gifColl.fetch({
                //Fetch requires some data, otherwise will default to taking JUST whats in url.  (Which is not enough for a request here.)
                data: {
                    //Fetch will get url naturally, but also needs our apikey and a q, or query.  We'll throw in a dummy search.	
                    api_key: gifColl._key,
                    q: query
                }
            })
            //Since we're using React to render views here, this is where we 'mount' the component.  Basically we are loading in the info that will be rendered.  Note that we aren't using .then here.  With React, we have a virtual DOM always listening for changes, once it hears the change, it will auto render with new data.  Zamn!
            ReactDOM.render(<AppView collection={gifColl} />, document.querySelector('.container'))
        
        },

        redirect: function() {
            location.hash = 'home'
        },

        initialize: function() {
        	Backbone.history.start()
        }

    })

    var rtr = new GifRouter()

}

app()
