# Docker container to host the Bulk Plasmid Sequencing utility web app.
# To build:
# docker build -t bulk_plasmid_seq_web .

# PORT NUMBERS WILL NEED ATTENTION!!
# To Run:
# docker run -it --name bulk_plasmid_seq_web -v $(pwd):/home/node/$(basename $(pwd)) -p 3000:3000 -p 3001:3001 -e LOCAL_USER_ID=`id -u $USER` -e LOCAL_GROUP_ID=`id -g $USER` -e LOCAL_USER_NAME=`id -un` -e LOCAL_GROUP_NAME=`id -gn` bulk_plasmid_seq_web bash

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

RUN gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4
RUN curl -o /usr/local/bin/gosu -SL "https://github.com/tianon/gosu/releases/download/1.4/gosu-$(dpkg --print-architecture)" \
    && curl -o /usr/local/bin/gosu.asc -SL "https://github.com/tianon/gosu/releases/download/1.4/gosu-$(dpkg --print-architecture).asc" \
    && gpg --verify /usr/local/bin/gosu.asc \
    && rm /usr/local/bin/gosu.asc \
    && chmod +x /usr/local/bin/gosu

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# We need to install conda and pybedtools packages to enable on-the-fly intersections.
RUN apt-get update && apt-get -y --no-install-recommends install python-setuptools python-dev build-essential python-pip
RUN pip install --upgrade virtualenv

# Add an editor, because it's handy to have.
RUN apt-get update && apt-get -y --no-install-recommends install emacs
