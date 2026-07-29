import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import DynamicMenuResolver from './admin/DynamicMenuResolver';
import Dashboard from './admin/dashboard/Dashboard';
import SurveyResultList from './admin/survey/SurveyResultList';
import SurveyResultDetail from './admin/survey/SurveyResultDetail';
import UserSurvey from './user/survey/UserSurvey';
import AdminDynamicBoardList from './admin/board/dynamic/AdminDynamicBoardList';
import AdminDynamicBoardDetail from './admin/board/dynamic/AdminDynamicBoardDetail';
import AdminDynamicBoardWrite from './admin/board/dynamic/AdminDynamicBoardWrite';

import UserLayout from './user/layout/UserLayout';
import UserDynamicBoardList from './user/board/dynamic/UserDynamicBoardList';
import UserDynamicBoardDetail from './user/board/dynamic/UserDynamicBoardDetail';

import UserDynamicBoardWrite from './user/board/dynamic/UserDynamicBoardWrite';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/admin/login" replace />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/survey/:survId" element={<UserSurvey />} />

                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} /> {/* element로 변경 필수! */}

                    {/* 목록 화면(comp_path)뿐 아니라 write/detail 화면(detail_comp_path)도 이제 여기 한 줄씩
                        등록하지 않는다 - TN_MNU_M001에 comp_path/detail_comp_path/detail_menu_url을 채워두면
                        맨 아래 path="*" 의 DynamicMenuResolver가 알아서 찾아 렌더링한다.
                        여기 남아있는 라우트는 "고정 문자열로 매칭할 수 없는" 진짜 예외뿐이다. */}

                    {/* 설문 결과 상세(survey/result/:survId)가 :survId 자리에 "list"까지 매칭해버려서
                        survey/result/list가 동적 catch-all에 닿기도 전에 상세 화면 라우트에 가로채인다
                        (React Router는 동적 세그먼트를 와일드카드보다 우선함) - 그래서 이 목록 화면만은
                        예외적으로 명시적 라우트를 유지한다. survey/result/:survId보다 반드시 먼저 와야 한다.
                        (survey/result/:survId 자체도 ID가 경로 파라미터라 DB 문자열 매칭이 불가능해 하드코딩 유지) */}
                    <Route path="survey/result/list" element={<SurveyResultList />} />
                    <Route path="survey/result/:survId" element={<SurveyResultDetail />} />

                    {/* 동적 게시판 관리자용 라우트 - 게시판마다 brdId가 달라 고정 문자열로 매칭 불가 */}
                    <Route path="board/view/:brdId" element={<AdminDynamicBoardList />} />
                    <Route path="board/view/:brdId/detail/:postId" element={<AdminDynamicBoardDetail />} />
                    <Route path="board/view/:brdId/write" element={<AdminDynamicBoardWrite />} />

                    {/* catch-all: 위에서 매칭 안 된 경로는 DB 메뉴(comp_path/detail_comp_path)를 찾아 동적으로
                        렌더링한다. 더 구체적인 라우트(바로 위 예외들)가 항상 이보다 먼저 매칭되므로
                        순서와 무관하게 안전하다 (React Router v6는 명시적 경로를 와일드카드보다 우선한다). */}
                    <Route path="*" element={<DynamicMenuResolver />} />
                </Route>

                {/* 유저 포털 라우트 */}
                <Route path="/user" element={<UserLayout />}>
                    <Route path="board/view/:brdId" element={<UserDynamicBoardList />} />
                    <Route path="board/view/:brdId/detail/:postId" element={<UserDynamicBoardDetail />} />
                    <Route path="board/view/:brdId/write" element={<UserDynamicBoardWrite />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
