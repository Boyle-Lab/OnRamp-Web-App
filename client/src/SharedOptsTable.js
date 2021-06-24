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
    const { classes, names, rows, medakaModels, selectedModel, handleChange, analysisModes, selectedMode, getState } = props;
    
    return (
	    <Paper className={classes.root}>
	    <Table className={classes.table}>
            <TableHead>
            <TableRow key="0">
	    {names.map( (name, index) => (
		    <TableCell key={index.toString()} align="left">{name}</TableCell>
	    ))}
	</TableRow>
            </TableHead>
            <TableBody>
            {rows.map(row => (
		    <TableRow key={row.id}>
		    <TableCell key="1" align="right">{row.values[0]}</TableCell>
		    <TableCell key="2" align="right">
		    {row.id === 1 ?
			(<TextField
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
			 </TextField>)
		     : row.id === 2 ?
			(<TextField
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
			 </TextField>)
		     :
			(<TextField
			 id={row.values[3]}
			 select
			 value={getState(row.values[3])}
			 onChange={handleChange(row.values[3])}
			 SelectProps={{
			     native: true,
			     MenuProps: {
				 //className: classes.menu,
			     },
			 }}
			 margin="normal">
			 {["true", "false"].map(option => (
				 <option key={option} value={option}>
				 {option}
			     </option>
			 ))}
			 </TextField>)
		    }
		     </TableCell>
		     <TableCell key="3" align="left">{row.values[2]}</TableCell>
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
