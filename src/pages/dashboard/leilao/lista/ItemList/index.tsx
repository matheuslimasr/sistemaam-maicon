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
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField
} from '@mui/material'

import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { baseUrlApi } from 'src/configs/themeConfig'
import { useTheme } from '@emotion/react'

import CustomChip from 'src/@core/components/mui/chip'

const ItemList = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState([] as any)
  const [search, setSearch] = useState('')
  const [load, setLoad] = useState(true)
  const [limitRows, setLimitRows] = useState(50)

  const theme = useTheme()

  const searchAndGetCollection = async () => {
    let queryParams = ''

    if (search !== '') {
      queryParams = `${baseUrlApi}/leilao?nomeProduto=${search}&limit=${limitRows}`
    } else {
      queryParams = `${baseUrlApi}/leilao?limit=${limitRows}`
    }

    fetch(queryParams, {
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

  const searchItems = async () => {
    searchAndGetCollection()
  }

  useEffect(() => {
    searchAndGetCollection()
  }, [])

  const deleteItem = item => {
    if (confirm('Tem certeza que deseja excluir este item?') == true) {
      fetch(`${baseUrlApi}/leilao/${item}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        router.reload()
      })
    }
  }

  const handleUrl = item => {
    if (item) {
      router.push({
        pathname: '/dashboard/leilao/edit',
        query: { uid: item }
      })
    }
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

  if (load) {
    return <h4>Carregando...</h4>
  } else {
    return (
      <TableContainer component={Paper}>
        <Grid container>
          <Grid item xs={12} md={12} lg={8}>
            <Box sx={{ padding: 5 }} item>
              <TextField
                fullWidth
                autoFocus
                label='Buscar'
                value={search}
                onChange={value => setSearch(value.target.value)}
                placeholder='Buscar...'
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={12} lg={2}>
            <InputLabel id='demo-simple-select-outlined-label'>Total Registros</InputLabel>
            <FormControl>
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
              >
                <MenuItem value={1}>1</MenuItem>
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
                router.push('/dashboard/leilao/')
              }}
            >
              Novo Produto
            </Button>
          </Grid>
        </Grid>

        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='left'>FOTO</TableCell>
              <TableCell align='left'>NOME/TÍTULO</TableCell>

              <TableCell align='left'>VALOR INICIAL</TableCell>
              <TableCell align='left'>TAMANHO DA LÂMINA</TableCell>
              <TableCell align='left'>ESPESSURA</TableCell>
              <TableCell align='left'>MATERIAL DA LÂMINA</TableCell>
              <TableCell align='left'>MATERIAL DO CABO</TableCell>
              <TableCell align='left'>INFORMAÇÕES</TableCell>
              <TableCell align='left'>STATUS</TableCell>
              <TableCell align='left'>DATA DE REGISTRO</TableCell>
              <TableCell align='right'>AÇÕES</TableCell>
            </TableRow>
          </TableHead>
          {data.length > 0 && (
            <TableBody>
              {data.map((item, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{
                      '&:last-of-type td, &:last-of-type th': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell align='left' style={{ color: theme.palette.mode == 'dark' ? '#fff' : '#000' }}>
                      {item.urlImage && (
                        <img
                          alt='img'
                          style={{ backgroundColor: '#eee', width: 100, height: 'auto' }}
                          src={
                            item.urlImage
                              ? item.urlImage
                              : 'https://media.istockphoto.com/id/1324356458/vector/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=ZmXO4mSgNDPzDRX-F8OKCfmMqqHpqMV6jiNi00Ye7rE='
                          }
                          width={100}
                          height={'auto'}
                        />
                      )}
                    </TableCell>
                    <TableCell align='left'>{item.nomeProduto}</TableCell>
                    <TableCell align='left'>
                      <CustomChip
                        rounded
                        size='small'
                        skin='light'
                        color='success'
                        label={'$  ' + parseFloat(item.valorInicial)}
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell align='left'>{item.tamanhoLamina}</TableCell>
                    <TableCell align='left'>{item.expressura}</TableCell>
                    <TableCell align='left'>{item.materialLamina}</TableCell>
                    <TableCell align='left'>{item.materialCabo}</TableCell>
                    <TableCell align='left'>{item.informacoesAdicional}</TableCell>

                    <TableCell align='left'>
                      <CustomChip
                        rounded
                        size='small'
                        skin='light'
                        color={item.at_auction === '2' ? 'success' : 'error'}
                        label={item.at_auction === '2' ? 'EM LEILÃO' : 'NÃO ESTÁ EM LEILÃO'}
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>

                    <TableCell align='left'>{item.created_at}</TableCell>
                    <TableCell align='right'>
                      <Button variant='contained' onClick={() => handleUrl(item.idProdutosLeilao)}>
                        EDITAR
                      </Button>
                      <Button
                        sx={{ marginLeft: 3 }}
                        variant='contained'
                        onClick={() => deleteItem(item.idProdutosLeilao)}
                      >
                        EXCLUIR
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
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
