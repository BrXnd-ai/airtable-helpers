import { NextRequest } from 'next/server'
import xml2js from 'xml2js'
import { z } from 'zod'

import { processRequest } from '@/utils/auth'

const requestFormat = z.object({
  url: z.string(),
})

export async function POST(req: NextRequest) {
  console.log('/api/sitemap')
  const body = await processRequest(req, requestFormat)
  const response = await fetch(body.sitemapUrl)
  if (!response.ok) {
    return new Response('Error getting sitemap', { status: 400 })
  }
  const sitemap = await response.text()
  const jsonSitemap = await xml2js.parseStringPromise(sitemap)
  return new Response(JSON.stringify(jsonSitemap), { status: 200 })
}
