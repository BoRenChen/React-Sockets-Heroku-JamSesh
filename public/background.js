console.log("ggs");



function yoo() {
	alert("hoooo");
}


// chrome.tabCapture.capture({
// 	audio:true, 
// 	video: false
// 	});


chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  
});


chrome.tabs.getSelected(null, function (tab) {
    var video_constraints = {
        mandatory: {
            chromeMediaSource: 'tab'
        }
    };
    var constraints = {
        audio: true,
        video: false
    };
   
});