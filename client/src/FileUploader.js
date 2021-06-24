import React, { useRef, useEffect } from "react";
import axios from "axios";
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import browser from './browser_config';

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

const FileUploader = ({ onFilesChange, files, dest, serverId, allowedTypes, updateParentState }) => {
    // Create a reference to watch for events in the filepond
    const pond = React.useRef(null);
    React.useEffect(() => {
	pond.current._pond.on('removefile', (error, file) => {
	    axios.delete(browser.apiAddr + '/delete',
                         {params: { serverId: serverId,
				    fileName: file.filename}
			 }                                                                           
                        ); 
	});
    });

    /* These listeners are meant to disable/enable the "submit"
       button on the parent form to prevent form submission before
       files are finished uploading. However, the state changes
       trigger rerendering of the parent component, which prevents
       proper loading of the filepond (for unknown reasons). This
       is currently handled by controling the rerenders through
       shouldComponentUpdate in the parent component. However,
       this causes the ponds to behave strangely in that only
       every other file addition proceeds normally, with the
       intervening attempts triggering the 'removeFile' callback.
       It's unclear why this happens and how to address it, but
       this probably should be addressed in future builds! */
    const loadDest = dest + 'Loaded';
    React.useEffect(() => {
	pond.current._pond.on('initfile', (file, error) => {
	    if (error) {
		console.log(error);
	    }
	    updateParentState(loadDest, false);
	    
        });
    });
    React.useEffect(() => {
	pond.current._pond.on('processfiles', (error) => {
	    if (error) {
		console.log(error);
	    }
	    updateParentState(loadDest, true);
        });
    });

    console.log('Render FileUploader ' + dest)
    return (
            <FilePond
                allowMultiple={true}
                files={files} 
                ref={pond}
                credits={false}
                server={{
		    url: browser.apiAddr,
	            process: "/upload?serverId=" + serverId,
		}}
                onupdatefiles = { (fileItems) => {
	            onFilesChange(fileItems, dest, allowedTypes);
		}}
            />
    );
}


export default FileUploader;
