/*
* <license header>
*/

import React from 'react'
import { Provider, defaultTheme, View, Flex} from '@adobe/react-spectrum'
import ErrorBoundary from 'react-error-boundary'
import ActionsForm from './ActionsForm'

function App (props) {
  console.log('runtime object:', props.runtime)
  console.log('ims object:', props.ims)

  // use exc runtime event handlers
  // respond to configuration change events (e.g. user switches org)
  props.runtime.on('configuration', ({ imsOrg, imsToken, locale }) => {
    console.log('configuration change', { imsOrg, imsToken, locale })
  })
  // respond to history change events
  props.runtime.on('history', ({ type, path }) => {
    console.log('history change', { type, path })
  })

  return (
    <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
      <Flex>
        <Provider theme={defaultTheme}
                  colorScheme={`light`}
                  alignSelf={'center'}
                  margin={'20px auto'}
        >
          <View gridArea='content' padding='size-200'>
            <ActionsForm runtime={props.runtime} ims={props.ims} />
          </View>
        </Provider>
      </Flex>
    </ErrorBoundary>
  )

  // Methods

  // error handler on UI rendering failure
  function onError (e, componentStack) { }

  // component to show if UI fails rendering
  function fallbackComponent ({ componentStack, error }) {
    return (
      <React.Fragment>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
          Something went wrong :(
        </h1>
        <pre>{componentStack + '\n' + error.message}</pre>
      </React.Fragment>
    )
  }
}

export default App
