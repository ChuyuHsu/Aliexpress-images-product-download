import _ from 'lodash';

chrome.runtime.onMessage.addListener(function (msg, sender) {
    if (!msg.action) return;

    switch(msg.action){
        case 'CONTEXT_MENUS_PER_PRODUCT':
            chrome.contextMenus.removeAll();
            if(msg.data && msg.data === 1){
                chrome.contextMenus.create({
                    id : 'DOWNLOAD_ALL_IMAGES',
                    title : 'Download all images'
                });
            }
            break;
    }
})