import React from 'react';

/**
 * Reusable SearchForm component
 * @param {Object} searchData - Current search state object
 * @param {Function} onChange - Handler for input changes (receives name, value)
 * @param {Function} onSubmit - Handler for form submission
 * @param {Function} onReset - Handler for reset button
 * @param {Array} children - Additional filter elements (e.g. selects)
 */
const SearchForm = ({ title, topContent, searchData, onChange, onSubmit, onReset, children }) => {
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    return (
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {title && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <h2 style={{ margin: 0 }}>{title}</h2>
                </div>
            )}
            
            {topContent && (
                <>
                    {topContent}
                    <div style={{ height: '1px', background: '#eee', margin: '5px 0' }}></div>
                </>
            )}

            <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Additional custom filters */}
                {children}

                <button type="submit" style={{ padding: '6px 14px', background: '#2c3e50', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>검색</button>
                <button type="button" onClick={onReset} style={{ padding: '6px 14px', background: '#eee', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px' }}>초기화</button>
            </form>
        </div>
    );
};

export default SearchForm;
