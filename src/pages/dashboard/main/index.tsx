// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// ** MUI Imports
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import VendasTotal from './VendasTotal'
import ClientesTotal from './ClientesTotal'
import ProdutosTotal from './ProdutosTotal'
import { useAuth } from 'src/hooks/useAuth'
import VendasTotalDolar from './VendasTotalDolar'
import HiddenPrices from 'src/layouts/components/horizontal/HiddenPrices'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  InputLabel,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import TableLastVendas from './TableLastVendas'
import { baseUrlApi } from 'src/configs/themeConfig'
import FallbackSpinner from 'src/@core/components/spinner'

import CustomChip from 'src/@core/components/mui/chip'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import Calendario from '../vendas/FormVendas/Calendario'
import TableStickyHeader from 'src/views/table/mui/TableStickyHeader'

// Registrar os componentes que o Chart.js precisa
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const CrmDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  if (loading) {
    return <FallbackSpinner />
  } else {
    return (
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4} lg={4}>
            <Card>
              <CardHeader title='Clientes cadastrados' />
              <CardContent>
                <p>
                  <strong>Total:</strong>{' '}
                </p>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <Card>
              <CardHeader title='Projetos em andamento' />
              <CardContent>
                <p>
                  <strong>Total:</strong>{' '}
                </p>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <Card>
              <CardHeader title='Faturamento(Contratos)' />
              <CardContent>
                <p>
                  <strong>Total:</strong>{' '}
                </p>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <CardHeader title='Últimas Atividades' />
              <CardContent>
                <TableStickyHeader />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </ApexChartWrapper>
    )
  }
}

export default CrmDashboard
