/**
 * Created by Katamori on 2016.02.16..
 */

const http = require('http');

var HOSTNAME = "http://" + "localhost";

var step = -1;
var size = 0;
//var id = document.getElementById("vid_id").value;
//var kw = document.getElementById("keyw").value;

var data = {
    source: "/ytapp",
    task: "",
    vid_id: " ",
    keyword: " ",
    it: 666
};

function SendLink(callback) {

    data.it = step;
    data.vid_id = document.getElementById("vid_id").value;
    data.keyword = document.getElementById("keyw").value;

    var tasklist = document.getElementById("task_options");
    data.task = tasklist.options[tasklist.selectedIndex].value;

    if(step==-1) {

            step = step + 1;
            Settexts();

    }else{
			var jsonData = JSON.stringify(data)

			const req = http.request({
				method: 'POST',
				hostname: HOSTNAME,
				port: 7776,
				path: '/domaintest',
				headers: {
				  'Content-Type': 'application/json',
				  'Content-Length': jsonData.length
				}
			}, callback)

			res.on('data', d => {
				process.stdout.write(d)
			})
			
			req.on('error', error => {
				console.error(error)
			})
			
			req.write(jsonData)
			req.end()
    };


};

function Callback_GetData(response){

    step = step + 1;
    Settexts();
    console.log(response);

    //self-repeat
    if(step>1 && response.gottentask == "expand")
    { setTimeout( function(){ SendLink(Callback_GetData) },1500) };

};



/* -------------------------------------------------------------------------------------------------- */
/* -----------------------------------------HTML UPDATE---------------------------------------------- */
/* -------------------------------------------------------------------------------------------------- */

var secs = 0;

function Settexts(){



    if(step==-1){

        document.getElementById("iteration").innerHTML = " ";
        //document.getElementById("btn_list").innerHTML = "List related videos";

    }else{

        document.getElementById("iteration").innerHTML = "Iteration "+step;
        //document.getElementById("btn_list").innerHTML = "Add related videos of #"+step+" to list of " + size;
        //document.getElementById("datasetsize").innerHTML = dataset.length + " videos are logged."
    };


};


//display JSON in table
function DisplayPortion(dset, start, end){
    /*var tbl=$("<table/>").attr("id","mytable");
    $("#div1").append(tbl);

    for(i=start;i<end;i++){

        var tr="<tr>";
        var td0="<td>#"+i+"</td>";
        var td1="<td>"+dset.items[i].snippet.title+"</td>";
        var td2="<td>"+dset.items[i].snippet.title+"</td>";
        var td3="<td>"+dset.items[i].snippet.title+"</td>";
        var td4="<td><img src="+dset.items[i].snippet.thumbnails.default.url+"></td>";
        var td5="<td> From #"+it-1+"</td></tr>";

        $("#mytable").append(tr+td0+td1+td2+td3+td4+td5);

    };*/


};

//select and show proper form
//source: http://stackoverflow.com/questions/22441858/displaying-conditional-fields-in-html-using-a-form-select-menu
/*$("#task_options").change( function(){

    var selected = $("#task_options option:selected").val();
    $('div').hide();
    $('#' + selected).show();
});

$(document).ready(function (e) {
    $('div').hide();
    $('#expand').show();
});*/





