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

import ResultsTable from './images/Onramp_Results-Table.png';
import GoHome from './images/Onramp_Go-Home.png';
import LoadSessionStart from './images/Onramp_Load-Session-Start.png';
import LoadSession from './images/Onramp_Load-Session.png';

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


class Tutorial_LoadStored extends Component {
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
		            Step 6: Loading Stored Sessions
	                </Typography>
		    </Grid>
                    <Grid item xs={12}>

                        <Typography align="left" variant="h5">
		            Results from all successful analyses are stored on the server for 24 hours from submission. This allows you to analyze multiple datasets or try different combinations of parameters on the same dataset and compare results.
	                </Typography>
	    
	            </Grid>
		    <Grid item xs={12}>
	    
	                <Typography align="left" variant="h6">
		            <span className='bold'>1: Click the "Home" icon.<br/></span>
		            This will return you to the run submission page.<br/>
		            <img src={GoHome} alt="Go Home"/><br /><br/>
		        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>2: Click the "Storage" icon.<br/></span>
                            This opens the stored sessions dialog.<br/>
                            <img src={LoadSessionStart} alt="Load a stored session"/><br /><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>3: Choose a session and click anywhere on its table row.<br/></span>
                            <img src={LoadSession} alt="Select a session to load"/><br /><br/>
		            The selected dataset will now load in the results display.<br/><br/>
                            <img src={ResultsTable} alt="Select a session to load"/><br /><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>Tips:<br/></span>
                            1) The Stored Sessions dialog is available from anywhere on the site to instantly access results analyzed within the last 24 hours.<br/>
	                    2) If you need access to a set of results beyond 24 hours, you may download them directly from the results page.<br/><br/>
                        </Typography>
	    
                        <Typography align="left" variant="h6">
                            <span className='bold'>You have now completed the tutorial! Continue to the conclusions...</span><br/>
                            <Link onClick={ () => this.props.updateParentState({'showPage': 'tutorial_conclusion'}) } className={classes.icon}>Conclusion</Link><br/>
                        </Typography>
	    
	    
                    </Grid>
		</Grid>
	    </div>
        );
    }
}

Tutorial_LoadStored.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Tutorial_LoadStored);
