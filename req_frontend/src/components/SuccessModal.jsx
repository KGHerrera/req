import React from 'react';

const SuccessModal = ({ show, handleClose, message }) => {
    const modalStyle = {
        display: show ? 'block' : 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    };

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Éxito</h5>
                        <button type="button" className="btn-primary" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;

