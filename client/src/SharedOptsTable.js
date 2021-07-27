import React from 'react';
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
});

function SharedOptsTable(props) {
    const { classes, names, rows, medakaModels, selectedModel, handleChange, handleSettings, analysisModes, selectedMode, getState } = props;

    const handleSettingsClick = (event, name) => {
	event.preventDefault();
	let target = "";
	if (name === "nanofilt") {
	    target = "showNanofiltOpts";
	} else if (name === "biobin") {
	    target = "showBinningOpts";
	}
	console.log(target);
	handleSettings(target, true);
    }
    
    return (
	    <Paper className={classes.root}>
	    <Table className={classes.table}>
            <TableHead>
            </TableHead>
            <TableBody>
            {rows.map(row => (
		    <TableRow key={row.id}>
		    {row.id > 3 ?
		     <TableCell key="1" align="right"></TableCell>
		     :
		     <TableCell key="1" align="right">{row.values[0]}</TableCell>
		    }
		    <TableCell key="2" align="left">
		    {row.id === 1 ?
		     (<FormControlLabel
		      control={<TextField
                         id="name"
		         onChange={handleChange('mode')}
		         value={getState(row.values[3])}
                         margin="normal">
			       </TextField>}
		     />)
		     : row.id === 2 ?
		     (<FormControlLabel
		      control={<TextField
			 id="mode"
			 select
			 //className={classes.textField}
			 value={selectedMode}
			 onChange={handleChange('mode')}
			 SelectProps={{
			     native: true,
			     MenuProps: {
				 //className: classes.menu,
			     },
			 }}
			 margin="normal">
			 {analysisModes.map(option => (
				 <option key={option} value={option}>
				 {option}
			     </option>
			 ))}
			       </TextField>}
		     />)
		     : row.id === 3 ?
		     (<FormControlLabel
		      control={<TextField
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
			       margin="normal">
			       {medakaModels.map(option => (
				       <option key={option} value={option}>
				       {option}
				   </option>
			       ))}
			       </TextField>}
		      />)
		     :
		     (<div><FormControlLabel
		      control={<Switch
			       id={row.values[3]}
			       onChange={handleChange(row.values[3])}
			       color="primary"
					 />}
			       label={row.values[0]}
			       labelPlacement="end"
		      /> {row.id === 5 ?
			  (<IconButton color="inherit" onClick={ (event) => handleSettingsClick(event, row.values[3]) } >
			   <SettingsIcon/>
			   </IconButton>)
			  : ("")
			 }
		      </div>
		     )
		    }
		     </TableCell>
		    {/*<TableCell key="3" align="left">{row.values[2]}</TableCell>*/}
		     </TableRow>
            ))}
        </TableBody>
	    </Table>
	    </Paper>
    );
}

SharedOptsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SharedOptsTable);
