import { Component } from "react";
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { TextInput } from "react-native-web";
import { auth } from "../firebase/config";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loading: true,
            error: "",
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.props.navigation.navigate("HomeMenu");
            }
            this.setState({ loading: false });
        })
    }

    login = () => {
        const { email, password } = this.state;

        auth.signInWithEmailAndPassword(email, password)
            .then(response => {
                console.log(response);
                this.props.navigation.navigate("HomeMenu");
            })
            .catch(error => {
                console.error("Error en el login: ", error);
                this.setState({ error });
            });
    };

    render() {
        const { email, password, loading, error } = this.state;
        const code = error.code;

        if (loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#1DA1F2" />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Ingresar</Text>

                <TextInput
                    style={styles.fieldinput}
                    keyboardType="email-address"
                    placeholder="Email"
                    onChangeText={text => this.setState({ email: text })}
                    value={email}
                />

                {(error && code === "auth/invalid-email") ? (<Text style={{ color: "red" }}>El email no es válido</Text>) : null}
                {(error && code === "auth/email-badly-formatted") ? (<Text style={{color: 'red'}}>El email no tiene un formato válido</Text>) : null}


                <TextInput
                    style={styles.fieldinput}
                    keyboardType="default"
                    placeholder="Password"
                    onChangeText={text => this.setState({ password: text })}
                    value={password}
                    secureTextEntry
                />
                {(error && code === "auth/internal-error") ? (<Text style={{ color: "red" }}>Usuario o contraseña es incorrecto </Text>) : null}
                {(error && code === "auth/user-not-found") ? (<Text style={{ color: "red" }}>Usuario no encontrado </Text>) : null}
                {(error && code === "auth/wrong-password") ? (<Text style={{ color: "red" }}>La contraseña debe contener al menos 6 caracteres</Text>) : null}


                <TouchableOpacity style={styles.fieldbutton} onPress={this.login}>
                    <Text style={styles.textbutton}>Ingresar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkbutton} onPress={() => this.props.navigation.navigate("Register")}>
                    <Text style={styles.linktext}>No tengo cuenta</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f8fa",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#14171a",
        marginBottom: 20,
    },
    fieldinput: {
        height: 50,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 25,
        marginVertical: 10,
        width: "80%",
        backgroundColor: "#fff",
    },
    fieldbutton: {
        backgroundColor: "#1DA1F2",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginVertical: 10,
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
    },
    textbutton: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    linkbutton: {
        marginVertical: 5,
    },
    linktext: {
        color: "#1DA1F2",
        fontSize: 16,
    },
});

export default Login;