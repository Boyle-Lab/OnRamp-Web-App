import React, { Component } from "react";
import GenericDialog from './GenericDialog';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import REOptsTable from './REOptsTable'
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

/*
This code is part of the CGIMP distribution
(https://github.com/Boyle-Lab/CGIMP) and is governed by its license.
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

CONTACT: Adam Diehl, adadiehl@umich.edu
*/

const ActionButton = withStyles({
  root: {
      boxShadow: 'none',
      textTransform: 'none',
      boxShadow: 'none',
      border: '1px solid',
      padding: '1px 10px',
    },
})(Button);

// This toggles several console.log messages for dubugging purposes.
const verbose = false;

class REOpts extends Component {
    constructor(props) {
        super(props);
	this.state = {
	    showREOpts: false
	}
    }

    updateStateSettings = (name, value) => {
        this.setState({ [name]: value }, () => { if (verbose) {console.log(name, this.state[name]) } });
    }
    
    render () {
	//console.log(this.props);
        return (
		<div>
		<Tooltip title="Enter or change restriction enzymes used to linearize plasmids for sequencing.">
		<span>
		<ActionButton
	            variant="contained"
	            disabled={!this.props.refFiles.length}
	            disableRipple
	            onClick={() => this.setState({"showREOpts": true})}
		>
		    Edit Restriction Enzymes
	        </ActionButton>
		</span>
		</Tooltip>
		<GenericDialog
                    name={'Edit Restriction Enzymes'}
                    open={this.state.showREOpts}
                    onClose={(event, reason) => {
			if (reason === "backdropClick") {
			    return false;
			}
		        this.setState({"showREOpts": false})}
		    }
                    content=<REOptsTable
	                        data={this.props.fastaREData}
	                        updateWrapperState={this.props.updateParentState}
	                        updateParentState={this.updateStateSettings}
	                        serverId={this.props.refServerId}
		            />
                    />
	        </div>
        );
    }
}

export default REOpts;
