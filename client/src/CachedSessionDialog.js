import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import CollectionsIcon from '@material-ui/icons/Collections';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
});


class CachedSessionDialog extends React.Component {
    constructor(props) {
      super(props);
	this.state = {
	    cookies: null
	}
    }

    componentDidMount() {
        /*const cookies =  this.props._cookies.getAll();
        this.setState({ cookies: cookies }, () => {
            console.log(this.state.cookies);
        });*/
    }

    handleShowResClick = (sessionId) => {
        this.props.handleResponse({
            'showCachedDialog': false,
            'useCached': sessionId
        });
    }
    
    handleClose = () => {
        this.props.handleResponse({
            'showCachedDialog': false
        });
    }

    
    render () {
	const { classes } = this.props;
	
	return (  
		<Dialog onClose={this.handleClose} aria-labelledby="cached-dialog-title" open={this.props.open}>
		<DialogTitle id="cached-dialog-title">Select a Cached Session</DialogTitle>
		<List>
		<Paper className={classes.root}>
		{this.props.cookies ?
		 (
		     Object.keys(this.props.cookies).map((key, index) => {
			 const gaRe = /^_ga/;
			 if (!gaRe.test(key) && key !== '_onramp_cookies') {
			     return(
			         <div key={index.toString()}>
			             <ListItem button onClick={() => this.handleShowResClick(key)} key={index.toString()}>
			             <ListItemAvatar>
			             <Avatar>
			             <CollectionsIcon />
			             </Avatar>
			             </ListItemAvatar>
			             <ListItemText primary={this.props.cookies[key].name} secondary={this.props.cookies[key].date} />
			             </ListItem>
			             <Divider/>
				 </div>
			     );
			 }
		     })
		 ) : (<div/>)
		}
	        </Paper>
	        </List>
		</Dialog>
	);
    }
}

CachedSessionDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CachedSessionDialog);
