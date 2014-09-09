define(['knockout','track','jquery'],function(ko,track){

var searchResults=ko.observableArray();

var searchStatus=ko.observable(true);

var positiveResults=ko.observable(false);

var searchMsg=ko.observable('');

var foundTracks=ko.observableArray();

var displayMore=ko.observable(false);

var displayPrev=ko.observable(false);

var totalFound=ko.observable();

var pageCount=ko.observable(0);

var subject;


var mapTracks=function(response,query){
           {
			      if(response!=''&&response!=null&&response!=undefined){
			        searchStatus(true);//hide the gif
					console.log('found '+response.tracks.total);
                    searchResults(response.tracks.items);
					//console.log(searchResults());
					totalFound(response.tracks.total);
					
					 
					if(response.tracks.total>20) {
					  displayMore(true); //show the "more pages" button
					  //pageCount(pageCount()+foundTracks().length);
					  subject=query;
					 }
					 else {
					  displayMore(false);
					  }
					  //map and display this search results page
					var mappedTracks=$.map(response.tracks.items, function(item) { return new track(item) });
					foundTracks(mappedTracks);
					console.log('response: '+response);
					console.log(mappedTracks);
					positiveResults(true);
					
					if(totalFound()==0){
					  positiveResults(false);
					  searchMsg("no tracks were found");
					 }
					
					}
				   else {
				     searchMsg("no tracks were found");
					 positiveResults(false);
				     }
                  }
		  
		  };




//first search for this criteria (called by viewModel)
var searchTracks=function(query){
        positiveResults(false);//reset
	    searchStatus(false);//hide the gif
        searchMsg('');//reset message box
		
          $.ajax({
               url: 'https://api.spotify.com/v1/search',
               data: {
                    q: query,
                 type: 'track'
                },
               success: function(response){mapTracks(response,query); },
				  error:function(){
				    searchMsg("no tracks were found");
					positiveResults(false);
				    }
             });
          
		  
		  
		  }

//User clicked on "More results"
var displayMoreTracks=function() {
pageCount(pageCount()+foundTracks().length);
 alert('pageCount: '+pageCount());
     $.ajax({
               url: 'https://api.spotify.com/v1/search',
               data: {
                    q: subject,
                 type: 'track',
				 offset:pageCount(),
				 limit:20
                },
				success:function(response){
				      mapTracks(response,subject);
					  //control the display of "More" and "prev" buttons
					  if(pageCount()>=20) { //we can go back in the resuls too
					  displayPrev(true);					  
					  }
					  else{
					   displayPrev(false);
					   }
					   if((pageCount()+20)>totalFound()){
					     displayMore(false);
					   }
				 },
				 error:function(){
				    searchMsg("no tracks were found");
					positiveResults(false);
				    }
              });

     }		  
		  
//User clicked on "Previous results"
var displayPrevTracks=function() {
    pageCount(pageCount()-foundTracks().length);
 alert('pageCount: '+pageCount());
     $.ajax({
               url: 'https://api.spotify.com/v1/search',
               data: {
                    q: subject,
                 type: 'track',
				 offset:pageCount(),
				 limit:20
                },
				success:function(response){
				      mapTracks(response,subject);
					  //control the display of "More" and "prev" buttons
					  if(pageCount()>=20) { //we can go back in the resuls too
					  displayPrev(true);					  
					  }
					  else{
					   displayPrev(false);
					   }
				 },
				 error:function(){
				    searchMsg("no tracks were found");
					positiveResults(false);
				    }
              });

     }		  		  
		  
		  

return {
       searchTracks: searchTracks,
	   searchStatus:searchStatus,
	   searchMsg:searchMsg,
	   totalFound:totalFound,
	   displayMore:displayMore,
	   displayPrev:displayPrev,
	   positiveResults:positiveResults,
	   foundTracks:foundTracks,
	   displayMoreTracks:displayMoreTracks,
	   displayPrevTracks:displayPrevTracks

     }

});