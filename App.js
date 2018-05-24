import React from 'react';
import { StyleSheet, Text, View, FlatList, SectionList } from 'react-native';
import schedule from './schedule.json';
import * as moment from 'moment';
import {omit} from 'lodash';

const trackMap = {
  '10050': {name: 'Panels 1', group: 'Panels'},
  '10060': {name: 'Panels 2', group: 'Panels'},
  '10070': {name: 'Panels 3', group: 'Panels'},
  '10080': {name: 'Panels 4', group: 'Panels'},
  '10090': {name: 'Fan Events 1', group: 'Fan Events'},
  '10091': {name: 'Fan Events 2', group: 'Fan Events'},
  '10100': {name: 'Maid Cafe', group: 'Maid Cafe'},
  '20010': {name: 'Dojo', group: 'Dojo'},
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
  '40330': {name: 'Stage Zero', group: 'Misc'},
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
}

const mapRoomDataToEvents = () => schedule.map(room => {
  const roomData = omit(room, 'children');

  return room.children.map(event => Object.assign({}, event, {room: roomData, key: `${event.id}-${event.start}`}));
})
.reduce((prev, curr) => [...prev, ...curr], []);

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
  return (
    <View style={styles.eventItem}>
      <Text style={[styles.eventItemText, styles.uBold, styles.uTitle]}>{event.name}</Text>
      <Text style={styles.eventItemText}>{event.room.name}</Text>
      <Text style={styles.eventItemText}>{event.room.room_venue} - {event.room.room_name}</Text>
      <Text style={styles.eventItemText}>{moment.unix(event.start).format('lll')} - {moment.unix(event.end).format('lll')}</Text>
    </View>
  )
}

export default class App extends React.Component {
  render() {
    const sectionHeader = ({section}) => (<Text style={styles.sectionHeader}>{section.title}</Text>)
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={{fontSize: 32, color: 'white', textAlign: 'center'}}>Con Squad</Text>
        </View>
        <SectionList renderSectionHeader={sectionHeader} sections={groupByDays(mapRoomDataToEvents())} renderItem={({item}) => <EventItem event={item}/>} />
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
