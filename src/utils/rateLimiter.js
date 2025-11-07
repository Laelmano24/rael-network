import { RateLimiterMemory } from "rate-limiter-flexible"

const rateLimiter = new RateLimiterMemory({
  points: 1,
  duration: 60,
  blockDuration: 60
})

function getClientIp(req) {
  return req.headers["cf-connecting-ip"] 
      || req.headers["x-forwarded-for"]?.split(",")[0] 
      || req.socket.remoteAddress
}

async function checkLimiter(req) {
    const ip = getClientIp(req)
    if (!ip) return true

  try {
    await rateLimiter.consume(ip)
    return true
  } catch (rejRes) {
    return
  }
}

export default checkLimiter