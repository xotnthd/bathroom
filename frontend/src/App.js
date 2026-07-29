import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import DynamicMenuResolver from './admin/DynamicMenuResolver';
import AdminPayDetail from './admin/pay/AdminPayDetail';
import AdminProdSupplierDetail from './admin/prdsup/AdminProdSupplierDetail';
import AdminProdLocationDetail from './admin/prdloc/AdminProdLocationDetail';
import AdminProductDetail from './admin/product/AdminProductDetail';
import AdminSysForm from './admin/sys/AdminSysForm';
import UserDetail from './admin/user/UserDetail';
import BoardDetail from './admin/board/BoardDetail';
import Dashboard from './admin/dashboard/Dashboard';
import PopupDetail from './admin/popup/PopupDetail';
import SurveyTemplateForm from './admin/survey/SurveyTemplateForm';
import SurveyDeployForm from './admin/survey/SurveyDeployForm';
import SurveyResultList from './admin/survey/SurveyResultList';
import SurveyResultDetail from './admin/survey/SurveyResultDetail';
import VoteDetail from './admin/vote/VoteDetail';
import VoteResultDetail from './admin/vote/VoteResultDetail';
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

                    {/* 목록/관리 화면(위 아래로 "메뉴 관리"에서 관리하는 화면들, 즉 comp_path가 채워진 메뉴)은
                        더 이상 여기 한 줄씩 등록하지 않는다 - DB 메뉴 등록만으로 자동 노출되도록
                        맨 아래 path="*" 의 DynamicMenuResolver가 처리한다.
                        write/detail처럼 메뉴로 직접 등록되지 않는 화면만 아래에 그대로 남긴다. */}
                    <Route path="pay/write" element={<AdminPayDetail />} />
                    <Route path="prd/supplier/write" element={<AdminProdSupplierDetail />} />
                    <Route path="prd/location/write" element={<AdminProdLocationDetail />} />
                    <Route path="prd/product/write" element={<AdminProductDetail />} />
                    <Route path="sys/write" element={<AdminSysForm />} />
                    <Route path="user/write" element={<UserDetail />} />
                    <Route path="board/write" element={<BoardDetail />} />
                    <Route path="popup/write" element={<PopupDetail />} />
                    <Route path="survey/template/write" element={<SurveyTemplateForm />} />
                    <Route path="survey/deploy/write" element={<SurveyDeployForm />} />
                    {/* 설문 결과 상세(survey/result/:survId)가 :survId 자리에 "list"까지 매칭해버려서
                        survey/result/list가 동적 catch-all에 닿기도 전에 상세 화면 라우트에 가로채인다
                        (React Router는 동적 세그먼트를 와일드카드보다 우선함) - 그래서 이 목록 화면만은
                        예외적으로 명시적 라우트를 유지한다. survey/result/:survId보다 반드시 먼저 와야 한다. */}
                    <Route path="survey/result/list" element={<SurveyResultList />} />
                    <Route path="survey/result/:survId" element={<SurveyResultDetail />} />
                    <Route path="vote/write" element={<VoteDetail />} />
                    <Route path="vote/result" element={<VoteResultDetail />} />
                    {/* 동적 게시판 관리자용 라우트 */}
                    <Route path="board/view/:brdId" element={<AdminDynamicBoardList />} />
                    <Route path="board/view/:brdId/detail/:postId" element={<AdminDynamicBoardDetail />} />
                    <Route path="board/view/:brdId/write" element={<AdminDynamicBoardWrite />} />

                    {/* catch-all: 위에서 매칭 안 된 경로는 DB 메뉴(comp_path)를 찾아 동적으로 렌더링한다.
                        더 구체적인 라우트(바로 위의 write/detail, 동적 게시판)가 항상 이보다 먼저 매칭되므로
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
