import ApolloClient from "apollo-boost";
// import { HttpLink } from "apollo-boost"

// const httpLink = new HttpLink({
//     uri: "http://localhost:8080/",
//     credentials: 'include',
// });

const client = new ApolloClient({
    uri: 'http://localhost:8080/graphql',
    request: (operation) => {
        // operation.setContext({
        //     'credentials': "include",
        // })
    //   const token = localStorage.getItem('token')
    //   const 
    //   operation.setContext({
    //     headers: {
    //       authorization: token ? `Bearer ${token}` : ''
    //     }
    //   })
    }
});

export default client