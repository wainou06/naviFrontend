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
                  style={{
                     position: 'absolute',
                     top: 8,
                     right: 8,
                     color: '#4B5563', // gray-600
                     background: 'none',
                     border: 'none',
                     cursor: 'pointer',
                     fontSize: 18,
                     fontWeight: 'bold',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#111827')} // gray-900
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#4B5563')}
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
