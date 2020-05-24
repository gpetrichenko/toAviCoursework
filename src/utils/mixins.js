import moment from 'moment'
moment.lang("ru")

export const timeFilter = {
  filters: {
    timeFormate(datetime) {
      return datetime ? moment(datetime).format('YYYY-MM-DD, HH:mm') : '-'
    }
  }
}

export const currencyFilter = {
  filters: {
    currency(num) {
      return  num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' ₽'
    }
  }
}

export const fromNowFilter = {
  filters: {
    fromNow(datetime) {
      return datetime ? moment(datetime).fromNow() : '-'
    }
  }
}

export const emptyImageFilter = {
  filters: {
    emptyImage(src) {
      return src || 'https://via.placeholder.com/350x220/DFDFDF?text=No+Image'
    }
  }
}
