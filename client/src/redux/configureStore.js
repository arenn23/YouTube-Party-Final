import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createForms } from "react-redux-form";
import { composeWithDevTools } from "redux-devtools-extension";
import { InitialFeedback } from "./form";

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      ...createForms({
        feedbackForm: InitialFeedback,
      }),
    }),
    composeWithDevTools(applyMiddleware(thunk))
  );

  return store;
};
