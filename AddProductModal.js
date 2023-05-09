import React, { Component } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

class AddProductModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            productNumber: "",
            standardCost: "",
            listPrice: "",
            sellStartDate: "",
            loading: false,
            errorMessage: ''
        };
    }

    handleChange = (value, state) => {
        this.setState({ [state]: value })
    }

    addProduct = () => {
        // destructure state
        const { name, productNumber, standardCost, listPrice, sellStartDate } = this.state;
        this.setState({ errorMessage: "", loading: true });
        //const SERVER='http://localhost:5188';
        const SERVER='https://webapi-juanz.azurewebsites.net';
        if (name && productNumber && standardCost && listPrice && sellStartDate) {
            fetch(SERVER+'/api/productos', {
                method: "POST",
                //mode: 'no-cors',
                headers: {
                    "Accept": "application/vnd.api+json",
                    "Content-Type": "application/vnd.api+json"  
                },
                /*
                {
                    "Name" : "xxxqqqq",
                    "ProductNumber" : "xxx12",
                    "standardCost" : 321,
                    "ListPrice" : 123,
                    "SellStartDate" : "2021-09-01"
                }
                */
                body: JSON.stringify({
                    name: this.state.name,
                    productNumber: this.state.productNumber,
                    standardCost: this.state.standardCost,
                    listPrice: this.state.listPrice,
                    sellStartDate: this.state.sellStartDate   
                })
            })
                .then(res => {
                        res.json();
                        console.log(res);
                        this.props.addProduct({
                            name: res.name == this.state.name ? res.name : this.state.name,
                            productNumber: res.productNumber == this.state.productNumber ? res.productNumber: this.state.productNumber,
                            standardCost: res.standardCost == this.state.standardCost ? res.standardCost : this.state.standardCost,
                            listPrice: res.listPrice == this.state.listPrice ? res.listPrice : this.state.listPrice,
                            sellStartDate: res.sellStartDate == this.state.sellStartDate ? res.sellStartDate : this.state.sellStartDate,
                            id: res.id
                        });
                        this.props.closeModal();
                    }
                )
                .catch((error) => {
                    this.setState({ errorMessage: "Error: "+error, loading: false })
                })
        } else {
            this.setState({ errorMessage: "Fields are empty.", loading: false })
        }
    }

    render() {
        const { isOpen, closeModal } = this.props;
        const { loading, errorMessage } = this.state;
        return (
            <Modal
                visible={isOpen}
                onRequestClose={closeModal}
                animationType="slide"
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Add New Product</Text>

                    <TextInput
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "name")}
                        placeholder="Name" />

                    <TextInput
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "productNumber")}
                        placeholder="Product Number" />    

                    <TextInput
                        keyboardType="numeric"
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "standardCost")}
                        placeholder="Standard Cost" />
                    <TextInput
                        keyboardType="numeric"
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "listPrice")}
                        placeholder="List Price" />

                    <TextInput
                        keyboardType="date"
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "sellStartDate")}
                        placeholder="Sell Start Date" /> 
    

                    {loading ? <Text
                        style={styles.message}>Please Wait...</Text> : errorMessage ? <Text
                            style={styles.message}>{errorMessage}</Text> : null}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={this.addProduct}
                            style={{ ...styles.button, marginVertical: 0 }}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={closeModal}
                            style={{ ...styles.button, marginVertical: 0, marginLeft: 10, backgroundColor: "tomato" }}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        );
    }
}



export default AddProductModal;

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 20
    },
    textBox: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "rgba(0,0,0,0.3)",
        marginBottom: 15,
        fontSize: 18,
        padding: 10
    },
    buttonContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    button: {
        borderRadius: 5,
        marginVertical: 20,
        alignSelf: 'flex-start',
        backgroundColor: "gray",
    },
    buttonText: {
        color: "white",
        paddingVertical: 6,
        paddingHorizontal: 10,
        fontSize: 16
    },
    message: {
        color: "tomato",
        fontSize: 17
    }
})