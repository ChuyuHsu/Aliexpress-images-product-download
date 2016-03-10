import _ from 'lodash';

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
    }
});

function buildFullFileName(productId, filename, i) {
    var extension = filename.split('.').pop(),
        nameOfFile = filename.substr(0, filename.lastIndexOf(extension) - 1);
    return productId + '/' + nameOfFile + '_' + i + '.' + extension;
}