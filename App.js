import React from 'react';
import { StyleSheet, Text, View, FlatList, SectionList, ScrollView } from 'react-native';
import schedule from './schedule.json';
import * as moment from 'moment';
import {omit, groupBy} from 'lodash';
import {
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// Panels: #E91E63 pink, Fan Events #9C27B0 purple ,Social: #03A9F4 blue, Ops #fff white, Dealers #FF9800 orange, Gaming #8BC34A green, Screenings #FFEB3B yellow, Music #CDDC39 lime
const trackMap = {
  '10050': {name: 'Panels 1', group: 'Panels'},
  '10060': {name: 'Panels 2', group: 'Panels'},
  '10070': {name: 'Panels 3', group: 'Panels'},
  '10080': {name: 'Panels 4', group: 'Panels'},
  '10090': {name: 'Fan Events 1', group: 'Fan Events'},
  '10091': {name: 'Fan Events 2', group: 'Fan Events'},
  '10100': {name: 'Maid Cafe', group: 'Social'},
  '20010': {name: 'Dojo', group: 'Social'},
  '20090': {name: 'New Mothers Room', group: 'Ops'},
  '20110': {name: 'Lost and Found', group: 'Ops'},
  '30010': {name: 'Volunteers', group: 'Ops'},
  '30030': {name: 'Fan Storage', group: 'Ops'},
  '30060': {name: 'Idris\' Closet', group: 'Dealers'},
  '40010': {name: 'Dealers Room', group: 'Dealers'},
  '40060': {name: 'Console Gaming', group: 'Gaming'},
  '40070': {name: 'Tabletop Gaming', group: 'Gaming'},
  '40080': {name: 'Gaming Tournaments', group: 'Gaming'},
  '40090': {name: 'Arcade', group: 'Gaming'},
  '40100': {name: 'PC Gaming', group: 'Gaming'},
  '40110': {name: 'Artist Alley', group: 'Dealers'},
  '40120': {name: 'Registration', group: 'Ops'},
  '40130': {name: 'Dance - Main Floor', group: 'Dance'},
  '40140': {name: 'Dance - Water Center', group: 'Dance'},
  '40170': {name: 'Nostalgia Room', group: 'Screenings'},
  '40180': {name: 'Cutting Edge Room', group: 'Screenings'},
  '40190': {name: 'Film Room', group: 'Screenings'},
  '40200': {name: 'Industry Room', group: 'Screenings'},
  '40210': {name: 'Marathon Room', group: 'Screenings'},
  '40220': {name: 'Asian Film Room', group: 'Screenings'},
  '40230': {name: 'Video Main', group: 'Screenings'},
  '40240': {name: 'Karaoke', group: 'Music'},
  '40250': {name: 'Professional Registration', group: 'Ops'},
  '40300': {name: 'Info Desk 1', group: 'Ops'},
  '40310': {name: 'Info Desk 3', group: 'Ops'},
  '40320': {name: 'Info Desk 2', group: 'Ops'},
  '40321': {name: 'Info Desk 4', group: 'Ops'},
  '40322': {name: 'Info Desk 5', group: 'Ops'},
  '40330': {name: 'Stage Zero', group: 'Panels'},
  '40350': {name: 'Swap Meet', group: 'Dealers'},
  '40360': {name: 'MusicFest', group: 'Music'},
  '40370': {name: 'Cosplay', group: 'Social'},
  '40380': {name: 'Black and White Ball Events', group: 'Social'},
  '61139': {name: 'Parents Lounge', group: 'Ops'},
  '61145': {name: 'Speed Dating', group: 'Social'},
  '61241': {name: 'Tabletop Gaming Events', group: 'Gaming'},
  '61242': {name: 'Charity Events', group: 'Social'},
  '62702': {name: 'Gatherings Table', group: 'Social'},
  '62703': {name: 'Entry wood stairs', group: 'Social'},
  '62704': {name: 'Video wood stairs', group: 'Social'},
  '62706': {name: 'Marriott side', group: 'Social'},
  '62707': {name: 'Art Tree', group: 'Social'},
  '62708': {name: 'Fallout Zone', group: 'Social'},
  '62709': {name: 'The Slab', group: 'Social'},
  '62710': {name: 'Hilton Tree walkway', group: 'Social'},
  '62711': {name: 'Off-site/Snake Statue', group: 'Social'},
  '62808': {name: 'Food Court', group: 'Ops'},
  '62810': {name: 'Closing Ceremonies', group: 'Ops'},
  '62812': {name: 'Dance - Rest Area', group: 'Ops'},
  '62819': {name: 'Manga Lounge', group: 'Dealers'},
  '62822': {name: 'Fan Events 3', group: 'Fan Events'},
  '64958': {name: 'Tabletop Gaming', group: 'Gaming'},
  '64961': {name: 'Convention Operations', group: 'Ops'},
  '64965': {name: 'Extravaganzas Office', group: 'Ops'},
  '64966': {name: 'Autographs', group: 'Social'},
  '67002': {name: 'The Battlefield', group: 'Social'},
  '67004': {name: 'Tabletop 18+ DoubleTree', group: 'Gaming'},
  '67008': {name: 'Ruby Campaign', group: 'Social'},
  '67010': {name: 'Sapphire Campaign', group: 'Social'},
  '67012': {name: 'Emerald Campaign', group: 'Social'},
  '67014': {name: 'Amethyst Campaign', group: 'Social'},
  '67016': {name: 'Diamond Campaign', group: 'Social'},
  '67021': {name: 'Peacebonding Station', group: 'Ops'},
  '67033': {name: 'Interactive Events', group: 'Social'},
  '67057': {name: 'Games Presentation Stage', group: 'Social'},
  '67060': {name: 'ConOps (DoubleTree)', group: 'Ops'},
  '67063': {name: 'Escape Room', group: 'Social'},
  '67079': {name: 'Tabletop Tournaments', group: 'Gaming'},
  '67106': {name: 'Special Panels', group: 'Social'},
  '67697': {name: 'Cosplay Hangout', group: 'Social'},
  '67698': {name: 'Cosplay Workshops', group: 'Social'},
  '67749': {name: 'PC Tournaments', group: 'Gaming'},
  '67751': {name: 'Console Tournaments', group: 'Gaming'},
  '68479': {name: 'Arcade Tournaments', group: 'Gaming'}
};


const SettingsManager = {
  subscribers: [],

  settings: {
    filter: {
      '10050': true,
      '10060': true,
      '10070': true,
      '10080': true,
      '10090': true,
      '10091': true,
      '10100': true,
      '20010': true,
      '20090': true,
      '20110': true,
      '30010': true,
      '30030': true,
      '30060': true,
      '40010': true,
      '40060': true,
      '40070': true,
      '40080': true,
      '40090': true,
      '40100': true,
      '40110': true,
      '40120': true,
      '40130': true,
      '40140': true,
      '40170': true,
      '40180': true,
      '40190': true,
      '40200': true,
      '40210': true,
      '40220': true,
      '40230': true,
      '40240': true,
      '40250': true,
      '40300': true,
      '40310': true,
      '40320': true,
      '40321': true,
      '40322': true,
      '40330': true,
      '40350': true,
      '40360': true,
      '40370': true,
      '40380': true,
      '61139': true,
      '61145': true,
      '61241': true,
      '61242': true,
      '62702': true,
      '62703': true,
      '62704': true,
      '62706': true,
      '62707': true,
      '62708': true,
      '62709': true,
      '62710': true,
      '62711': true,
      '62808': true,
      '62810': true,
      '62812': true,
      '62819': true,
      '62822': true,
      '64958': true,
      '64961': true,
      '64965': true,
      '64966': true,
      '67002': true,
      '67004': true,
      '67008': true,
      '67010': true,
      '67012': true,
      '67014': true,
      '67016': true,
      '67021': true,
      '67033': true,
      '67057': true,
      '67060': true,
      '67063': true,
      '67079': true,
      '67106': true,
      '67697': true,
      '67698': true,
      '67749': true,
      '67751': true,
      '68479': true
    }
  },

  subscribe(listener) {
    const id = (new Date()).getTime();
    SettingsManager.subscribers.push({id, fn: listener});

    return SettingsManager.unsubscribe.bind(id);
  },

  unsubscribe(id) {
    SettingsManager.subscribers = SettingsManager.subscribers.filter(listener => lister.id !== id);
  },

  update(area, prop, val) {
    const updated = Object.assign({}, SettingsManager.settings);

    updated[area][prop] = val;

    return AsyncStorage.setItem('@consquad_settings', JSON.stringify(updated))
      .then(() => {
        SettingsManager.settings = updated;
        SettingsManager.subscribers.forEach(config => {
          config.fn(updated);
        })
      });
  }
}

const mapRoomDataToEvents = () => {
  const reduced = schedule.map(room => {
    const roomData = omit(room, 'children');

    return room.children.map(event => Object.assign({}, event, {room: roomData, key: `${event.id}-${event.start}`}));
  })
  .reduce((prev, curr) => [...prev, ...curr], [])

  return reduced.sort((a, b) => {
    const aStart = moment.unix(a.start);
    const bStart = moment.unix(b.start);

    if (aStart.isBefore(bStart)) return -1;
    if (aStart.isAfter(bStart)) return 1;

    return 0;
  });
}

const groupByDays = (eventList) => {
  const result = {}

  eventList.forEach(event => {
    const start = moment.unix(event.start);
    const end = moment.unix(event.end);
    const label = start.format('ddd - MMM D');

    result[label] = result[label] || [];

    result[label].push(event);
  });

  return Object.keys(result).map(key => ({title: key, data: result[key]}))
}

const EventItem = ({event}) => {
  const eventTrack = trackMap[event.trackid] || {};

  return (
    <View style={[styles.eventItem, {borderLeftColor: colorCodes[eventTrack.group], borderLeftWidth: 8}]}>
      <Text style={[styles.eventItemText, styles.uBold, styles.uTitle]}>
        {event.name} -
        <Text style={{color: colorCodes[eventTrack.group]}}> {eventTrack.group}</Text>
      </Text>
      <Text style={styles.eventItemText}>{event.room.name}</Text>
      <Text style={styles.eventItemText}>{event.room.room_venue} - {event.room.room_name}</Text>
      <Text style={styles.eventItemText}>{moment.unix(event.start).format('lll')} - {moment.unix(event.end).format('lll')}</Text>
    </View>
  )
}

const FullSchedule = () => {
  const sectionHeader = ({section}) => (<Text style={styles.sectionHeader}>{section.title}</Text>);

  return (
    <SectionList renderSectionHeader={sectionHeader} sections={groupByDays(mapRoomDataToEvents())} renderItem={({item}) => <EventItem event={item}/>} />
  );
}

class FilterMenu extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = Object.assign({}, SettingsManager.settings.filters);
    this.unsubscribe = SettingsManager.subscribe((settings) => {
      this.setState(prev => settings.filter);
    });
  }

  updateFilter(key, val) {
    SettingsManager.update('filter', key, val);
  }

  getData() {
    return groupBy(trackMap, 'group');
  }


  getFilterItems(items) {
    const filterItem = (item, i) => (
      <View  key={`${item.name}-${i}`}>
        <Text>
          <Text><MaterialIcon name={''} size={24} color={'blue'} /></Text>
          <Text>{item.name}</Text>
        </Text>
      </View>
    )

    return items.map(filterItem);
  }

  makeFilterGroups() {
    const groups = this.getData();

    return Object.keys(groups).map(name => (
      <View key={name}>
        <Text style={styles.sectionHeader}>{name}</Text>
        {this.getFilterItems(groups[name])}
      </View>
    ))
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.makeFilterGroups()}
      </ScrollView>
    )
  }
}

