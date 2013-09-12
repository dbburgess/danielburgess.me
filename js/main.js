$(document).ready(function() {
    // Handles changing the view for navigation.
    $(window).hashchange(function() {
        var newHash = location.hash ? location.hash : '#home';

        $('.content-tab').not(newHash).hide();
        $(newHash).show();

        $('.nav').removeClass('selected').filter('.' + newHash.substring(1)).addClass('selected');
    });

    // Trigger the view to update onload, in case there is a hash in the url onload.
    $(window).hashchange();
});
