const express = require('express');
const rewrite = require('express-urlrewrite')
const cors = require('cors');
const logger = require('morgan');
const axios = require('axios')
const contextPath = process.env.SERVER_SERVLET_CONTEXT_PATH

const stationId = require("./config.json").stationId

const app = express();
app.use(rewrite(contextPath + '/*', '/$1'));
app.use(logger('dev'));
app.use(cors());

//Hello World API
app.get('/api/hello', function (req, res) {
    const helloResponse = {"greeting":"Hello World!", "timestamp":Date.now()};
    res.status(200).json(helloResponse);
});

/** get all the station informations */
app.get('/api/station/info', (req, res) => {
    axios.get('https://playa-libre.appspot.com/station/getStationInfo?id='+ stationId)
        .then(r => {
            const data = r.data[0]
            response = {}
            response["stationName"] = data["name"]
            response["stationLocation"] = data["locationName"]
            response["stationImgName"] = data["imageFilename"]
            response["ownerId"] = data["ownerId"]
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
});

/** get all the station last sensor values */
async function getLastValue(sensor){
    try {
        r1 = await axios.get('https://playa-libre.appspot.com/station/getLastSensorValue?stationId=' + stationId + '&sensor=' + sensor + '&type=svo')
        if (r1.data != undefined)
            return r1.data["Entries"][0]["value"]
    } catch (error) {
        return "-"
    }
}

/** get the municipality image */
app.get('/api/station/lastSensorValue', async (req, res) => {
    axios.get('https://playa-libre.appspot.com/station/getStationFeatureList?stationId='+ stationId + '&type=svo')
        .then(async r => {
           response = {}
            for (let index = 0; index < r.data.length; index++) {
               const element = r.data[index];
               response[element["name"]] = await getLastValue(element["name"]);
            }
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
});

app.get('/api/user/image', async (req, res) => {
    const url = 'https://playa-libre.appspot.com/user/downloadMunImg/' + req.query.ownerId
    const response = await axios.get(url, { responseType: 'arraybuffer' }).catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
    const buffer = Buffer.from(response.data, "utf-8")
    res.contentType('image/png')
    res.status(200).send(buffer)


        
});


//Health API
const healthResponse = {"status":"UP"};
app.get('/api/health', function (req, res) {
    res.status(200).json(healthResponse);
});

const port = 8081;
app.listen(port, function () {
    console.log('Listening to Port ' + port);
}); 

