/**
 * Created by bs062 on 2/16/2016.
 */

TShirtDesignTool.saveDesign = function () {
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
