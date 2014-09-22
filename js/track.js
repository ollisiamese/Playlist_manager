// A Track (song) constructor:
define(['knockout','jquery'], function(ko) {
  return function Track(data){    
    if (data.album.images[2]) {
      this.image = data.album.images[2].url;
    } else {
      this.image = "img/No_Image_Available.gif";
    }

    this.trackName = data.name;
    this.album = data.album.name;
    this.artist = data.artists[0].name;
    this.durMs = data.duration_ms;
    
    var totalSeconds = Math.ceil(data.duration_ms / 1000);
    var wholeMinutes = Math.floor(totalSeconds / 60);
    var remainingSeconds = totalSeconds - wholeMinutes * 60;
    if (Math.ceil(remainingSeconds) > 9) {
      this.duration =
        wholeMinutes + ':' +
        Math.ceil(remainingSeconds);
    } else {
      this.duration =
        wholeMinutes + ':0' +
        Math.ceil(remainingSeconds);
    }

    this.uri = data.uri;
  };
});
