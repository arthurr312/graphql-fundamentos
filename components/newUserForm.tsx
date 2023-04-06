import React, { FormEvent } from "react";
import { gql, useMutation } from "@apollo/client";
import { GET_USERS } from "../src/App";
import { client } from "../src/lib/apollo";
// exclamação no final = campo obrigatório
const CREATE_USER = gql`
  mutation ($name: String!) {
    createUser(name: $name) {
      id
      name
    }
  }
`;

export function NewUserForm() {
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
  const [name, setName] = React.useState<string>("");
  async function handleCreateUser(event: FormEvent) {
    event.preventDefault();
    if (!name) {
      return;
    }
    await createUser({
      variables: {
        name,
      },

      // refetch na requisição GET sempre que houver um novo cadastro
      // refetchQueries: [GET_USERS]

      //manipulação do cache para evitar requisições desnecessárias, clona os dados da requisição GET e adiciona o registro feito. assim, a req GET_USERS só será, de fato, refeita quando atualizar a página
      update: (cache, { data: { createUser } }) => {
        const { users } = client.readQuery({ query: GET_USERS });
        cache.writeQuery({
          query: GET_USERS,
          data: {
            users: [...users, createUser],
          },
        });
      },
    });
    setName("");
  }
  return (
    <form onSubmit={handleCreateUser}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
