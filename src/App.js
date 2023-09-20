// Repository:  medals-b-react
// Author:      Jeff Grissom
// Version:     4.xx
import React, { useState, useEffect, useRef } from 'react';
import Country from './components/Country';
//import NewCountry from './components/NewCountry';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';
import NewCountry from './components/NewCountry';
import axios from 'axios';

const App = () =>  {

  const [countries, setCountries] = useState([]);
  //const apiEndpoint = "https://olympicmedals-sfw.azurewebsites.net/swagger/index.html";
  const apiEndpoint = "https://olympicmedals-sfw.azurewebsites.net/api/country";
  const medals = useRef([
    {id: 1, name: 'gold'},
    {id: 2, name: 'silver'},
    {id: 3, name: 'bronze'},
  ]);
  
  useEffect(() => {
    // let fetchedCountries = [
    //       { id: 1, name: 'United States', gold: 2, silver: 2, bronze: 3 },
    //       { id: 2, name: 'China', gold: 3, silver: 1, bronze: 0 },
    //       { id: 3, name: 'Germany', gold: 0, silver: 2, bronze: 2 },
    //     ]
    // setCountries(fetchedCountries);
    async function fetchData() {
      const { data: fetchedCountries } = await axios.get(apiEndpoint);
      setCountries(fetchedCountries);
    }
    fetchData(); 
  }, []);
  
  // const handleChange = (e) => useState({ [e.target.name]: e.target.value});
  
  // const handleAdd = (newCountryName) => {
  //     const id = countries.length === 0 ? 1 : Math.max(...countries.map(country => country.id)) + 1;
  //     const mutableCountries = [...countries].concat({ id: id, name: newCountryName, gold: 0, silver: 0, bronze: 0 });
  //     setCountries( mutableCountries );
  // }

  const handleAdd = async (newCountryName) => {
    //const { data: post } = await axios.post(apiEndpoint, { name: newCountryName, gold: gold, silver: silver, bronze: bronze });
    newCountryName = newCountryName[0].toUpperCase() + newCountryName.substring(1);
    const { data: post } = await axios.post(apiEndpoint, { name: newCountryName });
    setCountries(countries.concat(post));
  }

  // const handleDelete = (countryId) => {
  //   const mutableCountries = [...countries].filter(c => c.id !== countryId);
  //   setCountries( mutableCountries );
  // }

  const handleDelete = async (countryId) => {
    const mutableCountries = countries;
    setCountries(countries.filter(c => c.id !== countryId));
    try {
      await axios.delete(`${apiEndpoint}/${countryId}`);
    } catch(ex) {
      if (ex.response && ex.response.status === 404) {
        console.log("The Country's record does not exist - it may have already been deleted");
      } else { 
        alert(`An error occurred while attempting to delete a country == ${countryId}`);
        setCountries(mutableCountries);
      }
    }
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
    medals.current.forEach(medal => { sum += countries.reduce((a, b) => a + b[medal.name], 0); });
    return sum;
  }
  
  return (
    <React.Fragment>
    
      <Navbar className="navbar-dark bg-dark">
        <Container fluid>
          <Navbar.Brand>
            Olympic Medals
            <Badge className="ml-2" bg="light" text="dark" pill>{ getAllMedalsTotal() }</Badge>
          </Navbar.Brand>
        <NewCountry onAdd={ handleAdd} />
        </Container>
    </Navbar>

    <Container fluid>
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
