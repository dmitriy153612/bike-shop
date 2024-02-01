import { type ComponentInternalInstance, getCurrentInstance } from 'vue'

export default function getUniqId(): (name: string, index?: string) => string {
  return (name: string, index?: string): string => {
    const currentInstance: ComponentInternalInstance | null = getCurrentInstance()
    const uid = currentInstance ? currentInstance.uid : null
    return `${name}-${index || ''}-${uid}`
  }
}
