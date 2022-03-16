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
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

import gtag from 'ga-gtag';

import Page1 from './QuickStart/Page1';

import Tutorial_Start from './QuickStart/Tutorial_Start';
import Tutorial_Upload from './QuickStart/Tutorial_Upload';
import Tutorial_Enzymes from './QuickStart/Tutorial_Enzymes';
import Tutorial_Params from './QuickStart/Tutorial_Params';
import Tutorial_Submit from './QuickStart/Tutorial_Submit';
import Tutorial_Result from './QuickStart/Tutorial_Result';
import Tutorial_LoadStored from './QuickStart/Tutorial_LoadStored';
import Tutorial_Conclusion from './QuickStart/Tutorial_Conclusion';

import Page3 from './QuickStart/Page3';
import Page4 from './QuickStart/Page4';
import Page5 from './QuickStart/Page5';
import Page6 from './QuickStart/Page6';
import Page7 from './QuickStart/Page7';
import Page8 from './QuickStart/Page8';
import Page9 from './QuickStart/Page9';
import Page10 from './QuickStart/Page10';
import Page11 from './QuickStart/Page11';
import Page12 from './QuickStart/Page12';

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
    },
    accordion: {
	backgroundColor: 'inherit',
    }
});


class Tutorial extends Component {
    constructor(props) {
        super(props);
	this.state = {
	    showPage: 1
        };
    }

    componentDidMount() {
	// Send an event to Google Analytics.
        gtag('event', 'show_tutorial');
    }

    updateStates = (data) => {
        /*Object.keys(data).forEach( (key) => {
            this.setState({ [key]: data[key] }, () => {
                if (verbose) {
                    console.log(key, this.state[key]);
                }
            });
            });*/
	this.setState(data, () => {
	    if (verbose) {
		Object.keys(data).forEach( (key) => {
		    console.log(key, this.state[key]);
		});
	    }
	});
    }
    
