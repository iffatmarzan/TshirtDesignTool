var TShirtDesignTool =
{
    init: function () {
        TShirtDesignTool.canvasInit();
    // All Event binding goes here
        $('#text-panel a').click(function (e) {
            TShirtDesignTool.drawText();
        });

        $('#textArea').keyup(function (e) {
            TShirtDesignTool.updateText(e.target.value);
        });

        $("#btnChooseShirt").click(function(e){
            TShirtDesignTool.chooseTShirtPanel();
        });
        $("#btnAddText").click(function(e){
            TShirtDesignTool.addTextPanel();
        });
        $("#btnAddclipart").click(function(e){
            TShirtDesignTool.changeToClipartPanel();
        });
        $("#btnUploadImage").click(function(e){
            TShirtDesignTool.changeToUploadImagePanel();
        });
        $("#btnPersonalize").click(function(e){
            TShirtDesignTool.showPersonalizationPanel();
        });
        $("#btnSaveDesign").click(function(e){
            TShirtDesignTool.showSaveDesignPanel();
        });

        $('#textSpacing,#fontSizing,#textCircular,#textOutline,#pathList,#upload-image,#import-design').change(function (e) {
            switch (e.target.id) {
                case 'textSpacing':
                    TShirtDesignTool.setTextSpacing(textSpacing.value);
                    break;
                case 'fontSizing':
                    TShirtDesignTool.setFontSize();
                    break;
                case 'textCircular':
                    TShirtDesignTool.setTextCircular();
                    break;
                case 'textOutline':
                    TShirtDesignTool.setOutline();
                    break;
                case 'pathList':
                    TShirtDesignTool.svgPathChange();
                    break;
                case 'upload-image':
                    TShirtDesignTool.uploadImage(e);
                    ;
                    break;
                case 'import-design':
                    TShirtDesignTool.importDesign(e);
                    break;
            }

        });

        $('#textArcSlider').slider({
            orientation: "horizontal",
            range: "min",
            min: -107,
            max: 108,
            value: 0,
            slide: TShirtDesignTool.setTextArc
        });

        $('#svgAngle').slider({
            orientation: "horizontal",
            range: "min",
            min: -1,
            max: 361,
            value: 0,
            slide: TShirtDesignTool.setSvgAngle
        });

        $('#svgOpacity').slider({
            orientation: "horizontal",
            range: "min",
            min: 0,
            max: 100,
            value: 100,
            slide: TShirtDesignTool.setSvgOpacity
        });

        $("#text-outline-slider").slider({
            orientation: "horizontal",
            range: "min",
            max: 100,
            value: 0,
            slide: TShirtDesignTool.setOutlineWidth
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
                    TShirtDesignTool.setSvgPathColor(color);
                    break;
                case 'text-color':
                    TShirtDesignTool.setTextColor(color);
                    break;
                case 'text-outline-color':
                    TShirtDesignTool.setOutlineColor(color);
                    break;
                case 'nameColor':
                    TShirtDesignTool.setPersonalizedNameColor(color);
                    break;
                case 'numberColor':
                    TShirtDesignTool.setPersonalizedNumberColor(color);
                    break;
            }
        });

        $('#font-style').ddslick({
            data: TShirtDesignTool.fontStyleData,
            width: 190,
            imagePosition: "left",
            selectText: "Select font style",
            onSelected: function (data) {
                //console.log(data);
                TShirtDesignTool.setFontStyle(data.selectedData.text);
            }
        });

        $('#font-family').ddslick({
            data: TShirtDesignTool.fontFamilyData,
            width: 300,
            selectText: "Select font family",
            onSelected: function (data) {
                //console.log(data)
                TShirtDesignTool.setTextFontFamily(data.selectedData.value);
            }
        });

        $('#clip-art-panel img').click(function (e) {
            TShirtDesignTool.addClipartToCanvas(e.target.src);
        });

        $('.ThumbImg').click(function (e) {
            TShirtDesignTool.changeTShirtSide(e.target.alt);
        });

        $('#btnSave').click(function () {
            TShirtDesignTool.saveDesign();
        });

        $('#btnCancel').click(function () {
            $('#save-design-popup').foundation('reveal', 'close');
        });

        $('#changeShirtBtn').click(function (e) {
            TShirtDesignTool.showTShirtCollection();
        });

        $('#chooseTShirtPanel fieldset a').each(function () {
            $(this).click(function (e) {
                TShirtDesignTool.changeTShirtColor(e.target.title);
            })
        });

        $('#addName,#addNumber,#nameInch,#numberInch').change(function (e) {
            switch (e.currentTarget.id) {
                case 'addName':
                    addName.checked ? TShirtDesignTool.addPersonalizedName()
                        : TShirtDesignTool.removePersonalizedName();
                    break;
                case 'addNumber':
                    addNumber.checked ? TShirtDesignTool.addPersonalizedNumber()
                        : TShirtDesignTool.removePersonalizedNumber();
                    break;
                case 'nameInch':
                    TShirtDesignTool.setPersonalNameSize(parseFloat(nameInch.value));
                    break;
                case 'numberInch':
                    TShirtDesignTool.setPersonalNumberSize(parseFloat(numberInch.value));
                    break;
            }

        });

        $("#nameSide,#numberSide").change(function (e) {
            TShirtDesignTool.changeTshirtSideInPersonalizationMode(e.currentTarget.value);
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
                var imageSrc = '/TshirtDesignTool/img/' + TShirtDesignTool.selectedTShirt.color + '-1-' + sideName[6] + '.jpg';
                window.canvas.backgroundImage._element.src = imageSrc;

                if (sideName[6] === nameSide.value) {
                    $(TShirtDesignTool.personalizeObjects).each(function () {
                        if (this.id === 'customName') {
                            window.canvas.add(this);
                        }
                    });
                }

                if (sideName[6] === numberSide.value) {
                    $(TShirtDesignTool.personalizeObjects).each(function () {
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

        $("#undoBtn").click(function(e){
            TShirtDesignTool.undo();
        });

        $("#redoBtn").click(function(e){
            TShirtDesignTool.redo();
        });

}
    , canvasInit: function () {
        window.canvas = new fabric.Canvas('canvas');
        canvas.setHeight($('#canvas-container').height());
        canvas.setWidth($('#canvas-container').width());
        var img = new Image();
        img.src = '/TshirtDesignTool/img/' + TShirtDesignTool.selectedTShirt.color + '-1-' + TShirtDesignTool.selectedTShirt.side + '.jpg';
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
                    TShirtDesignTool.showPersonalizationPanel();
                });
                return;
            }
            if (TShirtDesignTool.isUndoMode) {
                TShirtDesignTool.undoObjects.push({
                    operation: 'added',
                    object: obj
                });
            }
            if (!TShirtDesignTool.isUndoMode) {
                TShirtDesignTool.redoObjects.push({
                    operation: 'added',
                    object: obj
                });
            }
            if (obj.type === 'text' || obj.type === 'curvedText') {
                obj.on('selected', function () {
                    TShirtDesignTool.textEditorPanel();
                });
            }
            if (obj.type === 'path-group') {
                obj.on('selected', function () {
                    $('#pathList').html('');
                    for (var i = 0; i < obj.paths.length; i++) {
                        var option = '<option value=' + i + ' >Path ' + i + '</option>';
                        $('#pathList').append(option);
                    }
                    TShirtDesignTool.clipartEditorPanel();
                });
            }
        });

        canvas.on('object:removed', function (e) {
            var obj = e.target;
            if (TShirtDesignTool.isUndoMode) {
                TShirtDesignTool.undoObjects.push({
                    operation: 'deleted',
                    object: obj
                });
            }
            if (!TShirtDesignTool.isUndoMode) {
                TShirtDesignTool.redoObjects.push({
                    operation: 'deleted',
                    object: obj
                });
            }
        });

        document.onkeydown = function (e) {
            if (46 === e.keyCode || e.keyCode === 110) {
                var activeObject = window.canvas.getActiveObject();
                if (activeObject !== null) {
                    window.canvas.remove(activeObject);
                }
                window.canvas.renderAll();
                TShirtDesignTool.addTextPanel();
            }
        }
}
    , enableObjectBoundingonCanvas: function () {
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

}
    , drawText: function () {
    var _canvas = window.canvas;
    var Text = $('#text-panel textarea').val();
    if (Text === "")
        return;
    var SampleText = new fabric.Text(Text, {
        strokeWidth: 0,
        fontSize: 30,
        letterSpacing: 0
    });
    var left = _canvas.getWidth() / 2 - SampleText.getWidth() / 2;
    var top = _canvas.getHeight() / 2 - SampleText.getHeight();
    SampleText.set({'left': left, 'top': top});
    window.canvas.add(SampleText).renderAll();
    TShirtDesignTool.defaultEditorPanel(Text);
}
    , undo: function () {
    TShirtDesignTool.isUndoMode = false;
    if (TShirtDesignTool.undoObjects.length > 0) {
        var object = TShirtDesignTool.undoObjects.pop();
        if (object) {
            if (object.operation === 'added') {
                window.canvas.remove(object.object);
            }
            if (object.operation === 'deleted') {
                window.canvas.add(object.object);
            }
        }

    }
    TShirtDesignTool.isUndoMode = true;
}
    , redo: function () {
    TShirtDesignTool.isUndoMode = true;
    if (TShirtDesignTool.redoObjects.length > 0) {
        var object = TShirtDesignTool.redoObjects.pop();
        if (object) {
            if (object.operation === 'added') {
                window.canvas.remove(object.object);
            }
            if (object.operation === 'deleted') {
                window.canvas.add(object.object);
            }
        }

    }
    //TShirtDesignTool.isUndoMode=true;
}
    , showPanel: function (panelToshow) {
    TShirtDesignTool.panels.forEach(function (panel) {
        panel === panelToshow ? $('#' + panel).fadeIn(500) : $('#' + panel).hide();
    });
}
    , getCanvasActiveObject: function () {
    return window.canvas.getActiveObject() || window.canvas.item(0);
    //throw new Error('This is not an error. This is just to abort javascript');
}
    , defaultEditorPanel: function (Text) {
    TShirtDesignTool.showPanel('editor-panel');
    textArea.value = Text;
    $('#font-family .dd-selected').get(0).innerHTML = 'Select font family';
    $('#font-style .dd-selected').get(0).innerHTML = 'Select font style';
    textSpacing.value = 0;
    fontSizing.value = 30;
    if (textOutline.checked)
        textOutline.checked = false;
    if (textCircular.checked)
        textCircular.checked = false;
    $('#textArcSlider').slider({disabled: false});
    $('#textArcSlider').slider('value', 0);
    $('#text-color').spectrum("set", '#000');
    $("#outline-properties").hide();
}
    , chooseTShirtPanel: function () {
    TShirtDesignTool.showPanel('chooseTShirtPanel');
    TShirtDesignTool.isPersonalizationMode = false;
}
    , changeTShirtColor: function (color) {
    //var color=color.replace(' ','');
    var img = new Image();
    img.onload = function () {
        window.canvas.backgroundImage._element.src = img.src;
        canvas.renderAll();
        TShirtDesignTool.selectedTShirt.color = color;

        $('#chooseTShirtPanel fieldset a').each(function () {
            if (this.title === TShirtDesignTool.selectedTShirt.color) {
                if (!$(this).hasClass('color-selected'))
                    $(this).addClass('color-selected');
            }
            else {
                if ($(this).hasClass('color-selected'))
                    $(this).removeClass('color-selected');
            }
        });
    };
    img.onerror = function () {
        alert('Sorry! This color is not available right now :( ');
        return;
    };
    img.src = '/TshirtDesignTool/img/' + color + '-1-' + TShirtDesignTool.selectedTShirt.side + '.jpg';

}
    , showTShirtCollection: function () {

}
    , textEditorPanel: function () {
    var selectedObject = window.canvas.getActiveObject();
    if (!selectedObject)
        return;
    TShirtDesignTool.showPanel('editor-panel');
    textArea.value = selectedObject.text;
    $('#font-family .dd-option-value').each(function () {
        if ($(this).val() == selectedObject.fontFamily) {
            $($('a.dd-selected')[0]).text(selectedObject.fontFamily)
        }
    });
    if (selectedObject.letterSpacing !== undefined)
        textSpacing.value = selectedObject.letterSpacing;
    if (selectedObject.spacing !== undefined)
        textSpacing.value = (selectedObject.spacing );
    fontSizing.value = selectedObject.fontSize;

    $('#text-color').spectrum("set", selectedObject.fill);

    $('#font-style .dd-option-text').each(function () {
        if ((this.innerHTML == selectedObject.fontStyle) || ( this.innerHTML == selectedObject.fontWeight ) || ( this.innerHTML == selectedObject.textDecoration)) {
            if ($(this).closest('a').children().length === 3) {
                $(this).closest('a').find('input').after('<img class="dd-option-image" src="img/check-mark.png">');
                //console.log($(this).closest('a').get(0).innerHTML);
            }
        }
        else {
            if ($(this).closest('a').children().length === 4) {
                $(this).closest('a').find('img').remove();
                //console.log($(this).closest('a').get(0).innerHTML);
            }
        }

    });
    if (selectedObject.effect == 'circular') {
        if (!textCircular.checked)
            textCircular.checked = true;
        $('#textArcSlider').slider({disabled: true});
    }
    if (selectedObject.effect == 'arc') {
        if (selectedObject.spacing !== undefined)
            textSpacing.value = (selectedObject.spacing + 9);
        if (textCircular.checked)
            textCircular.checked = false;
        $('#textArcSlider').slider({disabled: false});
        //console.log(selectedObject.reverse)
        var multiplier = selectedObject.reverse ? 1 : -1;
        var sliderValue = 150 - ((100 * selectedObject.radius) / TShirtDesignTool.arcTextWidth);
        //console.log(sliderValue)
        $('#textArcSlider').slider('value', multiplier * sliderValue);
    }
    if (selectedObject.type === 'text') {
        if (textCircular.checked)
            textCircular.checked = false;
        $('#textArcSlider').slider({disabled: false});
        $('#textArcSlider').slider('value', 0);
    }

    if (selectedObject.stroke) {
        textOutline.checked = true;
        //console.log(selectedObject.stroke)
        //console.log(selectedObject.strokeWidth)
        if ($("#outline-properties").get(0).style['display'] === 'none')
            $("#outline-properties").fadeIn(100);
        $('#text-outline-color').spectrum("set", selectedObject.stroke);
        $('#text-outline-slider .ui-slider-range').css('background', selectedObject.stroke);
        $('#text-outline-slider').slider('value', selectedObject.strokeWidth * 100);
    }
    else {
        textOutline.checked = false;
        $("#outline-properties").hide();
    }

    //if(selectedObject.strokeWidth)
    //     $('#text-outline-slider').slider('value', selectedObject.strokeWidth*100);

}
    , addTextPanel: function () {
    TShirtDesignTool.showPanel('text-panel');
    $('#text-panel textarea').val('');
    TShirtDesignTool.isPersonalizationMode = false;
}
    , changeToClipartPanel: function () {
    TShirtDesignTool.showPanel('clip-art-panel');
    TShirtDesignTool.isPersonalizationMode = false;
}
    , clipartEditorPanel: function () {
    TShirtDesignTool.showPanel('edit-clipart-panel');
    var activeObject = window.canvas.getActiveObject();
    //console.log(activeObject.paths[pathList.options.selectedIndex].fill)
    $('#svgFill').spectrum("set", activeObject.paths[pathList.options.selectedIndex].fill);
    //$('.k-selected-color').get(2).style['background-color'] = activeObject.paths[pathList.options.selectedIndex];
    if (activeObject.angle) {
        $('#svgAngle').slider('value', activeObject.angle);
    }
    if (activeObject.opacity)
        $('#svgOpacity').slider('value', activeObject.opacity * 100);
}
    , changeToUploadImagePanel: function () {
    TShirtDesignTool.showPanel('upload-image-panel');
}
    , changeTshirtSideInPersonalizationMode: function (sideName) {
    //alert(sideName)
    window.canvas.clear();
    var imageSrc = '/TshirtDesignTool/img/' + TShirtDesignTool.selectedTShirt.color + '-1-' + sideName + '.jpg';
    var img = new Image();
    img.src = imageSrc;
    img.alt = sideName;
    img.onload = function () {
        window.canvas.setBackgroundImage(img.src, window.canvas.renderAll.bind(canvas), {
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,
            width: canvas.getWidth(),
            height: canvas.getHeight()
        });
    };

    if (sideName === nameSide.value) {
        $(TShirtDesignTool.personalizeObjects).each(function () {
            if (this.id === 'customName') {
                window.canvas.add(this).renderAll();
            }
        });
    }

    if (sideName === numberSide.value) {
        $(TShirtDesignTool.personalizeObjects).each(function () {
            if (this.id === 'customNumber') {
                window.canvas.add(this).renderAll();
            }
        });
    }

}
    , changeTShirtSide: function (sideName) {

    if (TShirtDesignTool.isPersonalizationMode) {
        //alert(sideName)
        TShirtDesignTool.changeTshirtSideInPersonalizationMode(sideName);
        return;
    }

    var _canvas = window.canvas;
    if (_canvas.getObjects().length > 0) {
        TShirtDesignTool.tempDesignData.forEach(function (obj) {
            if (obj.side == _canvas.backgroundImage.id)
                obj.object = _canvas.toJSON();
        })
    }
    else {
        TShirtDesignTool.tempDesignData.forEach(function (obj) {
            if (obj.side == _canvas.backgroundImage.id)
                obj.object = null;
        })
    }
    //console.log(TShirtDesignTool.tempDesignData);
    _canvas.clear();
    TShirtDesignTool.tempDesignData.forEach(function (obj) {
        if (obj.side == sideName && obj.object !== null) {
            _canvas.loadFromJSON(JSON.stringify(obj.object));
        }
        return;
    });

    var imageSrc = '/TshirtDesignTool/img/' + TShirtDesignTool.selectedTShirt.color + '-1-' + sideName + '.jpg';
    var img = new Image();
    img.src = imageSrc;
    img.alt = sideName;
    img.onload = function () {
        _canvas.setBackgroundImage(img.src, _canvas.renderAll.bind(canvas), {
            originX: 'left',
            originY: 'top',
            left: 0,
            id: sideName,
            top: 0,
            width: canvas.getWidth(),
            height: canvas.getHeight()
        });
    };


    TShirtDesignTool.selectedTShirt.side = sideName;
}
    , updateText: function (text) {
    TShirtDesignTool.getCanvasActiveObject().setText(text);
    canvas.renderAll();
}
    , setTextFontFamily: function (fontFamily) {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;
    activeObject.setFontFamily(fontFamily);
    window.canvas.renderAll();
}
    , setTextSpacing: function (e) {

    var activeObject = window.canvas.getActiveObject();
    if (!activeObject)
        return;

    if (activeObject.type == 'text') {
        activeObject.set('letterSpacing', parseInt(e));
    }

    if (activeObject.effect == 'arc')
        activeObject.set({
            spacing: -9 + parseInt(e) * 2
        });

    //if(activeObject.effect=='STRAIGHT')
    //   var ctext=activeObject.text.split("").join(String.fromCharCode(8239));
    //activeObject.setText(ctext);

    canvas.renderAll();
}
    , setTextColor: function (textColor) {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;
    activeObject.setFill(textColor);
    canvas.renderAll();
}
    , setTextArc: function () {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;
    var arcSliderValue = parseInt($("#textArcSlider").slider("value"));
    var isSetArcToSimple = (arcSliderValue > -6 && arcSliderValue < 7) && activeObject.type === 'curvedText';
    var isSetSimpleToArc = (arcSliderValue < -5 || arcSliderValue > 6) && activeObject.type === 'text';

    if (isSetArcToSimple) {
        TShirtDesignTool.arcTextWidth = 0;
        var SampleText = new fabric.Text(activeObject.text, {
            top: activeObject.top,
            left: activeObject.left,
            textAlign: 'left',
            fontFamily: activeObject.fontFamily,
            fontWeight: activeObject.fontWeight,
            textDecoration: activeObject.textDecoration,
            fontSize: activeObject.fontSize,
            letterSpacing: activeObject.spacing + 9,
            fill: activeObject.fill,
            stroke: activeObject.stroke,
            strokeWidth: activeObject.strokeWidth
        });
        window.canvas.remove(activeObject).add(SampleText).setActiveObject(SampleText).renderAll();
        return;
    }

    if (isSetSimpleToArc) {
        TShirtDesignTool.arcTextWidth = activeObject.width;
        var curveText = new fabric.CurvedText(activeObject.text, {
            top: activeObject.top,
            left: activeObject.left,
            fontFamily: activeObject.fontFamily,
            fontWeight: activeObject.fontWeight,
            textDecoration: activeObject.textDecoration,
            reverse: arcSliderValue > 0,
            radius: activeObject.width * 1.5,
            effect: 'arc',
            fontSize: activeObject.fontSize,
            spacing: activeObject.letterSpacing - 9,
            fill: activeObject.fill,
            textAlign: 'center',
            stroke: activeObject.stroke,
            strokeWidth: activeObject.strokeWidth,
            angle: activeObject.angle
        });
        window.canvas.remove(activeObject).add(curveText).setActiveObject(curveText);
    }
    else {
        // text is arc already. change the radius
        activeObject.set({
            reverse: arcSliderValue > 0,
            radius: TShirtDesignTool.arcTextWidth * 1.5 - ((TShirtDesignTool.arcTextWidth / 100) * Math.abs(arcSliderValue))
        });
    }
    canvas.renderAll();
}
    , setTextCircular: function () {
    var activeObject = window.canvas.getActiveObject();
    if (!activeObject)
        return;
    //var isChecked=$('#text-circular').is(':checked');
    //console.log(isChecked);
    if (textCircular.checked && activeObject.effect !== 'circular') {
        $('#textArcSlider').slider({disabled: true});
        var curveText = new fabric.CurvedText(activeObject.text, {
            top: activeObject.top,
            left: activeObject.left,
            fontFamily: activeObject.fontFamily,
            fontWeight: activeObject.fontWeight,
            textDecoration: activeObject.textDecoration,
            width: activeObject.width,
            height: activeObject.height,
            radius: ((activeObject.width / 2 / 3.14) + activeObject.height / 2),
            effect: 'circular',
            fontSize: activeObject.fontSize,
            spacing: 0,
            fill: activeObject.fill,
            textAlign: 'center',
            stroke: activeObject.stroke,
            strokeWidth: activeObject.strokeWidth,
            angle: activeObject.angle
        });
        window.canvas.remove(activeObject).add(curveText).setActiveObject(curveText).renderAll();
    }

    if (!textCircular.checked && activeObject.type !== 'text') {
        $('#textArcSlider').slider({disabled: false});
        var SampleText = new fabric.Text(activeObject.text, {
            top: activeObject.top,
            left: activeObject.left,
            textAlign: 'left',
            fontFamily: activeObject.fontFamily,
            fontWeight: activeObject.fontWeight,
            textDecoration: activeObject.textDecoration,
            fontSize: activeObject.fontSize,
            letterSpacing: 0,
            fill: activeObject.fill,
            stroke: activeObject.stroke,
            strokeWidth: activeObject.strokeWidth
        });
        window.canvas.remove(activeObject).add(SampleText).setActiveObject(SampleText).renderAll();
    }
    //window.canvas.renderAll();
}
    , setFontSize: function () {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;
    activeObject.set('fontSize', parseInt(fontSizing.value));
    window.canvas.renderAll();
}
    , setFontStyle: function (fontStyle) {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;

    if (fontStyle === 'underline') {
        if (activeObject.textDecoration !== 'underline') {
            activeObject.setTextDecoration(fontStyle);
        }
        else {
            activeObject.setTextDecoration('');
        }
    }
    if (fontStyle === 'bold') {
        if (activeObject.fontWeight !== 'bold') {
            activeObject.setFontWeight(fontStyle);
        }
        else {
            activeObject.setFontWeight('');
        }
    }
    if (fontStyle === 'italic') {
        if (activeObject.fontStyle !== 'italic') {
            activeObject.setFontStyle(fontStyle);
        }
        else {
            activeObject.setFontStyle('');
        }
    }
    if (fontStyle === 'oblique') {
        if (activeObject.fontStyle !== 'oblique') {
            activeObject.setFontStyle(fontStyle);
        }
        else {
            activeObject.setFontStyle('');
        }
    }
    window.canvas.renderAll();

    $('#font-style .dd-option-text').each(function () {
        if ((this.innerHTML == activeObject.fontStyle) || ( this.innerHTML == activeObject.fontWeight ) || ( this.innerHTML == activeObject.textDecoration)) {
            if ($(this).closest('a').children().length === 3)
                $(this).closest('a').find('input').after('<img class="dd-option-image" src="img/check-mark.png">');
        }
        else {
            if ($(this).closest('a').children().length === 4)
                $(this).closest('a').find('img').remove();
        }
    });


}
    , addClipartToCanvas: function (imageSrc) {
    fabric.loadSVGFromURL(imageSrc, function (objects, options) {
        var _canvas = window.canvas;
        var obj = fabric.util.groupSVGElements(objects, options);
        obj.left = _canvas.getWidth() / 2 - 50;
        obj.top = _canvas.getHeight() / 2 - 50;
        obj.scaleX = 100 / options.width;
        obj.scaleY = 100 / options.height;
        obj.hasRotatingPoint = false;
        _canvas.add(obj).renderAll();
    });


}
    , setSvgPathColor: function (fillColor) {
    var activeObject = window.canvas.getActiveObject();
    if (!activeObject)
        return;
    activeObject.paths[pathList.options.selectedIndex].fill = fillColor;
    //activeObject.paths[pathList.options.selectedIndex].stroke='red';
    //activeObject.paths[pathList.options.selectedIndex].strokeWidth=5;
    //window.canvas.render(activeObject);
    window.canvas.renderAll();
}
    , svgPathChange: function () {
    var activeObject = window.canvas.getActiveObject();
    if (!activeObject)
        return;
    $('#svgFill').spectrum("set", activeObject.paths[pathList.options.selectedIndex].fill);
}
    , setSvgStroke: function (stroke) {
    var activeObject = window.canvas.getActiveObject();
    if (!activeObject)
        return;
    activeObject.setStroke(stroke);
    $('#svgStrokeWidth .ui-slider-range').css('background', stroke);
    window.canvas.renderAll();

}
    , setSvgAngle: function () {
    var activeObject = window.canvas.getActiveObject();
    if (!activeObject)
        return;
    activeObject.setAngle($('#svgAngle').slider('value'));
    window.canvas.renderAll();
}
    , setSvgOpacity: function () {
    var activeObject = window.canvas.getActiveObject();
    if (!activeObject)
        return;
    activeObject.setOpacity(($('#svgOpacity').slider('value')) * .01);
    window.canvas.renderAll();

}
    , uploadImage: function (e) {
    //console.log(e);
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            var image = new fabric.Image(img);
            image.set({
                left: canvas.getWidth() / 2 - 90,
                top: canvas.getHeight() / 2 - 90,
                width: 180,
                height: 180,
                angle: 0,
                padding: 0
            });
            canvas.add(image);
        }
    }
    reader.readAsDataURL(e.target.files[0]);
    window.canvas.renderAll();

}
    , importDesign: function (e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        //console.log(event.target.result);
        window.canvas.loadFromJSON(event.target.result);
    }
    reader.readAsText(e.target.files[0]);
    window.canvas.renderAll();

}
    , showPersonalizationPanel: function () {
    TShirtDesignTool.showPanel('personalization-panel');
    TShirtDesignTool.isPersonalizationMode = true;
}
    , showPersonalizationPopup: function () {
    $('#personalizeDataTable tbody').html('');
    var row = '<tr>' +
        '<td>1</td>' +
        '<td><input type="text" disabled placeholder="Enter Name"></td>' +
        '<td><input type="text" disabled placeholder="Enter #"></td>' +
        '<td>' +
        '<select>' +
        '<option selected disabled>select product size</option>' +
        '<option>S(small) White Glidan cotton </option>' +
        '<option>M(medium) White Glidan cotton </option>' +
        '<option>L(large) White Glidan cotton </option>' +
        '<option>XL(extra-large) White Glidan cotton </option>' +
        '<option>2XL(double-extra-large) White Glidan cotton </option>' +
        '</select>' +
        '</td>' +
        '</tr>';
    $('#personalizeDataTable tbody').append(row);
    $('#personalizeDataTable tbody tr:nth-child(1) td:nth-child(2) input').prop('disabled', !addName.checked);
    $('#personalizeDataTable tbody tr:nth-child(1) td:nth-child(3) input').prop('disabled', !addNumber.checked);

}
    , showSaveDesignPanel: function () {
        TShirtDesignTool.isPersonalizationMode = false;
        $('#save-design-popup img').attr('src', window.canvas.toDataURL("image/png"));
}
    , saveDesign: function () {
        if (!fileName.value) {
            fileName.placeholder = '* Required.';
            return false;
        }
        var link = document.createElement("a");
        link.style = "visibility:hidden";

        if (fileType.value === 'json') {
            var text = JSON.stringify(window.canvas.toJSON());
            var data = new Blob([text], {type: 'text/plain'});
            link.href = window.URL.createObjectURL(data);
        } else {
            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            link.href = window.canvas.toDataURL("image/png").replace('image/png', 'image/' + fileType.value);
        }

        link.download = fileName.value;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout($('#save-design-popup').foundation('reveal', 'close'), 500);
        fileName.value = '';

}
    , setOutline: function () {
    var activeObject = window.canvas.getActiveObject();
    if (textOutline.checked) {
        $("#outline-properties").fadeIn(200);
        if (!activeObject)
            return;
        $('#text-outline-slider .ui-slider-range').css('background', 'rgb(181,230,29)');
        $('#text-outline-slider .ui-slider-handle').css('background', '#fff');
        $('#text-outline-color').spectrum("set", '#b5e61d');
        //$('#text-outline-color').val('#b5e61d');
        $('#text-outline-slider').slider('value', 0);
        return;
    }
    else {

        $("#outline-properties").hide();
        if (!activeObject)
            return;
        activeObject.setStrokeWidth(0);
    }
    window.canvas.renderAll();
}
    , setOutlineColor: function (strokeColor) {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;
    activeObject.setStroke(strokeColor);
    var strokeWidth = $("#text-outline-slider").slider("value");
    activeObject.setStrokeWidth(strokeWidth * .01);
    $('#text-outline-slider .ui-slider-range').css('background', strokeColor);
    window.canvas.renderAll();
}
    , setOutlineWidth: function () {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;
    activeObject.setStroke($('#text-outline-color').spectrum('get').toHexString());
    var strokeWidth = ($('#text-outline-slider').slider('value')) * .01;
    activeObject.setStrokeWidth(strokeWidth);
    window.canvas.renderAll();
}
    , addPersonalizedName: function () {
    var personalizeName = new fabric.Text('SAMPLE', {
        left: canvas.getWidth() / 2 - 30,
        top: canvas.getHeight() / 2 - 30,
        fontFamily: 'impact',
        fontSize: 32,
        id: 'customName'
    });
    window.canvas.add(personalizeName).renderAll();
    TShirtDesignTool.personalizeObjects.push(personalizeName);
}
    , removePersonalizedName: function () {
    if (window.canvas.getObjects()) {
        $(window.canvas.getObjects()).each(function () {
            if (this.id === 'customName') {
                window.canvas.remove(this);
            }
        });
    }
    $(TShirtDesignTool.personalizeObjects).each(function (item) {
        if (this.id === 'customName') {
            TShirtDesignTool.personalizeObjects.splice(item, 1);
        }
    })
}
    , addPersonalizedNumber: function () {
    var personalizeNumber = new fabric.Text('00', {
        left: canvas.getWidth() / 2 - 30,
        top: canvas.getHeight() / 2 - 30,
        fontFamily: 'impact',
        fontSize: 32,
        //width:40,
        //height:40,
        id: 'customNumber'
    });
    personalizeNumber.setScaleX(1.5);
    personalizeNumber.setScaleY(1.5);
    window.canvas.add(personalizeNumber).renderAll();
    TShirtDesignTool.personalizeObjects.push(personalizeNumber);
}
    , removePersonalizedNumber: function () {
    if (window.canvas.getObjects()) {
        $(window.canvas.getObjects()).each(function () {
            if (this.id === 'customNumber') {
                window.canvas.remove(this);
            }
        });
    }
    $(TShirtDesignTool.personalizeObjects).each(function (item) {
        if (this.id === 'customNumber') {
            TShirtDesignTool.personalizeObjects.splice(item, 1);
        }
    })
}
    , setPersonalizedNameColor: function (color) {
    if (window.canvas.getObjects()) {
        $(window.canvas.getObjects()).each(function () {
            if (this.id === 'customName') {
                this.setFill(color);
            }
        });
    }
    window.canvas.renderAll();
}
    , setPersonalizedNumberColor: function (color) {
    if (window.canvas.getObjects()) {
        $(window.canvas.getObjects()).each(function () {
            if (this.id === 'customNumber') {
                this.setFill(color);
            }
        });
    }
    window.canvas.renderAll();
}
    , setPersonalNameSize: function (inches) {
    if (window.canvas.getObjects()) {
        $(window.canvas.getObjects()).each(function () {
            if (this.id === 'customName') {
                this.setScaleX(inches);
                this.setScaleY(inches);
            }
        });
    }
    window.canvas.renderAll();
}
    , setPersonalNumberSize: function (inches) {
    if (window.canvas.getObjects()) {
        $(window.canvas.getObjects()).each(function () {
            if (this.id === 'customNumber') {
                this.set('scaleX', inches);
                this.set('scaleY', inches);
            }
        });
    }
    window.canvas.renderAll();
}
};


