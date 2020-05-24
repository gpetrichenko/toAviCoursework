//include vee-validate
import { required, confirmed, length, email, alpha_num, regex } from "vee-validate/dist/rules";
import { extend, localize } from "vee-validate";
import TW from 'vee-validate/dist/locale/zh_TW.json'

localize('zh_TW', TW)
extend("required", {
  ...required,
  message: "Поле обязательно к заполнению"
});

extend("email", {
  ...email,
  message: "Пожалуйста введите адрес электронной почты"
});

extend("password", {
  validate: value => {
    return value.length >= 6 && value.length <= 50
  },
  message: "Пароль должен быть больше 6 символов, включая 1 букву"
});

extend("confirmed", {
  ...confirmed,
  message: "Пароли не сопадают"
});

extend("length", {
  ...length,
  message: ".."
});

extend("alpha_num", {
  ...alpha_num,
  message: "Можно ввести только буквы и цифры"
});

extend("regex", {
  ...regex,
  message: "Ошибка формата"
});
