/**
 * Created by Katamori on 2016.03.24..
 */

var request     = require('request');
var async       = require ('async');

var mysql       = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '[YOUR PW HERE]',
    database : 'video_db',

    multipleStatements  : true,
});

var HOSTNAME = "localhost"
var APIkey_YT = "[YOUR API KEY HERE]";

/*

 -------------------------------------------------------------------------------------
                                 "DISPLAY_DB" FUNCTIONALITY
 -------------------------------------------------------------------------------------

 */

exports.YTAPP_GetDatabase = function(input){

    connection.connect();

    connection.query('SELECT * FROM videos', function(err, rows, fields) {
        if (err) throw err;

        console.log(rows);
    });

    connection.end();

};





/*

 -------------------------------------------------------------------------------------
                                "AUTOCOMPLETE" FUNCTIONALITY
 -------------------------------------------------------------------------------------

 */



exports.YTAPP_WriteVideoData = function(input){

    connection.connect();

    connection.query('SELECT id, num_id FROM videos where uploader IS NULL order by num_id', function(err, rows, fields) {
        if (err) throw err;

        //using "async" npm was not my idea; source: http://stackoverflow.com/a/36385121/2320153
        async.eachSeries(rows, function(row, next){
            //gets data of a single video
            var apiUrl = 'https://www.googleapis.com/youtube/v3/videos'
                + '?part=snippet'
                + '&id=' + row.id
                + '&key=' + APIkey_YT;

            request(apiUrl, function (error, response, body) {
                if((error || response.statusCode != 200) && typeof respone != 'undefined') {
                    console.error(response.statusCode, error);
                    return next();
                }

                /*

            AUTOCOMPLETE EXAMPLE 1: ADD TITLE IF MISSING



                if(typeof JSON.parse(body).items[0] != "undefined"){

                    var write_this = JSON.parse(body).items[0].snippet.description;
                    write_this = write_this.replace(/'/g, "");

                    connection.query("UPDATE videos SET descr='" + write_this +"'"
                                    +"WHERE id='"+row.id +"' AND title<>' '",
                        function(err, result) {
                            if(err==null){  console.log(row.num_id)
                            }else{          console.log(err)}

                        });

                }
                 */

                /*

                 AUTOCOMPLETE EXAMPLE 2: ADD USERS IF NOT DEFINED YET



                 connection.query("SELECT * from users", function(err, result) {
                        if(err!=null){  console.log(err)
                        }else{

                            if(typeof JSON.parse(body).items[0] != "undefined"){

                                var write_this = JSON.parse(body).items[0].snippet.channelId;
                                var this_too = JSON.parse(body).items[0].snippet.channelTitle;

                                //console.log(row.id+"|"+write_this+" | "+this_too);

                                var autocSQLstr =
                                    //"UPDATE videos SET uploader ='"+write_this
                                    //+"' WHERE id='"+row.id +"' AND uploader is NULL"
                                    "INSERT INTO users (channelid, chname) VALUES ('"+write_this
                                    +"', '"+this_too+"')";

                                connection.query(autocSQLstr,
                                    function(err, result) {

                                        if(err==null){console.log(row.num_id + "|" + this_too)}else{console.log(err)}

                                    });


                            };

                        }
                    });


*/

                /*

                 AUTOCOMPLETE EXAMPLE 3: ADD UPLOADER IF IT EXISTS; WRITE IF IT DOESN'T

                 */


                if(typeof JSON.parse(body).items[0] != "undefined"){

                    var ch_id = JSON.parse(body).items[0].snippet.channelId.replace(/'/g, "");;

                    //console.log(ch_id);

                    var autocSQLstr =
                        "update videos "+
                        "inner join users on users.channelid='" + ch_id + "' " +
                        "set videos.uploader = users.num_id " +
                        "where users.channelid is not null " +
                        "and videos.id='"+row.id+"'";



                    connection.query(autocSQLstr,
                        function(err, result) {

                            if(err==null){


                                if (row.num_id % 70 < 5){
                                console.log(row.num_id+"|"+
                                            JSON.parse(body).items[0].snippet.title+"|"+
                                            JSON.parse(body).items[0].snippet.channelTitle);
                                };


                                //try to add a new channel to the existing list

                                 if(result.affectedRows==0){

                                     var ch_i = JSON.parse(body).items[0].snippet.channelId;
                                     var ch_tt = JSON.parse(body).items[0].snippet.channelTitle;
                                     ch_tt = ch_tt.substr(0,49);

                                     var anotherSQLstr =
                                     "INSERT INTO users (channelid, chname) VALUES ('"+ch_i
                                     +"', '"+ch_tt+"')";

                                     connection.query(anotherSQLstr,
                                        function(err, result) {
                                            if(err==null){console.log("New channel added: "+ch_tt)}
                                            else{console.log(err.code)}
                                        });

                                 };



                            }else{console.log(err)}

                        });


                };









                next();
            });

        });

    });


};



/*

-------------------------------------------------------------------------------------
                        "EXPAND" FUNCTIONALITY (WITH CALLBACK)
-------------------------------------------------------------------------------------

 */



var iter = -2;             //shows, how many videos' related vids are already listed
var currentsize = 0;    //current amount of videos' data stored

exports.YTAPP_Expand = function(input, callback){

    //load data from sent
    //keyword = input.keyword;
    var keyword = "doom";
    var iter = input.it;

    if(input.task == "expand"){

         connection.connect();

        var expandSQLstring =
            "SELECT * " +
            "FROM videos " +
            //"AND (subj_name is null or subj_name <> 10) " +
            "where related_dst is not null " +
            "AND checked = 0 " +
            //"AND uploader is not null " +
            "AND num_id > 350000"
            //"and title like '%[Doom%' " +
            "ORDER BY num_id";

         connection.query(expandSQLstring, function(err, rows, fields) {
         if (err) throw err;

             //using "async" npm was not my idea; source: http://stackoverflow.com/a/36385121/2320153
             async.eachSeries(rows, function(row, next){

                 var output = { A: "b", C: "d" };
                 var videoid = row.id;

                 var API_URL = 'https://www.googleapis.com/youtube/v3/search?'
                 + 'part=snippet'
                 + '&maxResults=50'
                 //+ '&q=' + keyword
                 + '&relatedToVideoId=' + videoid
                 + '&type=video'
                 + '&videoDefinition=any'
                 + '&videoDuration=any'
                 + '&key=' + APIkey_YT;

                 //send the request
                 request(API_URL, function (error, response, body) {
                     if((error || response.statusCode != 200) && typeof respone != 'undefined') {
                        console.error(response.statusCode, error);
                        return next();
                    }

                    if(typeof JSON.parse(body).items != "undefined"){

                        //console.log(row.id, "|", row.num_id, "|", JSON.parse(body).items.length);

                        for(i=1;i<3/*JSON.parse(body).items.length-1*/;i++){

                            if (typeof JSON.parse(body).items[i] != "undefined" &&
                                keyword.length > 0 &&
                                JSON.parse(body).items[i].snippet.title.toLowerCase().includes(keyword.toLowerCase())
                                )
                            {



                                var a = JSON.parse(body).items[i].id.videoId;
                                var t = JSON.parse(body).items[i].snippet.title.replace(/'/g, "");
                                var d = JSON.parse(body).items[i].snippet.description.replace(/'/g, "");
                                var r = (row.related_dst) + 1;

                                var ch_id = JSON.parse(body).items[i].snippet.channelId;

                                //SQL command to add new video

                                var SQLstring =

                                    "INSERT INTO videos (id, descr, title, related_dst) "
                                    +"VALUES ("
                                    +"'" + a +"',"
                                    +"'" + d +"',"
                                    +"'" + t +"',"
                                    +"'" + r +"'); "
                                    +"UPDATE videos SET checked = 1 "
                                    +"WHERE id='"+row.id +"'; " +

                                    "update videos "+
                                    "inner join users on users.channelid='" + ch_id + "' " +
                                    "set videos.uploader = users.num_id " +
                                    "where users.channelid is not null " +
                                    "and videos.id='"+row.id+"'";

                                //SQL string to calculate "related_dst"
/*
                                var SQLstring =
                                    "UPDATE videos " +
                                    "set related_dst=" + row.related_dst + "+1 "  +
                                    "WHERE id='"+ a +"' AND related_dst IS NULL; " +

                                    "UPDATE videos " +
                                    "SET checked = 1 " +
                                    "WHERE id='"+row.id+"'";
*/
                                //console.log(SQLstring);



                                connection.query(SQLstring,
                                    function(err, result) {

                                        //console.log(JSON.parse(body).items[i].snippet.title);
                                        //if(row.num_id%1000 < 100){ console.log(row.num_id); };
                                        //console.log("||||||||||");

                                        if(err==null){

                                            console.log(row.id+" -> "+a+" | at "+row.num_id);
/*
                                            if(result[0].affectedRows==0){
                                                console.log("Currently at "+row.related_dst+", no new dst was defined ")
                                            }else{
                                                console.log("Currently at "+row.related_dst+", success!")
                                            };

*/
                                        }else{          console.log(err.code+" at "+row.num_id); }

                                    });

                            };
                        };


                    }


                    next();
                 });



             });


         //console.log(rows);
         });



    };











};





exports.YTAPP_Callback_LoadData = function(origtask){





};