const RootStack = createBottomTabNavigator({
  schedule: {screen: FullSchedule},
  filters: {screen: FilterMenu}
}, {
  initialRouteName: 'schedule',
  tabBarOptions: {
    showLabel: false
  },
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      const iconMap = {
        schedule: 'event',
        filters: 'filter-list'
      }

      return <MaterialIcon name={iconMap[routeName]} size={24} color={tintColor} />;
    },
  })
});

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={{fontSize: 32, color: 'white', textAlign: 'center'}}>Fanime Schedule</Text>
        </View>
        <RootStack />
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: '#fff'
  },
  eventItem: {
    flex: 1,
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#34495E',
    borderRadius: 4,
    marginLeft: 8,
    marginRight: 8
  },
  eventItemText: {
    color: 'white'
  },
  uBold: {
    fontWeight: 'bold'
  },
  uTitle: {
    fontSize: 20,
    marginBottom: 8
  },
  sectionHeader: {
    fontSize: 24,
    padding: 8,
    color: '#34495E',
    backgroundColor: 'white',
    borderBottomColor: '#34495E',
    borderBottomWidth: 2
  },
  topBar: {
    backgroundColor: '#004990',
    borderBottomColor: '#ffe200',
    borderBottomWidth: 4,
    paddingTop: 32,
    paddingBottom: 24,
    padding: 16,
    marginBottom: 8
  }
});

// Panels: #E91E63 pink, Fan Events #9C27B0 purple ,Social: #03A9F4 blue, Ops #fff white, Dealers #FF9800 orange, Gaming #8BC34A green, Screenings #FFEB3B yellow, Music #CDDC39 lime
const colorCodes = {
  'Panels': '#E91E63', // pink
  'Fan Events': '#9C27B0', // purple
  'Social': '#03A9F4', // blue
  'Ops': '#607D8B', // bluegrey
  'Dealers': '#FF9800', // orange
  'Gaming': '#8BC34A', // green
  'Screenings': '#FFEB3B', // yellow
  'Music': '#CDDC39' // lime
}
