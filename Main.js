/**
 * Your node program should output the following when run against this file:
 *
 * 	{
 *		classes: [
 *			{
 *				name: 'MyApp.view.Main',
 *				fields: [
 *					{ name: 'message' }
 *				],
 *				methods: [
 *					{ name: 'start' },
 *					{ name: 'stop' },
 *				]
 *			}
 * 		]
 * 	}
 *
 * For this exercise you can assume that classes will always be declared using Ext.define. 
 * The first argument is the class name, second is an object containing class members.
 * You can also assume that any members that are functions are methods and all other members
 * are fields. Keep in mind that it is possible to have multiple classes per file.
 */
Ext.define('MyApp.view.Main', {
	message: 'Hello world',

	start: function() {
		console.log(message);
	},

	stop: function() {
		console.log('stopped')
	}
});

Ext.define('MyApp.view.Main2', {
	message: 'Hello world2',

	start2: function() {
		console.log(message);
	},

	stop2: function() {
		console.log('stopped')
	}
});