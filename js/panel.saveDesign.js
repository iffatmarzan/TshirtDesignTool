// -------------------------------------------------------------------------
// <copyright company="BrainStation 23 Ltd.">
//     Copyright (c) 2016 [BrainStation 23 Ltd.](http://brainstation-23.com/)
// </copyright>
// <updated>29-04-2016</updated>
// <author>Mahbubur Rahman Manik</author>
// -------------------------------------------------------------------------

(function (extend) {
    extend.saveDesign = function () {
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

    };
})(TShirtDesignTool);