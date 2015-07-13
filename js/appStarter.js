'use strict';
//configure
requirejs.config({
	paths: {
		jquery		: "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min",
		//jquery: "../vendor/jquery/jquery-1.9.1.min",
		//jquery_ui: "//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min",
		jquery_ui	: "../vendor/jquery-ui-1.11.1/jquery-ui.min",
		bootstrap	: "//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
		knockout	: "//cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-min",
		helpers		: "../vendor/knockout-amd-helpers.min",
		text		: "../vendor/text",
		domReady	: "../vendor/domReady",
		viewModel	: "../js/viewModel",
		punch		: "../vendor/punch"
	},

	//urlArgs: "bust=v2" //prevent from caching required resources
	urlArgs			: "bust = " + ( new Date() ).getTime()
});

//start the main app logic
requirejs(['knockout', 'viewModel', 'storageHandler', 'playlist', 'text', 'helpers', 'domReady!', 'jquery', 'punch', 'jquery_ui', 'bootstrap'], function (ko, viewModel, storageHandler, Playlist) {
	ko.amdTemplateEngine.defaultPath = "../templates";
	var vm = new viewModel();
	ko.applyBindings(vm);

	//pre-populate 2 playlists with data 
	var list = ko.observableArray();
	var arr1 = [{
			image: "https://i.scdn.co/image/f397b6f71c591f09af27886aa40ee47de7e84621",
			trackName: "All My Life", 
			album: "Thank You for the Demon",
			artist: "Mustasch",             
			duration: "6:59",             
			duration_ms: 418880,
			uri: "spotify:track:3pOqxMamc9sLXHUV4ll0Hu"
		}, {
			image: "https://i.scdn.co/image/e99af5be5e7cdc8ecdd838f9c8e0e9a4944b40ba",
			trackName: "Pale Rider",
			album: "Pale Rider",
			artist: "Gamma Ray",
			duration: "4:24",
			duration_ms: 263683,
			uri: "spotify:track:2IfqDthoYwdXxZmzyncIKn"
		}, {
			album: "Deliver Us",
			artist: "In Flames",
			duration: "3:31",
			image: "https://i.scdn.co/image/9f1a567699d83620466e93dd0463b2ec2c5a5852",
			duration_ms: 210646,
			trackName: "Deliver Us",
			uri: "spotify:track:5jvSEtiDg8z7nrhgatMJIs"
	}];

	var arr2 = [{             
			image: "https://i.scdn.co/image/f5d52a4482dc9dab1afaa3ae5d484b3f71f7b6b6",
			trackName: "Liberation",
			album: "The Party Ain't Over 'Til We Say So",
			artist: "Hardcore Superstar",
			duration: "3:55",
			duration_ms: 234920,
			uri: "spotify:track:3jkPBGrvQTAT4Wy4zmoF3R"
		}, {
			album: "Making Enemies Is Good",
			artist: "Backyard Babies",
			duration: "3:02",
			image: "https://i.scdn.co/image/d0521dfaed5add2307b25117e19237431c3ae3b2",
			duration_ms: 181426,
			trackName: "Brand New Hate",
			uri: "spotify:track:5IgWGRuPWCLPb3Or2X5FI3"
		}, {
			album: "Scars of Insanity",
			artist: "Matanzick",
			duration: "4:42",
			image: "https://i.scdn.co/image/21dd19361f5353336a88db00aac1e7f58bfad825",
			duration_ms: 281470,
			toPlay: "https://open.spotify.com/track/0L2KtwJaCdLTZOMFnjJSYu",
			trackName: "Matar",
			uri: "spotify:track:0L2KtwJaCdLTZOMFnjJSYu"
	}];  

	list.push(new Playlist('List1', arr1));
	list.push(new Playlist('List2', arr2));
	
	//save to localStorage 
	storageHandler.updateRecords(list());  
});