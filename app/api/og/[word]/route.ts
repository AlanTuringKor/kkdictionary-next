import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: { word: string } }) {
  const query = decodeURIComponent(params.word.replace(/\.png$/, ''))
  const definition = '신조어는 ㅋㅋ백과에서!'

  // 길이에 따라 폰트 크기 조절
  const dynamicFontSize = query.length <= 4 ? 250
                        : query.length <= 6 ? 200
                        : query.length <= 8 ? 160
                        : query.length <= 10 ? 120
                        : 100

  // NanumMyeongjo 폰트 불러오기
  const fontPath = path.join(process.cwd(), 'public/fonts/NanumMyeongjo-Bold.ttf')
  const fontData = fs.readFileSync(fontPath)

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#003366',
          fontFamily: 'NanumMyeongjo, serif',
          paddingTop: '60px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-300px',
                left: -100,
                width: '150%',
                height: '100%',
                fontSize: 80,
                lineHeight: 1.1,
                color: 'rgba(255, 220, 0, 0.08)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                padding: '10px',
                transform: 'rotate(-20deg)',
              },
              children: Array(1500).fill('ㅋ').join(' '),
            },
          },
          {
            type: 'h1',
            props: {
              style: {
                fontSize: dynamicFontSize,
                color: '#FFDC00',
                marginBottom: '20px',
                zIndex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '1100px',
              },
              children: query,
            },
          },
          {
            type: 'p',
            props: {
              style: {
                fontSize: 36,
                color: '#FFDC00',
                lineHeight: 1.4,
                maxWidth: 1000,
                textAlign: 'center',
                zIndex: 1,
              },
              children: definition,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'NanumMyeongjo',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
