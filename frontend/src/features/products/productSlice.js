import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import Product from "../../components/Product";
import axios from "axios";


export const getProduct = createAsyncThunk('product/getProduct', async(_, {rejectWithValue}) => {
    try {
        const link = '/api/v1/products';
        const {data} =await axios.get(link);
        console.log(data);
        return data
        
    } catch (error) {
        return rejectWithValue(error.response?.data || 'An Error Occurred')
    }
})

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        productCount: 0,
        loading: false,
        error: null
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getProduct.fulfilled, (state, action) => {
            console.log('Fulfilled action payload', action.payload);
            state.loading = false;
            state.error = null;
            state.products = action.payload.products;
            state.productCount = action.payload.productCount;
        })
        .addCase(getProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'An Error Occurred' ;
        })
    }
})

export const {removeErrors} = productSlice.actions;
export default productSlice.reducer;