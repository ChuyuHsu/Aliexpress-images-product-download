import _ from 'lodash';
import './index.css';
const ICON_BUTTON_DOWNLOAD_ALL = require('../icons/buttonDownloadAll.png');

$('#img').on('mouseenter', 'a.ui-magnifier-glass', function(e){
    $(this).on('contextMenu', function(){
        if($(e.relatedTarget).is('img')){
            var src = e.relatedTarget.src;
            if(src){
                chrome.runtime.sendMessage({
                    action : 'CONTEXT_MENUS_PER_IMAGE',
                    data : {
                        option : 1,
                        src : src
                    }
                })
            }
        }
    })
})

$('.list-items').on('mouseenter', 'li.list-item', function (e) {
    var container = $(this).find('div.item')[0];
    if (container) {
        var buttonDownloadALl = document.createElement('img');
        buttonDownloadALl.src = ICON_BUTTON_DOWNLOAD_ALL;
        buttonDownloadALl.className = 'buttonDownloadALl';
        var topChildNode = $(container).find('div.img.img-border')[0],
            linkToDetail = $(container).find('a.picRind')[0],
            productId = $(container).find('input.atc-product-id')[0];
        if (topChildNode && linkToDetail && productId) {
            container.insertBefore(buttonDownloadALl, topChildNode);
            $(buttonDownloadALl).on('click', function (e) {
                chrome.runtime.sendMessage({
                    action : 'DOWNLOAD_ALL_IMAGES',
                    data : {
                        href : linkToDetail.href,
                        pId : productId.value
                    }
                })
            })
        }
    }
    $(this).on('mouseleave', function () {
        if (buttonDownloadALl) {
            buttonDownloadALl.remove()
        }
    })
});


