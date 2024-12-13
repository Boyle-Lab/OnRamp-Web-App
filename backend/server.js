const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const fileUpload = require("express-fileupload");
const cors = require('cors')
const fs = require('fs-extra');
const fsPromises = require('node:fs/promises');
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
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const serverId = req.query.serverId;
    console.error(new Date() + ' (' + reqIp + '): upload serverId: ' + serverId);
    res.set('Content-Type', 'text/plain');
    // Sometimes an empty reqest comes in (i.e., req.files is undefined).
    // Not sure why this happens, but it will crash the server if we do
    // not handle it.
    try {
	Object.keys(req.files);
    } catch(err) {
	res.set('Content-Type', 'application/json');
        res.status(400).json({ message: 'No files were uploaded.' });
        return;
    }
    if (Object.keys(req.files) === undefined || Object.keys(req.files) === null || Object.keys(req.files).length == 0) {
	res.set('Content-Type', 'application/json');
	res.status(400).json({ message: 'No files were uploaded.' });
	return;
    }
    fs.mkdir('/tmp/' + serverId, { recursive: true }, (err) => {
	if (err) {
	    console.error(new Date() + ': ' + err);
	    res.set('Content-Type', 'application/json');
	    res.status(500).json({ message: err });
	    return;
	}

	// await won't work here so we have to put this inside the
	// callback to avoid send errors.
	req.files.filepond.mv('/tmp/' + serverId + '/' + req.files.filepond.name, function(err) {
	    if (err) {
		console.error(new Date() + ': ' + err);
		res.set('Content-Type', 'application/json');
		res.status(500).json({ message: err });
		return;
	    }
	    res.status(200).send(serverId.toString());
	    return;
	});
    });
});

// This method runs various format checks on a file.
router.post('/checkformat', (req, res) => {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const {serverId, fileName, fileFormat} = req.body;
    console.error(new Date() + ' (' + reqIp + '): ' + 'checkFormat serverId: ' + serverId + ' fileName: ' + fileName + ' fileFormat: ' + fileFormat);

    if (serverId === undefined ||
	fileName === undefined ||
	fileFormat === undefined) {
	res.set('Content-Type', 'application/json');
        res.status(400).json({ message: 'An unknown error occured. Please check the file type and extensions for all your files and retry. If this problem persists, please contact the development team for assistance.' });
        return;
    }

    verifyFile(res, serverId, fileName, fileFormat, '/tmp/' + serverId);
    return;
});

// This is our user file delete method.
router.delete('/delete', (req, res) => {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { serverId, fileName } = req.query;    
    console.error(new Date() + ' (' + reqIp + '): ' + 'delete serverId: ' + serverId + ' fileName: ' + fileName);
    let _filePath = '/tmp/' + serverId;
    if (fileName) {
	_filePath = _filePath + '/' + fileName;
    }
    fs.stat(_filePath, (err, stats) => {
	if (err) {
	    console.error(new Date() + ': ' + err);
	} else {
	    fs.remove(_filePath, (err) => {
		if (err) {
		    console.error(new Date() + ': ' + err);
		    res.set('Content-Type', 'application/json');
		    res.status(500).json({ message: err });
		    return;
		}
	    });  
	}
    });
    res.set('Content-Type', 'text/plain');
    res.sendStatus(200);
    return;
});

// This is a dummy endpoint for empty delete requests that happen
// as a result of the FilePond module.
router.delete('', (req, res) => {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.error(new Date() + ' (' + reqIp + '): ' + 'delete (empty)');
    res.sendStatus(200);
    return;
});

// Retrieve a local file from the given path.
router.post("/getFile", (req, res) => {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { fileName, contentType, encodingType } = req.body;
    console.error(new Date() + ' (' + reqIp + '): ' + 'getFile fileName: ' + fileName);
    fs.readFile(fileName, encodingType, (err, data) => {
        if (err) {
	    console.error(new Date() + ': ' + err);
	    res.set('Content-Type', 'application/json');
            res.json({ success: false, error: err });
	    return;
        }
	res.set('Content-Type', contentType);
        res.status(200).json({ success: true, data: data });
	return;
    });
});

