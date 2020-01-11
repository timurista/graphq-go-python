import * as React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

const GET_GREETING = gql`
  query {
    people {
      firstName
    }
  }
`;

export interface IPureProps {
  people: Array<{
    firstName: String;
  }>;
}

function People({ people = [] }: IPureProps) {
  return (
    <div>
      {people.map((p, i) => {
        return <div key={i}>{p.firstName}</div>;
      })}
    </div>
  );
}

export default function Hello() {
  const { loading, error, data } = useQuery(GET_GREETING, {
    variables: { language: "english" }
  });
  if (error) {
      console.error(error)
  }
  if (loading) return <p>Loading ...</p>;
  return (
    <>
      <h1>Hello</h1>
      <People people={data.people}></People>
    </>
  );
}

// export default class Pure extends React.PureComponent<IPureProps> {
//   public render() {
//     return (
//       <div>
//         A pure component WIth React
//       </div>
//     );
//   }
// }
