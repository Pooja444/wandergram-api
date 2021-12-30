import { handleRequest } from './handlers/handler'

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})