/**
 * Created by bs062 on 11/24/2015.
 */
var tiles=[];
var shirtCatalog = [
    {
        categoryName: 'T-Shirts',
        subCategory: [
            {
                name: 'Short Sleeve',
                items: [
                    {
                        name: 'Gildan Ultra Cotton T-shirt',
                        sizes: 'YXS-4XL',
                        colorAvailable: 20,
                        minQty: 6,
                        price: 20,
                        imgSrc: 'img/tshirt/1.jpg'
                    },
                    {
                        name: 'Anvil Jersey T-shirt',
                        sizes: 'YXS-4XL',
                        colorAvailable: 20,
                        minQty: 6,
                        price: 20,
                        imgSrc: 'img/tshirt/2.jpg'
                    },
                    {
                        name: 'American Apparel Jersey T-shirt',
                        sizes: 'YXS-4XL',
                        colorAvailable: 20,
                        minQty: 6,
                        price: 20,
                        imgSrc: 'img/tshirt/3.jpg'
                    }
                ]
            },
            {
                name: 'Long Sleeve',
                items: [
                    {
                        name: 'Gildan Ultra Cotton T-shirt',
                        sizes: 'YXS-4XL',
                        colorAvailable: 20,
                        minQty: 6,
                        price: 20,
                        imgSrc: 'img/tshirt/1.jpg'
                    },
                    {
                        name: 'Anvil Jersey T-shirt',
                        sizes: 'YXS-4XL',
                        colorAvailable: 20,
                        minQty: 6,
                        price: 20,
                        imgSrc: 'img/tshirt/2.jpg'
                    },
                    {
                        name: 'American Apparel Jersey T-shirt',
                        sizes: 'YXS-4XL',
                        colorAvailable: 20,
                        minQty: 6,
                        price: 20,
                        imgSrc: 'img/tshirt/3.jpg'
                    }
                ]
            }
        ]
    },
    {
        categoryName: 'POLOS',
        subCategory: [
            {
                name: 'Embroidered Polos',
                items: [
                    {
                        name: 'Gildan Double Pique Polo',
                        sizes: 'YXS-4XL',
                        colorAvailable: 20,
                        minQty: 6,
                        price: 20,
                        imgSrc: 'img/tshirt/1.jpg'
                    },
                    {
                        name: 'Port Authority Silk Touch Polo',
                        sizes: 'YXS-4XL',
                        colorAvailable: 20,
                        minQty: 6,
                        price: 20,
                        imgSrc: 'img/tshirt/2.jpg'
                    },
                    {
                        name: 'Gildan Ladies Double Pique Polo',
                        sizes: 'YXS-4XL',
                        colorAvailable: 20,
                        minQty: 6,
                        price: 20,
                        imgSrc: 'img/tshirt/3.jpg'
                    }
                ]
            },
            {
                name: 'Screen Printed Polos',
                items: [
                    {
                        name: 'Gildan Ultra Cotton Polo',
                        sizes: 'YXS-4XL',
                        colorAvailable: 20,
                        minQty: 6,
                        price: 20,
                        imgSrc: 'img/tshirt/1.jpg'
                    },
                    {
                        name: 'Port Authority Silk Touch Interlock Polo',
                        sizes: 'YXS-4XL',
                        colorAvailable: 20,
                        minQty: 6,
                        price: 20,
                        imgSrc: 'img/tshirt/2.jpg'
                    },
                    {
                        name: 'Hanes 50/50 Jersey Polo',
                        sizes: 'YXS-4XL',
                        colorAvailable: 20,
                        minQty: 6,
                        price: 20,
                        imgSrc: 'img/tshirt/3.jpg'
                    }
                ]
            }
        ]
    }
]

function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }
    return CSV;

    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);



    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

$(document).ready(function () {

    $('.main em a').click(function (e) {
        var i;
        tiles=[];
        switch (e.currentTarget.innerText) {
            case 'T-Shirts':
                i = 0;
                break;
            case 'Ladies & Juniors':
                i = 1;
                break;
            case 'Athletics':
                i = 2;
                break;

        }
        $(shirtCatalog[i].subCategory).each(function () {
            $(this.items).each(function () {
                tiles.push(this);
            })
        });

    });


    $('.main li a').click(function(e){
        console.log( $(e.currentTarget.parentNode).closest('em'))
        console.log(e)
    });



    $(shirtCatalog[0].subCategory).each(function () {
        $(this.items).each(function () {
            tiles.push(this);
        })
    });

    //console.log(tiles)
    //tiles.forEach(function(){
    //    var tile='<div class="productListItem">'+
    //             '<h5>'+this.name+'</h5>'+
    //             '<p class="productThumbnail">'+
    //             '<a href="" class="displayItemDetails">'+
    //             '<img alt='+this.name+' class="displayItemDetails" height="120" src="img/tshirt/5.jpg" width="125"></a>' +
    //             '</p>'+
    //
    //    <div class="productDetails">
    //        <dl>
    //        <dt>Sizes:</dt>
    //    <dd>YXS-3XL</dd>
    //
    //    <dt>Colors Available:</dt>
    //    <dd>21</dd>
    //
    //    <dt>Min Qty:</dt>
    //    <dd>6</dd>
    //
    //    <dt><a href="" class="price-help"
    //    data-popup-name="CI_PriceGuide"
    //    data-popup-options="width=390,height=300,scrollbars=yes,toolbar=yes,menubar=no,location=yes,resizable=yes"
    //    rel="popup"><b>Price Guide:</b></a></dt>
    //    <dd>$ (out of $$$)</dd>
    //    </dl>
    //    <a href="" class="displayItemDetails"></a>
    //        <a href=""
    //    class="sg-btn sg-btn-size-sm sg-btn-text-only sg-btn-color-secondary displayItemDetails"><span
    //    class="sg-btn-text">Details</span></a>
    //    <a href=""
    //    class="sg-btn sg-btn-size-sm sg-btn-text-only sg-btn-color-default displayItemDetails"><span
    //    class="sg-btn-text">Pick a Color</span></a>
    //    </div>
    //        <!--/productDetails-->
    //    </div>
    //})

});