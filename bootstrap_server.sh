#!/bin/bash

__conda_setup="$('/usr/local/miniconda/bin/conda' 'shell.bash' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/usr/local/miniconda/etc/profile.d/conda.sh" ]; then
        . "/usr/local/miniconda/etc/profile.d/conda.sh"
    else
        export PATH="/usr/local/miniconda/bin:$PATH"
    fi
fi
unset __conda_setup

echo "Starting the bulk_plasid_seq_web app..."
cd /home/node/bulk_plasmid_seq_web && conda activate medaka && npm start 1>&2 2> /var/log/bulk_plasmid_seq_web.log

# This script needs to keep running so the Docker container does not exit.
while true ; do sleep 1 ; done
