(function($) {
  "use strict"; // Start of use strict

  // Cache DOM elements
  const $body = $('body');
  const $sidebar = $('.sidebar');
  const $contentDiv = $('.container-fluid');
  const $sidebarToggle = $("#sidebarToggle, #sidebarToggleTop");
  const $window = $(window);
  const $scrollToTop = $('.scroll-to-top');

  // Toggle the side navigation
  $sidebarToggle.on('click', function() {
    $body.toggleClass("sidebar-toggled");
    $sidebar.toggleClass("toggled");
    if ($sidebar.hasClass("toggled")) {
      $sidebar.find('.collapse').collapse('hide');
    }
  });

  // Close any open menu accordions when window is resized below 768px
  $window.on('resize', function() {
    if ($window.width() < 768) {
      $sidebar.find('.collapse').collapse('hide');
    }

    // Toggle the side navigation when window is resized below 480px
    if ($window.width() < 480 && !$sidebar.hasClass("toggled")) {
      $body.addClass("sidebar-toggled");
      $sidebar.addClass("toggled");
      $sidebar.find('.collapse').collapse('hide');
    }
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation is hovered over
  $body.filter('.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($window.width() > 768 && e && e.originalEvent) {
      const e0 = e.originalEvent;
      const delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    const scrollDistance = $(this).scrollTop();
    $scrollToTop[scrollDistance > 100 ? 'fadeIn' : 'fadeOut']();
  });

  // Smooth scrolling using jQuery easing
  $scrollToTop.on('click', function(e) {
    e.preventDefault();
    $('html, body').stop().animate({
      scrollTop: $(this.hash).offset().top
    }, 1000, 'easeInOutExpo');
  });

  $(document).ready(function () {
    const loaderOverlay = $('<div id="loader-overlay"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>');

    // Append loader overlay to body
    $body.append(loaderOverlay);

    // Function to show loader
    const showLoader = () => {
      loaderOverlay.show();
    };

    // Function to hide loader
    const hideLoader = () => {
      loaderOverlay.hide();
    };

    // Function to load content
    const loadContent = (url) => {
      showLoader();

      $.ajax({
        url: url,
        method: "GET",
        success: function (data) {
          const newContent = $(`<div>${data}</div>`);
          newContent.find('.collapse').removeClass('collapse');

          // Inject the HTML content first
          $contentDiv.html(newContent.html());

          // Now load and execute scripts from the new content
          newContent.find('script').each(function() {
            const scriptSrc = $(this).attr('src');
            if (scriptSrc) {
              // Load external scripts
              $.getScript(scriptSrc).fail(function(_, __, exception) {
                console.error(`Failed to load script: ${scriptSrc}`, exception);
              });
            } else {
              // Execute inline scripts
              eval($(this).text());
            }
          });

          // Load CSS (if needed)
          if (url.includes('shifts_calendar.html')) {
            $('head').append('<link rel="stylesheet" href="css/shifts_calendar.css" type="text/css" />');
          }

          // Initialize translations for the new content
          applyTranslations();

          hideLoader();
        },
        error: function () {
          $contentDiv.html('<p>Error loading content.</p>');
          hideLoader();
        }
      });
    };

    // Function to update URL without reloading the page
    const updateURL = (page) => {
      const newURL = `${window.location.origin}${window.location.pathname}?page=${page}`;
      window.history.pushState({ path: newURL }, '', newURL);
    };

    // Event listener for sidebar links with class collapse-item and About page link
    $sidebar.find('.collapse-item, .nav-link[href="partials/about.html"]').on('click', function (e) {
      if ($(this).hasClass('group')) {
        return;
      }
      e.preventDefault();
      const url = $(this).attr('href');
      const page = url.split('/').pop().replace('.html', '');
      loadContent(url);
      updateURL(page);
    });

    // Load content based on URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'default';
    loadContent(`partials/${page}.html`);

    // Load translations
    loadTranslations(lang);
  });
})(jQuery); // End of use strict

document.addEventListener("DOMContentLoaded", async function () {
    // Load scripts asynchronously
    const scripts = [
        "js/shifts_calendar.js",
        // Add other scripts here if needed
    ];

    for (const script of scripts) {
        await loadScript(script);
    }

    // Initialize the dashboard
    initializeDashboard();
});

async function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function initializeDashboard() {
    // ...existing code...
}