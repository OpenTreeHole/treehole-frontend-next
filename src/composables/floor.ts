import { getFloor } from '@/apis'
import { Floor } from '@/types'
import { useRouter } from 'vue-router'

export const useFloorPortal = () => {
  const router = useRouter()
  const gotoFloor = async (floor: Floor | number) => {
    if (typeof floor === 'number') {
      floor = await getFloor(floor)
    }
    router.push(`/hole/${floor.holeId}?floor=${floor.id}`)
  }
  return { gotoFloor }
}
