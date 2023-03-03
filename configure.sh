#!/bin/bash

# This script installs the node module tree for each subfolder (main, backend, and client),
# installs and sets up the conda environment with packages required by the pipeline,
# and sets up various cron jobs to maintain the files/folders in /tmp. These steps are
# here because they throw errors when run as commands in the Dockerfile.

# Upgrade node.js and npm to latest versions
npm install -g npm@latest
npm cache clean -f
npm install -g n
n stable

# Install node packages.
cd /home/node/bulk_plasmid_seq_web
npm install
npm update -g -S
npx browserslist@latest --update-db
# Using --force here to address package incompatibilities that seem
# refractory to correction in the 'proper' way
cd client && npm install --force
npm update -g -S
cd ../backend && npm install --force
npm update -g -S

# Install pm2 (daemonizes the server)
npm install pm2@latest -g

# Install miniconda
#cd /usr/local && wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
cd /usr/local && bash Miniconda3-latest-Linux-x86_64.sh -b -p /usr/local/miniconda -f
source miniconda/bin/activate
conda init
conda config --set channel_priority flexible # Needed to avoid unresolvable dependencies.
# Upgrade conda
conda update -q -y -n base conda
# Install the mamba package manager (conda hangs on solving environment for command below)
conda install mamba -n base -c conda-forge

# Install the analysis pipeline
mamba create -q -y -n medaka -c conda-forge -c bioconda medaka nanofilt pyyaml porechop biopython
conda activate medaka

# Set up cron job to delete tmp folders older than 24 hours.
CRON_FILE="/var/spool/cron/crontabs/root"
if [ ! -f $CRON_FILE ]; then
    echo "cron file for root does not exist, creating..."
    touch $CRON_FILE
    /usr/bin/crontab $CRON_FILE
fi
grep -qi "find /tmp/ -maxdepth 1 -mmin +1440 -exec rm -rf" $CRON_FILE
if [ $? != 0 ]; then
    echo "Updating cron jobs for cleaning temporary files..."
    echo "0 0 * * * touch /tmp/example_results/ /tmp/example_references/ /tmp/example_data/ \;" >> $CRON_FILE
    echo "0 0 * * * find /tmp/ -maxdepth 1 -mmin +1440 -exec rm -rf {} \;" >> $CRON_FILE
    echo "Updating cron job for server health checks..."
    echo "0 * * * * server_health_check.sh;" >> $CRON_FILE
fi
