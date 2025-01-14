import React from 'react';
import Categories from './Categories';
import GroupLists from './GroupLists';
import './Home.css';

function Home({ setSelectedMovie }) {
  return (
    <div className="home">
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div> 
      </div>
      <div className="categories">
        <Categories setSelectedMovie={setSelectedMovie} />
      </div>
      <div className="group-lists">
        <GroupLists />
      </div>
    </div>
  );
}

export default Home;
