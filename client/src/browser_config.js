/* 
Configuration:
1) Edit the URI:port for webAddr, apiAddr, and elasticAddr to match your local network configuration. If you only plan on accessing the browser from the computer on which it is running, you can set these to 'localhost:<port>'.
2) Edit the dataPath field to reflect the location of the data folder on the docker container.
3) Edit moduleDataFile and nodeDataFile to match the names of your data files.
4) Edit the mapDim field to reflect the shape of your input data. This dictates the number of columns and rows in the map display. Format is [NCOLS,NROWS]
*/

export const host = "http://" + window.location.host;
export const apiHost = "http:" + host.split(':')[0] + ':3001/api';

const browser = {
    webAddr: host,
    apiAddr: apiHost
}

export default browser;
