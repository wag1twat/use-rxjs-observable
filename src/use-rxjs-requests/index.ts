import useRxRequest from "./useRxJsRequest";
import useRxRequests from "./useRxJsRequests";
import {
  BaseRxObservableConfig,
  MultiRxObservableConfig,
  SingleRxObservableStateListener,
  MultiRxObservableStateListener,
  SingleRxObservableConfig,
  RxRequestConfig,
  RxRequestResult,
  OnErrorUseRxRequests,
  OnSuccessUseRxRequests,
  OnSuccessUseRxRequest,
  OnErrorUseRxRequest,
  UseRxRequestsValue,
  UseRxRequestFetchFn,
  UseRxRequestValue,
  MultiRxObservableConfigure,
  SingleRxObservableConfigure,
  SingleRxObservableState,
  MultiRxObservableState,
} from "./types";

export type {
  BaseRxObservableConfig,
  MultiRxObservableConfig,
  SingleRxObservableStateListener,
  MultiRxObservableStateListener,
  SingleRxObservableConfig,
  RxRequestConfig,
  RxRequestResult,
  OnErrorUseRxRequests,
  OnSuccessUseRxRequests,
  OnSuccessUseRxRequest,
  OnErrorUseRxRequest,
  UseRxRequestsValue,
  UseRxRequestFetchFn,
  UseRxRequestValue,
  MultiRxObservableConfigure,
  SingleRxObservableConfigure,
  SingleRxObservableState,
  MultiRxObservableState,
};

export { useRxRequests, useRxRequest };
