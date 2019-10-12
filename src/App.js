import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import 'mapbox-gl/dist/mapbox-gl.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setBehavior} from './actions/behaviorActions';
import {downloadGPX} from './actions/downloadActions';
import {updateMapCenter} from './actions/mapActions';
import searchMap from './store/searchMap';
import BehaviorProfiles from './services/statistics/StatisticalBehaviorProfiles';

class App extends React.Component {
  constructor() {
    super();
    this.profiles = new BehaviorProfiles();
    this.state = {
      sidebarIsOpen: window.innerWidth < 600 ? false : true
    }
  }
  componentDidMount() {
    const behavior = this.profiles.getClosestBehaviorByHierarchy(['hiker', 'temperate', 'mtn']);
    const startPoint = {lat:  37.775754, lng: -119.348739};
    this.props.updateMapCenter(startPoint);
    searchMap.setBehavior(behavior);
    searchMap.on('load', () => searchMap.setIPPMarker(startPoint));
    searchMap.on('move', () => this.props.updateMapCenter(searchMap.getLngLat()));
    searchMap.load('map', startPoint);
  }
  toggleSidebarOpen = () => {
    this.setState({
      sidebarIsOpen: !this.state.sidebarIsOpen
    }, () => searchMap.resize());
  }
  downloadGPX = () => {
    this.props.downloadGPX();
  }
  setBehaviorByKeys = (keys) => {
    const behavior = this.profiles.getClosestBehaviorByHierarchy(keys);
    searchMap.setBehavior(behavior);
  }
  render() {
    return (
      <div className="app">
        <Navbar toggleDrawer={this.toggleSidebarOpen}/>
        <div className="app-content">
          <Sidebar
            setBehaviorByKeys={this.setBehaviorByKeys}
            isOpen={this.state.sidebarIsOpen}
          />
          <div className="map-container">
            <div id="map" />;
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateMapCenter: bindActionCreators(updateMapCenter, dispatch),
    setBehavior: bindActionCreators(setBehavior, dispatch),
    downloadGPX: bindActionCreators(downloadGPX, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
