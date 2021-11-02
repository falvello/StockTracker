import React, { Component } from 'react';

import CharacterCard from './CharacterCard';

class Characters extends Component {
  constructor(props) {
    super(props);

    /**
     * NOTE: we can use state in this child component because
     *       it is state that is specific to only this component
     *       and does not need to be accessible to parent and / or
     *       sibling components.
     */
    this.state = {
      fetchingDetails: false,
    };

    this.getDetails = this.getDetails.bind(this);
    this.favClicked = this.favClicked.bind(this);
    this.getMoreCharacters = this.getMoreCharacters.bind(this);
  }

  getDetails(character) {
    this.setState({ fetchingDetails: character.id });
    fetch('/api/characters/details', {
      method: 'POST',
      body: JSON.stringify({ character }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then((data) => {
        const updatedCharacter = { ...character };
        updatedCharacter.moreInfo = {};
        updatedCharacter.moreInfo.homeworld = data.homeworld;
        updatedCharacter.moreInfo.films = data.films;
        this.setState(
          { fetchingDetails: false },
          () => this.props.updateCharacter(character.id, updatedCharacter),
        );
      })
      .catch(err => console.log('getDetails: ERROR: ', err));
  }

  getMoreCharacters() {
    fetch('/api/characters')
      .then(res => res.json())
      .then(res => this.props.addCharacters(res.newCharacters))
      .catch(err => console.log('Characters.getMoreCharacters: ERROR: ', err));
  }

  favClicked(charId) {
    let method = 'POST';
    if (this.props.favs
      && this.props.favs[charId]) method = 'DELETE';
    fetch(`/api/favs/${charId}`, {
      method,
      body: JSON.stringify({ id: charId }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(({ favs }) => this.props.updateFavs(favs))
      .catch(err => console.log('favClicked: ERROR: ', err));
  }

  render() {
    const {
      characterIds, characters, favs, nicknames,
    } = this.props;

    if (!characterIds) return null;

    if (!characterIds.length) return (
      <div>Sorry, no characters found</div>
    );

    const charElems = characterIds.map((id, i) => {
      const char = characters[id];
      return (
        <CharacterCard
          key={i}
          info={char}
          isFav={favs && favs[id] ? favs[id] : false}
          nickname={nicknames[id]}
          getDetails={this.getDetails}
          favClicked={this.favClicked}
          fetchingDetails={this.state.fetchingDetails}
        />
      );
    });

    return (
      <section className="mainSection">
        <header className="pageHeader">
          <h2>Characters</h2>
        </header>
        <div className="charContainer">
          {charElems}
        </div>
        {/* NOTE: Extension 2: if you are working on extension 2, remove this check where we're only rendering the Get More Characters button if we have less than 10 characters displayed. This will enable the frontend to fire off requets for more than 10 characters */}
        {Object.keys(characters).length === 10
          && <div className="charactersPageOptions">
            <button
              type="button"
              className="btnSecondary btnLg"
              onClick={this.getMoreCharacters}
            >
              Get More Characters
            </button>
          </div>
        }
      </section>
    );
  }
}

export default Characters;
