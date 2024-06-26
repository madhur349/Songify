
let currentSong= new Audio();
let songs;
let currfolder;
function formatTime(seconds) {
    // Ensure the input is a positive integer
    seconds = Math.abs(Math.round(seconds));

    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Pad single-digit seconds with a leading zero
    var formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    // Create the formatted time string
    var formattedTime = minutes + ":" + formattedSeconds;

    return formattedTime;
}

    const playMusic=(track, pause=false)=>{
       // let audio= new Audio("/songs/" + track)
       currentSong.src= `/${currfolder}/` + track;
       if(!pause){
        currentSong.play();
        play.src="img/pause.svg"
       }
       
       
       document.querySelector(".songinfo").innerHTML=decodeURI(track)
       document.querySelector(".songtime").innerHTML="00:00/00:00"

       
    }



async function getSongs(folder) {
    
currfolder= folder;
let a=await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response= await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML= response;
    let as = div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }

   

        //Show all the songs in the playlist
        let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0]
        songUL.innerHTML=" "
        for (const song of songs) {
            songUL.innerHTML = songUL.innerHTML +`<li>
            <img src="img/music.svg" class="invert" alt="">
            <div class="info">
              <div class="Song Name">${song.replaceAll("%20"," ").replaceAll("_320(PagalWorld.com.cm).mp3"," ")}</div>
              <div class="Song Artist">Song Artist</div>
            </div>
            <div class="playnow">
              <span>Play Now</span>
              <img src="img/play1.svg" class="invert" alt="">
            </div> </li>`;
        }
    
     //Attach an event listener to each song
     Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            const songName = e.querySelector(".info").firstElementChild.innerHTML;
            console.log("Clicked on:", songName);
            playMusic(songName);
        });
    });
    return songs;
}

async function displayAlbums(){
    let a=await fetch(`http://127.0.0.1:5500/songs/`)
    let response= await a.text();
    let div = document.createElement("div")
    div.innerHTML= response;
    let anchors=div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".cardContainer")
    
     let array= Array.from(anchors)
     for (let index = 0; index < array.length; index++) {
        const element = array[index];
        
     
        let folders=[]
        if(element.href.includes("/songs/")&& !element.href.includes(".htaccess")){
           let folder=element.href.split("/").slice(-2)[1]
           
           let a=await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response= await a.json();
            cardContainer.innerHTML= cardContainer.innerHTML+`<div data-folder="${folder}" class="card">
            <div class="play">
              <img src="img/play.svg" alt="" width="35px" height="35px" />
            </div>
            <img
              src="/songs/${folder}/cover.jpg"
              alt=""
            />
            <h2>${response.title}</h2>
            <p>${response.description}</p>
          </div> `
        }
    }

    //Load the playlist whenever card is clicked

Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
        songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        playMusic(songs[0])
    })
})
}

async function main() {
    
    //GET THE LIST OF ALL SONGS
    await getSongs("songs/cs")
    playMusic(songs[0],true)

    //Displaying albumn
    displayAlbums()

//Attach an event listener to play,next and previous
play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src="img/pause.svg"
    }
    else{
        currentSong.pause()
        play.src="img/play1.svg"
    }
})

//Listen for timeupdate event
currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime,currentSong.duration);
    document.querySelector(".songtime").innerHTML=`
    ${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
    // Assuming currentSong is a reference to your audio or video element
var circleElement = document.querySelector(".circle");

// Assuming you're inside a scope where currentSong is defined
currentSong.addEventListener("timeupdate", function() {
    // Update the position of the "circle" element based on the current time
    circleElement.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
});

document.querySelector(".seekbar").addEventListener("click", e => {
    console.log(e);
    const seekbarWidth = e.target.getBoundingClientRect().width;
    const clickPosition = e.offsetX;
    
    // Update the position of the "circle" element
    document.querySelector(".circle").style.left = (clickPosition / seekbarWidth) * 100 + "%";
    
    // Calculate and set the playback time of currentSong
    const newPlaybackTime = (currentSong.duration) * (clickPosition / seekbarWidth);
    currentSong.currentTime = newPlaybackTime;
});      
})

//Add an event listener for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
    
    document.querySelector(".left").style.left= "0%";
})

//Add an event listener for close
document.querySelector(".close").addEventListener("click",()=>{
    
    document.querySelector(".left").style.left= "-110%";
})

//Add an event listener to previous and next
previous.addEventListener("click",()=>{
    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
    if((index-1) >=0 ){
     playMusic(songs[index-1])
    }
     
 })
   
    


next.addEventListener("click",()=>{
    currentSong.pause()
   
    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
   if((index+1) < songs.length){
    playMusic(songs[index+1])
   }
    
})



// Add event listener for the input event to detect changes in the volume range
document.getElementById("volume").addEventListener("input", function() {
    // Get the volume value from the range input (value is between 0 and 100)
    const volumeValue = parseInt(this.value) / 100;
    
    // Set the volume of the audio element to the calculated volume value
    currentSong.volume = volumeValue;
});

// Add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click",e=>{
  if(e.target.src.includes("img/volume.svg")){
    e.target.src=e.target.src.replace("img/volume.svg","img/mute.svg")
    currentSong.volume=0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0
  }
  else{
    currentSong.volume=0.5
    e.target.src=e.target.src.replace("img/mute.svg","img/volume.svg")
    document.querySelector(".range").getElementsByTagName("input")[0].value = 10
  }
})
}
main()
