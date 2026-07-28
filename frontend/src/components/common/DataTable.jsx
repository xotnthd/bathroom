import React from 'react';

/**
 * Reusable DataTable component
 * @param {Array} columns - Array of column definitions: { key, label, width, render, align }
 * @param {Array} data - Array of data objects
 * @param {Function} onRowClick - Handler when a row is clicked
 * @param {String} emptyMessage - Message to display when there is no data
 * @param {String} selectedKey - The key value of the currently selected row
 * @param {String} rowKey - The unique key field name in the data (e.g. 'userId')
 */
const DataTable = ({ columns, data, onRowClick, emptyMessage = '데이터가 없습니다.', selectedKey, rowKey = 'id' }) => {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left', background: '#fff' }}>
            <thead>
                <tr style={{ background: '#f8f9fa' }}>
                    {columns.map((col, index) => (
                        <th key={index} style={{ padding: '8px', borderBottom: '2px solid #ddd', width: col.width || 'auto', textAlign: 'center' }}>
                            {col.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data && data.length > 0 ? (
                    data.map((row, rowIndex) => {
                        const isSelected = row[rowKey] === selectedKey;
                        return (
                            <tr
                                key={row[rowKey] || rowIndex}
                                onClick={() => onRowClick && onRowClick(row)}
                                style={{
                                    cursor: onRowClick ? 'pointer' : 'default',
                                    background: isSelected ? '#e3f2fd' : 'none',
                                    borderBottom: '1px solid #eee'
                                }}
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} style={{ padding: '8px', textAlign: col.align || 'left', fontWeight: col.isKey ? 'bold' : 'normal' }}>
                                        {col.render ? col.render(row, rowIndex) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan={columns.length} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                            {emptyMessage}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default DataTable;
