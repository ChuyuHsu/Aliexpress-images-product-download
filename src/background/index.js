import _ from 'lodash';

const _AnalyticsCode = 'UA-74453743-2';
let service, tracker;

var importScript = (function (oHead) {
    //window.analytics = analytics;
    function loadError(oError) {
        throw new URIError("The script " + oError.target.src + " is not accessible.");
    }

    return function (sSrc, fOnload) {
        var oScript = document.createElement("script");
        oScript.type = "text\/javascript";
        oScript.onerror = loadError;
        if (fOnload) {
            oScript.onload = fOnload;
        }
        oHead.appendChild(oScript);
        oScript.src = sSrc;
    }

})(document.head || document.getElementsByTagName("head")[0]);

importScript(chrome.runtime.getURL('shared/google-analytics-bundle.js'), function () {
    console.info('google analytics platform loaded...');
    service = analytics.getService('aliexpress_product_images_downloader');
    tracker = service.getTracker(_AnalyticsCode);
});

chrome.runtime.onMessage.addListener(function (msg, sender) {
    if (!msg.action) return;

    switch (msg.action) {
        case 'CONTEXT_MENUS_PER_IMAGE':
            chrome.contextMenus.removeAll();
            if (msg.data && msg.data.option === 1) {
                chrome.contextMenus.create({
                    id: 'SAVE_IMAGE_AS',
                    title: 'Save image as...'
                });
            }
            break;
        case 'DOWNLOAD_ALL_IMAGES':
            var myWorker = new Worker(chrome.runtime.getURL('shared/worker.js'));
            myWorker.onmessage = function (e) {
                var i = 0;
                _.each(e.data, function (img) {
                    ++i;
                    var filename = img.split('/').pop(),
                        fullPath = buildFullFileName(msg.data.pId, filename, i);
                    chrome.downloads.download({
                        url: img,
                        filename: fullPath
                    })
                });

            }
            myWorker.postMessage(msg.data.href);
            break;
        case 'VIEW_PAGE':
            if(tracker) tracker.sendAppView('App view');
            break;
    }
});

function buildFullFileName(productId, filename, i) {
    var extension = filename.split('.').pop(),
        nameOfFile = filename.substr(0, filename.lastIndexOf(extension) - 1);
    return productId + '/' + nameOfFile + '_' + i + '.' + extension;
}