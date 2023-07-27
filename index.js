const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')
// var xhub = require('express-x-hub');
const port = 3000
const messageId = []
// app.use(xhub({ algorithm: 'sha1', secret: `314464be816fa79c0984bd7b041ac6e2` }));
app.use(bodyParser.json())

async function sendMessages(phoneNo_id,from,title_1,title_2) {
    try {
        console.log({title_1,title_2});

        await axios.post(`https://graph.facebook.com/v17.0/${phoneNo_id}/messages`,
            {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": from,
                "type": "interactive",
                "interactive": {
                    "type": "button",
                    "body": {
                        "text": "Please select from below option"
                    },
                    "action": {
                        "buttons": [
                            {
                                "type": "reply",
                                "reply": {
                                    "id": "1",
                                    "title": `${title_1}`
                                }
                            },
                            {
                                "type": "reply",
                                "reply": {
                                    "id": "2",
                                    "title": `${title_2}`
                                }
                            }
                        ]
                    }
                }
            },
            {
                headers: {
                    authorization:
                        "Bearer EAAN9nm68XDEBO1JxZAbZCmZAEnUGPk6ZAFOZCxnBhA0Ld6dmCL3Ov3irZAv90HDWZAZARU9m8M75hBe2WL7lL3wKjXNwZBRCqD2HkDZAls3whmEhBRZCDNwhOFeqRYh2o0uP4MWf6jcclnm3svaTXYdcZAOyoWVEek8MsxJocZAHCZBZClPeOPL8dK4HvdC7iQkoKujqumEvac1wl9Ak3CWOkZCaUxI1XEIe96kZD",
                },

            }

        )
    } catch (error) {
        console.log(error.response.data.error);
    }
}


app.get('/webhook', (req, res) => {

    console.log(req.query['hub.verify_token']);
    console.log(req.query['hub.challenge']);
    res.send(req.query['hub.challenge']);
})

app.post('/webhook', (req, res) => {
    try {
        
        const body_param = req.body
        console.log(JSON.stringify(req.body));
            if(body_param.entry[0].changes[0].value.messages){
                let phoneNo_id
                let from
                let msg_body
                let title_1
                let title_2
                if(body_param.entry[0].changes[0].value.messages[0].text){
                    msg_body = body_param.entry[0].changes[0].value.messages[0].text.body
                }
                else if(body_param.entry[0].changes[0].value.messages[0].interactive) {
                    msg_body = body_param.entry[0].changes[0].value.messages[0].interactive.button_reply.id
                }
                phoneNo_id = body_param.entry[0].changes[0].value.metadata.phone_number_id
                from = body_param.entry[0].changes[0].value.messages[0].from
                console.log({phoneNo_id,from,msg_body});
                if (!messageId.includes(body_param.entry[0].changes[0].value.messages[0].id)) {
                    messageId.push(body_param.entry[0].changes[0].value.messages[0].id)
                    if(msg_body=="1"){
                        title_1 = "location of pothole"
                        title_2 = "image of pothole"

                    }else if(msg_body == "2"){
                        title_1 = ""
                        title_2 = ""
                    }
                    title_1 = "make pothole request"
                    title_2 = "existing request"
                    sendMessages(phoneNo_id, from ,title_1 ,title_2)
                }
            }
    } catch (error) {
        console.log(error);
    }
})




// app.post('/test', (req, res) => {

//     console.log(req.body);
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})