// Repository:  medals-b-react
// Author:      Jeff Grissom
// Version:     4.xx
import React, { useState, useEffect } from 'react';
import Country from './components/Country';
//import NewCountry from './components/NewCountry';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { PlusCircleFill } from 'react-bootstrap-icons';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import { TrashFill } from 'react-bootstrap-icons';

import './App.css';
import './App.css';
import { ToastContainer } from 'react-bootstrap';

const App = () =>  {

  const [countries, setCountries] = useState([]);
  const [medals, setMedals] = useState([]);
  const [show, setShow] = useState(false);
  const [newCountryName, setNewCountryName] = useState("");
  const [toast, setToast] = useState(false);
  
  // const handleChange = (e) => useState({ [e.target.name]: e.target.value});
  
  const handleAdd = () => {
    if (newCountryName.length > 0) {
      const id = countries.length === 0 ? 1 : Math.max(...countries.map(country => country.id)) + 1;
      const mutableCountries = [...countries].concat({ id: id, name: newCountryName, gold: 0, silver: 0, bronze: 0 });
      setCountries( mutableCountries );
    }
    else {
      showToast();
    }
    handleClose();
  }
  const handleDelete = (countryId) => {
    const mutableCountries = [...countries].filter(c => c.id !== countryId);
    setCountries( mutableCountries );
  }
  const handleIncrement = (countryId, medalName) => {
    const mutCountries = [ ...countries ];
    const idx = mutCountries.findIndex(c => c.id === countryId);
    mutCountries[idx][medalName] += 1;
    setCountries( mutCountries );
  }
  const handleDecrement = (countryId, medalName) => {
    const mutCountries = [ ...countries ];
    const idx = mutCountries.findIndex(c => c.id === countryId);
    mutCountries[idx][medalName] -= 1;
    setCountries( mutCountries );
  }
  const getAllMedalsTotal =() => {
    let sum = 0;
    medals.forEach(medal => { sum += countries.reduce((a, b) => a + b[medal.name], 0); });
    return sum;
  }

  const handleClose = () =>  {
    setShow( false );
  }
  const handleShow = () => {
    // newCountryName = "";
    setShow( true );
  }
  const keyPress = (e) => {
    (e.keyCode ? e.keyCode : e.which) == '13' && handleAdd();
  }

  const hideToast = () =>{
    setToast( false );
  }

  const showToast = () =>{
    setToast( true );
  }

  useEffect(() => {
    let mutCountries = [
          { id: 1, name: 'United States', gold: 2, silver: 2, bronze: 3 },
          { id: 2, name: 'China', gold: 3, silver: 1, bronze: 0 },
          { id: 3, name: 'Germany', gold: 0, silver: 2, bronze: 2 },
        ]
    setCountries(mutCountries);
    
    let mutMedals = [
      { id: 1, name: 'gold' },
      { id: 2, name: 'silver' },
      { id: 3, name: 'bronze' },
    ]
    
    setMedals(mutMedals);
        
  }, []);
  
  return (
    <React.Fragment>
      {/* <Button variant="outline-success" onClick={this.showToast}>Show Toast</Button> */}
      <Modal onKeyPress={ keyPress } show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Country</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Country Name</Form.Label>
          <Form.Control
            type="text"
            name="newCountryName"
            onChange={ (e) => setNewCountryName(e.target.value) }
            value={ newCountryName }
            autoComplete='off'
            placeholder="enter name"
            autoFocus
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={ handleClose }>
          Close
        </Button>
        <Button variant="primary" onClick={handleAdd}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>

      <Navbar className="navbar-dark bg-dark">
        <Container fluid>
          <Navbar.Brand>
            Olympic Medals
            <Badge className="ml-2" bg="light" text="dark" pill>{ getAllMedalsTotal() }</Badge>
          </Navbar.Brand>
          <Button variant="outline-success" onClick={ handleShow }><PlusCircleFill /></Button>{' '}
        </Container>
    </Navbar>

    <Container fluid>
    <ToastContainer position='top-end'>
        <Toast show={toast} onClose={hideToast} position="top-end" delay={3000}>
          {/* <Toast.Header closeButton="false">
            <p>Error with Country Addtion</p>
            <button type='button' className='btn-close' data-bs-dismiss="toast" aria-label="close"></button>
          </Toast.Header> */}
          <Toast.Body>You cannot enter a country with a blank name.</Toast.Body>
          <button variant="outline-success" position="middle-end" onClick={hideToast}><TrashFill /></button>
        </Toast>
      </ToastContainer>
      <Row>
      { countries.map(country => 
        <Col className="mt-3" key={ country.id }>
        <Country 
            country={ country } 
            medals={ medals }
            onDelete={ handleDelete }
            onIncrement={handleIncrement } 
            onDecrement={handleDecrement } />
        </Col>
      )}
      </Row>
    </Container>
    </React.Fragment>
  );
  
}
 
export default App;
