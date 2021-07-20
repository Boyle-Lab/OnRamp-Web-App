// /client/App.js

import React, { Component } from "react";

import Dashboard from './Dashboard';
import LoadAlertDialog from './LoadAlert';
import IntersectUserData from './IntersectUserData';
import ResultsDisplay from './Results';
import Cookies from 'universal-cookie';
import CachedSessionDialog from './CachedSessionDialog';
import AcceptCookiesDialog from './AcceptCookiesDialog';

import browser from './browser_config';
import axios from "axios";

/*
This code is part of the bulk_plasmid_seq_web distribution
(https://github.com/Boyle-Lab/bulk_plasmid_seq_web) and is governed by its license.
Please see the LICENSE file that should have been included as part of this
package. If not, see <https://www.gnu.org/licenses/>.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

CONTACT: Adam Diehl, adadiehl@umich.edu; Camille Mumm, cmumm@umich.edu
*/
const _cookies = new Cookies();

class App extends Component {
    // initialize our state
    constructor(props) {
	super(props);
	this.state = {
	    mainTitle: "Bulk Plasmid Sequencing Web Tool",
	    dataIsLoaded: false,
	    showResults: false,
	    refServerId: null,
	    resServerId: null,
	    refFile: null,
	    algnFile: null,
	    resData: null,
	    useCookies: true,
	    useCached: false,
	    showCachedDialog: false,
	    showAcceptCookiesDialog: false
	};
    }

    componentDidMount() {
	const cookies =  _cookies.getAll();
	console.log(cookies);
	if (Object.keys(cookies).length == 0) {
	    this.setState({ 'showAcceptCookiesDialog': true });
	} else {
	    if ('resServerId' in cookies && 'refServerId' in cookies && 'refFile' in cookies) {
		this.setState({ 'showCachedDialog': true });
	    }
	}
    }

    componentWillUnmount() {
	// Clean up our area.
    }

    // Handle state change requests from the settings dialog.
    updateStateSettings = (name, value) => {
        this.setState({ [name]: value });
    }

    _updateStateSettings = (data) => {
	Object.keys(data).forEach( (key) => {
	    this.setState({ [key]: data[key] }, () => {
		console.log(key, this.state[key]);
	    });
	});
    }

    // Set cookies.
    setCookie = (data) => {
	if (this.state.useCookies) {
	    Object.keys(data).forEach( (key) => {
		_cookies.set(key, data[key], { 'maxAge': 86400 });
	    });
	    const cookies =  _cookies.getAll();
	    //console.log(cookies);
	}
    }

    // Reset cookies.
    resetCookies = () => {
	const cookies =  _cookies.getAll();
	Object.keys(cookies).forEach( (key) => {
            _cookies.remove(key);
        });
    }

    // Handle responses regarding cached data.
    handleCookiesClick = (data) => {
        this._updateStateSettings(data);
        this.resetCookies();
    }

    // Handle responses regarding cached data.
    handleCachedClick = (data) => {
	this._updateStateSettings(data);
	if (data.useCached) {
	    const cookies =  _cookies.getAll();
	    this.getCachedResults(cookies.resServerId, cookies.refServerId, cookies.refFile);
	} else {
	    //this.resetCookies();
	}
    }

    // Get a cached result set from the server.
    getCachedResults = (resServerId, refServerId, refFile) => {
	axios.post(browser.apiAddr + "/processCachedData",
                   {resServerId: resServerId,
		    refServerId: refServerId,
		    refFile: refFile
                   }
                  )
            .then(res => {
                // Display the results in the parent component.           
                this._updateStateSettings({
		    "refServerId": res.data.data.refServerId,
		    "resServerId": res.data.data.resServerId,
		    "refFile": res.data.data.refFile,
		    "algnFile": res.data.data.algnFile,
		    "dataIsLoaded": true,
		    "resData": res.data.stats,
		    "showResults": true
		});
            })
            .catch(error => {
                console.log(error);
                // Handle the error
            });
    }

    // Render the UI.
    render() {
	return (
		<div>
		<Dashboard
	           title={this.state.mainTitle}
	           controls={<div></div>}
	           content={this.state.showResults ?
		                <ResultsDisplay
                                    updateParentState={this.updateStateSettings}
			            resServerId={this.state.resServerId}
			            refFile={this.state.refFile}
			            algnFile={this.state.algnFile}
			            resData={this.state.resData}
			    />
		                :
		                <IntersectUserData
	                            dataIsLoaded={this.state.dataIsLoaded}
	                            updateParentState={this.updateStateSettings}
			            setCookie={this.setCookie}
			        />
			   }
	            handleChange={this._updateStateSettings}
		/>
		<AcceptCookiesDialog
                    open={this.state.showAcceptCookiesDialog}
                    handleResponse={this.handleCookiesClick}
                />
		<LoadAlertDialog
	            open={!this.state.dataIsLoaded}
	            message={'Please be patient; this may take several minutes!'}
		/>
		<CachedSessionDialog
                    open={this.state.showCachedDialog}
	            handleResponse={this.handleCachedClick}
                />
		</div>
	);
    }
}

export default App;
