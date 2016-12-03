/**
 * Created by jefferson.wu on 12/2/16.
 */

// grab all elements
var socket = io();                                                  //socket.io, initiated!
var resultDiv = document.getElementById('resultDiv');               //DEBUG multipurpose stage.
var form = document.getElementById('main-form');                    //main submit form, may use a custom textbox instead.
var wordListButton = document.getElementById('wordListButton');     //gets word list from server, make auto.
var textInput = document.getElementById('input-text');              //main form input field
var userCountIndicator = document.getElementById('userCount');      //socket.io user counter area



// =========================
// EVENT LISTENERS =========
// =========================

// startup
window.addEventListener('load', function(e){
    console.log('Ready to make America great again.');
    //charCreator.createChar();
    //charCreator.createImgChar(0);
});

// clicking elsewhere
window.addEventListener('blur', function(e){
    document.title = 'Hey come back!';
});

// back to page
window.addEventListener('focus', function(e){
    document.title = 'trump with love';
});

// ============ socket.io =============
socket.on('userCount', function(msg){
    if (msg <= 1) {
        charCreator.createImgChar(msg);
        userCountIndicator.innerHTML = msg + ' user online (you)';
    } else {
        charCreator.createImgChar(msg);
        userCountIndicator.innerHTML = msg + ' users online';
    }
});

// ============ MAIN FORM SUBMISSION ============
form.addEventListener('submit', function(e){
    overlayGen.createWaitOverlay();             // create wait overlay
    pingerTool.pingStart();                     // start pinger
    e.preventDefault();                         // prevent page refresh

    var grabbedData = document.getElementById('input-text');    //input-text data

    // TODO: clean up into an TWL client side API.
    //AJAX call to API
    $.ajax({
        url: '/video',
        type:'POST',
        data:{datum: grabbedData.value},
        success: function(data, textStatus, jqXHR){

            //TODO: encapsulate
            var stringData = JSON.stringify(data);
            console.log('data returned from server: ' + stringData);    //DEBUG to console

            // add to results div
            resultDiv.innerHTML = stringData;

            //put on the veil
            overlayGen.removeWaitOverlay();             // remove the wait overlay
            pingerTool.pingEnd();   //display end       // stop pinger

            console.log(data);      // print raw data (?)

            // ===== CHECK FOR SERVER RETURN STATUS =====
            switch (data.status) {
                case 'completed':
                    createLoadVideoButton(document.getElementById('debugControlsDiv'), data);
                    break;
                case 'failed':
                    console.log('Video creation failed on the server.');
                    break;
                case 'rejected':
                    console.log('Video creation rejected, not all words available.');
                    console.log('Found Words: ' + data.payload.foundWords);
                    console.log('Rejected words: ' + data.payload.rejectedWords);
                    break;
                default: console.log("from server: " + data.payload);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Horrible AJAX error occurred: ' + textStatus);
            resultDiv.innerHTML = 'Horrible AJAX error occurred: ' + textStatus;
        }
    });
    grabbedData.value = '';     // reset text input field.
});



//grab word list
wordListButton.addEventListener('click', function(e){
    resultDiv.innerHTML = '';           // clear anything in the result div
    overlayGen.createWaitOverlay();     // create wait overlay
    getWords();                         // get available words from server
});





// =========================
// FUNCTION DEFINITIONS ====
// =========================

/**
 * Creates a video button, that creates a video element. (will be removed)
 * @param targetDiv Where to append the video element.
 * @param data Data to ingest.
 */
function createLoadVideoButton(targetDiv, data){

    // create button
    var loadVideoButton = document.createElement('button');
    loadVideoButton.id = 'loadVideoButton';

    var loadVideoButtonText = document.createTextNode('Load Video');
    loadVideoButton.appendChild(loadVideoButtonText);

    loadVideoButton.classList.add('btn');
    loadVideoButton.classList.add('btn-success');

    targetDiv.appendChild(loadVideoButton);

    // add events
    loadVideoButton.addEventListener('click', function(e){

        //TODO: make a function.
        var video = document.createElement('video');
        video.id = 'videoElement';
        video.src = '/videos/' + data.payload.videoUrl;

        video.setAttribute('preload', true);
        video.setAttribute('autoplay', true);
        video.setAttribute('controls', true);

        //video.setAttribute('muted', true);    //for mobile auto play, but audio won't play regardless.

        resultDiv.appendChild(video);

        // if it can play through, start playing.
        video.addEventListener('canplaythrough', function(e){
            this.play();
        });

        // when the user clicks, the video will play again if it's stopped.
        video.addEventListener('click', function(e){
            if(this.paused) {
                this.play();
            }
        });

        //remove button
        this.parentNode.removeChild(this);

    });
}

/**
 * Custom conditional AJAX method.
 * @returns {*}     Returns a
 */
function getWords() {

    pingerTool.pingStart();

    $.ajax({
        url: '/words',
        type: 'GET',
        success: function(data, status, jqXHR){

            updateResultDiv(resultDiv, data);
            //console.log(data);

            overlayGen.removeWaitOverlay();
            pingerTool.pingEnd();
        },
        error: function(jqXHR, status, error){
            console.log('Horrible AJAX error occurred: ' + status);

            overlayGen.removeWaitOverlay();
            pingerTool.pingEnd();
        }
    });
}

/**
 * Updates the results div.
 * @param rDiv  result div object.
 * @param data  data to pass in.
 */
function updateResultDiv(rDiv, data){

    // parse AJAX'd data
    var parsedData = JSON.parse(data);

    // print AJAX'd data to console
    console.log(parsedData);

    // create a button for each of the array
    parsedData.forEach(function(elem, ind, arr){

        var inputWord = elem.split('.').shift();

        var button = document.createElement('button');
        var buttonText = document.createTextNode(inputWord);

        button.appendChild(buttonText);
        button.setAttribute('class','btn btn-success');

        button.classList.add('buttonSpace');

        button.addEventListener('click', function(e){
            textInput.value += ' ' + elem.split('.').shift();
        });
        rDiv.appendChild(button);
    });
}




//ref:  <circle id="HEAD" class="characterHead" cx="175.1" cy="175.1" r="175.1"/>

