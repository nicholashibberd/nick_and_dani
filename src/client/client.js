/*global, describe, expect, it, dump */
(function() {
	"use strict";
	$(function() {
		var div = document.createElement("div");
		div.setAttribute("id", "tdjs");
		div.setAttribute("foo", "bar");
		document.body.appendChild(div);

		dump("Window loaded");
	});
}());
