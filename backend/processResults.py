#!/usr/bin/python
import sys, os, re
import json
import argparse
import subprocess
from glob import glob
from pysam import AlignmentFile

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

    parser.add_argument(
        "fasta_path", type=str,
        help="Path to input reference fasta files."
    )
    parser.add_argument(
        "consensus_path", type=str,	
        help="Path to consensus fasta files. (Pairwise alignments are also in this directory.)"
    )
    parser.add_argument(
        "filtered_bam_file", type=str,
        help="Path to filtered alignment bam file."
    )
    
    args = parser.parse_args()


    # First process filtered bam file to get the sequencing coverage for each plasmid.
    seq_coverages = {}
    bam_f = AlignmentFile(args.filtered_bam_file, "rb")
    for read in bam_f.fetch():
        if read.reference_name in seq_coverages.keys():
            seq_coverages[read.reference_name] += 1
        else:
            seq_coverages[read.reference_name] = 1
            
    # Data will be stored in a dictionary that will be returned as a json string.
    ret = []
    
    # Input fasta files will be used to coordinate results gathering
    for fasta_file in glob(args.fasta_path + '/*'): # This only works because we know this directory only has input fastas!
        # Each record has a dictionary of associated values.
        res = {
            "input_fasta_name": "",
            "input_fasta_seq": "",
            "sequencing_cov": 0,
            "consensus_name": "",
            "consensus_seq": "",
            "pairwise_algn_name": "",
            "pairwise_algn_seq": "",
            "pairwise_algn_stats": {
                "seq1_name": "",
                "seq2_name": "",
                "length" : 0,
                "identity_str": "",
                "identity_pct": 0,
                "similarity_str": "",
                "similarity_pct": 0,
                "gaps_str": "",
                "gaps_pct": 0,
                "mismatch_count": 0,
                "mismatch_pct": 0,
                "score": 0
            },
            "quality_metrics": {}
        }
        
        sys.stderr.write("%s\n" % fasta_file)
        fasta_fname = os.path.basename(fasta_file)
        fasta_fname_root = os.path.splitext(fasta_fname)[0]

        # Retrieve the fasta filename and squence.
        f = open(fasta_file, 'r')
        res["input_fasta_name"] = fasta_fname
        res["input_fasta_seq"] = f.read()
        f.close()
        #sys.stderr.write("%s\n" % res["input_fasta_seq"])

        # Store the precomputed sequencing coverage.
        res["sequencing_cov"] = seq_coverages[fasta_fname_root]

        # Get the consensus sequence filename and sequence.
        consensus_seq_fname = glob(args.consensus_path + '/' + fasta_fname_root + '*.fasta')[0] # SHOULD only return one file!
        #sys.stderr.write("%s\n" % consensus_seq_fname)
        f = open(consensus_seq_fname, 'r')
        res["consensus_name"] = os.path.basename(consensus_seq_fname)
        res["consensus_seq"] = f.read()
        f.close()
        #sys.stderr.write("%s\n" % res["consensus_name"])
        #sys.stderr.write("%s\n" % res["consensus_seq"])

        # Process the pairwise alignment. We need the summary stats and the alignment string.
        pw_algn_seq_fname = glob(args.consensus_path + '/' + fasta_fname_root + '*.txt')[0] # SHOULD only return one file!
        res["pairwise_algn_name"] = os.path.basename(pw_algn_seq_fname)
        sys.stderr.write("%s\n" % pw_algn_seq_fname)

        # Since sequence names are truncated at 13 characters, creating possible ambiguity,
        # we will replace sequence line labels with "Seq 1" or "Seq 2", which are identified
        # in the header as to which sequence they correspond to. We need a way to track which
        # sequence line we're appending.
        whichSeq = 1
        with open(pw_algn_seq_fname, 'r') as f:
            for line in f:
                line.strip('\n')
                if len(line) == 1:
                    continue
                fields = line.split()
                if re.search('^# 1:', line):
                    res["pairwise_algn_stats"]["seq1_name"] = fields[-1]
                    res["pairwise_algn_seq"] = res["pairwise_algn_seq"] + 'Seq 1: ' + fields[-1] + ' (reference)\n'
                    #sys.stderr.write("%s\n" % (res["pairwise_algn_stats"]["seq1_name"]))
                elif re.search('^# 2:', line):
                    res["pairwise_algn_stats"]["seq2_name"] = fields[-1]
                    res["pairwise_algn_seq"] = res["pairwise_algn_seq"] + 'Seq 2: ' + fields[-1] + ' (consensus)\n\n'
                    #sys.stderr.write("%s\n" % (res["pairwise_algn_stats"]["seq2_name"]))
                elif re.search('^# Length', line):
                    res["pairwise_algn_stats"]["length"] = int(fields[-1])
                    #sys.stderr.write("%s\n" % (res["pairwise_algn_stats"]["length"])) 
                elif re.search('^# Identity', line):
                    res["pairwise_algn_stats"]["identity_str"] = int(fields[-2].split('/')[0])
                    res["pairwise_algn_stats"]["identity_pct"] = float(re.sub('[()%]', '', fields[-1]))
                    #sys.stderr.write("%s, %.1f\n" % (res["pairwise_algn_stats"]["identity_str"], res["pairwise_algn_stats"]["identity_pct"]))
                elif re.search('^# Similarity', line):
                    res["pairwise_algn_stats"]["similarity_str"] = int(fields[-2].split('/')[0])
                    res["pairwise_algn_stats"]["similarity_pct"] = float(re.sub('[()%]', '', fields[-1]))
                    #sys.stderr.write("%s, %.1f\n" % (res["pairwise_algn_stats"]["similarity_str"], res["pairwise_algn_stats"]["similarity_pct"]))
                elif re.search('^# Gaps', line):
                    res["pairwise_algn_stats"]["gaps_str"] = int(fields[-3].split('/')[0])  # The gaps line includes a space after the opening paren in the pct field. This will break if this is ever not true!
                    res["pairwise_algn_stats"]["gaps_pct"] = float(re.sub('[()%]', '', fields[-1]))
                    #sys.stderr.write("%s, %.1f\n" % (res["pairwise_algn_stats"]["gaps_str"], res["pairwise_algn_stats"]["gaps_pct"]))
                elif re.search('^# Score', line):
                    res["pairwise_algn_stats"]["score"] = fields[-1]
                    #sys.stderr.write("%s\n" % (res["pairwise_algn_stats"]["score"]))
                elif re.search('^#', line):
                    continue
                else:
                    if re.search('^\s+', line):  # Sequence match/mismatch/gap line
                        whichSeq = 2
                        matches = re.findall('\.', line)
                        if matches:
                            res["pairwise_algn_stats"]["mismatch_count"] += len(matches)
                    else:
                        label = "Seq " + str(whichSeq) + '        '
                        replPat = fields[0]
                        line = re.sub(replPat, label, line)
                        if whichSeq == 2:
                            line = line + '\n'
                            whichSeq = 1
                    res["pairwise_algn_seq"] = res["pairwise_algn_seq"] + line
            #sys.stderr.write("%s" % res["pairwise_algn_seq"])
            #sys.stderr.write("%s\n" % res["pairwise_algn_stats"]["mismatch_count"])
            res["pairwise_algn_stats"]["mismatch_pct"] = (res["pairwise_algn_stats"]["mismatch_count"] / res["pairwise_algn_stats"]["length"]) * 100

        # Push the data to the return array
        ret.append(res)
        
    # Convert results to a json string and print to stdout
    ret_str = json.dumps(ret)
    sys.stdout.write("{}\n".format(ret_str))
