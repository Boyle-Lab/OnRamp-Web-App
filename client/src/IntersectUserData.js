import React, { Component } from "react";
import browser from './browser_config';
import axios from "axios";
import FileUploader from './FileUploader';
import OptsTable from './OptsTable';
import SharedOptsTable from './SharedOptsTable';

import { ValidatorForm } from 'react-material-ui-form-validator';

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

const modes = ["medaka", "biobin"]

class IntersectUserData extends Component {
    constructor(props) {
        super(props);
	this.state = {
	    medakaModels: [],
	    readFiles: [],
	    refFiles: [],
	    mode: "medaka",
	    medakaSelectedModel: "",
	    double: false,
	    trim: false,
	    nanofilt: false,
	    maxLen: 1000000,
	    minLen: 0,
	    minQual: 7,
	    markerScore: 95,
	    kmerLen: 12,
	    match: 3,
	    mismatch: -6,
	    gapOpen: -10,
	    gapExtend: -5,
	    contextMap: 0.80,
	    fineMap: 0.95,
	    maxRegions: 3,
	    refServerId: null,
	    readServerId: null,
	    refFilesLoaded: false,
	    readFilesLoaded: false
        };
	this.handleFilesChange = this.handleFilesChange.bind(this);
	this.processData = this.processData.bind(this);
	this.updateStateSettings = this.updateStateSettings.bind(this);
	this.handleChange = this.handleChange.bind(this);
	this.getState = this.getState.bind(this);
    }
    
    componentDidMount() {
	this.updateStateSettings("refServerId", Math.floor(1000000000 + Math.random() * 9000000000));
	this.updateStateSettings("readServerId", Math.floor(1000000000 + Math.random() * 9000000000));
	axios.post(browser.apiAddr + "/getMedakaModels",
		   {
		       contentType: "application/json",
		       encodingType: "utf8"
		   }
		  )
            .then(res => {
                const models = JSON.parse(res.data.data);
		this.updateStateSettings("medakaModels", models.models);
		this.updateStateSettings("medakaSelectedModel", models.default_model);
		this.props.updateParentState("dataIsLoaded", true);
            })
            .catch(error => {
                console.log(error.response);
                // Handle the error
            });
    }

    shouldComponentUpdate(nextProps, nextState) {
	/* This is here because updating the filesLoaded state triggers
	   rerendering, which (for some reason) prevents files from loading
	   in the ponds. I can't quite figure out why this happens, but
	   preventing the rerenders addresses this problem. However, there
	   is another problem in that file uploads to the pond are now glitchy.
	   The first upload to either pond works fine. However, the second
	   upload attempt does not proceed as expected: there is no upload
	   request received by the server; instead, there are multiple delete
	   requests for the (nonexistent) file on the server. The third attempt
	   works properly, but every other attempt after that fails with the
	   same "delete" behavior and no upload requests. It's not clear why 
	   this is the case and I don't have a solution at present! */
	if ( (this.state.refFiles.length === nextState.refFiles.length &&
	      this.state.refFilesLoaded !== nextState.refFilesLoaded) ||
	     (this.state.readFiles.length === nextState.readFiles.length &&	
              this.state.readFilesLoaded !== nextState.readFilesLoaded)) {
	    return true;
	} else if (this.state.mode !== nextState.mode ||
		   this.state.medakaModels !== nextState.medakaModels ||
                   this.state.medakaSelectedModel !== nextState.medakaSelectedModel ||
		   this.state.double !== nextState.double ||
		   this.state.nanofilt !== nextState.nanofilt ||
		   this.state.trim !== nextState.trim ||
		   this.state.maxLen !== nextState.maxLen ||
		   this.state.minLen !== nextState.minLen ||
		   this.state.minQual !== nextState.minQual ||
		   this.state.markerScore !== nextState.markerScore ||
		   this.state.kmerLen !== nextState.kmerLen ||
		   this.state.match !== nextState.match ||
		   this.state.mismatch !== nextState.mismatch ||
		   this.state.gapOpen !== nextState.gapOpen ||
		   this.state.gapExtend !== nextState.gapExtend ||
		   this.state.contextMap !== nextState.contextMap ||
		   this.state.fineMap !== nextState.fineMap ||
		   this.state.maxRegions !== nextState.maxRegions ||
		   this.state.refServerId !== nextState.refServerId ||
		   this.state.readServerId !== nextState.readServerId
		   
	    ) {
	    return true;
	} else {
	    return false;
	}
    }
    
