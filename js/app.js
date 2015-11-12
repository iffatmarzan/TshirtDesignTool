var TShirtDesignTool =
{
    panels: ['text-panel', 'editor-panel', 'clip-art-panel', 'upload-image-panel']
    , fontStyleDropdownData: [
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
]
    , fontFamilyDropdownData: [
    {
        text: "Standard",
        value: 1,
        selected: false,
        description: "                     ",
        id: "Standard",
        submenu: [
            {text: "Sans-serif", value: "sans-serif", imageSrc: "img/fonts/sans-serif.png"},
            {text: "Times New Roman", value: "Times New Roman", imageSrc: "img/fonts/OldSansBlack.png"},
            {text: "Monospace", value: "Monospace", imageSrc: "img/fonts/monospace.png"},
            {text: "Sansation Light", value: "Sansation_Light", imageSrc: "img/fonts/sansation-light.png"},
            {text: "Squealer", value: "Squealer", imageSrc: "img/fonts/squealer.png"},
            {text: "Megazine", value: "Megazine", imageSrc: "img/fonts/sans-serif.png"}]
    },
    {
        text: "Modern",
        value: 2,
        selected: false,
        description: "                      ",
        id: "Modern",
        submenu: [
            {text: "Sans-serif", value: "sans-serif", imageSrc: "img/fonts/sans-serif.png"},
            {text: "OldSansBlack", value: "OldSansBlack", imageSrc: "img/fonts/OldSansBlack.png"},
            {text: "Monospace", value: "Monospace", imageSrc: "img/fonts/monospace.png"},
            {text: "Sansation Light", value: "Sansation_Light", imageSrc: "img/fonts/sansation-light.png"},
            {text: "Squealer", value: "Squealer", imageSrc: "img/fonts/squealer.png"},
            {text: "Megazine", value: "Megazine", imageSrc: "img/fonts/sans-serif.png"}]
    },
    {
        text: "Old style",
        value: 3,
        selected: false,
        description: "                      ",
        id: "Old style",
        submenu: [
            {text: "Sans-serif", value: "sans-serif", imageSrc: "img/fonts/sans-serif.png"},
            {text: "OldSansBlack", value: "OldSansBlack", imageSrc: "img/fonts/OldSansBlack.png"},
            {text: "Monospace", value: "Monospace", imageSrc: "img/fonts/monospace.png"},
            {text: "Sansation Light", value: "Sansation_Light", imageSrc: "img/fonts/sansation-light.png"},
            {text: "Squealer", value: "Squealer", imageSrc: "img/fonts/squealer.png"},
            {text: "Megazine", value: "Megazine", imageSrc: "img/fonts/sans-serif.png"}]
    },
    {
        text: "Handwriting",
        value: 4,
        selected: false,
        description: "                      ",
        id: "Handwriting",
        submenu: [
            {text: "Learning Curve", value: "Learning Curve", imageSrc: "img/fonts/sans-serif.png"},
            {text: "OldSansBlack", value: "OldSansBlack", imageSrc: "img/fonts/OldSansBlack.png"},
            {text: "Monospace", value: "Monospace", imageSrc: "img/fonts/monospace.png"},
            {text: "Sansation Light", value: "Sansation_Light", imageSrc: "img/fonts/sansation-light.png"},
            {text: "Squealer", value: "Squealer", imageSrc: "img/fonts/squealer.png"},
            {text: "Megazine", value: "Megazine", imageSrc: "img/fonts/sans-serif.png"}]
    }
]
    , tempDesignData: [
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
]
    , arcTextWidth: 0
    , init: function () {
    var _this = TShirtDesignTool;
    _this.canvasInit();
}
    , canvasInit: function () {
    window.canvas = new fabric.Canvas('canvas');
    canvas.setHeight($('#canvas-container').height());
    canvas.setWidth($('#canvas-container').width());
    var img = new Image();
    img.src = '/TshirtDesignTool/img/White-1-F.jpg';
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

    canvas.on('object:moving', function (e) {
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
    //document.onkeydown = function(e) {
    //    if (46 === e.keyCode || e.keyCode===110) {
    //        var activeObject=window.canvas.getActiveObject();
    //        if(activeObject!==null){
    //            window.canvas.remove(activeObject);
    //        }
    //        window.canvas.renderAll();
    //        TShirtDesignTool.changeToAddTextPanel();
    //    }
    //}

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
    SampleText.on('selected', function () {
        TShirtDesignTool.changeToEditorPanel();
    });
    window.canvas.add(SampleText).renderAll();
    TShirtDesignTool.changeToDefaultEditorPanel(Text);
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
    , changeToDefaultEditorPanel: function (Text) {
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
    $('.k-selected-color').get(0).style['background-color'] = 'rgb(0,0,0)';
    $("#outline-properties").hide();
}
    , changeToEditorPanel: function () {
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

    $('.k-selected-color').get(0).style['background-color'] = selectedObject.fill;

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
            textSpacing.value = (selectedObject.spacing +9);
        if(textCircular.checked)
            textCircular.checked=false;
        $('#textArcSlider').slider({disabled: false});
        //console.log(selectedObject.reverse)
        var multiplier = selectedObject.reverse ? 1 : -1;
        var sliderValue = 150 - ((100 * selectedObject.radius) / TShirtDesignTool.arcTextWidth);
        //console.log(sliderValue)
        $('#textArcSlider').slider('value', multiplier * sliderValue);
    }
    if (selectedObject.type === 'text') {
        if(textCircular.checked)
            textCircular.checked=false;
        $('#textArcSlider').slider({disabled: false});
        $('#textArcSlider').slider('value', 0);
    }

    if (selectedObject.stroke) {
        textOutline.checked=true;
        //console.log(selectedObject.stroke)
        //console.log(selectedObject.strokeWidth)
        if ($("#outline-properties").get(0).style['display'] === 'none')
            $("#outline-properties").fadeIn(100);
        $('.k-selected-color').get(1).style['background-color'] = selectedObject.stroke;
        $('#text-outline-color').val(selectedObject.stroke);
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
    , changeToAddTextPanel: function () {
    TShirtDesignTool.showPanel('text-panel');
    $('#text-panel textarea').val('');
}
    , changeToClipartPanel: function () {
    TShirtDesignTool.showPanel('clip-art-panel');
}
    , changeToUploadImagePanel: function () {
    TShirtDesignTool.showPanel('upload-image-panel');
}
    , changeTshirtSide: function (sideName) {
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
        if (obj.side == sideName && obj.object !== null)
            _canvas.loadFromJSON(JSON.stringify(obj.object));
        return;
    });
    var imageSrc = '/TshirtDesignTool/img/White-1-' + sideName + '.jpg';
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
    }
}
    , updateText: function (text) {
    TShirtDesignTool.getCanvasActiveObject().setText(text);
    canvas.renderAll();
}
    , setTextFontFamily: function (fontFamily) {
    TShirtDesignTool.getCanvasActiveObject().setFontFamily(fontFamily);
    window.canvas.renderAll();
}
    , setTextSpacing: function (e) {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (activeObject.type == 'text') {
        activeObject.set('letterSpacing', parseInt(e));
    }

    if (activeObject.effect == 'arc')
        activeObject.set({
            spacing: -10 + parseInt(e) * 2
        });

    //if(activeObject.effect=='STRAIGHT')
    //   var ctext=activeObject.text.split("").join(String.fromCharCode(8239));
    //activeObject.setText(ctext);

    canvas.renderAll();
}
    , setTextColor: function (textColor) {
    TShirtDesignTool.getCanvasActiveObject().setFill(textColor);
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
        SampleText.on('selected', function () {
            TShirtDesignTool.changeToEditorPanel();
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
        curveText.on('selected', function () {
            TShirtDesignTool.changeToEditorPanel();
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
            spacing:0,
            fill: activeObject.fill,
            textAlign: 'center',
            stroke: activeObject.stroke,
            strokeWidth: activeObject.strokeWidth,
            angle: activeObject.angle
        });
        curveText.on('selected', function () {
            TShirtDesignTool.changeToEditorPanel();
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
        SampleText.on('selected', function () {
            TShirtDesignTool.changeToEditorPanel();
        });
        window.canvas.remove(activeObject).add(SampleText).setActiveObject(SampleText).renderAll();
    }
    //window.canvas.renderAll();
}
    , setFontSize: function (fontSize) {
    TShirtDesignTool.getCanvasActiveObject().set('fontSize', parseInt(fontSize));
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
    var img = new Image();
    img.src = imageSrc;
    var imgInstance = new fabric.Image(img, {
        left: 100,
        top: 100,
        angle: 0,
        width: 85,
        height: 90
    });
    window.canvas.add(imgInstance).renderAll();
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
    //console.log(e);
    alert('on import design')
    var json;
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.src = event.target.result;
        console.log(event.target.result);
        json = event.target.result;

    }
    //reader.readAsDataURL(e.target.files[0]);
    window.canvas.loadFromJSON(json);
    window.canvas.renderAll();

}
    , saveDesign: function () {
    var _canvas = window.canvas;
    var img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img = _canvas.toDataURL("image/png");
    //img==_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    //console.log(img);
    //img=img.replace("image/octet-stream", "image/jpeg");
    //console.log(img);
    //img=img.replace("image/jpeg", "image/gif");
    //console.log(img);
    //img=img.replace("image/gif", "image/bmp");
    //console.log(img);
    window.open(img);
}
    , setOutline: function () {
    var activeObject = window.canvas.getActiveObject();
    if (textOutline.checked) {
        $("#outline-properties").fadeIn(200);
        if (!activeObject)
            return;
        $('#text-outline-slider .ui-slider-range').css('background', 'rgb(181,230,29)');
        $('#text-outline-slider .ui-slider-handle').css('background', '#fff');
        $('.k-selected-color').get(1).style['background-color'] = 'rgb(181,230,29)';
        $('#text-outline-color').val('#b5e61d');
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
    activeObject.setStroke($('#text-outline-color').val());
    var strokeWidth = ($('#text-outline-slider').slider('value')) * .01;
    activeObject.setStrokeWidth(strokeWidth);
    window.canvas.renderAll();
}
};

$(document).ready(function () {
    TShirtDesignTool.init();

    //$('div').children().each(function(e){
    //    console.log(e)
    //    var id=$(data).attr('id');
    //    if(id!==undefined){
    //        id=$('#'+id);
    //        console.log(id)
    //    }
    //
    //});

    $('#textArcSlider').slider({
        orientation: "horizontal",
        range: "min",
        min: -107,
        max: 108,
        slide: TShirtDesignTool.setTextArc
    });
    $('#textArcSlider').slider("value", 0);

    $("#text-outline-slider").slider({
        orientation: "horizontal",
        range: "min",
        max: 100,
        slide: TShirtDesignTool.setOutlineWidth
    });
    $("#text-outline-slider").slider("value", 0);

    $("#text-color,#text-outline-color").kendoColorPicker({
        palette: "basic",
        tileSize: 4
    });
    $("#upload-image").change(function (e) {
        TShirtDesignTool.uploadImage(e);
    });
    $("#import-design").change(function (e) {
        alert('implementation is in process');
        return;
        TShirtDesignTool.importDesign(e);
    });

    $('#font-style').ddslick({
        data: TShirtDesignTool.fontStyleDropdownData,
        width: 190,
        imagePosition: "left",
        selectText: "Select font style",
        onSelected: function (data) {
            //console.log(data);
            TShirtDesignTool.setFontStyle(data.selectedData.text);
        }
    });

    $('#font-family').ddslick({
        data: TShirtDesignTool.fontFamilyDropdownData,
        width: 300,
        selectText: "Select font family",
        onSelected: function (data) {
            //console.log(data)
            TShirtDesignTool.setTextFontFamily(data.selectedData.value);
        }
    });


    $(document).foundation();
});