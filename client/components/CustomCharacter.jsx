import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

// helper functions
const srcIsExternal = src => src.slice(0, 4) === 'http';
const srcIsMailto = src => src.slice(0, 6) === 'mailto';
const getImgSrc = src => (srcIsExternal(src) || srcIsMailto(src)
  ? src
  : require(`../assets/${src}`));

class CustomCharacter extends Component {
  constructor(props) {
    super(props);

    /**
     * NOTE: we can use state in this child component because
     *       it is state that is specific to only this component
     *       and does not need to be accessible to parent and / or
     *       sibling components.
     */
    this.state = {
      nickname: '',
    };

    this.saveNickname = this.saveNickname.bind(this);
    this.handleNicknameInput = this.handleNicknameInput.bind(this);
  }

  componentDidMount() {
    const charId = this.props.match.params.id;
    if (this.props.nicknames[charId]) {
      return this.setState({ nickname: this.props.nicknames[charId] });
    }
  }

  saveNickname() {
    /**
     * NOTE: Extension 1
     *  if you're working on Extension 1 and you want the frontend to fire off requests
     *  to your server to persist nicknames across browser refreshes, go ahead and comment
     *  out the section below labeled MAIN CHALLENGE CODE and uncomment the section below
     *  labeled EXTENSION 1 CODE
     */

    /** MAIN CHALLENGE CODE - comment out if working on Extension 1  */
    const charId = this.props.match.params.id;
    const nicknamesToUpdate = { ...this.props.nicknames };
    if (nicknamesToUpdate
      && nicknamesToUpdate[charId]
      && !this.state.nickname.length) {
      delete nicknamesToUpdate[charId];
    } else {
      nicknamesToUpdate[charId] = this.state.nickname;
    }
    this.props.updateNicknames(nicknamesToUpdate);

    /** EXTENSION 1 CODE - uncomment if working on extension 1
    let method = 'PUT';
    const charId = this.props.match.params.id;
    if (this.props.nicknames[charId]
      && !this.state.nickname.length) method = 'DELETE';
    fetch(`/api/nicknames/${charId}`, {
      method,
      body: JSON.stringify({ nickname: this.state.nickname }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(({ nicknames }) => this.props.updateNicknames(nicknames))
      .catch(err => console.log('favClicked: ERROR: ', err));
    */
  }

  handleNicknameInput(e) {
    const { value } = e.target;
    this.setState({ nickname: value });
  }

  render() {
    const charId = this.props.match.params.id;
    const character = this.props.characters[charId] || {};
    const currentNickname = this.props.nicknames[charId];

    if (!character.id) return (
      <div>Sorry, no character found</div>
    );

    return (
      <section className="mainSection customCharContainer">
        <Link to="/" className="backLink">
          <button type="button" className="btnSecondary">
            Back to all characters
          </button>
        </Link>
        <article className="card customizeChar">
          <h3>{character.name}</h3>
          {currentNickname
            && <p>Current Nickname: {currentNickname}</p>
          }
          {character.photo
            && <figure className="charPhoto">
              <img src={getImgSrc(character.photo)} alt={`Character ${character.name}`} />
            </figure>
          }
          <div className="nicknameFields">
            <label htmlFor="nickname">Give this character a nickname:</label>
            <input name="nickname" placeholder="Kewl Dood" value={this.state.nickname} onChange={this.handleNicknameInput} />
          </div>
          <button
            type="button"
            className="btnMain customCharNickname"
            onClick={this.saveNickname}
          >
            Save Nickname
          </button>
        </article>
      </section>
    );
  }
}

export default withRouter(CustomCharacter);
