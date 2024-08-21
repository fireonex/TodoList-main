import { createAsyncThunk } from "@reduxjs/toolkit"
import { RejectActionError } from "common/types"
import { AppDispatch, AppRootState } from "../../app/model/store"

/**
Эта функция предназначена для того, чтобы избавиться от дублирования кода по созданию типов в санке
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootState
  dispatch: AppDispatch
  rejectValue: RejectActionError
}>()
