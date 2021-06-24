// /client/App.js

import React, { Component } from "react";
//import { useEffect } from 'react';
import LoadAlertDialog from './LoadAlert';

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

class ResultsDisplay extends Component {
    // initialize our state
    constructor(props) {
	super(props);
	this.state = {
	};
    }

    componentDidMount() {
	const igvDiv = document.getElementById("igv-div");
	let options =
	    {
		reference: {
		    name: this.props.refFile,
		    fastaURL: browser.apiAddr + '/getResult?serverId=' + this.props.refServerId + "&fileName=" + this.props.refFile + '&contentType=text/plain&encodingType=utf8',
		    indexed: false
		},
		tracks: [
		    {
			name: "Alignment",
			type: "alignment",
			format: "bam",
			sourceType: "file",
			url: browser.apiAddr + '/getResult?serverId=' + this.props.resServerId + "&fileName=" + this.props.algnFile + '&contentType=application/octet-stream',
			indexURL: browser.apiAddr + '/getResult?serverId=' + this.props.resServerId + "&fileName=" + this.props.algnFile + '.bai' + '&contentType=application/octet-stream'
		    }
		]
	    };
	igv.createBrowser(igvDiv, options)
	.then(function (browser) {
            console.log("Created IGV browser");
	});
    }
    
    componentWillUnmount() {
	// Clean up our area.
    }


    // Render the UI.
    render() {
	return (
		<div>
		<div id="igv-div">
		</div>		
		<Downloader
	            serverId={this.props.resServerId}
		/>
		</div>
	);
    }
}

class Downloader extends Component {
    constructor(props) {
        super(props);
	this.state = {
	    working: false
	};
    }
    
    downloadResults = () => {
	this.setState({ working: true });
	axios.post(browser.apiAddr + '/prepareResults',
		   { serverId: this.props.serverId }
		  )
	    .then( response => {
		this.setState({ working: false });
		const downloadURL = browser.apiAddr + '/downloadResults' +
		      '?serverId=' + response.data.data.serverId +
		      '&fileName=' + response.data.data.fileName
		window.location.href = downloadURL;
	    });
    }
    
    render() {
	return (
		<div>
		<LoadAlertDialog
                    open={this.state.working}
                    title={"Preparing Files..."}
	            message={"This may take several minutes; please be patient!"}
                />
		<button onClick={this.downloadResults}>Download Results</button>
		</div>
	);
    }
}

export default ResultsDisplay;
