import Moment from 'moment';

const TextHelper = {
  getFormattedPrice: (prices) => {
    let text;
    if (prices.length === 1) {
      text = `\u20B8${prices[0].amount}`;
    } else if (prices.length > 1) {
      const amounts = prices.map(price => price.amount);
      amounts.sort((a, b) => a - b);
      text = `\u20B8${amounts[0]} - \u20B8${amounts[amounts.length - 1]}`;
    } else {
      text = 'Свободный вход';
    }

    return text
  },

  getFormattedStartDate: (starts_at) => {
    return Moment(starts_at).format('Do MMMM, HH:mm')
  }

}

export default TextHelper;