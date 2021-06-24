// /client/App.js

import React, { Component } from "react";

import Dashboard from './Dashboard';
import LoadAlertDialog from './LoadAlert';
import IntersectUserData from './IntersectUserData';
import ResultsDisplay from './Results';

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
	    algnFile: null
	};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
	// Clean up our area.
    }

    // Handle state change requests from the settings dialog.
    updateStateSettings = (name, value) => {
        this.setState({ [name]: value });
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
			            refServerId={this.state.refServerId}
			            resServerId={this.state.resServerId}
			            refFile={this.state.refFile}
			            algnFile={this.state.algnFile}
			        />
		                :
		                <IntersectUserData
	                            dataIsLoaded={this.state.dataIsLoaded}
	                            updateParentState={this.updateStateSettings}
			        />
			   }
	            onSettingsClick={this.handleSettingsClick}
		/>
		<LoadAlertDialog
	            open={!this.state.dataIsLoaded}
		/>
		</div>
	);
    }
}

export default App;
