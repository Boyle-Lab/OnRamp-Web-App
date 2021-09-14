import React, { Component } from "react";
import browser from './browser_config';
import axios from "axios";
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
import ErrorContent from './ErrorContent';
import FileRenameAlert from './FileRenameAlert';

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

// This toggles several console.log messages for dubugging purposes.
const verbose = false;

class StartNewRun extends Component {
    constructor(props) {
        super(props);
	this.state = {
	    medakaModels: [],
	    name: "",
	    mode: "medaka",
	    medakaSelectedModel: "r941_min_high_g360",
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
	    processingErr: null,
	    showErrorDialog: false
        };
    }
    
    componentDidMount() {
	const name = adjectives[Math.floor(Math.random()*adjectives.length)] + '_' + nouns[Math.floor(Math.random()*nouns.length)];
	this.updateStateSettings("name", name);
	axios.post(browser.apiAddr + "/getMedakaModels",
		   {
		       contentType: "application/json",
		       encodingType: "utf8"
		   }
		  )
            .then(res => {
                const models = JSON.parse(res.data.data);
		this.updateStateSettings("medakaModels", models.models);
		// We will now use the default model indicated in the pipeline.
		//this.updateStateSettings("medakaSelectedModel", models.default_model);
		this.props.updateParentState("dataIsLoaded", true);
            })
            .catch(error => {
                console.log(error.response);
                // Handle the error
            });
    }

    componentWillUnmount() {
        // Clean up our area.
    }

    updateStateSettings = (name, value) => {
	this.setState({ [name]: value }, () => { if (verbose) {console.log(name, this.state[name]) } });
    }
    
    handleChange = name => event => {
	event.preventDefault();
	let val;
	if (!event.target.value) {
	    val = null;
	} else {
	    val = event.target.value
	}
	this.updateStateSettings(name, val);
    };    

