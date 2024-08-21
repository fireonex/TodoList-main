import { Dispatch } from "redux";
import { appActions } from "app/app.reducer";
import { BaseResponse } from "common/types/common.types";


/**
 * Данная функция обрабатывает ошибки сервера и обновляет состояние приложения.
 * @param data  - ответ от сервера в формате ResponseType<D>
 * @param dispatch - функция для отправки сообщений в store Redux
 * @param isShowGlobalError - флаг, указывающий, нужно ли отображать ошибки в пользовательском интерфейсе
 *
 * @return {void} - функция ничего не возвращает
 */

export const handleServerAppError = <D>(data: BaseResponse<D>, dispatch: Dispatch, isShowGlobalError: boolean = true): void => {

  if (isShowGlobalError) {
    if (data.messages.length) {
      dispatch(appActions.setAppError({ error: data.messages[0] }));
    } else {
      dispatch(appActions.setAppError({ error: "Some error occurred" }));
    }
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
