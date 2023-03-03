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

import GenericDialog from '../GenericDialog';
import ErrorContent from '../ErrorContent';

import RunNameParam from './images/Onramp_Params-Name.png';
import ModeParam from './images/Onramp_Params-Mode.png';
import MedakaModelParam from './images/Onramp_Params-Medaka-Model.png';
import NanofiltParam from './images/Onramp_Params-Nanofilt.png';
import PorechopParam from './images/Onramp_Params-Porechop.png';

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


class Tutorial_Params extends Component {
    constructor(props) {
        super(props);
	this.state = {
	    showCosntructionAlert: false
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
		            Step 3: Setting Run Parameters
	                </Typography>
		    </Grid>
                    <Grid item xs={12}>

                        <Typography align="left" variant="h5">
                            For this analysis, we will use the default options for all parameters. However, in your own runs, you may wish to use non-default settings. These options are introduced below and discussed in more detail elsewhere in the On-Ramp documentation. You are welcome to visit these resources now, or you can <Link onClick={ () => this.props.updateParentState({'showPage': 'tutorial_submit'}) } className={classes.icon}>click here</Link> to continue with the tutorial.<br/>
	                </Typography>
	    
	            </Grid>
		    <Grid item xs={12}>
	    
	                <Typography align="left" variant="h6">
		            <span className='bold'>1: Name your run<br/></span>
		            The "Run Name" field allows you to choose a unique and descriptive name for your dataset. You may set this to whatever you wish, or you may keep the randomly-generated name that has been prefilled for you.<br/>
		            <img src={RunNameParam} alt="Run Name Param"/><br /><br/>
		        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>2: Choose an analysis mode<br/></span>
	                    The default "Medaka" mode uses the Medaka program (citation) to generate a consensus sequence. Biobin mode uses a different algorithm to construct the consensus.<br/>
		            <img src={ModeParam} alt="Analysis Mode Param"/><br />
		            <Link onClick={ () => this.setState({'showConstructionAlert': true}) } className={classes.icon}>Learn More about Analysis  Modes</Link><br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>3: Select a Medaka consensus model<br/></span>
	                    For Medaka mode, the consensus model affects how reads are assembled into a consensus sequence.<br/>
		            <img src={MedakaModelParam} alt="Medaka Model Param"/><br />
		            <Link onClick={ () => this.setState({'showConstructionAlert': true}) } className={classes.icon}>Learn More about Medaka Consensus Models</Link><br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>4: Filter reads with Nanofilt<br/></span>
	                    Nanofilt provides the ability to filter reads by length and quality score.<br/>
		            <img src={NanofiltParam} alt="Nanofilt Param"/><br />
		            <Link onClick={ () => this.setState({'showConstructionAlert': true}) } className={classes.icon}>Learn More about Nanofilt</Link><br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>5: Trim adapters with Porechop<br/></span>
	                    Porechop will trim any adapters or adapter fragments from your reads, potentially improving alignments to the references.<br/>
		            <img src={PorechopParam} alt="Porechop Param"/><br />
		            <Link onClick={ () => this.setState({'showConstructionAlert': true}) } className={classes.icon}>Learn More about Porechop</Link><br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>Continue to the next step of the tutorial...</span><br/>
		            <Link onClick={ () => this.setState({'showPage': 'tutorial_submit'}) } className={classes.icon}>Submit your Run</Link><br/>
                        </Typography>
                    </Grid>
		</Grid>
		<GenericDialog
                    name={'Under Construction!'}
                    open={this.state.showConstructionAlert}
                    onClose={ () => this.props.updateParentState({"showConstructionAlert": false}) }
                    content=<Typography>Coming Soon; Thank you for your interest!</Typography>
                />
	    </div>
        );
    }
}

Tutorial_Params.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Tutorial_Params);
