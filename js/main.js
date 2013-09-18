$(document).ready(function() {
    var currentHash = "";

    // Method to close the nav menu on smaller screens.
    var closeMenu = function(callback) {
        $('button.nav-toggle').removeClass('expanded');
        $('nav').slideUp(callback);
    };

    // A method to update the height of the main div, in case it isn't tall enough.
    var updateHeight = function() {
        $('.main').css('height', $('.content-tab:visible').outerHeight() + 'px');
    };

    // Handle clicks on the nav menu button on smaller screens.
    $('button.nav-toggle').click(function() {
        // Check if we're already expanded and close / open accordingly.
        if ($(this).hasClass('expanded')) {
            closeMenu();
        } else {
            $(this).addClass('expanded');
            $('nav').slideDown();
        }
    });

    // Handles changing the view for navigation.
    $(window).hashchange(function() {
        var newHash = (location.hash ? location.hash : '#home');
        var $newContent = $(newHash);

        // Log a pageview in Google Analytics.
        ga('send', {
            'hitType': 'pageview',
            'page': '/' + newHash,
            'title': $('nav a.' + newHash.substring(1)).text()
        });

        // Update the navigation menu view with the new selection.
        $('.nav').removeClass('selected')
            .filter('.' + newHash.substring(1))
            .addClass('selected');

        // Check to see if this is the first hash change (i.e., onload),
        // or if it is for some reason not any different...
        // If so, we'll skip fancy animations and such.
        if (currentHash === "" || currentHash === newHash) {
            $(newHash).show();
            currentHash = newHash;
            updateHeight();
            return;
        }

        var slideLeft = true;
        var slideBy = $(document).width();

        // Determine if we are navigating "forward" or "backward."
        if ($newContent.nextAll(currentHash).length !== 0) {
            slideLeft = false;
        }

        // Setup a callback to do the page change.
        var doPageChange = function () {
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
                }, 300, updateHeight);
        };

        // Hide the expanded menu on smaller screens, if it is expanded.
        if ($('button.nav-toggle').hasClass('expanded')) {
            closeMenu(doPageChange);
        } else {
            // No menu to collapse, just do the page change.
            doPageChange();
        }

        // Update the current hash.
        currentHash = newHash;
    });

    // Bind a window resize event to update the main div height if necessary.
    $(window).resize(updateHeight);

    // Trigger the view to update onload, in case there is a hash in the url onload.
    $(window).hashchange();

    // Update the height once the images are loaded, too.
    $(window).on("load", updateHeight);
});
