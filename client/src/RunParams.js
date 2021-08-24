import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Grid from '@material-ui/core/Grid';


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
	padding: "0 20px"
    },
    rightAligned: {
        display: "flex",
        justifyContent: "flex-end",
        padding: "0 0 0 20px"
    },
    centerAligned: {
        display: "flex",
        justifyContent: "center",
    },
    bold: {
	fontWeight: "bold"
    }
});

function RunParams(props) {
    const { classes, runParams } = props;

    return (

    <Paper className={classes.root}>
        <Grid container className={classes.root} spacing={0}>
	    
	    {/* Run Name */}
	    <Grid item xs={12}>
    	        <Grid container alignItems="center">
	            <Grid item xs={4} className={classes.leftAligned}>
    	                <Typography component="div" className={classes.bold}>
	                    Run Name
	                </Typography>
	            </Grid>
    	            <Grid item xs={8} className={classes.leftAligned}>
    	                <Typography component="div" className={classes.bold}>
	                    {runParams.name}
                        </Typography>
	            </Grid>
	        </Grid>
            </Grid>
	    
    	    {/* Run Date */}
            <Grid item xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={4} className={classes.leftAligned}>
                    </Grid>
                    <Grid item xs={8} className={classes.leftAligned}>
                        <Typography component="div">
                            ({runParams.date})
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
            </Grid>

	   {/* Run Mode */}
            <Grid item xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={4} className={classes.leftAligned}>
                          <Typography component="div" className={classes.bold}>
                              Analysis Mode
                          </Typography>
                    </Grid>
                    <Grid item xs={8} className={classes.leftAligned}>
                        <Typography component="div">
                            {runParams.mode}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
            </Grid>
	
        </Grid>

	{/* Biobin Params */}
	{runParams.mode === "biobin" ?
	 <BiobinOpts classes={classes} data={runParams.biobinOptions} />
	 :
	 (<Grid container className={classes.root} spacing={0}>
	      <Grid item xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={4} className={classes.leftAligned}>
                          <Typography component="div" className={classes.bold}>
                              Medaka Consensus Model
                          </Typography>
                    </Grid>
                    <Grid item xs={8} className={classes.leftAligned}>
                        <Typography component="div">
                            {runParams.medakaConsensusModel}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
              </Grid>
	  </Grid>
	 )
	}
	
        {/* filter arg */}
	<Grid container className={classes.root} spacing={0}>
            <Grid item xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={4} className={classes.leftAligned}>
                        <Typography component="div" className={classes.bold}>
                            Filter with Nanofilt
                        </Typography>
                    </Grid>
                    <Grid item xs={8} className={classes.leftAligned}>
                        <Typography component="div">
            {'filter' in runParams ? 'true' : 'false'}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
            </Grid>
	</Grid>
        {'filter' in runParams ? <NanofiltOpts classes={classes} data={runParams.nanofiltOptions} /> : ""}
	
        {/* trim arg */}
	<Grid container className={classes.root} spacing={0}>
	    <Grid item xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={4} className={classes.leftAligned}>
                        <Typography component="div" className={classes.bold}>
                            Trim Adapters with Porechop
                        </Typography>
                    </Grid>
                    <Grid item xs={8} className={classes.leftAligned}>
                        <Typography component="div">
                            {'trim' in runParams ? 'true' : 'false' }
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
	    </Grid>
	</Grid>

	{/* Reference Files List */}
	<RefFilesList
	    classes={classes}
	    files={runParams.plasmidReferenceFiles}
	    enzymeData={runParams.plasmidEnzymeData}
	/>

	{/* Sequence Files List */}
	<SeqFilesList
	    classes={classes}
            files={runParams.sequencingReadFiles}
	/>
	
    </Paper>
    );
}

RunParams.propTypes = {
    classes: PropTypes.object.isRequired,
};

