import React from 'react';

// DB(TN_MNU_M001.comp_path)에 저장된 문자열(예: "admin/vote/VoteManage")로 실제 화면 컴포넌트를 찾아주는 레지스트리.
// 메뉴가 새로 등록되면 App.js를 손대지 않아도 이 파일이 자동으로 해당 컴포넌트를 찾아 렌더링할 수 있게 해준다
// (App.js에 라우트를 하드코딩하던 이전 방식과 다른 점 - DynamicMenuResolver.jsx가 이 함수를 사용).
//
// webpack의 require.context로 src/ 하위 모든 .jsx 파일을 미리 스캔해둔다. 세 번째 인자 'lazy' 덕분에
// 실제로 어떤 메뉴도 참조하지 않는 파일은 번들에 포함되지 않고, 라우트가 실제로 매칭될 때만
// 해당 파일이 별도 청크로 다운로드된다 (comp_path로 지목된 파일만 필요 시점에 로드됨).
const context = require.context('../', true, /\.jsx$/, 'lazy');

// require.context가 만들어주는 key는 './admin/vote/VoteManage.jsx' 형태라,
// DB에 저장된 "admin/vote/VoteManage" 형태와 비교할 수 있도록 접두 './'와 확장자를 떼어낸다.
const normalize = (key) => key.replace(/^\.\//, '').replace(/\.jsx$/, '');

// comp_path(정규화된 값) -> require.context의 원본 key 매핑. 앱 시작 시 한 번만 만든다.
const compPathToKey = new Map(context.keys().map((key) => [normalize(key), key]));

// comp_path -> 이미 만들어둔 React.lazy 컴포넌트 캐시. React.lazy는 반드시 매번 "같은 참조"를 반환해야
// Suspense가 정상 추적하는데, 이 캐시 없이 호출부(DynamicMenuResolver)의 렌더 도중 매번 새로 만들면
// 렌더될 때마다 새 lazy 컴포넌트로 취급되어 계속 재요청/재서스펜드되다가 화면이 영영 안정적으로
// 커밋되지 않는 경우가 생긴다 (초저지연 로컬 dev 서버에서는 경합 구간이 짧아 거의 안 드러나지만,
// 네트워크를 타는 배포 환경에서는 화면 전환이 멈춘 것처럼 보이는 형태로 나타남).
const lazyComponentCache = new Map();

/**
 * comp_path 문자열로 React.lazy 컴포넌트를 반환한다.
 * DB에 잘못된/오래된 comp_path가 들어있어도(예: 오타, 파일 이동 후 미갱신) 여기서 null을 반환하고
 * 예외를 던지지 않는다 - 호출부(DynamicMenuResolver)가 null을 받으면 "화면을 찾을 수 없습니다"로 안전하게 폴백한다.
 */
export function resolveDynamicComponent(compPath) {
    if (!compPath) return null;
    if (lazyComponentCache.has(compPath)) {
        return lazyComponentCache.get(compPath);
    }
    const key = compPathToKey.get(compPath);
    if (!key) return null;
    const LazyComponent = React.lazy(() => context(key));
    lazyComponentCache.set(compPath, LazyComponent);
    return LazyComponent;
}
