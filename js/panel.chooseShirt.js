/**
 * Created by bs062 on 2/16/2016.
 */

 //default selection
TShirtDesignTool.selectedTShirt= {color: 'Blue', side: 'F'};

TShirtDesignTool.changeTShirtColor = function (color) {
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

};

TShirtDesignTool.changeTShirtSide = function (sideName) {

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
};

TShirtDesignTool.showTShirtCollection= function () {
    // not implemented yet
    // will show the collection of shirts

};