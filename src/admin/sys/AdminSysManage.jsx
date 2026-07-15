import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';

const AdminSysManage = () => {
    const navigate = useNavigate();
    const [systemList, setSystemList] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        fetchSystemList();
    }, []);

    const fetchSystemList = async () => {
        const res = await apiClient('/admin/api/sys/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchKeyword })
        });
        if (res.ok) setSystemList(await res.json());
    };

    const handleCreateNew = () => {
        navigate('/admin/sys/write');
    };

    const handleSelectRow = (sysId) => {
        navigate(`/admin/sys/write?sysId=${sysId}`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>시스템 목록</h2>
                <button onClick={handleCreateNew} style={{ padding: '8px 15px', background: '#e67e22', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    + 신규 시스템
                </button>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input type="text" placeholder="시스템 명칭 검색" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                <button onClick={fetchSystemList} style={{ padding: '8px 15px', background: '#34495e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>검색</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>System ID</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>시스템 명칭</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>사용 여부</th>
                    </tr>
                </thead>
                <tbody>
                    {systemList.map(sys => (
                        <tr key={sys.sysId} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>{sys.sysId}</td>
                            <td style={{ padding: '12px' }}>
                                <span onClick={() => handleSelectRow(sys.sysId)} style={{ color: '#2980b9', cursor: 'pointer', textDecoration: 'underline' }}>
                                    {sys.sysNm}
                                </span>
                            </td>
                            <td style={{ padding: '12px', color: sys.useYn === 'Y' ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>{sys.useYn}</td>
                        </tr>
                    ))}
                    {systemList.length === 0 && (
                        <tr>
                            <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>조회된 시스템이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminSysManage;
