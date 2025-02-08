import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  page: {
    padding: 16,
  },
  text: {
    color: 'black',
  },
  headerFooterContainer: {
    marginVertical: 10,
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.9,
    backgroundColor: 'black',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;