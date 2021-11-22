const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const fileUpload = require("express-fileupload");
const cors = require('cors')
const fs = require('fs-extra');
const path = require('path');
const compression = require('compression');
const {PythonShell} = require('python-shell');
const { exec } = require('child_process');
const yaml = require('js-yaml');

const API_PORT = 3001;
const app = express();
const router = express.Router();

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

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(bodyParser.json({limit: '500mb', extended: true}));
app.use(logger("dev"));
app.use(compression());

// Enabale cross-origin requests
let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Enable file uploads
app.use(fileUpload());

// This is our file upload method.
router.post('/upload', (req, res) => {
    res.set('Content-Type', 'text/plain');
    if (Object.keys(req.files).length == 0) {
	res.set('Content-Type', 'application/json');
	return res.status(400).json({ message: 'No files were uploaded.' });
    }
    const serverId = req.query.serverId;
    fs.mkdir('/tmp/' + serverId, { recursive: true }, (err) => {
	if (err) {
	    console.log(err);
	    res.set('Content-Type', 'application/json');
	    return res.status(500).json({ message: err });
	};
    });
    req.files.filepond.mv('/tmp/' + serverId + '/' + req.files.filepond.name, function(err) {
	if (err) {
	    console.log(err);
	    res.set('Content-Type', 'application/json');
	    return res.status(500).json({ message: err });
	}
	return res.status(200).send(serverId.toString());
    });
});

// This is our user file delete method.
router.delete('/delete', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const { serverId, fileName } = req.query;
    let _filePath = '/tmp/' + serverId;
    if (fileName) {
	_filePath = _filePath + '/' + fileName;
    }
    fs.stat(_filePath, (err, stats) => {
	if (err) {
	    console.log(err);
	} else {
	    fs.remove(_filePath, (err) => {
		if (err) { console.log(err);
			   //return res.status(500).send(err);
			 }
	    });  
	}
    });
    return res.status(200).send('Deleted');
});

// This is a dummy endpoint for empty delete requests that happen
// as a result of the FilePond module.
router.delete('', (req, res) => {
    return res.status(200);
});

// Retrieve a local file from the given path.
router.post("/getFile", (req, res) => {
    const { fileName, contentType, encodingType } = req.body;
    res.set('Content-Type', contentType);
    fs.readFile(fileName, encodingType, (err, data) => {
        if (err) {
	    console.log(err);
	    res.set('Content-Type', 'application/json');
            return res.json({ success: false, error: err });
        }
        return res.json({ success: true, data: data });
    });
});

// This method writes a json object to a local file.
router.post('/writeJson', (req, res) => {
    const { fileName, index } = req.body;
    if (index.length == 0) {
        return res.status(400).json({ message: 'No content.' });
    }
    fs.writeFile(fileName, JSON.stringify(index), (err) => {
	console.log(err);
	res.set('Content-Type', 'application/json');
        return res.status(500).json({ message: err });
    });
    return res.status(200).send('Success');
});

// This method is used to retrieve analysis results for display in IGV.
router.get("/getResult", (req, res) => {
    res.set('Content-Type', 'application/json');
    const { serverId, fileName, contentType, encodingType } = req.query;
    const filePath = '/tmp/' + serverId + '/' + fileName;
    res.set('Content-Type', contentType);
    fs.readFile(filePath, encodingType, (err, data) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        return res.status(200).send(data);
    });
});

// This method is used to retrieve analysis results for download as a tarball.
router.get("/downloadResults", (req, res) => {
    const { serverId, fileName, } = req.query;
    const filePath = '/tmp/' + serverId + '/' + fileName;
    res.set({'Content-Type': 'application/x-gtar',
	     'Content-Disposition': 'attachment; filename=' + fileName});
    fs.readFile(filePath, null, (err, data) => {
        if (err) {
	    console.log(err);
	    res.set('Content-Type', 'application/json');
            return res.status(400).json({ message: err });
        }
        return res.status(200).send(data);
    });
});

// This method retrieves analysis results for download by the user.
router.post("/prepareResults", (req, res) => {
    res.set('Content-Type', 'application/json');

    const { serverId } = req.body;
    const resultsPath = '/tmp/' + serverId + '/';

    // Must put the tarball some place else during creation.
    const resServerId = Math.floor(1000000000 + Math.random() * 9000000000)
    const destPath = '/tmp/' + resServerId + '/';
    fs.mkdir(destPath);
    
    // Tar up the results for download.
    const outFile = 'bulkPlasmidSeq_' + serverId + '_results.tar.gz';
    exec('tar -czf ' + destPath + outFile + ' ' + resultsPath + '*', (err, stdout, stderr) => {
	if (err) {
	    console.log(err);
	    return res.status(400).json({ message: 'Results retrieval failed: ' + err });
	}
	return res.json({success: true, data: {serverId: resServerId, fileName: outFile} });
    });
});

