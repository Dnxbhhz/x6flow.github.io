import type { RouteObject } from 'react-router-dom'
import { Suspense, lazy, type ReactElement } from 'react'
import App from '../App'

const Home = lazy(() => import('../pages/Home'))

const withSuspense = (element: ReactElement): ReactElement => (
  <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
)

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [{ index: true, element: withSuspense(<Home />) }],
  },
]
