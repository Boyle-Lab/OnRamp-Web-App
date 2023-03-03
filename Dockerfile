# Docker container to host the Bulk Plasmid Sequencing utility web app.
# To build:
# docker build -t bulk_plasmid_seq_web .

# PORT NUMBERS WILL NEED ATTENTION!!
# To Run:
# docker run -it --name bulk_plasmid_seq_web -p 3000:3000 -p 3001:3001 bulk_plasmid_seq_web

FROM node:latest
MAINTAINER Adam Diehl <adadiehl@umich.edu>

# Expose the ports needed for node.js and express
EXPOSE 3000
EXPOSE 3001

ENV DEBIAN_FRONTEND noninteractive

# Add some handy utilities for troubleshooting the server, because they're handy to have.
RUN apt-get update && apt-get -y --no-install-recommends install \
    emacs \
    less \
    ca-certificates \
    curl

# Install and enable cron
RUN apt-get update && apt-get -y --no-install-recommends install cron
RUN apt-get update && apt-get -y --no-install-recommends install --reinstall systemd
RUN systemctl enable cron

# Install miniconda and mamba
RUN cd /usr/local && wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh && bash Miniconda3-latest-Linux-x86_64.sh -b -p /usr/local/miniconda -f && ./miniconda/bin/activate

# Install/compiles EMBOSS
RUN cd /usr/local && wget ftp://emboss.open-bio.org/pub/EMBOSS/EMBOSS-6.6.0.tar.gz && tar -xvf EMBOSS-6.6.0.tar.gz
RUN cd /usr/local/EMBOSS-6.6.0 && ./configure && make
RUN ln -s /usr/local/EMBOSS-6.6.0/emboss/needle /usr/local/bin/

# Pull down the latest version of the backend analysis pipeline.
RUN cd /usr/local && git clone https://github.com/crmumm/bulkPlasmidSeq.git
RUN cd /usr/local && ls -alth

# Pull down the	latest version of the web app sources.
RUN cd /home/node && git clone https://github.com/Boyle-Lab/bulk_plasmid_seq_web.git

# Copy example data archives and decompress into the /tmp folder
COPY example_data/*.tar.gz /tmp/
RUN cd /tmp && tar -xzf example_results.tar.gz && mkdir -pv /tmp/example_data && mv example_data.tar.gz example_data/
RUN cd /tmp && ls -alth

# Copy server health check script to /usr/local/bin
COPY server_health_check.sh /usr/local/bin/

# Run the configure.sh script to finish provisioning the container.
COPY configure.sh /root/configure.sh
RUN cd /root && bash configure.sh

# The container should run npm start from the root directory of the app wihtin the medaka conda env.
# These commands are in bootstrap_server.sh
COPY bootstrap_server.sh /usr/local/bin/
# For the development server, uncomment the line below:
#CMD bash
# For production, use the line below instead:
CMD bootstrap_server.sh
