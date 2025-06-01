import {configureStore} from '@reduxjs/toolkit'
import fooditemsReducer from './Slice' 

export const store = configureStore({reducer:{
    fooditems : fooditemsReducer,
}})
