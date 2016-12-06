/**
 * Created by jefferson.wu on 11/29/16.
 */

var overlayGen = {
    createWaitOverlay: function() {
        var containerDiv = document.createElement('div');
        var div = document.createElement('div');

        containerDiv.id = 'overlayWait';

        containerDiv.classList.add('loginAcceptedContainer');
        div.classList.add('loginAcceptedIcon');
        div.innerHTML = 'wait...';

        containerDiv.appendChild(div);
        document.body.appendChild(containerDiv);
    },
    createNamedWaitOverlay: function(msg) {
        var containerDiv = document.createElement('div');
        var div = document.createElement('div');

        containerDiv.id = 'overlayWait';

        containerDiv.classList.add('loginAcceptedContainer');
        div.classList.add('loginAcceptedIcon');
        div.innerHTML = msg;

        containerDiv.appendChild(div);
        document.body.appendChild(containerDiv);
    },

    removeWaitOverlay: function() {
        document.body.removeChild(document.getElementById('overlayWait'));
    }
};
