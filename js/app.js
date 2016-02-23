var TShirtDesignTool = function () {
    var _this = this;
    this.init= function () {
        _canvasInit();
        // All Event binding goes here

        $('#text-panel a').click(function (e) {
            _this.drawText();
        });

        $('#textArea').keyup(function (e) {
            _this.updateText(e.target.value);
        });

        $("#btnChooseShirt").click(function (e) {
            _this.showPanel('chooseTShirtPanel');
            _this.isPersonalizationMode = false;
        });

        $("#btnAddText").click(function (e) {
            _this.showPanel('text-panel');
            $('#text-panel textarea').val('');
            _this.isPersonalizationMode = false;
        });

        $("#btnAddclipart").click(function (e) {
            _this.showPanel('clip-art-panel');
            _this.isPersonalizationMode = false;
        });

        $("#btnUploadImage").click(function (e) {
            _this.showPanel('upload-image-panel');
        });

        $("#btnPersonalize").click(function (e) {
            _this.showPanel('personalization-panel');
            _this.isPersonalizationMode = true;
        });

        $("#btnSaveDesign").click(function (e) {
            _this.isPersonalizationMode = false;
            $('#save-design-popup img').attr('src', window.canvas.toDataURL("image/png"));
        });

        $('#textSpacing,#fontSizing,#textCircular,#textOutline,#pathList,#upload-image,#import-design').change(function (e) {
            switch (e.target.id) {
                case 'textSpacing':
                    _this.setTextSpacing(textSpacing.value);
                    break;
                case 'fontSizing':
                    _this.setFontSize();
                    break;
                case 'textCircular':
                    _this.setTextCircular();
                    break;
                case 'textOutline':
                    _this.setOutline();
                    break;
                case 'pathList':
                    _this.svgPathChange();
                    break;
                case 'upload-image':
                    _this.uploadImage(e);
                    ;
                    break;
                case 'import-design':
                    _this.importDesign(e);
                    break;
            }

        });

        $('#textArcSlider').slider({
            orientation: "horizontal",
            range: "min",
            min: -107,
            max: 108,
            value: 0,
            slide: function (event, ui) {
                return _this.setTextArc(ui.value);
            }
        });

        $('#svgAngle').slider({
            orientation: "horizontal",
            range: "min",
            min: -1,
            max: 361,
            value: 0,
            slide: _this.setSvgAngle
        });

        $('#svgOpacity').slider({
            orientation: "horizontal",
            range: "min",
            min: 0,
            max: 100,
            value: 100,
            slide: _this.setSvgOpacity
        });

        $("#text-outline-slider").slider({
            orientation: "horizontal",
            range: "min",
            max: 100,
            value: 0,
            slide: function (event, ui) {
                return _this.setOutlineWidth(ui.value * .01);
            }

        });

        $("#text-color,#text-outline-color,#svgFill,#numberColor,#nameColor").spectrum({
            showPaletteOnly: true,
            togglePaletteOnly: true,
            hideAfterPaletteSelect: true,
            togglePaletteMoreText: 'more',
            togglePaletteLessText: 'less',
            color: 'gray',
            palette: [
                ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ]
        });

        $("#text-color,#text-outline-color,#svgFill,#nameColor,#numberColor").change(function (e) {
            var parentID = e.target.id,
                color = $('#' + parentID + '').spectrum("get").toHexString();
            switch (parentID) {
                case 'svgFill':
                    _this.setSvgPathColor(color);
                    break;
                case 'text-color':
                    _this.setTextColor(color);
                    break;
                case 'text-outline-color':
                    _this.setOutlineColor(color);
                    break;
                case 'nameColor':
                    _this.setPersonalizedNameColor(color);
                    break;
                case 'numberColor':
                    _this.setPersonalizedNumberColor(color);
                    break;
            }
        });

        $('#font-style').ddslick({
            data: _this.fontStyleData,
            width: 190,
            imagePosition: "left",
            selectText: "Select font style",
            onSelected: function (data) {
                //console.log(data);
                _this.setFontStyle(data.selectedData.text);
            }
        });

        $('#font-family').ddslick({
            data: _this.fontFamilyData,
            width: 300,
            selectText: "Select font family",
            onSelected: function (data) {
                //console.log(data)
                _this.setTextFontFamily(data.selectedData.value);
            }
        });

        $('#clip-art-panel img').click(function (e) {
            _this.addClipartToCanvas(e.target.src);
        });

        $('.ThumbImg').click(function (e) {
            _this.changeTShirtSide(e.target.alt);
        });

        $('#btnSave').click(function () {
            _this.saveDesign();
        });

        $('#btnCancel').click(function () {
            $('#save-design-popup').foundation('reveal', 'close');
        });

        $('#changeShirtBtn').click(function (e) {
            _this.showTShirtCollection();
        });

        $('#chooseTShirtPanel fieldset a').each(function () {
            if (!$(this).hasClass("disable_a_href")) {
                $(this).click(function (e) {
                    _this.changeTShirtColor(e.target.title);
                })
            }
        });

        $('#addName,#addNumber,#nameInch,#numberInch').change(function (e) {
            switch (e.currentTarget.id) {
                case 'addName':
                    addName.checked ? _this.addPersonalizedName()
                        : _this.removePersonalizedName();
                    break;
                case 'addNumber':
                    addNumber.checked ? _this.addPersonalizedNumber()
                        : _this.removePersonalizedNumber();
                    break;
                case 'nameInch':
                    _this.setPersonalNameSize(parseFloat(nameInch.value));
                    break;
                case 'numberInch':
                    _this.setPersonalNumberSize(parseFloat(numberInch.value));
                    break;
            }

        });

        $("#nameSide,#numberSide").change(function (e) {
            _this.changeTshirtSideInPersonalizationMode(e.currentTarget.value);
        });

        $('#insertRow').click(function (e) {
            var row = $('#personalizeDataTable tbody tr').last().clone();
            $(row.children()).each(function (item) {
                switch (item) {
                    case 0:
                        this.innerHTML = parseInt(this.innerHTML) + 1;
                        break;
                    case 1:
                        $(this).children().val('');
                        break;
                    case 2:
                        $(this).children().val('');
                        break;
                }
            });
            $('#personalizeDataTable tbody').append(row);
        });

        $('#saveData').click(function (e) {

            var zip = new JSZip(),
                template = [];
            ['designFront', 'designBack'].forEach(function (sideName, i) {

                window.canvas.clear();
                var imageSrc = '/TshirtDesignTool/img/' + _this.selectedTShirt.color + '-1-' + sideName[6] + '.jpg';
                window.canvas.backgroundImage._element.src = imageSrc;

                if (sideName[6] === nameSide.value) {
                    $(_this.personalizeObjects).each(function () {
                        if (this.id === 'customName') {
                            window.canvas.add(this);
                        }
                    });
                }

                if (sideName[6] === numberSide.value) {
                    $(_this.personalizeObjects).each(function () {
                        if (this.id === 'customNumber') {
                            window.canvas.add(this);
                        }
                    });
                }

                window.canvas.renderAll();
                zip.file(sideName + '.txt', JSON.stringify(window.canvas.toJSON()));
                zip.file(sideName + '.png', window.canvas.toDataURL("image/png").replace('data:image/png;base64,', ''), {base64: true});

            });

            var memberList = [];

            $('#personalizeDataTable tbody tr').each(function () {
                var member = {};
                $($(this).children()).each(function (td) {
                    switch (td) {
                        case 0:
                            member.serialNo = this.innerHTML;
                            break;
                        case 1:
                            member.name = $(this).children().val();
                            break;
                        case 2:
                            member.number = $(this).children().val();
                            break;
                        case 3:
                            member.size = $(this).children().val();
                            break;
                    }
                });
                memberList.push(member);
            });

            var csv = convertArrayOfObjectsToCSV({
                data: memberList
            });

            zip.file("member.txt", JSON.stringify(memberList));
            zip.file("memberlist.csv", csv);


            $('#saveData').attr({
                'download': 'design-data',
                'href': "data:application/zip;base64," + zip.generate()
            });

            $('#personalization-popup').foundation('reveal', 'close');
        });

        $("#undoBtn").click(function (e) {
            _undo();
        });

        $("#redoBtn").click(function (e) {
            _redo();
        });

    };
    this.showPanel = function (panelToshow) {
        _this.panels.forEach(function (panel) {
            panel === panelToshow ? $('#' + panel).fadeIn(500) : $('#' + panel).hide();
        });
    };
    this.getCanvasActiveObject = function () {
        return window.canvas.getActiveObject() || window.canvas.item(0);
    };
    this.panels = [
        'text-panel',
        'editor-panel',
        'clip-art-panel',
        'upload-image-panel',
        'edit-clipart-panel',
        'chooseTShirtPanel',
        'personalization-panel'
    ];
    this.tempDesignData = [
        {
            side: 'F',
            object: null
        },
        {
            side: 'B',
            object: null
        },
        {
            side: 'L',
            object: null
        },
        {
            side: 'R',
            object: null
        }
    ];
    this.undoObjects = this.redoObjects = [];
    this.isUndoMode = true;
    this.isPersonalizationMode = false;
    this.lastSelectedObject = null;

    // private methods
    var _canvasInit = function () {

        // Initialization of fabric canvas
        window.canvas = new fabric.Canvas('canvas');
        canvas.setHeight($('#canvas-container').height());
        canvas.setWidth($('#canvas-container').width());
        var img = new Image();
        img.src = '/TshirtDesignTool/img/' + _this.selectedTShirt.color + '-1-' + _this.selectedTShirt.side + '.jpg';
        img.onload = function () {
            canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
                originX: 'left',
                originY: 'top',
                left: 0,
                top: 0,
                id: 'F',
                width: canvas.getWidth(),
                height: canvas.getHeight()
            });
        };

        canvas.on('object:added', function (e) {
            var obj = e.target;

            if (obj.id === 'customName' || obj.id === 'customNumber') {
                obj.on('selected', function () {
                    _this.showPersonalizationPanel();
                });
                return;
            }
            if (_this.isUndoMode) {
                _this.undoObjects.push({
                    operation: 'added',
                    object: obj
                });
            }
            if (!_this.isUndoMode) {
                _this.redoObjects.push({
                    operation: 'added',
                    object: obj
                });
            }
            if (obj.type === 'text' || obj.type === 'curvedText') {
                obj.on('selected', function () {
                    _this.textEditorPanel(obj);
                });
            }
            if (obj.type === 'path-group') {
                obj.on('selected', function () {
                    $('#pathList').html('');
                    for (var i = 0; i < obj.paths.length; i++) {
                        var option = '<option value=' + i + ' >Path ' + i + '</option>';
                        $('#pathList').append(option);
                    }
                    _this.clipartEditorPanel();
                });
            }
        });

        canvas.on('object:removed', function (e) {
            var obj = e.target;
            if (_this.isUndoMode) {
                _this.undoObjects.push({
                    operation: 'deleted',
                    object: obj
                });
            }
            if (!_this.isUndoMode) {
                _this.redoObjects.push({
                    operation: 'deleted',
                    object: obj
                });
            }
            _changePanelOnRemove(obj);
        });

        canvas.on('mouse:down', function (e) {
            if (e.target === undefined) {
                _changePanelOnRemove(_this.lastSelectedObject);
            }
        });

        canvas.on('object:selected', function (e) {
            _this.lastSelectedObject = e.target;
        });

        document.onkeydown = function (e) {
            if (46 === e.keyCode || e.keyCode === 110) {
                var activeObject = window.canvas.getActiveObject();
                if (activeObject) {
                    window.canvas.remove(activeObject).renderAll();
                }
            }
        }
    };
    var _boundObjectOnCanvas = function () {

        // feature is currently unused
        window.canvas.on('object:moving', function (e) {
            var obj = e.target;
            // if object is too big ignore
            if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
                return;
            }
            obj.setCoords();
            // top-left  corner
            if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
                obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
                obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
            }
            // bot-right corner
            if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
                obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
                obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
            }
        });

    };
    var _undo = function () {

        _this.isUndoMode = false;
        if (_this.undoObjects.length > 0) {
            var object = _this.undoObjects.pop();
            if (object) {
                if (object.operation === 'added') {
                    window.canvas.remove(object.object);
                    if (object.object.type === 'text') {
                        _this.showPanel('text-panel');
                        $('#text-panel textarea').val('');
                    }
                    if (object.object.type === 'path-group') {
                        _this.showPanel('clip-art-panel');
                    }
                }
                if (object.operation === 'deleted') {
                    window.canvas.add(object.object);
                }
            }
        }
        _this.isUndoMode = true;
    };
    var _redo = function () {

        _this.isUndoMode = true;
        if (_this.redoObjects.length > 0) {
            var object = _this.redoObjects.pop();
            if (object) {
                if (object.operation === 'added') {
                    window.canvas.remove(object.object);
                }
                if (object.operation === 'deleted') {
                    window.canvas.add(object.object);
                }
            }
        }
        //_this.isUndoMode=true;
    };
    var _changePanelOnRemove = function (target) {
        if (target.type === 'text' || target.type === 'curvedText') {
            _this.showPanel('text-panel');
            $('#text-panel textarea').val('');
        }
        else if (target.type === 'path-group') {
            _this.showPanel('clip-art-panel');
        }
        else if (target.type === 'image') {
            _this.showPanel('upload-image-panel');
        }
        else {
            _this.showPanel('chooseTShirtPanel');
        }
    };

    // Initialize application on constructor call
    _this.init();
};


$(document).ready(function () {
    var Application = new TShirtDesignTool();
    $(document).foundation();
});

