import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

//import TextField from '@material-ui/core/TextField';
import { TextValidator } from 'react-material-ui-form-validator';

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

function OptsTable(props) {
    const { classes, files, updateParentState } = props;

    const isError = (value, type) => {
	console.log(value, type);
	if (typeof(value) === type) {
	    return false;
	}
	console.log(value);
	return true;
    }

    const handleChange = () => {
	// Do stuff
    }

    return (
	    <Paper className={classes.root}>
	    <Table className={classes.table}>
            <TableBody>
            {files.map((fasta, index) => (
		    <TableRow key={index}>
		    <TableCell key="1" align="left">{fasta}</TableCell>
		    <TableCell key="2" align="right">
		    {/*
		    <TextValidator
		value={''}
                onChange={handleChange()}
                margin="dense"
                id={index}
		validators={['required']}
		errorMessages={['This field is required!']}
		    />
		     */}
		Placeholder
		    </TableCell>
		    <TableCell key="3" align="left">Placeholder</TableCell>
		    </TableRow>
            ))}
        </TableBody>
	    </Table>
	    </Paper>
    );
}

OptsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OptsTable);
