/**
 * Created by jefferson.wu on 12/1/16.
 */

//private Character Creator Module

/**
 * Module for creating little icon characters.
 * @type {{createChar, syncImgChar}}
 */
var charCreator = (function(){
    return {

        //TODO: figure out why this doesn't work.
        createChar: function(){
            var charDiv = document.getElementsByClassName('characterContainer')[0];
            var svg = document.createElementNS('mySVG','svg');
            svg.id = 'jsLayer';
            svg.classList.add('characterRoot');
            svg.setAttribute ('viewBox', '0 0 350.2 882.3');
            svg.setAttribute('width', '100px');
            svg.setAttribute('height', '30px');

            var circle = document.createElementNS('mySVG','circle');
            circle.id = 'jsHead';
            circle.classList.add('characterHead');
            circle.setAttribute('cx', '175.1');
            circle.setAttribute('cy', '175.1');
            circle.setAttribute('r', '175.1');

            svg.appendChild(circle);
            charDiv.appendChild(svg);

            console.log('character created.');
        },

        /**
         * Synchronize the number of characters.  Currently redraws all chars.
         * @param num Number of characters to draw.
         */
        createImgChar: function(num){
            var charDiv = document.getElementsByClassName('characterContainer')[0];
            charDiv.innerHTML = '';

            for (i = 0; i < num; i++) {
                var img = document.createElement('img');
                img.id = 'aGuy'+num;
                img.src = '/vectors/char.svg';
                img.classList.add('characterRoot');
                img.classList.add('characterRootImgFix');

                charDiv.appendChild(img);
            }
        }

    }

})();