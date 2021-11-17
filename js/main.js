//@prepros-append jq-start.js
//@prepros-append script.js
//@prepros-append jq-end.js
$(document).ready(function () {

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) {
				return -1
			} else {
				return 1
			}
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) {
				return 1
			} else {
				return -1
			}
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());


//burger


$('.header-menu__icon, .head-menu__icon').click(function () {
	$(this).toggleClass('active');
	$('.header-menu, .head-menu').toggleClass('active');
	$('body').toggleClass('lock');
});



const sel = document.querySelectorAll('select'),
	selOptions = document.querySelectorAll('select option'),
	btn1 = document.querySelectorAll('.form__btnFirst'),
	btn2 = document.querySelectorAll('.form__btnSecond');


btn1.forEach(item => {
	item.addEventListener('click', function (e) {
		e.preventDefault();
		let options = this.parentElement.firstElementChild.querySelectorAll('option');

		for (let i = 0; i < options.length; i++) {
			if (options[i].selected && i > 0) {
				options[i].removeAttribute('selected');
				options[i - 1].setAttribute('selected', '');
			}

		}
	});
});
btn2.forEach(item => {
	item.addEventListener('click', function (e) {
		e.preventDefault();
		let options = this.parentElement.firstElementChild.querySelectorAll('option');
		for (let i = 0; i < options.length - 1; i++) {
			if (options[i].selected && i < selOptions.length - 1) {
				options[i].removeAttribute('selected');
				options[i + 1].setAttribute('selected', '');
				break
			}

		}
	});
});


//CHECK
$.each($('.check'), function (index, val) {
	if ($(this).find('input').prop('checked') == true) {
		$(this).addClass('active');
	}
});
$('body').off('click', '.check', function (event) { });
$('body').on('click', '.check', function (event) {
	if (!$(this).hasClass('disable')) {
		var target = $(event.target);
		if (!target.is("a")) {
			$(this).toggleClass('active');
			if ($(this).hasClass('active')) {
				$(this).find('input').prop('checked', true);
			} else {
				$(this).find('input').prop('checked', false);
			}
		}
	}
});
if ($(window).width() < 576) {
	$('.questions__block').slick({
		dots: true,
		arrows: false,
		accessibility: false,
		slidesToShow: 1,
		autoplaySpeed: 3000,
		adaptiveHeight: true
	});
}
let headerBlue = document.querySelector('.header.blue');

window.addEventListener('scroll', function () {
	if (window.pageYOffset > 100) {
		if (headerBlue) {
			headerBlue.classList.add('bl');
		}
	} else {
		headerBlue.classList.remove('bl');
	}
});

const formsReg = document.querySelectorAll('.form-reg'),
	formsLink = document.querySelectorAll('.form'),
	complete = document.querySelector('.complete'),
	completeWrap = document.querySelector('.complete-wrap');



formsReg.forEach(item => {
	item.addEventListener('submit', function (e) {
		e.preventDefault();
		this.style.display = 'none';
		complete.classList.add('active');
	});
});

formsLink.forEach(item => {
	item.addEventListener('submit', function (e) {
		e.preventDefault();
		completeWrap.classList.add('active');
		document.body.classList.add('lock');
	});
});


document.body.addEventListener('click', function () {
	if (completeWrap.classList.contains('active')) {
		document.body.classList.remove('lock');
		completeWrap.classList.remove('active');
	}

});

});
