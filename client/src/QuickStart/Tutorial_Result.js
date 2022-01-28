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


class Tutorial_Result extends Component {
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
		            Step 6: Viewing your Results
	                </Typography>
		    </Grid>
                    <Grid item xs={12}>

                        <Typography align="left" variant="h5">
		            Results are summarized in table form for easy interpretation at a glance. 
	                </Typography>
	    
	            </Grid>
		    <Grid item xs={12}>
	    
	                <Typography align="left" variant="h6">
		            <span className='bold'>1: Interpreting tabular results.<br/></span>
      	      	      	    <br/><br/>
		        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>2: Viewing reference and consensus sequences.<br/></span>
      	      	      	    <br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>3: Viewing pairwise alignments.<br/></span>
      	      	      	    <br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>4: Using the IGV browser to view read mappings.<br/></span>
      	      	      	    <br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>5: Viewing run parameters.<br/></span>
      	      	      	    <br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>6: Downloading results for local analysis.<br/></span>
                            <br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            Finish the tutorial...<br/>
                            <Link onClick={ () => this.props.updateParentState({'showPage': 'tutorial_conclusion'}) } className={classes.icon}>Conclusion</Link><br/>
                        </Typography>
	    
	    
                    </Grid>
		</Grid>
	    </div>
        );
    }
}

Tutorial_Result.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Tutorial_Result);
