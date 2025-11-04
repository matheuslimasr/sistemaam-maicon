// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useRouter } from 'next/router'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import React, { useEffect, useState } from 'react'
import { Alert, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import { baseUrlApi } from 'src/configs/themeConfig'

const ItemList = () => {
  const { user } = useAuth()
  const [data, setData] = useState([] as any)
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [load, setLoad] = useState(true)
  const [limitRows, setLimitRows] = useState(9999)

  const searchAndGetCollection = async () => {
    let queryParams = ''

    if (search !== '') {
      queryParams = `${baseUrlApi}/categorias?nomeCategoria_categorias=${search}&limit=${limitRows}`
    } else {
      queryParams = `${baseUrlApi}/categorias?limit=${limitRows}`
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

  const handleUrl = item => {
    if (item) {
      router.push({
        pathname: '/dashboard/categorias/edit',
        query: { uid: JSON.stringify(item) }
      })
    }
  }

  const deleteItem = item => {
    if (confirm('Tem certeza que deseja excluir este item?') == true) {
      fetch(`${baseUrlApi}/categorias/${item}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        router.reload()
      })
    }
  }

  const searchItems = async () => {
    searchAndGetCollection()
  }

  useEffect(() => {
    searchAndGetCollection()
  }, [])

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
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
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
                router.push('/dashboard/categorias/')
              }}
            >
              Nova Categoria
            </Button>
          </Grid>
        </Grid>

        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align='left'>NOME</TableCell>
              <TableCell align='left'>DATA DE CADASTRO</TableCell>
              <TableCell align='left'>AÇÕES</TableCell>
            </TableRow>
          </TableHead>
          {data.length > 0 && (
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={item.id_categorias}
                  sx={{
                    '&:last-of-type td, &:last-of-type th': {
                      border: 0
                    }
                  }}
                >
                  <TableCell component='th' scope='row'>
                    {item.id_categorias}
                  </TableCell>
                  <TableCell align='left'>{item.nomeCategoria_categorias}</TableCell>
                  <TableCell align='left'>{item.created_at}</TableCell>
                  <TableCell align='left'>
                    <Button variant='contained' onClick={() => handleUrl(item.id_categorias)}>
                      EDITAR
                    </Button>
                    <Button sx={{ marginLeft: 3 }} variant='contained' onClick={() => deleteItem(item.id_categorias)}>
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
