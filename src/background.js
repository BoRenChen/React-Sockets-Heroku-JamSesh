console.log("ggs");


console.log("Ee");
function yo() {
	alert(hoooo);
}


chrome.tabCapture.capture({
	audio:true, 
	video: false
	)};



chrome.tabs.getSelected(null, function (tab) {
    var video_constraints = {
        mandatory: {
            chromeMediaSource: 'tab'
        }
    };
    var constraints = {
        audio: false,
        video: true,
        videoConstraints: video_constraints
    };
    chrome.tabCapture.capture(constraints, function (stream) {
        // it is a LocalMediaStream object!!
    });
});

