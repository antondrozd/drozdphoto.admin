import { useState, useEffect, ReactNode } from 'react'
import { Prompt, useHistory, useLocation } from 'react-router-dom'
import { Location } from 'history'
import { Modal, ModalFuncProps } from 'antd'

interface IProps {
  when: boolean
  modalConfig: Omit<ModalFuncProps, 'onOk'>
  children?: ReactNode
}

const RouteLeavingProtector = ({ when, modalConfig, children }: IProps) => {
  const [isRouteLeavingConfirmed, setIsRouteLeavingConfirmed] = useState(false)
  const [nextLocation, setNextLocation] = useState<Location | null>(null)
  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    if (isRouteLeavingConfirmed) {
      nextLocation && history.push(nextLocation)
      setIsRouteLeavingConfirmed(false)
      setNextLocation(null)
    }
  }, [history, isRouteLeavingConfirmed, nextLocation])

  const handleRouteLeaving = (nextLocation: Location) => {
    if (!isRouteLeavingConfirmed && location.pathname !== nextLocation.pathname) {
      Modal.confirm({
        ...modalConfig,
        onOk: () => {
          setIsRouteLeavingConfirmed(true)
          setNextLocation(nextLocation)
        },
      })

      return false
    }

    return true
  }

  return (
    <>
      {children}
      <Prompt when={when} message={handleRouteLeaving} />
    </>
  )
}

export default RouteLeavingProtector
