const serverless = require("serverless-http")
const express = require("express")
const request = require('request')
const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const router = express.Router();

router.get('/info', (req, res) => {
    res.send({ application: 'storyblocks-generator', version: '1' })
});
router.post('/generate', (req, res) => {
    let url = req.body.url
    let urlSplit = url.split("/")
    let result = ""
    let title = ""
    let source = ""
    let thumbnail = ""
    if(urlSplit[3] == "video") {
        request({uri: url}, function(error, response, body) {
            source = JSON.stringify(body)
            let arrSource = source.split(",")
            for(i=0; i < arrSource.length; i++) {
                if(arrSource[i].indexOf("title") != -1 && title == "") {
                    title = arrSource[i]
                    title = title.split(`\\n`)[2]
                    title = title.substring(11,title.length-22)
                }
                if(arrSource[i].indexOf("thumbnails") != -1 && thumbnail == "") {
                    thumbnail = arrSource[i]
                    thumbnail = thumbnail.split(`\\n`)[19]
                    thumbnail = thumbnail.split(`content=\\"`)[1]
                    thumbnail = thumbnail.substring(0, thumbnail.length-4)
                }
                if(arrSource[i].indexOf("nonWatermarkedPreviewUrl") != -1){
                    result = arrSource[i].split(`":\\`)[1]
                    result = result.substring(1, result.length-9)
                    result = result.split(`\\`).join("")+"720.mp4"
                    break
                }
            }
            res.status(200).json({
                title: title,
                thumbnail: thumbnail,
                result: result
            })
        })
    }
    else if(urlSplit[3] == "images") {
        request({uri: url}, function(error, response, body) {
            source = JSON.stringify(body)
            let arrSource = source.split(",")
            for(i=0; i < arrSource.length; i++) {
                if(arrSource[i].indexOf("title") != -1 && title == "") {
                    title = arrSource[i]
                    title = title.split(`\\n`)[2]
                    title = title.substring(11,title.length-22)
                }
                if(arrSource[i].indexOf("nonWatermarkedPreviewUrl") != -1){
                    result = arrSource[i].split(`":\\`)[1]
                    result = result.substring(1, result.length-2)
                    result = result.split(`\\`).join("")
                    thumbnail = result
                    break
                }
            }
            res.status(200).json({
                title: title,
                thumbnail: thumbnail,
                result: result
            })
        })
    }
    else if(urlSplit[3] == "audio") {
        request({uri: url}, function(error, response, body) {
            source = JSON.stringify(body)
            let arrSource = source.split(",")
            for(i=0; i < arrSource.length; i++) {
                if(arrSource[i].indexOf("title") != -1 && title == "") {
                    title = arrSource[i]
                    title = title.split(`\\n`)[2]
                    title = title.substring(11,title.length-22)
                }
                if(arrSource[i].indexOf("thumbnails") != -1 && thumbnail == "") {
                    thumbnail = arrSource[i]
                    thumbnail = thumbnail.split(`\\n`)[20]
                    thumbnail = thumbnail.split(`content=\\"`)[1]
                    thumbnail = thumbnail.substring(0, thumbnail.length-4)
                }
                if(arrSource[i].indexOf("nonWatermarkedPreviewUrl") != -1){
                    result = arrSource[i].split(`":\\`)[1]
                    result = result.substring(1, result.length-2)
                    result = result.split(`\\`).join("")
                    break
                }
            }
            res.status(200).json({
                title: title,
                thumbnail: thumbnail,
                result: result
            })
        })
    }
    else {
        res.status(500).json({
            message: "Internal Server Error. Link not Valid",
        })
    }
})

app.use(`/.netlify/functions/api`, router)

module.exports = app
module.exports.handler = serverless(app)