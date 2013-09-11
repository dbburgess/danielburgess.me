$(document).ready(function() {
    $(window).hashchange(function() {
        var currentHash = location.hash ? location.hash : '#home';

        $('.content-tab').not(currentHash).hide();
        $(currentHash).show();

        $('.nav').removeClass('selected').filter('.' + currentHash.substring(1)).addClass('selected');
    });

    $(window).hashchange();
});
