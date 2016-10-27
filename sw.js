/**
 * Created by xinnian on 2016/10/26.
 */
"use strict";
var CACHE_DB_NAME = "my-test-cache-v1";
var resourceJSON = ["index.js","test.png"];
importScripts("cacheAddAll.js");
if(typeof self.console == "undefined"){
    self.console = {
        log:function (msg) {

        }
    }
}
self.addEventListener('install', function(event) {


    event.waitUntil(caches.open(CACHE_DB_NAME).then(function(cache) {
        try{
            console.log("run in service worker");
        }catch(e){

        }
        try{
            console.log(cache);
            //应用安装，存储资源
            return cache.addAll(resourceJSON).catch(function (error) {
                console.log("run worker error");
            });
        }catch(e){
            console.log(e);
        }


    }));
});

self.addEventListener('fetch', function (evt) {
    console.log("fetch request",evt.request.url);
    //console.log('h5container.message: {"func":"toast","param":{"content":"Toast SW测试","type":"success","duration":3000},"msgType":"call","clientId":"14774702692090.791196275735274"}');
    evt.respondWith(
        caches.match(evt.request).then(function(response) {

            if (response) {
                response.headers.append("sw-cache","111");
                return response;
            }
            var request = evt.request.clone();
            return fetch(request).then(function (response) {
                console.log(response.headers.get('Content-type'));
                if (!response && response.status !== 200 && !response.headers.get('Content-type').match(/image/)) {
                    return response;
                }
                var responseClone = response.clone();
                caches.open(CACHE_DB_NAME).then(function (cache) {
                    cache.put(evt.request, responseClone).catch(function (error) {
                        console.log("add cache error",responseClone);
                    });
                }).catch(function (error) {
                    console.log("写入缓存错误",error);
                });
                response.headers.append("sw-fetch","111");
                return response;
            }).catch(function(error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
            });
        })
    )
});

self.addEventListener('message', function (event) {
    console.log(event);
    if(event && event.ports[0]){
        event.ports[0].postMessage('h5container.message: {"func":"toast","param":{"content":"Toast SW测试","type":"success","duration":3000},"msgType":"call","clientId":"14774702692090.791196275735274"}')
    }
});


this.addEventListener('activate', function(event) {
    var cacheWhitelist = [CACHE_DB_NAME];

    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
