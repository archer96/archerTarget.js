/*
 * jArcherTarget version 0.1.0
 * 
 *
 * Copyright 2012, Andre Meyering
 * Licensed under the MIT license.
 *
 */
(function ($) {

    $.fn.archerTarget('addTarget', 'wa_field', {
        numberRings: 6,
        colors: ['#404445', '#404445', '#404445', '#404445', '#fce151', '#fce151'],
        strokeColors: ['#c1c4dc', '#c1c4dc', '#c1c4dc', '#c1c4dc', '#0a0f39', '#0a0f39'],
        rating: ['1', '2', '3', '4', '5', '5'],
        diameters: [100, 80, 60, 40, 20, 8]
    });

})(jQuery);
