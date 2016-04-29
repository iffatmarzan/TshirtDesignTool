// -------------------------------------------------------------------------
// <copyright company="BrainStation 23 Ltd.">
//     Copyright (c) 2016 [BrainStation 23 Ltd.](http://brainstation-23.com/)
// </copyright>
// <updated>29-04-2016</updated>
// <author>Mahbubur Rahman Manik</author>
// -------------------------------------------------------------------------

(function (extend) {
    extend.selectedTShirt= {color: 'Blue', side: 'F'};
    extend.changeTShirtColor = function (color) {
        var img = new Image();
        img.onload = function () {
            window.canvas.backgroundImage._element.src = img.src;
            canvas.renderAll();
        };
        img.onerror = function () {
            alert('Sorry! This color is not available right now :( ');
            return;
        };
        img.src = '/TshirtDesignTool/img/' + color + '-1-' + this.selectedTShirt.side + '.jpg';
        this.selectedTShirt.color = color;
        $('#chooseTShirtPanel fieldset a').each(function () {
            if (this.title === color) {
                if (!$(this).hasClass('color-selected'))
                    $(this).addClass('color-selected');
            }
            else {
                if ($(this).hasClass('color-selected'))
                    $(this).removeClass('color-selected');
            }
        });

    };
    extend.changeTShirtSide = function (sideName) {

        if (this.isPersonalizationMode) {
            //alert(sideName)
            this.changeTshirtSideInPersonalizationMode(sideName);
            return;
        }

        var _canvas = window.canvas;
        if (_canvas.getObjects().length > 0) {
            this.tempDesignData.forEach(function (obj) {
                if (obj.side == _canvas.backgroundImage.id)
                    obj.object = _canvas.toJSON();
            })
        }
        else {
            this.tempDesignData.forEach(function (obj) {
                if (obj.side == _canvas.backgroundImage.id)
                    obj.object = null;
            })
        }
        //console.log(this.tempDesignData);
        _canvas.clear();
        this.tempDesignData.forEach(function (obj) {
            if (obj.side == sideName && obj.object !== null) {
                _canvas.loadFromJSON(JSON.stringify(obj.object));
            }
            return;
        });

        var imageSrc = '/TshirtDesignTool/img/' + this.selectedTShirt.color + '-1-' + sideName + '.jpg';
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


        this.selectedTShirt.side = sideName;
    };
    extend.showTShirtCollection= function () {
        // not implemented yet
        // will show the collection of shirts

    };
})(TShirtDesignTool);