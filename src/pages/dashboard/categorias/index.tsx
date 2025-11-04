// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import FormCategorias from './FormCategorias'
import { useAuth } from 'src/hooks/useAuth'

const Categorias = () => {
  const { user } = useAuth()

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={6}>
          <FormCategorias user={user} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Categorias
