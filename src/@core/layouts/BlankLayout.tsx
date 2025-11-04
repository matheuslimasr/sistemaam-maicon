// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Types
import { BlankLayoutProps } from './types'

// Styled component for Blank Layout component
const BlankLayoutWrapper = styled(Box)<BoxProps>(({ theme }) => ({}))

const BlankLayout = ({ children }: BlankLayoutProps) => {
  return <BlankLayoutWrapper className='wallpaperLoginn'>{children}</BlankLayoutWrapper>
}

export default BlankLayout
