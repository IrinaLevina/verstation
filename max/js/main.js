var sheetHeight = 800,
    sheetWidth = 800;

function getDataFromImgs(files) {
    var resultFromPhoto1 = [{
        pos: {
            tl: {
                x: 10,
                y: 10
            },
            tr: {
                x: 100,
                y: 10
            },
            bl: {
                x: 10,
                y: 100
            },
            br: {
                x: 100,
                y: 100
            }
        },
        items: []
    }, {
        pos: {
            tl: {
                x: 10,
                y: 150
            },
            tr: {
                x: 500,
                y: 150
            },
            bl: {
                x: 10,
                y: 500
            },
            br: {
                x: 500,
                y: 500
            }
        }
    }];

    var resultFromPhoto2 = [];


    var generalResult = [resultFromPhoto1, resultFromPhoto2];

    return generalResult;
}

var $ = function(selector, parent) {
    return (document || parent).querySelector(selector)
};

var $$ = function(selector, parent) {
    return (document || parent).querySelectorAll(selector)
};

function render(shapes, container) {
    if (!container) {
        container = document.createDocumentFragment();
    }
    //if (!rootShape) {
    //    rootShape = shape;
    //}
    //
    //if (shape && shape.items && shape.items.length) {
    //    for(var i = 0, len = shape.items.length; i < len; i += 1) {
    //        var styleRules = {
    //            top: shape.items[i].pos.tl.y / rootShape.height * 100,
    //            left: shape.items[i].pos.tl.x / rootShape.width * 100,
    //            width: (shape.items[i].pos.tr.x / rootShape.height * 100) - (shape.items[i].pos.tl.x / rootShape.width * 100),
    //            height: (shape.items[i].pos.bl.y / rootShape.width * 100) - (shape.items[i].pos.tl.y / rootShape.height * 100)
    //        };
    //
    //        var elem = document.createElement('div');
    //        //elem.setAttribute('contenteditable', true);
    //        for(var nameStyleRule in styleRules) {
    //            if (styleRules.hasOwnProperty(nameStyleRule)) {
    //                elem.style[nameStyleRule] = styleRules[nameStyleRule] + '%';
    //            }
    //        }
    //        container.appendChild(elem);
    //        //render(shape.items[i], elem, rootShape);
    //    }
    //}
console.log(shapes)
    for(var i = 0, len = shapes.length; i < len; i += 1) {
        var styleRules = {
            top: shapes[i].pos.tl.y / sheetHeight * 100,
            left: shapes[i].pos.tl.x / sheetWidth * 100,
            width: (shapes[i].pos.tr.x / sheetHeight * 100) - (shapes[i].pos.tl.x / sheetWidth * 100),
            height: (shapes[i].pos.bl.y / sheetWidth * 100) - (shapes[i].pos.tl.y / sheetHeight * 100)
        };

        var elem = document.createElement('div');
        //elem.setAttribute('contenteditable', true);
        for(var nameStyleRule in styleRules) {
            if (styleRules.hasOwnProperty(nameStyleRule)) {
                elem.style[nameStyleRule] = styleRules[nameStyleRule] + '%';
            }
        }
        container.appendChild(elem);
    }

    return container;
};

var dragElems = null;

function startEdit() {
    var offset = { x: 0, y: 0 };

    var resizemove = function (event) {
        var target = event.target;

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        offset.x += event.deltaRect.left;
        offset.y += event.deltaRect.top;

        target.style.transform = ('translate('
        + offset.x + 'px,'
        + offset.y + 'px)');

        //target.textContent = event.rect.width + '×' + event.rect.height;
    };

    var dragOnMove = function (event) {
        var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    };

    var dragOnEnd = function (event) {
        var textEl = event.target.querySelector('p');

        textEl && (textEl.textContent =
            'moved a distance of '
            + (Math.sqrt(event.dx * event.dx +
            event.dy * event.dy)|0) + 'px');
    };

    var draggable = {
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // call this function on every dragmove event
        onmove: dragOnMove,
        // call this function on every dragend event
        onend: dragOnEnd
    };

    dragElems = interact('.result div')
        .resizable({
            edges: { left: true, right: true, bottom: true, top: true }
        })
        .on('resizemove', resizemove)
        .draggable(draggable);
};

window.addEventListener('load', function() {
    setTimeout(function() {
        document.body.classList.add('body_show');
    }, 0);

    setTimeout(function() {
        var texts = $$('.welcome__t__row');
        for(var i = 0, len = texts.length; i < len; i += 1) {
            (function(i) {
                setTimeout(function() {
                    texts[i].classList.add('welcome__t__row_show')
                }, 100 * i);
                if (i === texts.length - 1) {
                    setTimeout(function() {
                        $('.welcome__bt').classList.add('welcome__bt_show')
                    }, 1100);
                }
            }(i));
        }
    }, 1500);

    $('#files').addEventListener('change', function(event) {
        var files = event.target.files;

        var data = getDataFromImgs(files),
            outputCont = $('.result');

        for(var i = 0, len = data.length; i < len; i += 1) {
            outputCont.appendChild(render(data[i]));
        };

        outputCont.classList.add('result_show');
        startEdit();
    }, false);
}, false);

$('#edit-sizes').addEventListener('change', function() {
    if (!dragElems) {
        startEdit()
    }
}, false);

$('#edit-text').addEventListener('change', function() {
    if (dragElems) {
        dragElems.unset();
        dragElems = null;
    }
}, false);

$('#view-source').addEventListener('change', function() {
    if (dragElems) {
        dragElems.unset();
        dragElems = null;
    }
}, false);

$('body').addEventListener('click', function(event) {
    var targetShapes = $$('.result div');
    for(var i = 0, len = targetShapes.length; i < len; i += 1) {
        targetShapes[i].setAttribute('contenteditable', false);
    }
    if ($('#edit-text').checked === true) {
        event.target.setAttribute('contenteditable', true);
    }
}, false);