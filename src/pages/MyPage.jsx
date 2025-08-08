import UserParts from "../components/shared/UserParts";

function MyPage({ user }) {
    return ( <>
             <UserParts user={user} />
          </> );
}

export default MyPage;