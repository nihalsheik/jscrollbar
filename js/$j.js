'use strict'

function $j(selector, context = document) {

	if (!selector) {
		return null;
	}

	var e;

	if (selector instanceof WebElement) {
		return selector;

	} else if (context instanceof WebElement) {

		e = [];
		context.elements.forEach(ele => e.push(...Array.from(ele.querySelectorAll(selector))));

	} else if (selector instanceof HTMLElement) {
		e = selector;

	} else if (selector instanceof NodeList) {
		e = Array.from(selector);

	} else if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
		var e = selector.substring(1, selector.length - 1).trim();
		if (e.indexOf(" ") > -1) {
			var template = document.createElement('template');
			template.innerHTML = selector;
			e = template.content.firstChild;
		} else {
			e = document.createElement(e);
		}

	} else if (selector[0] == '#') {
		e = context.querySelector(selector);

	} else {
		e = context.querySelectorAll(selector);

	}

	return new WebElement((e instanceof NodeList) ? Array.from(e) : e);
}

$j.create = function (tag) {
	return new WebElement(document.createElement(tag));
}


function WebElement(e) {
	if (e == null || e == undefined) {
		e = [];
	} else if (!(e instanceof Array)) {
		e = [e];
	}
	this.index = 0;
	this.elements = e;
	this.length = e.length;
	e = null;
}

WebElement.prototype = {

	tagName: function () {
		return this.length == 0 ? '' : this.elements[0].tagName;
	},

	copyAttrFrom: function (source) {
		return $e.copyAttrFrom.call(this, source);
	},

	removeDataAttrs: function () {
		return $e.removeDataAttrs.call(this);
	},

	hasElement: function () {
		return this.length > 0;
	},

	removeAttr: function (attr) {
		this.get(0).removeAttribute(attr);
		return this;
	},

	iterate: function (cb) {
		for (var i = 0; i < this.length; i++) {
			cb(this, this.index);
			this.index++;
		}
		this.index = 0;
	},

	setIndex: function (index) {
		this.index = index;
		return this;
	},

	first: function () {
		return this.length == 0 ? this : this.item(0);
	},

	firstElement: function () {
		return this.get(0);
	},

	get: function (index) {
		if (this.length == 0) return null;
		return this.elements[(index == undefined) ? this.index : index];
	},

	item: function (index) {
		return new WebElement(this.get(index));
	},

	css: function () {
		return $e.css.call(this, arguments);
	},

	attr: function () {
		return $e.attr.call(this, arguments);
	},

	attrs: function () {
		return $e.attrs.call(this);
	},

	html: function (v) {
		return $e.html.call(this, v);
	},

	text: function (v) {
		return $e.text.call(this, v);
	},

	hasAttr: function () {
		return $e.hasAttr.call(this);
	},

	show: function () {
		return $e.show.call(this);
	},

	hide: function () {
		return $e.hide.call(this);
	},

	addClass: function (clazz) {
		return $e.addClass.call(this, clazz);
	},

	removeClass: function (clazz) {
		return $e.removeClass.call(this, clazz);
	},

	eachChild: function (cb) {
		this.elements.forEach((e, i) => cb(new WebElement([e]), i));
		return this;
	},

	each: function (cb) {
		this.elements.forEach((e, i) => cb(e, i));
		return this;
	},

	find: function (selector) {
		return $e.find.call(this, selector);
	},

	prepend: function (child) {
		return $e.prepend.call(this, child)
	},

	append: function (child) {
		return $e.append.call(this, child);
	},

	appendTo: function (parent) {
		return $e.appendTo.call(this, parent);
	},

	insert: function (child, index) {
		return $e.insert.call(this, child, index);
	},

	data: function (k, v) {
		return $e.data.call(this, k, v);
	},

	empty: function () {
		return $e.empty.call(this);
	},

	parent: function () {
		return $e.parent.call(this);
	},

	children: function () {
		return $e.children.call(this);
	},

	remove: function () {
		return $e.remove.call(this);
	},

	next: function () {
		return $e.next.call(this);
	},

	wrap: function (e) {
		return $e.wrap.call(this, e);
	},

	clone: function () {
		return $e.clone.call(this);
	},

	width: function (w) {
		return $e.width.call(this, w);
	},

	height: function (h) {
		return $e.height.call(this, h);
	},

	select: function () {
		return $e.select.call(this);
	},

	focus: function () {
		return $e.focus.call(this);
	},

	val: function () {
		return $e.val.call(this);
	},

	on: function (event, callback, options) {
		return $e.on.call(this, event, callback, options);
	},

	off: function (event, callback, options) {
		$e.off.call(this, event, callback, options);
	},

	emit: function (event, args = null) {
		$e.emit.call(this, event, args);
	}
}



