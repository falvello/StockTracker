import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regStar } from '@fortawesome/free-regular-svg-icons';

// helper functions
const srcIsExternal = src => src.slice(0, 4) === 'http';
const srcIsMailto = src => src.slice(0, 6) === 'mailto';
// if img is src locally (not hosted online),
// src will be the required in image file
// otherwise, just src will be the url
const getImgSrc = src => (srcIsExternal(src) || srcIsMailto(src)
  ? src
  : require(`../assets/${src}`));

const CharacterCard = ({
  info, isFav, nickname, favClicked, getDetails, fetchingDetails,
}) => {
  const {
    name, gender, birth_year, eye_color,
    hair_color, films, moreInfo, id, photo,
  } = info;

  let filmData;

  if (moreInfo) filmData = moreInfo.films.map((film, i) => (
    <li key={i} className="charFilm">
      - {film.title}
    </li>
  ));

  let FavIcon;
  if (isFav) FavIcon = (<span className="favIcon"><FAIcon onClick={() => favClicked(id)} icon={solidStar} style={{ color: 'steelblue' }} /></span>);
  else FavIcon = (<span className="favIcon"><FAIcon onClick={() => favClicked(id)} icon={regStar} /></span>);

  return (
    <article className="card charCard">
      <div className="charHeadContainer">
        <div>
          <h3 className="charName">{nickname || name}</h3>
          {nickname && <small><em>Original Name: {name}</em></small>}
        </div>
        {FavIcon}
      </div>
      {photo
        && <figure className="charPhoto">
          <img src={getImgSrc(photo)} alt={`Character ${nickname || name}`} />
        </figure>
      }
      <ul className="charDetailsList">
        <li className="charDetail">Gender: {gender}</li>
        <li className="charDetail">Birth Year: {birth_year}</li>
        <li className="charDetail">Eye Color: {eye_color}</li>
        <li className="charDetail">Hair Color: {hair_color}</li>
        <li className="charDetail">Number of Films: {films.length}</li>
      </ul>
      {moreInfo
        && <div className="charAddlDetailsContainer">
          <p className="charAddlDetail"><strong>Additional Info</strong></p>
          <p className="charAddlDetail">Homeworld: {moreInfo.homeworld.name}</p>
          <p className="charAddlDetail">Films:</p>
          <ul className="charFilmsList">{filmData}</ul>
        </div>
      }
      <div className="charBtnOptions">
        {!moreInfo
          && fetchingDetails !== id
          && <button
            type="button"
            className="space btnMain charAddlDetailsButton"
            onClick={() => getDetails(info)}
          >
            Get More Info
          </button>
        }
        {fetchingDetails
          && fetchingDetails === id
          && <p>Fetching data, please wait...</p>
        }
        <Link to={`/customize/${id}`}>
          <button
            type="button"
            className="btnSecondary charCustomizeButton"
          >
            Customize Character
          </button>
        </Link>
      </div>
    </article>
  );
};

export default CharacterCard;