    componentWillUnmount() {
        // Clean up our area.
    }

    updateStateSettings = (name, value) => {
	this.setState({ [name]: value }, () => { console.log(name, this.state[name]) });
    }
    
    handleFilesChange = (fileItems, dest, allowedTypes) => {
        const files = [];
        fileItems.map( function (fileItem) {
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
	});
        this.updateStateSettings(dest, files);
	if (!files.length) {
            this.updateStateSettings(dest + 'Loaded', false);
	}
    }

    handleChange = name => event => {
	event.preventDefault();
	// Because we have some menus passing in booleans as strings, we need
	// to pre-process values to make sure they are stored as the correct
	// type in state.
	let val;
	if (event.target.value === "true" || event.target.value === "false") {
	    val = parseBoolean(event.target.value)
	} else {
	    val = event.target.value
	}
	this.updateStateSettings(name, val);
    };

    getState = (name) => {
	return(this.state[name])
    }
    
    // This is where we call pybedtools to do the intersection.
    processData = (event) => {
	//console.log(event);
	this.props.updateParentState("dataIsLoaded", false)

	// We need to pass the two (lists of) files to the backend, along
	// with all the options. Pack up options for convenience.
	const opts = {
	    mode: this.state.mode,
	    medakaModel: this.state.medakaSelectedModel,
	    double: this.state.double,
	    filter: this.state.nanofilt,
	    maxLen: this.state.maxLen,
	    minLen: this.state.minLen,
	    minQual: this.state.minQual,
	    markerScore: this.state.markerScore,
	    kmerLen: this.state.kmerLen,
	    match: this.state.match,
	    mismatch: this.state.mismatch,
	    gapOpen: this.state.gapOpen,
	    gapExtend: this.state.gapExtend,
	    contextMap: this.state.contextMap,
	    fineMap: this.state.fineMap,
	    maxRegions: this.state.maxRegions
	}

	// Server method only needs the file names and locations. Passing the full filepond
	// object appears not to work, so pull out the necessary information here and pass
	// in as text.
	const readFiles = this.getFilenamesFromPond(this.state.readFiles);
	const readServerId = this.state.readFiles[0].serverId;
	const refFiles = this.getFilenamesFromPond(this.state.refFiles);
	const refServerId = this.state.refFiles[0].serverId;

	// Call the server method to launch the analysis. Location of results is returned.
	axios.post(browser.apiAddr + "/processData",
                   { readFiles: readFiles,
		     readServerId: readServerId,
		     refFiles: refFiles,
		     refServerId: refServerId,
                     options: opts
                   }
                  )
            .then(res => {
		// Display the results in the parent component.
		this.props.updateParentState("refServerId", res.data.data.refServerId);
		this.props.updateParentState("resServerId", res.data.data.resServerId);
		this.props.updateParentState("refFile", res.data.data.refFile);
		this.props.updateParentState("algnFile", res.data.data.algnFile);
		this.props.updateParentState("dataIsLoaded", true);
		this.props.updateParentState("resData", res.data.stats);
		this.props.updateParentState("showResults", true);
		// Set session cookies.
		this.props.setCookie({
		    "refServerId": res.data.data.refServerId,
		    "resServerId": res.data.data.resServerId,
		    "refFile": res.data.data.refFile,
		});
		
            })
            .catch(error => {
                console.log(error);
		// Handle the error
            });
	event.preventDefault();
    }

    getFilenamesFromPond = (files) => {
	// Process a filePond to get the file names
	const ret = []
	files.forEach(function (file) {
	    ret.push(file.filename);
	});
	return(ret);
    }
    
