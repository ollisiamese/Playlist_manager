define(['knockout', 'track', 'jquery'], function(ko, track) {
  var searchResults = ko.observableArray();
  var searchStatus = ko.observable(true);
  var positiveResults = ko.observable(false);
  var searchMsg = ko.observable('');
  var foundTracks = ko.observableArray();
  var displayMore = ko.observable(false);
  var displayPrev = ko.observable(false);
  var totalFound = ko.observable();
  var pageCount = ko.observable(0);
  var subject;
  var filterSelection = ko.observable('trackName');  
  //array to store the autocomplete suggestions obtained via ajax  
  var arw = ko.observableArray();
  var selectedTrack = ko.observable();
  
  filterSelection.subscribe(function() {                
    $('.filterLink').each(function() {
    
      if ($(this).html().toLowerCase().indexOf(filterSelection().slice(0, 3)) > -1) {
        $(this).addClass('activeFilter');
      } else {
        $(this).removeClass('activeFilter');
      }
      
    });
  });

  //SET FILTER
  var setFilter = function(filter) {
    filterSelection(filter.toString()); 
  }

  //SORT THE FOUND TRACKS
  var trackSorter = ko.computed(function() {
    var listToSort = foundTracks();
    var filterCriterion = filterSelection();
    
    if (filterCriterion && filterCriterion == 'trackName') {
      return listToSort.sort(function(a, b) {
        return a.trackName == b.trackName ? 0 : (a.trackName < b.trackName ? -1 : 1);
      });    
    }
    
    if (filterCriterion && filterCriterion == 'artist') {
      return listToSort.sort(function(a, b) {
        return a.artist == b.artist ? 0 : (a.artist < b.artist ? -1 : 1);
      });    
    }  
    
    if (filterCriterion && filterCriterion == 'album') {
      return listToSort.sort(function(a, b) {
        return a.album == b.album ? 0 : (a.album < b.album ? -1 : 1);
      });    
    }
    
    if (filterCriterion && filterCriterion == 'duration') {
      return listToSort.sort(function(a, b) {
        return parseInt(a.durMs, 10) == parseInt(b.durMs, 10) ? 0 : (parseInt(a.durMs, 10) < parseInt(b.durMs, 10) ? -1 : 1);
      });    
    }
    
  });

  //DISPLAY FOUND TRAKCS BY PAGE
  var mapTracks = function(response, query) {
    if(response != '' && response != null && response != undefined) {
      //hide the gif
      searchStatus(true);
      searchResults(response.tracks.items);
      totalFound(response.tracks.total);
      
      if (response.tracks.total > 20) {
        //show the "more pages" button
        displayMore(true); 
        subject = query;
      } else {
        displayMore(false);
      }
      
      //map and display this search results page
      var mappedTracks = $.map(response.tracks.items, function(item) {
        return new track(item);
      });
      
      foundTracks(mappedTracks);
      positiveResults(true);
      
      if (totalFound() == 0) {
        positiveResults(false);
        searchMsg("no tracks were found");
      }
      
    } else {
      searchMsg("no tracks were found");
      positiveResults(false);
    }
  };

  //THE FIRST SEARCH FOR THESE CRITERIA (Called by viewModel)
  var searchTracks = function(query) {
    $('#searchPanel').focus();
    filterSelection('');
    
    if ($('#searchInput' ).data('ui-autocomplete')) {
      //hide autocomplete menu when search starts
      $('#searchInput' ).autocomplete("close"); 
    }
    
    $('#searchInput').blur();
    //reset
    positiveResults(false);
    //hide the gif
    searchStatus(false);
    //reset message box
    searchMsg('');
    displayPrev(false);
    
    //to properly display search status and results, unfold the hidden content
    if ($('.collapse').css('display') == 'none') {
      $('.sres').collapse("show");
    }
    
    $.ajax({
      url: 'https://api.spotify.com/v1/search',
      data: {
        q: query,
        type: 'track,artist,album'
      },                
      success: function(response) {
        //if received response, call the displaying function, passing it the data
        mapTracks(response, query);
        //start off by setting the filter to track name
        filterSelection('trackName'); 
      },
      error: function() {
        searchMsg("no tracks were found");
        positiveResults(false);
      }
    });
    
  }

  //USER CLICKED ON "MORE RESULTS"      
  var displayMoreTracks = function() {
    pageCount(pageCount() + foundTracks().length);
    $('#searchPanel').focus();
    
    $.ajax({
      url: 'https://api.spotify.com/v1/search',
      data: {
        q: subject,                           
        type: 'track,artist,album',
        offset: pageCount(),
        limit: 20
      },
      
      success: function(response) {
        //if received response, call the displaying function, passing it the data
        mapTracks(response, subject); 
        
        //control the display of "More" and "prev" buttons
        if (pageCount() >= 20) {
           //we can go back in the resuls        
          displayPrev(true);            
        } else {
          displayPrev(false);
        }
        
        if ((pageCount() + 20) > totalFound()) {
          // we can go forward in the results
          displayMore(false);
        }
      },
      
      error: function() {
        searchMsg("no tracks were found");
        positiveResults(false);
      }
    });
    
  }      
   
  //USER CLICKED ON "PREVIOUS RESULTS"   
  var displayPrevTracks = function() {
    pageCount(pageCount() - foundTracks().length);
    $('#searchPanel').focus();
    
    $.ajax({
      url: 'https://api.spotify.com/v1/search',
      data: {
        q: subject,
        type: 'track,artist,album',
        offset: pageCount(),
        limit: 20
      },
      
      success: function(response) {
        //if received response, call the displaying function, passing it the data      
        mapTracks(response, subject); 
        
        //control the display of "More" and "prev" buttons
        if(pageCount() >= 20) {
          //we can go back in the resuls       
          displayPrev(true);
        } else {
          displayPrev(false);
        }
        
      },
      
      error: function() {
        searchMsg("no tracks were found");
        positiveResults(false);
      }
    });
    
  }            
   


  //OBTAINING AUTOCOMPLETE SUGGESTIONS VIA AJAX (SPOTIFY SEARCH) AND POPULATING THE 'ARW' ARRAY   
  var autocompleteHelper = function(value) {
    $.ajax({
      url: 'https://api.spotify.com/v1/search',
      data: {
        q: value,
        //searching all types of records
        type: 'track, album, artist', 
        limit: 50         
      },
      
      success: function(response) {
        //found Tracks, Albums, and Artists
        var foundTracks = new Array(response.tracks.items);
        var foundAlbums = new Array(response.albums.items);
        var foundArtists = new Array(response.artists.items);
        
        //add or don't add each found track name (don't add if already in the array)
        if (foundTracks && foundTracks.length > 0) {
          
          for (var i = 0; i < foundTracks.length; i++) {
            
            for (var j = 0; j < foundTracks[i].length; j++) {
              var stringToPush = foundTracks[i][j].name.toString();
              
              if (arw.indexOf(stringToPush) < 0) {
                //only unique values get pushed to the autocomplete list             
                arw.push(stringToPush);
              } else {
                //don't add to the autocomplete
              }
              
            }
            
          }
          
        }
        
        //add or don't add each found Album name (don't add if already in the array)
        if (foundAlbums && foundAlbums.length > 0) {
          
          for (var i = 0; i < foundAlbums.length; i++) {
            
            for (var j = 0; j < foundAlbums[i].length; j++) {
              var stringToPush = foundAlbums[i][j].name.toString();
              
              if (arw.indexOf(stringToPush) < 0) {
                arw.push(stringToPush);
              } else {
                //don't add to the autocomplete
              }
              
            }
          }
          
        }
        
        //add or don't add each found Artist name (don't add if already in the array)
        if (foundArtists && foundArtists.length > 0) {
          
          for (var i = 0; i < foundArtists.length; i++) {
            
            for (var j = 0; j < foundArtists[i].length; j++) {
              var stringToPush = foundArtists[i][j].name.toString();
              
              if (arw.indexOf(stringToPush) < 0) {
                arw.push(stringToPush);
              } else {
                //don't add to the autocomplete
              }
              
            }
          }
          
        }
        
        //Now, after adding all the found items, see where we stand with the 'arw' array
        if (arw().length > 0) {
          //update autocomplete with search results
          $('#searchInput').autocomplete({source:arw(), delay: 0, select: function(event, ui) {
            searchTracks(ui.item.value);
          }});  
          
        } else {
          //no suggestions found, 'arw' is empty this time
        }
      //end of success function
      }
      
    });
  }

  
  //CONTROLS THE DISPLAY OF PLUS OR MINUS SIGN FOR COLLAPSING THE PANELS
  var plusMinusCollapse = function(id) {
  
    if ($('a[id = ' + id + '] span').attr("class").indexOf('plus') > 1) {
      $('a[id = ' + id + '] span').removeClass("glyphicon-plus-sign");
      $('a[id = ' + id + '] span').addClass("glyphicon-minus-sign");
      //go on to the mormal function of showing/hiding content
      return true; 
    
    } else {
      $('a[id='+id+'] span').removeClass("glyphicon-minus-sign");
      $('a[id='+id+'] span').addClass("glyphicon-plus-sign");
      return true;
    }
    
  }     

  

  var setSelectedTrack = function(track) {
    selectedTrack(track);
  }

  return {
    searchTracks: searchTracks,
    searchStatus: searchStatus,
    searchMsg: searchMsg,
    totalFound: totalFound,
    displayMore: displayMore,
    displayPrev: displayPrev,
    positiveResults: positiveResults,
    foundTracks: foundTracks,
    displayMoreTracks: displayMoreTracks,
    displayPrevTracks: displayPrevTracks,
    autocompleteHelper: autocompleteHelper,
    trackSorter: trackSorter,
    setFilter: setFilter,
    plusMinusCollapse: plusMinusCollapse,
    selectedTrack: selectedTrack,
    setSelectedTrack: setSelectedTrack
  }
  
});