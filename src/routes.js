import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App'; // Importe o componente App existente
import NovaPagina from './NovaPagina/NovaPagina'; // Importe o componente da nova página

function App() {
  return (
    <Router>
      <div>
        {/* Aqui você pode adicionar componentes compartilhados, como cabeçalho ou navegação */}
        
        <Switch>
          <Route exact path="/" component={NovaPagina} /> {/* Rota padrão */}
          <Route path="/admin" component={NovaPagina} /> {/* Rota para a nova página */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
