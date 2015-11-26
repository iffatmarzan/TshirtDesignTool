/**
 * Created by bs062 on 11/24/2015.
 */

var shirtCatalog = [
    {
        categoryName: 'T-SHIRTS',
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

$(document).ready(function () {
    var tiles=[];
    $(shirtCatalog[0].subCategory).each(function () {
        $(this.items).each(function () {
            tiles.push(this);
        })
    })
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