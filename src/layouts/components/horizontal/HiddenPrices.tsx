// ** MUI Imports
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const HiddenPrices = ({ setHidden, hidden }) => {
  const handleClick = () => {
    const password = '1990'
    var resp = window.prompt('Código de Desbloqueio: ')
    if (password === resp) {
      setHidden(!hidden)
    }
  }

  return (
    <IconButton color='inherit' aria-haspopup='true' onClick={handleClick}>
      <Icon icon={hidden ? 'ph:eye-thin' : 'tabler:eye-filled'} />
    </IconButton>
  )
}

export default HiddenPrices
