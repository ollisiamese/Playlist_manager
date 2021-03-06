define(['knockout', 'spotifySearcher', 'jquery', 'jquery_ui'], function(ko, spotifySearcher) {
	'use strict';

	return function viewModel() {
		var searchBoxMsg = ko.observable('');
		var searchOptions = ko.observableArray();
		var inputLength = ko.observable(0);

		//event handler to fire up autocomplete
		$('#searchInput').on('keyup', function() {    
			if ($(this).val().length > inputLength()) {      
				if ($('#searchInput').val() != undefined) {
					spotifySearcher.autocompleteHelper($('#searchInput').val());
					inputLength($(this).val().length);
				}      
			} else {
				//you already searched for this
				inputLength($(this).val().length);
			}      
		}); 

		var search = function() {
			if ($('#searchInput').val() != '') {
				searchBoxMsg('');
				spotifySearcher.searchTracks($('#searchInput').val());
			} else {
				searchBoxMsg("You didn't type anything in the search box");
			}
		}; 

		return {
			search		: search,
			searchBoxMsg	: searchBoxMsg
		};
	}
});
