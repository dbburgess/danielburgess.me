$(document).ready(function() {
    $(window).hashchange(function() {
        var currentHash = location.hash ? location.hash : '#home';

        $('.content-tab').not(currentHash).hide();
        $(currentHash).show();
    });

    $(window).hashchange();
});
