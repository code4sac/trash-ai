const axios = require('axios');
const API_ENDPOINT = 'http://localhost:3080'

class MessageService {
    
    static async getMessages() {
        try {
        var config = {
                headers: {'Access-Control-Allow-Origin': '*'}
        };
          const response = await axios.get(`${API_ENDPOINT}`, config);
          console.log("AXIOS RESPONSE", response);
          console.log("AXIOS DATA", response.data);
          return response.data; 
        } catch (error) {
          console.error("AXIOS ERROR", error);
          throw new Error("get Messages Failed");
        }
    }
}

export default MessageService; 