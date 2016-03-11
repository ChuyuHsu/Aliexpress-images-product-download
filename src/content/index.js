import _ from 'lodash';
import './index.css';
const ICON_BUTTON_DOWNLOAD_ALL = require('../icons/buttonDownloadAll.png');

$('#img').on('mouseenter', 'a.ui-magnifier-glass', function (e) {
    $(this).on('contextMenu', function () {
        if ($(e.relatedTarget).is('img')) {
            var src = e.relatedTarget.src;
            if (src) {
                chrome.runtime.sendMessage({
                    action: 'CONTEXT_MENUS_PER_IMAGE',
                    data: {
                        option: 1,
                        src: src
                    }
                })
            }
        }
    })
});

var detailProductRegex = /www\.aliexpress\.com\/item/g;

if (window.location.href.match(detailProductRegex)) {
    var h1 = $('h1.product-name')[0];
    var productId = window.location.href.split('/').pop().match(/(.*)\.html/)[1] || $('#hid-product-id')[0];
    if(h1 && productId){
        var buttonDownloadAll = buildDownloadAllButton(productId.value, window.location.href, 'buttonDownloadALl_detail');
        var span = document.createElement('span');
        span.appendChild(buttonDownloadAll);
        h1.parentNode.insertBefore(span, h1.nextSibling);
    }
}

$('.list-items, .items-list, #list-items, .list-box, #p4p-ul-content, #bestselling-top10, .items, .ui-box-body').on('mouseenter', '.item, .img-box-wrap,li.top10-item, .img-container, .ui-product-listitem', function (e) {
    var container = this;
    var buttonDownloadALl = null;
    //console.log($(this))
    if (container) {
        var topChildNode = $(container).find('div.img, .img-box,.img-wrap,.ui-product-listitem-thumb')[0],
            linkToDetail = $(container).find("a")[0],
            productId = linkToDetail.href.split('/').pop().match(/(.*)\.html/)[1];
        console.log(topChildNode, linkToDetail, productId);
        if (topChildNode && linkToDetail && productId) {
            buttonDownloadALl = buildDownloadAllButton(productId, linkToDetail.href, 'buttonDownloadALl');
            container.insertBefore(buttonDownloadALl, topChildNode);
        }
    }
    $(this).on('mouseleave', function () {
        if (buttonDownloadALl) {
            buttonDownloadALl.remove()
        }
    })
});

function buildDownloadAllButton(productId, href, className) {
    var className = className || '';
    var buttonDownloadALl = document.createElement('img');
    buttonDownloadALl.src = ICON_BUTTON_DOWNLOAD_ALL;
    buttonDownloadALl.className = className;
    $(buttonDownloadALl).on('click', function (e) {
        chrome.runtime.sendMessage({
            action: 'DOWNLOAD_ALL_IMAGES',
            data: {
                href: href,
                pId: productId
            }
        })
    });
    return buttonDownloadALl;
}


