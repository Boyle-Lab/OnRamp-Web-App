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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ResultsTable from './images/Onramp_Results-Table.png';
import ShowConsensus from './images/Onramp_Show-Consensus.png';
import Consensus from './images/Onramp_Consensus.png';
import ShowAlignment from './images/Onramp_Show-Alignment.png';
import Alignment from './images/Onramp_Alignment.png';
import ShowIGV from './images/Onramp_Show-IGV.png';
import IGVStart from './images/Onramp_IGV-Start.png';
import IGVSelect from './images/Onramp_IGV-Select.png';
import IGVSeq from './images/Onramp_IGV-Seq.png';
import ShowParams from './images/Onramp_Show-Params.png';
import Params from './images/Onramp_Params.png';
import DownloadStart from './images/Onramp_StartDownload.png';
import DownloadPreparing from './images/Onramp_Download-Preparing.png';
import DownloadSave from './images/Onramp_Download-Save.png';

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
		            Step 5: Viewing your Results
	                </Typography>
		    </Grid>
                    <Grid item xs={12}>

                        <Typography align="left" variant="h5">
		            Results are summarized in table form for easy interpretation at a glance with details available at the click of a button!
	                </Typography>
	    
	            </Grid>
		    <Grid item xs={12}>
	    
	                <Typography align="left" variant="h6">
		            <span className='bold'>1: Interpreting tabular results.<br/></span>
      	      	The results table summarizes the metrics used to determine plasmid quality. Each row represents a single oplasmid in the dataset, with associated file names and quality metrics given in the columns.<br/>
		<img src={ResultsTable} alt="The results table"/><br/>
	    The "Quality Metrics" column describes the characteristics used to determine if a plasmid is "Good", "Fair", or "Poor" quality. Results here are color-coded for easy interpretation at a glance. See the table below for more details on thresholds used for each quality level...<br/>	
	    
		        </Typography>

                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Quality</TableCell>
                                    <TableCell>Max Errors (Gaps and Mismatches)</TableCell>
                                    <TableCell>Sequencing Depth</TableCell>	    
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell><span className='good'>Good</span></TableCell>
                                    <TableCell>&lt; 1 error per 1kb AND &lt;= 2 consecutive errors</TableCell>
                                    <TableCell>>= 100</TableCell>

                                </TableRow>
                                <TableRow>
                                    <TableCell><span className='fair'>Fair</span></TableCell>
                                    <TableCell>&lt;= 6 total errors AND &lt;= 3 consecutive errors</TableCell>
                                    <TableCell>>= 50</TableCell>

                                </TableRow>
                                <TableRow>
                                    <TableCell><span className='poor'>Poor</span></TableCell>
                                    <TableCell>>= 7 total errors AND/OR >= 3 consecutive errors</TableCell>
                                    <TableCell>&lt; 50</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
	    
                        <Typography align="left" variant="h6">
		            <br/><br/>
                            <span className='bold'>2: Viewing the consensus and reference sequences.<br/></span>
      	      	            The consensus sequence is the plasmid sequence inferred from the assembled sequencing reads. This represents the "actual" plasmid sequence, including any mismatches, inserted, or deleted nucleotides. You can view the consensus sequence by clicking the "Show Sequence" button in the "Consensus Sequence" column.<br/><br/>
		            <Grid container spacing={0} alignItems='flex-start' alignContent='flex-start'>
		                <Grid item xs={2}>
                                    <img src={ShowConsensus} alt="Show Consensus Sequence"/>
	                        </Grid>
		                <Grid item xs={3}>
		                    <img src={Consensus} alt="Consensus Sequence"/>
		                </Grid>
	                    </Grid>
                            <br/>
                            Click anywhere on the page background to close the consensus sequence dialog.<br/><br/>

	                    The reference sequence can be viewed in the same manner, using the "Show Sequence" button in the Reference Sequence column.<br/><br/>

	                </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>3: Viewing pairwise alignments.<br/></span>
                            The pairwise alignment between the consensus and reference sequence shows the locations of any gaps and mismatches discovered in the analysis. To view the pairwise alignment, click the "Show Alignment" button.<br/><br/>

		            <Grid container spacing={0} alignItems='flex-start' alignContent='flex-start'>
		                <Grid item xs={2}>
                                    <img src={ShowAlignment} alt="Show Pairwise Alignment"/>
                                </Grid>
                                <Grid item xs={3}>
                                    <img src={Alignment} alt="Pairwise Alignment"/>
                                </Grid>
                            </Grid>
      	      	      	    <br/>
                            Gaps are annotated with a '-' character in the consensus or reference sequence, with a gap in the reference indicating an insertion in the plasmid consensus and a gap in the consensus indicating a deletion. In keeping with conventions, identity between the reference and consensus sequences are coded with '|' characters and Mismatches are coded with '.' characters.<br/><br/>

                            <span className='bold'>Tip:</span> To easily find gaps and mismatches, use your browser search functionality to locate '-' and '.' characters.<br/><br/>
                            Click anywhere outside the consensus sequence dialog to return to the results page.
	    
      	      	            <br/><br/>


	                </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>4: Using the IGV browser to view read mappings.<br/></span>
                            The integrated IGV Browser is a powerful feature that allows detailed inspection of individual read alignments to the reference sequence. It is accessed using the "Show Results in IGV Browser" button at the bottom of the results table.<br/><br/>

                            <img src={ShowIGV} alt="Show IGV Browser"/><br/>
		            <img src={IGVStart} alt="IGV Browser"/><br/>                            
	    
	                    The IGV Browser view will initially be empty. To view read alignments for a plasmid, click the menu at the top-left of the browser and select a sequence to display.<br/><br/>

	                    <img src={IGVSelect} alt="IGV Browser Select Sequence"/><br/><br/>
		     
                            All reads aligning to the selected plasmid reference will now be shown in the alignment view.<br/><br/>

                            <img src={IGVSeq} alt="IGV Browser Sequence View"/><br/><br/>

                            <span className='bold'>Warning:</span> The IGV Browser must load a large amount of data from the server before sequence alignments can be displayed. Therefore, it may take a few minutes for each selected alignment to show up in the browser.<br/><br/>

    	                    The integrated IGV Browser is a feature rich and extremely powerful genome browser with far too many features to discuss here. For more information, please visit the IGV-Web documentation page:<Link href="https://igvteam.github.io/igv-webapp/">IGV-Web Documentation</Link>
	    
		            <br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>5: Viewing run parameters.<br/></span>
		            If, for any reason, you would like to review the parameters used to analyze the given data, you can do so by clicking on the "Show Run Parameters" button below the results table.<br/><br/>

	                    <img src={ShowParams} alt="Show Run Params"/><br/><br/>

	                    All parameters used to analyze the dataset are shown in a table. These are useful to duplicate or make adjustments to a run.<br/><br/>
                            <img src={Params} alt="Run Params"/><br/><br/>

	                    Click anywhere outside the dialog to return to the results page.
		            <br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>6: Downloading results for local analysis.<br/></span>
                            Results are stored on the server for 24 hours after job submission. However, you may want to preserve a copy of the results locally for later reference or further analysis. This can be achieved by clicking the "Download Results" button below the results table.<br/><br/>
                            <img src={DownloadStart} alt="Start Download"/><br/><br/>
	    
	                    You will see a loading screen while files are prepared for download.<br/><br/>
                            <img src={DownloadPreparing} alt="Preparing Download"/><br/><br/>

	                    When files are ready, your browser will prompt you to select a location to save the results.<br/><br/>
                            <img src={DownloadSave} alt="Save Download"/><br/><br/>

	                    Results are bundled into a tar file, compressed with gzip. These can be decompressed with the tar command on Unix-like systems, within the Finder app on Mac, or using an archive utility such as<Link href="https://www.7-zip.org" target="_blank" className={classes.icon}>7-Zip</Link> or<Link href="https://www.rarlab.com/" target='_blank' className={classes.icon}>WinRAR</Link>on PC/Windows systems.
                            <br/><br/>
                        </Typography>

                        <Typography align="left" variant="h6">
                            <span className='bold'>You are now ready to continue to the next step...</span><br/>
                            <Link onClick={ () => this.props.updateParentState({'showPage': 'tutorial_stored'}) } className={classes.icon}>Loading Stored Sessions</Link><br/>
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
