import { FormikHelpers, useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../common/hooks';
import { BaseResponse } from '../../../common/types';
import { LoginParams } from '../api/authApi';
import { authThunks, selectIsLoggedIn } from '../model/authSlice';
import { AppRootState } from '../../../app/model/store';

type FormikError = {
     email?: string
     password?: string
     rememberMe?: boolean
}

export const useLogin = () => {
     const dispatch = useAppDispatch();

     const isLoggedIn = useSelector(selectIsLoggedIn);
     const captchaUrl = useSelector((state: AppRootState) => state.security.captchaURL);

     const formik = useFormik({
          validate: (values) => {
               const errors: FormikError = {};
               if (!values.email) {
                    errors.email = 'Email is required';
               } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                    errors.email = 'Invalid email address';
               }

               if (!values.password) {
                    errors.password = 'Required';
               } else if (values.password.length < 3) {
                    errors.password = 'Must be 3 characters or more';
               }

               return errors;
          },
          initialValues: {
               email: '',
               password: '',
               rememberMe: false,
               captcha: '' // добавляем captcha в начальные значения
          },
          onSubmit: (values, formikHelpers: FormikHelpers<LoginParams>) => {
               dispatch(authThunks.login(values))
                    .unwrap()
                    .catch((reason: BaseResponse) => {
                         reason.fieldsErrors?.forEach((fieldError) => {
                              formikHelpers.setFieldError(fieldError.field, fieldError.error);
                         });
                    });
          }
     });


     return { formik, isLoggedIn, captchaUrl };
};
