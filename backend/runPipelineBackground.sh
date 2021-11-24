#!/bin/bash

# Run the bulk plasmid sequencing pipeline in the background and return the PID.
python3 /usr/local/bulkPlasmidSeq/bulkPlasmidSeq.py $@ 1>${@: -1}pipelineProcess.out 2>${@: -1}pipelineProcess.err  &
echo $!
exit