$(document).ready(function () {
    TShirtDesignTool.init();
    $(document).foundation();
});



TShirtDesignTool.panels=[
    'text-panel',
    'editor-panel',
    'clip-art-panel',
    'upload-image-panel',
    'edit-clipart-panel',
    'chooseTShirtPanel',
    'personalization-panel'
];
TShirtDesignTool.fontStyleData=[
    {
        text: "bold",
        value: 1,
        selected: false,
        description: " ",
        imageSrc: ""
    },
    {
        text: "italic",
        value: 2,
        selected: false,
        description: " ",
        imageSrc: ""
    },
    {
        text: "oblique",
        value: 3,
        selected: false,
        description: "  ",
        imageSrc: ""
    },
    {
        text: "underline",
        value: 4,
        selected: false,
        description: " ",
        imageSrc: ""
    }
];
TShirtDesignTool.fontFamilyData=[
    {
        text: "Standard",
        value: 1,
        selected: false,
        description: " ",
        id: "Standard",
        submenu: [
            {text: "Sans-serif", value: "sans-serif", imageSrc: "img/fonts/sans-serif.png"},
            {text: "Times New Roman", value: "Times New Roman", imageSrc: "img/fonts/OldSansBlack.png"},
            {text: "Monospace", value: "Monospace", imageSrc: "img/fonts/monospace.png"},
            {text: "Sansation Light", value: "Sansation_Light", imageSrc: "img/fonts/sansation-light.png"},
            {text: "Squealer", value: "Squealer", imageSrc: "img/fonts/squealer.png"}
        ]
    },
    {
        text: "Modern",
        value: 2,
        selected: false,
        description: "   ",
        id: "Modern",
        submenu: [
            {text: "AgencyFB", value: "AgencyFB", imageSrc: "img/fonts/sans-serif.png"},
            {text: "Verdana", value: "verdana", imageSrc: "img/fonts/OldSansBlack.png"},
            {text: "Harlow Solid Italic", value: "HarlowSolidItalic", imageSrc: "img/fonts/monospace.png"},
            {text: "Bauhaus 93", value: "Bauhaus93", imageSrc: "img/fonts/sansation-light.png"}]
    },
    {
        text: "Old style",
        value: 3,
        selected: false,
        description: "  ",
        id: "Old style",
        submenu: [
            {text: "Impact", value: "impact", imageSrc: "img/fonts/sans-serif.png"},
            {text: "Monospace", value: "Monospace", imageSrc: "img/fonts/monospace.png"},
            {text: "Sansation Light", value: "Sansation_Light", imageSrc: "img/fonts/sansation-light.png"},
            {text: "Squealer", value: "Squealer", imageSrc: "img/fonts/squealer.png"},
            {text: "Megazine", value: "Megazine", imageSrc: "img/fonts/sans-serif.png"}]
    },
    {
        text: "Handwriting",
        value: 4,
        selected: false,
        description: " ",
        id: "Handwriting",
        submenu: [
            {text: "Kunstler Script", value: "KunstlerScript", imageSrc: "img/fonts/kunstlerScript.png"},
            {text: "Coal Hand Luke", value: "CoalHandLuke", imageSrc: "img/fonts/OldSansBlack.png"},
            {text: "Silent Reaction", value: "SilentReaction", imageSrc: "img/fonts/monospace.png"},
            {text: "Le Grand Saut", value: "LeGrandSaut", imageSrc: "img/fonts/sansation-light.png"},
            {text: "Easy Rider", value: "EasyRider", imageSrc: "img/fonts/squealer.png"},
            {text: "Always In Heart", value: "AlwaysInMyHeart", imageSrc: "img/fonts/sans-serif.png"}]
    },
    //{
    //    text: "Bangla",
    //    value: 5,
    //    selected: false,
    //    description: " ",
    //    id: "Bangla",
    //    submenu: [
    //        {text: "SutonnyMJ", value: "SutonnyMJ", imageSrc: "img/fonts/sutuniMJ.png"},
    //        {text: "SolaimanLipi", value: "SolaimanLipi", imageSrc: "img/fonts/SolaimanLipi.png"},
    //        {text: "Monospace", value: "Monospace", imageSrc: "img/fonts/monospace.png"},
    //        {text: "Sansation Light", value: "Sansation_Light", imageSrc: "img/fonts/sansation-light.png"},
    //        {text: "Squealer", value: "Squealer", imageSrc: "img/fonts/squealer.png"},
    //        {text: "SiyamRupali", value: "SiyamRupali", imageSrc: "img/fonts/sans-serif.png"}]
    //}
];
TShirtDesignTool.tempDesignData=[
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
TShirtDesignTool.undoObjects= [];
TShirtDesignTool.redoObjects= [];
TShirtDesignTool.isUndoMode= true;
TShirtDesignTool.selectedTShirt= {color: 'White', side: 'F'};
TShirtDesignTool.arcTextWidth= 0;
TShirtDesignTool.isPersonalizationMode=false;
TShirtDesignTool.personalizeJsonData= {
    frontTemplate: null,
        backTemplate: null,
        memberList: []
};
TShirtDesignTool.personalizeObjects= [];