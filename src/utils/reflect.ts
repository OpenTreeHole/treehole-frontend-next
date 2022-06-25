/* eslint-disable @typescript-eslint/ban-types */
import 'reflect-metadata'

type FieldDecorator = {
  type?: new (data?: any) => any
  factory?: (data: any, parent: any) => any
  array?: boolean
} | void

type Constructor<T = any> = new () => T

export const Field = (field: FieldDecorator) => {
  return (target: Object, propertyKey: string | symbol) => {
    // append propertyKey to field list metadata
    Reflect.defineMetadata(
      'FieldList',
      [...(Reflect.getMetadata('FieldList', target) ?? []), propertyKey],
      target
    )

    // your actual decorator
    Reflect.defineMetadata('Field', field, target, propertyKey)
  }
}

export const Model = (target: Object) => {
  Reflect.defineMetadata('Model', true, target)
}

export const factory = <T>(TargetClass: Constructor<T>, data: any): T => {
  if (!Reflect.getMetadata('Model', TargetClass))
    throw new Error('Only class with decorator @Model can be factorized!')
  const fieldNames: (keyof T)[] = Reflect.getMetadata('FieldList', TargetClass.prototype)
  const obj = new TargetClass()
  for (const fieldName of fieldNames) {
    if (typeof fieldName === 'number') continue
    const field: FieldDecorator = Reflect.getMetadata('Field', TargetClass.prototype, fieldName)

    obj[fieldName] = data[fieldName]

    if (field) {
      if (field.type) {
        if (Reflect.getMetadata('Model', field.type)) {
          if (field.array) obj[fieldName] = arrayFactory(field.type, data[fieldName]) as any
          else obj[fieldName] = factory(field.type, data[fieldName])
        } else obj[fieldName] = new field.type(data[fieldName])
      } else if (field.factory) obj[fieldName] = field.factory(data[fieldName], data)
    }
  }
  return obj
}

export const arrayFactory = <T>(TargetClass: Constructor<T>, data: any[]): T[] => {
  return data.map((v) => factory(TargetClass, v))
}
