// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: '#fff'
}))

const FooterContent = () => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, Feito com `}
        <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
        </Box>
        {` por `}
        <LinkStyled target='_blank' href='https://www.paintsoftwares.com/'>
          PAINT SOFTWARES
        </LinkStyled>
      </Typography>
    </Box>
  )
}

export default FooterContent
