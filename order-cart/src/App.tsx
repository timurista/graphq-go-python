import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ApolloProvider } from "react-apollo";
import client from './apollo/client'
import HelloWorld from './components/HelloWorld'

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ApolloProvider client={client}>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <HelloWorld />
        </ApolloProvider>
      </header>
    </div>
  );
}

export default App;
