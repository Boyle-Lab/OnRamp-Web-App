import React, { Component } from "react";
import FileUploader from './FileUploader';
import Grid from '@material-ui/core/Grid';
import GenericDialog from './GenericDialog';
import Button from '@material-ui/core/Button';
import REOptsTable from './REOptsTable'
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FileRenameAlert from './FileRenameAlert';
import StartNewRun from './StartNewRun';
import FileUploadWrapper from './FileUploadWrapper';
import REOpts from './REOpts';

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

class StartRunWrapper extends Component {
    constructor(props) {
        super(props);
	this.state = {
	    readFiles: [],
	    refFiles: [],
	    refServerId: null,
	    readServerId: null,
	    refFilesLoaded: false,
	    readFilesLoaded: false,
	    fastaREData: {},
	    renamedFiles: {},
	    showRenameFilesAlert: false
        };
    }
    
    componentDidMount() {
	this.updateStateSettings("refServerId", Math.floor(1000000000 + Math.random() * 9000000000));
	this.updateStateSettings("readServerId", Math.floor(1000000000 + Math.random() * 9000000000));
    }
    
    updateStateSettings = (name, value) => {
	this.setState({ [name]: value }, () => { if (verbose) {console.log(name, this.state[name]) } });
    }
    
    handleFilesChange = (fileItems, dest, allowedTypes) => {
        const files = [];
	const filesDict = {};
        fileItems.map( (fileItem, index) => {
	    //console.log(fileItem.filename, index);
	    const filenameParts = fileItem.filename.split('.');
	    let ext = filenameParts[filenameParts.length - 1];
	    if (ext === 'gz' || ext === 'gzip') {
		ext = filenameParts[filenameParts.length - 2]
	    }
	    if (allowedTypes.indexOf(ext) != -1) {
		files.push(fileItem);
	    } else {
		let typesStr = allowedTypes.join(', ');
		alert('Incorrect file type! Allowed types include: ' + typesStr + '. (Files may be compressed with gzip.)');
		fileItem.abortLoad();
	    }

	    // Instantiate a record in the REOpts object for the given file.
	    if (dest === 'refFiles') {
		filesDict[fileItem.filename] = "";
		if (!(fileItem.filename in this.state.fastaREData)) {
		    //console.log('REInit: ', fileItem.filename, index);
		    const newFastaREData = this.state.fastaREData;
		    const newRec = {
			fasta_filename: fileItem.filename,
			enzyme: "",
			cut_sites: [],
			error: ""
		    }
		    newFastaREData[fileItem.filename] = newRec;
		    this.setState({
			fastaREData: newFastaREData
		    }, () => {
			if (verbose) {
			    console.log("fastaREData: ", this.state.fastaREData);
			}
		    });
		}		
	    }
	});
	
	// Make sure we don't have any fastREData objects for files no longer in the pond.
	if (dest === 'refFiles' &&
	    Object.keys(this.state.fastaREData).length !== files.length) {
	    const newFastaREData = this.state.fastaREData;
	    Object.keys(this.state.fastaREData).map((key, index) => {
		if (!(key in filesDict)) {
		    delete newFastaREData[key];
		}
	    });
	    this.setState({ fastaREData: newFastaREData },
			  () => {
			      if (verbose) {
				  console.log(this.state.fastaREData);
			      }
			  });
	}
	
        this.updateStateSettings(dest, files);
	if (!files.length) {
            this.updateStateSettings(dest + 'Loaded', false);
	}
    }

    
    render () {
	if (verbose) {
	    console.log("Render StartNewRun");
	}
        return (
		<div>
		<Grid container spacing={2}>
		
		<Grid item xs={3}>
		{this.state.refServerId !== null &&
		 this.state.readServerId !== null ?
		 <FileUploadWrapper
	            refServerId={this.state.refServerId}
	            readServerId={this.state.readServerId}
	            refFiles={this.state.refFiles}
	            readFiles={this.state.readFiles}
	            handleFilesChange={this.handleFilesChange}
	            updateStateSettings={this.updateStateSettings}
	         /> : ("") }
		<REOpts
	            fastaREData={this.state.fastaREData}
	            updateParentState={this.updateStateSettings}
	            refFiles={this.state.refFiles}
	            refServerId={this.state.refServerId}
	        />
		<GenericDialog
	            name={'Warning!'}
	            open={this.state.showRenameFilesAlert}
	            onClose={() => this.updateStateSettings("showRenameFilesAlert", false)}
	            content=<FileRenameAlert data={this.state.renamedFiles}/>
		/>
		</Grid>

	        <Grid item xs={9}>
		<StartNewRun
                    dataIsLoaded={this.props.dataIsLoaded}
                    updateParentState={this.props.updateParentState}
                    setCookie={this.props.setCookie}
	            readServerId={this.state.readServerId}
	            refServerId={this.state.refServerId}
	            readFiles={this.state.readFiles}
	            refFiles={this.state.refFiles}
	            readFilesLoaded={this.state.readFilesLoaded}
	            refFilesLoaded={this.state.refFilesLoaded}
	            showRenameFilesAlert={this.state.showRenameFilesAlert}
	            renamedFiles={this.state.renamedFiles}
	            fastaREData={this.state.fastaREData}
                />
	    
	    </Grid>

		</Grid>
	    </div>
        );
    }
}


export default StartRunWrapper;
