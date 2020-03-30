import React, { useCallback, Dispatch, SetStateAction } from 'react'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import styled from 'styled-components'
import { useFormContext } from 'react-hook-form'
import { ZERO } from '@gnosis.pm/dex-js'

import { TradeFormTokenId, TradeFormData } from './'
import { PriceInputBox } from './Price'

import useSafeState from 'hooks/useSafeState'
import { formatTimeInHours, makeMultipleOf } from 'utils'

import cog from 'assets/img/cog.svg'
import { MEDIA } from 'const'
import { HelpTooltipContainer, HelpTooltip } from 'components/Tooltip'
import { FormInputError } from './FormMessage'

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  flex-flow: row wrap;
  border-bottom: 0.1rem solid #dfe6ef;

  > input {
    width: 100%;
  }

  .radio-container {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-content: center;

    > small {
      margin: auto 0.5rem;
    }
  }

  > div:first-child {
    width: 100%;
    display: flex;
    align-items: center;

    > div {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      font-weight: var(--font-weight-normal);
      font-size: 1.4rem;
      color: #476481;
      letter-spacing: -0.03rem;
      height: 5.6rem;
      position: relative;
      outline: 0;
      background: transparent;
      align-items: center;
      flex-flow: row wrap;
      padding: 0 0.8rem;

      > b {
        color: #218dff;
        margin: 0 0.4rem;
      }
    }
    > button {
      content: '';
      background: url(${cog}) no-repeat center/contain;
      width: 1.8rem;
      height: 1.8rem;
      margin-left: auto;
      opacity: 0.5;
      transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;

      &:hover {
        opacity: 1;
        transform: rotate(90deg);
      }
    }
  }
`

const OrderValidityInputsWrapper = styled.div<{ $visible: boolean }>`
  visibility: ${({ $visible }): string => ($visible ? 'visible' : 'hidden')};
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: var(--color-background-pageWrapper);
  color: var(--color-text-primary);
  z-index: 2;
  box-shadow: 0 100vh 0 999vw rgba(47, 62, 78, 0.5);
  max-width: 50rem;
  min-width: 30rem;
  height: 30rem;
  padding: 0 0 2.4rem;
  border-radius: 0.8rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  transition: all 0.2s ease-in-out;

  @media ${MEDIA.mobile} {
    height: 40rem;
  }

  > h4 {
    height: 5.6rem;
    padding: 0 1.6rem;
    box-sizing: border-box;
    letter-spacing: 0;
    font-size: 1.6rem;
    text-align: left;
    color: #2f3e4e;
    margin: 0 0 2.4rem;
    display: flex;
    align-items: center;
    font-family: var(--font-default);
    font-weight: var(--font-weight-regular);
    border-bottom: 0.1rem solid #dfe6ef;
    width: 100%;
  }

  > h4 > i {
    cursor: pointer;
    text-decoration: none;
    font-size: 4rem;
    line-height: 1;
    color: #526877;
    opacity: 0.5;
    margin: 0 0 0 auto;
    font-style: normal;
    font-family: var(--font-mono);
    transition: opacity 0.2s ease-in-out;

    &:hover {
      opacity: 1;
    }
  }

  label > input:not([type='checkbox']) {
    padding: 0 6.5rem 0 1rem;
  }

  ${PriceInputBox} {
    padding: 0 0.8rem;

    @media ${MEDIA.mobile} {
      padding: 0 1.6rem;
    }

    > strong {
      text-transform: capitalize;
      color: #2f3e4e;
      font-size: 1.5rem;
      width: 100%;
      margin: 0 0 1rem;
      padding: 0;
      box-sizing: border-box;
    }
  }

  > span {
    margin: auto;
    height: 5.6rem;
    border-top: 0.1rem solid #dfe6ef;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 1.6rem;
    box-sizing: border-box;
  }

  > span > button {
    background: #218dff;
    border-radius: 0.6rem;
    min-width: 14rem;
    padding: 0 1.6rem;
    font-weight: var(--font-weight-bold);
    color: #ffffff;
    text-transform: uppercase;
    font-size: 1.4rem;
    margin: 0 auto;
    outline: 0;
    height: 3.6rem;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    letter-spacing: 0.03rem;
  }
`

const OrderValidityBox = styled(PriceInputBox)`
  flex-flow: column nowrap;

  strong {
    margin-bottom: 1rem;
  }

  label {
    height: 7rem;
  }

  input[type='checkbox'] {
    margin: auto;
  }
