function isValidDate(d) {
  return d instanceof Date && !Number.isNaN(d);
}

const getChoice = (ctx) => {
  if (ctx.session.data.choices.find(c => c.id === ctx.message.text)) {
    return ctx.message.text;
  }

  return null;
};

const doctors = ['Терапевт', 'Педиатр', 'Стоматолог', 'Гинеколог'];

export const scenarios = {
  start: [
    ctx => {
      ctx.replyChoices('Чего бы вы хотели?', ['Записаться']);
    },
  ],

  schedule: [
    [
      ctx => {
        ctx.replyChoices('Выберите врача:', doctors);
      },
      repCtx => {
        if (!getChoice(repCtx)) {
          repCtx.replyChoices('К сожалению, не понял вашего ответа. Выберите врача:', repCtx.session.data.choices);
          return false;
        }
      },
    ],
    [
      ctx => {
        ctx.replyDate('Укажите удобную дату');
      },
      repCtx => {
        const date = new Date(repCtx.message.text);
        if (!isValidDate(date)) {
          repCtx.replyDate('Укажите удобную дату');
          return false;
        }
      },
    ],
    [
      ctx => {
        ctx.replyChoices('Найдены такие варианты', [
          'клиника 1 услуга такая-то, тогда-то (платно)',
          'клиника 2 услуга такая-то, тогда-то (бесплатно)',
          'клиника 3 услуга такая-то, тогда-то (ДМС)',
        ]);
      },
      repCtx => {
        const choice = getChoice(repCtx);
        if (!choice) {
          repCtx.replyChoices('К сожалению, не понял вашего ответа. Выберите вариант:', repCtx.session.data.choices);
          return false;
        }
        repCtx.session.data.clinic = choice;
      },
    ],
    [
      ctx => {
        ctx.replyChoices('Доступны для записи следующие даты', [
          '05.05.2019 10:00, 11:00, 12:00',
          '06.05.2019 13:00, 14:00, 15:00',
        ]);
      },
      repCtx => {

        const choice = getChoice(repCtx);
        if (!choice) {
          repCtx.replyChoices('К сожалению, не понял вашего ответа. Выберите дату:', repCtx.session.data.choices);
          return false;
        }
        repCtx.session.data.date = choice;
      },
    ],
    [
      ({ session, ...ctx }) => {
        ctx.replyChoices(`Записать в клинику ${session.data.clinic} на дату ${session.data.date}`, [
          'Да', 'нет',
        ]);
      },
      repCtx => {
        const choice = getChoice(repCtx);
        if (!choice) {
          repCtx.replyChoices('К сожалению, не понял вашего ответа. Выберите:', repCtx.session.data.choices);
          return false;
        }
        if (repCtx.message.text === 'Да') {
          repCtx.reply('Вы записаны, спасибо!');
        } else {
          repCtx.reply('Очень жаль');
        }
      },
    ],

  ],
};
