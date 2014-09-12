define(['knockout','playlist', 'spotifySearcher', 'storageHandler','domReady!','jquery'],function(ko,playlist,spotifySearcher,storageHandler){

var totalCount=ko.observable();
var allPlaylists=ko.observableArray();
var counter=ko.observable(1);
var areLists=ko.observable();
var duplicateName=ko.observable('');

allPlaylists.subscribe(function(){
                  
                       if(allPlaylists().length>0) {
					     
						 areLists(true);
						 
						 totalCount(allPlaylists().length);
						
						}
				         
						else {
						  
						  areLists(false);

						  totalCount(0);
						}
				  
				  });

				  
var selectedList=ko.observable();

selectedList.subscribe(function(){
                        
						//give selected item a thick orange border     
	                   $('.listContainer').each(function(){
					   
	                   var match=$(this).children('.panel-heading').children('span').children('a').children('p.plName').html();
		            
		               if(selectedList()!=''&&selectedList()!=undefined&&match==selectedList().name()){
		   
		                    $(this).addClass('selectedList');
		   
		                }
		               
					   else {
		                   
						    if($(this).hasClass('selectedList')){
		                   
						        $(this).removeClass('selectedList');
		                    }
		                }
	     
		               });	  
	  
	  });
				  
				  
				  
//RETRIEVE AND MAP INITIAL LISTS FORM LOCALSTORAGE
var finalData=storageHandler.getRecords();

var mappedPosts=$.map(finalData, function(item) {
                          
								return  new playlist(item.name, item.tracks, item.length);

								});
								
allPlaylists(mappedPosts);







//ACTIVATE SORTABLE INTERACTION

var sort=function(element){
	
	        element.sortable({placeholder: "placeholder",                        
							       cursor:"pointer",
						  forceHelperSize: true,
           						  opacity: 0.5,
 							    tolerance: "pointer",
							        items: ".song",  
                             	   zIndex: 9999,
								   
								    //STOP: when sortable action has stopped (whether it was a drag or a drop)
                                     stop: function( event, ui ) {
		 
											   if($('.trash')){
											      $('.trash').remove();
											    }
											  
											   var updated=element.sortable("toArray"); //get current sorted order of the items
											   
											   //going to find items and their positions and store them in a reference array
											   var wonderfulArray=new Array();
											   
											   for(var t=0;t<updated.length;t++){
											          
													  var curUri=updated[t].slice(2);

											          for(var b=0;b<selectedList().tracks().length;b++){
											              
														  if(curUri==selectedList().tracks()[b].uri){
												          
														      wonderfulArray[t]=curUri;
												          
														   }
												          
														  else {
												               //
												           }
											            }
											
											    }
												
												//now, based on the reference array, going to put together an array
												//of actual track objects and pass it back to the selected list
												
												var bestArray=new Array();
												
												for(var y=0;y<wonderfulArray.length;y++){
												  
												    var matchingUri=wonderfulArray[y];
												  
												    for(var m=0;m<selectedList().tracks().length;m++){
												    
													    if(matchingUri==selectedList().tracks()[m].uri){
												         
														     bestArray[y]=selectedList().tracks()[m];
												        }
												        
														else {
												          //
												        }
								
												    }
												
												}
												
												//update the selected playlist
												selectedList().tracks.removeAll();
												selectedList().tracks(bestArray);
												
												if(selectedList().tracks().length==0){
												    
													selectedList().tracks(false);
												}
												
												//save updated to localStorage
												storageHandler.updateRecords(allPlaylists());
									    },
										
										//START: when sortable action has begun
                                        start:function(event, ui ){
								             
											    $(this).append('<div class=\'trash\'><br/><br/><p  class="glyphicon glyphicon-trash "></p></div>');
												
												//create droppable trashcan
												
												$('.trash').droppable({
												            
															hoverClass:"ui-state-hover",
															
															//DROP: when user has dropped item into trashcan
															drop:function(event, ui){

															          if($('.trash')){
											                             
																		 $('.trash').remove();
											   
											                             }
																		 
															         var droppedId=element.sortable("instance").currentItem[0];
										 
																     droppedId.remove(); //remove from the DOM
												 
															}
															
												          //after 'drop', still goes to 'update' event
												          
														   });
										},
										
										//UPDATE: when sortable action has ended AND a change has occured
								        update:function(event, ui){

								                     if($('.trash')){
													
											               $('.trash').remove();											   
											         }

								        }
                       								
							   
						   }); //end of sortable initialization
			
			 
		}	


		
		
//EVENT DELEGATION:

$('#playlists-panel').on('click','.listContainer',function(){

             
               //re-selecting playlist
               $(this).addClass('selectedList');
			   
			   $('.listContainer').not($(this)).removeClass('selectedList'); 
			   
			   var element=$('.selectedList ul');
			   
			   if(element){
			    
				    $('.listContainer ul').each(function(){
				         
						 if($(this).data("ui-sortable")){
				          
						  //kill off all sortable behavior in all lists, so that we can only interact with the selected one
				          $(this).sortable("destroy");
				         }
				         else {
				 
				          //have never initialized this one before and don't need to right now
				         }
				    });
				
				    //initialize the sortable interaction on this playlist
				    sort(element); 
				}
				
				else {
				//
				}
				
});


//CONFIRMING IF USER WANTS TO REMOVE ALL SONGS IN THE PLAYLIST
var askRemoveAllSong=function(item){
   
                     if(selectedList()==item){
     
	                   $('#removeAllSongs').modal('show');
                     }
   
                     else {}
}

//ACTUALLY REMOVING ALL SONGS FROM THE PLAYLIST
var removeAllSongs=function(){

                     if(selectedList()!=undefined){
                     
					    selectedList().tracks(false);
                     
					    $('#removeAllSongs').modal('hide');
                     
					    storageHandler.updateRecords(allPlaylists());

                    }
                    
					else {
                        //
                    }
}


//MAKE A PLAYLIST ACTIVE
var makeActive=function(item) {

               if(selectedList()==item) {} //only activate on the first click, not every single one
               
			   else{
                 
				 selectedList(item);

                }

}


var prevName=ko.observable('');

//ENTER EDIT MODE FOR HTE PLAYLIST NAME
var changeName=function(item) {
               
			   if(selectedList()==item){
    
                  item.editMode(true);
  
                   if(item.name()==undefined||item.name==null){
                     
					 var pr='';
                   }
                   
				   else {
                     
					 var pr=item.name();
                    }
                  
				   prevName(pr);
  
                   $('#listNameInp').focus();
                  
				   return false; //(clicked a link)
 
                }
 
                else { 
                 //
                }
 }


//SAVE THE NAME CHANGE FOR A PLAYLIST
var saveName=function(){

                if(prevName().toLowerCase()==selectedList().name().toLowerCase()){
                         
						 //do nothing, because we typed in the same name as before
		                 
						 selectedList().editMode(false);
		                 
						 return;
                }
                
				else{
	                     var listStatus;
	                     
						 //check that the newly entered name doesn't already exist
						 var checkResult=checkExistingList(selectedList().name()); 
	  
	  
	            }
				
	            if(checkResult==true){
	 
	               //can now save modified list to storage
	               storageHandler.updateRecords(allPlaylists());
	               
				   //(finally,change back to read mode)
	               selectedList().editMode(false);
	            }
	
	            else {
	               
				   //stay in edit mode until problem is fixed
	               selectedList().editMode(true);
	
	            }

}


//CANCEL EDITING A PLAYLIST NAME
var cancelEdit=function() {
                  
				  if(selectedList().name==0) {
                    //cannot leave the field blank
                    $('#emptyNameModal').modal('show');
                  
				  }
                  else {
 
                    selectedList().name(prevName());
                    
					selectedList().editMode(false);

                    $('#listNameInp').focus();

                   }
}


//CHECK IF THE ENTERED PLAYLIST NAME DOESN'T ALREADY EXIST (DUPLICATES)
var checkExistingList=function(listToCheck){
                       
					   if(listToCheck.length==0) {

                           $('#emptyNameModal').modal('show');
                           
						   return false;
                        }
                        
						else {
 
                            var storedLists=storageHandler.getRecords();
                            
							var mappedSongs=$.map(storedLists, function(item) {
                         
								        return  new playlist(item.name, item.tracks);

										});
 
                            if(mappedSongs&&mappedSongs.length>0){
 
                                var listStatus;
                                
								for(var i=0;i<mappedSongs.length;i++){
 
                                   if(listToCheck.toLowerCase()==mappedSongs[i].name().toLowerCase()){
	 
	                                   $('#duplicatePlaylistModal').modal('show');
	                                    
										return listStatus=false;
	 
	                                }
	                            
								else {
	 
	                                listStatus=true;
	                                 
									 }
                                }
                                
								return listStatus;
                            }

							else {

                                //allow to create
                                 return listStatus=true;
                            }
                        }
}




//CREATE NEW PLAYLIST
var createNewList=function(){
                    
					//you can have a limit of 10 playlists only
                    if(allPlaylists().length==10){

                       $('#reached10LimitModal').modal('show');
                    }
                    
					//good to go
				    else {
                       
					   //open up the playlists panel if it is closed
                      if($('.collapsePlaylists').css("display")=='none'){ 
                           
						   $('.pl').click();
                       }

                     var name='New Playlist'+' '+counter();

                     var nameOk=checkExistingList(name.toLowerCase()); //check for duplicate names
                     
					 if(nameOk) {
                          
						  var newList=new playlist(name,'');
                          
						  allPlaylists.unshift(newList);
                          
						  storageHandler.updateRecords(allPlaylists());
 
                          counter(counter()+1);
						  
						  selectedList(newList);
                      }
 
                    else {
                           
						   duplicateName(name);
  
                          $('#duplicateNameModal').modal("show");
	 
                    }
                    }
}


//CONFIRMING THAT USER REALLY WANTS TO DELETE A PLAYLIST
var deleteList=function(item) {
                
				 selectedList(item); //set selectedList
                 
				 $('#deleteModal').modal();
 
}

//ACTUALLY DELETING A PLAYLIST
var confirmedDelete=function(){
                     
					 $('#deleteModal').modal('hide');
                     
					 for(var j=0;j<allPlaylists().length;j++){
                         
						if(allPlaylists()[j].name().toLowerCase()==selectedList().name().toLowerCase()){
	 
	                       allPlaylists.remove(allPlaylists()[j]);
	                       
						   storageHandler.updateRecords(allPlaylists());
	                       
						     selectedList('');
						    
                        }
                        
						else {
	                        //
	                    }
 
                    }
}

var trackToAdd=ko.observable();

//ADD A TRACK TO THE SELECTED LIST FROM SEARCH RESULTS 
var makeDropdownSelection=function(item){

                           var listToClick=item.name();

                           trackToAdd(spotifySearcher.selectedTrack());


                           if(item){
                              
							  makeActive(item);

							  //click to activate the sortable behavior on the selected (active) list (the on click delegated even will fire)
                              $('.plName').each(function(){
                                   
								   if($(this).html()==listToClick){
					  
					                  $(this).parent().parent().click();
					                }
					 
					           });

                              //can't have more than a 100 songs in a playlist
					    if(selectedList().tracks().length>=100) {
                                 
								  $('#trackLimitExceeded').modal('show');
                                    
									return;
                        }					 

                              //ok to add
					    else { 
	                             
								 //if this will not be the first track in this list
                                if(selectedList().tracks()&&selectedList().tracks()!=''&&selectedList().tracks().length>0){
                                      
									  //check if this track is already on the playlists (by unique uri)
                                     for(var x=0;x<selectedList().tracks().length;x++){
                                         
										 if(trackToAdd().uri==selectedList().tracks()[x].uri){
	                                        
											$('#duplicateTrack').modal('show');
	                                             
												 return;
	                                     }
	                                     
										 else {
	                                           //continue
		                                 }
                                     }
  
  
  
                                    selectedList().tracks.push(trackToAdd());
  
                                    storageHandler.updateRecords(allPlaylists());
  
                                }
                                 
								 //if this WILL be the first track inthis list
                                else {

                                     selectedList().tracks([]);
                                     
									 selectedList().tracks.push(trackToAdd());
                                     
									 storageHandler.updateRecords(allPlaylists());
  
                                }

						   //modal cofirmation that track has been added
                           $('#addTrackModal').modal('show');
                           setTimeout(function(){
                                $('#addTrackModal').modal('hide');
                            },1000);
	 
                        }
                }
} 
 


 
 
return {
        totalCount:totalCount,
        allPlaylists:allPlaylists,
		areLists:areLists,
		saveName:saveName,
		changeName:changeName,
		cancelEdit:cancelEdit,
		createNewList:createNewList,
		deleteList:deleteList,
		confirmedDelete:confirmedDelete,
		selectedList:selectedList,
		
		duplicateName:duplicateName,
		
		makeActive:makeActive,
		
		removeAllSongs:removeAllSongs,
		askRemoveAllSong:askRemoveAllSong,
		makeDropdownSelection:makeDropdownSelection,
		trackToAdd:trackToAdd
		
		
		
		
		
		
		
       }


});