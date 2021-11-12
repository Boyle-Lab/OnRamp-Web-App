import React from 'react';
import PropTypes from 'prop-types';
//import classNames from 'classnames';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import StorageIcon from '@material-ui/icons/Storage';
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';

import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as BoyleLabLogo } from './boyle-lab-logo_diag-BL.svg';
import OnRampLogo from './ONRAMP-logo.white.svg';

import StickyFooter from './Footer';

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

const drawerWidth = 200;

const styles = theme => ({
    root: {
	display: 'flex',
    },
    toolbar: {
	paddingRight: 24, // keep right padding when drawer closed
	background: '#414042',
    },
    toolbarIcon: {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: '0 8px',
	...theme.mixins.toolbar,
    },
    appBar: {
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
	    easing: theme.transitions.easing.sharp,
	    duration: theme.transitions.duration.leavingScreen,
	}),
    },
    title: {
	flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
	flexGrow: 1,
	padding: theme.spacing(3),
	height: '100vh',
	overflow: 'auto',
    },
    colorBar: {
	display: 'table',
	width: '100%',
	height: '1vh',
	backgroundImage: 'linear-gradient(to right, #1FA74A 0%, #66C1D6 25%, #F57E20 75%, #72479B 100%)',
    }
});

class Dashboard extends React.Component {
    state = {
	open: false,
    };
    
    handleDrawerOpen = () => {
	this.setState({ open: true });
    };
    
    handleDrawerClose = () => {
	this.setState({ open: false });
    };

    handleHomeClick = () => {
	this.props.handleChange({
	    'showResults': false
	});
    }

    handleSessionsClick = () => {
	this.props.handleChange({
	    'showCachedDialog': true
	});
    }

    handleSupportClick = () => {
        this.props.handleChange({
            'showHelpDialog': true
        });
    }

  render() {
    const { classes } = this.props;

    return (
	    <div className={classes.root}>
            <CssBaseline />
	    <AppBar
                position="absolute"
                className={classes.appBar}
            >
                <Toolbar className={classes.toolbar}>
	            <Tooltip title="Go Home">
                        <IconButton
                            color="inherit"
                            onClick={this.handleHomeClick}
                        >
                            <HomeIcon />
                        </IconButton>
	            </Tooltip>
	            <Tooltip title="Load a stored session.">
	                <span>
	                    <IconButton
                                color="inherit"
                                onClick={this.handleSessionsClick}
	                        disabled={!this.props.enableSessionsIcon}
                            >
	                        <StorageIcon />
	                    </IconButton>
	                </span>
	            </Tooltip>
                    <Typography
                        component="div"
                        className={classes.title}
		    >
	                <Tooltip title="Oxford Nanopore based Rapid Analysis of Mutliplexed Plasmids.">
	                    <img src={OnRampLogo} width="350" height="90"/>
                        </Tooltip>
		    </Typography>
                    {<div>
		         <Tooltip title="Get Help.">
		             <IconButton color="inherit" onClick={this.handleSupportClick} >
			        <HelpIcon/>
			    </IconButton>
			</Tooltip>
			<Tooltip title="The Boyle Lab">
                            <IconButton color="inherit" href="http://www.boylelab.org" target="_blank" >
		                <BoyleLabIcon/>
                            </IconButton>
                        </Tooltip>
		     </div>}
                </Toolbar>
	    <div className={classes.colorBar} />
              </AppBar>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Typography component="div" className={classes.chartContainer}>
	            {this.props.content}
                </Typography>
            </main>
	    <div>
	    <StickyFooter />
	    </div>
        </div>
    );
  }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

function BoyleLabIcon(props) {
  return (
    <SvgIcon component={BoyleLabLogo} viewBox="0 0 24 24" />
  );
}

export default withStyles(styles)(Dashboard);
