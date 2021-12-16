import React from "react";


import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import SimpleCard from "./components/SimpleCard";

import { apiGetMessages } from "../data/store/sagas/actions/apiMessageActions";

const useStyles = theme => ({
    root: {
      marginTop: 65
    }
});
  

class MainPage extends React.Component {

    componentDidMount() {
        this.props.apiGetMessages();
    }

    render(){
        const { classes } = this.props; 

        return (
            <Container maxWidth="sm"> 
                <Box my={4} className={classes.root}>
                    {
                        this.props.messages.map((message, index) => {
                            return ( <SimpleCard key={message.id} message={ message.message } /> );
                        })
                    }
                </Box>
            </Container>
        );

    }
}

const mapStateToProps = (state) => {
    return {
      messages: state.messages
    }
};
  
const mapDispatchToProps = { apiGetMessages  };

export default connect( mapStateToProps, mapDispatchToProps )
    (withStyles(useStyles)(MainPage)); 

