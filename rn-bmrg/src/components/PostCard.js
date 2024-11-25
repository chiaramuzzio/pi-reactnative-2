import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from "../firebase/config";
import firebase from 'firebase/app';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

class PostCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: this.props.post,
            liked: this.props.post.data.likes.includes(auth.currentUser.email),
            likeCount: this.props.post.data.likes.length,
            condicion: this.props.condicion
        };
    }

    like() {
        db.collection("posts")
            .doc(this.state.post.id)
            .update({
                likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
            })
            .then(() => {
                this.setState({ liked: true, likeCount: this.state.likeCount + 1 });
                console.log("Like exitoso");
            })
            .catch(error => {
                console.error("Error al dar like: ", error);
            });
    }

    unlike() {
        db.collection("posts")
            .doc(this.state.post.id)
            .update({
                likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
            })
            .then(() => {
                this.setState({ liked: false, likeCount: this.state.likeCount - 1 });
                console.log("Unlike exitoso");
            })
            .catch(error => {
                console.error("Error al quitar like: ", error);
            });
    }

    handleDelete = (postId) => {
        db.collection("posts").doc(postId).delete()
            .then(() => {
                console.log("eliminado!");
            })
            .catch(error => {
                console.error("Error al eliminar el post: ", error);
            });
    }

    render() {
        const { post, liked, likeCount, condicion } = this.state;
        const createdAt = new Date(post.data.createdAt).toLocaleDateString();

        return (
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.username}>{post.data.user}</Text>
                    <Text style={styles.date}>{createdAt}</Text>
                </View>
                <Text style={styles.tweet}>{post.data.tweet}</Text>
                <View style={styles.footer}>
                    <Text style={styles.likes}>Liked by {likeCount}</Text>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => (liked ? this.unlike() : this.like())}>
                            <AntDesign name={liked ? "heart" : "hearto"} size={24} color="red" style={styles.icon} />
                        </TouchableOpacity>
                        {condicion && (
                            <TouchableOpacity onPress={() => this.handleDelete(post.id)}>
                                <Feather name="trash" size={24} color="black" style={styles.icon} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 10
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
    }
});

export default PostCard;