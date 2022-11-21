#!/bin/bash

# Use hd5dump to check if a file is (likely) in fast5 format. Exit with
# status 0 if file is readable, 1 if not.

h5dump $1 2>&1 > /dev/null;
if [ $? == 1 ]; then
    exit 0;
else
    exit 1;
fi