    // Used by child components to retrieve a state from this component in lieu
    // of providing it as a prop.
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
	    trim: this.state.trim
	}

	// Server method only needs the file names and locations. Passing the full filepond
	// object appears not to work, so pull out the necessary information here and pass
	// in as text.
	const readFiles = this.getFilenamesFromPond(this.props.readFiles);
	const readServerId = this.props.readFiles[0].serverId;
	const refFiles = this.getFilenamesFromPond(this.props.refFiles);
	const refServerId = this.props.refFiles[0].serverId;

	// Call the server method to launch the analysis. Location of results is returned.
	//console.log(this.props.renamedFiles);
	axios.post(browser.apiAddr + "/processData",
                   { readFiles: readFiles,
		     readServerId: readServerId,
		     refFiles: refFiles,
		     refServerId: refServerId,
		     renamedFiles: this.props.renamedFiles,
		     fastaREData: this.props.fastaREData,
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
		if (verbose) {
		    console.log(res.data.data.runParams);
		}
		this.props.updateParentState("runParams", res.data.data.runParams);
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
		//console.log(error.response);
		this.props.updateParentState("dataIsLoaded", true);
                this.setState({
                    processingErr: error.response.data.message,
                    showErrorDialog: true
                });
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
	if (verbose) {
	    console.log("Render StartNewRun");
	}
	return (
		<div>
		<Grid container spacing={2}>		

		<Grid item xs={12}>
		<ValidatorForm
                    ref="form"
                    onSubmit={this.processData}
                    onError={errors => console.log(errors)}
		>
		<SharedOptsTable
                    medakaModels={this.state.medakaModels}
                    selectedModel={this.state.medakaSelectedModel}
                    handleChange={this.handleChange}
                    handleSettings={this.updateStateSettings}
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
		<input type="submit" value="Submit" disabled={!(this.props.readFiles.length &&
								this.props.refFiles.length &&
								this.props.dataIsLoaded &&
								this.props.refFilesLoaded &&
								this.props.readFilesLoaded
							       )}
		/>
		</Tooltip>
	        </ValidatorForm>
		</Grid>
		</Grid>
		<GenericDialog
	            name={'Error!'}
	            open={this.state.showErrorDialog}
	            onClose={() => this.updateStateSettings("showErrorDialog", false)}
	            content=<ErrorContent error={this.state.processingErr}/>
		/>
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

const adjectives = ['extreme', 'orange', 'green', 'blue', 'indigo', 'violet', 'violent', 'belligerent', 'victorious', 'meek', 'deliberate', 'swift', 'undulating', 'cantankerous', 'zygomorphic', 'fancy', 'dull', 'shifty', 'mistaken', 'childish', 'manly', 'huge', 'miniscule', 'gorgeous', 'sandy', 'gritty', 'smooth', 'wispy', 'florrid', 'vegetal', 'animalistic', 'unprotected', 'fervent', 'insufferble', 'bulbous', 'pendulous', 'bullish', 'horrifying', 'mystical', 'lemony', 'fruity', 'brutish', 'fantastic', 'horrible', 'cheesy', 'horrendous', "mauve", "pink", "puce", "stinky", "fabulous", "reverent", "irreverent", "illogical", "logical", "reasonable", "unreasonable", "lugubrious", "masterful", "demanding", "fabricated", 'knobby', 'restful', 'serene', 'bustling', 'bellicose', 'burgeoning', 'bumbling', 'icy', 'fragile', 'chubby', 'squeamish', 'loving', 'confident', 'selfish', 'handy', 'comfortable', 'hissing', 'sick', 'didactic', 'classy', 'equal', 'terrific', 'sincere', 'daffy', 'macabre', 'dull', 'dependent', 'psychedelic', 'medical', 'nippy', 'nasty', 'crabby', 'complex', 'rabid', 'wasteful', 'painful', 'certain', 'roomy', 'bored', 'uptight', 'keen', 'descriptive', 'tedious', 'wrathful', 'faithful', 'safe', 'thankful', 'soggy', 'ugliest', 'puny', 'daily', 'truthful', 'honorable', 'frightened', 'super', 'oceanic', 'homeless', 'barbarous', 'inquisitive', 'jaded', 'youthful', 'every', 'near', 'unbiased', 'callous', 'dynamic', 'horrible', 'tasteful', 'untidy', 'strange', 'many', 'mental', 'abortive', 'exclusive', 'impressive', 'bawdy', 'smiling', 'wiry', 'tender', 'adjoining', 'exuberant', 'squealing', 'questionable', 'enchanting', 'sticky', 'short', 'second', 'simplistic', 'fearless', 'abundant', 'filthy', 'picayune', 'sturdy', 'acid', 'faithful', 'succinct', 'gentle', 'apathetic', 'squeamish', 'unhappy', 'disgusting', 'southern', 'foregoing', 'accessible', 'mute', 'long-term', 'mixed', 'innocent', 'sudden', 'sloppy', 'uptight', 'different', 'brave', 'exuberant', 'harmonious', 'tranquil', 'thankful', 'rigid', 'sable', 'living', 'sharp', 'mellow', 'uninterested', 'rebel', 'mean', 'teeny', 'wide', 'temporary', 'nosy', 'humdrum', 'hushed', 'dreary', 'decisive', 'sassy', 'recondite', 'internal', 'unusual', 'many', 'scandalous', 'simplistic', 'resonant', 'easy', 'well-made', 'puny', 'ill-informed', 'clean', 'scrawny', 'shallow', 'wealthy', 'permissible'];

const nouns = ['pants', 'shoe', 'channel', 'hamburger', 'bar', 'fish', 'trout', 'gazelle', 'macintosh', 'davenport', 'shill', 'fabricator', 'dingbat', 'cow', 'goat', 'parakeet', 'dishwasher', 'sausage', 'taco', 'automobile', 'chicken', 'doorbell', 'dumbell', 'lifter', 'hammer', 'pliers', 'window', 'pacifier', 'baseball', 'filbert', 'sandwich', 'box', 'scrimshaw', 'yearbook', 'horse', 'methamphetamine', 'sanitizer', 'vaccine', 'plague', 'handlebar', 'mystic', 'president', 'minister', 'bellwether', 'cheesemaker', 'cobbler', 'whale', 'hunchback', 'chair', 'hamburger', 'child', 'camel', 'llama', 'screwdriver', 'micropipette', 'centrifuge', 'freezer', 'gearshift', 'knob', 'guitar', 'violin', 'piano', 'harpsichord', 'tuba', 'trombone', 'saxophone', 'triangle', 'square', 'rectangle', 'parallellogram', 'rhombus', 'serenity', 'filter', 'funnel', 'trilobite', 'dinosaur', 'bracken', 'bracket', 'racket', 'rack', 'shack', 'lever', 'octogon', 'hexagon', 'pentagon', 'trapezoid', 'sine', 'cosine', 'tangent', 'cotangent', 'secant', 'gravel', 'garden', 'tomato', 'potato', 'pepper', 'corvid', 'tube', 'slacks', 'trousers', 'suspenders', 'undershirt', 'flannel', 'kilt', 'lemon', 'lime', 'grapefruit', 'orange', 'satsuma', 'tatsoi', 'celery', 'carrot', 'beans', 'hydroxychloroquine', 'operation', 'student', 'community', 'wood', 'bonus', 'beer', 'error', 'investment', 'math', 'analysis', 'ability', 'person', 'classroom', 'nation', 'soup', 'policy', 'perception', 'environment', 'historian', 'penalty', 'negotiation', 'movie', 'feedback', 'industry', 'restaurant', 'power', 'arrival', 'pie', 'priority', 'dealer', 'understanding', 'scene', 'month', 'salad', 'possession', 'surgery', 'hall', 'analyst', 'situation', 'ear', 'area', 'society', 'communication', 'president', 'police', 'hearing', 'dinner', 'difficulty', 'mall', 'family', 'church', 'development', 'health', 'fishing', 'leadership', 'independence', 'problem', 'law', 'throat', 'reality', 'coffee', 'celebration', 'appearance', 'baseball', 'fortune', 'dinner', 'editor', 'agency', 'selection', 'president', 'student', 'analysis', 'classroom', 'manager', 'complaint', 'supermarket', 'negotiation', 'confusion', 'importance', 'refrigerator', 'employee', 'height', 'soup', 'tale', 'way', 'conversation', 'role', 'uncle', 'sister', 'technology', 'leader', 'argument', 'food', 'virus', 'energy', 'science', 'owner', 'intention', 'camera', 'insurance'];


export default StartNewRun;
