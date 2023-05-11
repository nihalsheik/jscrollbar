
if(!$j) {
	alert('$j not found');
	window.$j = {};
}

$j.ajaxConfig = {
		
}

$j.ajax = function(url, method = 'GET', data = null, header = {}) {

	var p;
	
	if(typeof(url) != 'object') {
		p = {
            url: url,
            method: method, 
            data: data,
            header: header
		}
	} else {
		p = url;
	}
	
    return new Promise(function (resolve, reject) {
    	const xhr = new XMLHttpRequest();
    	xhr.open(p.method, p.url, true);
    	xhr.setRequestHeader('Content-type', 'application/json');
    	xhr.onload = () => {
        	var data;
        	if(xhr.getResponseHeader('Content-Type') == 'application/json') {
        		data = JSON.parse(xhr.responseText);
        	} else {
        		data = xhr.responseText;
        	}
            if (xhr.status === 200) {
                resolve(data);
            } else {
                reject(data);
            }
        }
        if (p.data) {
        	xhr.send(JSON.stringify(p.data));
        } else {
        	xhr.send();
        }
    });
}
