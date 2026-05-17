import { RateLimiterRes, RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "../Config/redis.config";
import { NextFunction, Request, Response } from "express";
import { IRequest } from "../Common";
import { FailedResponse } from "../Utils/Response/response-helper.utils";

type RateLimitOptions = {
  keyPrefix: string;
  points: number;
  duration: number;
  message: string;
  keyGenerator?: (req: Request) => string;
};

type SocketRateLimitOptions = {
  keyPrefix: string;
  points: number;
  duration: number;
};






const createRateLimitMiddleware = ({ keyPrefix, points, duration, message, keyGenerator }: RateLimitOptions) => {
  const limiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix,
    points,
    duration,
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = keyGenerator ? keyGenerator(req) : req.ip || "unknown";

      await limiter.consume(key);

      next();
    } catch (error) {
      if (!(error instanceof RateLimiterRes)) {
        return next(error);
      }

      res.setHeader("Retry-After", Math.max(1, Math.ceil(error.msBeforeNext / 1000)).toString());
      return res.status(429).json(FailedResponse(message, 429));
    }
  };
};

const loggedInUserKey = (req: Request) => {
  return (req as unknown as IRequest).loggedInUser?.user?._id?.toString() || req.ip || "unknown";
};

const createSocketRateLimiter = ({ keyPrefix, points, duration }: SocketRateLimitOptions) => {
  return new RateLimiterRedis({
    storeClient: redis,
    keyPrefix,
    points,
    duration,
  });
};

export const socketAuthRateLimiter = createSocketRateLimiter({
  keyPrefix: "rate_limit:socket:auth",
  points: 20,
  duration: 5 * 60,
});

export const socketMessageRateLimiter = createSocketRateLimiter({
  keyPrefix: "rate_limit:socket:message",
  points: 60,
  duration: 60,
});

export const socketReadRateLimiter = createSocketRateLimiter({
  keyPrefix: "rate_limit:socket:read",
  points: 30,
  duration: 60,
});

export const consumeSocketRateLimit = async (limiter: RateLimiterRedis, key: string) => {
  try {
    await limiter.consume(key);
    return true;
  } catch (error) {
    if (!(error instanceof RateLimiterRes)) {
      throw error;
    }

    return false;
  }
};







export const rateLimitMiddleware = createRateLimitMiddleware({
  keyPrefix: "rate_limit:global",
  points: 300,
  duration: 5 * 60,
  message: "Too many requests",
});

export const authRateLimitMiddleware = createRateLimitMiddleware({
  keyPrefix: "rate_limit:auth",
  points: 10,
  duration: 15 * 60,
  message: "Too many auth attempts, please try again later.",
});

export const signupRateLimitMiddleware = createRateLimitMiddleware({
  keyPrefix: "rate_limit:signup",
  points: 5,
  duration: 15 * 60,
  message: "Too many signup attempts, please try again later.",
});

export const signinRateLimitMiddleware = createRateLimitMiddleware({
  keyPrefix: "rate_limit:signin",
  points: 20,
  duration: 15 * 60,
  message: "Too many sign-in attempts, please try again later.",
});

export const graphQLRateLimitMiddleware = createRateLimitMiddleware({
  keyPrefix: "rate_limit:graphql",
  points: 120,
  duration: 5 * 60,
  message: "Too many GraphQL requests, please try again later.",
});

export const uploadRateLimitMiddleware = createRateLimitMiddleware({
  keyPrefix: "rate_limit:upload",
  points: 20,
  duration: 10 * 60,
  message: "Too many upload attempts, please try again later.",
  keyGenerator: loggedInUserKey,
});
