onmessage = function(e){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status === 200){
            var htmlData = request.responseText.replace(/(?:\r\n|\r|\n)/g, '');;
            var test = htmlData.match(/imageBigViewURL\=\[(.*)\]\;window/);
            if(test && test.length > 1){
                var images = test[1].toString().replace(/(?:\")/g, '').split(',');
                postMessage(images);
            }else{
                postMessage(htmlData);
            }
        }
    }
    request.open('GET', e.data);
    request.send();
}