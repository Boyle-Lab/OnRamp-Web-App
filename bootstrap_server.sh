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

echo "Making sure cron service is running..."
service cron status
if [ $? -gt 0 ]; then
    echo "No cron daemon found. Starting the cron service..."
    service cron start;
else
    echo "Cron daemon is running.";
fi

echo "Starting the bulk_plasid_seq_web app..."
#cd /home/node/bulk_plasmid_seq_web && conda activate medaka && npm start 1>&2 2> /var/log/bulk_plasmid_seq_web.log
# pm2 daemonizes server.js
conda activate medaka
cd /home/node/bulk_plasmid_seq_web/backend && pm2 start server.js --log /var/log/bulk_plasmid_seq_web.log --time
cd /home/node/bulk_plasmid_seq_web/client && pm2 start "npm start"
pm2 save
cat  # Need a persistent process here to keep the container alive