function NanofiltOpts(props) {
    const { classes, data } = props;
    return (
	<Grid container className={classes.root} spacing={0}>
	    <Grid item xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={12} className={classes.leftAligned}>
                        <Typography component="div" className={classes.bold}>
                            Nanofilt Parameters
                        </Typography>
                    </Grid>
                </Grid>
              <Divider />
            </Grid>
	    {Object.keys(data).map( (opt, index) => (
                <Grid item xs={12} key={index.toString()}>
                    <Grid container alignItems="center">
                        <Grid item xs={4} className={classes.rightAligned}>
                             <Typography component="div">
                                 {opt}
                             </Typography>
                         </Grid>
                        <Grid item xs={8} className={classes.leftAligned}>
                            <Typography component="div">
                                {data[opt]}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider />
                </Grid>
	    ))}
	</Grid>
    );
}

function BiobinOpts(props) {
    const { classes, data } = props;
    return (
	<Grid container className={classes.root} spacing={0}>
            <Grid item xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={12} className={classes.leftAligned}>
                        <Typography component="div" className={classes.bold}>
                            Biobin Parameters
                        </Typography>
                    </Grid>
                </Grid>
              <Divider />
            </Grid>
            {Object.keys(data).map( (opt, index) => (
                <Grid item xs={12} key={index.toString()}>
                    <Grid container alignItems="center">
                        <Grid item xs={4} className={classes.rightAligned}>
                             <Typography component="div">
                                 {opt}
                             </Typography>
                         </Grid>
                        <Grid item xs={8} className={classes.leftAligned}>
                            <Typography component="div">
                                {data[opt]}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider />
                </Grid>
            ))}
        </Grid>
    );
}

function RefFilesList(props) {
    const { classes, files, enzymeData } = props;
    return (
        <Grid container className={classes.root} spacing={0}>
            <Grid item xs={12}>
		<Grid container alignItems="center">
                    <Grid item xs={3} className={classes.leftAligned}>
                        <Typography component="div" className={classes.bold}>
                            Plasmid Reference Files
			</Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.rightAligned}>
	                <Typography component="div">
                            File
			</Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.leftAligned}>
                        <Typography component="div">
                            Restriction Enzyme
                        </Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.leftAligned}>
                        <Typography component="div">
                            Cut Site
                        </Typography>
                    </Grid>
                </Grid>
            <Divider />
            </Grid>
            {Object.keys(enzymeData).map( (key, index) => (
                <Grid item xs={12} key={index.toString()}>
                    <Grid container alignItems="center">
                        <Grid item xs={6} className={classes.rightAligned}>
                             <Typography component="div">
                                 {enzymeData[key]["fileName"]}
                             </Typography>
                         </Grid>
                        <Grid item xs={3} className={classes.leftAligned}>
		            {"enzyme" in enzymeData[key] ?
                             (<Typography component="div">
                                    {enzymeData[key]["enzyme"]}
                              </Typography>)
			     :
			     (<Typography component="div">
                                    None
                              </Typography>)
			    }
                        </Grid>
		        <Grid item xs={3} className={classes.leftAligned}>
                            <Typography component="div">
				{enzymeData[key]["cut-site"]}
                            </Typography>
		        </Grid>
                    </Grid>
                    <Divider />
                </Grid>
            ))}
        </Grid>
    );
}

function SeqFilesList(props) {
    const { classes, files } = props;
    return (
        <Grid container className={classes.root} spacing={0}>
            <Grid item xs={12}>
                <Grid container alignItems="center">
                    <Grid item xs={12} className={classes.leftAligned}>
                        <Typography component="div" className={classes.bold}>
                            Sequencing Files
                        </Typography>
                    </Grid>
                </Grid>
            <Divider />
            </Grid>
            {files.map( (key, index) => (
                <Grid item xs={12} key={index.toString()}>
                    <Grid container alignItems="center">
                        <Grid item xs={6} className={classes.rightAligned}>
                             <Typography component="div">
                                 {key}
                             </Typography>
                         </Grid>
                        <Grid item xs={6} className={classes.leftAligned}>
                        </Grid>
                    </Grid>
                    <Divider />
                </Grid>
            ))}
        </Grid>
    );
}


export default withStyles(styles)(RunParams);
