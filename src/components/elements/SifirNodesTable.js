import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {AppStyle} from '@common/index';

const data = [
  {alias: 'EMEA#1', connections: 610, hops: 5, id: 1},
  {alias: 'EMEA#1', connections: 610, hops: 5, id: 2},
  {alias: 'EMEA#1', connections: 610, hops: 5, id: 3},
  {alias: 'EMEA#1', connections: 610, hops: 5, id: 4},
  {alias: 'EMEA#1', connections: 610, hops: 5, id: 6},
  {alias: 'EMEA#1', connections: 610, hops: 5, id: 9},
  {alias: 'EMEA#1', connections: 610, hops: 5, id: 80},
];

const Columns = props => {
  return (
    <View style={styles.columnWrapper}>
      <View style={styles.columnBox}>
        <Text style={styles.columnText}>Alias</Text>
      </View>

      <View style={styles.columnBox}>
        <Text style={styles.columnText}>Status</Text>
      </View>

      <View style={styles.rowBox}>
        <Text style={styles.columnText}>Capacity</Text>
      </View>
    </View>
  );
};
const Row = props => {
  const {
    channelStatus,
    capacity,
    alias,
    bgIndicator,
    selected,
    onSelect,
  } = props;
  let backgroundColor = selected
    ? '#ffa500'
    : bgIndicator % 2 === 0
    ? '#102c3a'
    : '#1f4c5f';
  return (
    <TouchableOpacity style={{backgroundColor}} onPress={onSelect}>
      <View style={styles.rowWrapper}>
        <View style={styles.rowBox}>
          <Text style={styles.columnTextRow}>{alias}</Text>
        </View>

        <View style={styles.rowBox}>
          <Text style={styles.columnTextRow}>{channelStatus}</Text>
        </View>

        <View style={styles.rowBox}>
          <Text style={styles.columnTextRow}>{capacity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SifirNodesTable = props => {
  const {nodes} = props;

  const renderRow = (item, i) => {
    const {selected, onSelect} = props;
    const alias = `${item.id.slice(0, 4)} - ${item.id.slice(-4)}`;
    const channelStatus = item.channels[0].state;
    const capacity = 'capacity';
    return (
      <Row
        key={item.alias}
        alias={alias}
        channelStatus={channelStatus}
        capacity={capacity}
        bgIndicator={i}
        selected={selected && item.id === selected.id}
        onSelect={() => onSelect(item)}
      />
    );
  };

  return (
    <View style={[styles.table, props.style]}>
      <Columns />
      <ScrollView>{nodes.map((item, i) => renderRow(item, i))}</ScrollView>
    </View>
  );
};
export default SifirNodesTable;

const styles = StyleSheet.create({
  table: {flex: 1, backgroundColor: 'black'},
  columnWrapper: {
    padding: 10,
    flexDirection: 'row',
  },
  rowWrapper: {
    padding: 20,
    flexDirection: 'row',
  },
  rowBox: {
    flex: 1,
    alignItems: 'center',
  },
  columnBox: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: AppStyle.mainColor,
    alignItems: 'center',
  },
  columnText: {color: 'white', textAlign: 'center', width: '70%'},
  columnTextRow: {
    color: AppStyle.mainColor,
    textAlign: 'center',
    width: '70%',
  },
});
