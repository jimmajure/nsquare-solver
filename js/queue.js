/*

Queue.js

A function to represent a queue

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

 */

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */
function Queue() {

	// initialise the queue and offset
	this.queue = [];
	this.offset = 0;

	// Returns the length of the queue.
	this.getLength = function() {
		return (this.queue.length - this.offset);
	}

	// Returns true if the queue is empty, and false otherwise.
	this.isEmpty = function() {
		return (this.queue.length == 0);
	}

	/*
	 * Enqueues the specified item. The parameter is:
	 * 
	 * item - the item to enqueue
	 */
	this.enqueue = function(item) {
		item.inFrontier = true;
		this.queue.push(item);
	}

	/*
	 * Dequeues an item and returns it. If the queue is empty, the value
	 * 'undefined' is returned.
	 */
	this.dequeue = function() {

		// if the queue is empty, return immediately
		if (this.queue.length == 0)
			return undefined;

		// store the item at the front of the queue
		var item = this.queue[this.offset];

		// increment the offset and remove the free space if necessary
		if (++this.offset * 2 >= this.queue.length) {
			this.queue = this.queue.slice(this.offset);
			this.offset = 0;
		}

		// return the dequeued item
		item.inFrontier = false;
		return item;

	}

	/*
	 * Returns the item at the front of the queue (without dequeuing it). If the
	 * queue is empty then undefined is returned.
	 */
	this.peek = function() {
		return (this.queue.length > 0 ? this.queue[this.offset] : undefined);
	}

	/*
	 * A simple function to see if an object is contained in the queue...
	 */
	this.contains = function(o, accessor) {
		var os = JSON.stringify(o);
		for (var i=this.offset; i<this.queue.length; i++) {
			if (os == JSON.stringify(accessor(this.queue[i]))) {
				return true;
			}
		}
		return false;
	}
}


function Stack() {

	// initialise the queue and offset
	this.stack = [];

	// Returns the length of the queue.
	this.getLength = function() {
		return this.stack.length;
	}

	// Returns true if the queue is empty, and false otherwise.
	this.isEmpty = function() {
		return (this.stack.length == 0);
	}

	/*
	 * Enqueues the specified item. The parameter is:
	 * 
	 * item - the item to enqueue
	 */
	this.enqueue = function(item) {
		item.inFrontier = true;
		this.stack.push(item);
	}

	/*
	 * Dequeues an item and returns it. If the queue is empty, the value
	 * 'undefined' is returned.
	 */
	this.dequeue = function() {

		// if the queue is empty, return immediately
		if (this.stack.length == 0)
			return undefined;

		// store the item at the front of the queue
		var item = this.stack.pop();

		// return the dequeued item
		item.inFrontier = false;
		return item;

	}

	/*
	 * Returns the item at the front of the queue (without dequeuing it). If the
	 * queue is empty then undefined is returned.
	 */
	this.peek = function() {
		return (this.stack.length > 0 ? this.stack[this.stack.length-1] : undefined);
	}

	/*
	 * A simple function to see if an object is contained in the queue...
	 */
	this.contains = function(o, accessor) {
		var os = JSON.stringify(o);
		for (var i=0; i<this.stack.length; i++) {
			if (os == JSON.stringify(accessor(this.stack[i]))) {
				return true;
			}
		}
		return false;
	}
}
