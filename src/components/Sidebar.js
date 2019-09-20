import React from 'react';
import ProfileSelector from './ProfileSelector';
import LngLat from '../services/LngLat';
import BehaviorStats from './BehaviorStats';

function parseLatLngString(str) {
  const split = str.split(',');
  const lng = Number(split[1]);
  const lat = Number(split[0]);
  if(!isNaN(lat) && !isNaN(lng)) {
    return {lng, lat};
  }
  return null;
}

function roundToPrecision(value, precision = 0) {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

function coordinatesToString(coords) {
  coords = new LngLat(coords).toJSON();
  return `${roundToPrecision(coords.lat, 6)}, ${roundToPrecision(coords.lng, 6)}`;
}

export default class Sidebar extends React.Component {
  constructor() {
    super();
    this.state = {
      ippInput: '',
      ippInputIsDirty: false
    }
  }
  componentDidMount() {
    this.setState({
      ippInput: coordinatesToString(this.props.ippCoordinates)
    })
  }
  componentDidUpdate(prevProps) {
    if(prevProps.ippCoordinates !== this.props.ippCoordinates && this.props.ippCoordinates) {
      this.setState({
        ippInput: coordinatesToString(this.props.ippCoordinates),
        ippInputIsDirty: false
      })
    }
  }
  setDirtyIPPCoordinateString(str) {
    this.setState({
      ippInput: str,
      ippInputIsDirty: true
    })
  }
  setIPP = () => {
    const latLng = parseLatLngString(this.state.ippInput);
    if(latLng) {
      this.props.setIPP(latLng, true);
    } else {
      this.setState({
        ippInput: coordinatesToString(this.props.ippCoordinates),
        ippInputIsDirty: false
      })
    }
  }
  render() {
    const {
      profiles,
      setIPP,
      clearIPP,
      onBehaviorChange,
      downloadGPX,
      ippCoordinates,
      centerOnIPP
    } = this.props;
      const clearIPPButton = ippCoordinates
        ?
          <button onClick={() => clearIPP()}>Clear</button>
        : null;
      const ippCoordinateInput = ippCoordinates
        ? <input value={this.state.ippInput} onChange={evt => this.setDirtyIPPCoordinateString(evt.target.value)}/>
        : null;
      const setNewIPPButton = this.state.ippInputIsDirty
        ? <button onClick={this.setIPP}>Update</button>
        : null;
      const centerIPPButton = !ippCoordinates
        ? <button onClick={() => setIPP()}>Add</button>
        : <button onClick={() => setIPP()}>Reset</button>;
      const goToButton = ippCoordinates
        ? <button onClick={() => centerOnIPP()}>Go To IPP</button>
        : null;
      return (
        <div className="sidebar__wrapper">
          <div className="sidebar__content">
            <h1 className="title">Missing Person Behavior Mapper</h1>
            <div>
              <h2>Initial Planning Point</h2>
              {ippCoordinateInput} {setNewIPPButton}
              <br />
              {centerIPPButton}
              {goToButton}
              {clearIPPButton}
            </div>
            <br />
            <br />
            <div>
            <h2>Behavior Range Rings</h2>
              <ProfileSelector
                profiles={profiles}
                behavior={this.props.behavior}
                onBehaviorChange={onBehaviorChange}
               />
               <br />
               <BehaviorStats behavior={this.props.behavior}/>
               <button onClick={downloadGPX}>Download GPX</button>
            </div>
          </div>
        </div>
      );
  }
}
