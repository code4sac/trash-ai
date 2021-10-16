import React from "react";

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';


import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import MainPage from './pages/MainPage';

class MainTemplate extends React.Component {
    render()
    {
        return (
            <div>
                <AppBar position="fixed">
                    <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit">
                        Boilerplate Webapp
                    </Typography>
                    </Toolbar>
                </AppBar>
                
                <MainPage />
                
            </div>
        );
    }
};

export default MainTemplate;