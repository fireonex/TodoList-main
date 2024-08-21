import { tasksReducer } from 'features/TodolistsList/tasks-slice';
import { todolistsReducer } from 'features/TodolistsList/todolists-slice';
import { combineReducers } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { appPath, appReducer } from 'app/app-slice';
import { authReducer } from 'features/Login/auth-slice';
import { configureStore, UnknownAction } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
     tasks: tasksReducer,
     todolists: todolistsReducer,
     //способ обращения чтобы не было проблем с селекторами
     [appPath]: appReducer,
     auth: authReducer,
});

// ❗старая запись, с новыми версиями не работает
//  const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({ reducer: rootReducer });

export type AppRootStateType = ReturnType<typeof rootReducer>;

// ❗ UnknownAction вместо AnyAction
export type AppThunk<ReturnType = void> = ThunkAction<
     ReturnType,
     AppRootStateType,
     unknown,
     UnknownAction
>;

// export type AppDispatch = typeof store.dispatch
// ❗ UnknownAction вместо AnyAction
export type AppDispatch = ThunkDispatch<
     AppRootStateType,
     unknown,
     UnknownAction
>;
