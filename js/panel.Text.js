/**
 * Created by bs062 on 2/16/2016.
 */

TShirtDesignTool.prototype.drawText = function () {
    var _canvas = window.canvas;
    var Text = $('#text-panel textarea').val();
    if (Text === "")
        return;
    var SampleText = new fabric.Text(Text, {
        strokeWidth: 0,
        fontSize: 30,
        textAlign: "left",
        letterSpacing: 0
    });
    var left = _canvas.getWidth() / 2 - SampleText.getWidth() / 2;
    var top = _canvas.getHeight() / 2 - SampleText.getHeight();
    SampleText.set({'left': left, 'top': top});
    _canvas.add(SampleText).renderAll();
    this.defaultEditorPanel(Text);
};

TShirtDesignTool.prototype.defaultEditorPanel = function (Text) {

    this.showPanel('editor-panel');
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

TShirtDesignTool.prototype.textEditorPanel = function (selectedObject) {

    // update text-editor panel based on the properties of selected object

        this.showPanel('editor-panel');
        textArea.value = selectedObject.text;
    // set font-family
        $('#font-family .dd-option-value').each(function () {
            if ($(this).val() == selectedObject.fontFamily) {
                $($('a.dd-selected')[0]).text(selectedObject.fontFamily)
            }
        });

        if (selectedObject.letterSpacing){
            textSpacing.value = selectedObject.letterSpacing;
        }

        if (selectedObject.spacing ){
            textSpacing.value = (selectedObject.spacing );
        }

        fontSizing.value = selectedObject.fontSize;

        $('#text-color').spectrum("set", selectedObject.fill);

    // set font-style

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

};

TShirtDesignTool.prototype.updateText = function (text) {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;

    activeObject.setText(text);
    TShirtDesignTool.setTextColor(activeObject.fill);
};

TShirtDesignTool.prototype.setTextFontFamily = function (fontFamily) {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;
    activeObject.setFontFamily(fontFamily);
    TShirtDesignTool.setTextColor(activeObject.fill);
};

TShirtDesignTool.prototype.setTextSpacing = function (e) {

    var activeObject = window.canvas.getActiveObject();
    if (!activeObject){
        return;
    }

    if (activeObject.type == 'text') {
        activeObject.set('letterSpacing', parseInt(e));
    }

    if (activeObject.effect == 'arc')
        activeObject.set({
            spacing: -9 + parseInt(e) * 2
        });

    TShirtDesignTool.setTextColor(activeObject.fill);
};

TShirtDesignTool.prototype.setTextColor = function (textColor) {

    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject){
        return;
    }
    if(activeObject.type==='curvedText' && ( activeObject.getScaleX()!== 1 || activeObject.getScaleY()!== 1 )){
        var scaleX= activeObject.getScaleX();
        var scaleY= activeObject.getScaleY();
        activeObject.setScaleX(1);
        activeObject.setScaleY(1);
    }
    activeObject.setFill(textColor);
    if(scaleX){
        activeObject.setScaleX(scaleX);
    }
    if(scaleY){
        activeObject.setScaleY(scaleY);
    }
    canvas.renderAll();
};

TShirtDesignTool.prototype.setTextArc= function(value){

    var activeObject= window.canvas.getActiveObject();
    if(!activeObject){
        return;
    }
    if( activeObject.type ==='curvedText' &&  ( value > -6 && value < 7) ){
        TShirtDesignTool.setTextArcToSimple(activeObject);
    }
    else if( activeObject.type==='text' &&  ( value < -5 || value > 6) ){
        TShirtDesignTool.setTextSimpleToArc(activeObject, value);
    }
    else{
        activeObject.set({
            reverse: value > 0,
            radius: TShirtDesignTool.arcTextWidth * 1.5 - ((TShirtDesignTool.arcTextWidth / 100) * Math.abs(value))
        });
    }
    TShirtDesignTool.setTextColor(activeObject.fill);
}

TShirtDesignTool.prototype.setTextSimpleToArc = function (activeObject, value) {

    TShirtDesignTool.arcTextWidth = activeObject.width;
    var curveText = new fabric.CurvedText(activeObject.text, {
        scaleX: activeObject.scaleX,
        scaleY: activeObject.scaleY,
        fontFamily: activeObject.fontFamily,
        fontStyle: activeObject.fontStyle,
        fontWeight: activeObject.fontWeight,
        fontSize: activeObject.fontSize,
        textAlign: 'center',
        textDecoration: activeObject.textDecoration,
        reverse: value > 0,
        radius: activeObject.width * 1.5,
        effect: 'arc',
        spacing: activeObject.letterSpacing - 9,
        fill: activeObject.fill,
        stroke: activeObject.stroke,
        strokeWidth: activeObject.strokeWidth,
        top: activeObject.top,
        left: activeObject.left,
        //angle: activeObject.angle
    });

    window.canvas.remove(activeObject).add(curveText).setActiveObject(curveText);
}

