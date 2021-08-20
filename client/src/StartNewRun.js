import React, { Component } from "react";
import browser from './browser_config';
import axios from "axios";
import FileUploader from './FileUploader';
import OptsTable from './OptsTable';
import SharedOptsTable from './SharedOptsTable';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Grid from '@material-ui/core/Grid';
import GenericDialog from './GenericDialog';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import REOptsTable from './REOptsTable'
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

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

const ActionButton = withStyles({
  root: {
      boxShadow: 'none',
      textTransform: 'none',
      boxShadow: 'none',
      border: '1px solid',
      padding: '1px 10px',
    },
})(Button);

const modes = ["medaka", "biobin"]

class StartNewRun extends Component {
    constructor(props) {
        super(props);
	this.state = {
	    medakaModels: [],
	    readFiles: [],
	    refFiles: [],
	    name: "",
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
	    readFilesLoaded: false,
	    showBinningOpts: false,
	    showNanofiltOpts: false,
	    showREOpts: false,
	    fastaREData: {}
        };
	this.handleFilesChange = this.handleFilesChange.bind(this);
	this.processData = this.processData.bind(this);
	this.updateStateSettings = this.updateStateSettings.bind(this);
	this.handleChange = this.handleChange.bind(this);
	this.getState = this.getState.bind(this);
    }
    
