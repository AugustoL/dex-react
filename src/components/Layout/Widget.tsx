import React from 'react'
import styled from 'styled-components'
import { depositApi } from 'api'
import { EtherscanLink } from 'components/EtherscanLink'
import { useWalletConnection } from 'hooks/useWalletConnection'
import PageWrapper from './PageWrapper'
import { RESPONSIVE_SIZES } from 'const'

const { TABLET, MOBILE_LARGE } = RESPONSIVE_SIZES

const Wrapper = styled(PageWrapper)`
  overflow-x: visible;
  min-width: 0;
  background: #FFFFFF;
  box-shadow: 0 -1rem 4rem 0 rgba(0,0,0,0.05), rgba(0, 0, 0, 0.02) 0 0.276726rem 0.221381rem 0, rgba(0, 0, 0, 0.027) 0 .666501rem .532008rem 0, rgba(0, 0, 0, 0.035) 0 1.25216rem 1.0172rem 0, rgba(0, 0, 0, 0.043) 0 2.23363rem 1.7869rem 0, rgba(0, 0, 0, 0.05) 0 4.17776rem 3.34221rem 0, rgba(0, 0, 0, 0.07) 0 10rem 8rem 0;
  border-radius: .6rem;
  width: 100%;
  min-height: 54rem;
  display: flex;
  flex-flow: row nowrap;
  font-size: 1.6rem;
  line-height: 1;

  /* @media only screen and (max-width: ${TABLET}em) {
    margin: 0 auto 3rem;
    padding: 1em;
    width: 80%;
  }

  @media only screen and (max-width: ${MOBILE_LARGE}em) {
    width: 100%;
  } */
`

const LinkWrapper = styled(EtherscanLink)`
  text-align: right;
  margin-bottom: 2em;
  display: block;
`

interface Props {
  children: React.ReactNode
  className?: string
}

const Widget: React.FC<Props> = ({ children, className }) => {
  const { networkId } = useWalletConnection()
  const contractAddress = networkId ? depositApi.getContractAddress(networkId) : null

  return (
    <Wrapper className={className} $bgColor="transparent" $boxShadow="none" $width="auto">
      {children}
    </Wrapper>
  )
}

// {
//   contractAddress && (
//     <LinkWrapper type="contract" identifier={contractAddress} label={<small>View verified contract</small>} />
//   )
// }

export default Widget
