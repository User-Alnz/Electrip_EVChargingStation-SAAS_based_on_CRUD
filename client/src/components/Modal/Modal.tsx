import "./Modal.css";

interface ModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  show: null | "locationDenied" | "noStations";
}

function Modal ({title, message, onConfirm, onCancel, confirmText = "Confirmer", cancelText = "Annuler", show,} : ModalProps) 
{
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          {onCancel && <button onClick={onCancel}>{cancelText}</button>}
          <button onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;