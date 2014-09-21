// a Playlist constructor
define( ['knockout','jquery'], function(ko) {
  return function playlist(name, tracks) {
    var self = this;
    self.name = ko.observable(name);
    self.tracks = ko.observableArray();
    self.tracks(tracks);
   
    //calculate the length based on the length of all the tracks  
    self.length = ko.computed(function() {
      var totalLength = 0;
      
      //if there are tracks in this list, we are going to calculate
      if (self.tracks() && self.tracks()!= '' && self.tracks() != undefined && self.tracks().length > 0) {
        
        for (var i = 0; i < self.tracks().length; i++) {
          var breakpoint = self.tracks()[i].duration.indexOf(":");
          var mins = parseInt(self.tracks()[i].duration.slice(0, breakpoint), 10);
          var secs = parseInt(self.tracks()[i].duration.slice(breakpoint + 1), 10);
          var totalTime = (mins * 60) + secs;
          totalLength = totalLength + totalTime;
        }
        
        if (Math.round(totalLength - Math.floor(totalLength / 60) * 60) > 9) {
          return Math.floor(totalLength / 60) + " : " + Math.round(totalLength - Math.floor(totalLength / 60) * 60);
        } else {
          return Math.floor(totalLength / 60) + " : 0" + Math.round(totalLength - Math.floor(totalLength / 60) * 60);
        }
      
        return totalDur;
      
      } else{
        //no tracks in this list, length=0     
        return 0;
      }
    });
  
    //generate a src string for the embedded iframe for "Spotify Button" for multiple tracks
    self.iframeSrc = ko.computed(function() {
      var buttonTitle = self.name();
      var source = "https://embed.spotify.com/?uri=spotify:trackset:" + buttonTitle + ":";
    
      //if there are tracks, we will have a Spotify play button
      if (self.tracks() && self.tracks() != '' && self.tracks().length > 0) {
    
        for (var d = 0; d < self.tracks().length; d++) {
          var myUri = self.tracks()[d].uri.slice(14);   
          source = source + myUri + ",";  
        }
      
        var finalSource = source.slice(0, source.length - 1);
        return finalSource;
    
      } else {
        //no tracks - no play button!
        return false;
      }
    });
    
    //a property for setting the name of the playlist via input in the form
    self.editMode = ko.observable(false);  
  }
});