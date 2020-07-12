// фильтруем элементы. в возвращаемом массиве будут элементы с typeof === type
const filterByType = (type, ...values) => values.filter(value => typeof value === type),
// функция hideAllResponseBlocks
	hideAllResponseBlocks = () => {
		// получаем NodeList из элементов с селектором 'div.dialog__response-block' и преобразуем в массив
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		// перебираем полученный массив и выставляем элементам display = 'none'(скрываем элементы)
		responseBlocksArray.forEach(block => block.style.display = 'none');
	},
// функция showResponseBlock, аргументы: blockSelector, msgText, spanSelector
	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		// Вызываем функцию hideAllResponseBlocks
		hideAllResponseBlocks();
		// выставляем элементу с селектром blockSelector (получаем при вызове функции) display = 'block' (показываем на странице)
		document.querySelector(blockSelector).style.display = 'block';
		// если при вызове функции был передан аргумент spanSelector..
		if (spanSelector) {
			// ..то обращаемся к элементу с этим селектором и записываем textContent = msgText
			document.querySelector(spanSelector).textContent = msgText;
		}
	},
// Вызываем функцию showResponseBlock, в качестве аргументов передаем '.dialog__response-block_error', msgText, '#error'
	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),
// Вызываем функцию showResponseBlock, в качестве аргументов передаем '.dialog__response-block_ok', msgText, '#ok'
	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),
// Вызываем функцию showResponseBlock, в качестве аргумента передаем '.dialog__response-block_no-results'
	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),
// функция tryFilterByType, аргументы: type, values
	tryFilterByType = (type, values) => {
		// вешаем перехват ошибок
		// если все норм, то ...
		try {
			// ...вызываем filterByType (аргументы type, values). То, что вернет нам filterByType делаем строкой с ", " и 
			// записываем в переменную valuesArray
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
			// усли valuesArray.length есть (не пусто), то ...
			const alertMsg = (valuesArray.length) ?
			// записываем в alertMsg `Данные с типом ${type}: ${valuesArray}`
				`Данные с типом ${type}: ${valuesArray}` :
				// иначе записываем в alertMsg `Отсутствуют данные типа ${type}`;
				`Отсутствуют данные типа ${type}`;
				// запускаем showResults и передаем наш месседж
			showResults(alertMsg);
			// если произошла ошибка
		} catch (e) {
			// запускаем showResults и передаем наш месседж
			showError(`Ошибка: ${e}`);
		}
	};
// Обращаемся к элементу с id=#filter-btn (кнопка)
const filterButton = document.querySelector('#filter-btn');

// Навешиваем событие "клик" на filterButton
filterButton.addEventListener('click', e => {
	// Обращаемся к элементу с id=#type
	const typeInput = document.querySelector('#type');
	// Обращаемся к элементу с id=#data
	const dataInput = document.querySelector('#data');
// Проверяем поле dataInput на пустую строку
	if (dataInput.value === '') {
		// устанавливаем сообщение для dataInput если поле пустое
		dataInput.setCustomValidity('Поле не должно быть пустым!');
		// вызываем функцию showNoResults
		showNoResults();
		// иначе ...
	} else {
		// чистим сообщение
		dataInput.setCustomValidity('');
		// отменяем стандартное поведение
		e.preventDefault();
		// вызываем функцию tryFilterByType с аргументами typeInput.value.trim(), dataInput.value.trim() (здесь убираем пробелы слева/спарва у значений)
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
	}
});

