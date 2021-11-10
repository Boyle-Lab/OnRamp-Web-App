import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import BoyleLabIcon from './boyle-lab-logo_diag-BL.svg';
import OnRampLogo from './ONRAMP-logo.small.svg';
import MichiganMedicineLogo from './Michigan-Medicine_Logo-Stacked-White.svg';

function Copyright() {
  return (
    <Typography variant="body2">
      {'Copyright ©'}
      <Link color="inherit" href="http://www.boylelab.org/" target="_blank">
        The Boyle Lab
      </Link>
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '75vh',
  },
  main: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(2),
  },
    footer: {
	position: 'absolute',
	padding: theme.spacing(3, 2),
	marginTop: 'auto',
	backgroundColor: '#414042',
	left: 0,
	bottom: 0,
	width: '100%',
	color: '#FFFFFF',
	boxShadow: '0 -4px 5px 0 rgba(0, 0, 0, 0.25)',
    },
}));

export default function StickyFooter() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
	  <footer className={classes.footer}>
	  <Grid container spacing={2} alignItems='center'>
	  <Grid item xs={1}>
	  <Tooltip title="Oxford Nanopore based Rapid Analysis of Mutliplexed Plasmids.">
	  <img src={OnRampLogo} width="50" height="50"/>
	  </Tooltip>
	  </Grid>
	  <Grid item xs={9}>
          <Container maxWidth='md'>
          <Typography variant="body1">On-Ramp is brought to you by the Boyle Lab team at Michigan Medicine.</Typography>
          <Copyright />
          </Container>
	  </Grid>
	  <Grid item xs={1}>
	  <Tooltip title="The Boyle Lab">
	  <Link color="inherit" href="http://www.boylelab.org/" target="_blank">
	  <img src={BoyleLabIcon} width="40" height="40"/>
	  </Link>
          </Tooltip>
	  </Grid>
	  <Grid item xs={1}>
          <Tooltip title="Michigan Medicine">
	  <Link color="inherit" href="http://med.umich.edu/" target="_blank">
          <img src={MichiganMedicineLogo} width="80" height="80"/>
	  </Link>
          </Tooltip>
          </Grid>
	  </Grid>
      </footer>
    </div>
  );
}
