# Bulk Plasmid Sequencing Web App
## Web-enabled version of the Bulk Plasmid Sequencing tool by Camille Mumm. (https://github.com/crmumm/bulkPlasmidSeq)

## System Requirements
A unix-like system with the following prerequisites:
* A functioning Docker instance
* A running web server (we recommend nginx)

## Getting Started

1. Clone the repository

3. Navigate to ./client/src and edit browser_config.js to reflect your local network configuration, data file locations/names, and map dimensions, following the directions within the file on which fields to edit. Make sure port mappings match the host ports set up in step 5!
```
$ cd ./client/src
$ vim browser_config.js
# ...
$ cd ../../
```

4. Navigate to the root directory and build the Docker container:
```
$ docker build -t bulk_plasmid_seq_web .
```

5. Run the Docker container with a mount to the working directory and appropriate port mappings. Ports are specified with '-p XXXX:YYYY', where XXXX is the host machine port and YYYY is the port on the docker container.
```
$ docker run -it --name bulk_plasmid_seq_web -v $(pwd):/home/node/$(basename $(pwd)) -p 3000:3000 -p 3001:3001 -e LOCAL_USER_ID=`id -u $USER` -e LOCAL_GROUP_ID=`id -g $USER` -e LOCAL_USER_NAME=`id -un` -e LOCAL_GROUP_NAME=`id -gn` bulk_plasmid_seq_web bash
root@be51d9bd99b2:/$ exit
```

6. Log in to the docker container with your own user account to install node.js dependencies.
```
$ docker start bulk_plasmid_seq_web
$ docker exec -it bulk_plasmid_seq_web gosu <your username> bash
user@be51d9bd99b2:/$ cd home/node/bulk_plasmid_seq_web
user@be51d9bd99b2:/$ ./configure.sh
user@be51d9bd99b2:/$ exit
```

7. Log in ot the docker container as root and fire up the server.
```
$ docker exec -it bulk_plasmid_seq_web bash
root@be51d9bd99b2:/$ cd home/node/bulk_plasmid_seq_web
root@be51d9bd99b2:/$ npm start
```

8. Open a web browser and go to the address:port you configured in step 4.


## Citation

If you use the  Bulk Plasmid Sequencing Web App in your work, please use the following citation:

Citation goes here.

## Community Guidelines

Bug reports and requests for improvements, optimizations, and additional features are welcomed! Please feel free to make a post to the project's [Issue Tracker](https://github.com/Boyle-Lab/bulk_plasmid_seq_web/issues) on github or follow the guidelines in the [CONTRIBUTING](https://github.com/Boyle-Lab/bulk_plasmid_seq_web/CONTRIBUTING.md) document.