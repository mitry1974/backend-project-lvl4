export default {
  translation: {
    appName: 'TaskMan',
    flash: {
      auth: {
        error: 'У вас нет доступа к этой странице',
      },
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        not_found: 'Пользователь не найден',
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Не удалось обновить данные пользователя',
          success: 'Данные пользователя успешно обновлены',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удален',
        },
      },
    },
    layouts: {
      application: {
        about: 'Возможности',
        users: 'Пользователи',
        login: 'Вход',
        logout: 'Выход',
        edituser: 'Пользователь',
        register: 'Регистрация',
      },
    },
    views: {
      session: {
        new: {
          login: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        errors: {
          email_already_exists: 'Пользователь уже зарегистрирован',
          email_not_empty: 'Email не может быть пустым',
          email_not_email: 'Введите правильный e-mail адрес',
          password_not_empty: 'Пароль не может быть пустым',
          password_confirmation_not_empty: 'Подтверждение пароля не может быть пустым',
          password_confirmation_the_same_as_password: 'Подтверждение пароля должно совпадать с паролем',
        },
        list: {
          caption: 'Пользователи',
          id: 'Id',
          email: 'Email',
          firstname: 'Имя',
          lastname: 'Фамилия',
          role: 'Роль',
          delete: 'Удалить',
          add: 'Добавить',
          edit: 'Редактировать',
          delete_confirmation: 'Вы уверены?',
        },
        new: {
          caption: 'Новый пользователь',
          submit: 'Зарегистрировать',
          register: 'Регистрация',
          firstname: 'Имя',
          lastname: 'Фамилия',
          email: 'email',
          password: 'Пароль',
          confirm: 'Пароль еще раз',
        },
        edit: {
          submit: 'Сохранить',
          caption: 'Редактировать',
          firstname: 'Имя',
          lastname: 'Фамилия',
          email: 'email',
        },
        change_password: {
          caption: 'Изменить пароль',
          password: 'Пароль',
          confirm: 'Пароль еще раз',
          old_password: 'Текущий пароль',
        },
      },
      welcome: {
        about: {
          header: 'Обзор Продукта',
          body: 'TaskMan это просто и понятный менеджер задач, позволяющий пользователям управлять своими ежедневными делами.',
        },
        index: {
          hello: 'TaskMan',
          description: 'Простой, понятный и функциональный менеджер задач',
        },
      },
    },
  },
};
