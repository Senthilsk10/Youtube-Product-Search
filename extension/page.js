'use strict';

var activePBRButton;
var screenshotKey = false;
var playbackSpeedButtons = false;
var screenshotFunctionality = 0;
var screenshotFormat = "png";
var extension = 'png';
var isAppended = false;

function CaptureScreenshot() {
    var appendixTitle = "screenshot." + extension;
    var title;
    var headerEls = document.querySelectorAll("h1.title.ytd-video-primary-info-renderer");

    function SetTitle() {
        if (headerEls.length > 0) {
            title = headerEls[0].innerText.trim();
            return true;
        } else {
            return false;
        }
    }

    if (SetTitle() == false) {
        headerEls = document.querySelectorAll("h1.watch-title-container");
        if (SetTitle() == false)
            title = '';
    }

    var player = document.getElementsByClassName("video-stream")[0];
    var time = player.currentTime;
    title += " ";

    let minutes = Math.floor(time / 60);
    time = Math.floor(time - (minutes * 60));

    if (minutes > 60) {
        let hours = Math.floor(minutes / 60);
        minutes -= hours * 60;
        title += hours + "-";
    }

    title += minutes + "-" + time;
    title += " " + appendixTitle;

    var canvas = document.createElement("canvas");
    canvas.width = player.videoWidth;
    canvas.height = player.videoHeight;
    canvas.getContext('2d').drawImage(player, 0, 0, canvas.width, canvas.height);

    // Convert canvas to Blob and send to server
    canvas.toBlob(function (blob) {
        var formData = new FormData();
        formData.append("file", blob, new Date().getTime()+".png");

        fetch("http://127.0.0.1:5000/upload", {  // Replace with your server URL
            method: "POST",
            body: formData
        }).then(response => response.json())
          .then(data => console.log("Upload success:", data))
          .catch(error => console.error("Upload error:", error));
    }, 'image/' + screenshotFormat);
}


function AddScreenshotButton() {
	var ytpRightControls = document.getElementsByClassName("ytp-right-controls")[0];
	if (!ytpRightControls) {
		isAppended = false;
		return;
	}

	ytpRightControls.prepend(screenshotButton);
	isAppended = true;

	chrome.storage.sync.get('playbackSpeedButtons', function(result) {
		if (result.playbackSpeedButtons) {
			ytpRightControls.prepend(speed3xButton);
			ytpRightControls.prepend(speed25xButton);
			ytpRightControls.prepend(speed2xButton);
			ytpRightControls.prepend(speed15xButton);
			ytpRightControls.prepend(speed1xButton);

			var playbackRate = document.getElementsByTagName('video')[0].playbackRate;
			switch (playbackRate) {
				case 1:
					speed1xButton.classList.add('SYTactive');
					activePBRButton = speed1xButton;
					break;
				case 2:
					speed2xButton.classList.add('SYTactive');
					activePBRButton = speed2xButton;
					break;
				case 2.5:
					speed25xButton.classList.add('SYTactive');
					activePBRButton = speed25xButton;
					break;
				case 3:
					speed3xButton.classList.add('SYTactive');
					activePBRButton = speed3xButton;
					break;
			}
		}
	});
}

var screenshotButton = document.createElement("button");
screenshotButton.className = "screenshotButton ytp-button";
screenshotButton.style.width = "auto";
screenshotButton.innerHTML = "Search";
screenshotButton.style.cssFloat = "left";
screenshotButton.onclick = CaptureScreenshot;

var speed1xButton = document.createElement("button");
speed1xButton.className = "ytp-button SYText";
speed1xButton.innerHTML = "1×";
speed1xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 1;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

var speed15xButton = document.createElement("button");
speed15xButton.className = "ytp-button SYText";
speed15xButton.innerHTML = "1.5×";
speed15xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 1.5;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

var speed2xButton = document.createElement("button");
speed2xButton.className = "ytp-button SYText";
speed2xButton.innerHTML = "2×";
speed2xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 2;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

var speed25xButton = document.createElement("button");
speed25xButton.className = "ytp-button SYText";
speed25xButton.innerHTML = "2.5×";
speed25xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 2.5;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

var speed3xButton = document.createElement("button");
speed3xButton.className = "ytp-button SYText";
speed3xButton.innerHTML = "3×";
speed3xButton.onclick = function() {
	document.getElementsByTagName('video')[0].playbackRate = 3;
	activePBRButton.classList.remove('SYTactive');
	this.classList.add('SYTactive');
	activePBRButton = this;
};

activePBRButton = speed1xButton;

chrome.storage.sync.get(['screenshotKey', 'playbackSpeedButtons', 'screenshotFunctionality', 'screenshotFileFormat'], function(result) {
	screenshotKey = result.screenshotKey;
	playbackSpeedButtons = result.playbackSpeedButtons;
	if (result.screenshotFileFormat === undefined) {
		screenshotFormat = 'png'
	} else {
		screenshotFormat = result.screenshotFileFormat
	}

	if (result.screenshotFunctionality === undefined) {
		screenshotFunctionality = 0;
	} else {
		screenshotFunctionality = result.screenshotFunctionality;
	}

	if (screenshotFormat === 'jpeg') {
		extension = 'jpg';
	} else {
		extension = screenshotFormat;
	}
});

document.addEventListener('keydown', function(e) {
	if (document.activeElement.contentEditable === 'true' || document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.contentEditable === 'plaintext')
		return true;

	if (playbackSpeedButtons) {
		switch (e.key) {
			case 'q':
				speed1xButton.click();
				e.preventDefault();
				return false;
			case 's':
				speed15xButton.click();
				e.preventDefault();
				return false;
			case 'w':
				speed2xButton.click();
				e.preventDefault();
				return false;
			case 'e':
				speed25xButton.click();
				e.preventDefault();
				return false;
			case 'r':
				speed3xButton.click();
				e.preventDefault();
				return false;
		}
	}

	if (screenshotKey && e.key === 'p') {
		CaptureScreenshot();
		e.preventDefault();
		return false;
	}
});

AddScreenshotButton();

function onDomChange(mutationsList, observer) {
	let run = false;
	for (let mutation of mutationsList) {
		if (mutation.type === 'childList') {
			run = true;
		}
	}

	if (run) {
		let ytpRightControls = document.getElementsByClassName("ytp-right-controls")[0];
		if (ytpRightControls && isAppended === false) {
			AddScreenshotButton();
		}
	}
}

const observer = new MutationObserver(onDomChange);

observer.observe(document.body, {
	childList: true,
	subtree: true
});
