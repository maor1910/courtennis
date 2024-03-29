import React from 'react';
import './browse.css';
import SearchProduct from "../searchProduct/searchProduct";
import ProductContainer from "./productContainer";
import axios from "axios";

class Browse extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            searchBy: "",
            count: 0,
            filteredProducts: [],
            cartItems: JSON.parse(localStorage.getItem("cartItems")) ?
                JSON.parse(localStorage.getItem("cartItems")) : []
        };
    }

    componentDidMount() {
        axios.get("/products").then(res => {
            const filteringTestProducts = res.data.filter(product => product.name !== "testProduct")
            this.setState({
                products: filteringTestProducts,
                filteredProducts: filteringTestProducts,
                searchCount: filteringTestProducts.length
            })
        })
    }

    editSearchTerm = (event) => {
        const searchTerm = event.target.value;
        this.setState({
            searchTerm,
            filteredProducts: this.state.products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        });

    };

    addItemToCart = (itemToAdd) => {
        const itemsInCart = this.state.cartItems.slice();
        let isItemInCart = false;
        itemsInCart.forEach(item => {
            if (item._id === itemToAdd._id) {
                item.count += 1;
                isItemInCart = true;
            }
        });
        if (!isItemInCart) {
            itemsInCart.push({...itemToAdd, count: 1})
        }
        this.setState({cartItems: itemsInCart});
        localStorage.setItem("cartItems", JSON.stringify(itemsInCart));
    };

    removeItemFromCart = (item) => {
        const cartItems = this.state.cartItems.slice();
        let items = cartItems.filter((removeItem) => removeItem._id !== item._id);
        this.setState({
            cartItems: items,
        });
        localStorage.setItem("cartItems", JSON.stringify(items));
    };

    numOfItems = items => items.reduce((sum, item) => sum += parseFloat(item.count), 0);

    removeAllFromCart = async () => {
        localStorage.clear();
        this.setState({cartItems: []});
    };

    render() {
        return (
            <div className="products-container">
                <main>
                    <div className="content">
                        <div className="main">
                            <SearchProduct count={this.state.searchCount}
                                           cartCount={this.numOfItems(this.state.cartItems)}
                                           searchTerm={this.state.searchTerm}
                                           onChange={this.editSearchTerm}
                                           onClearCart={this.removeAllFromCart}>
                            </SearchProduct>
                            <div className="storeItems">
                                <ProductContainer cart={this.addItemToCart} remove={this.removeItemFromCart}
                                                  products={this.state.filteredProducts} cartItems={this.state.cartItems}/>
                                
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}

export default Browse;
