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

import UploadFastq from './images/Onramp_Upload-Fastq.png';
import OpenFasta from './images/Onramp_Upload-Open-Refs.png';
import UploadFasta from './images/Onramp_Upload-Refs.png';
import UploadDone from './images/Onramp_Upload-Done.png';

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


class Tutorial_Upload extends Component {
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
		            Step 1: Uploading your Data
	                </Typography>
		    </Grid>
                    <Grid item xs={12}>

                        <Typography align="left" variant="h5">
		            Data to be analyzed are uploaded using the drop zones on the right of the job submission screen. Here you can add and remove fastq read files and fasta reference sequences. The example dataset includes a single fastq file, compressed with gzip, and a fasta reference sequence for each of  the three plasmids included in the sequencing experiment.
	                </Typography>
	    
	            </Grid>
		    <Grid item xs={12}>
	    
	                <Typography align="left" variant="h6">
		            <span className='bold'>1: Upload the fastq read data.<br/></span>
	  	            Open an Explorer (Windows) or Finder (Mac) window and navigate to the folder containing the example dataset. click on the "example_data.fastq.gz" and drag it onto the drop zone labelled "Upload Read Data". Drop the file anywhere within the drop zone to initiate the upload.<br/><br/>
                            <img src={UploadFastq} alt="Drag Fastq read file to Drop Zone"/><br />

	                    When the transfer is completed, the file in the drop zone will turn green. If there is a problem with the upload, the file will turn red. You may retry the upload by clicking the "reload" icon associated with the file.<br/><br/>
		        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>2: Upload the fasta reference sequences.<br/></span>
                            Click on the drop zone labeled "Upload Plasmid Sequences" to open a file dialog within your browser.<br/><br/>

	                    <img src={OpenFasta} alt="Open fasta reference file upload dialog"/><br />

	    Highlight the three fasta files (mp193_pEctrl-eb-2-fw.fa, mp198_pEctrl-eb-8-fw.fa, and pLT.76-EB-SVpmx-spr33-F23fw.fa), then click "Open" to initiate the upload.<br/><br/>

	                    <img src={UploadFasta} alt="Upload fasta reference sequences"/><br />

	                    Alternately, you may upload each individual fasta file onto the drop zone by repeatedly clicking the drop zone to add more files.<br/><br/>

		            <span className='bold'>Tips:</span><br/>
		            1) It is important to include a reference fasta for every plasmid sequenced in an experiment or faulty read mappings will result in unreliable results!<br/>
	                    2) Although the example fasta files are not compressed, you may compress your own fasta reference files with gzip if you wish.<br/><br/>
	                </Typography>
	
	                <Typography align="left" variant="h6">
	                    Once all fasta files have completed uploading, the "Edit Restriction Enzymes" and "Submit" buttons will become active.<br/><br/>

	                    <img src={UploadDone} alt="Uploads finished"/><br /><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
	                    <span className='bold'>You are now ready to proceed to the next step...</span><br/>
                            <Link onClick={ () => this.props.updateParentState({'showPage': 'tutorial_enzymes'}) } className={classes.icon}>Choose Restriction Enzymes</Link><br/>
                        </Typography>
	    	    
                    </Grid>
		</Grid>
	    </div>
        );
    }
}

Tutorial_Upload.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Tutorial_Upload);
