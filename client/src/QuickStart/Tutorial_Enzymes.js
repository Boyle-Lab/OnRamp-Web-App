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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import OpenEnzymes from './images/Onramp_Open-Enzymes.png';
import EnzymesDialog from './images/Onramp_Enzymes-Dialog.png';
import EnterEnzymes from './images/Onramp_Enter-Enzymes.png';
import FindEnzymes from './images/Onramp_Find-Enzyme-Offsets.png';
import CloseEnzymes from './images/Onramp_Close-Enzymes-Dialog.png';

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
		            The plasmids in the example dataset were linearized for sequencing using restriction enzymes. Therefore, we must specify which restriction enzyme was used for each plasmid using the "Edit Restriction Enzymes" dialog.
	                </Typography>
	    
	            </Grid>
		    <Grid item xs={12}>
	    
	                <Typography align="left" variant="h6">
		<span className='bold'>1: Click the "Edit Restriction Enzymes" button.<br/></span>
		<img src={OpenEnzymes} alt="Open Edit Restriction Enzymes dialog"/><br />
            This will open the "Edit Restriction Enzymes" dialog.<br/>
<img src={EnzymesDialog} alt="Restriction Enzymes Dialog"/><br /><br/>
		        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>2: Use the entry form to enter the restrcition enzyme used for each plasmid.<br/></span>
                            For this experiment, type the restriction enzyme names corresponding to each of the three plasmid reference sequences according to the table below:<br/>

		            <img src={EnterEnzymes} alt="Enter Restriction Enzymes"/><br />
                        </Typography>
	    
	                <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>File</TableCell>
		                    <TableCell align="right">Enzyme</TableCell>
		                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>mp185_pEctrl-si-2-fw.fa</TableCell>
		                    <TableCell align="right">ZraI</TableCell>
		                </TableRow>
                                <TableRow>
                                    <TableCell>pENTR1a-prdm1_DHS30fw.fa</TableCell>
                                    <TableCell align="right">ZraI</TableCell>
		                </TableRow>
                                <TableRow>
                                    <TableCell>pLT.81_eb-SVpmx-spr33-0_gw-r33.fa</TableCell>
                                    <TableCell align="right">SwaI</TableCell>
		                </TableRow>
	                    </TableBody>
	                </Table>
	    
                        <Typography align="left" variant="h6">
                            <br/><span className='bold'>3: Click the "Find Offsets" button.<br/></span>
                            The On-Ramp engine will now find the location of the recognition site within each of the plasmid sequences.<br/>
                            <img src={FindEnzymes} alt="Find Restriction Enzyme Offsets"/><br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>4: Click the "Close Window" button to return to the job submission form.<br/></span>
                            Once restriction enzyme sites have been located, their positions will be shown in the "Offset" column.<br/>

                            <img src={CloseEnzymes} alt="Close Enzymes Dialog"/><br />
	    
	    If either no sites or multiple sites were found for the given restriction enzyme in any plasmids, an error message will be shown instead. If so, you will need to correct the errors and reclick the "Find Offsets" button. If there are no errors, the "Close Window" button will activate and you may close the "Edit Restriction Enzymes" dialog.<br/><br/>
                        </Typography>

		        <Typography align="left" variant="h6">
		            <span className='bold'>Tips:</span><br/>
		            1) If you did not use any restriction enzymes in your sequencing protocol (e.g., if you used a TN5 transposase tagmentation protocol for sequencing), you may skip this step for your own runs.<br/>
	                    2) You may mix plasmids sequenced with and without restriction enzymes. Just leave the enzyme field blank for plasmids on which they were not used.<br/>
	                    3) It is possible to include multiple clones of the same plasmid, as long as different restriction enzymes are used to linearize each clone.<br/>
                            4) Entering incorrect restriction enzyme data or failing to enter restriction enzymes when they were used will cause unreliable mapping results which will negatively affect your results.<br/>
                            5) You cannot close the "Edit Restriction Enzymes" dialog without first clicking the "Find Offsets" button. If you mistakenly opened the dialog, simply leave all fields blank and follow instructions 3-4. Your results will not be affected.<br/><br/>

	                </Typography>
		
                        <Typography align="left" variant="h6">
                            <span className='bold'>You are now ready to proceed to the next step...</span><br/>
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
