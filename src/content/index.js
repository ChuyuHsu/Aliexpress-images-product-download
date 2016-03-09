import _ from 'lodash';
import './index.css';
const ICON_BUTTON_DOWNLOAD_ALL = require('../icons/buttonDownloadAll.png');

$('#list-items').on('mouseenter', 'li.list-item', function (e) {
    var container = $(this).find('div.item')[0];
    if (container) {
        var buttonDownloadALl = document.createElement('img');
        buttonDownloadALl.src = ICON_BUTTON_DOWNLOAD_ALL;
        buttonDownloadALl.className = 'buttonDownloadALl';
        var topChildNode = $(container).find('div.img.img-border')[0];
        if(topChildNode){
            container.insertBefore(buttonDownloadALl, topChildNode);
        }
    }
    $(this).on('mouseleave', function () {
        if(buttonDownloadALl){
            buttonDownloadALl.remove()
        }
    })
})
