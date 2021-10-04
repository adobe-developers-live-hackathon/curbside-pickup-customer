/*
* <license header>
*/

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Flex,
  Heading,
  Form,
  TextField,
  Button,
  StatusLight,
  ProgressCircle,
  Text,
  View
} from '@adobe/react-spectrum'

import actions from '../config.json'
import actionWebInvoke from '../utils'

const ActionsForm = (props) => {
  const [state, setState] = useState({
    formValid: null,
    actionResponse: null,
    actionResponseError: null,
    parkingSpaceNumber: '',
    parkingSpaceNumberValid: null,
    orderNumber: '',
    orderNumberValid: null,
    customerEmail: '',
    customerEmailValid: null,
    actionImHereInProgress: false,
    actionResult: ''
  })

  return (
    <View   width={{base: 'auto', L: 'size-6000'}}
            minWidth={'350px'}
            margin={'0 auto'}
    >
      <Heading level={1}>Curbside Pick Up</Heading>
      <Form necessityIndicator="label">
        <TextField
          label="Parking space #"
          placeholder='your parking space number'
          validationState={state.parkingSpaceNumberValid}
          isRequired
          value={state.parkingSpaceNumber}
          onChange={(input) =>
            setNumberInput(input, 'parkingSpaceNumber', 'parkingSpaceNumberValid')
          }
        />

        <TextField
          label="Order #"
          placeholder='your order number'
          validationState={state.orderNumberValid}
          isRequired
          value={state.orderNumber}
          onChange={(input) =>
            setNumberInput(input, 'orderNumber', 'orderNumberValid')
          }
        />

        <TextField
          type="email"
          label="Email"
          placeholder='customer email'
          validationState={state.customerEmailValid}
          isRequired
          value={state.customerEmail}
          onChange={(input) =>
            setEmailInput(input, 'customerEmail', 'customerEmailValid')
          }
        />

        <Flex>
          <Button
            variant="primary"
            type="button"
            onPress={imHereAction.bind(this)}
            isDisabled={!formValid()}
            width="100%"
          ><Text>I'm here</Text></Button>

          <ProgressCircle
            aria-label="loading"
            isIndeterminate
            isHidden={!state.actionImHereInProgress}
            marginStart="size-100"
          />
        </Flex>
      </Form>

      {state.actionResponseError && (
        <View padding={`size-100`} marginTop={`size-100`} marginBottom={`size-100`} borderRadius={`small`}>
          <StatusLight variant="negative">{state.actionResponseError} Failure! Something went wrong.</StatusLight>
        </View>
      )}
      {!state.actionResponseError && state.actionResponse && (
        <View padding={`size-100`} marginTop={`size-100`} marginBottom={`size-100`} borderRadius={`small `}>
          <StatusLight variant="positive">Success! Please wait for your order at the specified spot.</StatusLight>
        </View>
      )}

    </View>
  )

  // Methods

  // parses a number input and adds it to the state
  async function setNumberInput (input, stateNumber, stateValid) {
    let content
    let validStr = null
    if (input) {
      content = parseInt(input) || input
      validStr = Number.isInteger(content) ? 'valid' : 'invalid'
    }
    setState({ ...state, [stateNumber]: content, [stateValid]: validStr })
  }

  // check the email input and adds it to the state
  async function setEmailInput (input, stateName, stateValid) {
    // Hackathon TODO: Implement validation of email
    setState({ ...state, [stateName]: input, [stateValid]: 'valid' })
  }

  // checks if form is valid
  function formValid () {
    return !!(state.parkingSpaceNumber && state.parkingSpaceNumberValid
      && state.orderNumber && state.orderNumberValid && state.customerEmailValid)
  }

  // invokes a the selected backend actions with input headers and params
  async function imHereAction () {
    setState({ ...state, actionImHereInProgress: true, actionResult: 'calling action ... ' })
    const parkingSpaceNumber = state.parkingSpaceNumber || ''
    const orderNumber = state.orderNumber || ''
    const customerEmail = state.customerEmail || ''
    const params = {
      parkingSpaceNumber: parkingSpaceNumber,
      orderNumber: orderNumber,
      customerEmail: customerEmail
    }
    const startTime = Date.now()

    const headers = {}

    let formattedResult = ""
    try {
      // invoke backend action
      const actionResponse = await actionWebInvoke(actions['i-am-here'], headers, params)
      formattedResult = `time: ${Date.now() - startTime} ms\n` + JSON.stringify(actionResponse,0,2)

      // store the response
      setState({
        ...state,
        actionResponse,
        actionResult:formattedResult,
        actionResponseError: null,
        actionInvokeInProgress: false,
        parkingSpaceNumber: '',
        parkingSpaceNumberValid: null,
        orderNumber: '',
        orderNumberValid: null,
        customerEmail: '',
        customerEmailValid: null
      })
      console.log(`Response from i-am-here action:`, actionResponse)
    } catch (e) {
      // log and store any error message
      formattedResult = `time: ${Date.now() - startTime} ms\n` + e.message
      console.error(e)
      setState({
        ...state,
        actionResponse: null,
        actionResult:formattedResult,
        actionResponseError: e.message,
        actionInvokeInProgress: false
      })
    }
  }
}

ActionsForm.propTypes = {
  runtime: PropTypes.any,
  ims: PropTypes.any
}

export default ActionsForm
