/**
 * Created by Katamori on 2016.02.18..
 */

var request = require('request');
var fs = require('fs');
var readline = require('readline');


/* -------------------------------------------------------------------------------------------------- */
/* -----------------------------------THE OLD METHOD------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */
/* ----------------------(originally wrote links into a txt file)------------------------------------ */
/* ---------------------(kept for historical and tutorial reasons)----------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

/*

 case "getrelated":

 //first aka initial request; sends the chosen link to server
 GetRelated.YTAPP_GetRelated(
 req.body,
 res,
 GetRelated.YTAPP_Callback_LoadData);

 break;

 case "expand":

 //a JSON to store the input value a bit differently
 //task and vid_id are unnecessary
 var new_input = {
 task: "expand",
 keyword: req.body.keyword,
 it: req.body.it
 };

 GetRelated.YTAPP_GetRelated(
 new_input,
 res,
 GetRelated.YTAPP_Callback_LoadData);
 break;

 */


/* -------------------------------------------------------------------------------------------------- */
/* -------------------------------------QUERY-------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

//API key is associated to the "Doom video database" project of "zol.sch93@gmail.com" account
exports.YTAPP_GetRelatedOld = function(input, responseObject, callback){

    //load data from sent
    keyword = input.keyword;
    var iter = input.it;

    //vars needed for the request
    var output = { A: "b", C: "d" };
    var APIkey = "[I'D KEEP IT IN SECRET IF YOU DON'T MIND...USE YOUR OWN KEY HERE]";

    /*

                                    GETRELATED

     */

    if(input.task == "getrelated"){

        //use the inherited ID
        var videoid = input.vid_id.substr(input.vid_id.length-11,input.vid_id.length-1);

        //send the request
        var API_URL = 'https://www.googleapis.com/youtube/v3/search?'
            + 'part=snippet'
            + '&maxResults=50'
                //+ '&q=' + keyword
            + '&relatedToVideoId=' + videoid
            + '&type=video'
            + '&videoDefinition=any'
            + '&videoDuration=any'
            + '&key=' + APIkey;

        //request to YT API
        request(API_URL, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                //output contains the response
                output = callback(body, videoid, input.task);

                //this code snippet sends something back to client
                responseObject.send(output);
                console.log(iter);
            }else{ console.log(error + ", HTTP status code " + response.statusCode)};
        });

        /*

                                    EXPAND

         */

    }else if(input.task == "expand"){

        var videoid = "text";

        //closure to count lines; source: http://www.w3schools.com/js/js_function_closures.asp
        var line_cnt = (function () {
            var private_counter = 0;
            return function () {return private_counter += 1;}
        })();

        //ReadLine goes into the picture here
        const rl = readline.createInterface({
            input: fs.createReadStream("./routes/serverside/links.txt")
        });

        //a basic reader that exits if "iter"-th line is found
        rl.on('line', (line) => {
            var num = line_cnt();

            if(num-1==iter){
                videoid = line;
                rl.close();
            };
        }).on('close', () => {

            videoid = videoid.substr(0, 11);

            //send the request
            var API_URL = 'https://www.googleapis.com/youtube/v3/search?'
                + 'part=snippet'
                + '&maxResults=50'
                    //+ '&q=' + keyword
                + '&relatedToVideoId=' + videoid
                + '&type=video'
                + '&videoDefinition=any'
                + '&videoDuration=any'
                + '&key=' + APIkey;

            //request to YT API
            request(API_URL, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    //output contains the response
                    output = callback(body, videoid, input.task);

                    //this code snippet sends something back to client
                    responseObject.send(output);

                }else{ console.log(error + ", HTTP status code " + response.statusCode)};
            });

        });

    };

};

/* -------------------------------------------------------------------------------------------------- */
/* --------------------------------------------CALLBACK---------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

// callback, that does the job
// input is the response to the AJAX request above
// source: http://stackoverflow.com/a/14220323/2320153
exports.YTAPP_Callback_LoadDataOld =  function(resp, sourcevid, origtask) {

    var result = JSON.parse(resp);

    for(i=0;i<result.items.length-1;i++) {

        //redundancy check
        //KEEP IT FALSE AT THIS POINT!
        var redundant = false;


        //YTAPP_LBL_Comparison(
        //    "./routes/serverside/links.txt",
        //    result.items[i].id.videoId,
        //    redundant);

        //keyword check
        var keywordMatch = false;

        if (keyword.length > 0 && result.items[i].snippet.title.toLowerCase().includes(keyword.toLowerCase()))
        { keywordMatch = true }else{ keywordMatch = false };

        //if id isn't redundant
        //AND matches
        if(!redundant && keywordMatch){

            //then write it to the end of the file
            fs.appendFile("./routes/serverside/links.txt",
                result.items[i].id.videoId//+"|"+result.items[i].snippet.title
                //it + " | " + result.items[i].id.videoId + "|" + result.items[i].snippet.title"
                 + "\r\n",
                function(err) {
                    if(err) { console.log("Saving file failed!"); //return console.log(err);
                    } //console.log("The file was saved!");
                });
        };


    };


/*
            /*

             EXPERIMENT CODE FOR DOOM FILTERING
             DELETED FOR THE SAKE OF STANDARDIZATION

             var u = result.items[i].snippet.channelTitle;   //uploader
             var t = result.items[i].snippet.title;          //title


             //other dismiss conditions
             //TO-DO: MAKE A BLACKLIST AND RUN ON THAT SEPARATELY -> Blacklist(string){return boolean}
             if (
             //not allowed username
             (u.includes("Katamori") ||         u.includes("Lainos87") ||       u.includes ("TheOtherworldonline") ||
             u.includes("TheRealAntroid") ||    u.includes("Lingyan203") ||     u.includes("SGtMarkIV") ||
             u.includes("TheV1perK1ller") ||    u.includes("Markiplier"))
             ||
             //not allowed keywords
             (t.includes("Song") || t.includes("Remake") || t.includes("Spyro") || t.includes("Thief"))
             ) {notCompetN = true};
             */

/*
        };

        if(!redundant && keywordMatch){
            //push only if it's not redundant
            dataset.push(

                {   "Title": result.items[i].snippet.title,
                    "ID": result.items[i].id.videoId,
                    "Uploader": result.items[i].snippet.channelTitle,
                    "Thumbnail": result.items[i].snippet.thumbnails.default.url
                });
            /*
            var wrt =   result.items[i].snippet.channelTitle + " ---" +
                result.items[i].id.videoId + " - " +
                result.items[i].snippet.title;
            */
            /*
        }
    };
*/

    var json =
    {
        a: "a",
        b: "b",
        dat: result,
        gottentask: origtask,
    };

    return json;

};