// This method retrieves the available medaka models and returns the result as an array.
router.post('/getMedakaModels', (req, res) => {
    res.set('Content-Type', 'application/json');
    // First check to see if we have a cached json file.
    fs.readFile("medakaModels.json", "utf8", (err,data) => {
	if (err) {
	    // File not found. Get models from medaka tools.
	    let options = {}
	    PythonShell.run('getMedakaModels.py', options, function (err, results) {
		if (err) {
		    console.log(err)
		    res.status(500).json({ message: 'error getting medaka models: ' + err });
		}
		// Cache the modes for future use.
		fs.writeFile("medakaModels.json", JSON.stringify(results), (err) => {
		    if (err) {
			// File could not be written.
			console.log(err);
		    }
		});
		return res.json({ success: true, data: results });
	    });
	} else {
	    return res.json({ success: true, data: JSON.parse(data) });
	}
    })
});

// This method processes user inputs to launch the analysis pipeline.
router.post('/processData', (req, res) => {
    // The analysis needs to be run within an async function in order to force
    // sequential execution of external scripts.
    runAnalysis(req, res);
});

// This method retrieves existing data from the server for a session run
// within the last 24 hours. (session data stored in a cookie)
router.post('/processCachedData', (req, res) => {
    res.set('Content-Type', 'application/json');

    const { resServerId, refServerId, refFile, name } = req.body;

    // Get locations of data on the server.
    const refPath = '/tmp/' + refServerId + '/';
    const resPath = '/tmp/' + resServerId + '/';

    // Get the run params from the stored session.
    fs.readFile(resPath + 'run_params.json', 'utf8', (err, data) => {
	if (err) {
	    console.log(err);
            res.status(500).json({ message: 'Cannot restore session:' + err });
	}
    
	// Container for results locations.
	const resData = { algnFile: "filtered_alignment.bam",
			  refServerId: refServerId,
			  resServerId: resServerId,
			  refFile: refFile,
			  name: name,
			  runParams: JSON.parse(data)
			};
	
	// Get stats for the reference sequences.
	let pipelineOptions = {
            mode: 'text',
            pythonPath: '/usr/local/miniconda/envs/medaka/bin/python3',
            pythonOptions: ['-u'],
            args: [refPath, resPath + 'consensus_sequences', resPath + 'filtered_alignment.bam']
	}
	
	PythonShell.run('processResults.py', pipelineOptions, function (err, resStats) {
            if (err) {
		console.log(err)
		res.status(500).json({ message: err });
            } else {
		return res.json({ success: true, data: resData, stats: JSON.parse(resStats) });
            }
	});
    });    
});

// This method finds restriction enzyme offsets based on user inputs and fasta files in a directory.
router.post('/findREOffsets', (req, res) => {
    res.set('Content-Type', 'application/json');

    const { serverId, fastaREStr } = req.body;
    let options = {
        mode: 'text',
        pythonPath: '/usr/local/miniconda/envs/medaka/bin/python3',
        pythonOptions: ['-u'],
        args: [ '/tmp/' + serverId, fastaREStr ]
    };
    PythonShell.run('findCutSites.py', options, function (err, results) {
        if (err) {
            console.log(err)
            res.status(400).json({ message: 'error finding offsets:' + err });
        }
        //console.log(results);
	return res.json({ success: true, data: results[0] });
    });
});


// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));


/******************************************************************************************************/
// Helper functions

findGzipped = async function (resolve, reject, files, path, _cmdArgs, i) {
    // Locate gzipped files at the given path.
    filename = files[i];
    //console.log(filename);
    let fnameParts = filename.split('.');
    let ext = fnameParts[fnameParts.length-1];
    if (ext === 'gz' || ext === 'gzip') {
	//console.log('GZfile: ', filename);
	await fs.access(path + filename, fs.constants.F_OK, (err) => {
	    if (err) {
		// File does not exist or was already inflated: do nothing.
		//console.log('File not found.');
		i++;
		if (i < files.length) {
                    findGzipped(resolve, reject, files, path, _cmdArgs, i);
                } else {
                    //console.log("289:", _cmdArgs);
                    return resolve(_cmdArgs);
                }
	    } else {
		//console.log('File was found');
		_cmdArgs.push(path + filename);
		i++;
		if (i < files.length) {
		    findGzipped(resolve, reject, files, path, _cmdArgs, i);
		} else {
		    //console.log("299:", _cmdArgs);
		    return resolve(_cmdArgs);
		}
	    }
	});
    } else {
	i++;
        if (i < files.length) {
            findGzipped(resolve, reject, files, path, _cmdArgs, i);
        } else {
            //console.log("309:", _cmdArgs);
            return resolve(_cmdArgs);
        }
    }
}

