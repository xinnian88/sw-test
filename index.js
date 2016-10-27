/**
 * Created by xinnian on 2016/10/26.
 */
var el = document.getElementById("logArea");
function cusLog(msg){
    var sp = document.createElement("p");
    sp.innerHTML = msg;
    el.appendChild(sp);
}
if ('serviceWorker' in navigator) {
    function sendMessage(message) {
        return new Promise(function(resolve, reject) {
            var messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = function(event) {
                if (event.data.error) {
                    reject(event.data.error);
                } else {
                    resolve(event.data);
                }
            };
            if(navigator.serviceWorker.controller){
                navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
            }

        });
    }
    cusLog(location.origin+'/sw.js');
    navigator.serviceWorker.register('/sw-test/sw.js', { scope: '/sw-test/' }).then(function(reg) {
        var state = "default";
        if(reg.installing) {
            state = 'Service worker installing';
        } else if(reg.waiting) {
            state = 'Service worker installed';
        } else if(reg.active) {
            state = 'Service worker active';
        }
        cusLog(state);
        /*sendMessage("make channel").then(function (value) {
            console.log(value);
        }).catch(function (error) {
            console.log(error);
        })
        setTimeout(function () {
            reg.unregister().then(function(boolean) {
                console.log("unregister",boolean);
            });
        },5*1000);*/

    }).catch(function(error) {
        // registration failed
        console.log('Registration failed with ', error);
        cusLog('Registration failed with '+error.message);
        for(var key in error){
            cusLog(key+":"+error[key]);
        }
    });
}

new Worker("/sw-test/worker.js");