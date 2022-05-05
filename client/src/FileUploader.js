import React, { Component, useRef, useEffect, useState } from "react";
import axios from "axios";
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import GenericDialog from './GenericDialog';
import FileRenameAlert from './FileRenameAlert';

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

// Set to true to nable debugging messages.
const verbose = false;

const host = window.location.protocol + "//" + window.location.host;
const apiHost = host + '/api';

const FileUploader = ({ onFilesChange, files, dest, serverId, allowedTypes, updateParentState }) => {

    // Create a reference to watch for events in the filepond
    const pond = React.useRef(null);

    // Listener for removeFile events. We need to override the
    // default behavior of deleting the whole directory in which
    // the file resides, since all files within a given pond are
    // stored in a common directory in our implementation.
    React.useEffect(() => {
	pond.current._pond.on('removefile', (error, file) => {
	    axios.delete(apiHost + '/delete',
                         {
			     params: {
				 serverId: serverId,
				 fileName: file.filename
			     }
			 }                                                             
                        ); 
	});
    });

    /* These listeners are meant to disable/enable the "submit"
       button on the parent form to prevent form submission before
       files are finished uploading. However, the state changes
       trigger rerendering of the parent component, which prevents
       proper loading of the filepond (for unknown reasons). To
       prevent this behavior, we have to wrap these components within
       a static component. Mutable state variables, thus, need to be
       passed up two levels. This includes the array of file objects,
       the serverId, and variables controlling display of dialogs
       related to file renaming and restriction enzyme sites. */
    const loadDest = dest + 'Loaded';
    React.useEffect(() => {
	// Disable the submit button on file init.
	pond.current._pond.on('initfile', (file, error) => {
	    if (error) {
		console.log(error);
	    }
	    updateParentState(loadDest, false);
        });
    });
    React.useEffect(() => {
	// Enable the submit button once the file is processed.
	pond.current._pond.on('processfiles', (error) => {
	    if (error) {
		console.log(error);
	    }
	    updateParentState(loadDest, true);
        });
    });

    /* This listener watches for duplicate and space-containg filenames and renames
       by appending '..._1...', '..._2...', etc., tags to the filename, for duplicates,
       and replacing spaces with underscores. */
    React.useEffect(() => {
        pond.current._pond.on('processfile', (file, error) => {
            if (error && verbose) {
                //console.log(error);
            }

	    // To keep track of files we've renamed
	    const renamedFiles = {};
	    
	    // Check for spaces in file names. These will choke medaka.
            let sf = checkForSpaces(pond);
            if (Object.keys(sf).length > 0) {
		combineDicts(renamedFiles, sf);
                updateParentState("renamedFiles", renamedFiles);
                updateParentState("showRenameFilesAlert", true);
            }
	    
	    // Check for duplicate file names and rename as needed.
	    if (checkForDuplicates(pond.current._pond)) {
		// Object to track renamed files.
		let df = renameDuplictes(pond);
		if (Object.keys(df).length > 0) {
		    combineDicts(renamedFiles, df);
		    updateParentState("renamedFiles", renamedFiles);
                    updateParentState("showDuplicateFilesAlert", true);
		}
	    }
	    
        });
    });

    if (verbose) {
	console.log('Render FileUploader ' + dest)
    }
    return (
	<div>
            <FilePond
                allowMultiple={true}
                files={files} 
                ref={pond}
                credits={false}
                server={{
		    url: apiHost,
	            process: "/upload?serverId=" + serverId,
		}}
                onupdatefiles = { (fileItems) => {
	            onFilesChange(fileItems, dest, allowedTypes);
		}}
            />
	</div>
    );
}

function getFilenames(pond) {
    const files	= pond.getFiles();
    const filenames = [];
    files.map( (_file, index) => {
	filenames.push(_file.filename);
    });
    return filenames;
}

