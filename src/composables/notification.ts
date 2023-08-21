import { useNotificationStore } from '@/store'

export const useNotification = () => {
  const notificationStore = useNotificationStore()

  const notifier =
    (type: 'success' | 'error' | 'info' | 'warning') => (message: string, timeout?: number) => {
      notificationStore.notification = {
        type,
        message,
        timeout: timeout || 2000
      }
    }

  const notify = (
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    timeout?: number
  ) => {
    notifier(type)(message, timeout)
  }

  const success = notifier('success')
  const error = notifier('error')
  const info = notifier('info')
  const warning = notifier('warning')

  return { notify, success, error, info, warning }
}
