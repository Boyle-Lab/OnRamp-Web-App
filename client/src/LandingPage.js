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

import SplashImage from './images/splash-image.svg';
import StartButton from './images/StartButton.svg';

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


class LandingPage extends Component {
    constructor(props) {
        super(props);
	this.state = {
        };
    }
    
    render () {
	const { classes } = this.props;
        return (
		<div>
		<Grid container spacing={2} alignItems='center'>
		<Grid item xs={12}>
		<div className={classes.appBarSpacer} />
		<img src={SplashImage} width="900"/>
		</Grid>
		<Grid item xs={12}>
		<Typography variant='h4'>
		Click Below to Get Started!
	        </Typography>
		</Grid>
		<Grid item xs={12}>
		<Tooltip title="Get Started!">
		<Link onClick={() => this.props.updateParentState({'showLandingPage': false})}>
		<img src={StartButton} width="100" className={classes.icon}/>
		</Link>
                </Tooltip>		
		</Grid>
		<Grid item xs={12}>
		<Typography variant="h5">
		    <span className='bold'>On-Ramp (Oxford-Nanopore based Rapid Analysis of Multiplexed Plasmids)</span> is your one-stop shop for rapid analysis of plasmid sequencing data. Just upload your files, choose your options, and submit your analysis to the cloud! Results for most datasets are ready in minutes, including quality metrics such as sequencing coverage, gaps, and mismatch counts, and easy access to sequence alignments and an integrated IGV Browser view at your fingertips. <span className='bold'>Click the animated circle to get started!</span>
	        </Typography>
		</Grid>
                <Grid item xs={12}>
                <Typography variant="h5">
		<span className='bold'>Not ready yet? Try this instead...</span><br/>
		<Link onClick={() => this.props.updateParentState({ 'showLandingPage': false,
								    'showTutorial': true })} className={classes.icon}>View the quick-start guide and interactive tutorial.</Link><br/>
		<Link onClick={ () => this.props.showExampleResults() } className={classes.icon}>Take a look at some example results.</Link>
	        </Typography>

	    </Grid>
		</Grid>
		<div className={classes.appBarSpacer} />
		<div className={classes.appBarSpacer} />
	    </div>
        );
    }
}

LandingPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LandingPage);
