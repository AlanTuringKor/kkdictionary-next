import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  const db = await getDb()
  const words = await db
    .collection('dictionaries')
    .find({}, { projection: { word: 1, last_modified: 1 } })
    .toArray()

  const urls = words.map(({ word, last_modified }) => {
    const lastmod = last_modified
      ? new Date(last_modified).toISOString()
      : new Date().toISOString() // fallback

    return `
      <url>
        <loc>https://kkdictionary.com/search/${encodeURIComponent(word)}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
      </url>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://kkdictionary.com/</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    ${urls.join('\n')}
  </urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
