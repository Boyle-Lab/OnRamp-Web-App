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

# Install packages needed for non-root login/permissions control
RUN apt-get update && apt-get -y --no-install-recommends install \
    ca-certificates \
    curl \
    sudo

#RUN gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4
#RUN curl -o /usr/local/bin/gosu -SL "https://github.com/tianon/gosu/releases/download/1.4/gosu-$(dpkg --print-architecture)" \
#    && curl -o /usr/local/bin/gosu.asc -SL "https://github.com/tianon/gosu/releases/download/1.4/gosu-$(dpkg --print-architecture).asc" \
#    && gpg --verify /usr/local/bin/gosu.asc \
#    && rm /usr/local/bin/gosu.asc \
#    && chmod +x /usr/local/bin/gosu

#COPY entrypoint.sh /usr/local/bin/entrypoint.sh
#ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# We need to install conda and pybedtools packages to enable on-the-fly intersections.
RUN apt-get update && apt-get -y --no-install-recommends install \
    python-setuptools \
    python-dev \
    build-essential \
    python3-pip
RUN pip3 install --upgrade virtualenv

# Add an editor and text viewer, because they're handy to have.
RUN apt-get update && apt-get -y --no-install-recommends install \
    emacs \
    less

# Install and enable cron
RUN apt-get update && apt-get -y --no-install-recommends install cron
RUN apt-get update && apt-get -y --no-install-recommends install --reinstall systemd
RUN systemctl enable cron

# Pull down the	latest version of the web app sources.
RUN cd /home/node && git clone https://github.com/Boyle-Lab/bulk_plasmid_seq_web.git

# Run the configure.sh script to finish provisioning the container.
COPY configure.sh /root/configure.sh
RUN cd /root && bash configure.sh

# Copy server health check script to /usr/local/bin
COPY server_health_check.sh /usr/local/bin

# The container should run npm start from the root directory of the app wihtin the medaka conda env.
COPY bootstrap_server.sh /usr/local/bin
CMD bootstrap_server.sh