function createNewFilename(pond, filename) {
    const filenames = getFilenames(pond);
    let suffix = 1;
    const fnameParts = filename.split('.');
    const fnameRoot = fnameParts[0];
    const ext = fnameParts.slice(1,fnameParts.length).join('.');
    let newFname = fnameRoot + '_' + suffix + '.' + ext;
    while (filenames.some((item, index) => item === newFname)) {
        suffix++;
        newFname = fnameRoot + '_' + suffix + '.' + ext;
    }
    return newFname
}

function checkForDuplicates(pond) {
    // Check the current file pond for duplicate filenames and rename as found.
    const filenames = getFilenames(pond);
    if (filenames.some((item, index) => index !== filenames.indexOf(item))) {
	// There are duplicates.
	return true;
    } else {
	// No duplicates.
	return false;
    }
}

function renameDuplictes(pond) {
    // Rename any duplicate filenames in the pond to avoid collisions
    // in the analysis pipeline. The net result is that both files are
    // renamed with _1, _2, etc., added to the root name. Because of
    // complexities with file deletions triggered by rerenders, etc.,
    // it is problematic to rename only one of the files. Therefore
    
    const renamedFiles = {};
    
    const files = pond.current._pond.getFiles();
    const filenames = getFilenames(pond.current._pond);
    files.forEach( (file, index) => {
        //console.log(file.file.name);
	if (filenames.lastIndexOf(file.filename) > filenames.indexOf(file.filename)) {
            // File is a duplicate. Rename it. Because of filepond quirks,
	    // we must do this by creating a copy with a new name.
	    const newFilename = createNewFilename(pond.current._pond, file.file.name);
            const renamedFile = renameFile(file.file, newFilename);
	    
            // Add the renamed file and remove the original
            pond.current._pond.addFile(renamedFile);
            pond.current._pond.removeFile(file);
	    
            // Keep track of what we've renamed.
            renamedFiles[newFilename] = file.file.name;
        }
    });
    return(renamedFiles);
}

function renameFile(file, name) {
    // Creates a renamed file as a copy from the file given

    /* 
       Filepond has no file name setter and I was unable to
       hack one in, despite mutliple tries. Therefore, this
       is the only way to rename files in the pond.

       Because we can't access the file name directly, we must
       create  a copy of the original with the new name.
    */
    let renamedFile;
    // The try/catch block is here to address the error
    // 'file.slice is not a function' that comes up when
    // processing files with spaces in the names that result
    // in duplicate file names. Apparently the file object is
    // not fully-formed when this is issued??
    console.log(file);
    try {
	renamedFile = file.slice(0, file.size, file.type);
    } catch(err) {
	// file object is not fully formed. Not sure why this
	// happens.
	file.name = name;	
	return file;
    }
    renamedFile.lastModifiedDate = file.lastModifiedDate;
    renamedFile.name = name;
    return renamedFile;
};

function checkForSpaces(pond) {
    // Check for spaces in file names and replace with _ chars.
    const filenames = getFilenames(pond.current._pond);
    const files = pond.current._pond.getFiles();
    
    let _filenames = filenames;
    const renamedFiles = {};
    
    const re = / /g;
    filenames.forEach( (file, index) => {
	_filenames[index] = file.replace(re, '_');
    });

    files.forEach( (file, index) => {
        if (_filenames[index] !== file.file.name) {
            // File was renamed. Replace the original with the renamed file.
	    console.log(file);
            const renamedFile = renameFile(file.file, _filenames[index]);
            pond.current._pond.addFile(renamedFile);
            pond.current._pond.removeFile(file);
            // Keep track of what we've renamed.
            renamedFiles[_filenames[index]] = file.file.name;
        }
    });
    
    return(renamedFiles);
}

function combineDicts(dest_dict, source_dict) {
    // Add records from source_dict to dest_dict
    Object.keys(source_dict).forEach( (key, index) => {
	if (key in dest_dict) {
	    // Do nothing
	} else {
	    dest_dict[key] = source_dict[key];
	}
    });    
}

export default FileUploader;
