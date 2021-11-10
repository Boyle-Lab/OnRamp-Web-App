import React, { Component } from "react";
import FileUploader from './FileUploader';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
//import Paper from '@material-ui/core/Paper';

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
});


class FileUploadWrapper extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
	// This is a static component
	return false;
    }
    
    render () {
	const { classes } = this.props;
	if (verbose) {
	    console.log("Render FileUploadWrapper");
	}
        return (
		<div>
		<Grid container spacing={2}>
		<Grid item xs={12}>
		<Tooltip title="Sequencing file(s) containing reads in fastq format (.fastq or .fq). May be comressed with gzip (.fastq.gz or .fq.gz).">
		<Typography container="div">
                Upload Read Data (fastq):
	        </Typography>
		</Tooltip>
                <FileUploader
	            onFilesChange={this.props.handleFilesChange}
	            files={this.props.readFiles}
	            dest="readFiles"
	            serverId={this.props.readServerId}
	            allowedTypes={['fq', 'fastq']}
	            updateParentState={this.props.updateStateSettings}
		/>
		<Tooltip title="Plasmid reference sequence file(s) in fasta format (.fasta or .fa). May be compressed with gzip (.fasta.gz or .fa.gz).">
		<Typography container="div">
		Upload Plasmid Sequences (fasta):
	        </Typography>
		</Tooltip>
                <FileUploader
                    onFilesChange={this.props.handleFilesChange}
                    files={this.props.refFiles}
                    dest="refFiles"
	            serverId={this.props.refServerId}
	            allowedTypes={['fa', 'fasta']}
                    updateParentState={this.props.updateStateSettings}
                />
		</Grid>
		</Grid>
	    </div>
        );
    }
}

FileUploadWrapper.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FileUploadWrapper);
