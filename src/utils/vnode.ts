import { AppContext, createVNode, render, VNodeProps } from 'vue'

export const renderComponent = (
  el: Element,
  component: any,
  props: any,
  appContext: AppContext
) => {
  const vnode = createVNode(component, props)
  vnode.appContext = { ...appContext }
  render(vnode, el)

  return () => {
    render(null, el)
  }
}
