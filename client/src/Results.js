// /client/App.js

import React, { Component } from "react";
import IgvBrowser from './IgvBrowser';
import Downloader from './Downloader';
import ResultsTable from './ResultsTable';
import InfoDialog from './InfoDialog';

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
	    showInfoDialog: false,
	    infoDialogContent: null,
	    infoDialogName: null,
	    showIgv: false
	};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
	// Clean up our area.
    }

    showInfo = (event) => {
	this.setState({ "infoDialogName": event.target[0].value,
			"infoDialogContent": event.target[1].value,
			"showInfoDialog": true });
	event.preventDefault();
    }

    hideInfo = () => {
	this.setState({ "showInfoDialog": false });
    }

    handleClick = (event) => {
	this.setState({ showIgv: !this.state.showIgv });
	event.preventDefault();
    }

    // Render the UI.
    render() {
	return (
		<div>
		<ResultsTable
	            names={["Plasmid Reference Fasta", "Quality Metrics", "Consensus Sequence", "Pairwise Alignment"]}
	            rows={this.props.resData}
	            handleInfoClick={this.showInfo}
		/>
		<InfoDialog
	            open={this.state.showInfoDialog}
	            onClose={this.hideInfo}
	            name={this.state.infoDialogName}
	            content={this.state.infoDialogContent}
		/>
		{this.state.showIgv ?
		<div>
		<IgvBrowser
	            refFile={this.props.refFile}
	            refServerId={this.props.refServerId}
	            algnFile={this.props.algnFile}
	            resServerId={this.props.resServerId}
		 />
		 <button onClick={this.handleClick}>Hide IGV Browser</button>
		 </div>
		 :
		 <button onClick={this.handleClick}>Show Results in IGV Browser</button>
		}
		<Downloader
	            serverId={this.props.resServerId}
		/>
		</div>
	);
    }
}

export default ResultsDisplay;
