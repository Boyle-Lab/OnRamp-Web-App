import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

/*
This code is part of the bulkPlasmidSeq distribution
(https://github.com/Boyle-Lab/bulkPlasmidSeq) and is governed by its license.
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

function ResultsTable(props) {
    const { classes, names, rows, handleInfoClick } = props;
    
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
            {rows.map( (row, index) => (
		    <TableRow key={index.toString()}>
		    <TableCell key="1" align="left">
		        {row.input_fasta_name}<br/>
		        <form onSubmit={handleInfoClick}>
		        <input type="hidden" name="input_fasta_name" value={row.input_fasta_name}/>
		        <input type="hidden" name="input_fasta_seq" value={row.input_fasta_seq}/>
		        <input type="submit" value="Show Sequence"/>
		        </form>
		    </TableCell>
		    <TableCell key="2" align="left">
		        {""}
		    </TableCell>
		    <TableCell key="3" align="left">
		        {row.consensus_name}
		        <form onSubmit={handleInfoClick}>
                        <input type="hidden" name="input_fasta_name" value={row.consensus_name}/>
                        <input type="hidden" name="input_fasta_seq" value={row.consensus_seq}/>
                        <input type="submit" value="Show Sequence"/>
                        </form>
		    </TableCell>
		    <TableCell key="4" align="left">
		        {row.pairwise_algn_name}
		        <form onSubmit={handleInfoClick}>
                        <input type="hidden" name="input_fasta_name" value={row.pairwise_algn_name}/>
                        <input type="hidden" name="input_fasta_seq" value={row.pairwise_algn_seq}/>
                        <input type="submit" value="Show Sequence"/>
                    </form>
		    </TableCell>
		    {/*<TableCell key="5" align="left">{""}</TableCell>*/ /* This cell reserved for IGV links */}
		    </TableRow>
            ))}
        </TableBody>
	    </Table>
	    </Paper>
    );
}

ResultsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResultsTable);
