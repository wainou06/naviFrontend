import '../../styles/managerParts.css'

function ManagerParts({ user }) {
   return (
      <>
         <div className="manager">
            <img src="/images/로그아웃상태.png" alt={user?.nick} />
            <p>{user?.nick}</p>
            <p>{user?.email}</p>
         </div>
      </>
   )
}

export default ManagerParts
