/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

	/*
		======== A Handy Little QUnit Reference ========
		http://docs.jquery.com/QUnit

		Test methods:
			expect(numAssertions)
			stop(increment)
			start(decrement)
		Test assertions:
			ok(value, [message])
			equal(actual, expected, [message])
			notEqual(actual, expected, [message])
			deepEqual(actual, expected, [message])
			notDeepEqual(actual, expected, [message])
			strictEqual(actual, expected, [message])
			notStrictEqual(actual, expected, [message])
			raises(block, [expected], [message])
	*/

	module('archerTarget', {
		setup: function() {
			this.$elems = $('#chain').children();
		}
	});
	/*
	 * You should be able to pass multiple targets
	 */
	test('is chainable', 1, function() {
		strictEqual(
			this.$elems.archerTarget(),
			this.$elems,
			'should be chainnable'
		);
	});
	/*
	 * The target should be appended to the element
	 */
	test('is appending', 1, function() {
		strictEqual(
			this.$elems.archerTarget().text(),
			'Chain1Chain2Chain3Chain4',
			'content (text) should not have changed; SVG should be appended'
		);
	});



	module('archerTarget.id', {
		setup: function() {
			this.$idTarget = $('#idTarget');
			this.$noIdTarget = $('#id .noIdTarget');

			this.$idTarget.archerTarget();
			this.$noIdTarget.archerTarget();
		}
	});
	/*
	 * SVG groups should have an id based on its warpper id
	 */
	test('has id; target group', 2, function() {

		var id = this.$idTarget.find('svg g')[0].id;

		strictEqual(
			id,
			'idTargetTargetGroup',
			'should have an id based on its wrapper id'
		);

		id = this.$idTarget.find('svg > g')[1].id;

		strictEqual(
			id,
			'idTargetArrowGroup',
			'should have an id based on its wrapper id'
		);
	});
	/*
	 * SVG groups should have an id based on a GUID, if
	 * its wrapper has no id.
	 */
	test('has no id; guid', 2, function() {

		var id = this.$noIdTarget.find('svg > g')[0].id,
			guid = id.slice(0, id.indexOf('TargetGroup')),
			regex = new RegExp('^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$'),
			isGUID = regex.test(guid);

		equal(
			isGUID,
			true,
			'target group has an id based on a GUID; ' + guid
		);

		id = this.$noIdTarget.find('svg > g')[1].id,
		guid = id.slice(0, id.indexOf('ArrowGroup')),
		isGUID = regex.test(guid);

		equal(
			isGUID,
			true,
			'arrow group has an id based on a GUID'
		);
	});



	module('archerTarget.arrows', {
		setup: function() {
			var arrows = [
				{
					data: [
						{ x: 18, y: 50 },
						{ x: 19, y: 92 },
						{ x: 45, y: 75 },
						{ x: 15, y: 34 },
						{ x: 88, y: 99 }
					]
				},
				{
					data: [
						{ x: 18, y: 40 },
						{ x: 5, y: 22 },
						{ x: 35, y: 70 }
					]
				},
				{
					data: [
						{ x: 18, y: 10 },
						{ x: 19, y: 22 },
						{ x: 48, y: 75 }
					]
				}
			];
			this.$target = $('#arrows').archerTarget({
				arrows: arrows
			});
		}
	});
	/*
	 * Checks the number arrowsets and arrows
	 */
	test('number of arrowsets and arrows', 2, function() {

		var arrowsetGroups = this.$target.find('svg g#arrowsArrowGroup > g');

		strictEqual(
			arrowsetGroups.length,
			3,
			'there should be 3 arrowsets'
		);

		var arrows = this.$target.find('svg g#arrowsArrowSet_0 > circle');

		strictEqual(
			arrows.length,
			5,
			'first arrowset should have 5 arrows'
		);


	});

}(window.jQuery || window.Zepto));
