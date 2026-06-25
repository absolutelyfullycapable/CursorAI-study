// 피드 데이터. 이미지는 base64로 인라인된 images 모듈을 사용한다.
// (img01은 png, img02~10은 jpg 원본을 base64로 변환)
import { images } from './images.js'

export const posts = [
  {
    id: 1,
    username: 'jiwoo_kim',
    avatar: images.woman,
    location: '서울특별시',
    image: images.img01,
    likes: 1284,
    caption: '오늘 하루도 수고했어요 🌿 잠깐의 여유가 주는 행복.',
    comments: [
      { user: 'min._.ho', text: '사진 진짜 감성있다 😍' },
      { user: 'travel_lover', text: '여기 어디예요?? 가보고 싶어요!' },
    ],
    time: '2시간 전',
  },
  {
    id: 2,
    username: 'minho_dev',
    avatar: images.man,
    location: '부산광역시 해운대구',
    image: images.img02,
    likes: 932,
    caption: '바다 보러 다녀왔습니다 🌊 역시 부산은 못 참지.',
    comments: [
      { user: 'sea_you', text: '날씨 너무 좋네요!' },
    ],
    time: '4시간 전',
  },
  {
    id: 3,
    username: 'cafe_daily',
    avatar: images.woman,
    location: '연남동',
    image: images.img03,
    likes: 2451,
    caption: '오늘의 디저트 ☕️🍰 달콤한 게 최고야.',
    comments: [
      { user: 'sweet_tooth', text: '비주얼 미쳤다…' },
      { user: 'foodie_kr', text: '저장하고 갑니다 📌' },
    ],
    time: '5시간 전',
  },
  {
    id: 4,
    username: 'travel_with_me',
    avatar: images.man,
    location: '제주특별자치도',
    image: images.img04,
    likes: 5023,
    caption: '제주의 노을은 언제 봐도 완벽해 🌅',
    comments: [
      { user: 'jeju_life', text: '제주 살고 싶다 진짜' },
    ],
    time: '7시간 전',
  },
  {
    id: 5,
    username: 'foodie_seoul',
    avatar: images.woman,
    location: '성수동',
    image: images.img05,
    likes: 731,
    caption: '주말엔 역시 맛집 탐방 🍜 너무 맛있었다!',
    comments: [
      { user: 'eat_seoul', text: '여기 웨이팅 길죠?' },
    ],
    time: '9시간 전',
  },
  {
    id: 6,
    username: 'daily_look',
    avatar: images.man,
    location: '강남구',
    image: images.img06,
    likes: 1893,
    caption: '오늘의 OOTD 👕 가을 코디 시작!',
    comments: [
      { user: 'fashion_p', text: '핏 너무 좋아요 👍' },
      { user: 'style_kim', text: '바지 정보 좀요!' },
    ],
    time: '11시간 전',
  },
  {
    id: 7,
    username: 'green_thumb',
    avatar: images.woman,
    location: '집 거실',
    image: images.img07,
    likes: 642,
    caption: '새 식구가 생겼어요 🪴 이름은 뭘로 할까요?',
    comments: [
      { user: 'plant_mom', text: '몬스테라 너무 예뻐요!' },
    ],
    time: '13시간 전',
  },
  {
    id: 8,
    username: 'run_everyday',
    avatar: images.man,
    location: '한강공원',
    image: images.img08,
    likes: 1120,
    caption: '오늘도 10km 완주 🏃‍♂️ 러닝은 배신하지 않는다.',
    comments: [
      { user: 'fit_life', text: '대단해요 진짜 💪' },
    ],
    time: '15시간 전',
  },
  {
    id: 9,
    username: 'pet_diary',
    avatar: images.woman,
    location: '우리집',
    image: images.img09,
    likes: 3387,
    caption: '우리 강아지 너무 귀엽지 않나요 🐶💛',
    comments: [
      { user: 'dog_lover', text: '심장 폭행 ㅠㅠ 너무 귀여워' },
      { user: 'cutie_pet', text: '간식 주고 싶다 🦴' },
    ],
    time: '18시간 전',
  },
  {
    id: 10,
    username: 'night_view',
    avatar: images.man,
    location: '남산서울타워',
    image: images.img10,
    likes: 4210,
    caption: '서울의 야경은 사랑입니다 🌃✨',
    comments: [
      { user: 'seoul_night', text: '사진 작품이네요 📸' },
    ],
    time: '1일 전',
  },
];

export const stories = [
  { id: 1, username: '내 스토리', avatar: images.man, isOwn: true },
  { id: 2, username: 'jiwoo_kim', avatar: images.woman },
  { id: 3, username: 'minho_dev', avatar: images.man },
  { id: 4, username: 'cafe_daily', avatar: images.woman },
  { id: 5, username: 'travel_me', avatar: images.man },
  { id: 6, username: 'foodie', avatar: images.woman },
  { id: 7, username: 'daily_look', avatar: images.man },
  { id: 8, username: 'green_thumb', avatar: images.woman },
  { id: 9, username: 'run_day', avatar: images.man },
];

export const suggestions = [
  { id: 1, username: 'design_inspo', avatar: images.woman, reason: '회원님을 위한 추천' },
  { id: 2, username: 'code_master', avatar: images.man, reason: 'jiwoo_kim님이 팔로우합니다' },
  { id: 3, username: 'travel_gram', avatar: images.woman, reason: '회원님을 위한 추천' },
  { id: 4, username: 'photo_art', avatar: images.man, reason: '새로운 Instagram 계정' },
  { id: 5, username: 'daily_coffee', avatar: images.woman, reason: '회원님을 위한 추천' },
];

export const currentUser = {
  username: 'my_account',
  name: '김커서',
  avatar: images.man,
};
