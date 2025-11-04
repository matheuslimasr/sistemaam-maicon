// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import FormProdutos from './FormProdutos'

const Produtos = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={12}>
          <FormProdutos />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Produtos