    componentDidMount() {
	const name = adjectives[Math.floor(Math.random()*adjectives.length)] + '_' + nouns[Math.floor(Math.random()*nouns.length)];
	this.updateStateSettings("name", name);
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
		   this.state.readServerId !== nextState.readServerId ||
		   this.state.name !== nextState.name ||
		   this.state.showBinningOpts !== nextState.showBinningOpts ||
		   this.state.showNanofiltOpts !== nextState.showNanofiltOpts ||
		   this.state.showREOpts !== nextState.showREOpts
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
	const filesDict = {};
        fileItems.map( (fileItem, index) => {
	    console.log(fileItem.filename, index);
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
		    console.log('REInit: ', fileItem.filename, index);
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
			console.log("fastaREData: ", this.state.fastaREData);
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
			  () => { console.log(this.state.fastaREData); });
	}
	
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
	} else if (!event.target.value && (event.target.checked === true || event.target.checked === false)) {
	    console.log(event);
	    val = event.target.checked;
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
	    maxRegions: this.state.maxRegions,
	    name: this.state.name,
	    fastaREData: this.state.fastaREData
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
		this.props.updateParentState("sessionName", res.data.data.name);
		// Set session cookies.
		this.props.setCookie({
		    "refServerId": res.data.data.refServerId,
		    "resServerId": res.data.data.resServerId,
		    "refFile": res.data.data.refFile,
		    "name": res.data.data.name,
		    "date": res.data.data.date
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
	console.log("Render StartNewRun");
        return (
		<div>
		<Grid container spacing={2}>		
		<Grid item xs={3}>
		<Tooltip title="Sequencing file(s) containing reads in fastq format (.fastq or .fq). May be comressed with gzip (.fastq.gz or .fq.gz).">
		<Typography container="div">
                Upload Read Data (fastq):
	        </Typography>
		</Tooltip>
                <FileUploader
	            onFilesChange={this.handleFilesChange}
	            files={this.state.readFiles}
	            dest="readFiles"
	            serverId={this.state.readServerId}
	            allowedTypes={['fq', 'fastq']}
	            updateParentState={this.updateStateSettings}
		/>
		<Tooltip title="Plasmid reference sequence file(s) in fasta format (.fasta or .fa). May be compressed with gzip (.fasta.gz or .fa.gz).">
		<Typography container="div">
		Upload Plasmid Sequences (fasta):
	        </Typography>
		</Tooltip>
                <FileUploader
                    onFilesChange={this.handleFilesChange}
                    files={this.state.refFiles}
                    dest="refFiles"
	            serverId={this.state.refServerId}
	            allowedTypes={['fa', 'fasta']}
                    updateParentState={this.updateStateSettings}
                />
		<Tooltip title="Enter or change restriction enzymes used to linearize plasmids for sequencing.">
		<span>
		<ActionButton
	            variant="contained"
	            disabled={!this.state.refFiles.length}
	            disableRipple
	            onClick={() => this.updateStateSettings("showREOpts", true)}
		>
		    Edit Restriction Enzymes
	        </ActionButton>
		</span>
		</Tooltip>
		<GenericDialog
                    name={'Edit Restriction Enzymes'}
                    open={this.state.showREOpts}
                    onClose={(event, reason) => {
			if (reason === "backdropClick") {
			    return false;
			}
		        this.updateStateSettings("showREOpts", false)}
		    }
                    content=<REOptsTable data={this.state.fastaREData} updateParentState={this.updateStateSettings} serverId={this.state.refServerId}/>
                />
		</Grid>

	    <Grid item xs={9}>
		<ValidatorForm
                    ref="form"
                    onSubmit={this.processData}
                    onError={errors => console.log(errors)}
		>
		<SharedOptsTable
                    names={optsHeader}
                    rows={sharedOpts}
                    medakaModels={this.state.medakaModels}
                    selectedModel={this.state.medakaSelectedModel}
                    handleChange={this.handleChange}
                    handleSettings={this.updateStateSettings}
                    analysisModes={modes}
                    selectedMode={this.state.mode}
                    getState={this.getState}
		/>
		<GenericDialog
	            name={'Biobin Options'}
	            open={this.state.showBinningOpts}
	            onClose={() => this.updateStateSettings("showBinningOpts", false)}
	            content=<BinningOpts handleChange={this.handleChange} getState={this.getState}/>
		/>
		<GenericDialog
                    name={'Nanofilt Options'}
                    open={this.state.showNanofiltOpts}
                    onClose={() => this.updateStateSettings("showNanofiltOpts", false)}
                    content=<NanofiltOpts handleChange={this.handleChange} getState={this.getState}/>
                />
		<Tooltip title="Start your analysis!">
		<input type="submit" value="Submit" disabled={!(this.state.readFiles.length &&
								this.state.refFiles.length &&
								this.props.dataIsLoaded &&
								this.state.refFilesLoaded &&
								this.state.readFilesLoaded
							       )}
		/>
		</Tooltip>
	        </ValidatorForm>
		</Grid>
		</Grid>
	    </div>
        );
    }
}

const optsHeader = ["Option", "Value", "Description"];

const nanofiltOpts = [
    {id: 1, values: ["max_length", "1000000", "Filter reads by maximum length in bp. Default: 1Mb", "maxLen", "number"]},
    {id: 2, values: ["min_length", "0", "Filter reads by minimum length in bp. Default: 0", "minLen", "number"]},
    {id: 3, values: ["min_quality", "7", "Filter reads by quality score > N. Default: 7", "minQual", "number"]}
];

const NanofiltOpts = ({handleChange, getState}) => (
	<OptsTable names={optsHeader} rows={nanofiltOpts} handleChange={handleChange} getState={getState}/>
)

const sharedOpts = [
    {id: 1, values: ["Run Name", "", "Run identifier for retrieving saved sessions.", "name", null]},
    {id: 2, values: ["Analysis Mode", "medaka", "Analysis mode to use.", "mode", null]},
    {id: 3, values: ["Medaka Model", "", "Medaka consensus model, Pore/Guppy version.", "medakaSelectedModel", null]},
    {id: 4, values: ["Double the reference genome", "false", "Double the reference genome, great for visualization, less for consensus generation.", "double", null]},
    {id: 5, values: ["Use Nanofilt", "false", "Filter reads with nanofilt.", "nanofilt", null]},
    {id: 6, values: ["Trim adapters with Porechop", "false", "Trim adapters from reads with Porechop.", "trim", null]},
];

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
	<OptsTable names={optsHeader} rows={binningOpts} handleChange={handleChange} getState={getState}/>
)

function parseBoolean(string) {
    if (string === "true") {
	return true
    }
    return false
}

const adjectives = ['extreme', 'orange', 'green', 'blue', 'indigo', 'violet', 'violent', 'belligerent', 'victorious', 'meek', 'deliberate', 'swift', 'undulating', 'cantankerous', 'zygomorphic', 'fancy', 'dull', 'shifty', 'mistaken', 'childish', 'manly', 'huge', 'miniscule', 'gorgeous', 'sandy', 'gritty', 'smooth', 'wispy', 'florrid', 'vegetal', 'animalistic', 'unprotected', 'fervent', 'insufferble', 'bulbous', 'pendulous', 'bullish', 'horrifying', 'mystical', 'lemony', 'fruity', 'brutish', 'fantastic', 'horrible', 'cheesy', 'horrendous', "mauve", "pink", "puce", "stinky", "fabulous", "reverent", "irreverent", "illogical", "logical", "reasonable", "unreasonable", "lugubrious", "masterful", "demanding", "fabricated", 'knobby', 'restful', 'serene', 'bustling', 'bellicose', 'burgeoning', 'bumbling'];

const nouns = ['pants', 'shoe', 'channel', 'hamburger', 'bar', 'fish', 'trout', 'gazelle', 'macintosh', 'davenport', 'shill', 'fabricator', 'dingbat', 'cow', 'goat', 'parakeet', 'dishwasher', 'sausage', 'taco', 'automobile', 'chicken', 'doorbell', 'dumbell', 'lifter', 'hammer', 'pliers', 'window', 'pacifier', 'baseball', 'filbert', 'sandwich', 'box', 'scrimshaw', 'yearbook', 'horse', 'methamphetamine', 'sanitizer', 'vaccine', 'plague', 'handlebar', 'mystic', 'president', 'minister', 'bellwether', 'cheesemaker', 'cobbler', 'whale', 'hunchback', 'chair', 'hamburger', 'child', 'camel', 'llama', 'screwdriver', 'micropipette', 'centrifuge', 'freezer', 'gearshift', 'knob', 'guitar', 'violin', 'piano', 'harpsichord', 'tuba', 'trombone', 'saxophone', 'triangle', 'square', 'rectangle', 'parallellogram', 'rhombus', 'serenity', 'filter', 'funnel', 'trilobite', 'dinosaur', 'bracken', 'bracket', 'racket', 'rack', 'shack', 'lever', 'octogon', 'hexagon', 'pentagon', 'trapezoid', 'sine', 'cosine', 'tangent', 'cotangent', 'secant', 'gravel', 'garden', 'tomato', 'potato', 'pepper', 'corvid', 'tube', 'slacks', 'trousers', 'suspenders', 'undershirt', 'flannel', 'kilt', 'lemon', 'lime', 'grapefruit', 'orange', 'satsuma', 'tatsoi', 'celery', 'carrot', 'beans'];


export default StartNewRun;
