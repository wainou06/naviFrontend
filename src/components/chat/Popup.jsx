const Popup = ({ isOpen, onClose, children }) => {
   if (!isOpen) return null

   return (
      <>
         <div onClick={onClose} className="chatbg" />
         <div className="chat">
            <div onClick={(e) => e.stopPropagation()} className="chatroom">
               <button
                  onClick={onClose}
                  aria-label="Close"
                  className="chatclose"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#000')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
               >
                  ✕
               </button>
               {children}
            </div>
         </div>
      </>
   )
}

export default Popup
