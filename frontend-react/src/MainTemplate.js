import React from "react";
import { NavLink, withRouter } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import MainPage from './pages/MainPage';

function MainTemplate() {
  return (
    <div>
      <AppBar position="fixed">
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu">
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
                Trash API
            </Typography>
            <Typography variant="h6" color="inherit">
              <NavLink to="/upload">
                Upload
              </NavLink>
            </Typography>
          </Toolbar>
      </AppBar> 
      <MainPage />  
  </div>

  )  
}
export default withRouter(MainTemplate);
