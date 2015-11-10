/**
 * Created by bs062 on 11/3/2015.
 */
//Title: Custom DropDown plugin by PC
//Documentation: http://designwithpc.com/Plugins/ddslick
//Author: PC
//Website: http://designwithpc.com
//Twitter: http://twitter.com/chaudharyp

(function ($) {

    $.fn.ddslick = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exists.');
        }
    };

    var methods = {},

    //Set defauls for the control
        defaults = {
            data: [],
            keepJSONItemsOnTop: false,
            width: 260,
            height: null,
            background: "#eee",
            selectText: "",
            defaultSelectedIndex: null,
            truncateDescription: true,
            imagePosition: "left",
            showSelectedHTML: true,
            clickOffToClose: true,
            onSelected: function () { }
        },

        ddSelectHtml = '<div class="dd-select"><input class="dd-selected-value" type="hidden" /><a class="dd-selected"></a><span class="dd-pointer dd-pointer-down"></span></div>',
        ddOptionsHtml = '<ul class="dd-options"></ul>',

    //CSS for ddSlick
        ddslickCSS = '<style id="css-ddslick" type="text/css">' +
            '.dd-select{ border-radius:2px; border:solid 1px #ccc; position:relative; cursor:pointer;}' +
            '.dd-desc { color:#aaa; display:block; overflow: hidden; font-weight:normal; line-height: 1.4em; }' +
            '.dd-selected{ overflow:hidden; display:block; padding:10px; font-weight:bold;}' +
            '.dd-pointer{ width:0; height:0; position:absolute; right:10px; top:50%; margin-top:-3px;}' +
            '.dd-pointer-down{ border:solid 5px transparent; border-top:solid 5px #000; }' +
            '.dd-pointer-up{border:solid 5px transparent !important; border-bottom:solid 5px #000 !important; margin-top:-8px;}' +
            '.dd-options{ border:solid 1px #ccc; border-top:none; list-style:none; box-shadow:0px 1px 5px #ddd; display:none; position:absolute; z-index:2000; margin:0; padding:0;background:#fff; overflow:auto;}' +
            '.dd-option{ padding:10px; display:block; border-bottom:solid 1px #ddd; overflow:hidden; text-decoration:none; color:#333; cursor:pointer;-webkit-transition: all 0.25s ease-in-out; -moz-transition: all 0.25s ease-in-out;-o-transition: all 0.25s ease-in-out;-ms-transition: all 0.25s ease-in-out; }' +
            '.dd-options > li:last-child > .dd-option{ border-bottom:none;}' +
            '.dd-option:hover{ background:#f3f3f3; color:#000;}' +
            '.dd-submenus{ position: absolute; width: 200px;}' +
            '.dd-submenu-options{ border:solid 1px #ccc; border-top:none; list-style:none; box-shadow:0px 1px 5px #ddd; display:none; position:absolute; z-index:2000; margin:0; padding:0;background:#fff; overflow:auto;}' +
            '.dd-submenu-option{ padding:10px; display:block; border-bottom:solid 1px #ddd; overflow:hidden; text-decoration:none; color:#333; cursor:pointer;-webkit-transition: all 0.25s ease-in-out; -moz-transition: all 0.25s ease-in-out;-o-transition: all 0.25s ease-in-out;-ms-transition: all 0.25s ease-in-out; }' +
            '.dd-submenu-options > li:last-child > .dd-option{ border-bottom:none;}' +
            '.dd-submenu-option:hover{ background:#f3f3f3; color:#000;}' +
            '.dd-selected-description-truncated { text-overflow: ellipsis; white-space:nowrap; }' +
            '.dd-option-selected { background:#f6f6f6; }' +
            '.dd-option-image, .dd-selected-image { vertical-align:middle; float:left; margin-right:5px; max-width:50px;max-height:25px;}' +
            '.dd-image-right { float:right; margin-right:15px; margin-left:5px;}' +
            '.dd-container{ position:relative;}? .dd-selected-text { font-weight:bold}?</style>';

    //CSS styles are only added once.
    if ($('#css-ddslick').length <= 0) {
        $(ddslickCSS).appendTo('head');
    }

    //Public methods
    methods.init = function (options) {
        //Preserve the original defaults by passing an empty object as the target
        var options = $.extend({}, defaults, options);

        //Apply on all selected elements
        return this.each(function () {
            var obj = $(this),
                data = obj.data('ddslick'),
            	submenuTimer;
            //If the plugin has not been initialized yet
            if (!data) {

                var ddSelect = [], ddJson = options.data;

                //Get data from HTML select options
                obj.find('option').each(function () {
                    var $this = $(this), thisData = $this.data();
                    ddSelect.push({
                        text: $.trim($this.text()),
                        value: $this.val(),
                        selected: $this.is(':selected'),
                        description: thisData.description,
                        imageSrc: thisData.imagesrc //keep it lowercase for HTML5 data-attributes
                    });
                });

                //Update Plugin data merging both HTML select data and JSON data for the dropdown
                if (options.keepJSONItemsOnTop)
                    $.merge(options.data, ddSelect);
                else options.data = $.merge(ddSelect, options.data);

                //Replace HTML select with empty placeholder, keep the original
                var original = obj, placeholder = $('<div id="' + obj.attr('id') + '"></div>');
                obj.replaceWith(placeholder);
                obj = placeholder;

                //Add classes and append ddSelectHtml & ddOptionsHtml to the container
                obj.addClass('dd-container').append(ddSelectHtml).append(ddOptionsHtml);

                //Get newly created ddOptions and ddSelect to manipulate
                var ddSelect = obj.find('.dd-select'),
                    ddOptions = obj.find('.dd-options');

                //Set widths
                ddOptions.css({ width: options.width });
                ddSelect.css({ width: options.width, background: options.background });
                obj.css({ width: options.width });

                //Set height
                if (options.height != null)
                    ddOptions.css({ height: options.height, overflow: 'auto' });

                //Add ddOptions to the container. Replace with template engine later.
                $.each(options.data, function (index, item) {
                    if (item.selected) options.defaultSelectedIndex = index;
                    ddOptions.append('<li>' +
                        '<a class="dd-option">' +
                        (item.value ? ' <input class="dd-option-value" type="hidden" value="' + item.value + '" />' : '') +
                        (item.imageSrc ? ' <img class="dd-option-image' + (options.imagePosition == "right" ? ' dd-image-right' : '') + '" src="' + item.imageSrc + '" />' : '') +
                        (item.text ? ' <label class="dd-option-text">' + item.text + '</label>' : '') +
                        (item.description ? ' <small class="dd-option-description dd-desc">' + item.description + '</small>' : '') +
                        '</a>' +
                        '</li>');
                });

                //Save plugin data.
                var pluginData = {
                    settings: options,
                    original: original,
                    selectedIndex: -1,
                    selectedItem: null,
                    selectedData: null
                }
                obj.data('ddslick', pluginData);

                //Check if needs to show the select text, otherwise show selected or default selection
                if (options.selectText.length > 0 && options.defaultSelectedIndex == null) {
                    obj.find('.dd-selected').html(options.selectText);
                }
                else {
                    var index = (options.defaultSelectedIndex != null && options.defaultSelectedIndex >= 0 && options.defaultSelectedIndex < options.data.length)
                        ? options.defaultSelectedIndex
                        : 0;
                    selectIndex(obj, index);
                }

                //EVENTS
                //Displaying options
                obj.find('.dd-select').on('click.ddslick', function () {
                    open(obj);
                });

                //Selecting an option
                obj.find('.dd-option').on('click.ddslick', function () {
                    selectIndex(obj, $(this).closest('li').index());
                });


                obj.find('.dd-option').hover(function () {
                    var dataIndex = $(this).children('.dd-option-value').val()- 1;

                    if(typeof options.data[dataIndex].submenu !== 'undefined')
                    {
                        options.data[dataIndex].submenuHovered = false;
                        openSubMenu(obj, dataIndex);
                        if(submenuTimer != null) clearTimeout(submenuTimer);
                    }

                }, function () {
                    $this = $(this);
                    submenuTimer = setTimeout(function(){
                        var dataIndex = $this.children('.dd-option-value').val()- 1;
                        if(typeof options.data[dataIndex].submenu !== 'undefined' && options.data[dataIndex].submenuHovered == false)
                        {
                            closeSubMenu(obj, dataIndex);
                        }
                    }, 200);
                });



                //Click anywhere to close
                if (options.clickOffToClose) {
                    ddOptions.addClass('dd-click-off-close');
                    obj.on('click.ddslick', function (e) { e.stopPropagation(); });
                    $('body').on('click', function () {
                        $('.dd-click-off-close').slideUp(50).siblings('.dd-select').find('.dd-pointer').removeClass('dd-pointer-up');
                    });
                }

                for(var i=0;i< options.data.length;i++)
                {
                    if(options.data[i].submenu)
                    {
                        obj.append("<ul class='dd-submenus dd-submenu-options' id='dd-submenu-"+ i +"' ></ul>");

                        var top = (i+1)*obj.find('.dd-option').height()*2;
                        if(top<0)   top = -top;

                        var left = obj.find('.dd-select').width();
                        if(left<0)   left = -left;

                        obj.find('#dd-submenu-'+i).css({ "top": top+"px", "left": left+2+"px" });
                        for(var option=0; option < options.data[i].submenu.length; option++)
                        {
                            var item = options.data[i].submenu[option];

                            obj.find("#dd-submenu-"+i).append('<li>' +
                            '<a class="dd-submenu-option">' +
                            (item.value ? ' <input class="dd-option-value" type="hidden" value="' + item.value + '" />' : '') +
                            (item.imageSrc ? ' <img class="dd-option-image' + (options.imagePosition == "right" ? ' dd-image-right' : '') + '" src="' + item.imageSrc + '" />' : '') +
                            (item.text ? ' <label class="dd-option-text">' + item.text + '</label>' : '') +
                            (item.description ? ' <small class="dd-option-description dd-desc">' + item.description + '</small>' : '') +
                            '</a>' +
                            '</li>');
                        }
                    }

                }


                obj.find('.dd-submenus').hover(function(){
                    var id = $(this).attr('id');
                    var index = id.slice('dd-submenu-'.length, id.length);
                    options.data[index].submenuHovered = true;
                }
                , function(){
                    var id = $(this).attr('id');
                    var index = id.slice('dd-submenu-'.length, id.length);
                    options.data[index].submenuHovered = false;
                    closeSubMenu(obj, index);
                 });

                obj.find('.dd-submenu-option').on('click.ddslick', function () {
                    selectSubmenuIndex(obj, $(this).closest('ul').attr('id'), $(this).closest('li').index());
                });

            }
        });
    };

    //Public method to select an option by its index
    methods.select = function (options) {
        return this.each(function () {
            if (options.index)
                selectIndex($(this), options.index);
        });
    }

    //Public method to open drop down
    methods.open = function () {
        return this.each(function () {
            var $this = $(this),
                pluginData = $this.data('ddslick');

            //Check if plugin is initialized
            if (pluginData)
                open($this);
        });
    };

    //Public method to close drop down
    methods.close = function () {
        return this.each(function () {
            var $this = $(this),
                pluginData = $this.data('ddslick');

            //Check if plugin is initialized
            if (pluginData)
                close($this);
        });
    };

    //Public method to destroy. Unbind all events and restore the original Html select/options
    methods.destroy = function () {
        return this.each(function () {
            var $this = $(this),
                pluginData = $this.data('ddslick');

            //Check if already destroyed
            if (pluginData) {
                var originalElement = pluginData.original;
                $this.removeData('ddslick').unbind('.ddslick').replaceWith(originalElement);
            }
        });
    }

    //Private: Select index
    function selectIndex(obj, index) {

        //Get plugin data
        var pluginData = obj.data('ddslick');

        //Get required elements
        var ddSelected = obj.find('.dd-selected'),
            ddSelectedValue = ddSelected.siblings('.dd-selected-value'),
            ddOptions = obj.find('.dd-options'),
            ddPointer = ddSelected.siblings('.dd-pointer'),
            selectedOption = obj.find('.dd-option').eq(index),
            selectedLiItem = selectedOption.closest('li'),
            settings = pluginData.settings,
            selectedData = pluginData.settings.data[index];

        if(typeof selectedData.submenu == 'undefined')
        {
            //Highlight selected option
            obj.find('.dd-option').removeClass('dd-option-selected');
            selectedOption.addClass('dd-option-selected');

            //Update or Set plugin data with new selection
            pluginData.selectedIndex = index;
            pluginData.selectedItem = selectedLiItem;
            pluginData.selectedData = selectedData;

            //If set to display to full html, add html
            if (settings.showSelectedHTML) {
                ddSelected.html(
                    (selectedData.imageSrc ? '<img class="dd-selected-image' + (settings.imagePosition == "right" ? ' dd-image-right' : '') + '" src="' + selectedData.imageSrc + '" />' : '') +
                    (selectedData.text ? '<label class="dd-selected-text">' + selectedData.text + '</label>' : '') +
                    (selectedData.description ? '<small class="dd-selected-description dd-desc' + (settings.truncateDescription ? ' dd-selected-description-truncated' : '') + '" >' + selectedData.description + '</small>' : '')
                );

            }
            //Else only display text as selection
            else ddSelected.html(selectedData.text);

            //Updating selected option value
            ddSelectedValue.val(selectedData.value);

            //BONUS! Update the original element attribute with the new selection
            pluginData.original.val(selectedData.value);
            obj.data('ddslick', pluginData);

            //Close options on selection
            close(obj);

            //Adjust appearence for selected option
            adjustSelectedHeight(obj);

            //Callback function on selection
            if (typeof settings.onSelected == 'function') {
                settings.onSelected.call(this, pluginData);
            }
        }

    }

    function selectSubmenuIndex(obj, parentId, index) {

        var parentIndex = parentId.slice('dd-submenu-'.length, parentId.length);

        //Get plugin data
        var pluginData = obj.data('ddslick');

        //Get required elements
        var ddSelected = obj.find('.dd-selected'),
            ddSelectedValue = ddSelected.siblings('.dd-selected-value'),
            ddOptions = obj.find('.dd-submenu-options'),
            ddPointer = ddSelected.siblings('.dd-pointer'),
            selectedOption = obj.find('#'+parentId).find('.dd-submenu-option').eq(index),
            selectedLiItem = selectedOption.closest('li'),
            settings = pluginData.settings,
            selectedData = pluginData.settings.data[parentIndex].submenu[index];

        //Highlight selected option
        obj.find('.dd-submenu-option').removeClass('dd-option-selected');
        selectedOption.addClass('dd-option-selected');

        //Update or Set plugin data with new selection
        pluginData.selectedIndex = index;
        pluginData.selectedItem = selectedLiItem;
        pluginData.selectedData = selectedData;

        //If set to display to full html, add html
        if (settings.showSelectedHTML) {
            ddSelected.html(
                (selectedData.imageSrc ? '<img class="dd-selected-image' + (settings.imagePosition == "right" ? ' dd-image-right' : '') + '" src="' + selectedData.imageSrc + '" />' : '') +
                (selectedData.text ? '<label class="dd-selected-text">' + selectedData.text + '</label>' : '') +
                (selectedData.description ? '<small class="dd-selected-description dd-desc' + (settings.truncateDescription ? ' dd-selected-description-truncated' : '') + '" >' + selectedData.description + '</small>' : '')
            );

        }
        //Else only display text as selection
        else ddSelected.html(selectedData.text);

        //Updating selected option value
        ddSelectedValue.val(selectedData.value);

        //BONUS! Update the original element attribute with the new selection
        pluginData.original.val(selectedData.value);
        obj.data('ddslick', pluginData);

        //Close options on selection
        closeAllSubmenus(obj);
        close(obj);

        //Adjust appearence for selected option
        //adjustSelectedHeight(obj);

        //Callback function on selection
        if (typeof settings.onSelected == 'function') {
            settings.onSelected.call(this, pluginData);
        }

    }

    //Private: Close the drop down options
    function open(obj) {

        var $this = obj.find('.dd-select'),
            ddOptions = $this.siblings('.dd-options'),
            ddPointer = $this.find('.dd-pointer'),
            wasOpen = ddOptions.is(':visible');

        //Close all open options (multiple plugins) on the page
        $('.dd-click-off-close').not(ddOptions).slideUp(50);
        $('.dd-pointer').removeClass('dd-pointer-up');

        if (wasOpen) {
            ddOptions.slideUp('fast');
            ddPointer.removeClass('dd-pointer-up');
        }
        else {
            ddOptions.slideDown('fast');
            ddPointer.addClass('dd-pointer-up');
        }

        //Fix text height (i.e. display title in center), if there is no description
        adjustOptionsHeight(obj);
    }

    function openSubMenu(obj, dataIndex) {

        var submenuId = '#dd-submenu-'+dataIndex;
        var $this = obj.find(submenuId),
            wasOpen = $this.is(':visible'),
            ddOptions = $this.siblings('.dd-options');


        //Close all open options (multiple plugins) on the page
        $('.dd-click-off-close').not(ddOptions).slideUp(50);

        closeAllSubmenus(obj);

        if (!wasOpen) {
            $this.slideDown('fast');
        }

    }

    function closeSubMenu(obj, dataIndex) {

        var submenuId = '#dd-submenu-'+dataIndex;
        var $this = obj.find(submenuId),
            wasOpen = $this.is(':visible');

        if (wasOpen) {
            $this.slideUp('fast');
        }

    }

    function closeAllSubmenus(obj){
        obj.find('.dd-submenus').hide();
    }

    //Private: Close the drop down options
    function close(obj) {
        //Close drop down and adjust pointer direction
        obj.find('.dd-options').slideUp(50);
        obj.find('.dd-pointer').removeClass('dd-pointer-up').removeClass('dd-pointer-up');
    }

    //Private: Adjust appearence for selected option (move title to middle), when no desripction
    function adjustSelectedHeight(obj) {

        //Get height of dd-selected
        var lSHeight = obj.find('.dd-select').css('height');

        //Check if there is selected description
        var descriptionSelected = obj.find('.dd-selected-description');
        var imgSelected = obj.find('.dd-selected-image');
        if (descriptionSelected.length <= 0 && imgSelected.length > 0) {
            obj.find('.dd-selected-text').css('lineHeight', lSHeight);
        }
    }

    //Private: Adjust appearence for drop down options (move title to middle), when no desripction
    function adjustOptionsHeight(obj) {
        obj.find('.dd-option').each(function () {
            var $this = $(this);
            var lOHeight = $this.css('height');
            var descriptionOption = $this.find('.dd-option-description');
            var imgOption = obj.find('.dd-option-image');
            if (descriptionOption.length <= 0 && imgOption.length > 0) {
                $this.find('.dd-option-text').css('lineHeight', lOHeight);
            }
        });
    }

})(jQuery);
