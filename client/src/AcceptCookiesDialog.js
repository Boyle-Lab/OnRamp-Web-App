import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

/*
This code is part of the bulkPlasmidSeq distribution
(https://github.com/Boyle-Lab/CGIMP) and is governed by its license.
Please see the LICENSE file that should have been included as part of this
package. If not, see <https://www.gnu.org/licenses/>.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

CONTACT: Adam Diehl, adadiehl@umich.edu
*/


class AcceptCookiesDialog extends React.Component {
    constructor(props) {
	super(props);
        this.state = {
	};
    }

    handleAccept = (event) => {
	this.props.handleResponse({
	    'showAcceptCookiesDialog': false,
	    'useCookies': true
	});
	event.preventDefault();
    }

    handleDeny = (event) => {
	this.props.handleResponse({
            'showAcceptCookiesDialog': false,
            'useCookies': false
        });
	event.preventDefault();
    }

    render () {
	return (
	    <div>
		<Dialog
                    open={this.props.open}
	            onClose={this.props.onClose}
	            scroll='paper'
	            maxWidth='xl'
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
	        >
                  <DialogTitle id="alert-dialog-title">
		        {'Accept Cookies?'}
	          </DialogTitle>
                  <DialogContent>
		    <DialogContentText>
		        {'This site uses cookies to improve the user experience. No personally-identifiable information will be collected or stored, and cookies will never be shared with any other sites. However, you may opt out if you wish.'}
	            </DialogContentText>
                  </DialogContent>
		  <DialogActions>
                    <Button
	                onClick={this.handleAccept}
	                color="primary"
	                autofocus
		    >
                        Accept Cookies
                    </Button>
                <Button
	    onClick={this.handleDeny}
	    color="primary"
		>
                        Disable Cookies
                    </Button>
                  </DialogActions>
	        </Dialog>
	    </div>
	);
    }
}

AcceptCookiesDialog.defaultProps = {
    open: false,
};

export default AcceptCookiesDialog
