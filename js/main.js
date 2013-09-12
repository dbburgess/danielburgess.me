$(document).ready(function() {
    var currentHash = "";

    // Handles changing the view for navigation.
    $(window).hashchange(function() {
        var newHash = (location.hash ? location.hash : '#home');
        var $newContent = $(newHash);

        // Update the navigation menu view with the new selection.
        $('.nav').removeClass('selected')
            .filter('.' + newHash.substring(1))
            .addClass('selected');

        // Check to see if this is the first hash change (i.e., onload).
        // If so, we'll skip fancy animations and such.
        if (currentHash === "") {
            $(newHash).show();
            currentHash = newHash;
            return;
        }

        var slideLeft = true;
        var slideBy = $(document).width();

        // Determine if we are navigating "forward" or "backward."
        if ($newContent.nextAll(currentHash).length !== 0) {
            slideLeft = false;
        }

        // Animate the current view off screen.
        $('.content-tab:visible').not(newHash)
            .animate({
                "left" : (slideLeft ? "-" + slideBy : slideBy) + 'px'
            }, 300, function() {
                $(this).hide();
            }
        );

        // Animate the new view on screen.
        $newContent.css('left', (slideLeft ? slideBy : "-" + slideBy) + 'px')
            .show()
            .animate({
                "left" : 0
        }, 300);

        // Update the current hash.
        currentHash = newHash;
    });

    // Trigger the view to update onload, in case there is a hash in the url onload.
    $(window).hashchange();
});
