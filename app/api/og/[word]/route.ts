// app/api/og/[word]/route.ts
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request, { params }: { params: { word: string } }) {
  const query = decodeURIComponent(params.word.replace(/\.png$/, '')) // ⬅️ .png 제거
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
          fontFamily: 'Impact, Arial Black, sans-serif',
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
              children: Array(1500).fill('ㅋ').join(' '),
            },
          },
          // 실제 단어 (더 크게 표시)
          {
            type: 'h1',
            props: {
              style: {
                fontSize: 250,
                color: '#FFDC00',
                marginBottom: '20px',
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
    }
  )
}
