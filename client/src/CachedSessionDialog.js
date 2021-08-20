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
	return (  
		<Dialog onClose={this.handleClose} aria-labelledby="cached-dialog-title" open={this.props.open}>
		<DialogTitle id="cached-dialog-title">Select a Cached Session</DialogTitle>
		<List>
		{this.props.cookies ?
		 (
		     Object.keys(this.props.cookies).map((key, index) => (
			     <ListItem button onClick={() => this.handleShowResClick(key)} key={index}>
			     <ListItemAvatar>
			     <Avatar>
			     <CollectionsIcon />
			     </Avatar>
			     </ListItemAvatar>
			     <ListItemText primary={this.props.cookies[key].name} secondary={this.props.cookies[key].date} />
			     </ListItem>
		     ))
		 ) : (<div/>)
		}
	        </List>
		</Dialog>
	);
    }
}

export default CachedSessionDialog;
