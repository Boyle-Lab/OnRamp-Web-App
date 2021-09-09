#!/usr/bin/python
import sys, os, re
import json
import argparse

"""
This code is part of the bulkPlasmidSeq distribution
(https://github.com/Boyle-Lab/bulkPlasmidSeq) and is governed by its license.
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

"""
This script renames sequences within fasta files that have been
renamed to avoid errors in the pipeline.
"""

if __name__ == "__main__":
    # Intersect two sets of input intervals and return the result.
    parser = argparse.ArgumentParser(description='Python handle for medaka model list retrieval.')

    parser.add_argument(
        "fasta_path", type=str,
        help="Path to input reference fasta files."
    )
    parser.add_argument(
        "renamed_files_str", type=str,	
        help="JSON string with renamed file info."
    )
    
    args = parser.parse_args()

    # First thing is to convert the renamed_files_str into a dict.
    renamed_files = json.loads(args.renamed_files_str)

    # Loop over renamed files to change the seq names within.
    for filename in renamed_files.keys():
        file_path = args.fasta_path + '/' + filename
        #sys.stderr.write("%s\n" % file_path)

        # We will use a string to build the new fasta record,
        # then later write it to a file.
        new_fasta_str = "";
        with open(file_path, 'r') as fasta_file:
            for line in fasta_file:
                #line.strip('\n');
                match = re.search('^>(\S+)', line)
                if match:
                    # Description line.
                    #sys.stderr.write("%s\n" % match.group(1))
                    new_name = filename.split('.')[0]
                    new_line = re.sub(match.group(1), new_name, line)
                    #sys.stderr.write("%s\n" % new_line)
                    new_fasta_str = new_fasta_str + new_line
                else:
                    new_fasta_str = new_fasta_str + line
            #sys.stderr.write(new_fasta_str)

        # Write the output to replace the original file.
        with open(file_path, 'w') as fasta_file:    
            fasta_file.write("%s" % new_fasta_str)
        
