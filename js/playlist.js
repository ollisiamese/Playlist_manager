define(['knockout','jquery'],function(ko){

return function playlist(name,tracks,length){
 	
	this.name=ko.observable(name);
	this.tracks=ko.observableArray();
	this.tracks(tracks);
    this.length=length;
    this.editMode=ko.observable(false);
	
	
   }


});