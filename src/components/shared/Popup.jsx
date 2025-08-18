export const PopupPrompt = (text, action) => {
   const { one, two } = text
   return (
      <div className="overlay">
         <div className="popup">
            <button className="close-btn" onClick={action}>
               <CloseIcon />
            </button>
            <div className="popup-content">
               <p className="popup-message">{one}</p>
               <p className="popup-message">{two}</p>
            </div>
         </div>
      </div>
   )
}
