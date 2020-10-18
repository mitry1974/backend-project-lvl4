export default {
  translation: {
    appName: 'TaskMan',
    flash: {
      authentication: {
        error: 'Ошибка проверки прав доступа. Неправильный логин или пароль.',
      },
      auth: {
        error: 'У вас нет доступа к этой странице',
      },
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Ошибка логина',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        update: {
          error: 'Не удалось обновить задачу',
          success: 'Задача успешно обновлена',
        },
        delete: {
          error: 'Не удалось удалить задачу',
          success: 'Задача успешно удалена',
        },
      },
      tags: {
        delete: {
          success: 'Тэг удалён',
          error: 'Ошибка удаления тэга',
        },
        create: {
          success: 'Тэг создан',
          error: 'Ошибка создания тэга',
        },
        update: {
          success: 'Тэг изменён',
          error: 'Ошибка изменения тэга',
        },
      },
      users: {
        notFound: 'Пользователь не найден',
        register: {
          error: 'Не удалось зарегистрировать нового пользователя',
          success: 'Пользователь успешно зарегистрирован',
        },
        updatePassword: {
          error: 'Не удалось обновить пароль пользователя',
          success: 'Пароль пользователя успешно обновлен',
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
      taskStatuses: {
        create: {
          error: 'Не удалось создать',
          success: 'Статус успешно создан',
        },
        update: {
          error: 'Не удалось изменить',
          success: 'Статус успешно изменен',
        },
        delete: {
          error: 'Не удалось удалить',
          success: 'Статус успешно удален',
        },
      },
    },
    auth: {
      userNotAdmin: 'Пользователь должен быть администратором',
      userNotTheSame: 'Эту операцию можно выполнить только над собственными данными',
      userNotLoggedIn: 'Необходим логин',
    },
    layouts: {
      application: {
        about: 'Возможности',
        users: 'Пользователи',
        statuses: 'Статусы задач',
        tags: 'Тэги',
        tasks: 'Задачи',
        login: 'Вход',
        logout: 'Выход',
        edituser: 'Пользователь',
        register: 'Регистрация',
      },
    },
    views: {
      tooltips: {
        showUser: 'Помотреть пользователя',
        deleteUser: 'удалить пользователя',
        addUser: 'Добавить пользователя',
        editUser: 'Редактировать пользователя',
        showTask: 'Посмотреть задачу',
        deleteTask: 'Удалить задачу',
        addTask: 'Добавить задачу',
        editTask: 'Редактировать задачу',
        viewTask: 'Просмотр задачи',
        deleteTag: 'Удалить тэг',
        addTag: 'Добавить тэг',
        editTag: 'Редактировать тэг',
      },
      id: 'Id',
      email: 'Email',
      password: 'Пароль',
      all: 'Все',
      edit: {
        submit: 'Сохранить',
        show: 'Показать',
      },
      taskStatuses: {
        name: 'Название',
        errors: {
          nameNotEmpty: 'Статус не может быть пустым',
          nameExists: 'Такой статус уже существует',
        },
        list: {
          caption: 'Статусы задач',
          name: 'Название',
          deleteConfirmation: 'Вы уверены?',
        },
        create: {
          caption: 'Новый статус',
          name: 'Введите статус',
          submit: 'Создать',
        },
        edit: {
          caption: 'Изменить статус',
        },
      },
      session: {
        new: {
          login: 'Вход',
          submit: 'Войти',
        },
      },
      tasks: {
        errors: {
          nameNotEmpty: 'Название задачи не может быть пустым',
          statusNotEmpty: 'Статус задачи не может быть пустым',
          assignedNotEmpty: 'Id исполнителя задачи не может быть пустым',
          creatorNotEmpty: 'Id создателя задачи не может быть пустым',
          nameExist: 'Название задачи должно быть уникально',
        },
        name: 'Название',
        description: 'Описание',
        status: 'Статус',
        creator: 'Создатель',
        assigned: 'Исполнитель',
        tags: 'Тэги',
        createdAt: 'Дата создания',
        showSelfTasks: 'Только мои задачи',
        deleteConfirmation: 'Вы уверены, что хотите удалить задачу?',
        list: {
          caption: 'Задачи',
        },
        edit: {
          caption: 'Редактировать задачу',
        },
        view: {
          caption: 'Просмотр задачи',
          backtolist: 'Обратно к списку задач',
        },
      },
      tags: {
        name: 'Тэг',
        list: {
          caption: 'Список тэгов',
          deleteConfirmation: 'Вы уверены что хотите удалить тэг?',
        },
        edit: {
          caption: 'Редактировать тэг',
        },
        create: {
          caption: 'Создать тэг',
        },
        errors: {
          tagAlreadyExists: 'Тэг с таким значением уже существует',
          tagNotEmpty: 'Значение тэга не может быть пустым',
        },
      },
      users: {
        errors: {
          emailAlreadyExists: 'Пользователь уже зарегистрирован',
          emailNotEmpty: 'Email не может быть пустым',
          emailNotEmail: 'Введите правильный e-mail адрес',
          oldPasswordNotEmpty: 'Текущий пароль не может быть пустым',
          passwordNotEmpty: 'Пароль не может быть пустым',
          passwordConfirmationNotEmpty: 'Подтверждение пароля не может быть пустым',
          passwordConfirmationTheSameAsPassword: 'Подтверждение пароля должно совпадать с паролем',
        },
        firstname: 'Имя',
        lastname: 'Фамилия',
        role: 'Роль',
        confirm: 'Пароль еще раз',
        list: {
          caption: 'Пользователи',
          delete: 'Удалить',
          add: 'Добавить',
          edit: 'Редактировать',
          deleteConfirmation: 'Вы уверены?',
        },
        new: {
          caption: 'Новый пользователь',
          submit: 'Зарегистрировать',
          register: 'Регистрация',
        },
        edit: {
          caption: 'Редактировать',
          updatePassword: 'Изменить пароль',
        },
        changePassword: {
          caption: 'Изменить пароль',
          oldPassword: 'Текущий пароль',
        },
      },
      welcome: {
        about: {
          header: 'Обзор Продукта',
          body: 'TaskMan это просто и понятный менеджер задач, позволяющий пользователям управлять своими ежедневными делами.',
        },
        index: {
          hello: 'TaskMan',
          description: 'Простой и понятный менеджер задач',
          header: 'Вы можете:',
          registerUser: 'Регистрировать нового пользователя',
          loginSystem: 'Входить в систему',
          createTask: 'Создавать новые задачи',
          editTask: 'Редактировать задачу',
          findTask: 'Искать задачу по различным полям',
        },
      },
      error: {
        hello: 'Случилось страшное...',
        body: 'Ошибка:',
      },
    },
    taskStatusValues: {
      new: 'новый',
      inprocess: 'в работе',
      testing: 'на тестировании',
      completed: 'завершен',
    },
  },
};
