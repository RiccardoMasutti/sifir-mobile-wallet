import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AppStyle} from '@common/index';

export const SifirChannelProgress = props => {
  const {loaded, routes, isRouteFound, loading} = props;
  const primaryColor =
    !loading && !isRouteFound ? '#21827D' : AppStyle.mainColor;
  const isGoldenColor = isRouteFound && routes?.length ? true : false;
  const remaining = 100 - loaded;
  const startDotColor = loaded === 0 ? 'rgb(30, 73, 95)' : primaryColor;
  const endDotColor = loaded === 100 ? primaryColor : 'rgb(30, 73, 95)';

  const styles = StyleSheet.create({
    progress_wrapper: {
      flexDirection: 'row',
      flex: 0.7,
      position: 'relative',
      alignItems: 'center',
    },
    completed: {
      width: `${loaded - 2}%`,
      borderWidth: 1,
      borderStyle: loaded === 100 ? 'solid' : 'dashed',
      borderColor: isGoldenColor ? AppStyle.orange : primaryColor,
    },
    remaining: {
      width: `${remaining}%`,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: 'rgb(30, 73, 95)',
    },
    startDot: {
      position: 'absolute',
      left: 0,
      backgroundColor: isGoldenColor ? AppStyle.orange : startDotColor,
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    endDot: {
      position: 'absolute',
      right: 0,
      backgroundColor: isGoldenColor ? AppStyle.orange : endDotColor,
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    endDotInner: {
      width: 15,
      height: 15,
      borderRadius: 8,
      backgroundColor: AppStyle.backgroundColor,
    },
  });

  return (
    <View style={styles.progress_wrapper}>
      <View style={styles.completed} />
      <View style={styles.remaining} />
      <View style={styles.startDot} />
      <View style={styles.endDot}>
        {loaded !== 100 && loaded !== 0 && <View style={styles.endDotInner} />}
      </View>
    </View>
  );
};
