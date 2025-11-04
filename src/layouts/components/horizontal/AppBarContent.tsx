// ** MUI Imports
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import CustomChip from 'src/@core/components/mui/chip'
// ** Hook Import
import { useAuth } from 'src/hooks/useAuth'
import { useEffect, useState } from 'react'
import HiddenPrices from './HiddenPrices'
import { baseUrlApi } from 'src/configs/themeConfig'

interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { settings, saveSettings } = props
  const theme = useTheme()
  const { user } = useAuth()
  // ** Hook
  const auth = useAuth()
  const [vendas, setVendas] = useState([] as any)
  const [totalCusto, setTotalCusto] = useState<Number>()
  const [totalVenda, setTotalVenda] = useState<Number>()
  const [hidden, setHidden] = useState(false)

  const handleTotal = () => {
    let ttotalVenda = 0
    let ttotalCusto = 0
    vendas.map((item, index) => {
      ttotalCusto += item.valorVenda_vendas - item.custoProduto_vendas - item.custoEnvio_vendas
      ttotalVenda += parseFloat(item.valorVenda_vendas)
    })

    setTotalCusto(ttotalCusto)
    setTotalVenda(ttotalVenda)
  }

  const getVendas = async () => {
    await fetch(`${baseUrlApi}/vendas?limit=9999999`, {
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

  useEffect(() => {
    getVendas()
    handleTotal()
  }, [])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {hidden && (
        <Box>
          <div
            style={{
              backgroundColor: theme.palette.primary,
              padding: 10,
              marginRight: 10,
              paddingRight: 20,
              paddingLeft: 20
            }}
          >
            <CustomChip
              rounded
              size='small'
              skin='light'
              color='warning'
              label={
                totalVenda !== ''
                  ? `VENDAS MENSAL ` + totalVenda?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                  : 'NÃO INFORMADO'
              }
              sx={{ fontWeight: 500, marginRight: 10 }}
            />
            <CustomChip
              rounded
              size='small'
              skin='light'
              color='success'
              label={
                totalCusto !== ''
                  ? `LUCROS MENSAL ` + totalCusto?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                  : 'NÃO INFORMADO'
              }
              sx={{ fontWeight: 500 }}
            />
          </div>
        </Box>
      )}
      <HiddenPrices setHidden={setHidden} hidden={hidden} />
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      {auth.user && (
        <>
          <UserDropdown settings={settings} />
        </>
      )}
    </Box>
  )
}

export default AppBarContent
