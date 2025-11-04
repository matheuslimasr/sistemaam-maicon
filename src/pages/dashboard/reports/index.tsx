import { Box, Button, FormControl, FormGroup, InputLabel, MenuItem, Modal, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import Select from '@mui/material/Select'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

import CustomChip from 'src/@core/components/mui/chip'
import { baseUrlApi } from 'src/configs/themeConfig'
import Calendario from '../vendas/FormVendas/Calendario'

const Reports = () => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [load, setLoad] = useState(true)

  const [openModal, setOpenModal] = useState(false)
  const handleOpen = () => setOpenModal(true)
  const handleClose = () => setOpenModal(false)

  const [dataInicio, setDataInicio] = useState<DateType>('')
  const [dataFim, setDataFim] = useState<DateType>('')
  const [search, setSearch] = useState('')
  const [fieldStatus, setFieldStatus] = useState('')

  const [listCategorias, setListCategorias] = useState([])
  const [fieldCategoria, setFieldCategoria] = useState('')

  const [vendas, setVendas] = useState([] as any)
  const [totalCusto, setTotalCusto] = useState<Number>()
  const [totalVenda, setTotalVenda] = useState<Number>()
  const [limitRows, setLimitRows] = useState(50)
  const [filterBy, setFilterBy] = useState('vendas.dataVenda_vendas')

  const convertDate = str => {
    str = str.toString()
    let parts = str.split(' ')
    let months = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12'
    }
    return parts[3] + '-' + months[parts[1]] + '-' + parts[2]
  }

  const searchAndGetCollection = async () => {
    let urlParam = `${baseUrlApi}/vendas?limit=${limitRows}&filterBy=${filterBy}`

    // apenas data
    if (dataInicio && dataFim && search == '' && fieldStatus == '' && fieldCategoria == '') {
      console.log('IF 1')

      urlParam = `${baseUrlApi}/vendas?dataVenda_inicio=${convertDate(dataInicio)}&dataVenda_fim=${convertDate(
        dataFim
      )}&limit=${limitRows}&filterBy=${filterBy}`

      // apenas status
    } else if (dataInicio == '' && dataFim == '' && search == '' && fieldStatus !== '') {
      console.log('IF 2')
      urlParam = `${baseUrlApi}/vendas?status=${fieldStatus}&limit=${limitRows}&filterBy=${filterBy}`
      // apenas datas e nome do cliente
    } else if (dataInicio && dataFim && search && fieldStatus == '') {
      console.log('IF 3')
      urlParam = `${baseUrlApi}/vendas?dataVenda_inicio=${convertDate(dataInicio)}&dataVenda_fim=${convertDate(
        dataFim
      )}&nomeCliente=${search}&limit=${limitRows}&filterBy=${filterBy}`

      // apenas pesquisa data e status
    } else if (dataInicio && dataFim && search == '' && fieldStatus !== '') {
      console.log('IF 4')
      urlParam = `${baseUrlApi}/vendas?dataVenda_inicio=${convertDate(dataInicio)}&dataVenda_fim=${convertDate(
        dataFim
      )}&status=${fieldStatus}&limit=${limitRows}&filterBy=${filterBy}`
    } else if (dataInicio == '' && dataFim == '' && search !== '' && fieldStatus !== '') {
      console.log('IF 5')
      urlParam = `${baseUrlApi}/vendas?nomeCliente=${search}&status=${fieldStatus}&limit=${limitRows}&filterBy=${filterBy}`
      // apenas pesquisa nome cliente
    } else if (dataInicio == '' && dataFim == '' && search !== '' && fieldStatus == '' && fieldCategoria == '') {
      console.log('IF 6')
      urlParam = `${baseUrlApi}/vendas?nomeCliente=${search}&limit=${limitRows}&filterBy=${filterBy}`
    } else if (dataInicio && dataFim && search !== '' && fieldStatus !== '') {
      console.log('IF 7')
      urlParam = `${baseUrlApi}/vendas?dataVenda_inicio=${convertDate(dataInicio)}&dataVenda_fim=${convertDate(
        dataFim
      )}&nomeCliente=${search}&status=${fieldStatus}&limit=${limitRows}&filterBy=${filterBy}`
    } else if (dataInicio == '' && dataFim == '' && search == '' && fieldStatus == '' && fieldCategoria !== '') {
      urlParam = `${baseUrlApi}/vendas?categoria=${fieldCategoria?.target?.value}&limit=${limitRows}`
      // nome e categoria
    } else if (dataInicio == '' && dataFim == '' && fieldStatus == '' && search !== '' && fieldCategoria !== '') {
      console.log('IF 9')
      urlParam = `${baseUrlApi}/vendas?categoria=${fieldCategoria?.target?.value}&nomeCliente=${search}&limit=${limitRows}`
      // categoria e data
    } else if (dataInicio && dataFim && fieldStatus == '' && search == '' && fieldCategoria !== '') {
      console.log('IF 10')
      urlParam = `${baseUrlApi}/vendas?categoria=${fieldCategoria?.target?.value}&dataVenda_inicio=${convertDate(
        dataInicio
      )}&dataVenda_fim=${convertDate(dataFim)}`
      // todos os campos
    }

    await fetch(urlParam, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(dataItem => {
        setVendas(dataItem)
      })
    })
  }

  const calcCustoProduto = (custoProduto: any, custoEnvio: any, valorVenda: any) => {
    let custFrete: number = 0
    let custProduct: number = 0
    let custBuy: number = 0

    if (custoEnvio !== null) {
      custFrete = parseFloat(custoEnvio)
    } else {
      custFrete = 0
    }

    if (custoProduto !== null) {
      custProduct = parseFloat(custoProduto)
    } else {
      custProduct = 0
    }

    if (valorVenda !== null) {
      custBuy = parseFloat(valorVenda)
    } else {
      custBuy = 0
    }

    let sum = custBuy - custProduct - custFrete
    return sum
  }

  function formatData(param: any) {
    const datax = param
    const dd = datax.split('-')
    let value = ''

    if (dd[2] === '0') {
      value = `1/${dd[1]}/${dd[2]}`
    } else {
      value = `${dd[2]}/${dd[1]}/${dd[0]}`
    }

    return value
  }

  const handleTotal = async () => {
    let ttotalVenda = 0
    let ttotalCusto = 0
    let custFrete = 0

    let custoEnvioVendas = 0
    let custoProduto_vendas = 0

    vendas.map((item, index) => {
      if (item.custoEnvio_vendas !== null) {
        custFrete = parseFloat(item.custoEnvio_vendas)
      } else {
        custFrete = 0
      }

      if (item.valorVenda_vendas !== null) {
        custoEnvioVendas = parseFloat(item.valorVenda_vendas)
      } else {
        custoEnvioVendas = 0
      }

      if (item.custoProduto_vendas !== null) {
        custoProduto_vendas = parseFloat(item.custoProduto_vendas)
      } else {
        custoProduto_vendas = 0
      }

      ttotalCusto += custoEnvioVendas - item.custoProduto_vendas - custFrete
      ttotalVenda += custoEnvioVendas
    })

    setTotalCusto(ttotalCusto)
    setTotalVenda(ttotalVenda)
  }

  const searchItems = async () => {
    searchAndGetCollection()
  }

  const getCategoria = async () => {
    await fetch(`${baseUrlApi}/categorias`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(dataItem => {
        setListCategorias(dataItem)
      })
    })
  }

  const loadAll = async () => {
    setLoad(true)
    await Promise.all([searchAndGetCollection(), getCategoria(), handleTotal()])
    setLoad(false)
  }

  useEffect(() => {
    loadAll()
  }, [])

  if (load) {
    return <h1>Carregando....</h1>
  } else {
    return (
      <Grid spacing={6}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleOpen}
          style={{
            marginBottom: 20
          }}
        >
          VER FILTROS
        </Button>

        <Modal
          open={openModal}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4
            }}
          >
            <Grid sx={{ padding: 0, marginBottom: 5 }} container>
              <Typography variant='h6' sx={{ mb: 6 }}>
                Configurar busca
              </Typography>

              <Grid item xs={12} md={12} lg={12} style={{ marginBottom: 20 }}>
                <TextField
                  fullWidth
                  autoFocus
                  label='Procure por nome cliente'
                  value={search}
                  onChange={value => setSearch(value.target.value)}
                  placeholder='Procure por nome cliente'
                  size='small'
                />
              </Grid>

              <Grid item xs={12} md={12} lg={12} style={{ marginBottom: 20 }}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id='demo-simple-select-outlined-label'>SELECIONE A CATEGORIA</InputLabel>
                  <Select
                    label='SELECIONE A CATEGORIA'
                    defaultValue=''
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    sx={{ width: '100%' }}
                    onChange={setFieldCategoria}
                    size='small'
                  >
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    {listCategorias.map((item, index) => (
                      <MenuItem key={index} value={item.nomeCategoria_categorias}>
                        {item.nomeCategoria_categorias}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} lg={12} style={{ marginBottom: 20 }}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-outlined-label'>STATUS DA VENDA</InputLabel>
                  <Select
                    label='FORMA DE PAGAMENTO'
                    defaultValue=''
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    onChange={value => {
                      setFieldStatus(value.target.value)
                    }}
                    size='small'
                    fullWidth
                  >
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'PAGO'}>PAGO</MenuItem>
                    <MenuItem value={'PENDENTE'}>PENDENTE</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} lg={12} style={{ marginBottom: 20 }}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-outlined-label'>Filtrar por</InputLabel>
                  <Select
                    label='Filtrar por'
                    defaultValue=''
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    onChange={value => {
                      setFilterBy(value.target.value)
                    }}
                    size='small'
                    fullWidth
                  >
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'vendas.dataVenda_vendas'}>POR DATA</MenuItem>
                    <MenuItem value={'vendas.vendas_id'}>POR ID</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} lg={12} style={{ marginBottom: 20 }}>
                <InputLabel id='demo-simple-select-outlined-label'>Data Inicio</InputLabel>
                <Calendario date={dataInicio} setDate={setDataInicio} />
                <InputLabel id='demo-simple-select-outlined-label' style={{ marginTop: 10 }}>
                  Data Fim
                </InputLabel>
                <Calendario date={dataFim} setDate={setDataFim} />
              </Grid>

              <Grid item xs={12} md={12} lg={12} style={{ marginBottom: 10 }}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-outlined-label'>Total Registros</InputLabel>
                  <Select
                    label='Total Registros'
                    defaultValue={limitRows}
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    sx={{ width: '100%' }}
                    onChange={value => {
                      setLimitRows(value.target.value)
                    }}
                    size='small'
                    fullWidth
                  >
                    <MenuItem value={2}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={200}>200</MenuItem>
                    <MenuItem value={300}>300</MenuItem>
                    <MenuItem value={500}>500</MenuItem>
                    <MenuItem value={600}>600</MenuItem>
                    <MenuItem value={700}>700</MenuItem>
                    <MenuItem value={800}>800</MenuItem>
                    <MenuItem value={900}>900</MenuItem>
                    <MenuItem value={1000}>1000</MenuItem>
                    <MenuItem value={999999}>+99999</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} lg={12} style={{ marginBottom: 10 }}>
                <Button fullWidth variant='contained' color='primary' onClick={() => searchItems()}>
                  Fazer Busca
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>

        <Grid item xs={12} md={6} lg={12}>
          <Typography variant='h6' sx={{ mb: 0 }}>
            Relatório geral
          </Typography>

          {/* <ReactHTMLTableToExcel
            id='test-table-xls-button'
            className='download-table-xls-button'
            table='table-to-xls'
            filename='tablexls'
            sheet='tablexls'
            buttonText='EXPORT'
          /> */}
          <table id='table-to-xls' border='1' cellpadding='8' cellspacing='0'>
            <thead>
              <tr
                style={{
                  fontSize: '10px'
                }}
              >
                <th>ID</th>
                <th>FOTO</th>
                <th>PRODUTO</th>
                <th>CATEGORIA</th>
                <th>CLIENTE</th>
                <th>ENDEREÇO</th>
                <th>CÓDIGO RASTREIO</th>
                <th>CUSTO PRODUTO</th>
                <th>CUSTO ENVIO</th>
                <th>VALOR DE VENDA</th>
                <th>LUCRO</th>
                <th>FORMA DE PAGAMENTO</th>
                <th>CATEGORIA</th>
                <th>DATA VENDA</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map(item => (
                <tr
                  key={item.vendas_id}
                  style={{
                    fontSize: '12px'
                  }}
                >
                  <td>{item.vendas_id}</td>
                  <td>
                    <a onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
                      {item.photo_vendas !== '' ? (
                        <img
                          width={50}
                          height={50}
                          style={{ borderRadius: 4, objectFit: 'cover' }}
                          src={item.photo_vendas}
                        />
                      ) : (
                        'NT'
                      )}
                    </a>
                  </td>
                  <td>{item.nomeProduto_produtos || 'NT'}</td>
                  <td>{item.categoria_vendas || 'NT'}</td>
                  <td>
                    {item.nomeCliente_clientes || 'NT'} ({item.telefoneCliente_clientes})
                  </td>
                  <td>{item.enderecoCliente_clientes || 'NT'}</td>
                  <td>
                    <a
                      target='_blank'
                      href={`https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${item.codigoRastreio_vendas}`}
                      style={{
                        color: item.codigoRastreio_vendas ? '#1e88e5' : '#9e9e9e',
                        textDecoration: 'none',
                        fontWeight: 500
                      }}
                    >
                      {item.codigoRastreio_vendas || 'NT'}
                    </a>
                  </td>
                  <td>
                    {item.custoProduto_vendas
                      ? Number(item.custoProduto_vendas).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        })
                      : 'NT'}
                  </td>
                  <td>
                    {item.custoEnvio_vendas
                      ? Number(item.custoEnvio_vendas).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        })
                      : 'NT'}
                  </td>
                  <td>
                    {item.valorVenda_vendas
                      ? Number(item.valorVenda_vendas).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        })
                      : 'NT'}
                  </td>
                  <td>
                    {item.valorVenda_vendas
                      ? calcCustoProduto(
                          item.custoProduto_vendas,
                          item.custoEnvio_vendas,
                          item.valorVenda_vendas
                        ).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                      : 'NT'}
                  </td>
                  <td>{item.formaPagamento_vendas || 'NT'}</td>
                  <td>{item.categoria_vendas || 'NT'}</td>
                  <td>{item.dataVenda_vendas ? formatData(item.dataVenda_vendas) : 'NT'}</td>
                  <td>
                    {item.status_vendas ? (
                      <CustomChip
                        rounded
                        size='small'
                        skin='light'
                        color={item.status_vendas === 'PAGO' ? 'success' : 'error'}
                        label={item.status_vendas}
                        sx={{ fontWeight: 500, color: '#fff' }}
                      />
                    ) : (
                      'NT'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={8} style={{ padding: 12 }}></td>
                <td style={{ padding: 12 }}>TOTAL:</td>
                <td style={{ padding: 12, textAlign: 'right', color: '#fff' }}>
                  Total em Vendas:{' '}
                  {totalVenda ? totalVenda.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'NT'}{' '}
                  <button
                    onClick={handleTotal}
                    style={{
                      marginLeft: 8,
                      padding: '4px 8px',
                      backgroundColor: '#1976d2',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer'
                    }}
                  >
                    atualizar
                  </button>
                </td>
                <td style={{ padding: 12, textAlign: 'right', color: '#fff' }}>
                  Lucro Total:{' '}
                  {totalCusto ? totalCusto.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'NT'}{' '}
                  <button
                    onClick={handleTotal}
                    style={{
                      marginLeft: 8,
                      padding: '4px 8px',
                      backgroundColor: '#388e3c',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer'
                    }}
                  >
                    atualizar
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>

          <br />
          <ReactHTMLTableToExcel
            id='test-table-xls-button'
            className='download-table-xls-button'
            table='table-to-xls'
            filename='tablexls'
            sheet='tablexls'
            buttonText='EXPORT'
          />
        </Grid>
      </Grid>
    )
  }
}

export default Reports
