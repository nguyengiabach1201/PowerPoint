const draggableObjects = document.querySelectorAll(".draggable");
const objectHandles = document.querySelectorAll(".resizable-handle");
const editor = document.querySelector("#editor");

const verticalCenterLine = document.getElementById("verticalCenterLine");
const horizontalCenterLine = document.getElementById("horizontalCenterLine");
const frameLeft = document.getElementById("frameLeft");
const frameRight = document.getElementById("frameRight");
const frameTop = document.getElementById("frameTop");
const frameBottom = document.getElementById("frameBottom");

let selectedObject = "";

// When click, if there is no object then remove all select hightlight
document.addEventListener("mousedown", (e) => {
    let clickedInDraggableObject = false;
    draggableObjects.forEach((draggable) => {
        if (draggable.contains(e.target)) {
            clickedInDraggableObject = true;
        }
    });

    if (!clickedInDraggableObject) {
        selectedObject = "";
        draggableObjects.forEach((draggable) => {
            draggable.id = "";
        });
    }
});

// If the mouse move in, show the selecting highlight
draggableObjects.forEach((draggable) => {
    draggable.addEventListener("mouseover", function (e) {
        draggable.id = "selected-object";
    });
});

// If object is not selected then when mouse move out, remove the selecting highlight
draggableObjects.forEach((draggable) => {
    draggable.addEventListener("mouseout", function (e) {
        if (selectedObject != draggable) draggable.id = "";
    });
});

function getRelativeBoundingClientRect(child, parent) {
    const childRect = child.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    return {
        top: childRect.top - parentRect.top,
        left: childRect.left - parentRect.left,
        width: childRect.width,
        height: childRect.height,
    };
}

// Get mouse position in global SVG space
var pt = editor.createSVGPoint();
function cursorPoint(evt) {
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(editor.getScreenCTM().inverse());
}

function getEditorCenter() {
    return {
        x:
            (editor.clientWidth / 2) *
            (1280 / editor.getBoundingClientRect().width),
        y:
            (editor.clientHeight / 2) *
            (720 / editor.getBoundingClientRect().height),
    };
}

// Dragging functionality
draggableObjects.forEach((draggable) => {
    draggable.addEventListener("mousedown", function (e) {
        // Remove the selected highlight in all objects and set it to the dragged one
        draggableObjects.forEach((obj) => {
            obj.id = "";
        });
        selectedObject = draggable;
        draggable.id = "selected-object";

        // Initalling
        const mouse = cursorPoint(e);
        const editorRect = editor.getBoundingClientRect();
        const rect = getRelativeBoundingClientRect(draggable, editor);

        const startX = mouse.x - (1280 / editorRect.width) * rect.left;
        const startY = mouse.y - (720 / editorRect.height) * rect.top;

        const startWidth = draggable.clientWidth;
        const startHeight = draggable.clientHeight;

        function moveAt(e) {
            // Start moving
            const mouse = cursorPoint(e);
            const newX = mouse.x - startX;
            const newY = mouse.y - startY;

            // Get the center of the editor and the object
            const editorCenter = getEditorCenter();
            const elementCenter = {
                x: newX + startWidth / 2,
                y: newY + startHeight / 2,
            };

            // Snap
            const snapTolerance = 10;
            let snappedX = newX;
            let snappedY = newY;

            // Slide in the vertical line
            if (Math.abs(elementCenter.x - editorCenter.x) < snapTolerance) {
                snappedX = editorCenter.x - startWidth / 2;
                verticalCenterLine.style.display = "block";
            }
            // Slide on the right of the vertical line
            else if (
                Math.abs(elementCenter.x - 0.5 * startWidth - editorCenter.x) <
                snapTolerance
            ) {
                snappedX = editorCenter.x;
                verticalCenterLine.style.display = "block";
            }
            // Slide on the left of the vertical line
            else if (
                Math.abs(elementCenter.x + 0.5 * startWidth - editorCenter.x) <
                snapTolerance
            ) {
                snappedX = editorCenter.x - startWidth;
                verticalCenterLine.style.display = "block";
            } else {
                verticalCenterLine.style.display = "none";
            }

            // Slide in the horizontal line
            if (Math.abs(elementCenter.y - editorCenter.y) < snapTolerance) {
                snappedY = editorCenter.y - startHeight / 2;
                horizontalCenterLine.style.display = "block";
            }
            // Slide on the horizontal line
            else if (
                Math.abs(elementCenter.y - 0.5 * startHeight - editorCenter.y) <
                snapTolerance
            ) {
                snappedY = editorCenter.y;
                horizontalCenterLine.style.display = "block";
            }
            // Slide under the horizontal line
            else if (
                Math.abs(elementCenter.y + 0.5 * startHeight - editorCenter.y) <
                snapTolerance
            ) {
                snappedY = editorCenter.y - startHeight;
                horizontalCenterLine.style.display = "block";
            } else {
                horizontalCenterLine.style.display = "none";
            }

            // Slide on the bottom of the top frame
            if (
                Math.abs(elementCenter.y - 100 - 0.5 * startHeight) <
                snapTolerance
            ) {
                snappedY = 100 + 0.5 * startHeight - startHeight / 2;
                frameLeft.style.display = "block";
                frameRight.style.display = "block";
                frameTop.style.display = "block";
                frameBottom.style.display = "block";
            }

            // Slide on the top of the bottom frame
            if (
                Math.abs(620 - 0.5 * startHeight - elementCenter.y) <
                snapTolerance
            ) {
                snappedY = 620 - startHeight;
                frameLeft.style.display = "block";
                frameRight.style.display = "block";
                frameTop.style.display = "block";
                frameBottom.style.display = "block";
            }

            // Slide on the left of the right frame
            console.log(1280 - 100 - 0.5 * startWidth - elementCenter.x);
            if (
                Math.abs(1280 - 100 - 0.5 * startWidth - elementCenter.x) <
                snapTolerance
            ) {
                snappedX = 1280 - 100 - 0.5 * startWidth - startWidth / 2;
                frameLeft.style.display = "block";
                frameRight.style.display = "block";
                frameTop.style.display = "block";
                frameBottom.style.display = "block";
            }

            // Slide on the right of the left frame
            if (
                Math.abs(elementCenter.x - 100 - 0.5 * startWidth) <
                snapTolerance
            ) {
                snappedX = 100 + 0.5 * startWidth - startWidth / 2;
                frameLeft.style.display = "block";
                frameRight.style.display = "block";
                frameTop.style.display = "block";
                frameBottom.style.display = "block";
            }

            editorRect;

            // else {
            //     frameLeft.style.display = "none";
            //     frameRight.style.display = "none";
            //     frameTop.style.display = "none";
            //     frameBottom.style.display = "none";
            // }

            // Moving the object
            draggable.style.left = snappedX + "px";
            draggable.style.top = snappedY + "px";
        }

        function onMouseMove(e) {
            moveAt(e);
        }

        document.addEventListener("mousemove", onMouseMove);

        document.addEventListener(
            "mouseup",
            function () {
                // Stop dragging
                verticalCenterLine.style.display = "none";
                horizontalCenterLine.style.display = "none";
                frameLeft.style.display = "none";
                frameRight.style.display = "none";
                frameTop.style.display = "none";
                frameBottom.style.display = "none";

                document.removeEventListener("mousemove", onMouseMove);
            },
            { once: true }
        );
    });
});

