/**
 * Created by jefferson.wu on 11/30/16.
 */

var pingerTool = {
    pStartTime: '',
    pEndTime: '',
    pingStart: function(){
        this.pStartTime = Date.now();
    },
    pingEnd: function(){
        this.pEndTime = Date.now();
        console.log('PingerPonger: ' + (this.pEndTime - this.pStartTime) + ' ms');
    }
};
