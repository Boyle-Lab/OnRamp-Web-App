#!/bin/bash

# Check for running express server...
ps -ef | grep -v 'concurrently' | grep -v 'grep' | grep -v '/bin/sh' | grep 'server.js'
if [ $? -gt 0 ]; then
    echo $(date) "server_health_check.sh: Found express server down. Restarting." >> /var/log/bulk_plasmid_seq_web.log
    node --max_old_space_size=8000 /home/node/bulk_plasmid_seq_web/backend/server.js 2>&1 1>>/var/log/bulk_plasmid_seq_web.log &
else
    echo $(date) "server_health_check.sh: All OK!" >> /var/log/bulk_plasmid_seq_web.log
fi

# No need to check for react server or any other processes related to the server stack because
# they are either non-essential (i.e., won't cause observable issues with the app) or will take
# down the Docker container on termination!
