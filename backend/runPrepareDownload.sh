#!/bin/bash

# Run the tar command to prepare file for results download in the background and return the PID.
cd $2
#echo ${@: 3:$(($#-3))}
tar -czf $1 ${@: 3:$(($#-3))} 1>${@: -1:1}/pipelineProcess.out 2>${@: -1:1}/pipelineProcess.err  &
echo $!
exit