handleGzipped = async function (files, path) {
    // Unzip any gzipped files found in array.
    const _outfiles = [];

    // Check each file for gzip/gz extension
    files.forEach(function (filename) {
        let fnameParts = filename.split('.');
        let ext	= fnameParts[fnameParts.length-1];
        if (ext === 'gz' || ext === 'gzip') {
	    _outfiles.push(fnameParts.slice(0,-1).join('.'));
        } else {
            _outfiles.push(filename);
	}
    });

    let _cmdArgs = ["gunzip"];
    await new Promise((r, j) => findGzipped(r, j, files, path, _cmdArgs, 0));

    //console.log("333:", _cmdArgs.length);
    // Unzip all gzipped files found.
    if (_cmdArgs.length === 1) {
	// There are no gzipped files.
	return new Promise((resolve, reject) => {
	    setTimeout(() => {
		resolve(_outfiles);
	    }, 1);
	});
    } else {
	return new Promise((resolve, reject) => {
	    exec(_cmdArgs.join(' '), (error, stdout, stderr) => {
		if (error) {
		    console.log(err);
		    reject(error);
		} else {
		    resolve(_outfiles);
		}
	    });
	});
    }
}

handleRenamed = function(renamedFiles, path) {
    // Handle fasta record names within renamed files.
    // Returns a promise.
    let cmdArgs = [path, JSON.stringify(renamedFiles)]
    let options = {
        mode: 'text',
        pythonPath: '/usr/local/miniconda/envs/medaka/bin/python3',
        pythonOptions: ['-u'],
        args: cmdArgs
    }
    return new Promise((resolve, reject) => {
	PythonShell.run('renameSeqs.py', options, function (err, results) {
            if (err) {
		console.log(err);
		reject(err);
            } else {
		resolve(results);
            }
	});
    });
}

catFastaFiles = function(_refFiles, refPath, outPath) {
    // Combine reference sequence files into a single fasta for display
    // in the IGV component.
    const filesToCat = ["cat"];
    // Append the refPath to all files.
    _refFiles.forEach(function (filename) {
        filesToCat.push(refPath + filename);
    });
    // Add a redirect to the combined output fasta. This must go into the results
    // directory or it will crash medaka!
    filesToCat.push('>');
    filesToCat.push(outPath + 'combined_ref_seqs.fasta');
    // Combine files with cat.
    return new Promise((resolve, reject) => {
	exec(filesToCat.join(' '), (error, stdout, stderr) => {
            if (error) {
		console.log(err);
		reject(error);
            } else {
		resolve();
	    }
	});
    });
}

runPlasmidSeq = function(cmdArgs) {
    // Run the bulkPlasmidSeq pipeline with given options.
    let options = {
        mode: 'text',
        pythonPath: '/usr/local/miniconda/envs/medaka/bin/python3',
        pythonOptions: ['-u'],
        args: cmdArgs
    }
    
    return new Promise((resolve, reject) => {	
	PythonShell.run('/usr/local/bulkPlasmidSeq/bulkPlasmidSeq.py', options, function (err, resData) {
            if (err) {
		console.log(err);
		reject(err);
	    } else {
		resolve();
	    }
	});
    });		       
}

runProcessResults = function(refPath, outPath) {
    let options = {
        mode: 'text',
        pythonPath: '/usr/local/miniconda/envs/medaka/bin/python3',
        pythonOptions: ['-u'],
        args: [refPath, outPath + 'consensus_sequences', outPath + 'filtered_alignment.bam']
    }

    return new Promise((resolve, reject) => {
	PythonShell.run('processResults.py', options, function (err, resStats) {
            if (err) {
		console.log(err);
		const keyErr = err.stack.match(/(KeyError:\s+\S+)/);
		if (keyErr &&  keyErr.length > 0) {
		    err = 'Error: One or more reference sequences was not found in the alignment! Did you forget to supply restriction enzyme(s) for any duplicated reference sequence files? ' + keyErr[0];
		}
		reject(err);
	    } else {
		resolve(resStats);
            }
	});
    });
}

