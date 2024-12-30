document.addEventListener("DOMContentLoaded", () => {
    var splide = new Splide(".splide", {
        type: "loop",
        // autoplay: true,
        arrows: false,
        pagination: "splide__pagination splide__pagination--custom",
    });

    splide.mount();
});
