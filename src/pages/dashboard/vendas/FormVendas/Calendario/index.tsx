// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useTheme } from '@mui/material/styles'

// ** Custom Component Imports
import CustomInput from './PickersCustomInput'

// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const Calendario = ({ setDate, date }) => {
  // ** Hook
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  return (
    <DatePickerWrapper sx={{ width: '100%' }}>
      <DatePicker
        dateFormat='yyyy/MM/dd'
        format='yyyy-MM-dd'
        selected={date}
        id='basic-input'
        popperPlacement={popperPlacement}
        onChange={(date: Date) => setDate(date)}
        placeholderText='Selecione a data de venda'
        customInput={<CustomInput label='Data de Venda' />}
      />
    </DatePickerWrapper>
  )
}

export default Calendario
