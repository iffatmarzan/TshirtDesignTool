/**
 * Created by bs062 on 2/16/2016.
 */

TShirtDesignTool.addPersonalizedName = function () {
    var personalizeName = new fabric.Text('SAMPLE', {
        left: canvas.getWidth() / 2 - 30,
        top: canvas.getHeight() / 2 - 30,
        fontFamily: 'impact',
        fontSize: 32,
        id: 'customName'
    });
    window.canvas.add(personalizeName).renderAll();
    TShirtDesignTool.personalizeObjects.push(personalizeName);
};

TShirtDesignTool.removePersonalizedName = function () {
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
};

TShirtDesignTool.addPersonalizedNumber = function () {
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
};

TShirtDesignTool.removePersonalizedNumber = function () {
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
};

TShirtDesignTool.setPersonalizedNameColor = function (color) {
    if (window.canvas.getObjects()) {
        $(window.canvas.getObjects()).each(function () {
            if (this.id === 'customName') {
                this.setFill(color);
            }
        });
    }
    window.canvas.renderAll();
};

TShirtDesignTool.setPersonalizedNumberColor = function (color) {
    if (window.canvas.getObjects()) {
        $(window.canvas.getObjects()).each(function () {
            if (this.id === 'customNumber') {
                this.setFill(color);
            }
        });
    }
    window.canvas.renderAll();
};

TShirtDesignTool.setPersonalNameSize = function (inches) {
    if (window.canvas.getObjects()) {
        $(window.canvas.getObjects()).each(function () {
            if (this.id === 'customName') {
                this.setScaleX(inches);
                this.setScaleY(inches);
            }
        });
    }
    window.canvas.renderAll();
};

TShirtDesignTool.setPersonalNumberSize = function (inches) {
    if (window.canvas.getObjects()) {
        $(window.canvas.getObjects()).each(function () {
            if (this.id === 'customNumber') {
                this.set('scaleX', inches);
                this.set('scaleY', inches);
            }
        });
    }
    window.canvas.renderAll();
};