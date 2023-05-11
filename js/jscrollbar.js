function JScrollBar(element, conf) {

	var scrollBar, scrollTrack, content, scrollRatio, prevY;

	conf = Object.assign({
		showScrolltrack: false,
        scrolltrackColor: '#f0f0f0',
		scrollbarWidth: '7px',
		scrollbarColor: '#78b6ff',
		scrollbarRadius: '4px',
        scrollbarPosition: 'right',
        scrollbarActiveOpacity: 1.0,
        scrollbarInactiveOpacity: 0.4,
        scrollbarBorderColor: '#999999'
	}, conf);

	conf.showScrolltrack = conf.showScrolltrack == 'true' || conf.showScrolltrack == true;
	
	this.refresh = function () {
		moveBar();
	}

	function moveBar() {
		let sh = content.scrollHeight;
		scrollRatio = content.clientHeight / sh;

		//run(function () {

		if (scrollRatio >= 1) {
			showScrollBar(false);
			return;
		}

		showScrollBar(true);
		scrollBar.style.height = Math.max(scrollRatio * 100, 0) + '%';
		scrollBar.style.top = content.scrollTop / sh * 100 + '%'

		//});
	}

	function run(cb) {
		return setTimeout(cb, 100);
	}

	function showScrollBar(flag) {
		flag = flag == true ? 'block' : 'none';
		scrollBar.style.display = flag;
		if(scrollTrack) {
			scrollTrack.style.display = flag;
		}
	}

	function dragBar(e) {
		content.scrollTop += (e.pageY - prevY) / scrollRatio;
		prevY = e.pageY;
		//		run(() => content.scrollTop += delta / scrollRatio);
	}

	function dragStop() {
		scrollBar.classList.remove('js-grabbed');
		//document.body.classList.remove('js-grabbed');
		document.removeEventListener('mousemove', dragBar);
		document.removeEventListener('mouseup', dragStop);
	}

	function renderUI() {
		element.classList.add('js-container');

		content = document.createElement('div');
		content.setAttribute('class', 'js-content');

		while (element.firstChild) {
			content.appendChild(element.firstChild);
		}

		element.appendChild(content);

		scrollBar = document.createElement('div');
		scrollBar.setAttribute('class', 'js-scroll');

		scrollBar.style.width = conf.scrollbarWidth;
		scrollBar.style.backgroundColor = conf.scrollbarColor;
		scrollBar.style.borderRadius = conf.scrollbarRadius;
        scrollBar.style.opacity = conf.scrollbarInactiveOpacity;
        scrollBar.style.border = '1px solid ' + conf.scrollbarBorderColor;

        if(conf.scrollbarPosition == 'right') {
            scrollBar.style.right = '0px';
        } else if(conf.scrollbarPosition == 'left') {
            scrollBar.style.left = '0px';
        }

		element.appendChild(scrollBar);

		if(conf.showScrolltrack) {
			scrollTrack = document.createElement('div');
			scrollTrack.setAttribute('class', 'js-scroll-track');
			scrollTrack.style.width = conf.scrollbarWidth;
            scrollTrack.style.backgroundColor = conf.scrolltrackColor;
            if(conf.scrollbarPosition == 'right') {
                scrollTrack.style.right = '0px';
            } else if(conf.scrollbarPosition == 'left') {
                scrollTrack.style.left = '0px';
            }
			element.appendChild(scrollTrack);
		}
	}

	function configureEvent() {

		scrollBar.addEventListener('mousedown', function (e) {
			e.preventDefault();
			prevY = e.pageY;
			scrollBar.classList.add('js-grabbed');
			//document.body.classList.add('js-grabbed');
			document.addEventListener('mousemove', dragBar);
			document.addEventListener('mouseup', dragStop);
			return false;
		});

//		window.addEventListener('resize', moveBar);
		
		content.addEventListener('scroll', moveBar);
		content.addEventListener('mouseenter', function(){
            scrollBar.style.opacity = conf.scrollbarActiveOpacity;
            moveBar();
        });
		content.addEventListener('DOMSubtreeModified', moveBar);
        content.addEventListener('mouseleave', function(){
            scrollBar.style.opacity = conf.scrollbarInactiveOpacity;
        })
	}

	renderUI();
	configureEvent();
	run(moveBar);

}

JScrollBar.init = function(ele, conf) {
    new JScrollBar(ele, conf);
}

JScrollBar.initAll = function(conf) {
}
