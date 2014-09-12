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

var filterSelection=ko.observable('trackName');


filterSelection.subscribe(function(){
 $('.filterLink').each(function(){

 //console.log($(this).html());
  
     if($(this).html().toLowerCase().indexOf(filterSelection().slice(0,3))>-1){
	    //console.log($(this).html().toLowerCase().indexOf(filterSelection().slice(0,3)));
		$(this).addClass('activeFilter');
		//console.log($(this).html());
		}
	 else {
	    $(this).removeClass('activeFilter');
	    }
     
	 });

  });

//SET FILTER
var setFilter=function(filter){
  filterSelection(filter.toString());
}

//SORT THE FOUND TRACKS
var trackSorter=ko.computed(function(){

  var listToSort=foundTracks();
  var filterCriterion=filterSelection();
  
  if(filterCriterion&&filterCriterion=='trackName') {
  
  return listToSort.sort(function(a,b){
         
        return a.trackName == b.trackName ? 0 : (a.trackName < b.trackName ? -1 : 1);
    });	  
  
   }
   
   if(filterCriterion&&filterCriterion=='artist') {
  
  return listToSort.sort(function(a,b){
         
        return a.artist == b.artist ? 0 : (a.artist < b.artist ? -1 : 1);
    });	  
  
   }
   
   if(filterCriterion&&filterCriterion=='album') {
  
  return listToSort.sort(function(a,b){
         
        return a.album == b.album ? 0 : (a.album < b.album ? -1 : 1);
    });	  
  
   }

   
   if(filterCriterion&&filterCriterion=='duration') {
  
  return listToSort.sort(function(a,b){
         
        return a.duration == b.duration ? 0 : (a.duration < b.duration ? -1 : 1);
    });	  
  
   }

});





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
					//console.log('response: '+response);
					//console.log(mappedTracks);
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
       alert(query);
	   filterSelection('');
	   
		 
        positiveResults(false);//reset
	    searchStatus(false);//hide the gif
        searchMsg('');//reset message box
		displayPrev(false);
		
		//to property display search status and results, unfold the hidden content
		if($('.collapse').css('display')=='none') {
		    $('.collapse').collapse("show");
		 }
		
		
          $.ajax({
               url: 'https://api.spotify.com/v1/search',
               data: {
                    q: query,
                 type: 'track,artist,album'
                },
               success: function(response){
			            mapTracks(response,query);
				        filterSelection('trackName');
						
				  },
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
                 type: 'track,artist,album',
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
                 type: 'track,artist,album',
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
		  
var autocompleteHelper=function(value) {
       //alert(value);
           
		   var arw=new Array();
		   
		   $.ajax({
               url: 'https://api.spotify.com/v1/search',
               data: {
                    q: value,
                 type: 'track,album,artist',
				 limit:50				 
                },
				success:function(response){
				 
				 //console.log(response);
				 
				 //found Tracks
				 var foundTracks=new Array(response.tracks.items);
				 var foundAlbums=new Array(response.albums.items);
				 var foundArtists=new Array(response.artists.items);
				 
				 
				 
				 if(foundTracks&&foundTracks.length>0){
				 
				 for(var i=0;i<foundTracks.length;i++){
				 
				   
				    for(var j=0;j<foundTracks[i].length;j++){
					
					  var stringToPush=foundTracks[i][j].name.toString();
					  
					  if(arw.indexOf(stringToPush)<0){ //only unique values get pushed to the autocomplete list
					  arw.push(stringToPush);
					   }
					   else {
					     //don't add to the autocomplete
					      }
					    }
				  
					  }
				  }
					 
					if(foundAlbums&&foundAlbums.length>0) {
					   for(var i=0;i<foundAlbums.length;i++){
				 
				   
				    for(var j=0;j<foundAlbums[i].length;j++){
					  
					  var stringToPush=foundAlbums[i][j].name.toString();
					  if(arw.indexOf(stringToPush)<0){
					  arw.push(stringToPush);
					   }
					   else {
					     //don't add to the autocomplete
					      }
					  
					    }
				  
					  }
					
					
					 }
					 
					 if(foundArtists&&foundArtists.length>0) {
					   for(var i=0;i<foundArtists.length;i++){
				 
				   
				    for(var j=0;j<foundArtists[i].length;j++){
					   //console.log(foundArtists[i][j].name);
					  var stringToPush=foundArtists[i][j].name.toString();
					  if(arw.indexOf(stringToPush)<0){
					  arw.push(stringToPush);
					   }
					   else {
					     //don't add to the autocomplete
					      }
					  
					    }
				  
					  }
					
					
					 }
					 
					 //console.log(arw.length);
					 if(arw.length>0){
					 
					 
					 
				     //update autocomplete with search results
					 $('#searchInput').autocomplete({source:arw,delay:0,select:function(event, ui){searchTracks(ui.item.value);}}); 
				      
					}
				 else {
				  //no suggestions found
				 }
				 
				 
				}
				
				});
				
		

       }


var plusMinusCollapse=function(id){

if($('a[id='+id+'] span').attr("class").indexOf('plus')>1){
   $('a[id='+id+'] span').removeClass("glyphicon-plus-sign");
   $('a[id='+id+'] span').addClass("glyphicon-minus-sign");
   return true; //go on to the mormal function of showing/hiding content
  }
 else {
   $('a[id='+id+'] span').removeClass("glyphicon-minus-sign");
   $('a[id='+id+'] span').addClass("glyphicon-plus-sign");
   return true;
  }

}	   

var selectedTrack=ko.observable();

var setSelectedTrack=function(track){
selectedTrack(track);
console.log(selectedTrack());
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
	   displayPrevTracks:displayPrevTracks,
	   autocompleteHelper:autocompleteHelper,
	   trackSorter:trackSorter,
	   setFilter:setFilter,
	   plusMinusCollapse:plusMinusCollapse,
	   selectedTrack:selectedTrack,
	   setSelectedTrack:setSelectedTrack

     }

});