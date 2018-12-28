import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

const Dot = styled.div`
  background: ${props => props.theme.red};
  color: white;
  border-radius: 50%;
  padding: .5rem;
  line-height: 2rem;
  min-width: 3rem;
  font-weight: 100;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`

const AnimationStyles = styled.span`
  position: relative;
  .count {
    display: block;
    position: relative;
    transition: all 0.4s;
    backface-visibility: hidden;
  }

  /* initial state */
  .count-enter {
    transform: rotateX(0.5turn);
  }

  /* moving state/post initial state */
  .count-enter-active {
    transform: rotateX(0);
  }

  .count-exit {
    transform: rotateX(0);
    top: 0;
    position: absolute;
  }

  .count-exit-active {
    transform: rotateX(0.5turn);
  }
`

const CartCount = ({ count }) => (
  <AnimationStyles>
    <TransitionGroup>
      <CSSTransition
        unmountOnExit
        className="count"
        classNames="count"
        key={count}
        timeout={{ enter: 400, exit: 400 }}
        >
        <Dot>{count}</Dot>
      </CSSTransition>
    </TransitionGroup>
  </AnimationStyles>
)

CartCount.propTypes = {
  count: PropTypes.number.isRequired
}

export default CartCount