    render () {
	console.log("Render IntersectUserData");
        return (
	    <div>
                Upload Read Data (fastq):
                <FileUploader
	            onFilesChange={this.handleFilesChange}
	            files={this.state.readFiles}
	            dest="readFiles"
	            serverId={this.state.readServerId}
	            allowedTypes={['fq', 'fastq']}
	            updateParentState={this.updateStateSettings}
		/>
		Upload Plasmid Sequences (fasta):
                <FileUploader
                    onFilesChange={this.handleFilesChange}
                    files={this.state.refFiles}
                    dest="refFiles"
	            serverId={this.state.refServerId}
	            allowedTypes={['fa', 'fasta']}
                    updateParentState={this.updateStateSettings}
                />
		<ValidatorForm
            ref="form"
            onSubmit={this.processData}
            onError={errors => console.log(errors)}
		>
		<SharedOpts
                    medakaModels = {this.state.medakaModels}
                    selectedModel = {this.state.medakaSelectedModel}
                    handleChange = {this.handleChange}
         	    analysisModes = {modes}
	            selectedMode = {this.state.mode}
        	    getState = {this.getState}
		/>
                {
		    this.state.mode === "medaka" ?
			(<div></div>)
			:
			<BinningOpts handleChange={this.handleChange} getState={this.getState}/>
		}
		{
		    this.state.nanofilt ?
			<NanofiltOpts handleChange = {this.handleChange} getState={this.getState}/> :
		    (<span></span>)
		}
	        {/*<form onSubmit={this.processData}>*/}
		<input type="submit" value="Submit" disabled={!(this.state.readFiles.length &&
								this.state.refFiles.length &&
								this.props.dataIsLoaded &&
								this.state.refFilesLoaded &&
								this.state.readFilesLoaded
							       )}
		/>
	        </ValidatorForm>
	    </div>
        );
    }
}

const optsHeader = ["Option", "Value", "Description"];

const nanofiltOpts = [
    {id: 1, values: ["max_length", "1000000", "Filtering reads by maximum length in bp. Default: 1Mb", "maxLen", "number"]},
    {id: 2, values: ["min_length", "0", "Filtering reads by minimum length in bp. Default: 0", "minLen", "number"]},
    {id: 3, values: ["min_quality", "7", "Filter reads by quality score > N. Default: 7", "minQual", "number"]}
];

const NanofiltOpts = ({handleChange, getState}) => (
	<div>Nanofilt Options:<br/>
	<OptsTable names={optsHeader} rows={nanofiltOpts} handleChange={handleChange} getState={getState}/>
	</div>
)

const sharedOpts = [
    {id: 1, values: ["Analysis Mode", "medaka", "Analysis mode to use.", "mode", null]},
    {id: 2, values: ["model", "", "Medaka consensus model, Pore/Guppy version.", "medakaSelectedModel", null]},
    {id: 3, values: ["double", "false", "Double the reference genome, great for visualization, less for consensus generation.", "double", null]},
    {id: 4, values: ["filter", "false", "Filter reads with nanofilt.", "nanofilt", null]},
    {id: 5, values: ["trim", "false", "Trim adapters from reads with Porechop.", "trim", null]},
];

const SharedOpts = ({medakaModels, selectedModel, handleCheck, handleChange, analysisModes, selectedMode, getState}) => (
	<div>General Options:<br/>
	<SharedOptsTable
            names={optsHeader}
            rows={sharedOpts}
            medakaModels={medakaModels}
            selectedModel={selectedModel}
            handleChange={handleChange}
            analysisModes={analysisModes}
            selectedMode={selectedMode}
            getState={getState}
	/>
	</div>
)

const binningOpts = [
    {id: 1, values: ["marker_score", "95", "Percent score for longest unique region.", "markerScore", "number"]},
    {id: 2, values: ["kmer_length", "12", "Kmer length to use.", "kmerLen", "number"]},
    {id: 3, values: ["match", "3", "Match score", "match", "number"]},
    {id: 4, values: ["mismatch", "-6", "Mismatch penalty", "mismatch", "number"]},
    {id: 5, values: ["gap_open", "-10", "Gap-open penalty", "gapOpen", "number"]},
    {id: 6, values: ["gap_extend", "-5", "Gap extension penalty", "gapExtend", "number"]},
    {id: 7, values: ["context_map", "0.80", "Context map", "contextMap", "number"]},
    {id: 8, values: ["fine_map", "0.95", "Fine map", "fineMap", "number"]},
    {id: 9, values: ["max_regions", "3", "Maximum number of regions to align/score", "maxRegions", "number"]}
];

const BinningOpts = ({handleChange, getState}) => (
	<div>Biobin Options:<br/>
	<OptsTable names={optsHeader} rows={binningOpts} handleChange={handleChange} getState={getState}/>
	</div>
)

function parseBoolean(string) {
    if (string === "true") {
	return true
    }
    return false
}

export default IntersectUserData;
