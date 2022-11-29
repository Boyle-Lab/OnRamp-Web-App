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

echo "Checking /tmp for example data and results..."
if [ ! -f /tmp/example_data/example_data.tar.gz ]; then
    echo "Example data not found.";
    if [ ! -d /tmp/example_data ]; then
	echo "Creating /tmp/example_data";
	mkdir /tmp/example_data/;
    fi
    echo "Copying example_data.tar.gz to /tmp/example_data.";
    cp /home/node/bulk_plasmid_seq_web/example_data/example_data.tar.gz /tmp/example_data/;
fi

if [ ! -d /tmp/example_results/ ]; then
    echo "Example results not found.";
    echo "Copying example_results.tar.gz to /tmp.";
    cp /home/node/bulk_plasmid_seq_web/example_data/example_results.tar.gz /tmp;
    cd /tmp;
    echo "Unpacking example_results.tar.gz.";
    tar -xzf example_results.tar.gz;
    rm example_results.tar.gz;
fi

echo "Starting the bulk_plasid_seq_web app..."
#cd /home/node/bulk_plasmid_seq_web && conda activate medaka && npm start 1>&2 2> /var/log/bulk_plasmid_seq_web.log
# pm2 daemonizes server.js
conda activate medaka
cd /home/node/bulk_plasmid_seq_web/backend && pm2 start server.js -l /var/log/bulk_plasmid_seq_web.log -e /var/log/bulk_plasmid_seq_web.log -o /var/log/bulk_plasmid_seq_web.log --time
cd /home/node/bulk_plasmid_seq_web/client && pm2 start "npm start"
pm2 save
