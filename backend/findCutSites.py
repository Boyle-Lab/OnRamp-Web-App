#!/usr/bin/python
import sys, os, re
import json
import argparse
from Bio.Restriction import *
from Bio import SeqIO, Seq
from glob import glob

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

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Python handle for restriction site offset identification. Output is the yaml config file for the bulkPlasmidSeq CLI.')
    parser.add_argument(
        "fasta_path", type=str,
        help="Path to fasta plasmid reference sequences. Fasta format with a single entry per file assumed."
    )
    parser.add_argument(
        "fasta_re_str", type=str,
        help="JSON formatted string to indicate which restriction enzyme was used for each plasmid sequence. Enzyme names must match those used by the Bio.Restriction package. See http://biopython.org/DIST/docs/cookbook/Restriction.html#1.2"
    )
    args = parser.parse_args()

    # Put fasta-enzyme assignments into a dict.
    fasta_re_dict = json.loads(args.fasta_re_str)

    # Return data will be a dict encoded as json.
    ret = {}
    
    # Loop over fasta reference sequences to find the applicable cut site(s). (SHOULD be one per sequence. If not, will raise an error in the UI for the affected plasmid(s).)
    for fasta_file in glob(args.fasta_path + '/*'): # This only works because we know this directory only has input fastas!
        fasta_filename = os.path.basename(fasta_file)
        res = {
            "fasta_filename": fasta_filename,
            "enzyme": fasta_re_dict[fasta_filename],
            "cut_sites": [],
            "error": ""
        }

        # Load the fasta with biopython.
        fasta_rec = list(SeqIO.parse(fasta_file, "fasta"))

        # Sanity check: each file should only contain one sequence record.
        if len(fasta_rec) > 1:
            res["error"] = res["error"] + "Multiple records in fasta file."
        else:
            # Use Bio.Restriction to locate cut site(s).
            res["cut_sites"] = locals()[fasta_re_dict[fasta_filename]].search(fasta_rec[0].seq, linear=False)
            # Each record should contain only one cut site. If not, something is wrong. Flag with an error.
            if len(res["cut_sites"]) > 1:
                res["error"] = res["error"] + "Multiple cut sites found in plasmid sequence."

        # Push the result onto the return array.
        ret[fasta_filename] = res

        # Convert results to json and print to stdout.
        ret_str = json.dumps(ret)
        sys.stdout.write("{}\n".format(ret_str))
