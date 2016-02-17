/**
 * Created by bs062 on 2/16/2016.
 */

TShirtDesignTool.drawText = function () {
    var _canvas = window.canvas;
    var Text = $('#text-panel textarea').val();
    if (Text === "")
        return;
    var SampleText = new fabric.Text(Text, {
        strokeWidth: 0,
        fontSize: 30,
        //textAlign: "center",
        letterSpacing: 0
    });
    var left = _canvas.getWidth() / 2 - SampleText.getWidth() / 2;
    var top = _canvas.getHeight() / 2 - SampleText.getHeight();
    SampleText.set({'left': left, 'top': top});
    window.canvas.add(SampleText).renderAll();
    TShirtDesignTool.defaultEditorPanel(Text);
};

TShirtDesignTool.defaultEditorPanel = function (Text) {

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
};

TShirtDesignTool.textEditorPanel = function () {

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

};

TShirtDesignTool.updateText = function (text) {
    if (window.canvas.getActiveObject()) {
        window.canvas.getActiveObject().setText(text);
        canvas.renderAll();
    }

};

TShirtDesignTool.setTextFontFamily = function (fontFamily) {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;
    activeObject.setFontFamily(fontFamily);
    window.canvas.renderAll();
};

TShirtDesignTool.setTextSpacing = function (e) {

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
};

TShirtDesignTool.setTextColor = function (textColor) {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;
    activeObject.setFill(textColor);
    canvas.renderAll();
};

TShirtDesignTool.setTextArc = function () {

    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;
    //console.log(activeObject);
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
            strokeWidth: activeObject.strokeWidth,
            scaleX: activeObject.getScaleX(),
            scaleY: activeObject.getScaleY(),
            angle: activeObject.angle
        });
        window.canvas.remove(activeObject).add(SampleText).setActiveObject(SampleText).renderAll();
        return;
    }

    if (isSetSimpleToArc) {

        TShirtDesignTool.arcTextWidth = activeObject.width;
        console.log(activeObject.originalState);
        //debugger;
        var curveText = new fabric.CurvedText(activeObject.text, {
            alignX: activeObject.alignX,
            alignY: activeObject.alignY,
            backgroundColor: activeObject.backgroundColor,
            clipTo: activeObject.clipTo,
            fontFamily: activeObject.fontFamily,
            fontStyle: activeObject.fontStyle,
            fontWeight: activeObject.fontWeight,
            fontSize: activeObject.fontSize,
            textAlign: 'center',
            textBackgroundColor: activeObject.textBackgroundColor,
            textDecoration: activeObject.textDecoration,
            globalCompositeOperation: activeObject.globalCompositeOperation,
            reverse: arcSliderValue > 0,
            radius: activeObject.width * 1.5,
            effect: 'arc',
            spacing: activeObject.letterSpacing - 9,
            fill: activeObject.fill,
            fillRule: activeObject.fillRule,
            flipX: activeObject.flipX,
            flipY: activeObject.flipY,
            stroke: activeObject.stroke,
            strokeWidth: activeObject.strokeWidth,
            //width: activeObject.width,
            //height: activeObject.height,
            top: activeObject.top,
            left: activeObject.left,
            lineHeight: activeObject.lineHeight,
            originX: activeObject.originX,
            originY: activeObject.originY,
            //scaleX: activeObject.getScaleX(),
            //scaleY: activeObject.getScaleY(),
            transformMatrix: activeObject.transformMatrix,
            visible: activeObject.visible,
            angle: activeObject.angle
            //originalState: activeObject.originalState
        });

        //for(var property in activeObject.originalState ){
        //    console.log(activeObject.originalState[property]);
        //    curveText.property= activeObject.originalState[property];
        //    debugger;
        //
        //}
        //curveText.originalState= activeObject.originalState;
        //console.log(curveText.originalState);

        window.canvas.remove(activeObject).add(curveText).setActiveObject(curveText).renderAll();
        TShirtDesignTool.getCanvasActiveObject().set({
            scaleX: 1.5,
            scaleY: 1.5
        });
    }
    else {
        // text is arc already. change the radius
        activeObject.set({
            reverse: arcSliderValue > 0,
            radius: TShirtDesignTool.arcTextWidth * 1.5 - ((TShirtDesignTool.arcTextWidth / 100) * Math.abs(arcSliderValue))
        });
    }
    canvas.renderAll();
};

TShirtDesignTool.setTextCircular = function () {
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
};

TShirtDesignTool.setFontSize = function () {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;
    activeObject.set('fontSize', parseInt(fontSizing.value));
    window.canvas.renderAll();
};

TShirtDesignTool.setFontStyle = function (fontStyle) {
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


};

TShirtDesignTool.setOutline = function () {

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
};

TShirtDesignTool.setOutlineColor = function (strokeColor) {

    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;
    activeObject.setStroke(strokeColor);
    var strokeWidth = $("#text-outline-slider").slider("value");
    activeObject.setStrokeWidth(strokeWidth * .01);
    $('#text-outline-slider .ui-slider-range').css('background', strokeColor);
    window.canvas.renderAll();
};

TShirtDesignTool.setOutlineWidth = function () {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;
    activeObject.setStroke($('#text-outline-color').spectrum('get').toHexString());
    var strokeWidth = ($('#text-outline-slider').slider('value')) * .01;
    activeObject.setStrokeWidth(strokeWidth);
    window.canvas.renderAll();
};

// text font data
TShirtDesignTool.fontStyleData = [
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

TShirtDesignTool.fontFamilyData = [
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

TShirtDesignTool.arcTextWidth= 0;