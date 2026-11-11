/*
 * Site behaviour, plain JavaScript (no jQuery or plugins needed).
 *
 *   initMobileMenu   – burger button + off-canvas copy of the page menu
 *   initReveal       – fade elements with .reveal in as they scroll into view
 *   initCarousels    – arrows and dots for .carousel image strips
 *   initBackToTop    – show the "back to top" button after scrolling
 *   initSortableTables – click a header of .data-table[data-sortable] to sort
 */
(function () {
  "use strict";

  function initMobileMenu() {
    var page = document.querySelector(".page");
    var menu = document.querySelector(".nav-menu");
    if (!page || !menu) return;

    var toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<i></i>";

    var offcanvas = document.createElement("div");
    offcanvas.id = "offcanvas";
    offcanvas.appendChild(menu.cloneNode(true));

    page.prepend(offcanvas);
    page.prepend(toggle);

    // Each sub-menu gets its own expand/collapse button.
    offcanvas.querySelectorAll(".has-dropdown").forEach(function (item) {
      var button = document.createElement("button");
      button.className = "submenu-toggle";
      button.type = "button";
      button.setAttribute("aria-label", "Show sub-menu");
      button.addEventListener("click", function () {
        item.classList.toggle("open");
      });
      item.insertBefore(button, item.querySelector(".dropdown"));
    });

    function setOpen(open) {
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      setOpen(!document.body.classList.contains("menu-open"));
    });

    // Close when clicking outside the menu or when the window is resized.
    document.addEventListener("click", function (event) {
      if (!offcanvas.contains(event.target)) setOpen(false);
    });
    window.addEventListener("resize", function () {
      setOpen(false);
    });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("revealed"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      // Items that appear together are revealed one after another.
      var visible = entries.filter(function (entry) { return entry.isIntersecting; });
      visible.forEach(function (entry, index) {
        observer.unobserve(entry.target);
        setTimeout(function () {
          entry.target.classList.add("revealed");
        }, index * 200);
      });
    }, { rootMargin: "0px 0px -15% 0px" });

    items.forEach(function (el) { observer.observe(el); });
  }

  function initCarousels() {
    document.querySelectorAll(".carousel").forEach(function (carousel) {
      var track = carousel.querySelector(".carousel-track");
      var items = track.children;
      if (!items.length) return;

      function itemsPerView() {
        return Math.max(1, Math.round(track.clientWidth / items[0].offsetWidth));
      }

      function pageCount() {
        return Math.max(1, Math.ceil(items.length / itemsPerView()));
      }

      function currentPage() {
        var step = items[0].offsetWidth + 20; // 20px = gap in site.css
        return Math.round(track.scrollLeft / step / itemsPerView());
      }

      function goTo(pageIndex) {
        var pages = pageCount();
        pageIndex = (pageIndex + pages) % pages; // wrap around at both ends
        var target = items[Math.min(pageIndex * itemsPerView(), items.length - 1)];
        track.scrollTo({ left: target.offsetLeft - track.offsetLeft });
      }

      // Arrows
      ["prev", "next"].forEach(function (direction) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "carousel-arrow " + direction;
        button.setAttribute("aria-label", direction === "prev" ? "Previous images" : "Next images");
        button.innerHTML = '<i class="ti-arrow-' + (direction === "prev" ? "left" : "right") + '"></i>';
        button.addEventListener("click", function () {
          goTo(currentPage() + (direction === "prev" ? -1 : 1));
        });
        carousel.appendChild(button);
      });

      // Dots (one per page; rebuilt when the number of pages changes)
      var dots = document.createElement("div");
      dots.className = "carousel-dots";
      carousel.appendChild(dots);

      function renderDots() {
        var pages = pageCount();
        if (dots.children.length !== pages) {
          dots.innerHTML = "";
          for (var i = 0; i < pages; i++) {
            var dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", "Show image group " + (i + 1));
            dot.addEventListener("click", goTo.bind(null, i));
            dots.appendChild(dot);
          }
        }
        var active = Math.min(currentPage(), pages - 1);
        Array.prototype.forEach.call(dots.children, function (dot, i) {
          dot.classList.toggle("active", i === active);
        });
        dots.hidden = pages < 2;
      }

      track.addEventListener("scroll", renderDots, { passive: true });
      window.addEventListener("resize", renderDots);
      renderDots();
    });
  }

  function initBackToTop() {
    var button = document.querySelector(".back-to-top");
    if (!button) return;

    button.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0 });
    });

    function update() {
      button.classList.toggle("visible", window.scrollY > 200);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initSortableTables() {
    document.querySelectorAll(".data-table[data-sortable]").forEach(function (table) {
      var body = table.tBodies[0];
      var headers = table.querySelectorAll("th");

      headers.forEach(function (header, column) {
        header.addEventListener("click", function () {
          // First click sorts ascending, the next one descending, and so on.
          var ascending = header.dataset.order !== "asc";
          headers.forEach(function (h) { delete h.dataset.order; });
          header.dataset.order = ascending ? "asc" : "desc";

          var rows = Array.prototype.slice.call(body.rows);
          rows.sort(function (a, b) {
            var x = a.cells[column].textContent.trim();
            var y = b.cells[column].textContent.trim();
            var nx = parseFloat(x), ny = parseFloat(y);
            var result = !isNaN(nx) && !isNaN(ny) ? nx - ny : x.localeCompare(y);
            return ascending ? result : -result;
          });
          rows.forEach(function (row) { body.appendChild(row); });
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileMenu();
    initReveal();
    initCarousels();
    initBackToTop();
    initSortableTables();
  });
})();
