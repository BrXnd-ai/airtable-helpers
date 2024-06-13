import axios from 'axios'
import { load } from 'cheerio'
import { NextRequest, NextResponse } from 'next/server'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { z } from 'zod'

const requestFormat = z.object({
  url: z.string(),
  proxy: z.boolean().optional(),
})

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, res: NextResponse) {
  // Check Authorization header against API Key
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== 'Bearer ' + process.env.API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }
  let body
  // Check request body against Zod schema
  try {
    body = await req.json()

    requestFormat.parse(body)
  } catch (error) {
    return new Response('Bad Request', { status: 400 })
  }
  let data
  // Scrape the URL
  if (body.proxy) {
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
      'Accept':
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'DNT': '1', // Do Not Track request header
    }

    const proxyAgent = new SocksProxyAgent(
      `socks5://${process.env.PROXY_USERNAME!}:${process.env
        .PROXY_PASSWORD!}@${process.env.PROXY_HOST!}:${process.env.PROXY_PORT!}`
    )
    try {
      const axiosResponse = await axios.get(body.url, {
        headers,
        httpsAgent: proxyAgent, // Set the agent here
      })

      data = axiosResponse.data
    } catch (error) {
      console.log(error)
      console.log(body.url)
      return new Response('Error getting URL', { status: 400 })
    }
  } else {
    const fetchResponse = await fetch(body.url)
    if (!fetchResponse.ok) {
      return new Response('Error getting URL', { status: 400 })
    }
    data = await fetchResponse.text()
  }
  if (!data) {
    return new Response('Error getting URL', { status: 400 })
  }

  // Extract the data
  const $ = load(data)
  const text = $('body')
    .clone() // clone the body to not alter the original element
    .find('script, style, iframe, img, noscript') // find all unwanted elements
    .remove() // remove them from the clone
    .end() // end the filtering
    .text() // get the text of the cleaned clone
    .replace(/\s+/g, ' ') // replace multiple spaces with a single space
    .trim() // trim whitespace from the ends
  const title = $('title').first().text().trim() || null

  const metadata = $('meta')
    .toArray()
    .map((tag) => {
      const property = $(tag).attr('property') || $(tag).attr('name')
      const content = $(tag).attr('content')
      return { property, content }
    })

  return new Response(JSON.stringify({ text, title, metadata }), {
    status: 200,
  })
}
