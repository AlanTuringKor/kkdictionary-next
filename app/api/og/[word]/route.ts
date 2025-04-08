// app/api/og/[word]/route.ts
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request, { params }: { params: { word: string } }) {
  const query = decodeURIComponent(params.word)
  const definition = '신조어는 ㅋㅋ백과에서!'

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
          fontFamily: 'sans-serif',
          paddingTop: '60px',
        },
        children: [
          // 배경 도배용 'ㅋ' 텍스트 레이어
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
              children: Array(1000).fill('ㅋ').join(' '),
            },
          },
          // 실제 단어
          {
            type: 'h1',
            props: {
              style: {
                fontSize: 80,
                color: '#FFDC00',
                marginBottom: '40px',
                zIndex: 1,
              },
              children: query,
            },
          },
          // 설명
          {
            type: 'p',
            props: {
              style: {
                fontSize: 40,
                color: '#FFDC00',
                lineHeight: 1.4,
                maxWidth: 1000,
                textAlign: 'center',
                zIndex: 1,
              },
              children: definition,
            },
          },
          // 사이트명
          {
            type: 'span',
            props: {
              style: {
                fontSize: 24,
                marginTop: '60px',
                color: '#FFDC00',
                zIndex: 1,
              },
              children: 'ㅋㅋ백과',
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
    }
  )
}