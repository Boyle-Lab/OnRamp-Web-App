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

import StartPageImg from './images/Onramp_StartPage_annotated.png';
import ResultsPageImg from './images/Onramp_ResultsPage_annotated.png';

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


class Page1 extends Component {
    constructor(props) {
        super(props);
	this.state = {
        };
    }
    
    render () {
	const { classes, showExampleResults } = this.props;
        return (
		<div>
		<div className={classes.appBarSpacer} />
		<Grid container spacing={2} alignItems='flex-start' alignContent='flex-start'>
		    <Grid item xs={12}>
		        <Typography variant='h4' style={{fontWeight: "bold"}}>
		            Quick Start
	                </Typography>

		        <div className={classes.appBarSpacer} />
		        <img src={StartPageImg} width={800} height={495} alt="Start Page Image"/><br />
		        <div className={classes.appBarSpacer} />
		
		        <Typography align='left' variant='h5' style={{fontWeight: "bold"}}>
		            Using On-Ramp is as easy as 1, 2, 3!<br /><br />
	                </Typography>
		        <Typography align='left' variant='h6'>
		            <span className='bold'>1)</span> Upload your sequencing data and a reference fasta file for <span className='bold italic'>every plasmid sequenced</span><span className='superscript italic'>*</span> using the drop zone<span className='superscript'>**</span>...<br />
	                    <span className='bold'>2)</span> Customize your settings in the control panel, if desired...<br />
                            <span className='bold'>3)</span> Click the "Submit" button to start your run!<br /><br />
    
                            <span className='small'>* It is <span className='bold italic'>critical</span> to upload a reference fasta file for <span className='bold italic'>all</span> plasmids included in the given sequencing results! Failing to do so will result in improperly mapped sequencing reads that artificially inflate gap and mismatch counts.<br />
                            ** Sequencing files (<span className='bold italic'>fastq format only</span>) and reference sequences (<span className='bold italic'>fasta format only</span>) may be compressed with gzip to reduce upload times.<br /><br /></span>
                        </Typography>
                        <Typography align='left' variant='h5'>
                            Once your run is submitted, you can sit back and relax! Results will appear as soon as they are ready...
                        </Typography>

                        <div className={classes.appBarSpacer} />
                        <img src={ResultsPageImg} width={800} height={580} alt="Results Page Image"/><br />
                        <div className={classes.appBarSpacer} />
                        <Typography align='left' variant='h5' style={{fontWeight: "bold"}}>
                            Results are simple, with details at your fingertips!<br /><br />
                        </Typography>
                        <Typography align='left' variant='h6'>
    <span className='bold'>1)</span> The Results Table summarizes results with color codes to show at a glance which plasmids are of high quality and which may have issues, such as gaps or mismatches. Detailed metrics used in calculating quality scores for each plasmid, including overall sequencing coverage, mismatches, and gap counts, can be found in each row. You can get even more in-depth by viewing the reference and consensus sequences and their pairwise alignments to see where substitutions and gaps occurred.<br />
                            <span className='bold'>2)</span> Action buttons enable you to visualize your results in the integrated IGV browser, download results for local analysis, and view run parameters.<br />
                            <span className='bold'>3)</span> Navigation buttons: the storage icon gives you access to all datasets submitted in the last 24 hours, and a click on the home icon will return you to the start page where you can submit more datasets for analysis!<br /><br />
    </Typography>
    <Typography align='left' variant='h5' style={{fontWeight: "bold"}}>
    <Link onClick={ () => showExampleResults() } className={classes.icon}>Click here to view example results in the app!</Link>
</Typography>
                    </Grid>
                </Grid>
                <div className={classes.appBarSpacer} />
                <div className={classes.appBarSpacer} />
	        </div>
        );
    }
}

Page1.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Page1);
