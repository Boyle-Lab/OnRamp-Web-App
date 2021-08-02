import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';

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
    table: {
	minWidth: 700,
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
    rightAlignedSwitchLabel: {
        display: "flex",
	justifyContent: "flex-end",
        padding: "0 0 0 0"
    },
    leftAlignedSwitchLabel: {
        display: "flex",
	justifyContent: "flex-start",
        padding: "0 0 0 0",
	alignItems: "center"
    },
});

function SharedOptsTable(props) {
    const { classes, names, rows, medakaModels, selectedModel, handleChange, handleSettings, analysisModes, selectedMode, getState } = props;

    const [showBinningOpts, setBinningOpts] = useState(false);
    const [showNanofiltOpts, setNanofiltOpts] = useState(false);
    
    const handleSettingsClick = (event, target) => {
	event.preventDefault();
	handleSettings(target, true);
    }

    const handleModeSwitch = (event) => {
	let mode = "medaka";
	if (event.target.checked) {
	    mode = "biobin";
	    setBinningOpts(true);
	} else {
            setBinningOpts(false);
	}	
	handleSettings("mode", mode);
    }

    const handleNanofiltSwitch = (event) => {
	let val = true;
        if (event.target.checked) {
            setNanofiltOpts(true);
        } else {
            setNanofiltOpts(false);
	    val = false;
        }
	handleSettings("nanofilt", val);
    }

    const handleSwitch = (event) => {
        let val	= false;
        if (event.target.checked) {
	    val = true;
	}
        handleSettings(event.target.id, val);
    }
    
    return (
	    
    <Grid container className={classes.root} spacing={0}>
    <Paper className={classes.root}>
	    
	{/* Run Name */}
	<Grid item xs={12}>
	    <Grid container alignItems="center">
	    <Grid item xs={4} className={classes.leftAligned}>
	                Run Name
	        </Grid>
	        <Grid item xs={8} className={classes.leftAligned}>
	                <TextField
	                    id="name"
	                    onChange={handleChange('name')}
	                    value={getState('name')}
	                    margin="normal"
	                    fullWidth={true}
	                />
	        </Grid>
	    </Grid>
	</Grid>

	{/* Analysis Mode */}
	<Grid item xs={12}>
            <Grid container alignItems="center">
                <Grid item xs={4} className={classes.leftAligned}>
                    Analysis Mode
                </Grid>

	        <Grid item xs={1} className={classes.rightAlignedSwitchLabel}>
                    Medaka
	        </Grid>
	
                <Grid item xs={1} className={classes.centerAligned}>

                    <Switch
                        id={"mode"}
                        onChange={handleModeSwitch}
                        color="primary"
                    />
	    
                </Grid>

                <Grid item xs={1} className={classes.leftAlignedSwitchLabel}>
      	            Biobin
                    <IconButton
	                color="inherit"
	                onClick={ (event) => handleSettingsClick(event, "showBinningOpts") }
	                disabled={!showBinningOpts}
	            >
                        <SettingsIcon/>
                    </IconButton>
	      	</Grid>
	
                <Grid item xs={5} className={classes.leftAligned}>
                    
                </Grid>
            </Grid>
        </Grid>

	{/* Medaka consensus model */}
	<Grid item xs={12}>
            <Grid container alignItems="center">
                <Grid item xs={4} className={classes.leftAligned}>
                        Medaka Consensus Model
                </Grid>
                <Grid item xs={8} className={classes.leftAligned}>
                    <TextField
                        id="medakaModel"
                        select
                        //className={classes.textField}
                        value={selectedModel}
                        onChange={handleChange('medakaSelectedModel')}
                        SelectProps={{
                            native: true,
                            MenuProps: {
                                //className: classes.menu,
                            },
                        }}
                        margin="normal"
	                fullWidth={true}
	            >
                        {medakaModels.map(option => (
				<option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
        </Grid>

        {/* Nanofilt Option */}
        <Grid item xs={12}>
            <Grid container alignItems="center">
                <Grid item xs={4} className={classes.leftAligned}>
                    Filter with Nanofilt
                </Grid>

                <Grid item xs={1} className={classes.rightAlignedSwitchLabel}>
                    
                </Grid>

                <Grid item xs={1} className={classes.centerAligned}>

                    <Switch
                        onChange={handleNanofiltSwitch}
                        color="primary"
                    />

                </Grid>

                <Grid item xs={1} className={classes.leftAlignedSwitchLabel}>
                    <IconButton
                        color="inherit"
                        onClick={ (event) => handleSettingsClick(event, "showNanofiltOpts") }
                        disabled={!showNanofiltOpts}
                    >
                        <SettingsIcon/>
                    </IconButton>
                </Grid>

                <Grid item xs={5} className={classes.leftAligned}>

                </Grid>
            </Grid>
        </Grid>

	{/* Trim Option */}
	<Grid item xs={12}>
            <Grid container alignItems="center">
		<Grid item xs={4} className={classes.leftAligned}>
                    Trim Adapters with Porechop
		</Grid>

		<Grid item xs={1} className={classes.rightAlignedSwitchLabel}>

		</Grid>

		<Grid item xs={1} className={classes.centerAligned}>

                    <Switch
                        id="trim"
	                onChange={handleSwitch}
			color="primary"
                    />

		</Grid>

		<Grid item xs={1} className={classes.leftAlignedSwitchLabel}>
                    {/* <IconButton
			color="inherit"
			onClick={ (event) => handleSettingsClick(event, "showNanofiltOpts") }
			disabled={!showNanofiltOpts}
                    >
                    <SettingsIcon/> 
                    </IconButton> */}
                </Grid>

                <Grid item xs={5} className={classes.leftAligned}>

                </Grid>
            </Grid>
        </Grid>

	{/* Double Option */}
	<Grid item xs={12}>
            <Grid container alignItems="center">
		<Grid item xs={4} className={classes.leftAligned}>
                    Double the Reference Genome
		</Grid>

		<Grid item xs={1} className={classes.rightAlignedSwitchLabel}>

		</Grid>

		<Grid item xs={1} className={classes.centerAligned}>

                    <Switch
	                id="double"
			onChange={handleSwitch}
			color="primary"
                    />

		</Grid>

		<Grid item xs={1} className={classes.leftAlignedSwitchLabel}>
                    {/* <IconButton
			color="inherit"
			onClick={ (event) => handleSettingsClick(event, "showNanofiltOpts") }
			disabled={!showNanofiltOpts}
                    >
                        <SettingsIcon/>
			</IconButton> */}
                </Grid>

                <Grid item xs={5} className={classes.leftAligned}>

                </Grid>
            </Grid>
        </Grid>	
	
    </Paper>	
    </Grid>
    );
}

SharedOptsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SharedOptsTable);
