// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import { databaseFirebaseConfig } from 'src/configs/firebase'
import { child, get, getDatabase, ref, update } from 'firebase/database'
import { useEffect, useState } from 'react'
import { baseUrlApi } from 'src/configs/themeConfig'
import ProgressLinearIndeterminate from 'src/views/components/progress/ProgressLinearIndeterminate'

const schema = yup.object().shape({
  nomeCliente: yup.string().trim(),
  enderecoCliente: yup.string().trim(),
  infoAdds: yup.string().trim()
})

const defaultValues = {
  nomeCliente: '',
  enderecoCliente: '',
  infoAdds: ''
}

interface FormData {
  nomeCliente: string
  enderecoCliente: string
  infoAdds: string
}

const FormClientes = ({ user }) => {
  const router = useRouter()
  const [dataDb, setDataDb] = useState()
  const [load, setLoad] = useState(true)
  const [loading, setLoading] = useState(false)

  const [address, setAddress] = useState([])
  const [dataAddress, setDataAddress] = useState([])
  const [activeButton, setActiveButton] = useState('')

  const [senha, setSenha] = useState('')

  const [enderecoCompleto, setEnderecoCompleto] = useState('')

  const [loginGenerated, setLoginGenerated] = useState(false)
  const [telefone, setTelefone] = useState('')

  const getCollection = async () => {
    await fetch(`${baseUrlApi}/clientes/${router.query.uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(dataItem => {
        setDataDb(dataItem[0])
      })
    })

    setLoad(false)
  }

  useEffect(() => {
    getCollection()
  }, [])

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
    setLoading(true)

    const dataForm = {
      nomeCliente_clientes: data.nomeCliente ? data.nomeCliente : dataDb?.nomeCliente_clientes,
      telefoneCliente_clientes: telefone !== '' ? telefone : dataDb?.telefoneCliente_clientes,
      password_client: senha,
      enderecoCliente_clientes: enderecoCompleto ? enderecoCompleto : dataDb?.enderecoCliente_clientes,
      infoAdds_clientes: data.infoAdds ? data.infoAdds : dataDb?.infoAdds_clientes
    }

    await fetch(`${baseUrlApi}/clientes/${router.query.uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataForm)
    })
      .then(async response => {
        response.json().then(async status => {
          if (status?.status === 'ERROR') {
            window.alert(status.msg)
            window.alert('Houve um erro interno, consulte o desenvolvedor para analisar o problema!')
          } else {
            reset()
            router.push({
              pathname: '/dashboard/clientes/lista'
            })
          }
        })
      })
      .catch(error => {
        console.log(error)
      })

    setLoading(false)
  }

  const handleGenerateLoginDataClient = () => {
    if (confirm('Tem certeza que deseja criar Login para o Cliente?') == true) {
      setLoginGenerated(true)
    }
  }

  const handleSendWhatsAppCredentials = () => {
    const messsage = `🔪🇺🇸 AG CUTELARIA USA, Seus dados de login estão prontos, você pode estar logando com seu número de Telefone: [${telefone}] e Senha [${senha}]  no Link: agcutelariausa.com`
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

      console.log(dataAddress[value])

      const dataAddressItem = `${addressItem.housenumber}, ${addressItem.street}, ${addressItem.city} - ${addressItem.state_code}, ${addressItem.postcode}`

      setEnderecoCompleto(dataAddressItem)
    }
  }

  if (load) {
    return <h5>Carregando...</h5>
  } else {
    return (
      <Card>
        <CardHeader title='Editar Cliente' />
        <CardContent>
          {loading && (
            <>
              <ProgressLinearIndeterminate />
              <br />
              <br />
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12} md={12} lg={6}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='nomeCliente'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
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
                <p style={{ padding: 0, margin: 0 }}>
                  <strong>Nome atual:</strong>{' '}
                  {dataDb?.nomeCliente_clientes != '' ? dataDb?.nomeCliente_clientes : 'NÃO INFORMADO'}
                </p>
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <TextField
                    label='Telefone/WhatsApp'
                    value={telefone}
                    onChange={value => setTelefone(value.target.value)}
                    error={Boolean(errors.telefoneCliente)}
                    placeholder='00 0000-0000'
                  />
                </FormControl>
                <p style={{ padding: 0, margin: 0 }}>
                  <strong>Telefone:</strong>{' '}
                  {dataDb?.telefoneCliente_clientes != '' ? dataDb?.telefoneCliente_clientes : 'NÃO INFORMADO'}
                </p>
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <TextField
                    label='Endereço Completo'
                    value={enderecoCompleto}
                    onChange={value => setEnderecoCompleto(value.target.value)}
                    placeholder='Endereço completo'
                  />
                </FormControl>
                <p style={{ padding: 0, margin: 0 }}>
                  <strong>Endereço:</strong>{' '}
                  {dataDb?.enderecoCliente_clientes != '' ? dataDb?.enderecoCliente_clientes : 'NÃO INFORMADO'}
                </p>
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
                <p style={{ padding: 0, margin: 0 }}>
                  <strong>Informação Adicional:</strong>{' '}
                  {dataDb?.infoAdds_clientes != '' ? dataDb?.infoAdds_clientes : 'NÃO INFORMADO'}
                </p>
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
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
                  <Button disabled={loading} type='submit' variant='contained' size='large'>
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
