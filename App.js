import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./deleteProductModal";

class App extends Component {
  state = {
    product: [],
    isAddProductModalOpen: false,
    isEditProductModalOpen: false,
    isDeleteProductModalOpen: false,
    loading: false,
    errorMessage: "",
    selectedProduct: {}
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    //const SERVER='http://localhost:5188';
    const SERVER='https://webapi-juanz.azurewebsites.net';
        
    this.setState({ errorMessage: "", loading: true })
    fetch(SERVER+'/api/productos', {
      method: "GET",
      //mode: 'no-cors'
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"  
      },
    })
      .then(res => res.json())
      .then(res => this.setState({
        product: res,
        loading: false, errorMessage: ""
      }))
      .catch((error) => this.setState({
        loading: false,
        errorMessage: "Error: " + error
      }))
      
  }

  

  toggleAddProductModal = () => {
    this.setState({ isAddProductModalOpen: !this.state.isAddProductModalOpen });
  }

  toggleEditProductModal = () => {
    this.setState({ isEditProductModalOpen: !this.state.isEditProductModalOpen });
  }

  toggleDeleteProductModal = () => {
    this.setState({ isDeleteProductModalOpen: !this.state.isDeleteProductModalOpen });
  }

  addProduct = (data) => {
    // this.state.Product array is seprated into object by rest operator
    console.log("data",data);
    this.setState({ product: [data, ...this.state.product] })
  }

  updateProduct = (data) => {
    // updating product data with updated data if product id is matched with updated data id
    console.log("data",data);
    
    this.setState({ product: this.state.product.map(emp => emp.id == data.id ? data : emp) });
    console.log("product",this.state.product.map(emp => emp.id == data.id ? data : emp));
   
  }

  deleteProduct = productId => {
    // delete product lsit with deleted data if product id is matched with updated data id
    this.setState({ product: this.state.product.filter(emp => emp.id !== productId) })
  }

  render() {
    const { loading, errorMessage, product, isAddProductModalOpen,
      isEditProductModalOpen, isDeleteProductModalOpen, selectedProduct } = this.state;
   // console.log(product);
    return (
      <ScrollView>

        <View style={styles.container}>
          <TouchableOpacity
            onPress={this.toggleAddProductModal}
            style={styles.button}>
            <Text style={styles.buttonText}>Add product</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Product Lists:</Text>
          {product.map((data, index) => 
          <View
            style={styles.productListContainer}
            //key={data.id}>
            key={index}>
            <Text style={{ ...styles.listItem, color: "tomato" }}>{index + 1}.</Text>
            <Text style={styles.name}>
              {data.name}</Text>
            <Text style={styles.listItem}>Product Number: 
              {data.productNumber}</Text>
            <Text style={styles.listItem}>List Price:  
              ${data.listPrice}</Text>
            <Text style={styles.listItem}>Standard Cost: 
              ${data.standardCost}</Text>
            <Text style={styles.listItem}>Sell Start Date:  
              {
                (data.sellStartDate !== undefined) ? data.sellStartDate.split('T')[0].trim() : ''
              } </Text>



            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.toggleEditProductModal();
                  this.setState({ selectedProduct: data })
                }}
                style={{ ...styles.button, marginVertical: 0 }}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.toggleDeleteProductModal();
                  this.setState({ selectedProduct: data })
                }}
                style={{ ...styles.button, marginVertical: 0, marginLeft: 10, backgroundColor: "tomato" }}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>)}

          {loading ? <Text
            style={styles.message}>Please Wait...</Text> : errorMessage ? <Text
              style={styles.message}>{errorMessage}</Text> : null}

          {/* AddProductModal modal is open when add product button is clicked */}
          {isAddProductModalOpen ? <AddProductModal
            isOpen={isAddProductModalOpen}
            closeModal={this.toggleAddProductModal}
            addProduct={this.addProduct}
          /> : null}

          {/* EditProductModal modal is open when edit button is clicked in particular product list*/}
          {isEditProductModalOpen ? <EditProductModal
            isOpen={isEditProductModalOpen}
            closeModal={this.toggleEditProductModal}
            selectedProduct={selectedProduct}
            updateProduct={this.updateProduct}
          /> : null}

          {/* DeleteProductModal modal is open when delete button is clicked in particular Product list*/}
          {isDeleteProductModalOpen ? <DeleteProductModal
            isOpen={isDeleteProductModalOpen}
            closeModal={this.toggleDeleteProductModal}
            selectedProduct={selectedProduct}
            updateProduct={this.deleteProduct}
          /> : null}
        </View>

      </ScrollView>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
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
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10
  },
  productListContainer: {
    marginBottom: 25,
    elevation: 4,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.1)"
  },
  name: {
    fontWeight: "bold",
    fontSize: 16
  },
  listItem: {
    fontSize: 16
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  message: {
    color: "tomato",
    fontSize: 17
  }
})