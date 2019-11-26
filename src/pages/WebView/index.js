import React from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

export default function WebPage({ navigation }) {
  const uri = navigation.getParam('repository').html_url;

  return <WebView source={{ uri }} style={{ flex: 1 }} />;
}

WebPage.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repository').name,
});

WebPage.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
