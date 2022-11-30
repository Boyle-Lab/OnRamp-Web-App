import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import StorageIcon from '@material-ui/icons/Storage';
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import SvgIcon from '@material-ui/core/SvgIcon';

import { ReactComponent as BoyleLabLogo } from './images/boyle-lab-logo_diag-BL.svg';
import OnRampLogo from './images/ONRAMP-logo.white.svg';

//import StickyFooter from './Footer';

/*
This code is part of the bulk_plasmid_seq_web distribution
(https://github.com/Boyle-Lab/bulk_plasmid_seq_web) and is governed by its license.
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
    colorBar: {
        display: 'table',
        width: '100%',
        height: '1vh',
        backgroundImage: 'linear-gradient(to right, #1FA74A 0%, #66C1D6 25%, #F57E20 75%, #72479B 100%)',
    }
});

class Header extends React.Component {
    
    handleHomeClick = () => {
	this.props.handleChange({
	    'showResults': false,
	    'showTutorial': false,
	    'showLandingPage': false
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
    );
  }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

function BoyleLabIcon(props) {
  return (
    <SvgIcon component={BoyleLabLogo} viewBox="0 0 24 24" />
  );
}

export default withStyles(styles)(Header);