// async function to run the python-based pipeline steps sequentially.
runAnalysis = async function(req, res) {
    const { readFiles, readServerId, refFiles, refServerId, renamedFiles, fastaREData, options } = req.body;

    // Get locations of data on the server.
    const readPath = '/tmp/' + readServerId + '/';
    const refPath = '/tmp/' + refServerId + '/';

    // Create a directory for output.
    const serverId = Math.floor(1000000000 + Math.random() * 9000000000);
    const outPath = '/tmp/' + serverId + '/';
    try {
	await fs.mkdir(outPath);
    } catch(err) {
	console.log(err);
    }

    // JSON object for storage of run params. This will be stored as part of
    // the resData object and be written to disk so it is included in results
    // downloads.
    const runParams = {};

    // Container for results locations.
    const resData = { algnFile: "filtered_alignment.bam",
                      refServerId: refServerId,
                      resServerId: serverId,
                      origRefFiles: refFiles,
                      runParams: runParams
                    };

    // Process restriction enzyme offsets into a yaml file to supply the
    // --restriction_enzyme_table option.
    const yamlData = {};
    Object.keys(fastaREData).map( (key, index) => {
        let fnameParts = key.split('.');
        let offset = 1;
        let ext = fnameParts[fnameParts.length - offset];
        if (ext === 'gz' || ext === 'gzip') {
            offset++;
        }
        const newKey = fnameParts.slice(0, fnameParts.length - offset).join('.');

        yamlData[newKey] = { fileName: key };
        if (fastaREData[key].cut_sites.length == 1) {
            yamlData[newKey]["cut-site"] = fastaREData[key].cut_sites[0];
        } else {
            if (fastaREData[key].cut_sites.length == 0) {
                yamlData[newKey]["cut-site"] = 0;
            } else {
                return res.status(400).json({ message: 'Error in restriction offsets: Multiple cut sites found for ' + fastaREData[key].enxyme + ' in ' + key + '!' });
            }
        }
        if (fastaREData[key].enzyme !== "") {
            yamlData[newKey]["enzyme"] = fastaREData[key].enzyme;
        }
    });
    fs.writeFile(outPath + 'restriction_enzyme_cut_sites.yaml', yaml.dump(yamlData), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error in restriction offsets: could not write yaml file: ' + err });
        }
    });
    // Store this as part of the run params.
    runParams["plasmidEnzymeData"] = yamlData;
    
    // Deal with any gzipped files.
    let _refFiles = [];
    try {
	_refFiles = await handleGzipped(refFiles, refPath);
    } catch(err) {
	console.log(err);
	return res.status(500).json({ message: 'Error inflating gzipped reference files: ' + err });
    }
    
    let _readFiles = [];
    try{
	_readFiles = await handleGzipped(readFiles, readPath);
    } catch(err) {
	console.log(err);
	return res.status(500).json({ message: 'Error inflating gzipped read files: ' + err });
    }

    // Build the array of command-line args using the options object.
    const cmdArgs = [];

    // Analysis mode comes first.
    cmdArgs.push(options.mode);
    runParams["mode"] = options.mode;

    // Read file/directory is next
    cmdArgs.push('-i');
    cmdArgs.push(readPath);
    runParams["sequencingReadFiles"] = readFiles;

    // Ref file/directory is next.
    cmdArgs.push('-r');
    cmdArgs.push(refPath);
    runParams["plasmidReferenceFiles"] = refFiles;

    // Store the run name and date.
    resData["name"] = options.name;
    resData["date"] = Date().toString();
    runParams["name"] = options.name;
    runParams["date"] = resData["date"];
    
    // Handle the medaka consensus model.
    cmdArgs.push('--model');
    cmdArgs.push(options.medakaModel);
    runParams["medakaConsensusModel"] = options.medakaModel;
    
    // Handle the trim arg.
    if (options.trim) {
        cmdArgs.push('--trim');
        runParams["trim"] = true;
    }

    // Handle the --restriction_enzyme_table option.
    cmdArgs.push('--restriction_enzyme_table');
    cmdArgs.push(outPath + 'restriction_enzyme_cut_sites.yaml');
    
    // Next we'll handle options specific to biobin mode.
    if (options.mode === "biobin") {
	runParams["biobinOptions"] = {};
        cmdArgs.push('--marker_score');
        cmdArgs.push(options.markerScore);
        runParams["biobinOptions"]["marker_score"] = options.markerScore;
	cmdArgs.push('--kmer_length');
        cmdArgs.push(options.kmerLen);
	runParams["biobinOptions"]["kmer_length"] = options.kmerLen;
        cmdArgs.push('--match');
        cmdArgs.push(options.match);
        runParams["biobinOptions"]["match"] = options.match;
        cmdArgs.push('--mismatch');
        cmdArgs.push(options.mismatch);
        runParams["biobinOptions"]["mismatch"] = options.mismatch;
        cmdArgs.push('--gap_open');
        cmdArgs.push(options.gapOpen);
        runParams["biobinOptions"]["gap_open"] = options.gapOpen;
        cmdArgs.push('--gap_extend');
        cmdArgs.push(options.gapExtend);
        runParams["biobinOptions"]["gap_extend"] = options.gapExtend;
        cmdArgs.push('--context_map');
        cmdArgs.push(options.contextMap);
        runParams["biobinOptions"]["context_map"] = options.contextMap;
        cmdArgs.push('--fine_map');
        cmdArgs.push(options.fineMap);
        runParams["biobinOptions"]["fine_map"] = options.fineMap;
        cmdArgs.push('--max_regions');
        cmdArgs.push(options.maxRegions);
        runParams["biobinOptions"]["max_regions"] = options.maxRegions;
    }

    // Handle options specific to nanofilt.
    if (options.filter) {
        cmdArgs.push('--filter');
        runParams["filter"] = true;
        runParams["nanofiltOptions"] = {};
        cmdArgs.push('--max_length');
        cmdArgs.push(options.maxLen);
        runParams["nanofiltOptions"]["max_length"] = options.maxLen;
        cmdArgs.push('--min_length');
        cmdArgs.push(options.minLen);
        runParams["nanofiltOptions"]["min_length"] = options.minLen;
        cmdArgs.push('--min_quality');
        cmdArgs.push(options.minQual);
        runParams["nanofiltOptions"]["min_quality"] = options.minQual;
    }

    // Add the output directory.
    cmdArgs.push('-o');
    cmdArgs.push(outPath);

    // Write the run params to the output directory as JSON (can be done
    // asynchronously since these are not used directly by the pipeline).
    fs.writeFile(outPath + 'run_params.json', JSON.stringify(runParams), (err) => {
        if (err) {
            // File not written. Return an error.
            return res.status(500).json({ message: "Could not write params file." });
        }
    });

    // Write params to console for debug purposes.
    console.log(cmdArgs.join(' '));
    
    // Update the sequence names within any renamed (duplicate) files.
    if (Object.keys(renamedFiles).length > 0) {
	//console.log("Processing renamed files...");
        try {
            await handleRenamed(renamedFiles, refPath);
        } catch(err) {
	    console.log(err);
            res.status(500).json({ message: 'Error renaming sequences within renamed files: ' + err });
        }
	//console.log('Renamed files processed.');
    }

    // After handling renamed files, we need to assemble the combined fasta file
    // for the IGV component. This can run asynchronously since the combined
    // file is not used unless someone opens the IGV component in their results.
    //console.log('Combining reference fasta files...');
    try {
	catFastaFiles(_refFiles, refPath, outPath);
	//console.log('Reference fasta files combined.');
    } catch(err) {
	return res.status(500).json({ message: 'Error combining reference files: ' + error });
    }
    resData["refFile"] = 'combined_ref_seqs.fasta';
    
    // Next we'll run the main pipeline.
    //console.log("Running the analysis pipeline...");
    try {
        await runPlasmidSeq(cmdArgs);
	//console.log("Analysis pipeline finished.");
    } catch(err) {
	// For biobin mode, we sometimes get no results due to zero mapped
        // reads being assigned to any plasmids. We need to handle this
        // gracefully.
        if (options.mode === 'biobin') {
            // We have to parse the actual error message out of the stack trace...
            const stackTrace = err.stack.split('\n');
            if (stackTrace[0] === 'Error: No reads were assigned to any plasmid!') {
                return res.status(400).json({ message: 'Biobin ' + stackTrace[0] });
            }
	} else {
            return res.status(400).json({ message: err });
        }
    }
    
    // Finally, gather up stats from the analysis and return the results.
    //console.log("Processing results...");
    let resStats = {};
    try {
	resStats = await runProcessResults(refPath, outPath);
	//console.log("Results processed.");
    } catch(err) {
	console.log(err)
	return res.status(400).json({ message: err });
    }

    // Return the results if all went well.
    return res.json({ success: true, data: resData, stats: JSON.parse(resStats) });
}
