import React, {useEffect} from 'react'
import {Outlet, Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import {Auth0Provider} from '@auth0/auth0-react'
import * as Sentry from '@sentry/react'
import ShareRoutes from './ShareRoutes'
import debug from './utils/debug'


const installPrefix = window.location.pathname.startsWith('/Share') ? '/Share' : ''
const basePath = `${installPrefix }/`
const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

/**
 * From URL design: https://github.com/bldrs-ai/Share/wiki/URL-Structure
 * ... We adopt a URL structure similar to Google Apps URL structure:
 *
 *   http://host/<app>/<view>/<object>
 *
 * which when fully expanded becomes:
 *
 *   http://host/share/v/p/indec.ifc
 *   http://host/share/v/gh/bldrs-ai/Share/main/public/index.ifc
 *
 * @see https://github.com/bldrs-ai/Share/wiki/Design#ifc-scene-load
 * @param {React.Component} testElt For unit test allow use of a stub here instead of loading the app.
 * @return {object}
 */
export default function BaseRoutes({testElt = null}) {
  const location = useLocation()
  const navigation = useNavigate()


  useEffect(() => {
    if (location.pathname === installPrefix ||
        location.pathname === basePath) {
      debug().log('BaseRoutes#useEffect[], forwarding to: ', `${installPrefix}/share`)
      navigation(`${installPrefix}/share`)
    }
  }, [location, navigation])

  return (
    <Auth0Provider
      domain='bldrs.us.auth0.com'
      clientId='xojbbSyJ9n6HUdZwE7LUX7Zvff6ejxjv'
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage"
    >
      <SentryRoutes>
        <Route path={basePath} element={<Outlet/>}>
          <Route
            path="share/*"
            element={
              testElt ||
              <ShareRoutes
                installPrefix={installPrefix}
                appPrefix={`${installPrefix }/share`}
              />
            }
          />
        </Route>
      </SentryRoutes>
    </Auth0Provider>
  )
}
