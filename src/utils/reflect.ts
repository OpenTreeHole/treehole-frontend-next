/* eslint-disable @typescript-eslint/ban-types */

import 'reflect-metadata'

type FieldDecorator = {
  type?: new (data?: any) => any
  factory?: (data: any, parent: any, meta?: any) => any

  /**
   * This can only be set to true when type is given. And a field cannot be both array and map.
   */
  array?: boolean

  /**
   * This can only be set to true when type is given. And a field cannot be both array and map.
   */
  map?: boolean
  meta?: any
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

/**
 * Factory a Model class with object. The factory based on the @Field decorator.
 * @param TargetClass Model Class
 * @param data the original object
 * @param meta some metadata which can be used in the factory method in FieldDecorator.
 */
export const factory = <T>(TargetClass: Constructor<T>, data: any, meta?: any): T => {
  if (!Reflect.getMetadata('Model', TargetClass))
    throw new Error('Only class with decorator @Model can be factorized!')
  const fieldNames: (keyof T)[] = Reflect.getMetadata('FieldList', TargetClass.prototype)
  const obj = new TargetClass()
  for (const fieldName of fieldNames) {
    if (typeof fieldName === 'number') continue
    const field: FieldDecorator = Reflect.getMetadata('Field', TargetClass.prototype, fieldName)

    obj[fieldName] = data[fieldName]

    if (field) {
      if (field.array && field.map) throw new Error('A field cannot be both array and map!')
      if (field.type && field.factory)
        throw new Error('Type is useless when you want to give the factory on your own!')
      if (!field.type && (field.array || field.map))
        throw new Error('You should give the constructor (i,e. type) for the array or the map!')
      if (field.type) {
        if (Reflect.getMetadata('Model', field.type)) {
          if (field.array)
            obj[fieldName] = arrayFactory(field.type, data[fieldName], field.meta || meta) as any
          else if (field.map)
            obj[fieldName] = mapFactory(field.type, data[fieldName], field.meta || meta) as any
          else obj[fieldName] = factory(field.type, data[fieldName], field.meta || meta)
        } else obj[fieldName] = data[fieldName] ? new field.type(data[fieldName]) : undefined
      } else if (field.factory) obj[fieldName] = field.factory(data[fieldName], data, meta)
    }
  }
  return obj
}

/**
 * Factory an array of Model class with an array of objects. The factory based on the @Field decorator.
 * @param TargetClass Model Class
 * @param data the original object
 * @param meta some metadata which can be used in the factory method in FieldDecorator.
 */
export const arrayFactory = <T>(TargetClass: Constructor<T>, data: any[], meta?: any): T[] => {
  return data.map((v) => factory(TargetClass, v, meta))
}

/**
 * Factory an map of Model class with an map of objects. The factory based on the @Field decorator.
 * @param TargetClass Model Class
 * @param data the original object
 * @param meta some metadata which can be used in the factory method in FieldDecorator.
 */
export const mapFactory = <T>(
  TargetClass: Constructor<T>,
  data: Record<string, any>,
  meta?: any
): Record<string, T> => {
  const ret: Record<string, T> = {}
  for (const key in data) {
    ret[key] = factory(TargetClass, data[key], meta)
  }
  return ret
}
