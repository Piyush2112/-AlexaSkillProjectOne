var http = require('http'); // if going through a proxy that uses SSL change to "require('https');"

// Your external IP. Alexa can only access publically-accessible IPs. No LAN access unfortunately.
// Make sure to set up port forwarding on port 8080 to your DTV's IP on your router.
// In my case I had to move receiver to DMZ
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//var local_ip = 'XXX.XXX.XXX.XXX';
//externalIP or FQDN //////////////////////////////////////////////////////////////////////////
var local_ip = 'www.betu.co.in';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * App ID for the skill
 */
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var APP_ID = "amzn1.ask.skill.ca271ae9-7723-42a0-9a1e-f191d72f2b3e"; 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
* The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
   
var TVControl = function () {
	console.log("Initializing AlexaSkill.");
    AlexaSkill.call(this, APP_ID);
};


// Extend AlexaSkill
console.log("Extend AlesaSkill.");
TVControl.prototype = Object.create(AlexaSkill.prototype);
TVControl.prototype.constructor = TVControl;

//Ignore Certificate errors if using HTTPS communication
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

TVControl.prototype.intentHandlers = {
        BetuIntent: function (intent, session, response) {
			console.log("In function. sessionId: " + session.sessionId);
			console.log("In function");
        
        //No matter what she wants to tell you her opinion.
        
        function satisfyAlexa() {
                        response.tell("OK");
                        };
        
        // Obtain User Intent
        switch(intent.slots.Control.value) {
                
                case "no":
				case "no thank you":
						response.tell("OK, Have a great day.");
				break;
				case "thank you":			
                        response.tell("Enjoy!");
                break;
				// Same button is used
				case "play":
				case "resume":
					  path = '/todo/task/play';
                break;
           
				case "pause":
				case "freeze":
					   path = 'todo/task/pause';
                break;
				
				case "guide":
                        path = 'todo/task/guide'
                break;
				
				case "volume up":
				case "volume increase":
				case "up the volume":
				case "increase the volume":
                        path = 'todo/task/volumeup';
                break;
				
				case "volume down":
				case "volume decrease":
				case "decrease volume":
				case "down the volume":
				case "reduce the volume":
				case "decrease the volume":
				         path = 'todo/task/volumedown';
                break;
				
				case "power":
				case "Power On":
				case "On":
				case "Switch On":
				case "Power Up":
						path = 'todo/task/on';
                break;
				case "home":
				case "Go To Home":
				case "Open Home":
						path = 'todo/task/home';
                break;
				
				case "rewind":
						path = 'todo/task/rewind';
                break;
				
				case "stop":
						path = 'todo/task/stop';
                break;
				
				case "forward":
				case "fast forward":
                        path = 'todo/task/forward';
                break;				
				case "exit":
				case "end":
				case "leave":
						path = 'todo/task/exit';
                break;
				
				case "back":
				case "return":
						path = 'todo/task/return';
                break;
	
				case "info":
				case "display":
                        path = 'todo/task/display';
                break;
				
				case "up":
						path = 'todo/task/up';
                break;
				
				case "down":
								path = 'todo/task/down';
                break;

				case "left":
								path = 'todo/task/left';
                break;
			
				case "right":
								path = 'todo/task/right';
                break;
				
				case "select":
				case "enter":
				case "Confirm":
								path = 'todo/task/confirm';
                break;
				
				case "channel up":
				case "page up":
								path = 'todo/task/channelup';
                break;
				
				case "channel down":
				case "page down":
						path = 'todo/task/channeldown';
                break;
				
				case "previous":
                        path = 'todo/task/previous';
                break;
				
				case "Netflix":
                        path = 'todo/task/Netflix';
                break;
						
				case "Picture Off":
                        path = 'todo/task/Pictureoff';
                break;
				
				case "Watch Tv":
				case "Open Tv":
				case "Browse Tv":
                        path = 'todo/task/Browse Tv';
                break;		

				case "Mute":
                        path = 'todo/task/mute';
                break;
				case "Un Mute":
                        path = 'todo/task/mute';
                break;
     				
				default:
                
                        if (! isNaN(intent.slots.Channel.value) ) {

                 path = 'todo/task/' + (intent.slots.Channel.value).replace(/ /g,'')  ;

              }
                else {
                response.tell("I am sorry, I didn't understand  that.");}
        break;			
        } 
		
		callback = function(httpresp) {
			str='';
			httpresp.on('data', function (chunk) {
				str += chunk;
				console.log("In Callback response.On");
				});
				httpresp.on('succeed', function (chunk) {
				str += chunk;
				console.log("In Callback response.On");
				});
			httpresp.on('end', function () {
				console.log("In Callback response.end");
				console.log("Response code: "+httpresp.statusCode);
				console.log(str);
				// your code here if you want to use the results !
				if(httpresp.statusCode!= 200)
				{
					response.ask("Something went wrong!", "Do you want to try again?");
				}
				else 
				{
					//response.tell("OK");
					response.ask("Done", "Next?");
				}
				});
				}
		var options = {
                     host: local_ip,
                     port: 80, // default port for DTV interface
                     path: '/' + path, // Modify if path is prefixed 
                     method: 'POST' //, //(remove first comment slashes if using the "auth" option below)
					 // auth: 'username:password' // this is used if going through authenticated proxy (this is BASIC AUTH)
                    };
					console.log("Host: "+options.host+", Path: "+options.path);
          //var req = http.request(options, satisfyAlexa);
		  var req = http.request(options, callback).end();
          
		  //req.end();
		  console.log("Request ended");		  
        }
}


exports.handler = function (event, context) {
       
        var tvControl = new TVControl();
        tvControl.execute(event, context);
        
};
