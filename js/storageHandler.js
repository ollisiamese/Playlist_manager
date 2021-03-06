define(['jquery', 'knockout'], function(ko) {
	'use strict';

	//update records
	var updateRecords = function(list) {
		var plainList = new Array();

		for (var i = 0; i < list.length; i++) {
			var tracksArray = [];

			if (list[i].tracks().length > 0) {
				for (var g = 0; g < list[i].tracks().length; g++) {
					tracksArray.push(list[i].tracks()[g]);
				}
			} else {
				tracksArray = [];
			}

			plainList.push({name: list[i].name(), tracks: tracksArray, length: list[i].length()});
		}

		localStorage.playlists = JSON.stringify(plainList);
	};

	//get records
	var getRecords = function() {
		return JSON.parse(localStorage.playlists);
	};

	return {
		updateRecords	: updateRecords,
		getRecords	: getRecords
	};
  
});
