import React, { Component } from 'react';
import FileUploader from './FileUploaer';
import StartNewRun from './StartNewRun';
import FileRenameAlert from './FileRenameAlert';
import Grid from '@material-ui/core/Grid';


/*
This code is part of the bulk_plasmid_seq_web distribution                            
(https://github.com/Boyle-Lab/bulk_plasmid_seq_web) and is governed by its license.   
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

class FileRenameAlert extends Component {
    constructor(props) {
        super(props);
	this.state = {
	    showFileRenameAlert: false
	}
    }

    shouldComponentUpdate() {
	// This is a static component.
	return false;
    }

    render() {
	return (
	    <div>
                <Grid container spacing={2}>
		<Grid item xs={3}>
	    <FileUploader
                    onFilesChange={this.handleFilesChange}
                    files={this.state.readFiles}
                    dest="readFiles"
                    serverId={this.state.readServerId}
                    allowedTypes={['fq', 'fastq']}
                    updateParentState={this.updateStateSettings}
                />
		<FileUploader
                    onFilesChange={this.handleFilesChange}
                    files={this.state.refFiles}
                    dest="refFiles"
                    serverId={this.state.refServerId}
                    allowedTypes={['fa', 'fasta']}
                    updateParentState={this.updateStateSettings}
                />
		</Grid>
		</Grid>
	);
    }
