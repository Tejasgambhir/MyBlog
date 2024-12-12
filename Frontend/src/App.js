
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';  
// import { Button } from 'reactstrap';
import Base from './component/pages/base';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <BrowserRouter>
      <Base>
        <div>
          <ToastContainer position="top-center"/>
        </div>
      </Base>
    </BrowserRouter>
  
  );
}

export default App;
