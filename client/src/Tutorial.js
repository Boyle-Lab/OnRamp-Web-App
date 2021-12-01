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

import SplashImage from './splash-image.svg';
import StartButton from './StartButton.svg';

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


class Tutorial extends Component {
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
		<Grid container spacing={2} alignItems='center'>
		    <Grid item xs={2}>
		        Nav Goes Here
		    </Grid>
		    <Grid item xs={10}>
		        <Grid container spacing={2} alignItems='flex-start'>
		            <Grid item xs={12}>
		               Content 1
	                    </Grid>
		            <Grid item xs={12}>
                                Content 2
                            </Grid>
	                </Grid>
                    </Grid>
		</Grid>
		<div className={classes.appBarSpacer} />
		<div className={classes.appBarSpacer} />
	    </div>
        );
    }
}

Tutorial.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Tutorial);
