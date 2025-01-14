import React, { useEffect, useState } from 'react';
import './Showtimes.css';

function Showtimes() {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [shows, setShows] = useState([]);

  // Parse XML to get theater areas
  const getFinnkinoTheatres = (xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'application/xml');
    const theatres = xmlDoc.getElementsByTagName('TheatreArea');
    const tempAreas = [];

    for (let i = 0; i < theatres.length; i++) {
      tempAreas.push({
        id: theatres[i].getElementsByTagName('ID')[0].textContent,
        name: theatres[i].getElementsByTagName('Name')[0].textContent,
      });
    }
    setAreas(tempAreas);
  };

  // Fetch theater areas
  useEffect(() => {
    fetch('https://www.finnkino.fi/xml/TheatreAreas/')
      .then((response) => response.text())
      .then((xml) => getFinnkinoTheatres(xml))
      .catch((error) => console.log(error));
  }, []);

  // Parse XML to get shows for a specific theater
  const getFinnkinoShows = (xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'application/xml');
    const shows = xmlDoc.getElementsByTagName('Show');
    const tempShows = [];

    for (let i = 0; i < shows.length; i++) {
      tempShows.push({
        id: shows[i].getElementsByTagName('ID')[0].textContent,
        title: shows[i].getElementsByTagName('Title')[0].textContent,
        startTime: shows[i].getElementsByTagName('dttmShowStart')[0].textContent,
        theater: shows[i].getElementsByTagName('Theatre')[0].textContent,
        auditorium: shows[i].getElementsByTagName('TheatreAuditorium')[0].textContent,
        imageUrl: shows[i].getElementsByTagName('EventSmallImagePortrait')[0].textContent,
      });
    }
    setShows(tempShows);
  };

  // Fetch shows for the selected theater
  const fetchShows = (areaId) => {
    fetch(`https://www.finnkino.fi/xml/Schedule/?area=${areaId}`)
      .then((response) => response.text())
      .then((xml) => getFinnkinoShows(xml))
      .catch((error) => console.log(error));
  };

  // Handle theater selection change
  const handleAreaChange = (e) => {
    const areaId = e.target.value;
    setSelectedArea(areaId);
    fetchShows(areaId);
  };

  return (
    <div className='showtimes-con'>
      <h1>Showtimes</h1>
      <label htmlFor="theater-select">Select Theater:</label>
      <select id="theater-select" onChange={handleAreaChange}>
        <option value="">--Choose a Theater--</option>
        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}
          </option>
        ))}
      </select>

      <div className="showtimes-list">
        {shows.length > 0 ? (
          shows.map((show) => (
            <div key={show.id} className="show-item">
              <img src={show.imageUrl} alt={show.title} />
              <div className='show-details'>
                <h3>{show.title}</h3>
                <p>Theater: {show.theater}</p>
                <p>Auditorium: {show.auditorium}</p>
                <p>Start Time: {new Date(show.startTime).toLocaleString()}</p>
                <a href="https://www.finnkino.fi/" target="_blank" rel="noopener noreferrer">
                <button>Tickets</button>
              </a>
              </div>
              
            </div>
          ))
        ) : (
          <p>Please select a theater to view showtimes.</p>
        )}
      </div>
    </div>
  );
}

export default Showtimes;