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
        url: '/videopromise',
        type:'POST',
        data:{datum: grabbedData.value},
        success: function(data, textStatus, jqXHR){

            //TODO: encapsulate
            var stringData = JSON.stringify(data);
            console.log('data returned from server: ' + stringData);    //DEBUG to console


            console.log(stringData);
            // add to results div
            updateResultDiv(resultDiv, data);

            //put on the veil
            overlayGen.removeWaitOverlay();             // remove the wait overlay
            pingerTool.pingEnd();   //display end       // stop pinger

            console.log(data);      // print raw data (?)

            // ===== CHECK FOR SERVER RETURN STATUS =====
            switch (data.status) {
                case 'completed':

                    // createLoadVideoButton(document.getElementById('debugControlsDiv'), data);

                    // create video instead of button
                    createVideo(document.getElementById('resultDiv'), data);

                    break;
                case 'error':
                    console.log('Server error: ' + data.payload.message);
                    break;
                case 'rejected':
                    console.log('Video creation rejected: ' + data.payload.message);
                    console.log(data.payload);
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

//TODO: CREATE ASYNC VIDEO GENERATION

function createVideoPromise() {
    return new Promise(function(resolve, reject){
        //resolve condition

        //reject condition
    });
}

//TODO: create 140 character limit.


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

        // =============================
        //TODO: MAKE VIDEO FUNCTION ====
        // var video = document.createElement('video');
        // video.id = 'videoElement';
        // video.src = '/videos/' + data.payload.videoUrl;
        //
        // video.setAttribute('autoplay', true);
        //
        // resultDiv.appendChild(video);
        //
        // // if it can play through, start playing.
        // video.addEventListener('canplaythrough', function(e){
        //     this.play();
        // });
        //
        // // when the user clicks, the video will play again if it's stopped.
        // video.addEventListener('click', function(e){
        //     if(this.paused) {
        //         this.play();
        //     }
        // });
        createVideo(document.getElementById('resultDiv'), data);

        //remove button
        this.parentNode.removeChild(this);

        // --- create download button ---
        var dlb = document.createElement('a');
        dlb.href = '/videos/' + data.payload.videoUrl;
        dlb.setAttribute('download', data.payload.videoUrl);    //sets the download file name, can be customized.
        dlb.innerHTML = 'download';
        dlb.classList.add('pull-right');
        resultDiv.appendChild(dlb);

        // MAKE VIDEO FUNCTION ========
        // ============================


    });
}

// create video function,
function createVideo(rDiv, data) {
    var video = document.createElement('video');
    video.id = 'videoElement';
    video.src = '/videos/' + data.payload.videoUrl;

    video.setAttribute('autoplay', true);

    rDiv.appendChild(video);

    video.addEventListener('canplaythrough', function(e){
        this.play();
    });

    video.addEventListener('click', function(e){
        if(this.paused) {
            this.play();
        }
    });
}


/**
 * Custom conditional AJAX method.
 * @returns {*}     Returns a
 */
function getWords() {

    pingerTool.pingStart();

    $.ajax({
        url: '/wordspromise',
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

    //if payload includes a fileArray
    if(data.payload.fileArr) {

        // --- FOR WORD LIST ---
        // grab relevant data
        var wordData = data.payload.fileArr;

        // print AJAX'd data to console
        console.log(wordData);

        // create a button for each of the array
        wordData.forEach(function(elem, ind, arr){

            //var inputWord = elem.split('.').shift();
            var button = document.createElement('button');
            //var buttonText = document.createTextNode(inputWord);
            var buttonText = document.createTextNode(elem);

            button.appendChild(buttonText);
            button.setAttribute('class','btn btn-success');

            button.classList.add('buttonSpace');

            button.addEventListener('click', function(e){
                textInput.value += ' ' + elem.split('.').shift();
            });
            rDiv.appendChild(button);
        });
    }

    else if(data.payload.videoUrl){
        //if there's a videoUrl, hide stuff.
        rDiv.innerHTML = '<br><b>Video created: </b>' + data.payload.videoUrl;
    }

    else {
        //for string data output on rejection
        var found = data.payload.foundWords;
        var notFound = data.payload.notFoundWords;
        var bad = data.payload.badWords;

        rDiv.innerHTML = '<br><p><b>Found:</b> ' + found + '</p> <p><b>Not found: </b>' + notFound + '</p>' + '<p> <b>Bad: </b>' + bad + '</p>';
    }


}

