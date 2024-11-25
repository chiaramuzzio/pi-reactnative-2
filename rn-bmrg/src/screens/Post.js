import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PostForm from '../components/PostForm';
import { auth } from "../firebase/config";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Compose new Tweet</Text>
        </View>
        <PostForm navigation={this.props.navigation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
    padding: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#14171a'
  }
});

export default Post;