/*
 * jArcherTarget version 0.2.0
 * 
 *
 * Copyright 2012, Andre Meyering
 * Licensed under the MIT license.
 *
 */
(function ($) {

    $.fn.archerTarget('addTarget', 'wa_10_recurve', {
        numberRings: 10,
        colors: ['#fff', '#fff', '#535154', '#535154', '#3aa3d9', '#3aa3d9', '#f16e7a', '#f16e7a', '#f6e42e', '#f6e42e'],
        strokeColors: ['#3f3f3f', '#3f3f3f', '#3f3f3f', '#fff', '#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f'],
        rating: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        diameters: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
    });

})(jQuery);
