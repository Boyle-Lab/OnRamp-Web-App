import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

//import TextField from '@material-ui/core/TextField';
import { ValidatorForm } from 'react-material-ui-form-validator';
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


//function OptsTable(props) {
class OptsTable extends Component {
    constructor(props) {
	super(props);
        this.state = {
	    enzymes: {},
	    showEnzymes: false,
	    showOffsets: false,
	    enableSubmit: false
	}
    }

    componentDidMount() {
	const enzymes = {};
	Object.keys(this.props.data).map((key, index) => {
	    enzymes[key] = this.props.data[key].enzyme;
	});
	this.setState({
	    enzymes: enzymes,
	    showEnzymes: true
	}, () => {
	    console.log('enzymes: ', this.state.enzymes);
	});
    }
    
    isError = (value, type) => {
	console.log(value, type);
	if (typeof(value) === type) {
	    return false;
	}
	console.log(value);
	return true;
    }

    handleChange = (key, dest) => event => {
	// Handle changes to form input fields
	event.preventDefault();
	const newData = this.props.data;
	newData[key][dest] = event.target.value;
	if (dest === 'enzyme') {
	    const newEnzymes = this.state.enzymes;
	    newEnzymes[key] = event.target.value;	    
	    this.setState({ 'enzymes': newEnzymes },
			  () => {
			      console.log(this.state.enzymes[key]);
			  });
	}
	this.props.updateParentState('fastaREData', newData);
    }

    processData = () => {
	// Do form stuff
    }

    render() {
	const { classes } = this.props;
	console.log('Render REOptsTable');
	return (
		<Paper className={classes.root}>
		<ValidatorForm
                    ref="enzymesForm"
                    onSubmit={this.processData}
                    onError={errors => console.log(errors)}
		>
		<Table className={classes.table}>
		<TableHead>
		<TableRow key="head">
		{["Plasmid Sequence File", "Restriction Enzyme", "Offset"].map((val, index) => (
			<TableCell key={val} align="left">{val}</TableCell>
		))}
	        </TableRow>
	        </TableHead>
		<TableBody>
		{Object.keys(this.props.data).map((key, index) => (
			<TableRow key={index.toString()}>
			<TableCell key="1" align="left">{key}</TableCell>
			<TableCell key="2" align="left">
			{this.state.showEnzymes ?
			    <TextValidator
                                value={this.state.enzymes[key]}
                                onChange={this.handleChange(key, 'enzyme')}
                                margin="dense"
                                id={'enzymes.' + index}
                                validators={['required']}
                                errorMessages={['This field is required!']}
                                fullWidth={true}
                             />
			 :
			 ("")
			}
		        </TableCell>
			<TableCell key="3" align="right">
			{this.state.showOffsets ?
			 ("Placeholder")
			 :
			 ("")
			}
		        </TableCell>
			</TableRow>
		))}
                </TableBody>
	        </Table>
		<input type="submit" value="Find Offsets" disabled={!(this.state.enableSubmit)}/>
		</ValidatorForm>
	        </Paper>
	);
    }
}

OptsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OptsTable);
