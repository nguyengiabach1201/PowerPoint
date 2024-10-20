const slides = document.querySelectorAll(".side-bar .slide");

console.log(slides);
slides.forEach((slide, i) => {
    slide.addEventListener("click", () => {
        document.querySelector("#selected-slide").id = "";
        slide.id = "selected-slide";
    });
});

// Move slide by draging
let dragSource = null;

function handleDragStart(e) {
    dragSource = this;
    this.classList.add("dragging");
    document.querySelector("#selected-slide").id = "";
    this.id = "selected-slide";
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    e.dataTransfer.dropEffect = "move"; // See the section on the DataTransfer object.
    return false;
}

function handleDragEnter(e) {
    this.classList.add("over");
}

function handleDragLeave(e) {
    this.classList.remove("over");
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }
    if (dragSource !== this) {
        dragSource.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData("text/html");
    }
    return false;
}

function handleDragEnd(e) {
    let movedSlide = false;
    document.querySelector("#selected-slide").id = "";

    this.classList.remove("dragging");
    [].forEach.call(slides, function (slide) {
        if (slide.classList.contains("over")) {
            slide.classList.remove("over");
            slide.id = "selected-slide";
            movedSlide = true;
        }
    });

    if (!movedSlide) this.id = "selected-slide";
}

[].forEach.call(slides, function (slide) {
    slide.addEventListener("dragstart", handleDragStart, false);
    slide.addEventListener("dragenter", handleDragEnter, false);
    slide.addEventListener("dragover", handleDragOver, false);
    slide.addEventListener("dragleave", handleDragLeave, false);
    slide.addEventListener("drop", handleDrop, false);
    slide.addEventListener("dragend", handleDragEnd, false);
});