// This method writes a json object to a local file.
router.post('/writeJson', (req, res) => {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { fileName, index } = req.body;
    if (index.length == 0) {
	res.set('Content-Type', 'application/json');
        res.status(400).json({ message: 'No content.' });
	return;
    }
    fs.writeFile(fileName, JSON.stringify(index), (err) => {
	console.error(new Date() + ': ' + err);
	res.set('Content-Type', 'application/json');
        res.status(500).json({ message: err });
	return;
    });
    res.set('Content-Type', 'text/plain');
    res.sendStatus(200);
    return;
});

// This method is used to retrieve analysis results for display in IGV.
router.get("/getResult", (req, res) => {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { serverId, fileName, contentType, encodingType } = req.query;
    console.error(new Date() + ' (' + reqIp + '): ' + 'getResult ' + serverId + ' ' + fileName);
    const filePath = '/tmp/' + serverId + '/' + fileName;
    fs.readFile(filePath, encodingType, (err, data) => {
        if (err) {
	    console.error(new Date() + ': ' + err);
	    res.set('Content-Type', contentType);
            res.status(400).json({ message: err });
	    return;
        }
	res.set('Content-Type', contentType);
        res.status(200).send(data);
	return;
    });
});

// This method is used to retrieve analysis results for download as a tarball.
router.get("/downloadResults", (req, res) => {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { serverId, fileName, } = req.query;
    console.error(new Date() + ' (' + reqIp + '): ' + 'downloadResults ' + serverId + ' ' + fileName);
    const filePath = '/tmp/' + serverId + '/' + fileName;
    fs.readFile(filePath, null, (err, data) => {
        if (err) {
	    console.error(new Date() + ': ' + err);
	    res.set('Content-Type', 'application/json');
            res.status(400).json({ message: err });
	    return;
        }
	res.set({'Content-Type': 'application/x-gtar',
		 'Content-Disposition': 'attachment; filename=' + fileName});
        res.status(200).send(data);
	return;
    });
});

// This method retrieves analysis results for download by the user.
router.post("/prepareResults", (req, res) => {
    // We need to call an async function to make sure we return a proper server PID!
    prepareResults(req, res);
});

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

prepareResults = async function(req, res) {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { serverId, scope, sessionName } = req.body;
    console.error(new Date() + ' (' + reqIp + '): ' + 'prepareResults ' + serverId + ' ' + scope + ' ' + sessionName);
    const resultsPath = '/tmp/' + serverId;

    // The following array will eventually be replaced by a file
    // list given in the request body. This will allow users to select
    // only the files they want to download. For now, we will just hard-
    // code the list of files to include in the download. This is mainly
    // to avoid including various versions of files that were uploaded by
    // the user.
    let fileList = ["filtered_alignment.bam*", "consensus_sequences", "combined_ref_seqs.fasta", "rotated_reference.fasta", "consensus_probs.hdf", "restriction_enzyme_cut_sites.yaml", "run_params.json", "pipelineProcess.err", "medaka_log.txt"];
    if (scope == "consensus") {
	fileList = ["consensus_sequences", "restriction_enzyme_cut_sites.yaml", "run_params.json", "pipelineProcess.err", "medaka_log.txt"];
    }

    // Must put the tarball some place else during creation.
    const resServerId = Math.floor(1000000000 + Math.random() * 9000000000)
    const destPath = '/tmp/' + resServerId + '/';
    fs.mkdir(destPath);    
    
    // Tar up the results for download.
    let now = new Date();
    const santizedSessionName = sessionName.replaceAll(" ", "_") // No spaces allowed in file name!
    const outFile = 'OnRamp-Results-for_'
	  + sanitizedSessionName + '_'
	  + days[now.getDay()] + '_'
	  + now.getMonth() + '-'
	  + now.getDate() + '-'
	  + now.getFullYear() + '_'
	  + now.getHours() + '-'
	  + now.getMinutes() + '-'
	  + now.getSeconds()
	  + '.tar.gz';
    // Build the args string for the external script.
    let cmdArgs = destPath + outFile + ' ' + resultsPath;
    // Add the files, separated by spaces.
    cmdArgs = cmdArgs + ' ' + fileList.join(' ');
    cmdArgs = cmdArgs + ' ' + destPath
    console.error("prepareResults: " + cmdArgs);
    try {
	let pid_line = await runPrepareDownload(cmdArgs, destPath);
	res.set('Content-Type', 'application/json');
	res.status(200).json({
	    success: true,
	    data: {
		serverId: resServerId,
		fileName: outFile,
		PID: pid_line.replace(/[\n\r]/g, '')
	    }
	});
    } catch(err) {
	res.set('Content-Type', 'application/json');
	res.status(400).json({ message: err });
        return;
    }
}

