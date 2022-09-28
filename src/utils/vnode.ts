import { ComponentInternalInstance, createVNode, render } from 'vue'

export const renderComponent = (
  el: Element,
  component: any,
  props: any,
  instance: ComponentInternalInstance
) => {
  const vnode = createVNode(component, props)
  vnode.appContext = { ...instance.appContext }

  render(vnode, el)

  return () => {
    render(null, el)
  }
}
