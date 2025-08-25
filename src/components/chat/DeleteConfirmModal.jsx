import Modal from '../shared/Modal'

const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
   return (
      <Modal isOpen={isOpen} onClose={onCancel}>
         <div className='popup-section'>{message}</div>
         <div className='popup-section'>
            <button
               onClick={onConfirm}
              className='deletechat'
            >
               삭제
            </button>
            <button
               onClick={onCancel}
               className='nodeletechat'
            >
               취소
            </button>
         </div>
      </Modal>
   )
}

export default DeleteConfirmModal
