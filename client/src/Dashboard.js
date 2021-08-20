import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
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
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import Tooltip from '@material-ui/core/Tooltip';


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
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
     width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
	width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
      padding: theme.spacing(3),
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
      marginLeft: 5,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
      marginBottom: theme.spacing(2),
  },
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

  render() {
    const { classes } = this.props;

    return (
	<div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="absolute"
                className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
            >
                <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
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
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        className={classes.title}
                    >
                        {this.props.title}
                    </Typography>
                    {
			//<Tooltip title="Send us a question.">
			//<IconButton color="inherit" onClick={this.handleSupportClick} >
			//<ContactSupportIcon/>
			//</IconButton>
			//</Tooltip>
		    }
              </Toolbar>
            </AppBar>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Typography component="div" className={classes.chartContainer}>
	            {this.props.content}
                </Typography>
            </main>
        </div>
    );
  }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
