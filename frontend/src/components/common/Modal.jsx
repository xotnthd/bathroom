import React from 'react';

/**
 * Reusable admin modal shell (overlay + content box + optional header/footer).
 * @param {Boolean} isOpen
 * @param {Function} onClose
 * @param {String} title - Header title text (ignored if `header` is provided)
 * @param {ReactNode} header - Full custom header override (replaces the default title + close button row)
 * @param {String} width - Content box width, e.g. '600px'
 * @param {Object} contentStyle - Extra style merged onto the content box
 * @param {Object} bodyStyle - Style for the body wrapper
 * @param {ReactNode} footer - Footer content, rendered in admin-modal-footer when provided
 * @param {String} closeLabel - Header close button label
 * @param {Object} closeButtonStyle - Header close button style override
 */
const Modal = ({
    isOpen,
    onClose,
    title,
    header,
    width = '450px',
    contentStyle,
    bodyStyle,
    footer,
    closeLabel = '닫기',
    closeButtonStyle,
    children
}) => {
    if (!isOpen) return null;

    const defaultCloseButtonStyle = { padding: '4px 12px', fontSize: '12px', background: '#ffe4e1', color: '#d63031', border: '1px solid #fab1a0' };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-content" style={{ width, ...contentStyle }}>
                {header !== undefined ? header : (
                    <div className="admin-modal-header">
                        <h3 style={{ margin: 0 }}>{title}</h3>
                        <button type="button" onClick={onClose} className="admin-btn" style={closeButtonStyle || defaultCloseButtonStyle}>{closeLabel}</button>
                    </div>
                )}

                <div className="admin-modal-body" style={bodyStyle}>
                    {children}
                </div>

                {footer && <div className="admin-modal-footer">{footer}</div>}
            </div>
        </div>
    );
};

export default Modal;
