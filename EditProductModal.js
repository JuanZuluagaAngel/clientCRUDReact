import React, { Component } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

class EditProductModal extends Component {
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

    componentDidMount() {
        // state value is updated by selected product data
        const { name, productNumber, standardCost, listPrice, sellStartDate } = this.props.selectedProduct;
        this.setState({
            name: name,
            productNumber: productNumber,
            standardCost: standardCost,
            listPrice: listPrice,
            sellStartDate: sellStartDate
        })
    }

    handleChange = (value, state) => {
        this.setState({ [state]: value })
    }

    updateProduct = () => {
        // destructure state
        const { name, productNumber, standardCost, listPrice, sellStartDate } = this.state;
        this.setState({ errorMessage: "", loading: true });
        //const SERVER='http://localhost:5188';
        const SERVER='https://webapi-juanz.azurewebsites.net';
        
        if (name && productNumber && standardCost && listPrice && sellStartDate) {
            // selected product is updated with product id
            fetch(`${SERVER}/api/productos/${this.props.selectedProduct.id}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
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
                    Name: this.state.name,
                    productNumber: this.state.productNumber,
                    standardCost: this.state.standardCost,
                    ListPrice: this.state.listPrice,
                    SellStartDate: this.state.sellStartDate   
                })
            })
                .then(
                    res => {
                        res.json(); 
                        console.log("res1",res.status);
                        this.props.updateProduct({
                            name: this.props.selectedProduct.name == this.state.name ? this.props.selectedProduct.name : this.state.name,
                            productNumber: this.props.selectedProduct.productNumber == this.state.productNumber ? this.props.selectedProduct.productNumber: this.state.productNumber,
                            standardCost: this.props.selectedProduct.standardCost == this.state.standardCost ? this.props.selectedProduct.standardCost : this.state.standardCost,
                            listPrice: this.props.selectedProduct.listPrice == this.state.listPrice ? this.props.selectedProduct.listPrice : this.state.listPrice,
                            sellStartDate: this.props.selectedProduct.sellStartDate == this.state.sellStartDate ? this.props.selectedProduct.sellStartDate : this.state.sellStartDate,
                            id: this.props.selectedProduct.id
                        });
                        this.props.closeModal();
                    })
                .catch((error) => {
                    this.setState({ errorMessage: "Error: "+error, loading: false })
                })
        } else {
            this.setState({ errorMessage: "Fields are empty.", loading: false })
        }
    }

    render() {
        const { isOpen, closeModal } = this.props;
        const { name, productNumber, standardCost, listPrice, sellStartDate, loading, errorMessage } = this.state;
        return (
            <Modal
                visible={isOpen}
                onRequestClose={closeModal}
                animationType="slide"
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Update Product</Text>

                    <TextInput
                        value={name}
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "name")}
                        placeholder="Name" />

                    <TextInput
                        value={productNumber}
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "productNumber")}
                        placeholder="Product Number" />    

                    <TextInput
                        value={standardCost}
                        keyboardType="numeric"
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "standardCost")}
                        placeholder="Standard Cost" />

                    <TextInput
                        value={listPrice}
                        keyboardType="numeric"
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "listPrice")}
                        placeholder="List Price" />

                    <TextInput
                        value={(sellStartDate !== undefined) ? sellStartDate.split('T')[0].trim() : ''}
                        keyboardType="date"
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "sellStartDate")}
                        placeholder="Sell Start Date" /> 
    

                    {loading ? <Text
                        style={styles.message}>Please Wait...</Text> : errorMessage ? <Text
                            style={styles.message}>{errorMessage}</Text> : null}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={this.updateProduct}
                            style={{ ...styles.button, marginVertical: 0 }}>
                            <Text style={styles.buttonText}>Update</Text>
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



export default EditProductModal;

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