// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import { UserDataType } from 'src/context/types'
import { useRouter } from 'next/router'
import { baseUrlApi } from 'src/configs/themeConfig'
import { use, useEffect, useState } from 'react'
import { Alert, MenuItem, Select } from '@mui/material'

import ProgressLinearIndeterminate from 'src/views/components/progress/ProgressLinearIndeterminate'
let defaultValues = {
  nomeCliente: '',
  telefoneCliente: '',
  infoAdds: ''
}

const schema = yup.object().shape({
  nomeCliente: yup.string().required().trim(),
  telefoneCliente: yup.string().trim(),
  infoAdds: yup.string().trim()
})

interface User {
  user: UserDataType
}

interface FormData {
  nomeCliente: string
  infoAdds: string
}

let arrayDataAddress = []

let authId = 'cd962010-73e7-e0e0-d2b9-c2e77df09ba4'
let authToken = 'CSd8UP3K93wRGMiWMQMn'

const FormClientes = ({ user }: User) => {
  const SmartyStreetsSDK = require('smartystreets-javascript-sdk')
  const SmartyStreetsCore = SmartyStreetsSDK.core
  const Lookup = SmartyStreetsSDK.usStreet.Lookup

  const router = useRouter()
  const [loginGenerated, setLoginGenerated] = useState(false)
  const [telefone, setTelefone] = useState('')
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState([])
  const [dataAddress, setDataAddress] = useState([])
  const [load, setLoad] = useState(false)
  const [activeButton, setActiveButton] = useState('')
  const [senha, setSenha] = useState('')

  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [cidade, setCidade] = useState('')
  const [uf, setUf] = useState('')
  const [cep, setCep] = useState('')

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    setLoad(true)

    const address = {
      street: rua.replace(',', ''),
      city: cidade,
      state: uf,
      zip: cep,
      numero: numero
    }

    const dataForm = {
      nomeCliente_clientes: data.nomeCliente,
      telefoneCliente_clientes: telefone,
      password_client: senha,
      enderecoCliente_clientes: address,
      infoAdds_clientes: data.infoAdds,
      loginGenerated: loginGenerated ? 'sim' : 'nao'
    }

    await fetch(`${baseUrlApi}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataForm)
    })
      .then(async response => {
        response.json().then(async status => {
          if (status?.status === 'ERROR') {
            window.alert(status.msg)
            window.alert(
              'USPS: O endereço enviado não foi encontrado. Verifique se há abreviaturas excessivas na linha do endereço ou no nome da cidade.'
            )
          } else {
            reset()
            router.push({
              pathname: '/dashboard/clientes/lista'
            })
          }

          setLoad(false)
        })
      })
      .catch(error => {
        console.log(error)
        setLoad(false)
      })
  }

  const handleGenerateLoginDataClient = () => {
    if (confirm('Tem certeza que deseja criar Login para o Cliente?') == true) {
      setLoginGenerated(true)
    }
  }

  const handleSendWhatsAppCredentials = () => {
    const messsage =
      '🔪🇺🇸 AG CUTELARIA USA, Seus dados de login estão prontos, você pode estar logando com seu número de *Telefone:* [' +
      telefone +
      '] e Senha [' +
      senha +
      '] no *Link:* cliente.agcutelariausa.com \n\r Acesse agora mesmo para ver seus pedidos.'
    const link = `https://web.whatsapp.com/send?phone=${telefone}&text=${messsage}&app_absent=0`

    window.open(link, '_blank')
  }

  const handleAddressAutoComplete = async addressParam => {
    setAddress(addressParam)
    await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${addressParam}&apiKey=0b676055d507431cb91519923f5b701f`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(async response => {
      await response.json().then(data => {
        if (data.statusCode == 400) {
          setDataAddress([])
        } else {
          setDataAddress(data.features)
        }
      })
    })
  }

  const handleToggle = value => {
    setActiveButton(value)
    if (value !== '') {
      const addressItem = dataAddress[value].properties

      setNumero(addressItem.housenumber)
      setRua(addressItem.street)
      setCep(addressItem.postcode)
      setCidade(addressItem.city)
      setUf(addressItem.state_code)
    }
  }

  const handlerGeneratePasswordButton = () => {
    if (confirm('Tem certeza que deseja criar uma senha automatica?') == true) {
      const randomPassword = Math.floor(100000 + Math.random() * 900000)
      setSenha(randomPassword)
      window.alert('Senha gerada automaticamente')
    }
  }

  if (loading) {
    return <FallbackSpinner />
  } else {
    return (
      <Card>
        <CardHeader title='Cadastro de Clientes' />
        {load && (
          <>
            <ProgressLinearIndeterminate />
            <br />
            <br />
          </>
        )}
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12} md={12} lg={12}></Grid>

              <Grid item xs={12} md={12} lg={4}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='nomeCliente'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        label='Nome do Cliente'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.nomeCliente)}
                        placeholder='Ex.: João Santos Cardoso'
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} lg={4}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <TextField
                    autoFocus
                    label='Telefone/WhatsApp'
                    value={telefone}
                    onChange={value => setTelefone(value.target.value)}
                    placeholder='00 0000-0000'
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} lg={4}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <TextField
                    autoFocus
                    label='Numero'
                    value={numero}
                    onChange={value => setNumero(value.target.value)}
                    placeholder='Numero'
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} lg={4}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <TextField
                    autoFocus
                    label='Rua'
                    value={rua}
                    onChange={value => setRua(value.target.value)}
                    placeholder='Rua'
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} lg={4}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <TextField
                    autoFocus
                    label='Cidade'
                    value={cidade}
                    onChange={value => setCidade(value.target.value)}
                    placeholder='Cidade'
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} lg={4}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <TextField
                    autoFocus
                    label='Estado'
                    value={uf}
                    onChange={value => setUf(value.target.value)}
                    placeholder='Estado'
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} lg={4}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <TextField
                    autoFocus
                    label='ZipCode'
                    value={cep}
                    onChange={value => setCep(value.target.value)}
                    placeholder='ZipCode'
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='infoAdds'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        rows={4}
                        multiline
                        id='textarea-filled'
                        label='Informações Adicionais'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.infoAdds)}
                        placeholder='Informações Adicionais'
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <p>
                  <strong>Opcional: </strong>gere os dados de login do cliente, para que ele possa ver todos os pedidos
                  dele.
                </p>
                <Box
                  sx={{
                    gap: 5,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  {telefone !== '' && (
                    <Button
                      sx={{ backgroundColor: '#3a86ff' }}
                      type='button'
                      onClick={handleGenerateLoginDataClient}
                      variant='contained'
                      size='large'
                    >
                      GERAR DADOS E ENVIAR SMS
                    </Button>
                  )}

                  {telefone !== '' && (
                    <Button
                      sx={{ backgroundColor: '#23CB17' }}
                      type='button'
                      onClick={handleSendWhatsAppCredentials}
                      variant='contained'
                      size='large'
                    >
                      GERAR DADOS E ENVIAR LOGIN PARA O WHATSAPP DO CLIENTE
                    </Button>
                  )}

                  {loginGenerated && (
                    <Alert severity='success'>Credenciais de Login Geradas, Finalize agora cadastrando a venda.</Alert>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    gap: 5,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Button type='submit' variant='contained' size='large'>
                    SALVAR
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    )
  }
}

export default FormClientes
