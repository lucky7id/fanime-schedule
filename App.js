import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import schedule from './schedule.json';
import * as moment from 'moment';
import {omit} from 'lodash';

const mapRoomDataToEvents = () => schedule.map(room => {
  const roomData = omit(room, 'children');

  return room.children.map(event => Object.assign({}, event, {room: roomData, key: `${event.id}-${event.start}`}));
})
.reduce((prev, curr) => [...prev, ...curr], []);

const EventItem = ({event}) => {
  return (
    <View style={styles.eventItem}>
      <Text style={[styles.eventItemText, styles.uBold]}>{event.name}</Text>
      <Text style={styles.eventItemText}>{event.room.name}</Text>
      <Text style={styles.eventItemText}>{event.room.room_venue} - {event.room.room_name}</Text>
      <Text style={styles.eventItemText}>{moment.unix(event.start).format('lll')} - {moment.unix(event.end).format('lll')}</Text>
    </View>
  )
}

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <FlatList data={mapRoomDataToEvents()} renderItem={({item}) => <EventItem event={item}/>} />
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
    backgroundColor: '#34495E'
  },
  eventItemText: {
    color: 'white'
  },
  uBold: {
    fontWeight: 'bold'
  }
});
