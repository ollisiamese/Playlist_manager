define(['knockout','jquery'],function(ko){

//a Track (song) constructor 

return function track(data){
    
	this.image=data.album.images[2].url;
	this.trackName=data.name;
    this.album=data.album.name;
	this.artist=data.artists[0].name;
    this.duration=Math.floor((data.duration_ms/1000)/60)+':'+Math.round(Math.floor((data.duration_ms/1000-(data.duration_ms/1000)/60))/10);
    this.uri=data.uri;
  }

});