
var view = {};
var htmlData = '';
var prevUrl;

window.addEventListener('DOMContentLoaded', function () {

    
    $j('html').css('font-size', (16 / 1728 * window.screen.availWidth) + 'px');

    $j('.menu li').on('click', function () {
        page(this.getAttribute('data-url'));
    })


    page('*', function (ctx, params) {
        var url = ctx.canonicalPath || 'home';
        if (url == prevUrl) {
            return;
        }
        
        $j('.menu li').removeClass('menu-selected');
        $j('.menu li[data-url="' + url + '"]').addClass('menu-selected');

        prevUrl = url;
        $j.ajax('./views/' + url + '.html').then(function (content) {
            $j('#content').html(content);
            var name = $j('fn').attr('name');
            $j('fn').remove();
            if (view[name]) {
                view[name]();
            }
        });
    });

    page({
        hashbang: true
    });
});

view.home = function () {
    JScrollBar.init(document.getElementById('home'));
}

view.demo = function () {
    $j.ajax('./views/home.html').then(function (content) {
        htmlData = content;
        updateScrollbar();
    });
}

function updateScrollbar() {
    var conf = {};
    $j('input,select').eachChild(function (e) {
        conf[e.attr('id')] = e.val();
    });
    conf.scrollbarWidth = conf.scrollbarWidth + 'px';
    conf.scrollbarRadius = conf.scrollbarRadius + 'px';
    $j('#demoContent').html(htmlData);
    var ele = document.getElementById('demoContent');
    JScrollBar.init(ele, conf);

    $j('#home').css({left: '10px', top: '10px'});

}