TShirtDesignTool.prototype.setTextArcToSimple= function(activeObject){

    TShirtDesignTool.arcTextWidth = 0;
    var SampleText = new fabric.Text(activeObject.text, {
        top: activeObject.top,
        left: activeObject.left,
        textAlign: 'left',
        fontFamily: activeObject.fontFamily,
        fontStyle: activeObject.fontStyle,
        fontWeight: activeObject.fontWeight,
        fontSize: activeObject.fontSize,
        textDecoration: activeObject.textDecoration,
        letterSpacing: activeObject.spacing + 9,
        fill: activeObject.fill,
        stroke: activeObject.stroke,
        strokeWidth: activeObject.strokeWidth,
        scaleX: activeObject.getScaleX(),
        scaleY: activeObject.getScaleY(),
        angle: activeObject.angle
    });
    window.canvas.remove(activeObject).add(SampleText).setActiveObject(SampleText);

}

TShirtDesignTool.prototype.setTextCircular = function () {
    var activeObject = window.canvas.getActiveObject();
    if (!activeObject)
        return;

    if (textCircular.checked && activeObject.effect !== 'circular') {

        $('#textArcSlider').slider({disabled: true});
        var curveText = new fabric.CurvedText(activeObject.text, {
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY,
            top: activeObject.top,
            left: activeObject.left,
            fontFamily: activeObject.fontFamily,
            fontStyle: activeObject.fontStyle,
            fontWeight: activeObject.fontWeight,
            fontSize: activeObject.fontSize,
            textDecoration: activeObject.textDecoration,
            width: activeObject.width,
            height: activeObject.height,
            radius: ((activeObject.width / 2 / 3.14) + activeObject.height / 2),            effect: 'circular',

            spacing: 0,
            fill: activeObject.fill,
            textAlign: 'center',
            stroke: activeObject.stroke,
            strokeWidth: activeObject.strokeWidth,
            angle: activeObject.angle
        });
        window.canvas.remove(activeObject).add(curveText).setActiveObject(curveText);
    }

    if (!textCircular.checked && activeObject.type !== 'text') {
        $('#textArcSlider').slider({disabled: false});
        var SampleText = new fabric.Text(activeObject.text, {
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY,
            top: activeObject.top,
            left: activeObject.left,
            textAlign: 'left',
            fontFamily: activeObject.fontFamily,
            fontStyle: activeObject.fontStyle,
            fontWeight: activeObject.fontWeight,
            fontSize: activeObject.fontSize,
            textDecoration: activeObject.textDecoration,
            letterSpacing: 0,
            fill: activeObject.fill,
            stroke: activeObject.stroke,
            strokeWidth: activeObject.strokeWidth
        });
        window.canvas.remove(activeObject).add(SampleText).setActiveObject(SampleText);
    }
    TShirtDesignTool.setTextColor(activeObject.fill);
};

TShirtDesignTool.prototype.setFontSize = function () {
    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;

    activeObject.set('fontSize', parseInt(fontSizing.value));
    TShirtDesignTool.setTextColor(activeObject.fill);
};

TShirtDesignTool.prototype.setFontStyle = function (fontStyle) {
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

    TShirtDesignTool.setTextColor(activeObject.fill);

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

TShirtDesignTool.prototype.setOutline = function () {

    var activeObject = window.canvas.getActiveObject();

    if (textOutline.checked) {
        $("#outline-properties").fadeIn(200);
        if (!activeObject)
            return;
        $('#text-outline-slider .ui-slider-range').css('background', 'rgb(181,230,29)');
        $('#text-outline-slider .ui-slider-handle').css('background', '#fff');
        $('#text-outline-color').spectrum("set", '#b5e61d');
        $('#text-outline-slider').slider('value', 0);

    }
    else {
        $("#outline-properties").hide();
        TShirtDesignTool.setOutlineWidth(0);
    }
};

TShirtDesignTool.prototype.setOutlineColor = function (strokeColor) {

    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;

    activeObject.setStroke(strokeColor);
    var strokeWidth = $("#text-outline-slider").slider("value");
    activeObject.setStrokeWidth(strokeWidth * .01);
    $('#text-outline-slider .ui-slider-range').css('background', strokeColor);
    TShirtDesignTool.setTextColor(activeObject.fill);
};

TShirtDesignTool.prototype.setOutlineWidth = function (strokeWidth) {

    var activeObject = TShirtDesignTool.getCanvasActiveObject();
    if (!activeObject)
        return;

    activeObject.setStroke($('#text-outline-color').spectrum('get').toHexString());
    activeObject.setStrokeWidth(strokeWidth);
    TShirtDesignTool.setTextColor(activeObject.fill);
};

// text font data
TShirtDesignTool.prototype.fontStyleData = [
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

TShirtDesignTool.prototype.fontFamilyData = [
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

TShirtDesignTool.prototype.arcTextWidth= 0;