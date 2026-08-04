import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const buildMenuTree = (flatList) => {
    const menuMap = {};
    const tree = [];

    flatList.forEach(menu => {
        menuMap[menu.menuId] = { ...menu, children: [] };
    });

    flatList.forEach(menu => {
        if (menu.uprMenuId === 'ROOT') {
            tree.push(menuMap[menu.menuId]);
        } else if (menuMap[menu.uprMenuId]) {
            menuMap[menu.uprMenuId].children.push(menuMap[menu.menuId]);
        }
    });

    return tree;
};

// 상단메뉴형(HEADER) - 가로 배치, hover 시 하위 뎁스는 드롭다운으로 펼침 (최대 3뎁스)
export const HeaderNav = ({ menuTree }) => {
    const [openId, setOpenId] = useState(null);

    return (
        <nav style={{ display: 'flex', gap: '4px' }}>
            {menuTree.map(top => (
                <div
                    key={top.menuId}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setOpenId(top.menuId)}
                    onMouseLeave={() => setOpenId(null)}
                >
                    {top.menuUrl ? (
                        <Link to={top.menuUrl} style={{ color: '#fff', textDecoration: 'none', padding: '8px 15px', display: 'inline-block', fontWeight: 'bold' }}>
                            {top.menuNm}
                        </Link>
                    ) : (
                        <span style={{ color: '#fff', padding: '8px 15px', display: 'inline-block', fontWeight: 'bold', cursor: 'default' }}>
                            {top.menuNm}
                        </span>
                    )}

                    {top.children.length > 0 && openId === top.menuId && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '4px', minWidth: '180px', zIndex: 100, padding: '6px 0' }}>
                            {top.children.map(mid => (
                                <div key={mid.menuId} style={{ position: 'relative' }} className="user-nav-mid-item">
                                    <MidRow item={mid} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
};

const MidRow = ({ item }) => {
    const [subOpen, setSubOpen] = useState(false);
    return (
        <div onMouseEnter={() => setSubOpen(true)} onMouseLeave={() => setSubOpen(false)} style={{ position: 'relative' }}>
            {item.menuUrl ? (
                <Link to={item.menuUrl} style={{ display: 'block', padding: '8px 16px', color: '#2c3e50', textDecoration: 'none', fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {item.menuNm}
                </Link>
            ) : (
                <span style={{ display: 'block', padding: '8px 16px', color: '#2c3e50', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {item.menuNm} {item.children.length > 0 && '▶'}
                </span>
            )}
            {item.children.length > 0 && subOpen && (
                <div style={{ position: 'absolute', top: 0, left: '100%', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '4px', minWidth: '160px', padding: '6px 0' }}>
                    {item.children.map(sub => (
                        <Link key={sub.menuId} to={sub.menuUrl || '#'} style={{ display: 'block', padding: '8px 16px', color: '#2c3e50', textDecoration: 'none', fontSize: '13px', whiteSpace: 'nowrap' }}>
                            {sub.menuNm}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

// 좌측메뉴형(SIDEBAR) - 세로 배치, 클릭 시 하위 뎁스가 아코디언으로 펼쳐짐 (최대 3뎁스)
export const SidebarNav = ({ menuTree }) => {
    const [expandedIds, setExpandedIds] = useState(new Set());

    const toggle = (menuId) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(menuId)) next.delete(menuId); else next.add(menuId);
            return next;
        });
    };

    const renderNode = (node, depth) => {
        const hasChildren = node.children.length > 0;
        const expanded = expandedIds.has(node.menuId);
        return (
            <div key={node.menuId}>
                {node.menuUrl && !hasChildren ? (
                    <Link to={node.menuUrl} style={{ display: 'block', padding: '10px 20px', paddingLeft: `${20 + depth * 15}px`, color: '#fff', textDecoration: 'none', fontWeight: depth === 0 ? 'bold' : 'normal', fontSize: depth === 0 ? '14px' : '13px' }}>
                        {node.menuNm}
                    </Link>
                ) : (
                    <div
                        onClick={() => hasChildren ? toggle(node.menuId) : null}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', paddingLeft: `${20 + depth * 15}px`, color: '#fff', cursor: hasChildren ? 'pointer' : 'default', fontWeight: depth === 0 ? 'bold' : 'normal', fontSize: depth === 0 ? '14px' : '13px' }}
                    >
                        {node.menuUrl ? <Link to={node.menuUrl} style={{ color: '#fff', textDecoration: 'none' }}>{node.menuNm}</Link> : <span>{node.menuNm}</span>}
                        {hasChildren && <span style={{ fontSize: '10px', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▶</span>}
                    </div>
                )}
                {hasChildren && expanded && node.children.map(child => renderNode(child, depth + 1))}
            </div>
        );
    };

    return (
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {menuTree.map(top => renderNode(top, 0))}
        </nav>
    );
};
