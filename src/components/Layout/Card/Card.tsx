import React from 'react'
import styled from 'styled-components'
import { MEDIA } from 'const'

const CardRowDrawer = styled.tr`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  box-shadow: 0 100vh 0 999vw rgba(47, 62, 78, 0.5);
  z-index: 9999;
  width: 50rem;
  height: 42rem;
  border-radius: 0.6rem;
  background: #ffffff;

  @media ${MEDIA.mobile} {
    width: 100%;
    bottom: 0;
    top: initial;
    height: 80vh;
  }

  // Inner td wrapper
  > td {
    position: relative;
    background: transparent;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
    border-radius: 6px;
    margin: 0;
    width: 100%;
    height: 100%;
    border: 0;

    > div {
      margin: 0;
    }

    span.symbol {
      color: #b02ace;
    }

    > div > h4 {
      height: 5.6rem;
      padding: 0 1.6rem;
      box-sizing: border-box;
      letter-spacing: 0;
      font-size: 1.6rem;
      text-align: left;
      color: #2f3e4e;
      margin: 0;
      display: flex;
      align-items: center;
      font-family: var(--font-default);
      font-weight: var(--font-weight-regular);
      border-bottom: 0.1rem solid #dfe6ef;
    }

    .times {
    }
  }
`
const CardDrawerCloser = styled.a`
  position: absolute;
  right: 1.6rem;
  top: 0.8rem;
  text-decoration: none;
  font-size: 4rem;
  line-height: 1;
  color: #526877;
  opacity: 0.5;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }
`

interface CardDrawerProps {
  children: React.ReactNode
  closeDrawer: () => void
}

export const CardDrawer = React.forwardRef<HTMLTableRowElement, CardDrawerProps>(function ReffedCardDrawer(
  { children, closeDrawer },
  ref,
) {
  return (
    <CardRowDrawer ref={ref}>
      <td>
        <CardDrawerCloser onClick={closeDrawer}>&times;</CardDrawerCloser>
        {children}
      </td>
    </CardRowDrawer>
  )
})

