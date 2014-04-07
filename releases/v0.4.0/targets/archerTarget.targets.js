/*!
 * archerTarget.js - Targets - v0.3.9 - 2014-01-24
 * https://github.com/archer96/archerTarget.js
 * Copyright (c) 2012 - 2014 Andre Meyering;
 * Licensed MIT
 */
(function (window, document, undefined) {

'use strict';

ArcherTarget.addTarget('dfbv_spiegel', {
	numberRings: 6,
	colors: ['#030727', '#030727', '#030727', '#030727', '#fff', '#fff'],
	strokeColors: ['#c1c4dc', '#c1c4dc', '#c1c4dc', '#c1c4dc', '#0a0f39', '#0a0f39'],
	rating: ['1', '2', '3', '4', '5', '5'],
	diameters: [100, 80, 60, 40, 20, 8]
});

ArcherTarget.addTarget('dfbv_spiegel_spot', {
	numberRings: 3,
	colors: ['#030727', '#fff', '#fff'],
	strokeColors: ['#c1c4dc', '#c1c4dc', '#0a0f39'],
	rating: ['4', '5', '5'],
	diameters: [100, 50, 20]
});

ArcherTarget.addTarget('wa_10_6_recurve', {
	numberRings: 5,
	colors: ['#3aa3d9', '#f16e7a', '#f16e7a', '#f6e42e', '#f6e42e'],
	strokeColors: ['#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f'],
	rating: ['6', '7', '8', '9', '10'],
	diameters: [100, 80, 60, 40, 20]
});

ArcherTarget.addTarget('wa_10_6_compound', {
	numberRings: 5,
	colors: ['#3aa3d9', '#f16e7a', '#f16e7a', '#f6e42e', '#f6e42e'],
	strokeColors: ['#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f'],
	rating: ['6', '7', '8', '9', '10'],
	diameters: [100, 80, 60, 40, 7]
});

ArcherTarget.addTarget('wa_10_compound', {
	numberRings: 10,
	colors: ['#fff', '#fff', '#535154', '#535154', '#3aa3d9', '#3aa3d9',
		'#f16e7a', '#f16e7a', '#f6e42e', '#f6e42e'],
	strokeColors: ['#3f3f3f', '#3f3f3f', '#3f3f3f', '#fff', '#3f3f3f',
		'#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f'],
	rating: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
	diameters: [100, 90, 80, 70, 60, 50, 40, 30, 20, 4]
});

ArcherTarget.addTarget('wa_10_recurve', {
	numberRings: 10,
	colors: ['#fff', '#fff', '#535154', '#535154', '#3aa3d9', '#3aa3d9',
		'#f16e7a', '#f16e7a', '#f6e42e', '#f6e42e'],
	strokeColors: ['#3f3f3f', '#3f3f3f', '#3f3f3f', '#fff', '#3f3f3f',
		'#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f'],
	rating: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
	diameters: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
});

ArcherTarget.addTarget('wa_field', {
	numberRings: 6,
	colors: ['#404445', '#404445', '#404445', '#404445', '#fce151', '#fce151'],
	strokeColors: ['#c1c4dc', '#c1c4dc', '#c1c4dc', '#c1c4dc', '#0a0f39', '#0a0f39'],
	rating: ['1', '2', '3', '4', '5', '5'],
	diameters: [100, 80, 60, 40, 20, 8]
});

ArcherTarget.addTarget('wa_x', {
	numberRings: 11,
	colors: ['#fff', '#fff', '#535154', '#535154', '#3aa3d9', '#3aa3d9',
		'#f16e7a', '#f16e7a', '#f6e42e', '#f6e42e', '#f6e42e'],
	strokeColors: ['#3f3f3f', '#3f3f3f', '#3f3f3f', '#fff', '#3f3f3f',
		'#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f'],
	rating: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'X'],
	diameters: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 4]
});

ArcherTarget.addTarget('wa_x_5', {
	numberRings: 7,
	colors: ['#3aa3d9', '#3aa3d9', '#f16e7a', '#f16e7a', '#f6e42e', '#f6e42e', '#f6e42e'],
	strokeColors: ['#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f'],
	rating: ['5', '6', '7', '8', '9', '10', 'X'],
	diameters: [100, 83.4, 66.8, 50.2, 33.6, 17, 7]
});

ArcherTarget.addTarget('wa_x_6', {
	numberRings: 6,
	colors: ['#3aa3d9', '#f16e7a', '#f16e7a', '#f6e42e', '#f6e42e', '#f6e42e'],
	strokeColors: ['#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f', '#3f3f3f'],
	rating: ['6', '7', '8', '9', '10', 'X'],
	diameters: [100, 80, 60, 40, 20, 7]
});


}(window, document));
