import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { auth, db } from "../firebase/config";
import PostCard from '../components/PostCard';
import AntDesign from '@expo/vector-icons/AntDesign';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: auth.currentUser ? auth.currentUser.email : "",
            user: "User",
            posts: [],
            loading: true
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (!user) {
                this.props.navigation.navigate("Login");
            } else {
                db.collection("users")
                    .where("email", "==", auth.currentUser.email)
                    .onSnapshot(snapshot => {
                        if (!snapshot.empty) {
                            const doc = snapshot.docs[0];
                            this.setState({ user: doc.data().user });
                        }
                    });
            }
        });

        this.fetchPosts();

    }

    fetchPosts = () => {
        db.collection("posts").orderBy('createdAt', 'desc').onSnapshot(
            querySnapshot => {
                let posts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                }));
                this.setState({ posts: posts, loading: false });
                console.log("Posts: ", posts);
            },
            error => {
                console.error("Error fetching posts: ", error);
            }
        );
    }    

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size='large' color='#1DA1F2' />
                </View>
            );
        }

        if (this.state.posts.length === 0) {
            return (
                <View style={styles.container}>
                    <Text>No hay posts</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        {/* <Text style={styles.title}>Inicio</Text> */}
                        <AntDesign name="twitter" size={34} color="#1DA1F2" />
                    </View>
                    <FlatList
                        data={this.state.posts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <PostCard condicion={false} post={item} />}
                    />
                </View>
            );
        }
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
    },
    texto: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#14171a',
        marginBottom: 10
    }
});

export default Home;