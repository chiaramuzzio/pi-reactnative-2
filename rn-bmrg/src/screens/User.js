import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { auth, db } from "../firebase/config";

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: null,
            loading: true,
            posts: [],
        };
    }

    componentDidMount() {
        const { id } = this.props.route.params;

        if (id === auth.currentUser.uid) {
            this.props.navigation.navigate("Profile");
        }

        if (!id) {
            console.error("El ID recibido es undefined.");
            this.setState({ loading: false });
            return;
        }

        db.collection("users").doc(id).get()
            .then(doc => {
                if (doc.exists) {
                    this.setState({ userInfo: doc.data() });

                    db.collection('posts')
                        .where('email', '==', doc.data().email)
                        .onSnapshot(
                            (snapshot) => {
                                let userPosts = [];
                                snapshot.forEach((doc) => {
                                    userPosts.push({
                                        id: doc.id,
                                        data: doc.data(),
                                    });
                                });

                                this.setState({
                                    posts: userPosts,
                                    loading: false,
                                });
                            },
                            (error) => {
                                console.error('Error:', error);
                                this.setState({ loading: false });
                            }
                        );

                } else {
                    this.setState({ loading: false });
                }
            })
            .catch(error => {
                console.error("Error obteniendo el documento: ", error);
                this.setState({ loading: false });
            });
    }

    render() {
        const { userInfo, loading, posts } = this.state;

        if (loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size='large' color='#1DA1F2' />
                </View>
            );
        }

        if (!userInfo) {
            return (
                <View style={styles.container}>
                    <Text>No se encontró el usuario.</Text>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.username}>{userInfo.user}</Text>
                </View>
                <Text style={styles.email}>{userInfo.email}</Text>
                <Text style={styles.postCount}>Cantidad de posteos: {posts.length}</Text>
                {posts.length === 0 ? (
                    <View style={styles.noPostsContainer}>
                        <Text>No hay posts</Text>
                    </View>
                ) : (
                    <FlatList
                        data={posts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.username}>{item.data.user}</Text>
                                    <Text style={styles.date}>{new Date(item.data.createdAt).toLocaleDateString()}</Text>
                                </View>
                                <Text style={styles.tweet}>{item.data.tweet}</Text>
                                <View style={styles.footer}>
                                    <Text style={styles.likes}>Liked by {item.data.likes ? item.data.likes.length : 0}</Text>
                                </View>
                            </View>
                        )}
                    />
                )}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
        marginBottom: 10
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#14171a'
    },
    email: {
        fontSize: 16,
        color: '#657786',
        marginBottom: 10
    },
    postCount: {
        fontSize: 16,
        color: '#657786',
        marginBottom: 10
    },
    card: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        width: '95%',
        alignSelf: 'center'
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    date: {
        color: '#657786',
        fontSize: 14
    },
    tweet: {
        fontSize: 16,
        marginBottom: 10,
        lineHeight: 24
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#e1e8ed',
        paddingTop: 10
    },
    likes: {
        color: '#657786',
        fontSize: 14
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginLeft: 10
    },
    noPostsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default User;