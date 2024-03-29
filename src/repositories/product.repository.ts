import sql from 'mssql'
import { FastifyBaseLogger } from 'fastify'

export default class Product {
  schema: string = '[product].'
  _logger: FastifyBaseLogger
  _pool: sql.ConnectionPool

  constructor(logger: FastifyBaseLogger, pool: sql.ConnectionPool) {
    this._logger = logger
    this._pool = pool
  }

  async get(id: number, usercode: number, culture: string, user_id?: string): Promise<any | undefined> {
    const r = new sql.Request(this._pool)
    r.input('id', sql.Int, id)
    r.input('user_id', sql.VarChar, user_id)
    r.input('usercode', sql.Int, usercode)
    r.input('culture', sql.VarChar, culture)
    const result = await r.execute(this.schema + '[usp_get]')

    if (result.recordset.length > 0) {
      return result.recordset[0]
    }
    return undefined
  }

  async getBase(id: number, usercode: number, culture: string): Promise<any | undefined> {
    const r = new sql.Request(this._pool)
    r.input('id', sql.Int, id)
    r.input('usercode', sql.Int, usercode)
    r.input('culture', sql.VarChar, culture)
    const result = await r.execute(this.schema + '[usp_getBase]')

    if (result.recordset.length > 0) {
      return result.recordset[0]
    }
    return undefined
  }

  async findItemNumById(id: number): Promise<string | undefined> {
    const r = new sql.Request(this._pool)
    r.input('id', sql.Int, id)
    const result = await r.execute('findItemNumById')

    if (result.recordset.length > 0) {
      return result.recordset[0].itemNum
    }
    return undefined
  }

  async putFavorite(id: number, customer_id: number, address_id: number, mode: number) {
    const r = new sql.Request(this._pool)
    r.input('product_id', sql.Int, id)
    r.input('customer_id', sql.Int, customer_id)
    r.input('address_id', sql.Int, address_id)
    r.input('mode', sql.Bit, mode)
    const result = await r.execute(this.schema + '[usp_putFavorite]')

    if (result.rowsAffected.length > 0) {
      return result.rowsAffected[0] > 0
    }
    return undefined
  }

  async putDescription(id: number, customer_id: number, address_id: number, description: string) {
    const r = new sql.Request(this._pool)
    r.input('product_id', sql.Int, id)
    r.input('customer_id', sql.Int, customer_id)
    r.input('address_id', sql.Int, address_id)
    r.input('description', sql.VarChar, description)
    const result = await r.execute(this.schema + '[usp_putDescription]')

    if (result.rowsAffected.length > 0) {
      return result.rowsAffected[0] > 0
    }
    return undefined
  }

  async deleteDescription(id: number, customer_id: number, address_id: number) {
    const r = new sql.Request(this._pool)
    r.input('product_id', sql.Int, id)
    r.input('customer_id', sql.Int, customer_id)
    r.input('address_id', sql.Int, address_id)
    const result = await r.execute(this.schema + '[usp_deleteDescription]')

    if (result.rowsAffected.length > 0) {
      return result.rowsAffected[0] > 0
    }
    return undefined
  }

  async getUserSettings(usercode: number): Promise<undefined | any> {
    const r = new sql.Request(this._pool)
    r.input('usercode', sql.Int, usercode)

    const result = await r.execute(`sso.usp_getUserSettings`)

    if (result.recordset.length > 0) {
      return result.recordset[0]
    }
    return undefined
  }
}