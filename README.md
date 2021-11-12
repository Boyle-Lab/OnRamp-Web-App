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

5. Run the Docker container with appropriate port mappings. Ports are specified with '-p XXXX:YYYY', where XXXX is the host machine port and YYYY is the port on the docker container.
```
$ docker run -it --name bulk_plasmid_seq_web -p 3000:3000 -p 3001:3001 bulk_plasmid_seq_web bash
```
The node.js server should be running on the container and can now be accessed at http://127.0.0.1:3000

The server can be stopped/started by logging into the container.
```
$ docker exec -it bulk_plasmid_seq_web bash
root@be51d9bd99b2:/$ cd /home/node/bulk_plasmid_seq_web
root@be51d9bd99b2:/$ npm start
```

## Citation

If you use the  Bulk Plasmid Sequencing Web App in your work, please use the following citation:

Citation goes here.

## Community Guidelines

Bug reports and requests for improvements, optimizations, and additional features are welcomed! Please feel free to make a post to the project's [Issue Tracker](https://github.com/Boyle-Lab/bulk_plasmid_seq_web/issues) on github or follow the guidelines in the [CONTRIBUTING](https://github.com/Boyle-Lab/bulk_plasmid_seq_web/CONTRIBUTING.md) document.