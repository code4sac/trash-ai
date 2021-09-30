import React from "react";

import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import MessageService from "../data/services/MessageService";

import SimpleCard from "./components/SimpleCard";

const useStyles = theme => ({
    root: {
      marginTop: 65
    }
});
  

class MainPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            messages : []
        };
    }

    componentDidMount() {
        console.log("Mounted");
        MessageService.getMessages()
            .then( ( newMessages ) => { 
                this.setState({
                    messages : newMessages
                })
            })
            .catch( (error) => {console.log(error); });
    }

    render(){
        const { classes } = this.props; 

        

        return (
            <Container maxWidth="sm"> 
                <Box my={4} className={classes.root}>
                    {
                        this.state.messages.map((message, index) => {
                            return ( <SimpleCard key={message.id} message={ message.message } /> );
                        })
                    }
                </Box>
            </Container>
        );
    }
}

export default withStyles(useStyles)(MainPage); 

