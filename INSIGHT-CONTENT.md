# 인사이트 콘텐츠 등록

1. 직접 제작한 표지 이미지를 `assets/insight/`에 저장합니다. 영문 파일명을 사용하세요. PNG, JPG, WEBP, AVIF를 지원합니다.
2. `js/insight-data.js`의 `window.MAPI_INSIGHTS` 배열에 콘텐츠를 추가합니다.
3. 아래 빈 값에 실제 정보를 입력한 뒤 `isPublished`를 `true`로 변경하고 페이지를 새로고침합니다.

```js
window.MAPI_INSIGHTS = [
  {
    id: '',
    title: '',
    category: 'consumer',
    author: '',
    image: '',
    instagramUrl: '',
    publishedAt: '',
    isPublished: false
  }
];
```

- `id`: 중복되지 않는 식별자.
- `title`: 실제 콘텐츠 제목.
- `category`: 아래 목록 중 하나.
- `author`: 실제 작성자 또는 팀명. 비워두면 표시하지 않습니다.
- `image`: 선택 사항입니다. 비워두면 파란 폴더를 표시합니다. 제공된 표지의 프로젝트 상대 경로(`assets/insight/영문파일명.jpg`).
- `instagramUrl`: 실제 인스타그램 게시물의 HTTPS 링크. `/p/`, `/reel/`, `/tv/` 게시물 주소를 지원합니다.
- `publishedAt`: 실제 게시일, `YYYY-MM-DD` 형식. 비워두면 날짜를 표시하지 않습니다.
- `isPublished`: `true`인 콘텐츠만 공개합니다.

| category | 화면 표시 |
| --- | --- |
| consumer | 소비자 의사결정 |
| branding | 브랜드와 정체성 |
| social | 소셜미디어 마케팅 |
| pricing | 가격과 프로모션 |
| ai | AI와 마케팅 |

새 항목은 배열 안에 쉼표로 구분해 추가하세요. 게시일 최신순으로 정렬됩니다. 제목·식별자·카테고리·유효한 게시물 링크가 없거나 비공개인 콘텐츠는 표시하지 않습니다. 실제 이미지 파일도 함께 저장해야 합니다. 외부 이미지 다운로드나 인스타그램 이미지 수집은 하지 않습니다.

별도 서버나 빌드 과정은 필요하지 않습니다. 파일을 직접 여는 환경에서도 작동합니다.

논문 정보는 `paperTitle`(논문명), `paperAuthors`(논문 저자), `paperYear`(출판 연도) 필드로 추가할 수 있습니다. `author`에는 발표자의 기수와 이름을 입력합니다.
