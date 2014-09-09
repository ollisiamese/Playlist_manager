define(['knockout','spotifySearcher','jquery','jquery_ui'],function(ko,spotifySearcher){
return function viewModel() {
 
 
 var searchInput=ko.observable();
 
 searchInput.subscribe(function(){ //searches as you are typing
 
   if(searchInput().length>3){
       alert('I start the search!');
       spotifySearcher.searchTracks(searchInput());
     }
    else {
	 spotifySearcher.searchStatus(true); //remove the ajax loading img
	  }
    });
 
 var search=function(){
        if(searchInput()!='') {
		  spotifySearcher.searchTracks(searchInput());
		 }
		 else {
		    alert('You didn\'t type anything!');
		    }
      
	  }
  
  
  
  
  
  
  
  
  return {
       
	   searchInput:searchInput,
	   search:search
	   

       }

}
});