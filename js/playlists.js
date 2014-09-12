define(['knockout','playlist', 'spotifySearcher', 'storageHandler','domReady!','jquery'],function(ko,playlist,spotifySearcher,storageHandler){

var totalCount=ko.observable();
var allPlaylists=ko.observableArray();
var counter=ko.observable(1);
var areLists=ko.observable();

//var updateCurrentList=ko.observable();

var duplicateName=ko.observable('');

allPlaylists.subscribe(function(){
                  
                  if(allPlaylists().length>0) {areLists(true);totalCount(allPlaylists().length);}
				  else {areLists(false); totalCount(0);}
				  
				  });


var finalData=storageHandler.getRecords();
var mappedPosts=$.map(finalData, function(item) {
                          
								return  new playlist(item.name, item.tracks, item.length); });
allPlaylists(mappedPosts);

var selectedList=ko.observable();

selectedList.subscribe(function(){
           //give selected item a thick orange border
       
	  $('.listContainer').each(function(){
	     var match=$(this).children('.panel-heading').children('span').children('a').children('p.plName').html();
		 //console.log(selectedList());
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





//activate sortable interaction
var sort=function(element){
	//alert('sort has been called');
	element.sortable({placeholder: "placeholder",
	                         //containment: "parent",
							      cursor:"pointer",
						 forceHelperSize: true,
           						 opacity: 0.5,
 							   tolerance: "pointer",
							   items: ".song",
							       
                             	  zIndex: 9999,
                                stop: function( event, ui ) {
								               
											   alert('stopped');
											   if($('.trash')){
											   $('.trash').remove();
											  
											   }
											  // console.log('stopped sez: ');
											   //console.log(selectedList().tracks());
											   var updated=element.sortable("toArray");
											   var wonderfulArray=new Array();
											   for(var t=0;t<updated.length;t++){
											   var curUri=updated[t].slice(2);
											   //console.log(curUri);
											   
											   
											   for(var b=0;b<selectedList().tracks().length;b++){
											      if(curUri==selectedList().tracks()[b].uri){
												      wonderfulArray[t]=curUri;
												      }
												   else {
												   //
												      }
											    }
												
												//console.log('wonderfulArray: ');
												//console.log(wonderfulArray);
											
											    }
												//found items and their positions
												var bestArray=new Array();
												for(var y=0;y<wonderfulArray.length;y++){
												  
												  var matchingUri=wonderfulArray[y];
												  //console.log('matchingUri '+matchingUri);
												  for(var m=0;m<selectedList().tracks().length;m++){
												    
													  if(matchingUri==selectedList().tracks()[m].uri){
												         bestArray[y]=selectedList().tracks()[m];
												          }
												      else {
												          //
												          }
												
												
												   }
												
												}
												//console.log('best array: ');
												//console.log(bestArray);
												
												selectedList().tracks.removeAll();
												selectedList().tracks(bestArray);
												if(selectedList().tracks().length==0){
												  selectedList().tracks(false);
												 }
												//console.log('now in selectedList: ');
												//console.log(selectedList().tracks());
												//console.log('now in allPlaylists: ');
												//console.log(allPlaylists()[0].tracks());
												storageHandler.updateRecords(allPlaylists());
											   },
                                start:function(event, ui ){
								             
											    $(this).append('<div class=\'trash\'><br/><br/><p  class="glyphicon glyphicon-trash "></p></div>');
												
												//create droppable trashcan
												$('.trash').droppable({
												            hoverClass:"ui-state-hover",
															
															drop:function(event, ui){
															          alert('dropped');
													 
															          if($('.trash')){
											                             $('.trash').remove();
											   
											                             }
																		 
															var droppedId=element.sortable("instance").currentItem[0];
															    droppedId.remove(); //remove from the dom
												 
															   }
												          //after dropped, still goes to 'update' event,so we save updates there
												          
														   });
											  },
								update:function(event, ui){
								                  alert('updated');
									   
								                     if($('.trash')){
											               $('.trash').remove();											   
											            }
														
									              var arrayToSave=new Array();
		
								         }
                       								
							   
							   });
			
			 
		}	


		
		
		
		


//EVENTS DELEGATION:

$('#playlists-panel').on('click','.listContainer',function(){

             
               //re-selecting playlist
               $(this).addClass('selectedList');
			   
			   $('.listContainer').not($(this)).removeClass('selectedList'); 
			   var element=$('.selectedList ul');
			 if(element){
			    
				$('.listContainer ul').each(function(){
				if($(this).data("ui-sortable")){
				 //kill off all sortable behavior n al lists, so that we can only interact with the selected one
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
				
				}
				
});



var removeATrack=function(song){
alert(song.name);

}


var askRemoveAllSong=function(item){
if(selectedList()==item){
$('#removeAllSongs').modal('show');
}
else {}
}

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



var makeActive=function(item) {

if(selectedList()==item) {} //only activate on the first click, not every single one
else{
selectedList(item);

}

}


var prevName=ko.observable('');
//switch the name for an input (enter edit mode)
var changeName=function(item) {
  if(selectedList()==item){
  //selectedList(item);  
  item.editMode(true);
  //console.log(item);
  if(item.name()==undefined||item.name==null){
    var pr='';
   }
   else {
    var pr=item.name();
     }
  prevName(pr);
  //console.log('prevName:'+item.name());
  $('#listNameInp').focus();
 return false;
 
 }
 
 else {
 
   //
    }
 }


var saveName=function(){

   
   //console.log(prevName().toString().toLowerCase());
   if(prevName().toLowerCase()==selectedList().name().toLowerCase()){
        //do nothing, because we typed in the same name as before
		selectedList().editMode(false);
		return;
      }
    else{
	  var listStatus;
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

var cancelEdit=function() {
if(selectedList().name==0) {
 
 $('#emptyNameModal').modal('show');
 }
 else {
 
selectedList().name(prevName());
selectedList().editMode(false);

$('#listNameInp').focus();


   }
}

var checkExistingList=function(listToCheck){
if(listToCheck.length==0) {

$('#emptyNameModal').modal('show');
return false;
}
else {
 
 var storedLists=storageHandler.getRecords();
 var mappedSongs=$.map(storedLists, function(item) {
                         
								return  new playlist(item.name, item.tracks, item.length); });
 //console.log('storedLists: '+mappedSongs);
 if(mappedSongs&&mappedSongs.length>0){
 
 var listStatus;
 for(var i=0;i<mappedSongs.length;i++){
 //console.log('storedList name: '+i+""+mappedSongs[i].name());
    if(listToCheck.toLowerCase()==mappedSongs[i].name().toLowerCase()){
	 //alert('A playlist with this name already exists!');
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



var createNewList=function(){
//you can have a limit of 10 playlists only
if(allPlaylists().length==10){
//alert('You have reached the limit of 10 playlists. You may modify your existing playlists or delete some of them.');
$('#reached10LimitModal').modal('show');
}
else {

if($('.collapsePlaylists').css("display")=='none'){ //drop down content
$('.pl').click();
}

var name='New Playlist'+' '+counter();


var nameOk=checkExistingList(name.toLowerCase());
if(nameOk) {
  
  var newList=new playlist(name,'','0');
 allPlaylists.unshift(newList);
 storageHandler.updateRecords(allPlaylists());
 counter(counter()+1);
 }
 
 else {
 duplicateName(name);
 // alert('It seems like you may have a playlist named '+name+'.Please rename it to something else before creating a new playlist.');
  $('#duplicateNameModal').modal("show");
  
	 console.log(duplicateName());
 }
}
}



var deleteList=function(item) {
selectedList(item); //set selectedList
$('#deleteModal').modal();
 
}

var confirmedDelete=function(){
$('#deleteModal').modal('hide');
for(var j=0;j<allPlaylists().length;j++){
   if(allPlaylists()[j].name().toLowerCase()==selectedList().name().toLowerCase()){
	 
	 allPlaylists.remove(allPlaylists()[j]);
	 storageHandler.updateRecords(allPlaylists());
	 selectedList('');//reset selectedList
	 
    }
    else {
	  //
	 }
 
  }
 }


var makeDropdownSelection=function(item){
//console.log('item id:');
var listToClick=item.name();
//console.log('selected track: ');
var trackToAdd=spotifySearcher.selectedTrack();
//console.log(spotifySearcher.selectedTrack().image);

if(item){
makeActive(item);
//click to activate the sortable behavior on the selected (active) list (the on click delegated even will fire)
$('.plName').each(function(){
                     if($(this).html()==listToClick){
					  
					  $(this).parent().parent().click();
					  }
					 
					 });

if(selectedList().tracks()&&selectedList().tracks()!=''&&selectedList().tracks().length>0){
  selectedList().tracks.push(trackToAdd);
  //console.log('in this list now: ');
  //console.log(selectedList().tracks());
  //console.log(allPlaylists()[0].tracks());
  storageHandler.updateRecords(allPlaylists());
 }
 
else {

 
  selectedList().tracks([]);
  selectedList().tracks.push(trackToAdd);
  storageHandler.updateRecords(allPlaylists());
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
		removeATrack:removeATrack,
		makeActive:makeActive,
		
		removeAllSongs:removeAllSongs,
		askRemoveAllSong:askRemoveAllSong,
		makeDropdownSelection:makeDropdownSelection,
		
		
		
		
		
		
       }


});