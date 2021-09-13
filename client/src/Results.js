// /client/App.js

import React, { Component } from "react";
import IgvDialog from './IgvDialog';
import Downloader from './Downloader';
import ResultsTable from './ResultsTable';
import InfoDialog from './InfoDialog';
import Tooltip from '@material-ui/core/Tooltip';
import GenericDialog from './GenericDialog';
import RunParams from './RunParams';

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
	    showIgv: false,
	    showRunParams: false
	};
    }

    componentDidMount() {
	console.log(this.props.runParams);
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

    handleClick = target => event => {
	this.setState({ [target]: !this.state[target] });
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
	            sessionName={this.props.sessionName}
		/>
		<InfoDialog
	            open={this.state.showInfoDialog}
	            onClose={this.hideInfo}
	            name={this.state.infoDialogName}
	            content={this.state.infoDialogContent}
		/>
		<IgvDialog
	            open={this.state.showIgv}
	            onClose={() => this.handleClick("showIgv")}
	            refFile={this.props.refFile}
	            algnFile={this.props.algnFile}
	            resServerId={this.props.resServerId}
		/>
		<GenericDialog
                    name="Run Parameters"
                    open={this.state.showRunParams}
                    onClose={this.handleClick("showRunParams")}
                    content={<RunParams runParams={this.props.runParams}/>}
                />
		{this.state.showIgv ?
		 <Tooltip title="Hide the IGV Browser dialog.">
		 <button onClick={this.handleClick("showIgv")}>
		     Hide IGV Browser
		 </button>
		 </Tooltip>
		 :
		 <Tooltip title="Show results in the IGV Browser.">
		 <button onClick={this.handleClick("showIgv")}>
		     Show Results in IGV Browser
		 </button>
		 </Tooltip>
		}
		<button onClick={this.handleClick("showRunParams")}>
		    Show Run Parameters
	        </button>
		<Downloader
	            serverId={this.props.resServerId}
		/>
		</div>
	);
    }
}

export default ResultsDisplay;
