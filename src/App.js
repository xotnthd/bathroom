import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import MenuManage from './admin/menu/MenuManage';
import CodeManage from './admin/code/CodeManage';
import AuthManage from './admin/auth/AuthManage';
import AdminAuthTemplateManage from './admin/authtpl/AdminAuthTemplateManage';
import AdminPayManage from './admin/pay/AdminPayManage';
import AdminPayDetail from './admin/pay/AdminPayDetail';
import AdminProdCategoryManage from './admin/prdcte/AdminProdCategoryManage';
import AdminProdOptionManage from './admin/prdopt/AdminProdOptionManage';
import AdminProdSupplierManage from './admin/prdsup/AdminProdSupplierManage';
import AdminProdSupplierDetail from './admin/prdsup/AdminProdSupplierDetail';
import AdminProdLocationManage from './admin/prdloc/AdminProdLocationManage';
import AdminProdLocationDetail from './admin/prdloc/AdminProdLocationDetail';
import AdminProductManage from './admin/product/AdminProductManage';
import AdminProductDetail from './admin/product/AdminProductDetail';
import AdminSysManage from './admin/sys/AdminSysManage';
import AdminSysForm from './admin/sys/AdminSysForm';
import UserManage from './admin/user/UserManage';
import UserDetail from './admin/user/UserDetail';
import BoardManage from './admin/board/BoardManage'; // 임포트 완료
import BoardDetail from './admin/board/BoardDetail';
import BoardPostManage from './admin/board/BoardPostManage'; // 임포트
import Dashboard from './admin/dashboard/Dashboard';
import PopupManage from './admin/popup/PopupManage';
import PopupDetail from './admin/popup/PopupDetail';
import SurveyTemplateManage from './admin/survey/SurveyTemplateManage';
import SurveyTemplateForm from './admin/survey/SurveyTemplateForm';
import SurveyDeployManage from './admin/survey/SurveyDeployManage';
import SurveyDeployForm from './admin/survey/SurveyDeployForm';
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
                    <Route path="menu" element={<MenuManage />} />
                    <Route path="code" element={<CodeManage />} />
                    <Route path="auth" element={<AuthManage />} />
                    <Route path="auth-template" element={<AdminAuthTemplateManage />} />
                    <Route path="pay" element={<AdminPayManage />} />
                    <Route path="pay/write" element={<AdminPayDetail />} />
                    <Route path="prd/category" element={<AdminProdCategoryManage />} />
                    <Route path="prd/option" element={<AdminProdOptionManage />} />
                    <Route path="prd/supplier" element={<AdminProdSupplierManage />} />
                    <Route path="prd/supplier/write" element={<AdminProdSupplierDetail />} />
                    <Route path="prd/location" element={<AdminProdLocationManage />} />
                    <Route path="prd/location/write" element={<AdminProdLocationDetail />} />
                    <Route path="prd/product" element={<AdminProductManage />} />
                    <Route path="prd/product/write" element={<AdminProductDetail />} />
                    <Route path="sys" element={<AdminSysManage />} />
                    <Route path="sys/write" element={<AdminSysForm />} />
                    <Route path="user" element={<UserManage />} />
                    <Route path="user/write" element={<UserDetail />} />
                    <Route path="board" element={<BoardManage />} />
                    <Route path="board/write" element={<BoardDetail />} />
                    <Route path="boardPost" element={<BoardPostManage />} />
                    <Route path="popup" element={<PopupManage />} />
                    <Route path="popup/write" element={<PopupDetail />} />
                    <Route path="survey/template" element={<SurveyTemplateManage />} />
                    <Route path="survey/template/write" element={<SurveyTemplateForm />} />
                    <Route path="survey/deploy" element={<SurveyDeployManage />} />
                    <Route path="survey/deploy/write" element={<SurveyDeployForm />} />
                    <Route path="survey/result/list" element={<SurveyResultList />} />
                    <Route path="survey/result/:survId" element={<SurveyResultDetail />} />
                    {/* 동적 게시판 관리자용 라우트 */}
                    <Route path="board/view/:brdId" element={<AdminDynamicBoardList />} />
                    <Route path="board/view/:brdId/detail/:postId" element={<AdminDynamicBoardDetail />} />
                    <Route path="board/view/:brdId/write" element={<AdminDynamicBoardWrite />} />
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