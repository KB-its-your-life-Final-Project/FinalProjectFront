/*데이터랑 타입을 분리해서 가져와보기 */
import imgPrice from '@/assets/imgs/graph.png'
import imgMatch from '@/assets/imgs/homematch.png'
import imgFind from '@/assets/imgs/findneighborhood.png'
import imgSafe from '@/assets/imgs/safety_report.png'


export type HomeCardType = {
  title: string;
  info: string;
  imgSrc: string;
  path: string;
};

export const HomeCardTypes: HomeCardType[] = [
  {
    title: '동네 집값',
    info: '최근 아파트 실거래가를 확인해보세요',
    imgSrc: imgPrice,
    path: '/map',
},
  {
    title: 'AI 홈 매칭',
    info: '모르는 정보를 쉽게 설명해 줄게요',
    imgSrc: imgMatch,
    path: '/',
  },
{
  title: '동네.zip',
    info: '인기 많은 곳은 어디일까?',
  imgSrc: imgFind,
  path: '/localinfo',
},
  {
    title: 'AI 안심 레포트',
    info: '지금 보고 있는 곳 위험하지 않다면?',
    imgSrc: imgSafe,
    path: '/safereport',
  },
  ];