var $e = {

	removeDataAttrs: function () {
		this.elements.forEach(ele => {
			var attrs = ele.attributes;
			var len = attrs.length;
			var k = 0;
			for (var i = 0; i < len; i++) {
				if (attrs[k].nodeName.indexOf('data-') == 0) {
					ele.removeAttribute(attrs[k].nodeName);
				} else {
					k++;
				}
			}
		});
		return this;
	},

	copyAttrFrom: function (source) {
		var attrs = source.attributes;
		if (attrs == undefined) {
			return this;
		}
		for (var i = 0; i < attrs.length; i++) {
			this.item(0).attr(attrs[i].nodeName, attrs[i].value);
		}
	},

	css: function (args) {

		const k = args[0];

		if (args.length == 1 && typeof (k) == 'string') {
			if (this.length == 0) {
				return '';
			}
			return this.get().style[k];
		}

		var o = {};
		if (typeof (k) == 'object') {
			o = k;
		} else {
			o[k] = args[1];
		}
		//if(o.hasOwnProperty('height')) {

		//} 
		//if(o.hasOwnProperty('width')) {
		//}
		this.elements.forEach(e => {
			for (var k in o) {
				e.style[k] = o[k];
			}
		});

		return this;
	},


	attr: function (args) {

		const k = args[0];

		if (args.length == 1 && typeof (k) == 'string') {
			if (this.length == 0) {
				return '';
			}
			return this.get().getAttribute(k);
		}

		var o = {};
		if (typeof (k) == 'object') {
			o = k;
		} else {
			o[k] = args[1];
		}

		this.elements.forEach(e => {
			for (var k in o) {
				e.setAttribute(k, o[k]);
			}
		});

		return this;
	},

	removeAttr: function (attr) {
		this.get(0).removeAttribute(attr);
		return this;
	},

	attrs: function () {
		if (this.length == 0) {
			return {};
		}
		var attrs = this.get().attributes;
		var res = {};
		for (const attr of attrs) {
			res[attr.name] = attr.value;
		}
		return res;
	},

	hasAttr: function (attr) {
		return this.length > 0 && this.get().hasAttribute(attr);
	},

	show: function () {
		this.each(e => e.style.display = 'block');
		return this;
	},

	hide: function () {
		this.each(e => e.style.display = 'none');
		return this;
	},


	addClass: function (clazz) {
		clazz = clazz.split(' ');
		this.each(e => clazz.forEach(c => e.classList.add(c)));
		return this;
	},

	removeClass: function (clazz) {
		clazz = clazz.split(' ');
		this.each(e => clazz.forEach(c => e.classList.remove(c)));
		return this;
	},

	forEachChild: function (callback) {
		len = e.children.length;
		for (var i = 0; i < len; i++) {
			callback(e.children[i], i);
		}
	},

	find: function (selector) {
		return $j(selector, this);
	},

	remove: function () {
        this.each(e => e.remove());
		this.elements = [];
		return this;
	},

	parent: function () {
		var arr = [];
		this.each(e => arr.push(e.parentNode));
		return new WebElement(arr);
	},

	val: function (v) {
		if (v == undefined) {
			if (this.length > 0)
				return this.get().value;
			else
				return '';
		}
		this.each(e => e.value = v);
		return this;
	},

	html: function (html) {
		if (html == undefined) {
			if (this.length > 0)
				return this.get().innerHTML;
			else
				return '';
		}
		this.each(e => e.innerHTML = html);
		return this;
	},

	text: function (text) {
		if (text == undefined) {
			if (this.length > 0)
				return this.get().innerText;
			else
				return '';
		}
		this.each(e => e.innerText = text);
		return this;
	},

	//TODO : check
	append: function (child = undefined) {
		if (this.length == 0 || child == null || child == undefined) {
			return this;
		}

		if (typeof (child) == 'string') {
			this.get().insertAdjacentHTML('beforeend', child);
		} else if (child instanceof WebElement) {
			this.get().appendChild(child.get());
		} else {
			this.get().appendChild(child);
		}
		return this;
	},

	prepend: function (e) {
		if (this.length == 0 || e == null || e == undefined) {
			return this;
		}
		if (typeof (e) == 'string') {
			this.get().insertAdjacentHTML('beforeend', e);
		} else if (e instanceof WebElement) {
			this.get().insertBefore(e.get(), this.get().children[0]);
		} else {
			this.get().insertBefore(e, this.get().children[0]);
		}

		return this;
	},

	appendTo: function (container) {
		if (container instanceof WebElement) {
			container = container.get();
		}
		container.appendChild(this.get());
		return this;
	},

	empty: function () {
		this.each(e => e.innerText = '');
		return this;
	},


	data: function (key, value) {
		if (this.length == 0) return this;

		if (value == undefined) {
			if (!key) {
				return Object.assign({}, this.get().dataset);
			}
			return this.get().dataset[key];
		}
		this.get().dataset[key] = value;
		return this;
	},

	children: function () {
		var arr = [];
		this.elements.forEach(e => arr.push(...Array.from(e.children)));
		return new WebElement(arr);
	},

	next: function () {
		var r = [];
		this.each(e => r.push(e.nextElementSibling));
		return new WebElement(r);
	},

	wrap: function (wrapper) {
		wrapper = $e._element(wrapper);
		this.each(e => {
			const w = wrapper.cloneNode(true);
			e.parentNode.insertBefore(w, e);
			w.appendChild(e);
		});
		return this;
	},

	insert: function (child, index) {
		child = $e._element(child);
		if (index >= this.get(0).children.length) {
			$e.append(this, child);
		} else {
			var e = this.get();
			e.insertBefore(child, e.children[index])
		}
	},

	_element: function (e) {
		if (e instanceof WebElement) {
			return e.get();
		} else if (typeof (e) == 'string') {
			return $j(e).get();
		} else {
			return e;
		}
	},

	clone: function () {
		var r = [];
		this.each(e => r.push(e.cloneNode(true)));
		return r;
	},

	width: function (w) {
		if (w) {
			this.each(e => e.style.width = w + 'px');
			return this;
		}
		return this.elements[0].offsetWidth;
	},

	height: function (h) {
		if (h) {
			this.each(e => e.style.height = h + 'px');
			return this;
		}
		return this.elements[0].offsetHeight;
	},

	select: function () {
		if (this.length > 0) {
			this.get().select();
		}
		return this;
	},

	focus: function () {
		if (this.length > 0) {
			this.get().focus();
		}
		return this;
	},

	on: function (event, callback, options) {
		this.each(e => e.addEventListener(event, callback, options));
		return this;
	},

	off: function (event, callback, options) {
		this.each(e => e.removeEventListener(event, callback, options));
		return this;
	},

	emit: function (event, args = null) {
		this.each(e => e.dispatchEvent(event, new CustomEvent(event, {
			detail: args
		})));
		return this;
	}

}
//-------------------------------------------------------------------------------- //
NodeList.prototype.$j = //
	HTMLElement.prototype.$j = //
	DocumentFragment.prototype.$j = //
	function (selector) {
		return $j(selector, this);
	}

document.ready = function (callback) {
	window.addEventListener('DOMContentLoaded', callback);
}
