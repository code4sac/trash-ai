import React from "react";

import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import MessageService from "../services/MessageService";

import SimpleCard from "./components/SimpleCard";

const useStyles = theme => ({
    root: {
      marginTop: 65
    }
});
  

class MainPage extends React.Component {
    render(){
        const { classes } = this.props; 

        const messages = MessageService.getMessages();

        return (
            <Container maxWidth="sm"> 
                <Box my={4} className={classes.root}>
                    {
                        messages.map((message, index) => {
                            return ( <SimpleCard key={index} message={ message } /> );
                        })
                    }
                </Box>
            </Container>
        );
    }
}

export default withStyles(useStyles)(MainPage); 

