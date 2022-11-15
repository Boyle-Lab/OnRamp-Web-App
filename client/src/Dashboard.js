import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Header from './Header';

//import StickyFooter from './Footer';

/*
This code is part of the CGIMP distribution
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

const styles = theme => ({
    root: {
	display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
	flexGrow: 1,
	padding: theme.spacing(3),
	height: '100vh',
	overflow: 'auto',
    },
});

class Dashboard extends React.Component {

  render() {
    const { classes } = this.props;

    return (
	    <div className={classes.root}>
	    <Header handleChange={this.props.handleChange} />
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
	        {this.props.content}
            </main>
        </div>
    );
  }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
