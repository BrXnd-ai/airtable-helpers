import { NextRequest } from 'next/server'
import { UnknownKeysParam, ZodObject, ZodRawShape, ZodTypeAny } from 'zod'

export async function processRequest<
  T extends ZodRawShape,
  UnknownKeys extends UnknownKeysParam = 'strip',
  Catchall extends ZodTypeAny = ZodTypeAny,
  Output = object,
  Input = object,
>(
  req: NextRequest,
  requestFormat: ZodObject<T, UnknownKeys, Catchall, Output, Input>,
) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.API_KEY}`) {
    console.log('Unauthorized')
    throw new Error('Invalid API Key')
  }
  const body = await req.json()
  try {
    console.log(body)
    requestFormat.parse(body)
  } catch (error) {
    console.log('Bad Request')
    throw new Error('Invalid Request Body')
  }
  return body
}
