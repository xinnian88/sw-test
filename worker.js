/**
 * Created by xinnian on 2016/10/26.
 */
var self  = this;
if(typeof self.console == "undefined"){
    self.console = {
        log:function (msg) {

        }
    }
}
console.log("run in worker");
//console.log('h5container.message: {"func":"toast","param":{"content":"Toast测试","type":"success","duration":3000},"msgType":"call","clientId":"14774702692090.791196275735274"}');
