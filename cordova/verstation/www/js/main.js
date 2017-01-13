(function () {
    var sheetHeight = 800,
        sheetWidth = 800;

    var templateHTML = '<!DOCTYPE html>\n <html>\n <head>\n <meta charset="utf-8">\n <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\n <style>\n * {\n -webkit-box-sizing: border-box;\n -moz-box-sizing: border-box;\n box-sizing: border-box;\n }\n \n \n ::-moz-selection {\n background: #b3d4fc;\n text-shadow: none;\n }\n \n ::selection {\n background: #b3d4fc;\n text-shadow: none;\n }\n\n body {\n position: relative;\n width: 100vw;\n height: 100vh;\n }\n\n body div {\n position: absolute;\n}\n\n div {\n border: 1px solid;\n}\n </style>\n </head>\n <body>\n \n {htmlstring}\n \n </body>\n </html>';
    window.getDataFromImgs = function (files) {
        var resultFromPhoto2 = [];
        var generalResult = [resultFromPhoto1, resultFromPhoto2];
        return generalResult;
    }

    var $ = function (selector, parent) {
        return (document || parent).querySelector(selector)
    };

    var $$ = function (selector, parent) {
        return (document || parent).querySelectorAll(selector)
    };

    window.render = function (shapes, container) {
        if (!container) {
            container = document.createDocumentFragment();
        }
        for (var i = 0, len = shapes.length; i < len; i += 1) {
            var styleRules = {
                top: shapes[i].pos.tl.y / sheetHeight * 100,
                left: shapes[i].pos.tl.x / sheetWidth * 100,
                width: (shapes[i].pos.tr.x / sheetHeight * 100) - (shapes[i].pos.tl.x / sheetWidth * 100),
                height: (shapes[i].pos.bl.y / sheetWidth * 100) - (shapes[i].pos.tl.y / sheetHeight * 100)
            };

            if (styleRules.height > 0.5 || styleRules.width > 0.5) {
                var elem;
                switch (shapes[i].pos.type) {
                    case 'div':
                        elem = document.createElement('div');
                        elem.innerHTML = 'I\'m a block';
                        break;
                    case 'button':
                        elem = document.createElement('button');
                        elem.innerHTML = 'I\'m a button';
                        break;
                    case 'header':
                        elem = document.createElement('h1');
                        elem.innerHTML = 'I\'m a H1';
                        break;

                }
                elem.classList.add('ghr');
                //elem.setAttribute('contenteditable', true);
                for (var nameStyleRule in styleRules) {
                    if (styleRules.hasOwnProperty(nameStyleRule)) {
                        elem.style[nameStyleRule] = styleRules[nameStyleRule] + '%';
                    }
                }
                container.appendChild(elem);
            }
        }

        return container;
    };

    window.dragElems = null;

    window.startEdit = function () {
        if (dragElems) {
            dragElems.unset();
            dragElems = null;
        }

        var offset = {x: 0, y: 0};

        var resizemove = function (event) {
            var target = event.target;

            // update the element's style
            target.style.width = event.rect.width + 'px';
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

            // update the position attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        };

        var dragOnEnd = function (event) {
            var textEl = event.target.querySelector('p');

            textEl && (textEl.textContent =
                'moved a distance of '
                + (Math.sqrt(event.dx * event.dx +
                    event.dy * event.dy) | 0) + 'px');
        };

        var draggable = {
            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            restrict: {
                restriction: "parent",
                endOnly: true,
                elementRect: {top: 0, left: 0, bottom: 1, right: 1}
            },
            // call this function on every dragmove event
            onmove: dragOnMove,
            // call this function on every dragend event
            onend: dragOnEnd
        };

        dragElems = interact('.result__markup *')
            .resizable({
                edges: {left: true, right: true, bottom: true, top: true}
            })
            .on('resizemove', resizemove)
            .draggable(draggable);
    };

    window.addEventListener('load', function () {
        setTimeout(function () {
            document.body.classList.add('body_show');
        }, 0);

        setTimeout(function () {
            var texts = $$('.welcome__t__row');
            for (var i = 0, len = texts.length; i < len; i += 1) {
                (function (i) {
                    setTimeout(function () {
                        texts[i].classList.add('welcome__t__row_show')
                    }, 100 * i);
                }(i));
            }
        }, 1000);

    }, false);

    $('#edit-sizes').addEventListener('change', function () {
        if (!dragElems) {
            startEdit()
        }
    }, false);

    $('#edit-text').addEventListener('change', function () {
        if (dragElems) {
            dragElems.unset();
            dragElems = null;
        }
    }, false);

    $('#view-source').addEventListener('change', function () {
        if (dragElems) {
            dragElems.unset();
            dragElems = null;
        }
        $('#copyhtml').value = templateHTML.replace(/{htmlstring}/, $('.result__markup').innerHTML);
        $('.copy').classList.add('copy_show');
    }, false);

    $('body').addEventListener('click', function (event) {
        var targetShapes = $$('.result__markup div');
        if (!event.target.classList.contains('start_btn')) {
            for (var i = 0, len = targetShapes.length; i < len; i += 1) {
                targetShapes[i].setAttribute('contenteditable', false);
                //targetShapes[i].removeChild(start_button);
                //start_button.style.display='none';
                //event.target.removeChild(interim_span);
                //event.target.removeChild(final_span);

            }
        }

        if ($('#edit-text').checked === true) {
            event.target.setAttribute('contenteditable', true);
        }

    }, false);

    $('.copy-popover-close').addEventListener('click', function (event) {
        $('.copy').classList.remove('copy_show');
        $('#edit-sizes').addEventListener('change', function () {
            if (!dragElems) {
                startEdit()
            }
        }, false);
    }, false);

    $('.result__back').addEventListener('click', function (event) {

        //if ($('#files')) {
        //    $('#files').value = '';
        //}
        //if ($('.ouput-mass')) {
        //    $('.ouput-mass').innerHTML = '';
        //}
        //$('.result__markup').innerHTML = '';
        //$('.result').classList.remove('result_show');
        //TODO: fixed
        location.reload();
    }, false);

}());