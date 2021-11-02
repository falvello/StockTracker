import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Characters from './components/Characters';
import CustomCharacter from './components/CustomCharacter';
import './stylesheets/styles.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      characterIds: [],
      fetchedChars: false,
      charactersById: {},
      favs: {},
      nicknames: {},
    };

    this.updateFavs = this.updateFavs.bind(this);
    this.addCharacters = this.addCharacters.bind(this);
    this.updateCharacter = this.updateCharacter.bind(this);
    this.updateNicknames = this.updateNicknames.bind(this);
    this.formatCharacters = this.formatCharacters.bind(this);
  }

  componentDidMount() {
    fetch('/api/')
      .then(res => res.json())
      .then(({ characters, favs = {}, nicknames = {} }) => {
        const { characterIds, charactersById } = this.formatCharacters(characters);
        return this.setState({
          fetchedChars: true,
          characterIds,
          charactersById,
          favs,
          nicknames,
        });
      })
      .catch(err => console.log('App.componentDidMount: get characters: ERROR: ', err));
  }

  formatCharacters(characters) {
    const charactersById = JSON.parse(JSON.stringify(this.state.charactersById));
    const characterIds = [...this.state.characterIds];
    characters.forEach((char) => {
      const splitURL = char.url.split('/').filter(el => el);
      const id = splitURL[splitURL.length - 1];
      char.id = id;
      if (!charactersById[id]) {
        characterIds.push(id);
        charactersById[id] = char;
      }
    });
    return { characterIds, charactersById };
  }

  addCharacters(characters) {
    const { characterIds, charactersById } = this.formatCharacters(characters);
    this.setState({ characterIds, charactersById, fetchedChars: true });
    return true;
  }

  updateCharacter(id, character) {
    const charactersById = JSON.parse(JSON.stringify(this.state.charactersById));
    charactersById[id] = character;
    this.setState({ charactersById });
    return true;
  }

  updateFavs(favs) {
    return this.setState({ favs });
  }

  updateNicknames(nicknames) {
    return this.setState({ nicknames });
  }

  render() {
    if (!this.state.fetchedChars) return (
      <div>
        <h1>Loading data, please wait...</h1>
      </div>
    );
    const sharedPageProps = {
      favs: this.state.favs,
      nicknames: this.state.nicknames,
      characters: this.state.charactersById,
      characterIds: this.state.characterIds,
    };
    return (
      <div className="router">
        <main>
          {/*
              NOTE: The syntax below is for React-Router
                - A helpful library for routing with a React app.
                You can learn more about this at:
                https://reacttraining.com/react-router/web/guides/quick-start
          */}
          <Switch>
            <Route
              exact
              path="/"
              component={
                () => <Characters
                  {...sharedPageProps}
                  updateFavs={this.updateFavs}
                  addCharacters={this.addCharacters}
                  updateCharacter={this.updateCharacter}
                />
              }
            />
            <Route
              exact
              path="/customize/:id"
              component={
                () => <CustomCharacter
                  {...sharedPageProps}
                  updateNicknames={this.updateNicknames}
                />
              }
            />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
