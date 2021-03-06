'use strict';

const bankUtils = {
	/**
  * Типы банковскиx карт
  * @type {Object}
  */
	cardTypes: {
		VISA: 'visa',
		MAESTRO: 'maestro',
		MASTERCARD: 'mastercard',
		MIR: 'mir'
	},

	/**
  * Проверяет тип карты
  * @param {Number} val номер карты
  * @returns {String} тип карты
  */
	getCardType(val) {
		// Бины ПС МИР 220000 - 220499
		const mirBin = /^220[0-4]\s?\d\d/;

		const firstNum = val[0];

		switch (firstNum) {
			case '2': {
				if (mirBin.test(val)) {
					return bankUtils.cardTypes.MIR;
				}
				return '';
			}
			case '4': {
				return bankUtils.cardTypes.VISA;
			}
			case '5': {
				const secondNum = val[1] || '';

				if (secondNum === '0' || secondNum > '5') {
					return bankUtils.cardTypes.MAESTRO;
				}
				return bankUtils.cardTypes.MASTERCARD;
			}
			case '6': {
				return bankUtils.cardTypes.MAESTRO;
			}
			default: {
				return '';
			}
		}
	},

	/**
  * Форматирует номер карты, используя заданный разделитель
  *
  * @param {String} cardNumber номер карты
  * @param {String} delimeter = '\u00A0' разделитель
  * @returns {String} форматированный номер карты
  */
	formatCardNumber(cardNumber, delimeter) {
		const formattedCardNumber = [];
		delimeter = delimeter || '\u00A0';
		if (cardNumber) {
			while (cardNumber && typeof cardNumber === 'string') {
				formattedCardNumber.push(cardNumber.substr(0, 4));
				cardNumber = cardNumber.substr(4);
				if (cardNumber) {
					formattedCardNumber.push(delimeter);
				}
			}
		}
		return formattedCardNumber.join('');
	},

	/**
   * Производит валидацию по алгоритму Luhn
   * @see https://ru.wikipedia.org/wiki/Алгоритм_Луна
   * @param  {String} cardNumber номер карты
   * @return {Boolean} результат валидации
   */
	validateCardNumberLuhn(cardNumber) {
		let sum = 0;
		const parity = cardNumber.length % 2;
		for (const key in cardNumber) {
			let digit = cardNumber[key];
			if (key % 2 === parity) {
				digit *= 2;
				if (digit > 9) digit -= 9;
			}
			sum += parseInt(digit);
		}
		return sum % 10 === 0;
	}
};

const helpers = {
	bufferToJSON(buffer) {
		return JSON.parse(buffer);
	}
};

module.exports = {bankUtils, helpers};
