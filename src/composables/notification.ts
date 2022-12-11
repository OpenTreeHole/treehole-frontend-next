import { useNotificationStore } from '@/store'

export const useNotification = () => {
  const notificationStore = useNotificationStore()
  const success = (message: string, timeout?: number) => {
    notificationStore.notification = {
      type: 'success',
      message,
      timeout: timeout || 2000
    }
  }

  const error = (message: string, timeout?: number) => {
    notificationStore.notification = {
      type: 'error',
      message,
      timeout: timeout || 2000
    }
  }

  const info = (message: string, timeout?: number) => {
    notificationStore.notification = {
      type: 'info',
      message,
      timeout: timeout || 2000
    }
  }

  const warning = (message: string, timeout?: number) => {
    notificationStore.notification = {
      type: 'warning',
      message,
      timeout: timeout || 2000
    }
  }

  return { success, error, info, warning }
}
