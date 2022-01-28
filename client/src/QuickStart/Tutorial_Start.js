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


class Tutorial_Start extends Component {
    constructor(props) {
        super(props);
	this.state = {
        };
    }

    downloadData = () => {
        const downloadURL = apiHost + '/downloadResults' +
              '?serverId=' + 'example_data' +
              '&fileName=' + 'example_data.tar.gz'
        window.location.href = downloadURL;
    }
    
    render () {
	const { classes } = this.props;
        return (
		<div>
		<div className={classes.appBarSpacer} />
		<Grid container spacing={2} alignItems='flex-start' alignContent='flex-start'>
		    <Grid item xs={12}>
		        <Typography variant="h4">
		            Getting Started
	                </Typography>
		    </Grid>
                    <Grid item xs={12}>

                        <Typography align="left" variant="h5">
		            Welcome to On-Ramp! This tutorial will guide you through the process of submitting your first plasmid sequencing dataset and navigating the results page to evaluate plasmid quality.
	                </Typography>
	    
	            </Grid>
		    <Grid item xs={12}>
	    
	                <Typography align="left" variant="h6">
		            <span className='bold'>1: Download the example dataset.<br/></span>
	        Use the link below to download the example dataset. This file is a tar archive compressed with gzip, containing four files: a fastq file with sequencing reads for three different plasmids, and a fasta reference sequence file for each plasmid in the dataset. Save this file to an empty folder on your computer in which you will decompress the archive.<br/>
                            <Link onClick={this.downloadData} className={classes.icon}>Download Example Data</Link><br/><br/>
		        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>2: Decompress the archived example data files.<br/></span>
		Navigate to the folder you created in step 1 and find the file "example_data.tar.gz". If you are using a Mac, Ctrl-click/right-click and select "Open" to decompress the file. If you are using PC/Windows, you will need to decompress the file using a utility such as <Link href="https://www.7-zip.org" target="_blank" className={classes.icon}>7-Zip</Link> or <Link href="https://www.rarlab.com/" target='_blank' className={classes.icon}>WinRAR</Link>.<br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>With the example data decompressed, you are now ready to proceed to the next step...<br/></span>
		            <Link onClick={ () => this.props.updateParentState({'showPage': 'tutorial_upload'}) } className={classes.icon}>Upload your Data</Link><br/>
                        </Typography>
	    
                    </Grid>
		</Grid>
	    </div>
        );
    }
}

Tutorial_Start.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Tutorial_Start);
