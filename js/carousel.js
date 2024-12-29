document.addEventListener("DOMContentLoaded", function () {
    var splide = new Splide(".splide", {
        type: "fade",
        // autoplay: true,
        arrows: false,
        pagination: "splide__pagination splide__pagination--custom",
    });

    splide.mount();
});
