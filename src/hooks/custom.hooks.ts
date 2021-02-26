import { useLocation } from 'react-router-dom'

export const useActivePhotosetData = () => {
  const location = useLocation()

  const splittedRoute = location.pathname.split('/')
  const activePhotosetID = splittedRoute[splittedRoute.length - 1]
  const activePhotosetType = splittedRoute[splittedRoute.length - 2]

  return { activePhotosetID, activePhotosetType }
}