`

const OrderStartsTooltip = (
  <HelpTooltipContainer>Orders that are valid ASAP will be considered for the next batch.</HelpTooltipContainer>
)

interface Props {
  validFromInputId: TradeFormTokenId
  validUntilInputId: TradeFormTokenId
  isDisabled: boolean
  isAsap: boolean
  tabIndex: number
  isUnlimited: boolean
  setAsap: Dispatch<SetStateAction<boolean>>
  setUnlimited: Dispatch<SetStateAction<boolean>>
}

const OrderValidity: React.FC<Props> = ({
  isDisabled,
  isUnlimited,
  setAsap,
  setUnlimited,
  isAsap,
  tabIndex,
  validFromInputId,
  validUntilInputId,
}) => {
  const [showOrderConfig, setShowOrderConfig] = useSafeState(false)
  const { setValue, errors, register, getValues, watch } = useFormContext<TradeFormData>()
  const { validFrom, validUntil } = getValues()

  const validFromError = errors[validFromInputId]
  const validUntilError = errors[validUntilInputId]
  const validFromInputValue = watch(validFromInputId)
  const validUntilInputValue = watch(validUntilInputId)
  const overMax = ZERO
  const validFromClassName = validFromError ? 'error' : overMax.gt(ZERO) ? 'warning' : ''
  const validUntilClassName = validUntilError ? 'error' : overMax.gt(ZERO) ? 'warning' : ''

  const handleShowConfig = useCallback((): void => {
    if (showOrderConfig) {
      // sanitize inputs as multiples of 5
      const sanitizedFromValue = validFromInputValue ? makeMultipleOf(5, validFromInputValue).toString() : undefined
      const sanitizedUntilValue = validUntilInputValue ? makeMultipleOf(5, validUntilInputValue).toString() : undefined

      batchedUpdates(() => {
        if (!sanitizedFromValue) setAsap(true)
        if (!sanitizedUntilValue) setUnlimited(true)
        setValue(validFromInputId, sanitizedFromValue, true)
        setValue(validUntilInputId, sanitizedUntilValue, true)
      })
    }

    setShowOrderConfig(showOrderConfig => !showOrderConfig)
  }, [
    setAsap,
    setShowOrderConfig,
    setUnlimited,
    setValue,
    showOrderConfig,
    validFromInputId,
    validFromInputValue,
    validUntilInputId,
    validUntilInputValue,
  ])

  function handleUnlimitedClick(): void {
    setUnlimited(isUnlimited => !isUnlimited)
    !isUnlimited ? setValue(validUntilInputId, undefined, true) : setValue(validUntilInputId, '30', true)
  }
  function handleASAPClick(): void {
    setAsap(isAsap => !isAsap)
    !isAsap ? setValue(validFromInputId, undefined, true) : setValue(validFromInputId, '30', true)
  }

  return (
    <Wrapper>
      <div>
        <div>
          Order starts: <b>{formatTimeInHours(validFrom, 'ASAP')}</b>
          <HelpTooltip tooltip={OrderStartsTooltip} />
          &nbsp;- expires: <b>{formatTimeInHours(validUntil, 'Never')}</b>
        </div>
        <button type="button" tabIndex={tabIndex} onClick={handleShowConfig} />
      </div>

      <OrderValidityInputsWrapper $visible={showOrderConfig}>
        <h4>
          Order settings <i onClick={handleShowConfig}>×</i>
        </h4>
        <OrderValidityBox>
          <strong>Order starts in (min)</strong>
          <label>
            <input
              className={validFromClassName}
              name={validFromInputId}
              type="number"
              step="5"
              disabled={isDisabled || isAsap}
              required
              ref={register}
              onFocus={(e): void => e.target.select()}
              tabIndex={tabIndex}
            />
            <div className="radio-container">
              <input
                type="checkbox"
                checked={isAsap}
                disabled={isDisabled}
                onChange={handleASAPClick}
                tabIndex={tabIndex}
              />
              <small>ASAP</small>
            </div>
          </label>
          <FormInputError errorMessage={validFromError?.message as string} />
        </OrderValidityBox>
        <OrderValidityBox>
          <strong>Order expires in (min)</strong>
          <label>
            <input
              className={validUntilClassName}
              name={validUntilInputId}
              type="number"
              step="5"
              disabled={isDisabled || isUnlimited}
              required
              ref={register}
              onFocus={(e): void => e.target.select()}
              tabIndex={tabIndex}
            />
            <div className="radio-container">
              <input
                type="checkbox"
                disabled={isDisabled}
                checked={isUnlimited}
                onChange={handleUnlimitedClick}
                tabIndex={tabIndex}
              />
              <small>Never</small>
            </div>
          </label>
          <FormInputError errorMessage={validUntilError?.message as string} />
        </OrderValidityBox>
        <span>
          <button
            type="button"
            onClick={handleShowConfig}
            disabled={!!validUntilError || !!validFromError}
            tabIndex={tabIndex}
          >
            Set order parameters
          </button>
        </span>
      </OrderValidityInputsWrapper>
    </Wrapper>
  )
}

export default OrderValidity
