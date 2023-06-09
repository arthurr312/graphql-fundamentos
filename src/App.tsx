import { gql, useQuery } from "@apollo/client";
import { NewUserForm } from "../components/newUserForm";
type User = {
  id: string;
  name: string;
};

export const GET_USERS = gql`
  query {
    users {
      id
      name
    }
  }
`;

function App() {
  const { data, loading } = useQuery(GET_USERS);
  if (loading) {
    return <p>carregando...</p>;
  }
  console.log(data);
  return (
    <div className="App">
      <ul>
        {data?.users.map((user: User) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <NewUserForm />
    </div>
  );
}

export default App;
