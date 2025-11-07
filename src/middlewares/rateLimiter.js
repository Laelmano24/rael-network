import { RateLimiterMemory } from "rate-limiter-flexible"

const rateLimiter = new RateLimiterMemory({
  points: 1,
  duration: 30,
  blockDuration: 30
})

function getClientIp(req) {
  return req.headers["cf-connecting-ip"] 
      || req.headers["x-forwarded-for"]?.split(",")[0] 
      || req.socket.remoteAddress
}

async function limiter(req, res, next) {
  const ip = getClientIp(req) || "unknown"
  try {
    await rateLimiter.consume(ip)
    next()
  } catch (rejRes) {
    res.status(429).json({
      message: "Devagar pai"
    })
  }
}

export default limiter