// This method runs tar on the server as a background process and returns the PID.
runPrepareDownload = function(cmdArgs) {
    //console.error(cmdArgs);
    return new Promise((resolve, reject) => {
        exec('./runPrepareDownload.sh ' + cmdArgs, (err, stdout, stderr) => {
            if (err) {
                console.error(new Date() + 'runPrepareDownload: ' + err);
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
}

// This method checks for a running process from runPrepareDownload
router.post('/checkDownloadPrepJob', (req, res) => {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { serverId, serverPID, fileName } = req.body;
    console.error(new Date() + ' (' + reqIp + '): ' + 'checkDownloadPrepJob ' + serverId + ' ' + serverPID + ' ' + fileName);

    // Check for the PID of the pipeline process.
    try {
        process.kill(serverPID, 0);
        // If we've gotten this far, the process is still running.
        // Resolve the request accordingly.
	res.set('Content-Type', 'application/json');
        res.status(200).json({ pipelineStatus: "running" });
	return;
    } catch(err) {
        // Process is not running. See if we have results or an error.
        checkDownloadFile(reqIp, res, serverId, fileName);
	return;
    }
});

// This function checks to make sure a download file is present when/where it's expected.
checkDownloadFile = async function(reqIp, res, serverId, fileName) {
    // Get location of data on the server.
    const resPath = '/tmp/' + serverId + '/';

    // Check for the final tarball. If this is present, the download prep 
    // completed successfully and we can return results.
    fs.access(resPath + fileName, fs.constants.F_OK, (err) => {
        if (err) {
            // No tarball found. There was an error.
            // Process any stored error output and return it along with the json 
            processError(reqIp, res, resPath);
            return;
        } else {
            // All is well! Process the output and return results.
	    res.set('Content-Type', 'application/json');
            res.status(200).json({ pipelineStatus: "completed" });
            return;
        }
    });
}

// This method retrieves the available medaka models and returns the result as an array.
router.post('/getMedakaModels', (req, res) => {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // First check to see if we have a cached json file.
    fs.readFile("medakaModels.json", "utf8", (err,data) => {
	if (err) {
	    // File not found. Get models from medaka tools.
	    let options = {}
	    PythonShell.run('getMedakaModels.py', options, function (err, results) {
		if (err) {
		    console.error(new Date() + ': ' + err)
		    res.set('Content-Type', 'application/json');
		    res.status(500).json({ message: 'error getting medaka models: ' + err });
		    return;
		}
		// Cache the modes for future use.
		fs.writeFile("medakaModels.json", JSON.stringify(results), (err) => {
		    if (err) {
			// File could not be written.
			console.error(new Date() + ': ' + err);
		    }
		});
		res.set('Content-Type', 'application/json');
		res.status(200).json({ success: true, data: results });
		return;
	    });
	} else {
	    res.set('Content-Type', 'application/json');
	    res.status(200).json({ success: true, data: JSON.parse(data) });
	    return;
	}
    })
});

// This method processes user inputs to launch the analysis pipeline.
router.post('/processData', (req, res) => {
    // The analysis needs to be run within an async function in order to force
    // sequential execution of external scripts.
    runAnalysis(req, res);
});

// Check progress on a (running/completed/failed) pipeline job.
router.post('/checkJob', (req, res) => {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    res.set('Content-Type', 'application/json');
    const { refServerId, resServerId, serverPID } = req.body;
    console.error(new Date() + ' (' + reqIp + '): ' + 'checkJob refServerId: ' + refServerId+ ' serverPid: ' + serverPID);

    // Check for the PID of the pipeline process.
    try {
	process.kill(serverPID, 0);
	// If we've gotten this far, the process is still running.
	// Resolve the request accordingly.
	res.status(200).json({ pipelineStatus: "running" });	
    } catch(err) {
	// Process is not running. See if we have results or an error.
	checkOutput(reqIp, res, refServerId, resServerId);
	//res.status(200).json({ pipelineStatus: "completed" });
    }    
});

// This method retrieves existing data from the server for a session run
// within the last 24 hours. (session data stored in a cookie)
router.post('/processCachedData', (req, res) => {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    res.set('Content-Type', 'application/json');

    const { resServerId, refServerId, refFile, name } = req.body;
    console.error(new Date() + ' (' + reqIp + '): ' + 'processCachedData ' + resServerId+ ' ' + refServerId + ' ' + refFile + ' ' + name);

    // Get locations of data on the server.
    const refPath = '/tmp/' + refServerId + '/';
    const resPath = '/tmp/' + resServerId + '/';

    // Get the run params from the stored session.
    fs.readFile(resPath + 'run_params.json', 'utf8', (err, data) => {
	if (err) {
	    console.error(new Date() + ': ' + err);
            res.status(500).json({ message: 'Cannot restore session:' + err });
	    return;
	}
    
	// Container for results locations.
	const resData = { algnFile: "filtered_alignment.bam",
			  refServerId: refServerId,
			  resServerId: resServerId,
			  refFile: refFile,
			  name: name,
			  runParams: JSON.parse(data)
			};
	
	// Process results for display.
	checkOutput(reqIp, res, refServerId, resServerId, resData);
    });    
});

// This method finds restriction enzyme offsets based on user inputs and fasta files in a directory.
router.post('/findREOffsets', (req, res) => {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    res.set('Content-Type', 'application/json');

    const { serverId, fastaREStr } = req.body;
    console.error(new Date() + ' (' + reqIp + '): ' + 'findREOffsets ' + serverId + ' ' + fastaREStr);
    
    let options = {
        mode: 'text',
        pythonPath: '/usr/local/miniconda/envs/medaka/bin/python3',
        pythonOptions: ['-u'],
        args: [ '/tmp/' + serverId, fastaREStr ]
    };
    PythonShell.run('findCutSites.py', options, function (err, results) {
        if (err) {
            console.error(new Date() + ': ' + err)
            res.status(400).json({ message: 'error finding offsets:' + err });
	    return;
        }
        //console.error(results);
	res.status(200).json({ success: true, data: results[0] });
	return;
    });
});


// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.error(`LISTENING ON PORT ${API_PORT}`));


/******************************************************************************************************/
// Helper functions
    
findGzipped = async function (resolve, reject, files, path, _cmdArgs, i) {
    // Locate gzipped files at the given path.
    filename = files[i];
    //console.error(filename);
    let fnameParts = filename.split('.');
    let ext = fnameParts[fnameParts.length-1];
    if (ext === 'gz' || ext === 'gzip') {
	//console.error('GZfile: ', filename);
	await fs.access(path + filename, fs.constants.F_OK, (err) => {
	    if (err) {
		// File does not exist or was already inflated: do nothing.
		//console.error('File not found.');
		i++;
		if (i < files.length) {
                    findGzipped(resolve, reject, files, path, _cmdArgs, i);
                } else {
                    //console.error("289:", _cmdArgs);
                    return resolve(_cmdArgs);
                }
	    } else {
		//console.error('File was found');
		_cmdArgs.push(path + filename);
		i++;
		if (i < files.length) {
		    findGzipped(resolve, reject, files, path, _cmdArgs, i);
		} else {
		    //console.error("299:", _cmdArgs);
		    return resolve(_cmdArgs);
		}
	    }
	});
    } else {
	i++;
        if (i < files.length) {
            findGzipped(resolve, reject, files, path, _cmdArgs, i);
        } else {
            //console.error("309:", _cmdArgs);
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

    //console.error("333:", _cmdArgs.length);
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
	    exec(_cmdArgs.join(' '), (err, stdout, stderr) => {
		if (err) {
		    console.error(new Date() + ': ' + err);
		    reject(err);
		} else {
		    resolve(_outfiles);
		}
	    });
	});
    }
}

handleRenamed = function(path) {
    // Make sure all fasta record names match the file names.
    // Returns a promise.
    let cmdArgs = [path]
    let options = {
        mode: 'text',
        pythonPath: '/usr/local/miniconda/envs/medaka/bin/python3',
        pythonOptions: ['-u'],
        args: cmdArgs
    }
    return new Promise((resolve, reject) => {
	PythonShell.run('renameSeqs.py', options, function (err, results) {
            if (err) {
		console.error(new Date() + ': ' + err);
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
	exec(filesToCat.join(' '), (err, stdout, stderr) => {
            if (err) {
		console.error(new Date() + ': ' + err);
		reject(err);
            } else {
		resolve();
	    }
	});
    });
}

runPlasmidSeq = function(cmdArgs) {
    // Run the bulkPlasmidSeq pipeline with given cmdArgs.
    return new Promise((resolve, reject) => {
	exec('./runPipelineBackground.sh ' + cmdArgs.join(' '), (err, stdout, stderr) => {
            if (err) {
		console.error(new Date() + ': ' + err);
		reject(err);
	    } else {
		resolve(stdout);
	    }
	});
    });		       
}

runProcessResults = function(refPath, outPath) {
    let cmdArgs = [refPath, outPath + 'consensus_sequences', outPath + 'filtered_alignment.bam'];
    let options = {
        mode: 'text',
        pythonPath: '/usr/local/miniconda/envs/medaka/bin/python3',
        pythonOptions: ['-u'],
        args: cmdArgs
    }

    console.error('processResults.py ' + cmdArgs.join(' '));
    return new Promise((resolve, reject) => {
	PythonShell.run('processResults.py', options, function (err, resStats) {
            if (err) {
		console.error(new Date() + ': ' + err);
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
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { readFiles, readServerId, refFiles, refServerId, fastaREData, options } = req.body;
    console.error(new Date() + ' (' + reqIp + '): ' + 'processData refServerId: ' + refServerId + ' readServerId: ' + readServerId);

    // Get locations of data on the server.
    const readPath = '/tmp/' + readServerId + '/';
    const refPath = '/tmp/' + refServerId + '/';

    // Create a directory for output.
    const serverId = Math.floor(1000000000 + Math.random() * 9000000000);
    const outPath = '/tmp/' + serverId + '/';
    try {
	await fs.mkdir(outPath);
    } catch(err) {
	console.error(new Date() + ': Could not create output directory: ' + outPath + '; ' + err);
	res.status(500).json({ message: 'Cannot restore session:' + err });
	return;
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
    Object.keys(fastaREData).map ((key, index) => {
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
                res.status(400).json({ message: 'Error in restriction offsets: Multiple cut sites found for ' + fastaREData[key].enxyme + ' in ' + key + '!' });
		return;
            }
        }
        if (fastaREData[key].enzyme !== "") {
            yamlData[newKey]["enzyme"] = fastaREData[key].enzyme;
        }
    });
    fs.writeFile(outPath + 'restriction_enzyme_cut_sites.yaml', yaml.dump(yamlData), (err) => {
        if (err) {
	    console.error(new Date() + ': ' + err);
            res.status(500).json({ message: 'Error in restriction offsets: could not write yaml file: ' + err });
	    return;
        }
    });
    // Store this as part of the run params.
    runParams["plasmidEnzymeData"] = yamlData;
    
    // Deal with any gzipped files.
    let _refFiles = [];
    try {
	_refFiles = await handleGzipped(refFiles, refPath);
    } catch(err) {
	//console.error(new Date() + ': ' + err);
	res.status(500).json({ message: 'Error inflating gzipped reference files: ' + err });
	return;
    }
    
    let _readFiles = [];
    try{
	_readFiles = await handleGzipped(readFiles, readPath);
    } catch(err) {
	//console.error(new Date() + ': ' + err);
	res.status(500).json({ message: 'Error inflating gzipped read files: ' + err });
	return;
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
	    console.error(new Date() + ': ' + err);
            res.status(500).json({ message: "Could not write params file." });
	    return;
        }
    });

    // Write params to console for debug purposes.
    console.error(new Date() + ' (' + reqIp + '): processData cmdArgs: ' + cmdArgs.join(' '));
    
    // Make sure fasta sequence names match file names.
    //console.error("Processing renamed files...");
    try {
        await handleRenamed(refPath);
    } catch(err) {
	//console.error(new Date() + ': ' + err);
        res.status(500).json({ message: 'Error renaming sequences within renamed files: ' + err });
	return;
    }
    //console.error('Renamed files processed.');

    // After handling renamed files, we need to assemble the combined fasta file
    // for the IGV component. This can run asynchronously since the combined
    // file is not used unless someone opens the IGV component in their results.
    //console.error('Combining reference fasta files...');
    try {
	await catFastaFiles(_refFiles, refPath, outPath);
	//console.error('Reference fasta files combined.');
    } catch(err) {
	//console.error(new Date() + ': ' + err);
	res.status(500).json({ message: 'Error combining reference files: ' + err });
	return;
    }
    //resData["refFile"] = 'combined_ref_seqs.fasta';
    resData["refFile"] = 'rotated_reference.fasta';
    
    // We'll run the main pipeline on the server as a background
    // job, returning the process ID for monitoring purposes.
    //console.error("Running the analysis pipeline...");
    try {
	let pid_line = await runPlasmidSeq(cmdArgs);
        resData["PID"] = pid_line.replace(/[\n\r]/g, '');
	//console.error("Analysis pipeline finished.");
    } catch(err) {
	//console.error(new Date() + ': ' + err);
	// For biobin mode, we sometimes get no results due to zero mapped
        // reads being assigned to any plasmids. We need to handle this
        // gracefully.
        if (options.mode === 'biobin') {
            // We have to parse the actual error message out of the stack trace...
            const stackTrace = err.stack.split('\n');
            if (stackTrace[0] === 'Error: No reads were assigned to any plasmid!') {
                res.status(400).json({ message: 'Biobin ' + stackTrace[0] });
		return;
            }
	} else {
            res.status(400).json({ message: err });
	    return
        }
    }
    
    // Return data include server IDs for all data locations
    // and the PID of the process running the analysis pipeline
    // on the server.    
    res.status(200).json({ success: true, data: resData });
    return;
}

// Check an outpath for results/errors and return processed data or error message.
checkOutput = async function(reqIp, res, refServerId, resServerId, resData) {
    // Get location of data on the server.
    const refPath = '/tmp/' + refServerId + '/';
    const resPath = '/tmp/' + resServerId + '/';

    // Check for error output.
    // TO-DO: Check for error content that would obviate the specific check for
    // filtered_alignment.bam.
    let data = undefined;  // parseErrors will return false if this stays undefined.
    try {
	data = await fsPromises.readFile(resPath + 'pipelineProcess.err', "utf8");
    } catch (err) {
	// The file could not be read for some reason. This could
        // mean it's absent or empty. Empty is fine. Absent is not
        // fine, since the file should always be created.
	fs.access(resPath + 'pipelineProcess.err', fs.constants.F_OK, (err) => {
	    if (err) {
		// File is not found/not readable
                res.set('Content-Type', 'application/json');
                res.status(500).json({ message: 'pipelineProcess.err does not exist or could not be read.' });
                return;
	    }
	    // File was there but empty. Do nothing.
	});
    }
    // We need to look at the file content to determine if any actual
    // errors were encountered (since some processes write progress
    // messages to stderr).
    const errorExists = await parseErrors(reqIp, res, data);
    if (errorExists) {
	return;
    }
    processOutput(reqIp, res, refPath, resPath, resData);
    return;

    // Check for the final BAM alignment. If this is present, the analysis
    // completed successfully and we can process and return results.
    fs.access(resPath + 'filtered_alignment.bam', fs.constants.F_OK, (err) => {
	if (err) {
	    // No BAM found. There was an error.
	    // Process any stored error output and return it along with the json
	    processError(reqIp, res, resPath);
	    return;
	} else {
	    // All is well! Process the output and return results.
	    processOutput(reqIp, res, refPath, resPath, resData);
	    return;
	}
    });
}

// Process results for a completed job.
processOutput = async function(reqIp, res, refPath, resPath, resData) {
    console.error(new Date() + ' (' + reqIp + '): ' + 'processOutput refPath: ' + refPath+ ' resPath: ' + resPath + ' resData: ' + resData);
    let resStats = {};
    try {
        resStats = await runProcessResults(refPath, resPath);
        //console.error("Results processed.");                                          
    } catch(err) {
	console.error(new Date() + ': ' + err)
	res.status(400).json({ message: err });
	return;
    }
    //res.set('Content-Type', 'application/json');
    res.status(200).json({ success: true,
			   pipelineStatus: "completed",
			   stats: JSON.parse(resStats),
			   data: resData });
    return;
}

// Parse error data to determine if/where error(s) occurred in the
// analytical pipeline.
parseErrors = function(reqIp, res, data) {
    // Just return false if no data were sent.
    if (typeof(data) === 'undefined') {
	return false;
    }

    // Regular expression to identify the output directory name
    const resServerId_re = /Output directory:\s+\/tmp\/(\d+)\//;
    
    // Regular expressions used to recognize pipeline steps.
    const needle_re = /Needleman\-Wunsch/;
    const medaka_re = /medaka/;

    // Regular expressions used to recognize error output.
    const processKilled_re = /[Kk][Ii][Ll]+[Ee][Dd]/;
    const processTerminated_re = /[Tt][Ee][Rr][Mm][Ii][Nn][Aa][Tt][Ee][Dd]/;
    const error_re = /[Ee][Rr]+[Oo][Rr]/;

    // We will build a string to hold error messages.
    let err = undefined;

    // Step through lines of the stderr output looking for steps
    // and errors    
    // TO-DO:
    // 1) Parse and capture entire traceback blocks
    let step = undefined;
    let resServerId = undefined;
    data.split('\n').forEach(function (line) {
        //console.error(line);
	// See if we have the output directory (from medaka output)
	if (resServerId_re.test(line)) {
	    let matches = resServerId_re.exec(line);
	    resServerId = matches[1];
	}
	
	// See if this line indicates we've started a new step.
        if (needle_re.test(line)) {
            step = "needle";
        } else if (medaka_re.test(line)) {
	    step = "medaka";
	}

	// See if this line contains error content.
        if (processKilled_re.test(line) || processTerminated_re.test(line)) {
	    // Line content indicates a process was killed.
	    console.error(new Date() + ' (' + reqIp + ') (resServerId: ' + resServerId + ') killErrorFound (' + step + '): ' + line);
            if (step == "needle") {
		err = append_err(err, "Pairwise alignment step failed. (job killed -- max memory exceeded)");
            } else {
		err = append_err(err, "Job failed. (" + step + ") (job killed -- max memory likely exceeded)");
	    }
        } else if (error_re.test(line)) {
	    // Line content indicates an error was thrown.
	    console.error(new Date() + ' (' + reqIp + ') (resServerId: ' + resServerId + ') ErrorFound (' + step + '): ' + line);
	    err = append_err(err, line);
	} else if (line === 'No reads were assigned to any plasmid!') {
	    // Exit was normal, but no reads were assigned to any plasmids.
	    console.error(new Date() + ' (' + reqIp + ') (resServerId: ' + resServerId + ') ErrorFound (' + step + '): ' + line);
	    err = append_err(err, "Job Failed: No reads were assigned to any plasmid. Did you supply the correct reference(s) and fastq file(s)?");
	}
    });

    if (err) {
	processError(reqIp, res, undefined, err);
	return true;
    }
    return false;
}

// Helper function to build error strings.
append_err = function(err, line) {
    let ret = undefined;
    if (err) {
        ret = err + "\n" + line;
    } else {
        ret = line;
    }
    return ret;
}

// Look in results directory to see what error data we can find.
processError = async function(reqIp, res, resPath, err) {
    // If error content is provided, just return the error.
    if (err) {
	res.set('Content-Type', 'application/json');
        res.status(500).json({ pipelineStatus: "error", message: err });
        return;
    }
    // If no error content provided, go get it.
    fs.readFile(resPath + 'pipelineProcess.err', 'utf8', (err, data) => {
        if (err) {
	    res.set('Content-Type', 'application/json');
            res.status(500).json({ success: false, error: err });
            return;
        }
	const errorExists = parseErrors(undefined, res, data);
	// We store errorExists to be thorough, but don't actually need to
	// test its value because only errors should bring us this far!
        return;
    });
}

runCheckForFast5 = function(serverId, fileName) {
    // Run the shell script to see if the given file is fast5.
    //console.error(readPath);
    let readPath = '/tmp/' + serverId + '/' + fileName;
    return new Promise((resolve, reject) => {
        exec('./checkForFast5.sh ' + readPath, (err, stdout, stderr) => {
	    // Note we are calling an error a success here, since it means
	    // h5dump could not read the file, so we know it is not .fast5
	    // TO-DO: Maybe would be better to have the script exit 0 when
	    // file is not fast5, so we can use standard expectations for
	    // error vs. success
            if (err) {
		//console.error(new Date() + ': ' + err);
                resolve();
            } else {
		let err = 'ERROR: Fast5 format detected! ' + fileName + ' appears to be in fast5 format. Please perform basecalling on this file and resubmit in fastq format.';
		console.error(new Date() + ': ' + err);
                reject(err);
            }
        });
    });    
}

verifyFile = async function(res, serverId, fileName, fileFormat, path) {
    /* Run tests on the given file to verify it's a format we can use */
    //console.error("verifyFile reporting for duty!");

    if (fileFormat == "fastq") {
	// File extension suggests fastq. First rule out fast5...
	//console.error("Fastq extension detected. Checking format...");
	try {
	    await runCheckForFast5(serverId, fileName);
	} catch(err) {
            res.set('Content-Type', 'application/json');	    
            res.status(400).json({ message: err });
	    return;
	}
	res.set('Content-Type', 'text/plain');
	res.sendStatus(200);
        return;
    }
}