export const CardTable = styled.table<{
  $bgColor?: string

  $headerGap?: string
  $columns?: string
  $rows?: string
  $gap?: string
  $cellSeparation?: string
  $rowSeparation?: string

  $align?: string
  $justify?: string

  $webCSS?: string
}>`
  display: grid;
  grid-gap: ${({ $headerGap = '0.3rem' }): string => $headerGap};
  width: 100%;

  &.balancesOverview {
    width: 100%;
    display: table;
    padding: 0 0 2.4rem;
  }

  &.balancesOverview > tbody {
    font-size: 1.3rem;
  }

  &.balancesOverview > thead {
    background: #FFFFFF;
  }

  &.balancesOverview > thead > tr:not(${CardRowDrawer}),
  &.balancesOverview > tbody > tr:not(${CardRowDrawer}) {
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr) );
    min-height: 5.4rem;
    text-align: right;
    padding: 0 .8rem;
    margin: 0;
    justify-content: flex-start;
  }

  &.balancesOverview > thead > tr:not(${CardRowDrawer}) >  th {
    font-size: 1.1rem;
    color: #2F3E4E;
    letter-spacing: 0;
    text-align: right;
    padding: 0 .5rem;

      &:first-of-type {
        text-align: left;
      }
  }

  &.balancesOverview > tbody > tr:not(${CardRowDrawer}) > td {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding: 0 .5rem;
    text-align: right;
    justify-content: flex-end;

    // &[data-label=Actions] {
    //   flex-flow: row nowrap;
    // }

    &:first-of-type {
      text-align: left;
      justify-content: flex-start;
    }
  }
  
  > thead {
    position: sticky;
    top: 0;
    // background: #EDF2F7;
    z-index: 5;
    font-size: 1.1rem;
    color: #2F3E4E;
    letter-spacing: 0;
    font-weight: var(--font-weight-medium);
  }

  > thead, tbody {
    > tr:not(${CardRowDrawer}) {
      position: relative;
      display: grid;
      // grid-template-columns: ${({ $columns }): string => $columns || `repeat(auto-fit, minmax(3rem, 1fr))`};
      grid-template-columns: minmax(2rem,.4fr) minmax(7rem,16rem) minmax(4rem,11rem) minmax(5rem, 7.5rem) minmax(3rem,9rem);
      // grid-template-rows
      ${({ $rows }): string => ($rows ? `grid-template-rows: ${$rows};` : '')}
      // grid-gap
      ${({ $gap }): string => ($gap ? `grid-gap: ${$gap};` : '')}
      align-items: ${({ $align = 'center' }): string => $align};
      justify-content: ${({ $justify = 'center' }): string => $justify};
      border-bottom: .1rem solid rgba(159,180,201,0.50);
      border-radius: 0;

      // How much separation between ROWS
      margin: ${({ $rowSeparation = '1rem' }): string => `${$rowSeparation} 0`};
      text-align: center;
      transition: all 0.2s ease-in-out;
      z-index: 1;
      
      &.highlight {
        background-color: var(--color-background-highlighted);
        border-bottom-color: #fbdf8f;
      }

      &.selected {
        background-color: var(--color-button-disabled);
        color: #fff;
      }

      // Separation between CELLS
      > th,
      > td {
        // margin: ${({ $cellSeparation = '0 .5rem' }): string => $cellSeparation};
        text-overflow: ellipsis;
        overflow: hidden;
      }

      > th[data-label="Expires"] {
        text-align: left;
        padding: 0 .75rem;
      }

      > th.checked,
      > td.checked {
        margin: 0;
        width: 2.4rem;
      }
    }
    
    > tr > td[data-label="Price"] {
      text-align: left;
      // margin: 0 auto 0 0;
    }
    
    > tr > td[data-label="Expires"] {
      text-align: left;
      padding: 0 .75rem;
    }
    
    > tr > td[data-label="Unfilled Amount"] {
      text-align: right;
    }
    
    .status {
      text-align: left;
    }

    // > ${CardRowDrawer} {
    //   > td {
    //     margin-top: ${({ $rowSeparation = '1rem' }): string =>
      `-${Number($rowSeparation.split('rem')[0]) * 2.2}rem`};
    //   }
    // }
  }
  
  .lowBalance {
    color: #B27800;
    display: block;
    > img {margin: 0 0 0 .25rem;}
  }
  
  // Table Header
  > thead {
    // No styling for table header
    > tr {
      background-color: transparent;
      box-shadow: none;

      > th {
        color: inherit;
        line-height: 1;
        font-size: 1rem;
        text-transform: uppercase;
        overflow-wrap: break-word;
        text-align: left;
        padding: 1.3rem 0;
      }
      
      > th.filled {
        text-align: right;
        // white-space: nowrap;
      }
    }
  }

  // Table Body
  tbody {
    font-size: 1.1rem;
    font-family: var(--font-mono);
    font-weight: var(--font-weight-regular);
    color: #476481;
    letter-spacing: -0.08rem;
    line-height: 1.2;
  }
  
  tbody {
    > tr:not(${CardRowDrawer}) {
      // background-color: ${({ $bgColor = 'var(--color-background-pageWrapper)' }): string => $bgColor};
      // border: 0.125rem solid transparent;
      // box-shadow: var(--box-shadow);

      > td {
        &.cardOpener {
          display: none;
        }
      }

      // Don't highlight on hover selected rows or the drawer
      // &:not(.selected):not(.highlight):not(${CardRowDrawer}):hover {
      //   background: var(--color-background-selected);
      //   border: 0.125rem solid var(--color-border);
      // }
    }
  }

  // Top level custom CSS
  ${({ $webCSS }): string | undefined => $webCSS}
`
