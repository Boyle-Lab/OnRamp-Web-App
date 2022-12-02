#!/bin/bash

# Run the bulk plasmid sequencing pipeline in the background and return the PID.
python3 -u /usr/local/bulkPlasmidSeq/bulkPlasmidSeq.py $@ 1>>${@: -1}pipelineProcess.err 2>>${@: -1}pipelineProcess.err  &
echo $!
exit
