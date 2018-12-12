import styled, { ThemeProvider } from 'styled-components'

import Header from './Header'
import Meta from './Meta'

const theme = {
  red: '#ff0000',
  black: '#393939',
  grey: '3a3a3a',
  lightgrey: '#e1e1e1',
  offWhite: '#ededed',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
}

const StyledPage = styled.div`
  background: #fff;
  color: ${props => props.theme.black};
`

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`

const Page = props => (
  <ThemeProvider theme={theme} >
    <StyledPage>
      <Meta />
      <Header/>
      <Inner>
        {props.children}
      </Inner>
    </StyledPage>
  </ThemeProvider>
)

export default Page