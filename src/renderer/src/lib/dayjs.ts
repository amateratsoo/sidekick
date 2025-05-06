import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/pt-br'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(localeData)
dayjs.extend(customParseFormat)
dayjs.locale('pt-br')
