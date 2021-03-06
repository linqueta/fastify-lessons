module.exports = async function (fastify, options) {
  fastify.get('/plugin', async (request, reply) => {
    return { hello: fastify.util('world', ', big world wih decorator') }
  })

  fastify.decorate('util', (a, b) => a + b)

  fastify.decorateReply('html', function (payload) {
    this.type('text/html') // This is the 'Reply' object
    this.send(`It's the confuse payload: ${payload}`)
  })

  fastify.get('/html', (request, reply) => {
    reply.html('oioioi')
  })

  fastify.decorateRequest('setHeader', function (header) {
    this.isHappy = this.headers[header]
  })

  fastify.decorateRequest('isHappy', false) // This will be added to the Request object prototype, yay speed!

  fastify.addHook('preHandler', async (request, reply) => {
    request.setHeader('happy')
  })

  fastify.get('/happiness', (request, reply) => {
    reply.send({ happy: request.isHappy })
  })

  fastify.decorate('util2', (request, key, value) => { request[key] = value })

  fastify.addHook('preHandler', async (request, reply) => {
    fastify.util2(request, 'timestamp', new Date())
  })

  fastify.get('/plugin1', (request, reply) => {
    reply.send({ date: request.timestamp })
  })

  fastify.get('/plugin2', (request, reply) => {
    reply.send(request)
  })
}