import { StyleSheet } from 'react-native';
import { neutral, accent, validation } from '../colors/colors';

export const inputs = StyleSheet.create({
  error: {
    color: validation[900],
  },
  titleBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    marginBottom: 50,
  },
  titleText: {
    color: neutral[900],
    fontSize: 36,
  },
  titleTextSmall: {
    color: neutral[900],
    fontSize: 24,
  },
  box: {
    marginHorizontal: 40,
  },
  text: {
    color: neutral[900],
    fontSize: 18,
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    color: neutral[900],
    borderColor: neutral[900],
    borderWidth: 1,
    height: 47,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: accent[300],
    marginHorizontal: 40,
    marginBottom: 15,
    height: 47,
    borderRadius: 7,
  },
  buttonWhite: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: neutral[100],
    marginHorizontal: 40,
    marginBottom: 15,
    height: 47,
    borderRadius: 7,
  },
  buttonText: {
    color: neutral[900],
    fontSize: 18,
  },
});
