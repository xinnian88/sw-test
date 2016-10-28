/**
 * Created by xinnian on 2016/10/26.
 */
var el = document.getElementById("logArea");
var intervalID;
function cusLog(msg){
    var sp = document.createElement("p");
    sp.innerHTML = msg;
    el.appendChild(sp);
}

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

function initSW(){
    cusLog(location.origin+'/sw-test/sw.js');
    navigator.serviceWorker.register('/sw-test/sw.js', { scope: '/sw-test/' }).then(function(reg) {
        var state = "default";
        if(reg.installing) {
            state = 'Service worker installing';
        } else if(reg.waiting) {
            state = 'Service worker installed';
            clearInterval(intervalID);
        } else if(reg.active) {
            state = 'Service worker active';
            clearInterval(intervalID);
        }
        cusLog(state);
        sendMessage("make channel").then(function (value) {
            console.log(value);
            cusLog(value);
        }).catch(function (error) {
            console.log(error);
            cusLog("send msg error");
            for(var key in error){
                cusLog(key+":"+error[key]);
            }
        })
        /*setTimeout(function () {
            reg.unregister().then(function(boolean) {
                console.log("unregister",boolean);
                cusLog("unregister:"+boolean);
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


if ('serviceWorker' in navigator) {
    intervalID = setInterval(function () {
        initSW();
    },2*1000);

}else{
    cusLog("不支持service worker");
}

new Worker("/sw-test/worker.js");