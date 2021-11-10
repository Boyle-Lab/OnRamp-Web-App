// /client/App.js
import React, { Component } from "react";

import Dashboard from './Dashboard';
import LoadAlertDialog from './LoadAlert';
import StartRunWrapper from './StartRunWrapper';
import ResultsDisplay from './Results';
import Cookies from 'universal-cookie';
import CachedSessionDialog from './CachedSessionDialog';
import AcceptCookiesDialog from './AcceptCookiesDialog';
import GenericDialog from './GenericDialog';
import HelpContent from './HelpContent';
import LandingPage from './LandingPage';

//import { host, apiHost } from './browser_config';
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

// To enable debugging messages, set this to true.
const verbose = false;

const host = "http://" + window.location.host;
const apiHost = "http:" + host.split(':')[1] + ':3001/api';

class App extends Component {
    // initialize our state
    constructor(props) {
	super(props);
	this.state = {
	    mainTitle: "Bulk Plasmid Sequencing Web Tool",
	    dataIsLoaded: true,
	    showResults: false,
	    refServerId: null,
	    resServerId: null,
	    refFile: null,
	    algnFile: null,
	    resData: null,
	    sessionName: null,
	    runParams: null,
	    useCookies: true,
	    useCached: 0,
	    showCachedDialog: false,
	    showAcceptCookiesDialog: false,
	    enableSessionsButton: false,
	    showHelpDialog: false,
	    showLandingPage: true
	};
    }

    componentDidMount() {
	const cookies =  _cookies.getAll();
	if (Object.keys(cookies).length == 0) {
	    this.setState({ 'showAcceptCookiesDialog': true });
	} else {
	    this.setState({ 'enableSessionsButton': true });
	}
	console.log(host, apiHost);
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
		if (verbose) {
		    console.log(key, this.state[key]);
		}
	    });
	});
    }

    // Set cookies.
    setCookie = (data) => {
	if (this.state.useCookies) {
	    const session_key = Math.floor(1000000000 + Math.random() * 9000000000);
	    let cookie_str = "{";
	    Object.keys(data).forEach( (key, index) => {
		cookie_str = cookie_str + '"' +  key + '":"' + data[key] + '"';
		if (index !== Object.keys(data).length-1) {
		    cookie_str = cookie_str + ',';
		}
	    });
	    cookie_str = cookie_str + '}';
	     _cookies.set(session_key, cookie_str, { 'maxAge': 86400 });
	    //const cookies = _cookies.getAll();
	    //console.log(cookies);
	    this.setState({ enableSessionsButton: true });
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
	    const cookie = _cookies.get(data.useCached);
	    this.getCachedResults(cookie.resServerId, cookie.refServerId, cookie.refFile, cookie.name);
	}
    }

    // Get a cached result set from the server.
    getCachedResults = (resServerId, refServerId, refFile, sessionName) => {
	axios.post(apiHost + "/processCachedData",
                   {resServerId: resServerId,
		    refServerId: refServerId,
		    refFile: refFile,
		    name: sessionName
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
		    "showResults": true,
		    "sessionName": res.data.data.name,
		    "runParams": res.data.data.runParams,
		    "showLandingPage": false
		});
            })
            .catch(error => {
                console.log(error);
                // Handle the error
            });
    }

    // Render the UI.
    render() {
	if (verbose) {
	    console.log('Render App.js');
	}
	return (
		<div>
		<Dashboard
	           title={this.state.mainTitle}
	           controls={<div></div>}
	    content={this.state.showLandingPage ?
		     <LandingPage updateParentState={this.updateStateSettings}/>
		     : this.state.showResults ?
		                <ResultsDisplay
                                    updateParentState={this.updateStateSettings}
			            resServerId={this.state.resServerId}
			            refFile={this.state.refFile}
			            algnFile={this.state.algnFile}
			            resData={this.state.resData}
			            sessionName={this.state.sessionName}
			            runParams = {this.state.runParams}
			        />
		                :
		                <StartRunWrapper
	                            dataIsLoaded={this.state.dataIsLoaded}
	                            updateParentState={this.updateStateSettings}
			            setCookie={this.setCookie}
			        />
			   }
	            handleChange={this._updateStateSettings}
	            enableSessionsIcon={this.state.enableSessionsButton}
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
	            _cookies={_cookies}
	            cookies={_cookies.getAll()}
                />
		<GenericDialog
	            name={"How to Get Help"}
	            open={this.state.showHelpDialog}
	            onClose={() => this.updateStateSettings("showHelpDialog", false)}
	            content=<HelpContent/>
		    maxWidth={'md'}
	        />
		</div>
	);
    }
}

export default App;
