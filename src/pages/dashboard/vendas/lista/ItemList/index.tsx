// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme
} from '@mui/material'

import CustomChip from 'src/@core/components/mui/chip'

import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { baseUrlApi } from 'src/configs/themeConfig'
import Calendario from '../../FormVendas/Calendario'
import toast from 'react-hot-toast'

const ItemList = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState([] as any)
  const theme = useTheme()
  const [listCategorias, setListCategorias] = useState([])
  const [fieldCategoria, setFieldCategoria] = useState('')

  const [search, setSearch] = useState('')
  const [fieldStatus, setFieldStatus] = useState('')
  const [load, setLoad] = useState(true)

  const [dataInicio, setDataInicio] = useState<DateType>('')
  const [dataFim, setDataFim] = useState<DateType>('')
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
    let urlParam = ''

    // apenas data
    if (dataInicio && dataFim && search == '' && fieldStatus == '') {
      urlParam = `${baseUrlApi}/vendas?dataVenda_inicio=${convertDate(dataInicio)}&dataVenda_fim=${convertDate(
        dataFim
      )}&limit=${limitRows}&filterBy=${filterBy}`

      // apenas status
    } else if (dataInicio == '' && dataFim == '' && search == '' && fieldStatus !== '') {
      urlParam = `${baseUrlApi}/vendas?status=${fieldStatus}&limit=${limitRows}&filterBy=${filterBy}`
      // apenas datas e nome do cliente
    } else if (dataInicio && dataFim && search && fieldStatus == '') {
      urlParam = `${baseUrlApi}/vendas?dataVenda_inicio=${convertDate(dataInicio)}&dataVenda_fim=${convertDate(
        dataFim
      )}&nomeCliente=${search}&limit=${limitRows}&filterBy=${filterBy}`

      // apenas pesquisa data e status
    } else if (dataInicio && dataFim && search == '' && fieldStatus !== '') {
      urlParam = `${baseUrlApi}/vendas?dataVenda_inicio=${convertDate(dataInicio)}&dataVenda_fim=${convertDate(
        dataFim
      )}&status=${fieldStatus}&limit=${limitRows}&filterBy=${filterBy}`
    } else if (dataInicio == '' && dataFim == '' && search !== '' && fieldStatus !== '') {
      urlParam = `${baseUrlApi}/vendas?nomeCliente=${search}&status=${fieldStatus}&limit=${limitRows}&filterBy=${filterBy}`
      // apenas pesquisa nome cliente
    } else if (dataInicio == '' && dataFim == '' && search !== '' && fieldStatus == '' && fieldCategoria == '') {
      urlParam = `${baseUrlApi}/vendas?nomeCliente=${search}&limit=${limitRows}&filterBy=${filterBy}`
      // todos os campos
    } else if (dataInicio && dataFim && search !== '' && fieldStatus !== '') {
      urlParam = `${baseUrlApi}/vendas?dataVenda_inicio=${convertDate(dataInicio)}&dataVenda_fim=${convertDate(
        dataFim
      )}&nomeCliente=${search}&status=${fieldStatus}&limit=${limitRows}&filterBy=${filterBy}`
    } else if (dataInicio == '' && dataFim == '' && search == '' && fieldStatus == '' && fieldCategoria !== '') {
      urlParam = `${baseUrlApi}/vendas?categoria=${fieldCategoria?.target?.value}&limit=${limitRows}`
    } else if (dataInicio == '' && dataFim == '' && fieldStatus == '' && search !== '' && fieldCategoria !== '') {
      urlParam = `${baseUrlApi}/vendas?categoria=${fieldCategoria?.target?.value}&nomeCliente=${search}&limit=${limitRows}`
      // todos os campos
    } else {
      urlParam = `${baseUrlApi}/vendas?limit=${limitRows}&filterBy=${filterBy}`
    }

    setLoad(true)

    await fetch(urlParam, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(dataItem => {
        setData(dataItem)
        setLoad(false)
      })
    })
  }

  function formatData(param) {
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

  const handleUrl = item => {
    if (item) {
      router.push({
        pathname: '/dashboard/vendas/edit',
        query: { uid: item }
      })
    }
  }

  const deleteItem = item => {
    if (confirm('Tem certeza que deseja excluir este item?') == true) {
      fetch(`${baseUrlApi}/vendas/${item}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        router.reload()
      })
    }
  }

  const getCategoria = async () => {
    fetch(`${baseUrlApi}/categorias`, {
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

  const searchItems = async () => {
    searchAndGetCollection()
  }

  useEffect(() => {
    if (router?.query?.status == 'OK') {
      toast.success('Venda Editada com sucesso!', {
        duration: 8000
      })
    }

    searchAndGetCollection()
    getCategoria()
  }, [])

  if (load) {
    return <h4>Carregando...</h4>
  } else {
    return (
      <TableContainer component={Paper}>
        <Grid sx={{ padding: 5 }} container>
          <Grid item xs={12} md={12} lg={12} sx={{ mb: 10 }}>
            <Typography
              variant='subtitle2'
              sx={{
                ml: 2,
                lineHeight: 1,
                fontWeight: 700
              }}
            >
              Total de Registros ({data.length})
            </Typography>
          </Grid>
          <Grid item xs={12} md={12} lg={2}>
            <InputLabel id='demo-simple-select-outlined-label'>Nome do cliente</InputLabel>
            <TextField
              fullWidth
              autoFocus
              label='Buscar'
              value={search}
              onChange={value => setSearch(value.target.value)}
              placeholder='Procure por nome cliente'
            />
          </Grid>

          <Grid item xs={12} md={12} lg={1}>
            <InputLabel id='demo-simple-select-outlined-label'>Categoria</InputLabel>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id='demo-simple-select-outlined-label'>CATEGORIA</InputLabel>
              <Select
                label='SELECIONE A CATEGORIA'
                defaultValue=''
                id='demo-simple-select-outlined'
                labelId='demo-simple-select-outlined-label'
                sx={{ width: '100%' }}
                onChange={setFieldCategoria}
              >
                <MenuItem value='' selected>
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

          <Grid item xs={12} md={12} lg={1}>
            <InputLabel id='demo-simple-select-outlined-label'>Status</InputLabel>
            <FormControl>
              <InputLabel id='demo-simple-select-outlined-label'>STATUS DA VENDA</InputLabel>
              <Select
                label='STATUS DA VENDA'
                defaultValue={fieldStatus}
                id='demo-simple-select-outlined'
                labelId='demo-simple-select-outlined-label'
                onChange={value => {
                  setFieldStatus(value.target.value)
                }}
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={'PAGO'}>PAGO</MenuItem>
                <MenuItem value={'PENDENTE'}>PENDENTE</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={12} lg={1}>
            <InputLabel id='demo-simple-select-outlined-label'>Filtre por</InputLabel>
            <FormControl>
              <InputLabel id='demo-simple-select-outlined-label'>Filtrar por</InputLabel>
              <Select
                label='Filtrar por'
                defaultValue=''
                id='demo-simple-select-outlined'
                labelId='demo-simple-select-outlined-label'
                onChange={value => {
                  setFilterBy(value.target.value)
                }}
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={'vendas.dataVenda_vendas'}>POR DATA</MenuItem>
                <MenuItem value={'vendas.vendas_id'}>POR ID</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={12} lg={1}>
            <InputLabel id='demo-simple-select-outlined-label'>Data Inicio</InputLabel>
            <Calendario date={dataInicio} setDate={setDataInicio} />
          </Grid>

          <Grid item xs={12} md={12} lg={1}>
            <InputLabel id='demo-simple-select-outlined-label'>Data Fim</InputLabel>
            <Calendario date={dataFim} setDate={setDataFim} />
          </Grid>

          <Grid item xs={12} md={12} lg={2}>
            <InputLabel id='demo-simple-select-outlined-label'>Total Registro</InputLabel>
            <FormControl>
              <Select
                label='Total Registros'
                defaultValue={limitRows}
                id='demo-simple-select-outlined'
                labelId='demo-simple-select-outlined-label'
                sx={{ width: '100%' }}
                onChange={value => {
                  setLimitRows(value.target.value)
                }}
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

          <Grid item xs={12} md={12} lg={2}>
            <Button fullWidth variant='contained' color='primary' onClick={() => searchItems()}>
              Fazer Busca
            </Button>
            <Button
              fullWidth
              variant='contained'
              color='secondary'
              onClick={() => {
                router.push('/dashboard/vendas/')
              }}
            >
              Nova Venda
            </Button>
          </Grid>
        </Grid>

        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align='left'>FOTO</TableCell>
              <TableCell align='left'>PRODUTO</TableCell>
              <TableCell align='left'>INFORMAÇÕES ADICIONAIS</TableCell>
              <TableCell align='left'>CLIENTE</TableCell>
              <TableCell align='left'>TELEFONE</TableCell>
              <TableCell align='right'>VALOR</TableCell>
              <TableCell align='left'>CODIGO RASTREIO</TableCell>
              <TableCell align='left'>CATEGORIA</TableCell>
              <TableCell align='left'>DATA DE VENDA</TableCell>
              <TableCell align='left'>STATUS</TableCell>
              <TableCell align='left' rowSpan={5} colSpan={5} width={600}>
                AÇÃO
              </TableCell>
            </TableRow>
          </TableHead>

          {data.length > 0 && (
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:last-of-type td, &:last-of-type th': {
                      border: 0
                    },
                    backgroundColor: item.status_vendas == 'PAGO' ? 'transparent' : '#ef233c'
                  }}
                >
                  <TableCell component='th' scope='row'>
                    {item.vendas_id}
                  </TableCell>

                  <TableCell align='left' style={{ color: theme.palette.mode == 'dark' ? '#fff' : '#000' }}>
                    {item.photo_vendas && (
                      <img
                        alt='img'
                        style={{ backgroundColor: '#eee', width: 100, height: 30 }}
                        src={
                          item.photo_vendas
                            ? item.photo_vendas
                            : 'https://media.istockphoto.com/id/1324356458/vector/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=ZmXO4mSgNDPzDRX-F8OKCfmMqqHpqMV6jiNi00Ye7rE='
                        }
                        width={100}
                        height={'auto'}
                      />
                    )}
                  </TableCell>

                  <TableCell align='left' style={{ color: theme.palette.mode == 'dark' ? '#fff' : '#000' }}>
                    {item.nomeProduto_produtos ? item.nomeProduto_produtos : 'NÃO INFORMADO!'}
                  </TableCell>
                  <TableCell align='left' style={{ color: theme.palette.mode == 'dark' ? '#fff' : '#000' }}>
                    {item.informacoesAdicional_vendas ? item.informacoesAdicional_vendas : 'NÃO INFORMADO!'}
                  </TableCell>
                  <TableCell align='left' style={{ color: theme.palette.mode == 'dark' ? '#fff' : '#000' }}>
                    {item.nomeCliente_clientes ? item.nomeCliente_clientes : 'NÃO INFORMADO!'}
                  </TableCell>
                  <TableCell align='left' style={{ color: theme.palette.mode == 'dark' ? '#fff' : '#000' }}>
                    {item.telefoneCliente_clientes ? item.telefoneCliente_clientes : 'NÃO INFORMADO'}
                  </TableCell>
                  <TableCell align='right' style={{ color: theme.palette.mode == 'dark' ? '#fff' : '#000' }}>
                    <CustomChip
                      rounded
                      size='small'
                      skin='light'
                      color='success'
                      label={'$  ' + item.valorVenda_vendas}
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>

                  <TableCell align='left' style={{ color: theme.palette.mode == 'dark' ? '#fff' : '#000' }}>
                    <a
                      target='_blank'
                      style={{ color: theme.palette.mode == 'dark' ? '#fff' : '#000' }}
                      href={`https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${item.codigoRastreio_vendas}`}
                    >
                      {item.codigoRastreio_vendas ? item.codigoRastreio_vendas : 'NÃO INFORMADO'}
                    </a>
                  </TableCell>

                  <TableCell align='left' style={{ color: theme.palette.mode == 'dark' ? '#fff' : '#000' }}>
                    {item.categoria_vendas ? item.categoria_vendas : 'NÃO INFORMADO!'}
                  </TableCell>

                  <TableCell align='left' style={{ color: theme.palette.mode == 'dark' ? '#fff' : '#000' }}>
                    {formatData(item.dataVenda_vendas)}
                  </TableCell>

                  <TableCell>
                    {item.status_vendas !== '' ? (
                      <CustomChip
                        rounded
                        size='small'
                        skin='light'
                        color={item.status_vendas == 'PAGO' ? 'success' : 'error'}
                        label={item.status_vendas}
                        sx={{ fontWeight: 500, color: theme.palette.mode == 'dark' ? '#fff' : '#000' }}
                      />
                    ) : (
                      'NÃO INFORMADO'
                    )}
                  </TableCell>
                  <TableCell align='left'>
                    <Button variant='contained' onClick={() => handleUrl(item.vendas_id)}>
                      EDITAR
                    </Button>
                    <Button sx={{ marginLeft: 3 }} variant='contained' onClick={() => deleteItem(item.vendas_id)}>
                      EXCLUIR
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        {data.length <= 0 && (
          <Alert sx={{ width: '100%' }} severity='warning'>
            Nenhuma informação Encontrada
          </Alert>
        )}
      </TableContainer>
    )
  }
}

export default ItemList
