const Modal = ({ isOpen, onClose, children }) => {
   if (!isOpen) return null

   return (
      <>
         <div
            onClick={onClose}
            style={{
               position: 'fixed',
               inset: 0,
               backgroundColor: 'rgba(0, 0, 0, 0.5)',
               zIndex: 40,
            }}
         />
         <div
            style={{
               position: 'fixed',
               inset: 0,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               zIndex: 50,
               padding: 16,
            }}
         >
            <div
               onClick={(e) => e.stopPropagation()}
               style={{
                  backgroundColor: 'white',
                  borderRadius: 8,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                  maxWidth: '64rem', // 4xl ~ 1024px (tailwind), close enough
                  width: '100%',
                  maxHeight: '80vh',
                  overflow: 'auto',
                  position: 'relative',
               }}
            >
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

export default Modal
