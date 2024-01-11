import Fastify from '@groupclaes/fastify-elastic'
import { FastifyInstance } from 'fastify'
import { env } from 'process'

import productsController from './controllers/products.controller'

const LOGLEVEL = 'debug'

export default async function (config: any): Promise<FastifyInstance | undefined> {
  if (!config || !config.wrapper) return

  const fastify = await Fastify(config.wrapper)
  const version_prefix = env.APP_VERSION ? '/' + env.APP_VERSION : ''
  await fastify.register(productsController, { prefix: `${version_prefix}/${config.wrapper.serviceName}/products`, logLevel: LOGLEVEL })
  await fastify.listen({ port: +(env['PORT'] ?? 80), host: '::' })

  return fastify
}