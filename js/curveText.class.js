/**
 * Created by Laptop Dream on 10/11/2015.
 */
(function (global) {

    "use strict";

    var fabric = global.fabric || (global.fabric = {}),
        extend = fabric.util.object.extend,
        clone = fabric.util.object.clone;

    if (fabric.CurvedText) {
        fabric.warn('fabric.CurvedText is already defined');
        return;
    }
    var stateProperties = fabric.Text.prototype.stateProperties.concat();
    stateProperties.push(
        'radius',
        'spacing',
        'reverse',
        'effect',
        'range',
        'largeFont',
        'smallFont'
    );
    var _dimensionAffectingProps = fabric.Text.prototype._dimensionAffectingProps;
    _dimensionAffectingProps['radius'] = true;
    _dimensionAffectingProps['spacing'] = true;
    _dimensionAffectingProps['reverse'] = true;
    _dimensionAffectingProps['fill'] = true;
    _dimensionAffectingProps['effect'] = true;
    _dimensionAffectingProps['width'] = true;
    _dimensionAffectingProps['height'] = true;
    _dimensionAffectingProps['range'] = true;
    _dimensionAffectingProps['fontSize'] = true;
    _dimensionAffectingProps['shadow'] = true;
    _dimensionAffectingProps['largeFont'] = true;
    _dimensionAffectingProps['smallFont'] = true;


    var delegatedProperties = fabric.Group.prototype.delegatedProperties;
    delegatedProperties['backgroundColor'] = true;
    delegatedProperties['textBackgroundColor'] = true;
    delegatedProperties['textDecoration'] = true;
    delegatedProperties['stroke'] = true;
    delegatedProperties['strokeWidth'] = true;
    delegatedProperties['shadow'] = true;

    /**
     * Group class
     * @class fabric.CurvedText
     * @extends fabric.Text
     * @mixes fabric.Collection
     */
    fabric.CurvedText = fabric.util.createClass(fabric.Text, fabric.Collection, /** @lends fabric.CurvedText.prototype */ {
        /**
         * Type of an object
         * @type String
         * @default
         */
        type: 'curvedText',
        /**
         * The radius of the curved Text
         * @type Number
         * @default 50
         */
        radius: 0,
        /**
         * Special Effects, Thanks to fahadnabbasi
         * https://github.com/EffEPi/fabric.curvedText/issues/9
         */
        range: 5,
        smallFont: 10,
        largeFont: 30,
        effect: 'STRAIGHT',
        /**
         * Spacing between the letters
         * @type fabricNumber
         * @default 0
         */
        spacing: 0,
//		letters: null,

        /**
         * Reversing the radius (position of the original point)
         * @type Boolead
         * @default false
         */
        reverse: false,
        /**
         * List of properties to consider when checking if state of an object is changed ({@link fabric.Object#hasStateChanged})
         * as well as for history (undo/redo) purposes
         * @type Array
         */
        stateProperties: stateProperties,
        /**
         * Properties that are delegated to group objects when reading/writing
         * @param {Object} delegatedProperties
         */
        delegatedProperties: delegatedProperties,
        /**
         * Properties which when set cause object to change dimensions
         * @type Object
         * @private
         */
        _dimensionAffectingProps: _dimensionAffectingProps,
        /**
         *
         * Rendering, is we are rendering and another rendering call is passed, then stop rendering the old and
         * rendering the new (trying to speed things up)
         */
        _isRendering: 0,
        /**
         * Added complexity
         */
        complexity: function () {
            this.callSuper('complexity');
        },
        initialize: function (text, options) {
            options || (options = {});
            this.letters = new fabric.Group([], {
                selectable: false,
                padding: 0
            });
            this.__skipDimension = true;
            this.setOptions(options);
            this.__skipDimension = false;
//			this.callSuper('initialize', options);
            this.setText(text);
        },
        setText: function (text) {
            if (this.letters) {
                while (text.length !== 0 && this.letters.size() >= text.length) {
                    this.letters.remove(this.letters.item(this.letters.size() - 1));
                }
                for (var i = 0; i < text.length; i++) {
                    //I need to pass the options from the main options
                    if (this.letters.item(i) === undefined) {
                        this.letters.add(new fabric.Text(text[i]));
                    } else {
                        this.letters.item(i).setText(text[i]);
                    }
                }
            }
            this.callSuper('setText', text);
        },
        _initDimensions: function (ctx) {
            // from fabric.Text.prototype._initDimensions
            // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
            if (this.__skipDimension) {
                return;
            }
            if (!ctx) {
                ctx = fabric.util.createCanvasElement().getContext('2d');
                this._setTextStyles(ctx);
            }
            this._textLines = this.text.split(this._reNewline);
            this._clearCache();
            var currentTextAlign = this.textAlign;
            this.textAlign = 'left';
            this.width = this._getTextWidth(ctx);
            this.textAlign = currentTextAlign;
            this.height = this._getTextHeight(ctx);
            // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
            this._render(ctx);
        },
        _render: function (ctx) {
            var renderingCode = fabric.util.getRandomInt(100, 999);
            this._isRendering = renderingCode;
            if (this.letters) {
                var curAngle = 0,
                    curAngleRotation = 0,
                    angleRadians = 0,
                    align = 0,
                    textWidth = 0,
                    space = parseInt(this.spacing),
                    fixedLetterAngle = 0,
                    arcLetterAngle = [];

                //get text width
                if (this.effect == 'curved') {
                    for (var i = 0, len = this.text.length; i < len; i++) {
                        textWidth += this.letters.item(i).width + space;
                    }
                    textWidth -= space;
                }
                else if (this.effect == 'circular') {
                    //fixedLetterAngle = ((this.letters.item(0).fontSize + space) / this.radius) / (Math.PI/180);
                    var circularTextangle = 2 * (Math.PI);
                    fixedLetterAngle = 2 * (Math.PI) / this.text.length;
                    textWidth = ((this.text.length + 1) * (this.letters.item(0).fontSize + space));
                }
                else if (this.effect == 'arc') {
                    var maxWidthChar = 0;
                    for (var i = 0; i < this.text.length; i++) {
                        //arcLetterAngle[i]=(( this.letters.item(i).width +15 + space+(this.letters.item(i).fontSize-30)) / this.radius) / (Math.PI/180);
                        if (this.letters.item(i).width > maxWidthChar) {
                            maxWidthChar = this.letters.item(i).width;
                        }
                    }
                    if (maxWidthChar > 26)
                        space += 2;
                    else if (maxWidthChar > 23)
                        space += 1;

                    //console.log(maxWidthChar, space)

                    //fixedLetterAngle = (( this.letters.item(0).width +15 + space+(this.letters.item(0).fontSize-30)) / this.radius) / (Math.PI/180);
                    fixedLetterAngle = ((this.letters.item(0).fontSize + space) / this.radius) / (Math.PI / 180);
                    textWidth = ((this.text.length + 1) * (this.letters.item(0).fontSize + space));
                    //textWidth = ((this.text.length+1) * (this.letters.item(0).width+15 + space + (this.letters.item(0).fontSize-30)));
                }
                else if (this.effect == 'STRAIGHT') {
                    //fixedLetterAngle = ((this.letters.item(0).fontSize + space) / this.radius) / (Math.PI/180);
                    textWidth = ((this.text.length + 1) * (this.letters.item(0).fontSize + space));
                }
                // Text align
                if (this.get('textAlign') === 'right') {
                    curAngle = 90 - (((textWidth / 2) / this.radius) / (Math.PI / 180));
                } else if (this.get('textAlign') === 'left') {
                    curAngle = -90 - (((textWidth / 2) / this.radius) / (Math.PI / 180));
                } else {
                    curAngle = -(((textWidth / 2) / this.radius) / (Math.PI / 180));
                }
                if (this.reverse) curAngle = -curAngle;


                var width = 0,
                    multiplier = this.reverse ? -1 : 1,
                    thisLetterAngle = 0,
                    lastLetterAngle = 0;

                for (var i = 0, len = this.text.length; i < len; i++) {
                    if (renderingCode !== this._isRendering)
                        return;

                    for (var key in this.delegatedProperties) {
                        this.letters.item(i).set(key, this.get(key));
                    }

                    this.letters.item(i).set('left', (width));
                    this.letters.item(i).set('top', (0));
                    this.letters.item(i).setAngle(0);
                    this.letters.item(i).set('padding', 0);

                    if (this.effect === 'curved') {
                        thisLetterAngle = ((this.letters.item(i).width + space) / this.radius) / (Math.PI / 180);
                        curAngleRotation = multiplier * ((multiplier * curAngle) + lastLetterAngle + (thisLetterAngle / 2));
                        curAngle = multiplier * ((multiplier * curAngle) + lastLetterAngle);
                        angleRadians = curAngle * (Math.PI / 180);
                        lastLetterAngle = thisLetterAngle;

                        this.letters.item(i).setAngle(curAngleRotation);
                        this.letters.item(i).set('top', multiplier * -1 * (Math.cos(angleRadians) * this.radius));
                        this.letters.item(i).set('left', multiplier * (Math.sin(angleRadians) * this.radius));
                        this.letters.item(i).set('padding', 0);
                        this.letters.item(i).set('selectable', false);

                    }
                    else if (this.effect === 'arc') {//arc
                        curAngle = multiplier * ((multiplier * curAngle) + fixedLetterAngle);
                        angleRadians = curAngle * (Math.PI / 180);
                        this.letters.item(i).set('top', multiplier * -1 * (Math.cos(angleRadians) * this.radius));
                        this.letters.item(i).set('left', multiplier * (Math.sin(angleRadians) * this.radius));
                        this.letters.item(i).set('padding', 0);
                        this.letters.item(i).set('selectable', false);
                    }
                    else if (this.effect === 'circular') {
                        this.letters.item(i).set('top', -1 * (Math.cos(circularTextangle) * this.radius));
                        this.letters.item(i).set('left', -1 * (Math.sin(circularTextangle) * this.radius));
                        this.letters.item(i).set('padding', 0);
                        this.letters.item(i).set('selectable', false);
                        circularTextangle = circularTextangle - fixedLetterAngle;
                    }
                    else if (this.effect === 'STRAIGHT') {

                        this.letters.item(i).set('left', (width));
                        this.letters.item(i).set('top', (0));
                        this.letters.item(i).setAngle(0);
                        width += this.letters.item(i).get('width');
                        this.letters.item(i).set('padding', 0);
                        this.letters.item(i).set({
                            borderColor: 'red',
                            cornerColor: 'green',
                            cornerSize: 6,
                            transparentCorners: false
                        });
                        this.letters.item(i).set('selectable', false);
                    }

                }

                // Update group coords
                this.letters._calcBounds();
                this.letters._updateObjectsCoords();
                this.letters.saveCoords();
                // this.letters.render(ctx);

                this.width = this.letters.width;
                this.height = this.letters.height;
                this.letters.left = -(this.letters.width / 2);
                this.letters.top = -(this.letters.height / 2);
//				console.log('End rendering')
            }
        },
        render: function (ctx, noTransform) {
            // do not render if object is not visible
            if (!this.visible)
                return;
            if (!this.letters)
                return;

            //ctx.save();
            this.transform(ctx);

            var groupScaleFactor = Math.max(this.scaleX, this.scaleY);

            this.clipTo && fabric.util.clipContext(this, ctx);

            //The array is now sorted in order of highest first, so start from end.
            for (var i = 0, len = this.letters.size(); i < len; i++) {
                var object = this.letters.item(i),
                    originalScaleFactor = object.borderScaleFactor,
                    originalHasRotatingPoint = object.hasRotatingPoint;

                // do not render if object is not visible
                if (!object.visible)
                    continue;

//				object.borderScaleFactor=groupScaleFactor;
//				object.hasRotatingPoint=false;

                object.render(ctx);

//				object.borderScaleFactor=originalScaleFactor;
//				object.hasRotatingPoint=originalHasRotatingPoint;
            }
            this.clipTo && ctx.restore();

            //Those lines causes double borders.. not sure why
            //if(!noTransform&&this.active){
            //this.drawBorders(ctx);
            //this.drawControls(ctx);
            //}
//			ctx.restore();
            this.setCoords();
        },
        /**
         * @private
         */
        _set: function (key, value) {
            this.callSuper('_set', key, value);
            if (this.letters) {
                this.letters.set(key, value);
                //Properties are delegated with the object is rendered
//				if (key in this.delegatedProperties) {
//					var i = this.letters.size();
//					while (i--) {
//						this.letters.item(i).set(key, value);
//					}
//				}
                if (key in this._dimensionAffectingProps) {
                    this._initDimensions();
                    this.setCoords();
                }
            }
        },
        toObject: function (propertiesToInclude) {
            var object = extend(this.callSuper('toObject', propertiesToInclude), {
                radius: this.radius,
                spacing: this.spacing,
                reverse: this.reverse,
                effect: this.effect,
                range: this.range,
                smallFont: this.smallFont,
                largeFont: this.largeFont
                //				letters: this.letters	//No need to pass this, the letters are recreated on the fly every time when initiated
            });
            if (!this.includeDefaultValues) {
                this._removeDefaultValues(object);
            }
            return object;
        },
        /**
         * Returns string represenation of a group
         * @return {String}
         */
        toString: function () {
            return '#<fabric.CurvedText (' + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '", "radius": "' + this.radius + '", "spacing": "' + this.spacing + '", "reverse": "' + this.reverse + '" }>';
        },
        /* _TO_SVG_START_ */
        /**
         * Returns svg representation of an instance
         * @param {Function} [reviver] Method for further parsing of svg representation.
         * @return {String} svg representation of an instance
         */
        toSVG: function (reviver) {
            var markup = [
                '<g ',
                'transform="', this.getSvgTransform(),
                '">'
            ];
            if (this.letters) {
                for (var i = 0, len = this.letters.size(); i < len; i++) {
                    markup.push(this.letters.item(i).toSVG(reviver));
                }
            }
            markup.push('</g>');
            return reviver ? reviver(markup.join('')) : markup.join('');
        }
        /* _TO_SVG_END_ */
    });

    /**
     * Returns {@link fabric.CurvedText} instance from an object representation
     * @static
     * @memberOf fabric.CurvedText
     * @param {Object} object Object to create a group from
     * @param {Object} [options] Options object
     * @return {fabric.CurvedText} An instance of fabric.CurvedText
     */
    fabric.CurvedText.fromObject = function (object) {
        return new fabric.CurvedText(object.text, clone(object));
    };

    fabric.util.createAccessors(fabric.CurvedText);

    /**
     * Indicates that instances of this type are async
     * @static
     * @memberOf fabric.CurvedText
     * @type Boolean
     * @default
     */
    fabric.CurvedText.async = false;

})(typeof exports !== 'undefined' ? exports : this);

