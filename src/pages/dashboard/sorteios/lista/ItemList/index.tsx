// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useRouter } from 'next/router'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import React, { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { baseUrlApi } from 'src/configs/themeConfig'

import ReactHTMLTableToExcel from 'react-html-table-to-excel'

const ItemList = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState([] as any)
  const [search, setSearch] = useState('')
  const [load, setLoad] = useState(true)
  const [limitRows, setLimitRows] = useState(9999)

  const searchAndGetCollection = async () => {
    let queryParams = ''

    queryParams = `${baseUrlApi}/sorteio`

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

  useEffect(() => {
    searchAndGetCollection()
  }, [])

  if (load) {
    return <h4>Carregando...</h4>
  } else {
    return (
      <TableContainer component={Paper}>
        <table border={1} cellPadding={10} id='table-to-xls' width='100%'>
          <thead>
            <tr style={{ fontSize: 10 }}>
              <th>ID</th>
              <th>NOME</th>
              <th>TELEFONE</th>
              <th>ENDEREÇO</th>
              <th>COMPLEMENTO</th>
              <th>CIDADE</th>
              <th>ESTADO</th>
              <th>CEP</th>
              <th>DATA CADASTRO</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nome}</td>
                  <td>{item.telefone}</td>
                  <td>{item.endereco}</td>
                  <td>{item.complemento}</td>
                  <td>{item.city}</td>
                  <td>{item.state}</td>
                  <td>{item.zipcode}</td>
                  <td>{item.dataCadastro}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <ReactHTMLTableToExcel
          id='test-table-xls-button'
          className='download-table-xls-button'
          table='table-to-xls'
          filename='tablexls'
          sheet='tablexls'
          buttonText='EXPORT'
        />
      </TableContainer>
    )
  }
}

export default ItemList
