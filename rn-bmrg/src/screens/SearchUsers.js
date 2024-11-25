import React, { Component } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from "../firebase/config";

class SearchUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            users: [],
            loading: false,
            noResults: false
        };
    }

    handleSearch(term) {
        this.setState({ searchTerm: term, loading: true, noResults: false });

        if (term.trim() === '') {
            this.setState({ users: [], loading: false, noResults: false });
            return;
        }

        db.collection("users")
            .where("user", ">=", term)
            .where("user", "<=", term + '\uf8ff')
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    this.setState({ users: [], loading: false, noResults: true });
                } else {
                    const users = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }));
                    this.setState({ users, loading: false, noResults: false });
                }
            })
            .catch((error) => {
                console.error("Error searching users:", error);
                this.setState({ users: [], loading: false, noResults: true });
            });
    }

    handleUserPress = (item) => {
        this.setState({
            query: "",
            users: []
        }, 
        () => {
            this.props.navigation.navigate("User", { id: item.id });
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Search Users...</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Buscar usuarios..."
                    value={this.state.searchTerm}
                    onChangeText={(term) => this.handleSearch(term)}
                />
                {this.state.loading ? (
                    <ActivityIndicator size="large" color="#1DA1F2" style={styles.loading} />
                ) : this.state.noResults ? (
                    <Text style={styles.noResults}>No se encontraron usuarios</Text>
                ) : (
                    <FlatList
                        data={this.state.users}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.userItem}
                                onPress={() => this.handleUserPress(item)}
                            >
                                <Text style={styles.username}>{item.data.user}</Text>
                                <Text style={styles.email}>{item.data.email}</Text>
                            </TouchableOpacity>
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
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    loading: {
        marginTop: 20,
    },
    noResults: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginTop: 20,
    },
    userItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 8,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
});

export default SearchUsers;
