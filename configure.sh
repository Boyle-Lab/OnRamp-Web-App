#!/bin/bash

# Upgrade node.js and npm to latest versions
npm install -g npm@latest
npm cache clean -f
npm install -g n
n stable

# Install node packages
npm install
cd client && npm install
cd ../backend && npm install

# Install miniconda
cd /usr/local && wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh -b -p /usr/local/miniconda -f
source miniconda/bin/activate
conda init

# Install the analysis pipeline
conda create -q -y -n medaka -c conda-forge -c bioconda medaka nanofilt
conda activate medaka
git clone https://github.com/crmumm/bulkPlasmidSeq.git
