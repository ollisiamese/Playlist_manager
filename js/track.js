define(['knockout','jquery'],function(ko){

return function track(data){
    //display
	this.image=data.album.images[2].url;
	this.trackName=data.name;
    this.album=data.album.name;
	this.artist=data.artists[0].name;
    this.duration=Math.floor((data.duration_ms/1000)/60)+':'+Math.round(Math.floor((data.duration_ms/1000-(data.duration_ms/1000)/60))/10);
    
	//stats
	this.popularity=data.popularity;
    this.toPlay=data.external_urls.spotify;

  }

});