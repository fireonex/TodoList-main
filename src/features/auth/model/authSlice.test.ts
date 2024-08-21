import { ActionForTests } from 'common/types';
import { authReducer, authThunks } from './authSlice';

let startState = {
     isLoggedIn: false,
};

beforeEach(() => {
     startState = {
          isLoggedIn: false,
     };
});

test("user should be logged in after login action is fulfilled", () => {
     const action: ActionForTests<typeof authThunks.login.fulfilled> = {
          type: authThunks.login.fulfilled.type,
          payload: { isLoggedIn: true },
     };

     const endState = authReducer(startState, action);

     expect(endState.isLoggedIn).toBe(true);
});

test("user should be logged out after logout action is fulfilled", () => {
     startState = { isLoggedIn: true };

     const action: ActionForTests<typeof authThunks.logout.fulfilled> = {
          type: authThunks.logout.fulfilled.type,
          payload: { isLoggedIn: false },
     };

     const endState = authReducer(startState, action);

     expect(endState.isLoggedIn).toBe(false);
});

test("user should be logged in after initializeApp action is fulfilled", () => {
     const action: ActionForTests<typeof authThunks.initializeApp.fulfilled> = {
          type: authThunks.initializeApp.fulfilled.type,
          payload: { isLoggedIn: true },
     };

     const endState = authReducer(startState, action);

     expect(endState.isLoggedIn).toBe(true);
});