// Resizing functionality
objectHandles.forEach((handle, i) => {
    handle.addEventListener("mousedown", function (e) {
        // Remove the selected highlight in all objects and set it to the dragged one
        draggableObjects.forEach((obj) => {
            obj.id = "";
        });
        selectedObject = draggableObjects[i];
        draggableObjects[i].id = "selected-object";

        e.stopPropagation();

        const mouse = cursorPoint(e);
        const editorRect = editor.getBoundingClientRect();
        const rect = getRelativeBoundingClientRect(draggableObjects[i], editor);

        const startX = mouse.x - (1280 / editorRect.width) * rect.left;
        const startY = mouse.y - (720 / editorRect.height) * rect.top;

        const startWidth = draggableObjects[i].clientWidth;
        const startHeight = draggableObjects[i].clientHeight;

        console.log(startWidth);

        function resizeAt(e) {
            // const rect = getRelativeBoundingClientRect(
            //     draggableObjects[i],
            //     editor
            // );
            const mouse = cursorPoint(e);
            // const editorRect = editor.getBoundingClientRect();

            const newX = mouse.x - startX;
            const newY = mouse.y - startY;

            // Get the center of the editor and the object
            const editorCenter = getEditorCenter();

            // Snap
            const snapTolerance = 10;
            let snappedX = newX;
            let snappedY = newY;

            // Slide in the vertical line
            if (Math.abs(newX + startWidth - editorCenter.x) < snapTolerance) {
                snappedX = editorCenter.x - startWidth;
                verticalCenterLine.style.display = "block";
            } else {
                verticalCenterLine.style.display = "none";
            }

            // Slide in the horizontal line
            if (Math.abs(newY + startHeight - editorCenter.y) < snapTolerance) {
                snappedY = editorCenter.y - startHeight;
                horizontalCenterLine.style.display = "block";
            } else {
                horizontalCenterLine.style.display = "none";
            }

            // draggableObjects[i].style.width =
            //     mouse.x - (1280 / editorRect.width) * rect.left + "px";
            // draggableObjects[i].style.height =
            //     mouse.y - (720 / editorRect.height) * rect.top + "px";

            draggableObjects[i].style.width =
                snappedX +
                startWidth -
                (1280 / editorRect.width) * rect.left +
                "px";
            draggableObjects[i].style.height =
                snappedY +
                startHeight -
                (720 / editorRect.height) * rect.top +
                "px";
        }

        function onMouseMove(e) {
            resizeAt(e);
        }

        document.addEventListener("mousemove", onMouseMove);

        document.addEventListener(
            "mouseup",
            function () {
                // Stop resizing
                verticalCenterLine.style.display = "none";
                horizontalCenterLine.style.display = "none";

                document.removeEventListener("mousemove", onMouseMove);
            },
            { once: true }
        );
    });
});

// const selectionBox = document.getElementById("selectionBox");
// let startX, startY;

// document.addEventListener("mousedown", function (e) {
//     startX = e.clientX;
//     startY = e.clientY;
//     selectionBox.style.left = startX + "px";
//     selectionBox.style.top = startY + "px";
//     selectionBox.style.width = "0px";
//     selectionBox.style.height = "0px";
//     selectionBox.style.display = "block";

//     function onMouseMove(e) {
//         const currentX = e.clientX;
//         const currentY = e.clientY;
//         selectionBox.style.width = Math.abs(currentX - startX) + "px";
//         selectionBox.style.height = Math.abs(currentY - startY) + "px";
//         selectionBox.style.left = Math.min(currentX, startX) + "px";
//         selectionBox.style.top = Math.min(currentY, startY) + "px";
//     }

//     function onMouseUp() {
//         document.removeEventListener("mousemove", onMouseMove);
//         document.removeEventListener("mouseup", onMouseUp);
//         selectionBox.style.display = "none";
//     }

//     document.addEventListener("mousemove", onMouseMove);
//     document.addEventListener("mouseup", onMouseUp);
// });
