import { NextRequest } from 'next/server'
import xml2js from 'xml2js'
import { z } from 'zod'

import { processRequest } from '@/utils/auth'

const requestFormat = z.object({
  url: z.string(),
})

export async function POST(req: NextRequest) {
  console.log('/api/sitemap')
  const body = (await processRequest(req, requestFormat)) as z.infer<
    typeof requestFormat
  >

  const response = await fetch(body.url)

  if (!response.ok) {
    console.log('Could not get sitemap for URL: ', body.url)
    console.log(response)
    return new Response('Error getting sitemap', { status: 400 })
  }

  const sitemap = await response.text()

  const jsonSitemap = await xml2js.parseStringPromise(sitemap)
  return new Response(JSON.stringify(jsonSitemap), { status: 200 })
}
