import CloseIcon from '@mui/icons-material/Close'

function Modal({ isOpen, onClose, children }) {
   if (!isOpen) return null

   return (
      <div className="overlay" onClick={onClose}>
         <div className="popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={onClose}>
               <CloseIcon />
            </button>
            <div className="popup-content">{children}</div>
         </div>
      </div>
   )
}

export default Modal
