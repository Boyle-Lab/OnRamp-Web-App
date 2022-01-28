import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Link from '@material-ui/core/Link';

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


// This toggles several console.log messages for dubugging purposes.
const verbose = false;
const host = window.location.protocol + "//" + window.location.host;
const apiHost = window.location.protocol + "//" + window.location.hostname + ':3001/api';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    appBarSpacer: theme.mixins.toolbar,
    icon: {
	cursor: 'pointer',
    }
});


class Tutorial_Enzymes extends Component {
    constructor(props) {
        super(props);
	this.state = {
        };
    }

    render () {
	const { classes } = this.props;
        return (
		<div>
		<div className={classes.appBarSpacer} />
		<Grid container spacing={2} alignItems='flex-start' alignContent='flex-start'>
		    <Grid item xs={12}>
		        <Typography variant="h4">
		            Step 2: Setting Restriction Enzymes
	                </Typography>
		    </Grid>
                    <Grid item xs={12}>

                        <Typography align="left" variant="h5">
		            The plasmids in the example dataset were linearized for sequencing using restriction enzymes. Therefore, we must specify which restriction enzyme was used for each plasmid using the "Edit Restriction Enzymes" dialog. This step is not necessary for plasmids sequenced using a TN5 transposase tagmentation protocol.
	                </Typography>
	    
	            </Grid>
		    <Grid item xs={12}>
	    
	                <Typography align="left" variant="h6">
		            <span className='bold'>1: Click the "Edit Restriction Enzymes" button.<br/></span>
                            This will open the "Edit Restriction Enzymes" dialog.<br/><br/>
		        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>2: Use the entry form to enter the restrcition enzyme used for each plasmid.<br/></span>
                            For this experiment, type the restriction enzyme names corresponding to each of the three plasmid reference sequences according to the table below:<br/>

	                    <br/><br/>
                        </Typography>
	    
                        <Typography align="left" variant="h6">
                            <span className='bold'>3: Click the "Find Offsets" button.<br/></span>
                            The On-Ramp engine will now find the location of the recognition site within each of the plasmid sequences, and the corresponding offset will then be shown in the far left column.<br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>4: Click the "Close Window" button to return to the job submission form.<br/></span>
                            With the restriction enzyme data successfully entered, you may now close the "Edit Restriction Enzymes" dialog by clicking the "Close Window" button, which will return you to the data submission page.<br/><br/>
                        </Typography>


                        <Typography align="left" variant="h6">
                            You are now ready to proceed to the next step...<br/>
                            <Link onClick={ () => this.props.updateParentState({'showPage': 'tutorial_params'}) } className={classes.icon}>Choosing Run Parameters</Link><br/>
                        </Typography>
	    
	    
                    </Grid>
		</Grid>
	    </div>
        );
    }
}

Tutorial_Enzymes.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Tutorial_Enzymes);