    render () {
	const { classes, showExampleResults } = this.props;
        return (
		<div>
		<Grid container spacing={2}>
		    <Grid item xs={2}>
		        <div className={classes.appBarSpacer} />
                        <div className={classes.appBarSpacer} />

		        <Grid container spacing={0}>
		        <Paper elevation={1}>
		            <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
		                <Link onClick={() => this.setState({'showPage': 1})} className={classes.icon}>
		                    Quick Start
 	                        </Link>
                            </Grid>

		            <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
		                <Accordion elevation={0}>
		                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
		                        <Link>
                                            Take the Tutorial
                                        </Link>
		                    </AccordionSummary>
		                    <AccordionDetails>
		                        <Grid container spacing={1}>
                                           <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
		                               <Link onClick={() => this.setState({'showPage': 'tutorial_start'})} className={classes.icon}>
                                                   Getting Started
                                               </Link>
                                           </Grid>

                                           <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                               <Link onClick={() => this.setState({'showPage': 'tutorial_upload'})} className={classes.icon}>
                                                   Uploading Data
                                               </Link>
      	      	   	      	      	   </Grid>

                                           <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                               <Link onClick={() => this.setState({'showPage': 'tutorial_enzymes'})} className={classes.icon}>
                                                   Restriction Enzymes
                                               </Link>
      	      	   	      	      	   </Grid>

                                           <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                               <Link onClick={() => this.setState({'showPage': 'tutorial_params'})} className={classes.icon}>
                                                   Setting Run Params
                                               </Link>
      	      	   	      	      	   </Grid>

                                           <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                               <Link onClick={() => this.setState({'showPage': 'tutorial_submit'})} className={classes.icon}>
                                                   Submit your Run
                                               </Link>
      	      	   	      	      	   </Grid>
	    
                                           <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                               <Link onClick={() => this.setState({'showPage': 'tutorial_result'})} className={classes.icon}>
                                                   Viewing Results
                                               </Link>
      	      	   	      	      	   </Grid>

                                           <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                               <Link onClick={() => this.setState({'showPage': 'tutorial_stored'})} className={classes.icon}>
                                                   Stored Sessions
                                               </Link>
                                           </Grid>
	    
                                           <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                               <Link onClick={() => this.setState({'showPage': 'tutorial_conclusion'})} className={classes.icon}>
                                                   Conclusion
                                               </Link>
      	      	   	      	      	   </Grid>

	                                </Grid>
	                            </AccordionDetails>
                                </Accordion>
                           </Grid>

                           <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end", alignContent: "flex-end"}}>
		               <Accordion elevation={0}>
		                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
		                       <Link>Uploading Data</Link>
		                   </AccordionSummary>
                                   <AccordionDetails>
                                       <Grid container spacing={1}>
		                           <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                               <Link onClick={() => this.setState({'showPage': 3})} className={classes.icon}>
                                                   The Drop Zones
                                               </Link>
		                           </Grid>
		                           <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                               <Link onClick={() => this.setState({'showPage': 4})} className={classes.icon}>
                                                   Restriction Enzymes
                                               </Link>
		                           </Grid>
		                       </Grid>
		                   </AccordionDetails>
		               </Accordion>
	                    </Grid>

		            <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
		                <Accordion elevation={0}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Link>
                                            Customizing Settings
                                        </Link>
                                    </AccordionSummary>
                                    <AccordionDetails>
	                                <Grid container spacing={1}>
                                            <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                                <Link onClick={() => this.setState({'showPage': 5})} className={classes.icon}>
                                                    Analysis Modes
                                                </Link>
                                            </Grid>
                                            <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                                <Link onClick={() => this.setState({'showPage': 6})} className={classes.icon}>
                                                    Medaka Models
                                                </Link>
                                            </Grid>
                                            <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                                <Link onClick={() => this.setState({'showPage': 7})} className={classes.icon}>
                                                    Using Nanofilt
                                                </Link>
                                            </Grid>
                                            <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                                <Link onClick={() => this.setState({'showPage': 8})} className={classes.icon}>
                                                    Using Porechop
                                                </Link>
                                            </Grid>
		                        </Grid>
		                    </AccordionDetails>
                                </Accordion>
	                    </Grid>

		            <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
	                        <Accordion elevation={0}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Link>
                                            Interpreting Results
                                        </Link>
                                    </AccordionSummary>
                                    <AccordionDetails>
		                        <Grid container spacing={1}>

                                            <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                                <Link onClick={() => this.setState({'showPage': 10})} className={classes.icon}>
                                                    The Results Table
                                                </Link>
                                            </Grid>
	    
                                            <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                                <Link onClick={() => this.setState({'showPage': 10})} className={classes.icon}>
                                                    The IGV Browser
                                                </Link>
                                            </Grid>
                                            <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                                <Link onClick={() => this.setState({'showPage': 11})} className={classes.icon}>
                                                    Downloading results
                                                </Link>
                                            </Grid>
		                        </Grid>
		                    </AccordionDetails>
                                </Accordion>
                            </Grid>

		            <Grid item xs={12} style={{display: "flex", justifyContent: "flex-end"}}>
                                <Link onClick={() => this.setState({'showPage': 12})} className={classes.icon}>
                                    Loading stored sessions
                                </Link>
                            </Grid>
		        </Paper>
	                </Grid>
		    </Grid>

		    <Grid item xs={10}>
		        <Grid container spacing={2}>
		            <Grid item xs={12}>
		                {
				    {
		    			1: <Page1 showExampleResults={showExampleResults} />,
					tutorial_start: <Tutorial_Start updateParentState={this.updateStates} />,
					tutorial_upload: <Tutorial_Upload updateParentState={this.updateStates} />,
					tutorial_enzymes: <Tutorial_Enzymes updateParentState={this.updateStates} />,
					tutorial_params: <Tutorial_Params updateParentState={this.updateStates} />,
					tutorial_submit: <Tutorial_Submit updateParentState={this.updateStates} />,
					tutorial_result: <Tutorial_Result updateParentState={this.updateStates} />,
					tutorial_stored: <Tutorial_LoadStored updateParentState={this.updateStates} />,
					tutorial_conclusion: <Tutorial_Conclusion updateParentState={this.updateStates} />,
					3: <Page3 />,
					4: <Page4 />,
					5: <Page5 />,
					6: <Page6 />,
					7: <Page7 />,
					8: <Page8 />,
					9: <Page9 />,
					10: <Page10 />,
					11: <Page11 />,
					12: <Page12 />
					    
				    }[this.state.showPage]
				    
				}
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
