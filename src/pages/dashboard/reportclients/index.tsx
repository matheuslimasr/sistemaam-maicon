import { Button, FormControl, FormGroup, InputLabel, MenuItem, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import Select from '@mui/material/Select'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'

import { baseUrlApi } from 'src/configs/themeConfig'

const reportClients = () => {
  const [load, setLoad] = useState(true)
  const [data, setData] = useState([] as any)

  const [limitRows, setLimitRows] = useState(50)

  const searchAndGetCollection = async () => {
    let queryParams = ''
    queryParams = `${baseUrlApi}/clientes?limit=${limitRows}`

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

  if (load) {
    return <h1>Carregando....</h1>
  } else {
    return (
      <Grid spacing={6}>
        <Grid sx={{ padding: 5 }} container>
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
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} lg={12}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            RELATÓRIO - CLIENTES
          </Typography>

          <ReactHTMLTableToExcel
            id='test-table-xls-button'
            className='download-table-xls-button'
            table='table-to-xls'
            filename='tablexls'
            sheet='tablexls'
            buttonText='EXPORT'
          />

          <br />
          <br />

          <table border={1} cellPadding={10} id='table-to-xls'>
            <thead>
              <tr style={{ fontSize: 10 }}>
                <th>ID</th>
                <th>NOME</th>
                <th>TELEFONE</th>
                <th>ENDEREÇO</th>
                <th>INFORMAÇÃO ADICIONAL</th>
                <th>DATA DE CADASTRO</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                return (
                  <tr key={item.id_clientes}>
                    <td component='th' scope='row'>
                      {item.id_clientes}
                    </td>
                    <td align='left'>{item.nomeCliente_clientes}</td>
                    <td align='left'>{item.telefoneCliente_clientes}</td>
                    <td align='left'>{item.enderecoCliente_clientes}</td>
                    <td align='left'>{item.infoAdds_clientes ? item.infoAdds_clientes : 'NÃO INFORMADO'}</td>
                    <td align='left'>{item.created_at}</td>
                  </tr>
                )
              })}
            </tbody>
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

export default reportClients
