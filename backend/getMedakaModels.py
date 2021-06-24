#!/usr/bin/python
import sys, os, re
import json
import argparse
import subprocess

"""
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
"""

def parseOutput(output):
    # Parse out the models and default model from medaka output.
    for line in output.split('\n'):
        if re.search('Available', line):
            models = re.split(',\s+', line)[1:]
            #sys.stderr.write("%s\n" % models)
        elif re.search('consensus', line):
            default_model = re.split('\s+', line)[-1]
            #sys.stderr.write("%s\n" % default_model)
    return models, default_model


def resultsToJson(models, default_model):
    # Convert results to a json string.
    dat = {}
    dat["models"] = models
    dat["default_model"] = default_model
    return json.dumps(dat)


if __name__ == "__main__":
    # Intersect two sets of input intervals and return the result.
    parser = argparse.ArgumentParser(description='Python handle for medaka model list retrieval.')
    args = parser.parse_args()

    output = subprocess.run(['medaka', 'tools', 'list_models'], capture_output=True, text=True)
    models, default_model = parseOutput(output.stdout)
    res = resultsToJson(models, default_model)    
    sys.stdout.write("{}\n".format(res))
    
