import React, {useState} from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

/*
This code is part of the bulk_plasmid_seq_web distribution
(https://github.com/Boyle-Lab/) and is governed by its license.
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

const styles = theme => ({
    root: {
	width: '100%',
	marginTop: theme.spacing(3),
	overflowX: 'auto',
    },
    leftAligned: {
	display: "flex",
	justifyContent: "flex-start",
	padding: "10px 10px 10px 10px"
    },
    rightAligned: {
        display: "flex",
        justifyContent: "flex-end",
        padding: "10px 10px 10x 10px"
    },
    centerAligned: {
        display: "flex",
        justifyContent: "center",
	padding: "10px 10px 10x 10px",
	margin: '40px 0px 40px 0px'
    },
    bold: {
	fontWeight: "bold"
    }
});

function ErrorContent(props) {
    const { classes, error } = props;
    return (
	    
	<Paper className={classes.root}>
	    <Grid container className={classes.root} spacing={0}>
	        <Grid item xs={12} className={classes.centerligned}>
	            <Typography container="div" align="center" className={classes.bold}>
	                The analysis pipeline encountered an error.<br/>
	                The actual error message was:
	            </Typography>
	          <Divider />
	        </Grid>
	    
	        <Grid item xs={12} className={classes.centerAligned}>
	            <Typography container="div" align="center">
	                <span className='infoDialog' dangerouslySetInnerHTML={{ __html: error, }}></span>
	            </Typography>
	            <Divider />
                </Grid>
	    
	        <Grid item xs={12} className={classes.centerAligned}>
	            <Typography container="div" align="center" className={classes.bold}>
                        Reasons for this error may include:
	            </Typography>
	        </Grid>
	        <Grid item xs={12} className={classes.leftAligned}>
	            <Typography container="div" align="left">
                        <span className='bold'>1)</span> The read file is not a valid fastq file.<br/>
	                <span className='bold'>2)</span> Your data include an unusually-long reference (greater than ~10kb). A cosmid/fosmid, perhaps?<br/>
	                <span className='bold'>3)</span> There is a problem with one or more of the reference fasta files:<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className='bold'>a)</span> The file contains multiple sequence records.<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className='bold'>b)</span> The fasta sequence name and file name do not match.<br/>
                        <span className='bold'>4)</span> No reads aligned to one or more reference files. (Did you upload the wrong read file and/or reference(s)?)<br/>
                        <span className='bold'>5)</span> Too many (>40) plasmids in the pool.<br/>
                    </Typography>
                </Grid>
	    </Grid>
	</Paper>
    );
}

ErrorContent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ErrorContent);
